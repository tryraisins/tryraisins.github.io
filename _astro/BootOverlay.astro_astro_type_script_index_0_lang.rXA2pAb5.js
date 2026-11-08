import{h as De,i as Ie}from"./boot-overlay.I7lpWlSt.js";const _e={rest:220,unfold:1600},pe={grip:[0,150],pop:[110,460],spread:[360,1100],smooth:[880,1600]},Ae={ball:.3,open:.14,rest:.07},Me={open:.45,rest:.28},Pe=.34,Ce=[{cell:210,cap:.15,stretch:1.45,amp:1.3},{cell:92,cap:.17,stretch:1.25,amp:.7},{cell:38,cap:.2,stretch:1.1,amp:.25}],be=Ce.length,Be=95,de={gpu:1.5,cpu:4},Le=`
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}`,Ne=`#version 300 es
in vec2 aQuad;
uniform vec2 uHalf;
out vec2 vP;
void main() {
  vP = aQuad * uHalf;
  gl_Position = vec4(aQuad, 0.0, 1.0);
}`,ke=`#version 300 es
precision highp float;
in vec2 vP;
uniform vec4 uLayer[${be}];    // cos, sin, cell (px), stretch
uniform vec2 uLayerAmp[${be}]; // strength, cap
uniform float uNorm;
uniform float uSeed;
out vec4 outColor;
${Le}
vec2 point(vec2 c) { return 0.12 + 0.76 * vec2(hash(c), hash(c + vec2(17.3, 41.9))); }
void main() {
  float h = 0.0, fine = 0.0;
  vec2 grad = vec2(0.0);
  for (int l = 0; l < ${be}; l++) {
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
}`,Ge=`#version 300 es
in vec2 aP;             // flat position (px from the centre, y up)
uniform sampler2D uCrease;
uniform float uU;       // 0 = balled up, 1 = open (but still crumpled)
uniform float uSweep;   // how far the smoothing palm has crossed the sheet
uniform vec2 uSweepDir;
uniform float uSeed;
uniform float uC;       // curvature of the ball (1/px)
uniform float uR;       // radius of the ball (px)
uniform vec2 uHalf;     // half the sheet size (px)
uniform float uWrap;    // how far round the ball the corners reach (radians)
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
${Le}

float sinc(float x) { return abs(x) < 1e-4 ? 1.0 - x * x / 6.0 : sin(x) / x; }

// How far this part of the sheet has opened. A smooth random field holds some
// regions back, so flaps come loose one after another.
float openAt(vec2 p) {
  vec2 n = p / uHalf;
  // The corners wait a little longer, so they do not shoot out as horns.
  float corner = smoothstep(0.75, 1.0, length(n) * 0.70710678);
  float d = (0.62 * noise(n * 2.3 + uSeed) + 0.38 * noise(n * 4.8 + uSeed * 1.7 + 11.0) + 0.45 * corner) / 1.45;
  return clamp((uU - ${Pe} * d) / (1.0 - ${Pe}), 0.0, 1.0);
}

// How far the smoothing palm has pressed this part of the sheet.
float smoothedAt(vec2 p) {
  vec2 n = p / uHalf;
  float s = 0.5 + 0.5 * dot(n, uSweepDir) / (abs(uSweepDir.x) + abs(uSweepDir.y));
  const float w = 0.24;
  float front = mix(-w, 1.0 + w, uSweep);
  return 1.0 - smoothstep(front - w, front + w, s);
}

// Where a point of the flat sheet sits before creasing. Balled up, the sheet is
// wrapped onto a sphere so its corners reach just past the back. The rectangle
// is mostly scaled evenly, so its creases keep their shape, and only partly
// normalised to a disc, so the short edges of a phone or a wide screen still
// reach round the back. Opening, the wrap angle relaxes while the sheet
// regains its full size, so it reads as a bowl spreading out rather than a
// ball growing.
vec3 sheet(vec2 p, out vec3 nrm) {
  float u = openAt(p);
  vec2 span = mix(uHalf, vec2(length(uHalf) * 0.70710678), 0.65);
  vec2 n = p / span;
  float r = length(n) / length(uHalf / span);
  vec2 dir = r > 0.0 ? normalize(n) : vec2(0.0);
  // A region peels back at ball size first and only then spreads out, so
  // early flaps curl open instead of stretching away from the ball.
  float grow = smoothstep(0.18, 1.0, u);
  vec2 q = mix(dir * (r * uWrap / uC), p, grow);
  float corner = mix(uWrap / uC, length(uHalf), grow);
  // The wrap lets go well before the sheet reaches full size, so the ball
  // breaks open into a bowl early instead of swelling.
  float c = uWrap * pow(1.0 - u, 3.2) / corner;
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
  float u = openAt(aP);
  float sm = smoothedAt(aP);
  float depth = mix(mix(${Ae.open}, ${Ae.ball}, pow(1.0 - u, 1.25)), ${Ae.rest}, sm);
  vA = uR * depth;
  vCrumple = mix(max(1.0 - u, ${Me.open}), ${Me.rest}, sm);
  vec4 crease = textureLod(uCrease, vCuv, 0.0);
  float h = mix(crease.x, crease.w * 1.7, pow(1.0 - u, 1.5));
  vec3 pos = uRot * ((base + nrm * h * vA - uPivot) * uScale) + uPivot;

  vUv = vec2(vCuv.x, 1.0 - vCuv.y);
  vPos = pos;
  vNrm = uRot * nrm;
  vTx = uRot * tx;
  vTy = uRot * ty;
  gl_Position = uMvp * vec4(pos, 1.0);
}`,Xe=`#version 300 es
precision highp float;
in vec2 vUv;
in vec2 vCuv;
in vec3 vPos;
in vec3 vNrm;
in vec3 vTx;
in vec3 vTy;
in float vA;
in float vCrumple;
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
  float shade = 1.0 + lit * (0.9 + 0.45 * k);
  // Valleys between creases sit in shadow, ridges catch a little more light,
  // and the rim of the ball turns away into shade.
  shade *= 1.0 - 0.38 * k * smoothstep(0.02, -0.45, crease.x);
  shade *= 1.0 + 0.05 * k * smoothstep(0.05, 0.45, crease.x);
  shade *= 1.0 - 0.32 * k * pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.0);
  // Folds tucked behind the front of the ball get less light.
  if (under) shade *= 0.88;
  // Paper has a faint sheen where a facet tips towards the light.
  float sheen = pow(max(dot(n, normalize(uLight + v)), 0.0), 28.0) * 0.08 * k;
  outColor = vec4(paper * clamp(shade, 0.34, 1.12) + sheen, 1.0);
}`,we=a=>a<.5?4*a*a*a:1-Math.pow(-2*a+2,3)/2,Fe=a=>1-Math.pow(1-a,3),qe=a=>1+2.4*Math.pow(a-1,3)+1.4*Math.pow(a-1,2),xe=a=>Math.min(1,Math.max(0,a)),ve=(a,[o,i])=>xe((a-o)/(i-o));function ze(a){let o=a>>>0;return()=>{o=o+1831565813>>>0;let i=o;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}const Ee=(a,o)=>{const i=Math.sin(a*127.1+o*311.7)*43758.5453;return i-Math.floor(i)};function He(a,o,i,u,r,l,s){const h=new Float32Array(u*r*4),m=(T,b)=>.12+.76*Ee(T,b),e=(T,b)=>.12+.76*Ee(T+17.3,b+41.9);for(let T=0,b=0;T<r;T++){const W=((T+.5)/r-.5)*s;for(let _=0;_<u;_++,b+=4){const M=((_+.5)/u-.5)*l;let L=0,ee=0,$=0,te=0;a.forEach((f,y)=>{const D=(f.cos*M+f.sin*W)/f.cell,j=(-f.sin*M+f.cos*W)*f.stretch/f.cell,X=i+y*13.7,Y=y*29.1,K=Math.floor(D),V=Math.floor(j),P=D-K,Q=j-V;let ae=8,Z=0,oe=0,q=0,re=0;for(let R=-1;R<=1;R++)for(let A=-1;A<=1;A++){const k=K+A+X,F=V+R+Y,S=A+m(k,F)-P,G=R+e(k,F)-Q,O=S*S+G*G;O<ae&&(ae=O,q=S,re=G,Z=A,oe=R)}let I=8,ne=1,J=0;for(let R=-2;R<=2;R++)for(let A=-2;A<=2;A++){const k=Z+A,F=oe+R,S=K+k+X,G=V+F+Y,O=k+m(S,G)-P,le=F+e(S,G)-Q,t=O-q,n=le-re,c=Math.hypot(t,n);if(c*c>1e-5){const d=(.5*(q+O)*t+.5*(re+le)*n)/c;d<I&&(I=d,ne=t/c,J=n/c)}}const se=K+Z+X,B=V+oe+Y,N=f.amp*(Ee(se+5.1,B+9.7)<.5?-1:1)*(.45+.75*Ee(se+2.3,B+7.9)),z=f.cap*.35,w=xe(.5+.5*(f.cap-I)/z),H=f.cap+(I-f.cap)*w-z*w*(1-w);L+=N*H*f.cell/o,y>0&&(te+=N*H*f.cell/o);const ce=-ne*N*w/o,ie=-J*N*w/o*f.stretch;ee+=f.cos*ce-f.sin*ie,$+=f.sin*ce+f.cos*ie}),h[b]=L,h[b+1]=ee,h[b+2]=$,h[b+3]=te}}return h}function Oe(a,o,i){const u=document.createElement("canvas");u.width=Math.round(a*i),u.height=Math.round(o*i);const r=u.getContext("2d");r.scale(i,i),r.fillStyle="#f8f7f1",r.fillRect(0,0,a,o);const l=document.createElement("canvas");l.width=l.height=128;const s=l.getContext("2d"),h=s.createImageData(128,128);for(let e=0;e<h.data.length;e+=4){const T=Math.random()*60;h.data[e]=h.data[e+1]=h.data[e+2]=T,h.data[e+3]=Math.random()*16}s.putImageData(h,0,0),r.fillStyle=r.createPattern(l,"repeat"),r.fillRect(0,0,a,o),r.fillStyle="rgba(52,110,204,.5)";for(let e=35;e<o;e+=36)r.fillRect(0,e,a,1);const m=a<=620?28:Math.max(Math.min(Math.max(32,a*.06),96),(a-1280)/2);return r.fillStyle="rgba(214,62,56,.55)",r.fillRect(m-6,0,1.5,o),r.fillRect(m-1.5,0,1.5,o),u}function Se(a,o,i){const u=a.createProgram();if(!u)return null;for(const[r,l]of[[a.VERTEX_SHADER,o],[a.FRAGMENT_SHADER,i]]){const s=a.createShader(r);if(!s)return null;a.shaderSource(s,l),a.compileShader(s),a.attachShader(u,s)}return a.linkProgram(u),u}function Ue(a,o){return a.getProgramParameter(o,a.LINK_STATUS)?!0:(console.warn("paper-ball:",a.getProgramInfoLog(o)),!1)}function We(a,o,i){const[u,r,l,s,h,m]=[Math.cos(a),Math.sin(a),Math.cos(o),Math.sin(o),Math.cos(i),Math.sin(i)];return new Float32Array([l*h,l*m,-s,r*s*h-u*m,r*s*m+u*h,r*l,u*s*h+r*m,u*s*m-r*h,u*l])}function $e(){const a=document.documentElement,o=document.getElementById("boot-overlay");if(!o||a.dataset.boot!=="pending"||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const u=Number(null?.get("paper-seed")),r=ze(Number.isFinite(u)&&u>0?u:Math.random()*2**32>>>0),l=a.clientWidth||innerWidth,s=a.clientHeight||innerHeight,h=Math.min(devicePixelRatio||1,2),m=document.createElement("canvas");m.className="boot-ball",m.setAttribute("aria-hidden","true"),m.width=Math.round(l*h),m.height=Math.round(s*h);const e=m.getContext("webgl2",{antialias:!0,alpha:!0,premultipliedAlpha:!0,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!0});if(!e)return;const T=e.getExtension("WEBGL_debug_renderer_info"),b=T?String(e.getParameter(T.UNMASKED_RENDERER_WEBGL)):"";if(/swiftshader|llvmpipe|softpipe|software|basic render/i.test(b))return;const W=e.getExtension("KHR_parallel_shader_compile"),_=Se(e,Ge,Xe),M=e.getExtension("EXT_color_buffer_float")?Se(e,Ne,ke):null;if(!_)return;const L=Math.min(l,s)*.17+40,ee=Math.sqrt(l*s)/1138,$=Ce.map(t=>{const n=r()*Math.PI;return{cos:Math.cos(n),sin:Math.sin(n),cell:t.cell*ee,stretch:t.stretch,amp:t.amp,cap:t.cap}}),te=Be*ee,f=Math.floor(r()*90)+3,y=Math.min(240,Math.max(60,Math.round(l/7))),D=Math.min(240,Math.max(60,Math.round(s/7))),j=new Float32Array((y+1)*(D+1)*2);for(let t=0,n=0;t<=D;t++)for(let c=0;c<=y;c++)j[n++]=(c/y-.5)*l,j[n++]=(.5-t/D)*s;const X=new Uint32Array(y*D*6);for(let t=0,n=0;t<D;t++)for(let c=0;c<y;c++,n+=6){const d=t*(y+1)+c,g=d+1,x=d+y+1,v=x+1;X.set([d,x,g,g,x,v],n)}const Y=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,Y),e.bufferData(e.ARRAY_BUFFER,j,e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,X,e.STATIC_DRAW);const K=e.getParameter(e.MAX_TEXTURE_SIZE),V=Math.min(h,K/Math.max(l,s));e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,e.createTexture()),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,Oe(l,s,V)),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const P=document.createElement("div");P.className="boot-ball-shadow",P.setAttribute("aria-hidden","true"),P.style.setProperty("--ball",`${L*2}px`),o.append(P,m),o.dataset.paper="loading";const Q={x:.16+r()*.08,y:-.2+r()*.1,z:-(.5+r()*.5)},ae=r()*Math.PI*2,Z=[];for(let t=.18+r()*.2;t<9;t+=.28+r()*.55){const n=.4+r()*.6;Z.push({at:t,rx:(r()-.5)*.05*n,ry:(r()-.5)*.06*n,rz:(r()-.5)*.05*n,grow:.007*n})}const oe=t=>t<=0?0:1-Math.exp(-t*16)*Math.cos(t*24),q=t=>{let n=0,c=0,d=0,g=0;for(const v of Z){if(v.at>t)break;const p=oe(t-v.at);n+=v.rx*p,c+=v.ry*p,d+=v.rz*p,g+=Math.min(v.grow*p,.06-g)}const x=1+g;return{open:0,sweep:0,scale:[x,x,x],rot:[Q.x+n,Q.y+c,Q.z+d]}},re=(t,n)=>{const c=q(n),d=Fe(ve(t,pe.grip)),g=ve(t,pe.pop),x=d*(1-Fe(g)),v=.22*qe(g)+.78*we(ve(t,pe.spread)),p=xe(1-v),U=.05*Math.sin(Math.PI*g)*p,ue=c.scale[0]*(1-.07*x+U),ge=c.scale[2]*(1-.04*x+U);return{open:v,sweep:we(ve(t,pe.smooth)),scale:[1+(ue-1)*p,1+(ue-1)*p,1+(ge-1)*p],rot:[c.rot[0]*p,c.rot[1]*p,(c.rot[2]-.08*x)*p]}},I=performance.now();let ne=0,J=0,se=0,B=!1,N=0;const z=[];let w=()=>{};De(new Promise(t=>{w=t}));const H=()=>{B=!0,m.remove(),P.remove(),delete o.dataset.paper,e.getExtension("WEBGL_lose_context")?.loseContext(),w(),document.dispatchEvent(new CustomEvent("paper:flat"))};let ce=null,ie=null,R=null,A=null,k=null;const F=t=>{const n=xe(1-t.open);e.uniform1f(ce,Math.min(t.open,1)),e.uniform1f(ie,t.sweep),e.uniformMatrix3fv(R,!1,We(...t.rot)),e.uniform3f(A,0,0,-L*n),e.uniform3f(k,...t.scale),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.drawElements(e.TRIANGLES,X.length,e.UNSIGNED_INT,0),P.style.opacity=String(Math.pow(n,1.5)*.9),P.style.transform=`translate(-50%, -50%) translate(${t.rot[2]*L*.12}px, 0) scale(${t.scale[0]*(1+(1-n)*3)})`},S=t=>{if(B||!m.isConnected){B=!0,e.getExtension("WEBGL_lose_context")?.loseContext();return}if(!ne)ne=t,N=t,setTimeout(w,_e.rest);else if(z.length<12&&(z.push(t-N),N=t,z.length===12&&[...z].sort((c,d)=>c-d)[6]>45)){H();return}const n=(t-I)/1e3;if(J){const c=t-J;if(F(re(c,se)),c>=_e.unfold){B=!0,o.dataset.paper="flat",document.dispatchEvent(new CustomEvent("paper:flat"));return}}else F(q(n));requestAnimationFrame(S)},G=()=>{if(!Ue(e,_)){H();return}let t=Math.ceil(l/de.gpu),n=Math.ceil(s/de.gpu);const c=e.createTexture();e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,t,n,0,e.RGBA,e.FLOAT,null);let d=!1;if(M&&Ue(e,M)){const me=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,me),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,c,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE){e.useProgram(M);const ye=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,ye),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const Re=e.getAttribLocation(M,"aQuad");e.enableVertexAttribArray(Re),e.vertexAttribPointer(Re,2,e.FLOAT,!1,0,0);const fe=C=>e.getUniformLocation(M,C);e.uniform2f(fe("uHalf"),l/2,s/2),e.uniform4fv(fe("uLayer"),$.flatMap(C=>[C.cos,C.sin,C.cell,C.stretch])),e.uniform2fv(fe("uLayerAmp"),$.flatMap(C=>[C.amp,C.cap])),e.uniform1f(fe("uNorm"),te),e.uniform1f(fe("uSeed"),f),e.viewport(0,0,t,n),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.disableVertexAttribArray(Re),e.deleteBuffer(ye),d=!0}e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(me)}d||(t=Math.ceil(l/de.cpu),n=Math.ceil(s/de.cpu),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,t,n,0,e.RGBA,e.FLOAT,He($,te,f,t,n,l,s))),e.useProgram(_),e.bindBuffer(e.ARRAY_BUFFER,Y);const g=e.getAttribLocation(_,"aP");e.enableVertexAttribArray(g),e.vertexAttribPointer(g,2,e.FLOAT,!1,0,0);const x=30*Math.PI/180,v=s/2/Math.tan(x/2),p=20,U=v+4e3,ue=1/Math.tan(x/2),ge=new Float32Array([ue/(l/s),0,0,0,0,ue,0,0,0,0,(U+p)/(p-U),-1,0,0,2*U*p/(p-U)-v*((U+p)/(p-U)),v]),E=me=>e.getUniformLocation(_,me);e.uniform2f(E("uHalf"),l/2,s/2),e.uniform1f(E("uC"),1/L),e.uniform1f(E("uR"),L),e.uniform1f(E("uWrap"),Math.PI*1.22),e.uniform1f(E("uSeed"),f),e.uniform2f(E("uSweepDir"),Math.cos(ae),Math.sin(ae)),e.uniformMatrix4fv(E("uMvp"),!1,ge),e.uniform3f(E("uEye"),0,0,v);const he=[-.42,.55,.72],Te=Math.hypot(...he);e.uniform3f(E("uLight"),he[0]/Te,he[1]/Te,he[2]/Te),e.uniform1i(E("uTex"),0),e.uniform1i(E("uCrease"),1),ce=E("uU"),ie=E("uSweep"),R=E("uRot"),A=E("uPivot"),k=E("uScale"),e.viewport(0,0,m.width,m.height),e.enable(e.DEPTH_TEST),e.clearColor(0,0,0,0),F(q(0)),o.dataset.paper="ball",requestAnimationFrame(S)},O=()=>!W||e.getProgramParameter(_,W.COMPLETION_STATUS_KHR)&&(!M||e.getProgramParameter(M,W.COMPLETION_STATUS_KHR)),le=t=>{B||o.dataset.paper!=="loading"||(O()?G():t-I>1500?H():requestAnimationFrame(le))};requestAnimationFrame(le),document.addEventListener("boot:reveal",()=>{if(o.dataset.paper==="loading"){H();return}se=(performance.now()-I)/1e3,J=performance.now()},{once:!0})}$e();Ie();
