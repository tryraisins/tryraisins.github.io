// The page-load paper: a crumpled sheet of the notebook that opens and is
// smoothed flat when boot-overlay.ts starts the reveal. Drawn with WebGL2 so the
// wad has real depth, and when the sheet is flat it lines up pixel for pixel
// with the page beneath.
//
// The sheet is never stretched. It is folded by mirroring it across planes,
// and a mirror moves every point of the paper rigidly, so each fold is a sharp
// straight crease between flat pieces that keep their true size:
// - HINGES are creases fixed in the sheet, ringed round its middle. Each one's
//   plane pivots on its crease, which swings the paper beyond it over like a
//   flap on a hinge. Whatever a flap pushes through another plane is folded
//   back again, so the long flaps of the sheet zigzag into a stack.
// - The CAGE is the hand: a dome of planes closed round that stack, which folds
//   back anything that reaches it and so packs the stack into a ball whose
//   ridges lie on the dome. The desk under the paper folds it back the same way.
// Opening runs it in reverse (see STAGES): the hand lets go and the wad springs
// loose, the flaps swing out on their hinges a pair at a time, and a palm
// presses down what is left.
//
// The small creases never change, so their depth and slope are baked once into
// a float texture (on the GPU where it can render floats, otherwise here) and
// each pixel reads its crease from that.
//
// Without hardware WebGL2, or with reduced motion, nothing is mounted and the
// overlay's still simply fades (see BootOverlay.astro).
import { holdBoot } from './boot-overlay';

// Milliseconds. `rest` is the beat the ball sits before it may open, `unfold`
// the whole opening below. Keep `unfold` in step with TIMING.lift in
// boot-overlay.ts.
export const PAPER_TIMING = { rest: 220, unfold: 1600 };

// Milliseconds from the start of the reveal. The stages overlap so the motion
// never stops between them.
const STAGES = {
  grip: [0, 150],       // the ball is squeezed before it is let go
  release: [110, 600],  // the hand opens and the wad springs loose
  open: [320, 860],     // when the flaps start to swing out, first to last
  turn: [200, 1200],    // the sheet turns square to the viewer
  smooth: [1000, 1600],  // a palm sweeps across and presses the creases down
} as const;

const HINGES = 8;
const CAGE = 14;
// How many times the sheet is taken round the hinges and the cage. A long flap
// crosses the wad several times before all of it is tucked inside.
const HINGE_PASSES = 4;
const CAGE_PASSES = 2;
// A flap swinging open is a damped spring: it starts slowly, swings a little
// past where it will rest and settles. Per second.
const SWING = { decay: 6.6, rate: 6.9 };
// Width of the palm's sweep, as a share of the sheet.
const SWEEP_WIDTH = 0.24;

// Crease depth as a share of the ball's radius, and how much of the full
// crease shading shows: balled up, opened out, and smoothed. Paper that has
// been balled up never goes back to neat, so part of every crease stays.
const PAPER_DEPTH = { ball: 0.07, open: 0.14, rest: 0.07 };
// How round a fold is, as a share of the ball's radius.
const FOLD_SOFT = 0.035;
const PAPER_SHADE = { open: 0.45, rest: 0.28 };

// Facet layers, coarse to fine. Each is a field of cells whose centres rise or
// sink into flat-sided pyramids, so the sheet breaks into planar facets with
// straight ridges that end where they meet others. `cell` is in px at
// 1440x900, `cap` how far a facet climbs (share of the cell) before it levels
// off, `stretch` how elongated the cells are along the layer's random angle.
const LAYERS = [
  { cell: 210, cap: 0.15, stretch: 1.45, amp: 1.3 },
  { cell: 92, cap: 0.17, stretch: 1.25, amp: 0.7 },
  { cell: 38, cap: 0.2, stretch: 1.1, amp: 0.25 },
];
const LAYER_COUNT = LAYERS.length;
// Crease height per px of facet rise, at 1440x900.
const CREASE_NORM = 95;
// Sheet pixels per crease texel: fine when the GPU bakes it, coarser when it
// has to be worked out here.
const CREASE_CELL = { gpu: 1.5, cpu: 4 };

