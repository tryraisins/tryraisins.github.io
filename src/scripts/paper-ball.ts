// The page-load paper: a full-screen sheet of the notebook that is scrunched
// into a ball while the page loads, then opened up and smoothed flat when
// boot-overlay.ts starts the reveal. Drawn with WebGL2 so the ball has real
// depth: the sheet is a grid wrapped onto a sphere and creased by families of
// fold lines, lit per pixel so every facet catches the light. When the sheet is
// flat it lines up pixel for pixel with the page beneath.
//
// The creases never change, so their depth and slope are baked once into a
// small float texture (on the GPU where it can render floats, otherwise here).
// The mesh only carries the silhouette, and each pixel reads its crease from
// the texture, so creases stay sharp without following the triangles.
//
// Without hardware WebGL2, or with reduced motion, nothing is mounted and the
// overlay's CSS paper simply fades (see BootOverlay.astro).
import { holdBoot } from './boot-overlay';

// Milliseconds. `crumple` is the scrunch into a ball, `rest` the beat the ball
// sits before it may open, `unfold` the opening and smoothing. Keep `unfold` in
// step with TIMING.lift in boot-overlay.ts.
export const PAPER_TIMING = { crumple: 650, rest: 220, unfold: 1150 };

// What the creases leave behind on the smoothed-out sheet: `depth` as a share
// of the ball's radius, `shade` as a share of the full crease shading.
const PAPER_REST = { depth: 0.14, shade: 0.35 };

const FOLDS = 14;
// Sheet pixels per crease texel: fine when the GPU bakes it, coarser when it
// has to be worked out here.
const CREASE_CELL = { gpu: 1.5, cpu: 4 };

const NOISE_GLSL = `
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}`;

// Bakes crease depth and slope for every texel of the sheet. Each fold family
// is a tent wave at its own angle, with its peak rounded over a few pixels and
// faded in and out across the sheet, so creases meet at odd angles like a real
// crumple.
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
uniform vec4 uFold[${FOLDS}];
uniform float uFoldAmp[${FOLDS}];
uniform float uNoise;
out vec4 outColor;
${NOISE_GLSL}
void main() {
  float h = 0.0, hx = 0.0, hy = 0.0;
  for (int i = 0; i < ${FOLDS}; i++) {
    vec4 f = uFold[i];
    float m = smoothstep(0.18, 0.72, noise(vP * uNoise + vec2(float(i) * 7.31, float(i) * 3.17)));
    float w = fract(dot(vP, f.xy) * f.z + f.w) - 0.5;
    float r = sqrt(w * w + 0.0004);
    float slope = uFoldAmp[i] * m * (w / r) * f.z;
    h += uFoldAmp[i] * m * (r - 0.25);
    hx += slope * f.x;
    hy += slope * f.y;
  }
  outColor = vec4(h, hx, hy, 1.0);
}`;

const VERT = `#version 300 es
in vec2 aP;             // flat position (px from the centre, y up)
uniform sampler2D uCrease;
uniform float uU;       // 0 = balled up, 1 = flat
uniform float uC;       // curvature of the ball (1/px)
uniform float uA;       // crease depth scale (px)
uniform vec2 uHalf;     // half the sheet size (px)
uniform float uWrap;    // how far round the ball the corners reach (radians)
uniform mat3 uRot;
uniform vec3 uPivot;
uniform mat4 uMvp;
out vec2 vUv;
out vec2 vCuv;
out vec3 vPos;
out vec3 vNrm;
out vec3 vTx;
out vec3 vTy;

float sinc(float x) { return abs(x) < 1e-4 ? 1.0 - x * x / 6.0 : sin(x) / x; }

