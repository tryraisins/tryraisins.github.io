import{h as st,i as ct}from"./boot-overlay.I7lpWlSt.js";const _e={crumple:780,rest:200,unfold:1600},U={crease:[0,420],fold:[40,560],flap:340,close:[300,700],squeeze:[600,780],turn:[120,720]},A={grip:[0,150],release:[110,600],open:[320,860],turn:[200,1200],smooth:[1e3,1600]},q=8,le=14,it=4,lt=2,Fe={decay:6.6,rate:6.9},Q=.24,Ie={ball:.07,open:.14,rest:.07},Je=.035,et={open:.45,rest:.28},ot=[{cell:210,cap:.15,stretch:1.45,amp:1.3},{cell:92,cap:.17,stretch:1.25,amp:.7},{cell:38,cap:.2,stretch:1.1,amp:.25}],Le=ot.length,ut=95,Ue={gpu:1.5,cpu:4},ft=`
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}`,ht=`#version 300 es
in vec2 aQuad;
uniform vec2 uHalf;
out vec2 vP;
void main() {
  vP = aQuad * uHalf;
  gl_Position = vec4(aQuad, 0.0, 1.0);
}`,mt=`#version 300 es
precision highp float;
in vec2 vP;
uniform vec4 uLayer[${Le}];    // cos, sin, cell (px), stretch
uniform vec2 uLayerAmp[${Le}]; // strength, cap
uniform float uNorm;
uniform float uSeed;
out vec4 outColor;
${ft}
vec2 point(vec2 c) { return 0.12 + 0.76 * vec2(hash(c), hash(c + vec2(17.3, 41.9))); }
void main() {
  float h = 0.0, fine = 0.0;
  vec2 grad = vec2(0.0);
  for (int l = 0; l < ${Le}; l++) {
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
}`,pt=`#version 300 es
in vec2 aP;             // flat position (px from the centre, y up)
uniform sampler2D uCrease;
uniform float uU;       // 0 = balled up, 1 = open (but still crumpled)
uniform float uSweep;   // how far the smoothing palm has crossed the sheet
uniform vec2 uSweepDir;
uniform float uR;       // radius of the ball (px)
uniform vec2 uHalf;     // half the sheet size (px)
uniform vec4 uHinge[${q}]; // fold planes: unit normal, offset
uniform float uHingeSoft[${q}];
uniform vec4 uCage[${le}];
uniform float uCageSoft;
uniform vec4 uCore;     // middle of the wad, and its radius
uniform float uDeep;    // how much shade the inside of the wad holds
uniform float uCreased; // 0 = a fresh sheet, 1 = its small creases are in
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
  float front = mix(-${Q}, 1.0 + ${Q}, uSweep);
  return 1.0 - smoothstep(front - ${Q}, front + ${Q}, s);
}

void main() {
  vec3 p = vec3(aP, 0.0), tx = vec3(1.0, 0.0, 0.0), ty = vec3(0.0, 1.0, 0.0);
  for (int i = 0; i < ${it}; i++)
    for (int k = 0; k < ${q}; k++) fold(uHinge[k], uHingeSoft[k], p, tx, ty);
  for (int i = 0; i < ${lt}; i++) {
    for (int k = 0; k < ${le}; k++) fold(uCage[k], uCageSoft, p, tx, ty);
    // The desk.
    if (p.z < 0.0) { p.z = -p.z; tx.z = -tx.z; ty.z = -ty.z; }
  }
  vec3 nrm = normalize(cross(tx, ty));

  vCuv = 0.5 + aP / (2.0 * uHalf);
  float sm = smoothedAt(aP);
  float depth = mix(mix(${Ie.open}, ${Ie.ball}, pow(1.0 - uU, 1.25)), ${Ie.rest}, sm);
  vA = uR * depth * uCreased;
  vCrumple = mix(max(1.0 - uU, ${et.open}), ${et.rest}, sm) * uCreased;
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
}`,dt=`#version 300 es
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
}`,Ne=a=>a<.5?4*a*a*a:1-Math.pow(-2*a+2,3)/2,Be=a=>1-Math.pow(1-a,3),vt=a=>1+2.4*Math.pow(a-1,3)+1.4*Math.pow(a-1,2),Et=(a,n,l)=>{const m=S((l-a)/(n-a));return m*m*(3-2*m)},xt=a=>a<=0?0:1-Math.exp(-6.6*a)*(Math.cos(Fe.rate*a)+Fe.decay/Fe.rate*Math.sin(Fe.rate*a)),S=a=>Math.min(1,Math.max(0,a)),ie=(a,[n,l])=>S((a-n)/(l-n));function gt(a){let n=a>>>0;return()=>{n=n+1831565813>>>0;let l=n;return l=Math.imul(l^l>>>15,l|1),l^=l+Math.imul(l^l>>>7,l|61),((l^l>>>14)>>>0)/4294967296}}const De=(a,n)=>{const l=Math.sin(a*127.1+n*311.7)*43758.5453;return l-Math.floor(l)};function Tt(a,n,l,m,o,u,i){const v=new Float32Array(m*o*4),E=(y,w)=>.12+.76*De(y,w),e=(y,w)=>.12+.76*De(y+17.3,w+41.9);for(let y=0,w=0;y<o;y++){const ue=((y+.5)/o-.5)*i;for(let D=0;D<m;D++,w+=4){const I=((D+.5)/m-.5)*u;let g=0,Ee=0,fe=0,xe=0;a.forEach((x,he)=>{const L=(x.cos*I+x.sin*ue)/x.cell,$=(-x.sin*I+x.cos*ue)*x.stretch/x.cell,Z=l+he*13.7,J=he*29.1,ee=Math.floor(L),me=Math.floor($),Pe=L-ee,N=$-me;let H=8,pe=0,B=0,ge=0,Te=0;for(let C=-1;C<=1;C++)for(let F=-1;F<=1;F++){const _=ee+F+Z,P=me+C+J,k=F+E(_,P)-Pe,b=C+e(_,P)-N,X=k*k+b*b;X<H&&(H=X,ge=k,Te=b,pe=F,B=C)}let te=8,ae=1,z=0;for(let C=-2;C<=2;C++)for(let F=-2;F<=2;F++){const _=pe+F,P=B+C,k=ee+_+Z,b=me+P+J,X=_+E(k,b)-Pe,ne=P+e(k,b)-N,se=X-ge,W=ne-Te,j=Math.hypot(se,W);if(j*j>1e-5){const ye=(.5*(ge+X)*se+.5*(Te+ne)*W)/j;ye<te&&(te=ye,ae=se/j,z=W/j)}}const oe=ee+pe+Z,Me=me+B+J,de=x.amp*(De(oe+5.1,Me+9.7)<.5?-1:1)*(.45+.75*De(oe+2.3,Me+7.9)),Ae=x.cap*.35,re=S(.5+.5*(x.cap-te)/Ae),be=x.cap+(te-x.cap)*re-Ae*re*(1-re);g+=de*be*x.cell/n,he>0&&(xe+=de*be*x.cell/n);const Re=-ae*de*re/n,Se=-z*de*re/n*x.stretch;Ee+=x.cos*Re-x.sin*Se,fe+=x.sin*Re+x.cos*Se}),v[w]=g,v[w+1]=Ee,v[w+2]=fe,v[w+3]=xe}}return v}function Mt(a,n,l){const m=document.createElement("canvas");m.width=Math.round(a*l),m.height=Math.round(n*l);const o=m.getContext("2d");o.scale(l,l),o.fillStyle="#f8f7f1",o.fillRect(0,0,a,n);const u=document.createElement("canvas");u.width=u.height=128;const i=u.getContext("2d"),v=i.createImageData(128,128);for(let e=0;e<v.data.length;e+=4){const y=Math.random()*60;v.data[e]=v.data[e+1]=v.data[e+2]=y,v.data[e+3]=Math.random()*16}i.putImageData(v,0,0),o.fillStyle=o.createPattern(u,"repeat"),o.fillRect(0,0,a,n),o.fillStyle="rgba(52,110,204,.5)";for(let e=35;e<n;e+=36)o.fillRect(0,e,a,1);const E=a<=620?28:Math.max(Math.min(Math.max(32,a*.06),96),(a-1280)/2);return o.fillStyle="rgba(214,62,56,.55)",o.fillRect(E-6,0,1.5,n),o.fillRect(E-1.5,0,1.5,n),m}function tt(a,n,l){const m=a.createProgram();if(!m)return null;for(const[o,u]of[[a.VERTEX_SHADER,n],[a.FRAGMENT_SHADER,l]]){const i=a.createShader(o);if(!i)return null;a.shaderSource(i,u),a.compileShader(i),a.attachShader(m,i)}return a.linkProgram(m),m}function at(a,n){return a.getProgramParameter(n,a.LINK_STATUS)?!0:(console.warn("paper-ball:",a.getProgramInfoLog(n)),!1)}function At(a,n,l){const[m,o,u,i,v,E]=[Math.cos(a),Math.sin(a),Math.cos(n),Math.sin(n),Math.cos(l),Math.sin(l)];return new Float32Array([u*v,u*E,-i,o*i*v-m*E,o*i*E+m*v,o*u,m*i*v+o*E,m*i*E-o*v,m*u])}function Rt(){const a=document.documentElement,n=document.getElementById("boot-overlay");if(!n||a.dataset.boot!=="pending"||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const m=Number(null?.get("paper-seed")),o=gt(Number.isFinite(m)&&m>0?m:Math.random()*2**32>>>0),u=a.clientWidth||innerWidth,i=a.clientHeight||innerHeight,v=Math.min(devicePixelRatio||1,2),E=document.createElement("canvas");E.className="boot-ball",E.setAttribute("aria-hidden","true"),E.width=Math.round(u*v),E.height=Math.round(i*v);const e=E.getContext("webgl2",{antialias:!0,alpha:!0,premultipliedAlpha:!0,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!0});if(!e)return;const y=e.getExtension("WEBGL_debug_renderer_info"),w=y?String(e.getParameter(y.UNMASKED_RENDERER_WEBGL)):"";if(/swiftshader|llvmpipe|softpipe|software|basic render/i.test(w))return;const ue=e.getExtension("KHR_parallel_shader_compile"),D=tt(e,pt,dt),I=e.getExtension("EXT_color_buffer_float")?tt(e,ht,mt):null;if(!D)return;const g=Math.min(u,i)*.17+40,Ee=Math.sqrt(u*i)/1138,fe=ot.map(t=>{const r=o()*Math.PI;return{cos:Math.cos(r),sin:Math.sin(r),cell:t.cell*Ee,stretch:t.stretch,amp:t.amp,cap:t.cap}}),xe=ut*Ee,x=Math.floor(o()*90)+3,he=Math.max(4.5,Math.sqrt(u*i/9e4)),L=Math.max(60,Math.round(u/he)),$=Math.max(60,Math.round(i/he)),Z=new Float32Array((L+1)*($+1)*2);for(let t=0,r=0;t<=$;t++)for(let c=0;c<=L;c++)Z[r++]=(c/L-.5)*u,Z[r++]=(.5-t/$)*i;const J=new Uint32Array(L*$*6);for(let t=0,r=0;t<$;t++)for(let c=0;c<L;c++,r+=6){const f=t*(L+1)+c,h=f+1,s=f+L+1,p=s+1;J.set([f,s,h,h,s,p],r)}const ee=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,ee),e.bufferData(e.ARRAY_BUFFER,Z,e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,J,e.STATIC_DRAW);const me=e.getParameter(e.MAX_TEXTURE_SIZE),Pe=Math.min(v,me/Math.max(u,i));e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,e.createTexture()),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,Mt(u,i,Pe)),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const N=document.createElement("div");N.className="boot-ball-shadow",N.setAttribute("aria-hidden","true"),N.style.setProperty("--ball",`${g*2}px`),n.append(N,E),n.dataset.paper="loading";const H={x:.16+o()*.08,y:-.2+o()*.1,z:-(.5+o()*.5)},pe=o()*Math.PI*2,B=[Math.cos(pe),Math.sin(pe)],ge=(t,r)=>S(.5+.5*(t/(u/2)*B[0]+r/(i/2)*B[1])/(Math.abs(B[0])+Math.abs(B[1]))),Te=u>=i,te=o()*Math.PI*2,ae=Array.from({length:q},(t,r)=>{const c=te+(r+(o()-.5)*.6)*Math.PI*2/q,f=Math.cos(c),h=Math.sin(c),s=g*(.45+o()*.3),p=Math.abs(Te?f:h);return{mx:f,my:h,reach:s,shut:Math.PI-(.3+(1-p)*.5+o()*.3),ajar:.16+o()*.16,at:A.open[0]+(1-p)*(A.open[1]-A.open[0])*.8+o()*(A.open[1]-A.open[0])*.2,press:ge(f*s,h*s)}}).sort((t,r)=>r.at-t.at),z=[0,0,g*.35],oe=Array.from({length:le},(t,r)=>{const c=r===0?0:r<6?1:2,f=c===0?1.3+o()*.25:c===1?.8+o()*.3:.1+o()*.35,h=c===1?(r-1+o()*.5)/5:(r-6+o()*.5)/8,s=te+.4+h*Math.PI*2;return{n:[Math.cos(f)*Math.cos(s),Math.cos(f)*Math.sin(s),Math.sin(f)],reach:g*(.86+o()*.18),at:o()*110}}),Me=[];for(let t=.18+o()*.2;t<9;t+=.28+o()*.55){const r=.4+o()*.6;Me.push({at:t,rx:(o()-.5)*.05*r,ry:(o()-.5)*.06*r,rz:(o()-.5)*.05*r,face:Math.floor(o()*le),creep:g*.035*r})}const de=t=>t<=0?0:1-Math.exp(-t*16)*Math.cos(t*24),Ae=t=>{let r=0,c=0,f=0;const h=oe.map(()=>0);for(const s of Me){if(s.at>t)break;const p=de(t-s.at);r+=s.rx*p,c+=s.ry*p,f+=s.rz*p,h[s.face]=Math.min(h[s.face]+s.creep*p,g*.09)}return{open:0,sweep:0,deep:1,creased:1,folds:ae.map(s=>s.shut),cage:h,scale:[1,1,1],rot:[H.x+r,H.y+c,H.z+f]}},re=A.open[1]-A.open[0],be=U.fold[1]-U.fold[0]-U.flap,Re=t=>{let r=0;const c=ae.map(p=>{const T=S((p.at-A.open[0])/re),M=S((t-U.fold[0]-(1-T)*be)/U.flap),ce=M*M*(3-2*M)-.05*Math.sin(Math.PI*M)*M;return r+=ce/q,p.shut*ce}),f=Math.sin(Math.PI*ie(t,U.squeeze)),h=oe.map(p=>{const T=S((t-U.close[0]-p.at*.6)/(U.close[1]-U.close[0]-66));return T<=0?1e7:g*(9*Math.pow(1-T,3)-.07*f)}),s=Ne(ie(t,U.turn));return{open:S(1-r),sweep:0,deep:r,folds:c,cage:h,creased:Be(ie(t,U.crease)),scale:[1,1,1],rot:[H.x*s,H.y*s,H.z*s]}},Se=A.release[1]-A.release[0],C=(t,r)=>{const c=Ae(r),f=Be(ie(t,A.grip)),h=Ne(ie(t,A.smooth)),s=-Q+(1+2*Q)*h;let p=0;const T=oe.map((G,V)=>{const R=S((t-A.release[0]-G.at)/Se);return p+=R/le,R>=1?1e7:c.cage[V]+g*(.28*vt(Math.min(1,R*2.2))+9*R*R*R)});let M=0;const ce=ae.map(G=>{const V=xt((t-G.at)/1e3);M+=S(V)/q;const R=Et(s-Q,s+Q,G.press);return Math.max(0,G.ajar+(G.shut-G.ajar)*(1-V))*R}),Ce=S(.12*p+.88*M),d=1-Ce,Y=f*(1-Be(ie(t,A.release))),ve=1-.07*Y*d,K=1-Ne(ie(t,A.turn));return{open:Ce,sweep:h,folds:ce,cage:T,creased:1,deep:1-M,scale:[ve,ve,1-.04*Y*d],rot:[c.rot[0]*K,c.rot[1]*K,(c.rot[2]-.08*Y)*K]}},F=performance.now();let _=0,P=0,k=0,b=!1,X=0;const ne=[];let se=()=>{};st(new Promise(t=>{se=t}));const W=()=>{b=!0,E.remove(),N.remove(),delete n.dataset.paper,e.getExtension("WEBGL_lose_context")?.loseContext(),se(),document.dispatchEvent(new CustomEvent("paper:flat"))};let j=null,ye=null,ze=null,ke=null,Ge=null,He=null,Xe=null,Oe=null,qe=null;const $e=new Float32Array(q),We=new Float32Array(q*4),je=new Float32Array(le*4);let Ye=null,Ke=null,Ve=null;const we=t=>{const r=S(1-t.open);ae.forEach((f,h)=>{const s=(Math.PI-t.folds[h])/2;We.set([f.mx*Math.cos(s),f.my*Math.cos(s),-Math.sin(s),f.reach*Math.cos(s)],h*4),$e[h]=g*Je*Math.min(1,t.folds[h]/.6)}),e.uniform1fv(Oe,$e),e.uniform1f(qe,g*Je);let c=0;oe.forEach((f,h)=>{const[s,p,T]=f.n;je.set([s,p,T,s*z[0]+p*z[1]+T*z[2]+f.reach+t.cage[h]],h*4),c+=Math.min(t.cage[h],g*.5)/le}),e.uniform4fv(ze,We),e.uniform4fv(ke,je),e.uniform4f(Ge,z[0],z[1],z[2],g+c),e.uniform1f(He,t.deep),e.uniform1f(Xe,t.creased),e.uniform1f(j,Math.min(t.open,1)),e.uniform1f(ye,t.sweep),e.uniformMatrix3fv(Ye,!1,At(...t.rot)),e.uniform3f(Ke,0,0,z[2]*r),e.uniform3f(Ve,...t.scale),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.drawElements(e.TRIANGLES,J.length,e.UNSIGNED_INT,0),N.style.opacity=String(Math.pow(r,1.5)*.9),N.style.transform=`translate(-50%, -50%) translate(${t.rot[2]*g*.12}px, 0) scale(${t.scale[0]*(1+(1-r)*3)})`},Qe=t=>{if(b||!E.isConnected){b=!0,e.getExtension("WEBGL_lose_context")?.loseContext();return}if(!_)_=t,X=t,setTimeout(se,_e.crumple+_e.rest);else if(ne.length<12&&(ne.push(t-X),X=t,ne.length===12&&[...ne].sort((c,f)=>c-f)[6]>45)){W();return}const r=_+_e.crumple;if(t<r)we(Re(t-_));else if(P){P<r&&(P=t,k=0);const c=t-P;if(we(C(c,k)),c>=_e.unfold){b=!0,n.dataset.paper="flat",document.dispatchEvent(new CustomEvent("paper:flat"));return}}else we(Ae((t-r)/1e3));requestAnimationFrame(Qe)},rt=()=>{if(!at(e,D)){W();return}let t=Math.ceil(u/Ue.gpu),r=Math.ceil(i/Ue.gpu);const c=e.createTexture();e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,t,r,0,e.RGBA,e.FLOAT,null);let f=!1;if(I&&at(e,I)){const K=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,K),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,c,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE){e.useProgram(I);const G=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,G),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const V=e.getAttribLocation(I,"aQuad");e.enableVertexAttribArray(V),e.vertexAttribPointer(V,2,e.FLOAT,!1,0,0);const R=O=>e.getUniformLocation(I,O);e.uniform2f(R("uHalf"),u/2,i/2),e.uniform4fv(R("uLayer"),fe.flatMap(O=>[O.cos,O.sin,O.cell,O.stretch])),e.uniform2fv(R("uLayerAmp"),fe.flatMap(O=>[O.amp,O.cap])),e.uniform1f(R("uNorm"),xe),e.uniform1f(R("uSeed"),x),e.viewport(0,0,t,r),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.disableVertexAttribArray(V),e.deleteBuffer(G),f=!0}e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(K)}f||(t=Math.ceil(u/Ue.cpu),r=Math.ceil(i/Ue.cpu),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,t,r,0,e.RGBA,e.FLOAT,Tt(fe,xe,x,t,r,u,i))),e.useProgram(D),e.bindBuffer(e.ARRAY_BUFFER,ee);const h=e.getAttribLocation(D,"aP");e.enableVertexAttribArray(h),e.vertexAttribPointer(h,2,e.FLOAT,!1,0,0);const s=30*Math.PI/180,p=i/2/Math.tan(s/2),T=20,M=p+4e3,ce=1/Math.tan(s/2),Ce=new Float32Array([ce/(u/i),0,0,0,0,ce,0,0,0,0,(M+T)/(T-M),-1,0,0,2*M*T/(T-M)-p*((M+T)/(T-M)),p]),d=K=>e.getUniformLocation(D,K);e.uniform2f(d("uHalf"),u/2,i/2),e.uniform1f(d("uR"),g),e.uniform2f(d("uSweepDir"),B[0],B[1]),e.uniformMatrix4fv(d("uMvp"),!1,Ce),e.uniform3f(d("uEye"),0,0,p);const Y=[-.42,.55,.72],ve=Math.hypot(...Y);e.uniform3f(d("uLight"),Y[0]/ve,Y[1]/ve,Y[2]/ve),e.uniform1i(d("uTex"),0),e.uniform1i(d("uCrease"),1),j=d("uU"),ze=d("uHinge"),ke=d("uCage"),Oe=d("uHingeSoft"),qe=d("uCageSoft"),Ge=d("uCore"),He=d("uDeep"),Xe=d("uCreased"),ye=d("uSweep"),Ye=d("uRot"),Ke=d("uPivot"),Ve=d("uScale"),e.viewport(0,0,E.width,E.height),e.enable(e.DEPTH_TEST),e.clearColor(0,0,0,0),we(Re(0)),n.dataset.paper="ball",requestAnimationFrame(Qe)},nt=()=>!ue||e.getProgramParameter(D,ue.COMPLETION_STATUS_KHR)&&(!I||e.getProgramParameter(I,ue.COMPLETION_STATUS_KHR)),Ze=t=>{b||n.dataset.paper!=="loading"||(nt()?rt():t-F>1500?W():requestAnimationFrame(Ze))};requestAnimationFrame(Ze),document.addEventListener("boot:reveal",()=>{if(n.dataset.paper==="loading"){W();return}P=performance.now(),k=_?Math.max(0,(P-_-_e.crumple)/1e3):0},{once:!0})}Rt();ct();