const NOISE_GLSL = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}`;

// Bakes crease depth and slope for every texel of the sheet. In each layer the
// distance to the nearest cell border gives a pyramid per cell; it is levelled
// off near the top, flipped for about half the cells so ridges meet valleys,
// and summed across layers. Alpha holds the depth without the coarse layer:
// its facets are nearly as wide as the ball, so the ball's shape uses only the
// finer ones and the coarse facets show in the light alone.
const BAKE_VERT = `#version 300 es
in vec2 aQuad;
uniform vec2 uHalf;
out vec2 vP;
void main() {
  vP = aQuad * uHalf;
  gl_Position = vec4(aQuad, 0.0, 1.0);
}`;

const BAKE_FRAG = `#version 300 es
precision highp float;
in vec2 vP;
uniform vec4 uLayer[${LAYER_COUNT}];    // cos, sin, cell (px), stretch
uniform vec2 uLayerAmp[${LAYER_COUNT}]; // strength, cap
uniform float uNorm;
uniform float uSeed;
out vec4 outColor;
${NOISE_GLSL}
vec2 point(vec2 c) { return 0.12 + 0.76 * vec2(hash(c), hash(c + vec2(17.3, 41.9))); }
void main() {
  float h = 0.0, fine = 0.0;
  vec2 grad = vec2(0.0);
  for (int l = 0; l < ${LAYER_COUNT}; l++) {
    vec4 L = uLayer[l];
    vec2 r = vec2(L.x * vP.x + L.y * vP.y, -L.y * vP.x + L.x * vP.y);
    vec2 q = vec2(r.x, r.y * L.w) / L.z;
    vec2 off = vec2(uSeed + float(l) * 13.7, float(l) * 29.1);
    vec2 g = floor(q), f = q - g;
    float best = 8.0;
    vec2 mg = vec2(0.0), mr = vec2(0.0);
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 b = vec2(float(i), float(j));
      vec2 rr = b + point(g + b + off) - f;
      float d = dot(rr, rr);
      if (d < best) { best = d; mr = rr; mg = b; }
    }
    float e = 8.0;
    vec2 en = vec2(1.0, 0.0);
    for (int j = -2; j <= 2; j++) for (int i = -2; i <= 2; i++) {
      vec2 b = mg + vec2(float(i), float(j));
      vec2 rr = b + point(g + b + off) - f;
      vec2 dd = rr - mr;
      if (dot(dd, dd) > 1e-5) {
        vec2 nd = normalize(dd);
        float d = dot(0.5 * (mr + rr), nd);
        if (d < e) { e = d; en = nd; }
      }
    }
    vec2 id = g + mg + off;
    float a = uLayerAmp[l].x * (hash(id + vec2(5.1, 9.7)) < 0.5 ? -1.0 : 1.0) * (0.45 + 0.75 * hash(id + vec2(2.3, 7.9)));
    float cap = uLayerAmp[l].y, k = cap * 0.35;
    float t = clamp(0.5 + 0.5 * (cap - e) / k, 0.0, 1.0);
    float m = mix(cap, e, t) - k * t * (1.0 - t);
    h += a * m * L.z / uNorm;
    if (l > 0) fine += a * m * L.z / uNorm;
    vec2 gq = -en * a * t / uNorm;
    gq.y *= L.w;
    grad += vec2(L.x * gq.x - L.y * gq.y, L.y * gq.x + L.x * gq.y);
  }
  outColor = vec4(h, grad, fine);
}`;

const VERT = `#version 300 es
in vec2 aP;             // flat position (px from the centre, y up)
uniform sampler2D uCrease;
uniform float uU;       // 0 = balled up, 1 = open (but still crumpled)
uniform float uSweep;   // how far the smoothing palm has crossed the sheet
uniform vec2 uSweepDir;
uniform float uR;       // radius of the ball (px)
uniform vec2 uHalf;     // half the sheet size (px)
uniform vec4 uHinge[${HINGES}]; // fold planes: unit normal, offset
uniform float uHingeSoft[${HINGES}];
uniform vec4 uCage[${CAGE}];
uniform float uCageSoft;
uniform vec4 uCore;     // middle of the wad, and its radius
uniform float uDeep;    // how much shade the inside of the wad holds
uniform mat3 uRot;
uniform vec3 uPivot;
uniform vec3 uScale;
uniform mat4 uMvp;
out vec2 vUv;
out vec2 vCuv;
out vec3 vPos;
out vec3 vNrm;
out vec3 vTx;
out vec3 vTy;
out float vA;
out float vCrumple;
out float vDeep;

// Folds whatever lies beyond the plane back across it. The sheet's two
// tangents are mirrored with it, so every piece carries its exact normal.
// Within \`soft\` px of the plane the fold is rounded, as paper is where it has
// been bent and not pressed; at zero the crease is sharp and a sheet lying in
// the plane is left exactly alone.
void fold(vec4 plane, float soft, inout vec3 p, inout vec3 tx, inout vec3 ty) {
  float s = dot(p, plane.xyz) - plane.w;
  if (s <= -soft) return;
  float over = s, turn = 1.0;
  if (s < soft) {
    turn = (s + soft) / (2.0 * soft);
    over = soft * turn * turn;
  }
  p -= 2.0 * over * plane.xyz;
  tx -= 2.0 * turn * dot(tx, plane.xyz) * plane.xyz;
  ty -= 2.0 * turn * dot(ty, plane.xyz) * plane.xyz;
}

// How far the smoothing palm has pressed this part of the sheet.
float smoothedAt(vec2 p) {
  vec2 n = p / uHalf;
  float s = 0.5 + 0.5 * dot(n, uSweepDir) / (abs(uSweepDir.x) + abs(uSweepDir.y));
  float front = mix(-${SWEEP_WIDTH}, 1.0 + ${SWEEP_WIDTH}, uSweep);
  return 1.0 - smoothstep(front - ${SWEEP_WIDTH}, front + ${SWEEP_WIDTH}, s);
}