// Where a point of the flat sheet sits before creasing. Balled up, the sheet is
// wrapped onto a sphere so its corners reach just past the back (the rectangle
// is normalised to a disc first, so phones and wide screens both wrap all the
// way round). Opening, the wrap angle relaxes while the sheet regains its full
// size, so it reads as a bowl spreading out rather than a ball growing.
vec3 sheet(vec2 p, out vec3 nrm) {
  vec2 n = p / uHalf;
  float r = length(n) * 0.70710678;
  vec2 dir = r > 0.0 ? normalize(n) : vec2(0.0);
  float grow = smoothstep(0.0, 1.0, uU);
  vec2 q = mix(dir * (r * uWrap / uC), p, grow);
  float corner = mix(uWrap / uC, length(uHalf), grow);
  // The wrap lets go well before the sheet reaches full size, so the ball
  // breaks open into a bowl early instead of swelling.
  float c = uWrap * pow(1.0 - uU, 3.2) / corner;
  float s = length(q);
  vec2 qd = s > 0.0 ? q / s : vec2(0.0);
  float th = s * c;
  nrm = vec3(qd * sin(th), cos(th));
  // sin(th) / c and (cos(th) - 1) / c, written so they stay exact as the
  // curvature falls to zero; the plain forms lose all precision near flat.
  float half_ = 0.5 * th;
  float sh = sinc(half_);
  return vec3(q * sinc(th), -0.5 * s * th * sh * sh);
}

