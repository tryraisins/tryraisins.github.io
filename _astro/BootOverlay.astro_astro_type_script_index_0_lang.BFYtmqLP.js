import{h as tt,i as at}from"./boot-overlay.I7lpWlSt.js";const qe={rest:220,unfold:1600},y={grip:[0,150],release:[110,600],open:[320,860],turn:[200,1200],smooth:[1e3,1600]},W=8,ee=14,ot=4,rt=2,Pe={decay:6.6,rate:6.9},Y=.24,De={ball:.07,open:.14,rest:.07},We=.035,je={open:.45,rest:.28},Ze=[{cell:210,cap:.15,stretch:1.45,amp:1.3},{cell:92,cap:.17,stretch:1.25,amp:.7},{cell:38,cap:.2,stretch:1.1,amp:.25}],Ue=Ze.length,nt=95,we={gpu:1.5,cpu:4},st=`
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}`,ct=`#version 300 es
in vec2 aQuad;
uniform vec2 uHalf;
out vec2 vP;
void main() {
  vP = aQuad * uHalf;
  gl_Position = vec4(aQuad, 0.0, 1.0);
}`,it=`#version 300 es
precision highp float;
in vec2 vP;
uniform vec4 uLayer[${Ue}];    // cos, sin, cell (px), stretch
uniform vec2 uLayerAmp[${Ue}]; // strength, cap
uniform float uNorm;
uniform float uSeed;
out vec4 outColor;
${st}
vec2 point(vec2 c) { return 0.12 + 0.76 * vec2(hash(c), hash(c + vec2(17.3, 41.9))); }
void main() {
  float h = 0.0, fine = 0.0;
  vec2 grad = vec2(0.0);
  for (int l = 0; l < ${Ue}; l++) {
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
}`,lt=`#version 300 es
in vec2 aP;             // flat position (px from the centre, y up)
uniform sampler2D uCrease;
uniform float uU;       // 0 = balled up, 1 = open (but still crumpled)
uniform float uSweep;   // how far the smoothing palm has crossed the sheet
uniform vec2 uSweepDir;
uniform float uR;       // radius of the ball (px)
uniform vec2 uHalf;     // half the sheet size (px)
uniform vec4 uHinge[${W}]; // fold planes: unit normal, offset
uniform float uHingeSoft[${W}];
uniform vec4 uCage[${ee}];
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
  float front = mix(-${Y}, 1.0 + ${Y}, uSweep);
  return 1.0 - smoothstep(front - ${Y}, front + ${Y}, s);
}

void main() {
  vec3 p = vec3(aP, 0.0), tx = vec3(1.0, 0.0, 0.0), ty = vec3(0.0, 1.0, 0.0);
  for (int i = 0; i < ${ot}; i++)
    for (int k = 0; k < ${W}; k++) fold(uHinge[k], uHingeSoft[k], p, tx, ty);
  for (int i = 0; i < ${rt}; i++) {
    for (int k = 0; k < ${ee}; k++) fold(uCage[k], uCageSoft, p, tx, ty);
    // The desk.
    if (p.z < 0.0) { p.z = -p.z; tx.z = -tx.z; ty.z = -ty.z; }
  }
  vec3 nrm = normalize(cross(tx, ty));

  vCuv = 0.5 + aP / (2.0 * uHalf);
  float sm = smoothedAt(aP);
  float depth = mix(mix(${De.open}, ${De.ball}, pow(1.0 - uU, 1.25)), ${De.rest}, sm);
  vA = uR * depth;
  vCrumple = mix(max(1.0 - uU, ${je.open}), ${je.rest}, sm);
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
}`,ut=`#version 300 es
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
}`,Ye=a=>a<.5?4*a*a*a:1-Math.pow(-2*a+2,3)/2,Ke=a=>1-Math.pow(1-a,3),ft=a=>1+2.4*Math.pow(a-1,3)+1.4*Math.pow(a-1,2),mt=(a,n,l)=>{const m=j((l-a)/(n-a));return m*m*(3-2*m)},ht=a=>a<=0?0:1-Math.exp(-6.6*a)*(Math.cos(Pe.rate*a)+Pe.decay/Pe.rate*Math.sin(Pe.rate*a)),j=a=>Math.min(1,Math.max(0,a)),Se=(a,[n,l])=>j((a-n)/(l-n));function pt(a){let n=a>>>0;return()=>{n=n+1831565813>>>0;let l=n;return l=Math.imul(l^l>>>15,l|1),l^=l+Math.imul(l^l>>>7,l|61),((l^l>>>14)>>>0)/4294967296}}const Fe=(a,n)=>{const l=Math.sin(a*127.1+n*311.7)*43758.5453;return l-Math.floor(l)};function dt(a,n,l,m,o,u,c){const p=new Float32Array(m*o*4),d=(R,_)=>.12+.76*Fe(R,_),e=(R,_)=>.12+.76*Fe(R+17.3,_+41.9);for(let R=0,_=0;R<o;R++){const te=((R+.5)/o-.5)*c;for(let S=0;S<m;S++,_+=4){const F=((S+.5)/m-.5)*u;let g=0,de=0,ae=0,ve=0;a.forEach((v,oe)=>{const C=(v.cos*F+v.sin*te)/v.cell,H=(-v.sin*F+v.cos*te)*v.stretch/v.cell,K=l+oe*13.7,V=oe*29.1,Q=Math.floor(C),re=Math.floor(H),Me=C-Q,D=H-re;let ne=8,se=0,U=0,Ee=0,xe=0;for(let A=-1;A<=1;A++)for(let M=-1;M<=1;M++){const b=Q+M+K,z=re+A+V,P=M+d(b,z)-Me,I=A+e(b,z)-D,N=P*P+I*I;N<ne&&(ne=N,Ee=P,xe=I,se=M,U=A)}let Z=8,ce=1,L=0;for(let A=-2;A<=2;A++)for(let M=-2;M<=2;M++){const b=se+M,z=U+A,P=Q+b+K,I=re+z+V,N=b+d(P,I)-Me,Ae=z+e(P,I)-D,me=N-Ee,he=Ae-xe,X=Math.hypot(me,he);if(X*X>1e-5){const Re=(.5*(Ee+N)*me+.5*(xe+Ae)*he)/X;Re<Z&&(Z=Re,ce=me/X,L=he/X)}}const ie=Q+se+K,ge=re+U+V,le=v.amp*(Fe(ie+5.1,ge+9.7)<.5?-1:1)*(.45+.75*Fe(ie+2.3,ge+7.9)),ue=v.cap*.35,J=j(.5+.5*(v.cap-Z)/ue),ye=v.cap+(Z-v.cap)*J-ue*J*(1-J);g+=le*ye*v.cell/n,oe>0&&(ve+=le*ye*v.cell/n);const fe=-ce*le*J/n,Te=-L*le*J/n*v.stretch;de+=v.cos*fe-v.sin*Te,ae+=v.sin*fe+v.cos*Te}),p[_]=g,p[_+1]=de,p[_+2]=ae,p[_+3]=ve}}return p}function vt(a,n,l){const m=document.createElement("canvas");m.width=Math.round(a*l),m.height=Math.round(n*l);const o=m.getContext("2d");o.scale(l,l),o.fillStyle="#f8f7f1",o.fillRect(0,0,a,n);const u=document.createElement("canvas");u.width=u.height=128;const c=u.getContext("2d"),p=c.createImageData(128,128);for(let e=0;e<p.data.length;e+=4){const R=Math.random()*60;p.data[e]=p.data[e+1]=p.data[e+2]=R,p.data[e+3]=Math.random()*16}c.putImageData(p,0,0),o.fillStyle=o.createPattern(u,"repeat"),o.fillRect(0,0,a,n),o.fillStyle="rgba(52,110,204,.5)";for(let e=35;e<n;e+=36)o.fillRect(0,e,a,1);const d=a<=620?28:Math.max(Math.min(Math.max(32,a*.06),96),(a-1280)/2);return o.fillStyle="rgba(214,62,56,.55)",o.fillRect(d-6,0,1.5,n),o.fillRect(d-1.5,0,1.5,n),m}function Ve(a,n,l){const m=a.createProgram();if(!m)return null;for(const[o,u]of[[a.VERTEX_SHADER,n],[a.FRAGMENT_SHADER,l]]){const c=a.createShader(o);if(!c)return null;a.shaderSource(c,u),a.compileShader(c),a.attachShader(m,c)}return a.linkProgram(m),m}function Qe(a,n){return a.getProgramParameter(n,a.LINK_STATUS)?!0:(console.warn("paper-ball:",a.getProgramInfoLog(n)),!1)}function Et(a,n,l){const[m,o,u,c,p,d]=[Math.cos(a),Math.sin(a),Math.cos(n),Math.sin(n),Math.cos(l),Math.sin(l)];return new Float32Array([u*p,u*d,-c,o*c*p-m*d,o*c*d+m*p,o*u,m*c*p+o*d,m*c*d-o*p,m*u])}function xt(){const a=document.documentElement,n=document.getElementById("boot-overlay");if(!n||a.dataset.boot!=="pending"||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const m=Number(null?.get("paper-seed")),o=pt(Number.isFinite(m)&&m>0?m:Math.random()*2**32>>>0),u=a.clientWidth||innerWidth,c=a.clientHeight||innerHeight,p=Math.min(devicePixelRatio||1,2),d=document.createElement("canvas");d.className="boot-ball",d.setAttribute("aria-hidden","true"),d.width=Math.round(u*p),d.height=Math.round(c*p);const e=d.getContext("webgl2",{antialias:!0,alpha:!0,premultipliedAlpha:!0,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!0});if(!e)return;const R=e.getExtension("WEBGL_debug_renderer_info"),_=R?String(e.getParameter(R.UNMASKED_RENDERER_WEBGL)):"";if(/swiftshader|llvmpipe|softpipe|software|basic render/i.test(_))return;const te=e.getExtension("KHR_parallel_shader_compile"),S=Ve(e,lt,ut),F=e.getExtension("EXT_color_buffer_float")?Ve(e,ct,it):null;if(!S)return;const g=Math.min(u,c)*.17+40,de=Math.sqrt(u*c)/1138,ae=Ze.map(t=>{const r=o()*Math.PI;return{cos:Math.cos(r),sin:Math.sin(r),cell:t.cell*de,stretch:t.stretch,amp:t.amp,cap:t.cap}}),ve=nt*de,v=Math.floor(o()*90)+3,oe=Math.max(4.5,Math.sqrt(u*c/9e4)),C=Math.max(60,Math.round(u/oe)),H=Math.max(60,Math.round(c/oe)),K=new Float32Array((C+1)*(H+1)*2);for(let t=0,r=0;t<=H;t++)for(let i=0;i<=C;i++)K[r++]=(i/C-.5)*u,K[r++]=(.5-t/H)*c;const V=new Uint32Array(C*H*6);for(let t=0,r=0;t<H;t++)for(let i=0;i<C;i++,r+=6){const f=t*(C+1)+i,h=f+1,s=f+C+1,x=s+1;V.set([f,s,h,h,s,x],r)}const Q=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,Q),e.bufferData(e.ARRAY_BUFFER,K,e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,V,e.STATIC_DRAW);const re=e.getParameter(e.MAX_TEXTURE_SIZE),Me=Math.min(p,re/Math.max(u,c));e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,e.createTexture()),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,vt(u,c,Me)),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const D=document.createElement("div");D.className="boot-ball-shadow",D.setAttribute("aria-hidden","true"),D.style.setProperty("--ball",`${g*2}px`),n.append(D,d),n.dataset.paper="loading";const ne={x:.16+o()*.08,y:-.2+o()*.1,z:-(.5+o()*.5)},se=o()*Math.PI*2,U=[Math.cos(se),Math.sin(se)],Ee=(t,r)=>j(.5+.5*(t/(u/2)*U[0]+r/(c/2)*U[1])/(Math.abs(U[0])+Math.abs(U[1]))),xe=u>=c,Z=o()*Math.PI*2,ce=Array.from({length:W},(t,r)=>{const i=Z+(r+(o()-.5)*.6)*Math.PI*2/W,f=Math.cos(i),h=Math.sin(i),s=g*(.45+o()*.3),x=Math.abs(xe?f:h);return{mx:f,my:h,reach:s,shut:Math.PI-(.3+(1-x)*.5+o()*.3),ajar:.16+o()*.16,at:y.open[0]+(1-x)*(y.open[1]-y.open[0])*.8+o()*(y.open[1]-y.open[0])*.2,press:Ee(f*s,h*s)}}).sort((t,r)=>r.at-t.at),L=[0,0,g*.35],ie=Array.from({length:ee},(t,r)=>{const i=r===0?0:r<6?1:2,f=i===0?1.3+o()*.25:i===1?.8+o()*.3:.1+o()*.35,h=i===1?(r-1+o()*.5)/5:(r-6+o()*.5)/8,s=Z+.4+h*Math.PI*2;return{n:[Math.cos(f)*Math.cos(s),Math.cos(f)*Math.sin(s),Math.sin(f)],reach:g*(.86+o()*.18),at:o()*110}}),ge=[];for(let t=.18+o()*.2;t<9;t+=.28+o()*.55){const r=.4+o()*.6;ge.push({at:t,rx:(o()-.5)*.05*r,ry:(o()-.5)*.06*r,rz:(o()-.5)*.05*r,face:Math.floor(o()*ee),creep:g*.035*r})}const le=t=>t<=0?0:1-Math.exp(-t*16)*Math.cos(t*24),ue=t=>{let r=0,i=0,f=0;const h=ie.map(()=>0);for(const s of ge){if(s.at>t)break;const x=le(t-s.at);r+=s.rx*x,i+=s.ry*x,f+=s.rz*x,h[s.face]=Math.min(h[s.face]+s.creep*x,g*.09)}return{open:0,sweep:0,deep:1,folds:ce.map(s=>s.shut),cage:h,scale:[1,1,1],rot:[ne.x+r,ne.y+i,ne.z+f]}},J=y.release[1]-y.release[0],ye=(t,r)=>{const i=ue(r),f=Ke(Se(t,y.grip)),h=Ye(Se(t,y.smooth)),s=-Y+(1+2*Y)*h;let x=0;const w=ie.map((k,q)=>{const T=j((t-y.release[0]-k.at)/J);return x+=T/ee,T>=1?1e7:i.cage[q]+g*(.28*ft(Math.min(1,T*2.2))+9*T*T*T)});let B=0;const _e=ce.map(k=>{const q=ht((t-k.at)/1e3);B+=j(q)/W;const T=mt(s-Y,s+Y,k.press);return Math.max(0,k.ajar+(k.shut-k.ajar)*(1-q))*T}),be=j(.12*x+.88*B),E=1-be,O=f*(1-Ke(Se(t,y.release))),pe=1-.07*O*E,$=1-Ye(Se(t,y.turn));return{open:be,sweep:h,folds:_e,cage:w,deep:1-B,scale:[pe,pe,1-.04*O*E],rot:[i.rot[0]*$,i.rot[1]*$,(i.rot[2]-.08*O)*$]}},fe=performance.now();let Te=0,A=0,M=0,b=!1,z=0;const P=[];let I=()=>{};tt(new Promise(t=>{I=t}));const N=()=>{b=!0,d.remove(),D.remove(),delete n.dataset.paper,e.getExtension("WEBGL_lose_context")?.loseContext(),I(),document.dispatchEvent(new CustomEvent("paper:flat"))};let Ae=null,me=null,he=null,X=null,Re=null,Le=null,Ie=null,Ne=null;const Be=new Float32Array(W),ke=new Float32Array(W*4),ze=new Float32Array(ee*4);let Ge=null,He=null,Xe=null;const Ce=t=>{const r=j(1-t.open);ce.forEach((f,h)=>{const s=(Math.PI-t.folds[h])/2;ke.set([f.mx*Math.cos(s),f.my*Math.cos(s),-Math.sin(s),f.reach*Math.cos(s)],h*4),Be[h]=g*We*Math.min(1,t.folds[h]/.6)}),e.uniform1fv(Ie,Be),e.uniform1f(Ne,g*We);let i=0;ie.forEach((f,h)=>{const[s,x,w]=f.n;ze.set([s,x,w,s*L[0]+x*L[1]+w*L[2]+f.reach+t.cage[h]],h*4),i+=Math.min(t.cage[h],g*.5)/ee}),e.uniform4fv(he,ke),e.uniform4fv(X,ze),e.uniform4f(Re,L[0],L[1],L[2],g+i),e.uniform1f(Le,t.deep),e.uniform1f(Ae,Math.min(t.open,1)),e.uniform1f(me,t.sweep),e.uniformMatrix3fv(Ge,!1,Et(...t.rot)),e.uniform3f(He,0,0,L[2]*r),e.uniform3f(Xe,...t.scale),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.drawElements(e.TRIANGLES,V.length,e.UNSIGNED_INT,0),D.style.opacity=String(Math.pow(r,1.5)*.9),D.style.transform=`translate(-50%, -50%) translate(${t.rot[2]*g*.12}px, 0) scale(${t.scale[0]*(1+(1-r)*3)})`},Oe=t=>{if(b||!d.isConnected){b=!0,e.getExtension("WEBGL_lose_context")?.loseContext();return}if(!Te)Te=t,z=t,setTimeout(I,qe.rest);else if(P.length<12&&(P.push(t-z),z=t,P.length===12&&[...P].sort((i,f)=>i-f)[6]>45)){N();return}const r=(t-fe)/1e3;if(A){const i=t-A;if(Ce(ye(i,M)),i>=qe.unfold){b=!0,n.dataset.paper="flat",document.dispatchEvent(new CustomEvent("paper:flat"));return}}else Ce(ue(r));requestAnimationFrame(Oe)},Je=()=>{if(!Qe(e,S)){N();return}let t=Math.ceil(u/we.gpu),r=Math.ceil(c/we.gpu);const i=e.createTexture();e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,i),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,t,r,0,e.RGBA,e.FLOAT,null);let f=!1;if(F&&Qe(e,F)){const $=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,$),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE){e.useProgram(F);const k=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,k),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const q=e.getAttribLocation(F,"aQuad");e.enableVertexAttribArray(q),e.vertexAttribPointer(q,2,e.FLOAT,!1,0,0);const T=G=>e.getUniformLocation(F,G);e.uniform2f(T("uHalf"),u/2,c/2),e.uniform4fv(T("uLayer"),ae.flatMap(G=>[G.cos,G.sin,G.cell,G.stretch])),e.uniform2fv(T("uLayerAmp"),ae.flatMap(G=>[G.amp,G.cap])),e.uniform1f(T("uNorm"),ve),e.uniform1f(T("uSeed"),v),e.viewport(0,0,t,r),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.disableVertexAttribArray(q),e.deleteBuffer(k),f=!0}e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer($)}f||(t=Math.ceil(u/we.cpu),r=Math.ceil(c/we.cpu),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,t,r,0,e.RGBA,e.FLOAT,dt(ae,ve,v,t,r,u,c))),e.useProgram(S),e.bindBuffer(e.ARRAY_BUFFER,Q);const h=e.getAttribLocation(S,"aP");e.enableVertexAttribArray(h),e.vertexAttribPointer(h,2,e.FLOAT,!1,0,0);const s=30*Math.PI/180,x=c/2/Math.tan(s/2),w=20,B=x+4e3,_e=1/Math.tan(s/2),be=new Float32Array([_e/(u/c),0,0,0,0,_e,0,0,0,0,(B+w)/(w-B),-1,0,0,2*B*w/(w-B)-x*((B+w)/(w-B)),x]),E=$=>e.getUniformLocation(S,$);e.uniform2f(E("uHalf"),u/2,c/2),e.uniform1f(E("uR"),g),e.uniform2f(E("uSweepDir"),U[0],U[1]),e.uniformMatrix4fv(E("uMvp"),!1,be),e.uniform3f(E("uEye"),0,0,x);const O=[-.42,.55,.72],pe=Math.hypot(...O);e.uniform3f(E("uLight"),O[0]/pe,O[1]/pe,O[2]/pe),e.uniform1i(E("uTex"),0),e.uniform1i(E("uCrease"),1),Ae=E("uU"),he=E("uHinge"),X=E("uCage"),Ie=E("uHingeSoft"),Ne=E("uCageSoft"),Re=E("uCore"),Le=E("uDeep"),me=E("uSweep"),Ge=E("uRot"),He=E("uPivot"),Xe=E("uScale"),e.viewport(0,0,d.width,d.height),e.enable(e.DEPTH_TEST),e.clearColor(0,0,0,0),Ce(ue(0)),n.dataset.paper="ball",requestAnimationFrame(Oe)},et=()=>!te||e.getProgramParameter(S,te.COMPLETION_STATUS_KHR)&&(!F||e.getProgramParameter(F,te.COMPLETION_STATUS_KHR)),$e=t=>{b||n.dataset.paper!=="loading"||(et()?Je():t-fe>1500?N():requestAnimationFrame($e))};requestAnimationFrame($e),document.addEventListener("boot:reveal",()=>{if(n.dataset.paper==="loading"){N();return}M=(performance.now()-fe)/1e3,A=performance.now()},{once:!0})}xt();at();