void main() {
  vec3 p = vec3(aP, 0.0), tx = vec3(1.0, 0.0, 0.0), ty = vec3(0.0, 1.0, 0.0);
  for (int i = 0; i < ${HINGE_PASSES}; i++)
    for (int k = 0; k < ${HINGES}; k++) fold(uHinge[k], uHingeSoft[k], p, tx, ty);
  for (int i = 0; i < ${CAGE_PASSES}; i++) {
    for (int k = 0; k < ${CAGE}; k++) fold(uCage[k], uCageSoft, p, tx, ty);
    // The desk.
    if (p.z < 0.0) { p.z = -p.z; tx.z = -tx.z; ty.z = -ty.z; }
  }
  vec3 nrm = normalize(cross(tx, ty));

  vCuv = 0.5 + aP / (2.0 * uHalf);
  float sm = smoothedAt(aP);
  float depth = mix(mix(${PAPER_DEPTH.open}, ${PAPER_DEPTH.ball}, pow(1.0 - uU, 1.25)), ${PAPER_DEPTH.rest}, sm);
  vA = uR * depth;
  vCrumple = mix(max(1.0 - uU, ${PAPER_SHADE.open}), ${PAPER_SHADE.rest}, sm);
  vDeep = uDeep * (1.0 - smoothstep(0.5, 1.05, length(p - uCore.xyz) / uCore.w));
  vec4 crease = textureLod(uCrease, vCuv, 0.0);
  float h = mix(crease.x, crease.w * 1.7, pow(1.0 - uU, 1.5));
  vec3 pos = uRot * ((p + nrm * h * vA - uPivot) * uScale) + uPivot;

  vUv = vec2(vCuv.x, 1.0 - vCuv.y);
  vPos = pos;
  vNrm = uRot * nrm;
  vTx = uRot * tx;
  vTy = uRot * ty;
  gl_Position = uMvp * vec4(pos, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vCuv;
in vec3 vPos;
in vec3 vNrm;
in vec3 vTx;
in vec3 vTy;
in float vA;
in float vCrumple;
in float vDeep;
uniform sampler2D uTex;
uniform sampler2D uCrease;
uniform vec3 uEye;
uniform vec3 uLight;
out vec4 outColor;

void main() {
  vec3 v = normalize(uEye - vPos);
  vec3 nb = normalize(vNrm);
  vec3 crease = texture(uCrease, vCuv).xyz;
  vec3 n = normalize(cross(vTx + nb * crease.y * vA, vTy + nb * crease.z * vA));
  bool under = dot(nb, v) < 0.0;
  if (dot(n, v) < 0.0) n = -n;
  vec3 ink = texture(uTex, vUv).rgb;
  // The underside has no ink of its own, but the rules show faintly through.
  vec3 paper = under ? mix(vec3(0.9, 0.893, 0.857), ink, 0.2) : ink;
  float k = vCrumple;
  // Neutral (exactly 1.0) for a flat sheet facing the viewer.
  float lit = dot(n, uLight) - uLight.z;
  // Paper is matte and passes light on, so a facet turned away from the
  // light dims gently instead of going black.
  // Turned towards it, white paper has almost nowhere brighter to go.
  lit /= 1.0 + (lit < 0.0 ? -2.4 : 16.0) * lit;
  float shade = 1.0 + lit * (0.9 + 0.45 * k);
  // Valleys between creases sit in shadow, ridges catch a little more light,
  // and the rim of the ball turns away into shade.
  shade *= 1.0 - 0.38 * k * smoothstep(0.02, -0.45, crease.x);
  shade *= 1.0 + 0.05 * k * smoothstep(0.05, 0.45, crease.x);
  shade *= 1.0 - 0.32 * k * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.0);
  // The back of the sheet gets a little less light, and paper deep inside
  // the wad sits in the shade of the folds round it.
  if (under) shade *= 0.88;
  shade *= 1.0 - 0.45 * vDeep;
  // Paper has a faint sheen where a facet tips towards the light.
  float sheen = pow(max(dot(n, normalize(uLight + v)), 0.0), 28.0) * 0.08 * k;
  outColor = vec4(paper * clamp(shade, 0.3, 1.12) + sheen, 1.0);
}`;

type Layer = { cos: number; sin: number; cell: number; stretch: number; amp: number; cap: number };
// A crease fixed in the sheet: it runs square to (mx, my), `reach` px from the
// centre. `shut` and `ajar` are its fold angle balled up and opened out,
// `at` when it starts to open (ms) and `press` where the palm's sweep meets it.
type Hinge = { mx: number; my: number; reach: number; shut: number; ajar: number; at: number; press: number };
// One face of the hand round the wad: its normal, how far it sits from the
// middle of the wad, and how long after the release it lets go (ms).
type CageFace = { n: [number, number, number]; reach: number; at: number };
// `folds` are the hinge angles, `cage` how far each face of the hand has moved
// out (px), `deep` how much shade the inside of the wad holds.
type Pose = { open: number; sweep: number; deep: number; folds: number[]; cage: number[]; scale: [number, number, number]; rot: [number, number, number] };

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
// Overshoots a little before it lands, like paper springing loose.
const easeOutBack = (t: number) => 1 + 2.4 * Math.pow(t - 1, 3) + 1.4 * Math.pow(t - 1, 2);
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
// 0 to 1 as a damped spring, `dt` seconds after it is let go.
const swing = (dt: number) =>
  dt <= 0 ? 0 : 1 - Math.exp(-SWING.decay * dt) * (Math.cos(SWING.rate * dt) + (SWING.decay / SWING.rate) * Math.sin(SWING.rate * dt));
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const stage = (ms: number, [from, to]: readonly [number, number]) => clamp01((ms - from) / (to - from));

// Small seeded generator, so a dev seed reproduces one exact ball.
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The same crease field as BAKE_FRAG, for GPUs that cannot render to floats.
const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
function bakeOnCpu(layers: Layer[], norm: number, seed: number, cols: number, rows: number, width: number, height: number): Float32Array {
  const out = new Float32Array(cols * rows * 4);
  const px = (cx: number, cy: number) => 0.12 + 0.76 * hash(cx, cy);
  const py = (cx: number, cy: number) => 0.12 + 0.76 * hash(cx + 17.3, cy + 41.9);
  for (let j = 0, k = 0; j < rows; j++) {
    const y = ((j + 0.5) / rows - 0.5) * height;
    for (let i = 0; i < cols; i++, k += 4) {
      const x = ((i + 0.5) / cols - 0.5) * width;
      let h = 0, hx = 0, hy = 0, fine = 0;
      layers.forEach((L, l) => {
        const qx = (L.cos * x + L.sin * y) / L.cell;
        const qy = ((-L.sin * x + L.cos * y) * L.stretch) / L.cell;
        const ox = seed + l * 13.7, oy = l * 29.1;
        const gx = Math.floor(qx), gy = Math.floor(qy);
        const fx = qx - gx, fy = qy - gy;
        let best = 8, mgx = 0, mgy = 0, mrx = 0, mry = 0;
        for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) {
          const cx = gx + a + ox, cy = gy + b + oy;
          const rx = a + px(cx, cy) - fx, ry = b + py(cx, cy) - fy;
          const d = rx * rx + ry * ry;
          if (d < best) { best = d; mrx = rx; mry = ry; mgx = a; mgy = b; }
        }
        let e = 8, enx = 1, eny = 0;
        for (let b = -2; b <= 2; b++) for (let a = -2; a <= 2; a++) {
          const bx = mgx + a, by = mgy + b;
          const cx = gx + bx + ox, cy = gy + by + oy;
          const rx = bx + px(cx, cy) - fx, ry = by + py(cx, cy) - fy;
          const dx = rx - mrx, dy = ry - mry;
          const dl = Math.hypot(dx, dy);
          if (dl * dl > 1e-5) {
            const d = (0.5 * (mrx + rx) * dx + 0.5 * (mry + ry) * dy) / dl;
            if (d < e) { e = d; enx = dx / dl; eny = dy / dl; }
          }
        }
        const idx = gx + mgx + ox, idy = gy + mgy + oy;
        const amp = L.amp * (hash(idx + 5.1, idy + 9.7) < 0.5 ? -1 : 1) * (0.45 + 0.75 * hash(idx + 2.3, idy + 7.9));
        const kk = L.cap * 0.35;
        const t = clamp01(0.5 + (0.5 * (L.cap - e)) / kk);
        const m = L.cap + (e - L.cap) * t - kk * t * (1 - t);
        h += (amp * m * L.cell) / norm;
        if (l > 0) fine += (amp * m * L.cell) / norm;
        const gqx = (-enx * amp * t) / norm;
        const gqy = ((-eny * amp * t) / norm) * L.stretch;
        hx += L.cos * gqx - L.sin * gqy;
        hy += L.sin * gqx + L.cos * gqy;
      });
      out[k] = h;
      out[k + 1] = hx;
      out[k + 2] = hy;
      out[k + 3] = fine;
    }
  }
  return out;
}

// Same ruled paper as the page: off-white, faint grain, a blue rule at the foot
// of every 36px line and the double red margin.
function paperTexture(width: number, height: number, scale: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext('2d')!;
  ctx.scale(scale, scale);
  ctx.fillStyle = '#f8f7f1';
  ctx.fillRect(0, 0, width, height);

  const grain = document.createElement('canvas');
  grain.width = grain.height = 128;
  const g = grain.getContext('2d')!;
  const img = g.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const k = Math.random() * 60;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = k;
    img.data[i + 3] = Math.random() * 16;
  }
  g.putImageData(img, 0, 0);
  ctx.fillStyle = ctx.createPattern(grain, 'repeat')!;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(52,110,204,.5)';
  for (let y = 35; y < height; y += 36) ctx.fillRect(0, y, width, 1);

  const margin = width <= 620 ? 28 : Math.max(Math.min(Math.max(32, width * 0.06), 96), (width - 1280) / 2);
  ctx.fillStyle = 'rgba(214,62,56,.55)';
  ctx.fillRect(margin - 6, 0, 1.5, height);
  ctx.fillRect(margin - 1.5, 0, 1.5, height);
  return canvas;
}


// Starts compiling and linking without waiting on the result, so a driver that
// compiles in parallel (KHR_parallel_shader_compile) never blocks the page.
function startProgram(gl: WebGL2RenderingContext, vert: string, frag: string): WebGLProgram | null {
  const program = gl.createProgram();
  if (!program) return null;
  for (const [type, source] of [[gl.VERTEX_SHADER, vert], [gl.FRAGMENT_SHADER, frag]] as const) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  return program;
}

function linked(gl: WebGL2RenderingContext, program: WebGLProgram): boolean {
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return true;
  console.warn('paper-ball:', gl.getProgramInfoLog(program));
  return false;
}

// Rotation about x, then y, then z, as a column-major mat3.
function rotation(rx: number, ry: number, rz: number): Float32Array {
  const [cx, sx, cy, sy, cz, sz] = [Math.cos(rx), Math.sin(rx), Math.cos(ry), Math.sin(ry), Math.cos(rz), Math.sin(rz)];
  return new Float32Array([
    cy * cz, cy * sz, -sy,
    sx * sy * cz - cx * sz, sx * sy * sz + cx * cz, sx * cy,
    cx * sy * cz + sx * sz, cx * sy * sz - sx * cz, cx * cy,
  ]);
}

// Mounts the crumpled ball. An embedded still remains visible while shaders
// compile and is used as the fallback if WebGL cannot run smoothly.
export function mountPaperBall(): void {
  const root = document.documentElement;
  const overlay = document.getElementById('boot-overlay');
  if (!overlay || root.dataset.boot !== 'pending') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Dev only: ?paper-seed=N draws one exact ball, and ?paper-scrub hands the
  // clock to window.__paperBall so scripts/check-paper-ball.mjs can step it.
  const params = import.meta.env.DEV ? new URLSearchParams(location.search) : null;
  const seedParam = Number(params?.get('paper-seed'));
  const scrub = !!params?.has('paper-scrub');
  const rng = random(Number.isFinite(seedParam) && seedParam > 0 ? seedParam : (Math.random() * 2 ** 32) >>> 0);

  const width = root.clientWidth || innerWidth;
  const height = root.clientHeight || innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  canvas.className = 'boot-ball';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  // A software renderer cannot hold this at frame rate and starves the page
  // beneath, so it is refused and the crumpled still is used instead.
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: true });
  if (!gl) return;
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)) return;

  const parallel = gl.getExtension('KHR_parallel_shader_compile');
  const program = startProgram(gl, VERT, FRAG);
  const bake = gl.getExtension('EXT_color_buffer_float') ? startProgram(gl, BAKE_VERT, BAKE_FRAG) : null;
  if (!program) return;

  // The ball is about a third of the short side across.
  const radius = Math.min(width, height) * 0.17 + 40;

  // Facet size follows the sheet's size (tuned at 1440x900), so a phone's
  // smaller sheet is as crumpled as a desktop's. Each layer runs at its own
  // random angle, so no direction dominates.
  const sheetScale = Math.sqrt(width * height) / 1138;
  const layers: Layer[] = LAYERS.map((l) => {
    const angle = rng() * Math.PI;
    return { cos: Math.cos(angle), sin: Math.sin(angle), cell: l.cell * sheetScale, stretch: l.stretch, amp: l.amp, cap: l.cap };
  });
  const norm = CREASE_NORM * sheetScale;
  const shaderSeed = Math.floor(rng() * 90) + 3;

  // Mesh: about 4.5px cells, so a fold crossing them at any angle stays a
  // clean line. The small creases come from the crease texture.
  const cell = Math.max(4.5, Math.sqrt((width * height) / 90000));
  const cols = Math.max(60, Math.round(width / cell));
  const rows = Math.max(60, Math.round(height / cell));
  const verts = new Float32Array((cols + 1) * (rows + 1) * 2);
  for (let j = 0, k = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      verts[k++] = (i / cols - 0.5) * width;
      verts[k++] = (0.5 - j / rows) * height;
    }
  }
  const index = new Uint32Array(cols * rows * 6);
  for (let j = 0, k = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++, k += 6) {
      const a = j * (cols + 1) + i, b = a + 1, c = a + cols + 1, d = c + 1;
      index.set([a, c, b, b, c, d], k);
    }
  }
  const meshBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index, gl.STATIC_DRAW);

  const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
  const texScale = Math.min(dpr, maxTex / Math.max(width, height));
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, paperTexture(width, height, texScale));
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const shadow = document.createElement('div');
  shadow.className = 'boot-ball-shadow';
  shadow.setAttribute('aria-hidden', 'true');
  shadow.style.setProperty('--ball', `${radius * 2}px`);
  overlay.append(shadow, canvas);
  overlay.dataset.paper = 'loading';

  // A random lean for this load, so the ball never lands the same way twice,
  // and the direction the smoothing palm travels.
  const lean = { x: 0.16 + rng() * 0.08, y: -0.2 + rng() * 0.1, z: -(0.5 + rng() * 0.5) };
  const sweepAngle = rng() * Math.PI * 2;
  const sweepDir = [Math.cos(sweepAngle), Math.sin(sweepAngle)];
  // Where the palm's sweep meets a point of the sheet, as smoothedAt in VERT.
  const pressAt = (x: number, y: number) =>
    clamp01(0.5 + (0.5 * ((x / (width / 2)) * sweepDir[0] + (y / (height / 2)) * sweepDir[1])) / (Math.abs(sweepDir[0]) + Math.abs(sweepDir[1])));

  // The hinges ring the middle of the sheet, unevenly. Those across the long
  // side of the sheet open first, as two hands pulling it apart would, and
  // they are folded last so their flaps lie on top of the others.
  const wide = width >= height;
  const turn0 = rng() * Math.PI * 2;
  const hinges: Hinge[] = Array.from({ length: HINGES }, (_, k) => {
    const a = turn0 + ((k + (rng() - 0.5) * 0.6) * Math.PI * 2) / HINGES;
    const mx = Math.cos(a), my = Math.sin(a);
    const reach = radius * (0.45 + rng() * 0.3);
    const across = Math.abs(wide ? mx : my);
    return {
      mx, my, reach,
      // The flaps folded last lie flattest, so they close the top of the wad.
      shut: Math.PI - (0.3 + (1 - across) * 0.5 + rng() * 0.3),
      ajar: 0.16 + rng() * 0.16,
      at: STAGES.open[0] + (1 - across) * (STAGES.open[1] - STAGES.open[0]) * 0.8 + rng() * (STAGES.open[1] - STAGES.open[0]) * 0.2,
      press: pressAt(mx * reach, my * reach),
    };
  }).sort((a, b) => b.at - a.at);

  // The hand: one face over the top, a ring of five round the shoulders and
  // a ring of eight round the sides, all a little out of true. Its middle sits low, so the
  // ball rests on the desk on a flat foot.
  const core: [number, number, number] = [0, 0, radius * 0.35];
  const cage: CageFace[] = Array.from({ length: CAGE }, (_, j) => {
    const ring = j === 0 ? 0 : j < 6 ? 1 : 2;
    const rise = ring === 0 ? 1.3 + rng() * 0.25 : ring === 1 ? 0.8 + rng() * 0.3 : 0.1 + rng() * 0.35;
    const round = ring === 1 ? (j - 1 + rng() * 0.5) / 5 : (j - 6 + rng() * 0.5) / 8;
    const a = turn0 + 0.4 + round * Math.PI * 2;
    return {
      n: [Math.cos(rise) * Math.cos(a), Math.cos(rise) * Math.sin(a), Math.sin(rise)],
      reach: radius * (0.86 + rng() * 0.18),
      at: rng() * 110,
    };
  });

  // While it waits, the scrunched paper relaxes in small jumps: each one
  // nudges the ball round and lets one side of it creep out, with a quick
  // settle.
  const twitches: { at: number; rx: number; ry: number; rz: number; face: number; creep: number }[] = [];
  for (let at = 0.18 + rng() * 0.2; at < 9; at += 0.28 + rng() * 0.55) {
    const size = 0.4 + rng() * 0.6;
    twitches.push({ at, rx: (rng() - 0.5) * 0.05 * size, ry: (rng() - 0.5) * 0.06 * size, rz: (rng() - 0.5) * 0.05 * size, face: Math.floor(rng() * CAGE), creep: radius * 0.035 * size });
  }
  const settle = (dt: number) => (dt <= 0 ? 0 : 1 - Math.exp(-dt * 16) * Math.cos(dt * 24));

  const idlePose = (t: number): Pose => {
    let rx = 0, ry = 0, rz = 0;
    const out = cage.map(() => 0);
    for (const tw of twitches) {
      if (tw.at > t) break;
      const s = settle(t - tw.at);
      rx += tw.rx * s; ry += tw.ry * s; rz += tw.rz * s;
      out[tw.face] = Math.min(out[tw.face] + tw.creep * s, radius * 0.09);
    }
    return { open: 0, sweep: 0, deep: 1, folds: hinges.map((h) => h.shut), cage: out, scale: [1, 1, 1], rot: [lean.x + rx, lean.y + ry, lean.z + rz] };
  };

  // `ms` since the reveal started, layered over how the ball sat at `t`.
  const releaseMs = STAGES.release[1] - STAGES.release[0];
  const openPose = (ms: number, t: number): Pose => {
    const idle = idlePose(t);
    const grip = easeOut(stage(ms, STAGES.grip));
    const sweep = easeInOut(stage(ms, STAGES.smooth));
    const front = -SWEEP_WIDTH + (1 + 2 * SWEEP_WIDTH) * sweep;

    // The hand: each face eases off, then is gone.
    let letGo = 0;
    const out = cage.map((face, j) => {
      const r = clamp01((ms - STAGES.release[0] - face.at) / releaseMs);
      letGo += r / CAGE;
      return r >= 1 ? 1e7 : idle.cage[j] + radius * (0.28 * easeOutBack(Math.min(1, r * 2.2)) + 9 * r * r * r);
    });

    // The flaps: each swings from shut to ajar, and the palm presses it flat
    // when the sweep reaches its crease.
    let swung = 0;
    const folds = hinges.map((h) => {
      const s = swing((ms - h.at) / 1000);
      swung += clamp01(s) / HINGES;
      const pressed = smoothstep(front - SWEEP_WIDTH, front + SWEEP_WIDTH, h.press);
      return Math.max(0, h.ajar + (h.shut - h.ajar) * (1 - s)) * pressed;
    });

    const open = clamp01(0.12 * letGo + 0.88 * swung);
    const wad = 1 - open;
    const squeeze = grip * (1 - easeOut(stage(ms, STAGES.release)));
    const sx = 1 - 0.07 * squeeze * wad;
    const turn = 1 - easeInOut(stage(ms, STAGES.turn));
    return {
      open, sweep, folds, cage: out,
      deep: 1 - swung,
      scale: [sx, sx, 1 - 0.04 * squeeze * wad],
      rot: [idle.rot[0] * turn, idle.rot[1] * turn, (idle.rot[2] - 0.08 * squeeze) * turn],
    };
  };

  const mountedAt = performance.now();
  let start = 0;
  let unfoldAt = 0;
  let revealIdle = 0;
  let done = false;
  let last = 0;
  const gaps: number[] = [];
  let release: () => void = () => {};
  // Let the ball sit for a beat before it opens.
  holdBoot(new Promise<void>((resolve) => { release = resolve; }));

  // Hands the overlay back to the crumpled still. boot-overlay.ts reads
  // data-paper when the reveal starts, and listens for paper:flat once it has.
  const bail = () => {
    done = true;
    canvas.remove();
    shadow.remove();
    delete overlay.dataset.paper;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    release();
    document.dispatchEvent(new CustomEvent('paper:flat'));
  };

  let uU: WebGLUniformLocation | null = null;
  let uSweep: WebGLUniformLocation | null = null;
  let uHinge: WebGLUniformLocation | null = null;
  let uCage: WebGLUniformLocation | null = null;
  let uCore: WebGLUniformLocation | null = null;
  let uDeep: WebGLUniformLocation | null = null;
  let uHingeSoft: WebGLUniformLocation | null = null;
  let uCageSoft: WebGLUniformLocation | null = null;
  const hingeSoft = new Float32Array(HINGES);
  const hingePlanes = new Float32Array(HINGES * 4);
  const cagePlanes = new Float32Array(CAGE * 4);
  let uRot: WebGLUniformLocation | null = null;
  let uPivot: WebGLUniformLocation | null = null;
  let uScale: WebGLUniformLocation | null = null;

  const draw = (pose: Pose) => {
    const wad = clamp01(1 - pose.open);
    // A hinge's plane halves the angle between the sheet and its flap, and
    // passes through its crease. Opened flat it lies in the sheet and folds
    // nothing.
    hinges.forEach((h, k) => {
      const tilt = (Math.PI - pose.folds[k]) / 2;
      hingePlanes.set([h.mx * Math.cos(tilt), h.my * Math.cos(tilt), -Math.sin(tilt), h.reach * Math.cos(tilt)], k * 4);
      // A fold loses its roundness as it is opened and pressed.
      hingeSoft[k] = radius * FOLD_SOFT * Math.min(1, pose.folds[k] / 0.6);
    });
    gl.uniform1fv(uHingeSoft, hingeSoft);
    gl.uniform1f(uCageSoft, radius * FOLD_SOFT);
    let slack = 0;
    cage.forEach((face, j) => {
      const [x, y, z] = face.n;
      cagePlanes.set([x, y, z, x * core[0] + y * core[1] + z * core[2] + face.reach + pose.cage[j]], j * 4);
      slack += Math.min(pose.cage[j], radius * 0.5) / CAGE;
    });
    gl.uniform4fv(uHinge, hingePlanes);
    gl.uniform4fv(uCage, cagePlanes);
    gl.uniform4f(uCore, core[0], core[1], core[2], radius + slack);
    gl.uniform1f(uDeep, pose.deep);
    gl.uniform1f(uU, Math.min(pose.open, 1));
    gl.uniform1f(uSweep, pose.sweep);
    gl.uniformMatrix3fv(uRot, false, rotation(...pose.rot));
    gl.uniform3f(uPivot, 0, 0, core[2] * wad);
    gl.uniform3f(uScale, ...pose.scale);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_INT, 0);
    shadow.style.opacity = String(Math.pow(wad, 1.5) * 0.9);
    shadow.style.transform = `translate(-50%, -50%) translate(${pose.rot[2] * radius * 0.12}px, 0) scale(${pose.scale[0] * (1 + (1 - wad) * 3)})`;
  };

  const frame = (now: number) => {
    if (done || !canvas.isConnected) {
      done = true;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return;
    }
    // Time the hold from the first animated frame.
    if (!start) {
      start = now;
      last = now;
      setTimeout(release, PAPER_TIMING.rest);
    } else if (gaps.length < 12) {
      // A machine that cannot draw the ball smoothly gets the still
      // instead of a stuttering ball and a page starved behind it.
      gaps.push(now - last);
      last = now;
      if (gaps.length === 12 && [...gaps].sort((a, b) => a - b)[6] > 45) {
        bail();
        return;
      }
    }
    const t = (now - mountedAt) / 1000;
    if (unfoldAt) {
      const ms = now - unfoldAt;
      draw(openPose(ms, revealIdle));
      if (ms >= PAPER_TIMING.unfold) {
        done = true;
        overlay.dataset.paper = 'flat';
        document.dispatchEvent(new CustomEvent('paper:flat'));
        return;
      }
    } else {
      draw(idlePose(t));
    }
    requestAnimationFrame(frame);
  };

  // Everything that needs the compiled programs: the crease bake, uniforms
  // and the first crumpled frame.
  const begin = () => {
    if (!linked(gl, program)) {
      bail();
      return;
    }

    // Crease texture, bottom row first (y up, like the sheet).
    let cCols = Math.ceil(width / CREASE_CELL.gpu);
    let cRows = Math.ceil(height / CREASE_CELL.gpu);
    const creaseTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, creaseTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, cCols, cRows, 0, gl.RGBA, gl.FLOAT, null);
    let baked = false;
    if (bake && linked(gl, bake)) {
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, creaseTex, 0);
      if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE) {
        gl.useProgram(bake);
        const quad = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(bake, 'aQuad');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const bu = (name: string) => gl.getUniformLocation(bake, name);
        gl.uniform2f(bu('uHalf'), width / 2, height / 2);
        gl.uniform4fv(bu('uLayer'), layers.flatMap((l) => [l.cos, l.sin, l.cell, l.stretch]));
        gl.uniform2fv(bu('uLayerAmp'), layers.flatMap((l) => [l.amp, l.cap]));
        gl.uniform1f(bu('uNorm'), norm);
        gl.uniform1f(bu('uSeed'), shaderSeed);
        gl.viewport(0, 0, cCols, cRows);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disableVertexAttribArray(loc);
        gl.deleteBuffer(quad);
        baked = true;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
    }
    if (!baked) {
      cCols = Math.ceil(width / CREASE_CELL.cpu);
      cRows = Math.ceil(height / CREASE_CELL.cpu);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, cCols, cRows, 0, gl.RGBA, gl.FLOAT, bakeOnCpu(layers, norm, shaderSeed, cCols, cRows, width, height));
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffer);
    const aP = gl.getAttribLocation(program, 'aP');
    gl.enableVertexAttribArray(aP);
    gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);

    // Camera: the z = 0 plane fills the viewport exactly, so the flat sheet is the page.
    const fov = (30 * Math.PI) / 180;
    const dist = height / 2 / Math.tan(fov / 2);
    const near = 20, far = dist + 4000;
    const f = 1 / Math.tan(fov / 2);
    const mvp = new Float32Array([
      f / (width / height), 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) / (near - far), -1,
      0, 0, (2 * far * near) / (near - far) - dist * ((far + near) / (near - far)), dist,
    ]);

    const u = (name: string) => gl.getUniformLocation(program, name);
    gl.uniform2f(u('uHalf'), width / 2, height / 2);
    gl.uniform1f(u('uR'), radius);
    gl.uniform2f(u('uSweepDir'), sweepDir[0], sweepDir[1]);
    gl.uniformMatrix4fv(u('uMvp'), false, mvp);
    gl.uniform3f(u('uEye'), 0, 0, dist);
    const light = [-0.42, 0.55, 0.72];
    const ll = Math.hypot(...light);
    gl.uniform3f(u('uLight'), light[0] / ll, light[1] / ll, light[2] / ll);
    gl.uniform1i(u('uTex'), 0);
    gl.uniform1i(u('uCrease'), 1);
    uU = u('uU');
    uHinge = u('uHinge');
    uCage = u('uCage');
    uHingeSoft = u('uHingeSoft');
    uCageSoft = u('uCageSoft');
    uCore = u('uCore');
    uDeep = u('uDeep');
    uSweep = u('uSweep');
    uRot = u('uRot');
    uPivot = u('uPivot');
    uScale = u('uScale');

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    // Draw the crumpled first frame before replacing the embedded still.
    draw(idlePose(0));
    overlay.dataset.paper = 'ball';
    if (scrub) {
      // Out of reach of boot-overlay.ts, which removes the overlay by id.
      overlay.id = 'boot-overlay-scrub';
      (window as unknown as { __paperBall: unknown }).__paperBall = {
        unfold: PAPER_TIMING.unfold,
        stages: STAGES,
        // Draws the ball `idle` seconds into its wait, or `ms` into the reveal.
        pose: (idle: number, ms?: number) => draw(ms === undefined ? idlePose(idle) : openPose(ms, idle)),
      };
      return;
    }
    requestAnimationFrame(frame);
  };

  const ready = () =>
    !parallel ||
    (gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR) &&
      (!bake || gl.getProgramParameter(bake, parallel.COMPLETION_STATUS_KHR)));
  const waitForGpu = (now: number) => {
    if (done || overlay.dataset.paper !== 'loading') return;
    if (ready()) begin();
    else if (now - mountedAt > 1500) bail();
    else requestAnimationFrame(waitForGpu);
  };
  requestAnimationFrame(waitForGpu);

  document.addEventListener('boot:reveal', () => {
    // Still compiling when the page is ready: keep the still.
    if (overlay.dataset.paper === 'loading') {
      bail();
      return;
    }
    if (scrub) return;
    revealIdle = (performance.now() - mountedAt) / 1000;
    unfoldAt = performance.now();
  }, { once: true });
}