void main() {
  vec3 nrm, nn;
  vec3 base = sheet(aP, nrm);
  const float e = 1.5;
  vec3 tx = (sheet(aP + vec2(e, 0.0), nn) - sheet(aP - vec2(e, 0.0), nn)) / (2.0 * e);
  vec3 ty = (sheet(aP + vec2(0.0, e), nn) - sheet(aP - vec2(0.0, e), nn)) / (2.0 * e);
  vCuv = 0.5 + aP / (2.0 * uHalf);
  float h = textureLod(uCrease, vCuv, 0.0).x;
  vec3 pos = uRot * (base + nrm * h * uA - uPivot) + uPivot;

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
uniform sampler2D uTex;
uniform sampler2D uCrease;
uniform float uU;
uniform float uA;
uniform float uRest;    // how creased the sheet stays once smoothed out
uniform vec3 uEye;
uniform vec3 uLight;
out vec4 outColor;

void main() {
  vec3 v = normalize(uEye - vPos);
  vec3 nb = normalize(vNrm);
  vec3 crease = texture(uCrease, vCuv).xyz;
  vec3 n = normalize(cross(vTx + nb * crease.y * uA, vTy + nb * crease.z * uA));
  // The underside of the sheet has no ink on it.
  bool under = dot(nb, v) < 0.0;
  if (dot(n, v) < 0.0) n = -n;
  vec3 paper = under ? vec3(0.9, 0.893, 0.857) : texture(uTex, vUv).rgb;
  // Neutral (exactly 1.0) for a flat sheet facing the viewer.
  float lit = dot(n, uLight) - uLight.z;
  float crumpled = max(1.0 - uU, uRest);
  float shade = 1.0 + lit * (0.9 + 0.45 * crumpled);
  // Valleys between creases sit in shadow, and so does the ball's rim.
  shade *= 1.0 - 0.34 * crumpled * smoothstep(0.02, -0.5, crease.x);
  shade *= 1.0 - 0.3 * crumpled * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.0);
  outColor = vec4(paper * clamp(shade, 0.36, 1.1), 1.0);
}`;

type Fold = { dx: number; dy: number; freq: number; phase: number; amp: number };

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// The same crease field as BAKE_FRAG, for GPUs that cannot render to floats.
const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
function noise(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
function bakeOnCpu(folds: Fold[], fade: number, cols: number, rows: number, width: number, height: number): Float32Array {
  const out = new Float32Array(cols * rows * 4);
  for (let j = 0, k = 0; j < rows; j++) {
    const y = ((j + 0.5) / rows - 0.5) * height;
    for (let i = 0; i < cols; i++, k += 4) {
      const x = ((i + 0.5) / cols - 0.5) * width;
      let h = 0, hx = 0, hy = 0;
      folds.forEach((f, n) => {
        const m = smoothstep(0.18, 0.72, noise(x * fade + n * 7.31, y * fade + n * 3.17));
        if (m === 0) return;
        const t = (x * f.dx + y * f.dy) * f.freq + f.phase;
        const w = t - Math.floor(t) - 0.5;
        const r = Math.sqrt(w * w + 0.0004);
        const slope = f.amp * m * (w / r) * f.freq;
        h += f.amp * m * (r - 0.25);
        hx += slope * f.dx;
        hy += slope * f.dy;
      });
      out[k] = h;
      out[k + 1] = hx;
      out[k + 2] = hy;
      out[k + 3] = 1;
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

// Mounts the ball. While its shaders compile the overlay is marked
// data-paper="loading" and keeps showing the flat CSS sheet, which is exactly
// the ball's first frame; the scrunch starts once the GPU is ready. If it is
// not ready in time, or the reveal arrives first, the flat sheet is kept.
export function mountPaperBall(): void {
  const root = document.documentElement;
  const overlay = document.getElementById('boot-overlay');
  if (!overlay || root.dataset.boot !== 'pending') return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const width = root.clientWidth || innerWidth;
  const height = root.clientHeight || innerHeight;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const canvas = document.createElement('canvas');
  canvas.className = 'boot-ball';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  // A software renderer cannot hold this at frame rate and starves the page
  // beneath, so it is refused and the flat CSS sheet is used instead.
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

  // Crease spacing follows the sheet's size (tuned at 1440x900), so a phone's
  // smaller sheet is as crumpled as a desktop's. Fold angles are spread evenly
  // with jitter, so no direction dominates.
  const sheetScale = Math.sqrt(width * height) / 1138;
  const fade = 0.0045 / sheetScale;
  const folds: Fold[] = Array.from({ length: FOLDS }, (_, i) => {
    const angle = ((i + Math.random() * 0.8) / FOLDS) * Math.PI;
    const period = (50 + Math.random() * 280) * sheetScale;
    return {
      dx: Math.cos(angle), dy: Math.sin(angle), freq: 1 / period, phase: Math.random(),
      amp: (period / (330 * sheetScale)) * (0.6 + Math.random() * 0.6),
    };
  });

  // Mesh: about 7px cells. It only carries the silhouette; the light comes
  // from the crease texture.
  const cols = Math.min(240, Math.max(60, Math.round(width / 7)));
  const rows = Math.min(240, Math.max(60, Math.round(height / 7)));
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

  // A random lean for this load, so the ball never lands the same way twice.
  const lean = { x: 0.16 + Math.random() * 0.08, y: -0.2 + Math.random() * 0.1, z: -(0.5 + Math.random() * 0.5) };
  const mountedAt = performance.now();
  let start = 0;
  let flat = 1;
  let unfoldAt = 0;
  let unfoldFrom = 0;
  let done = false;
  let last = 0;
  const gaps: number[] = [];
  let release: () => void = () => {};
  // The ball must be fully scrunched, and sit for a beat, before it may open.
  holdBoot(new Promise<void>((resolve) => { release = resolve; }));

  // Hands the overlay back to the flat CSS sheet. boot-overlay.ts reads
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
  let uA: WebGLUniformLocation | null = null;
  let uRot: WebGLUniformLocation | null = null;
  let uPivot: WebGLUniformLocation | null = null;
  let uRest: WebGLUniformLocation | null = null;
  // How far the sheet has ever been scrunched. Paper that has been balled up
  // never goes back to neat: once it is smoothed out, part of every crease
  // stays. The opening frame, before any scrunch, is still the neat sheet.
  let creased = 0;

  const draw = (now: number) => {
    const t = (now - mountedAt) / 1000;
    const wad = 1 - flat;
    const wobble = wad * wad;
    const rx = wad * lean.x + wobble * 0.05 * Math.sin(t * 2.1);
    const ry = wad * lean.y + wobble * 0.07 * Math.sin(t * 1.6 + 1);
    const rz = wad * lean.z + wobble * 0.06 * Math.sin(t * 1.3 + 2);
    gl.uniform1f(uU, flat);
    creased = Math.max(creased, wad);
    gl.uniform1f(uA, radius * (0.42 * Math.pow(wad, 1.25) + PAPER_REST.depth * creased * (1 - wad)));
    gl.uniform1f(uRest, PAPER_REST.shade * creased);
    gl.uniformMatrix3fv(uRot, false, rotation(rx, ry, rz));
    gl.uniform3f(uPivot, 0, 0, -radius * wad);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, index.length, gl.UNSIGNED_INT, 0);
    shadow.style.opacity = String(Math.pow(wad, 1.5) * 0.9);
    shadow.style.transform = `translate(-50%, -50%) scale(${1 + flat * 3})`;
  };

  const frame = (now: number) => {
    if (done || !canvas.isConnected) {
      done = true;
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return;
    }
    // The scrunch is timed from the first frame after the flat one, so any
    // driver work on that first draw cannot make it jump.
    if (!start) {
      start = now;
      last = now;
      setTimeout(release, PAPER_TIMING.crumple + PAPER_TIMING.rest);
    } else if (gaps.length < 12) {
      // A machine that cannot draw the ball smoothly gets the flat sheet
      // instead of a stuttering ball and a page starved behind it.
      gaps.push(now - last);
      last = now;
      if (gaps.length === 12 && [...gaps].sort((a, b) => a - b)[6] > 45) {
        bail();
        return;
      }
    }
    if (unfoldAt) {
      const p = clamp01((now - unfoldAt) / PAPER_TIMING.unfold);
      flat = unfoldFrom + (1 - unfoldFrom) * easeInOut(p);
      if (p >= 1) {
        draw(now);
        done = true;
        overlay.dataset.paper = 'flat';
        document.dispatchEvent(new CustomEvent('paper:flat'));
        return;
      }
    } else {
      flat = 1 - easeOut(clamp01((now - start) / PAPER_TIMING.crumple));
    }
    draw(now);
    requestAnimationFrame(frame);
  };

  // Everything that needs the compiled programs: the crease bake, uniforms
  // and the first (flat) frame.
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
        gl.uniform4fv(bu('uFold'), folds.flatMap((f) => [f.dx, f.dy, f.freq, f.phase]));
        gl.uniform1fv(bu('uFoldAmp'), folds.map((f) => f.amp));
        gl.uniform1f(bu('uNoise'), fade);
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
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, cCols, cRows, 0, gl.RGBA, gl.FLOAT, bakeOnCpu(folds, fade, cCols, cRows, width, height));
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
    gl.uniform1f(u('uC'), 1 / radius);
    gl.uniform1f(u('uWrap'), Math.PI * 1.22);
    gl.uniformMatrix4fv(u('uMvp'), false, mvp);
    gl.uniform3f(u('uEye'), 0, 0, dist);
    const light = [-0.42, 0.55, 0.72];
    const ll = Math.hypot(...light);
    gl.uniform3f(u('uLight'), light[0] / ll, light[1] / ll, light[2] / ll);
    gl.uniform1i(u('uTex'), 0);
    gl.uniform1i(u('uCrease'), 1);
    uU = u('uU');
    uA = u('uA');
    uRot = u('uRot');
    uPivot = u('uPivot');
    uRest = u('uRest');

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    // The first frame is the flat sheet, identical to the CSS paper beneath it.
    draw(performance.now());
    overlay.dataset.paper = 'ball';
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
    // Still compiling when the page is ready: keep the flat sheet.
    if (overlay.dataset.paper === 'loading') {
      bail();
      return;
    }
    unfoldFrom = flat;
    unfoldAt = performance.now();
  }, { once: true });
}
