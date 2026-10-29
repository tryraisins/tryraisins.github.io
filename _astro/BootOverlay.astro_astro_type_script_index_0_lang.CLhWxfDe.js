import{h as Re,i as Ae}from"./boot-overlay.B-WyxcbR.js";const ue={rest:220,unfold:1150},fe={depth:.14,shade:.35},I=14,H={gpu:1.5,cpu:4},xe=`
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}`,_e=`#version 300 es
in vec2 aQuad;
uniform vec2 uHalf;
out vec2 vP;
void main() {
  vP = aQuad * uHalf;
  gl_Position = vec4(aQuad, 0.0, 1.0);
}`,Me=`#version 300 es
precision highp float;
in vec2 vP;
uniform vec4 uFold[${I}];
uniform float uFoldAmp[${I}];
uniform float uNoise;
out vec4 outColor;
${xe}
void main() {
  float h = 0.0, hx = 0.0, hy = 0.0;
  for (int i = 0; i < ${I}; i++) {
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
}`,ge=`#version 300 es
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
}`,be=`#version 300 es
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
}`,Pe=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,de=t=>Math.min(1,Math.max(0,t)),Fe=(t,o,r)=>{const a=de((r-t)/(o-t));return a*a*(3-2*a)},z=(t,o)=>{const r=Math.sin(t*127.1+o*311.7)*43758.5453;return r-Math.floor(r)};function ye(t,o){const r=Math.floor(t),a=Math.floor(o),n=t-r,s=o-a,e=n*n*(3-2*n),l=s*s*(3-2*s),f=z(r,a),h=z(r+1,a),m=z(r,a+1),E=z(r+1,a+1);return f+(h-f)*e+(m-f)*l+(f-h-m+E)*e*l}function Ue(t,o,r,a,n,s){const e=new Float32Array(r*a*4);for(let l=0,f=0;l<a;l++){const h=((l+.5)/a-.5)*s;for(let m=0;m<r;m++,f+=4){const E=((m+.5)/r-.5)*n;let M=0,F=0,C=0;t.forEach((d,T)=>{const R=Fe(.18,.72,ye(E*o+T*7.31,h*o+T*3.17));if(R===0)return;const y=(E*d.dx+h*d.dy)*d.freq+d.phase,g=y-Math.floor(y)-.5,L=Math.sqrt(g*g+4e-4),S=d.amp*R*(g/L)*d.freq;M+=d.amp*R*(L-.25),F+=S*d.dx,C+=S*d.dy}),e[f]=M,e[f+1]=F,e[f+2]=C,e[f+3]=1}}return e}function we(t,o,r){const a=document.createElement("canvas");a.width=Math.round(t*r),a.height=Math.round(o*r);const n=a.getContext("2d");n.scale(r,r),n.fillStyle="#f8f7f1",n.fillRect(0,0,t,o);const s=document.createElement("canvas");s.width=s.height=128;const e=s.getContext("2d"),l=e.createImageData(128,128);for(let h=0;h<l.data.length;h+=4){const m=Math.random()*60;l.data[h]=l.data[h+1]=l.data[h+2]=m,l.data[h+3]=Math.random()*16}e.putImageData(l,0,0),n.fillStyle=n.createPattern(s,"repeat"),n.fillRect(0,0,t,o),n.fillStyle="rgba(52,110,204,.5)";for(let h=35;h<o;h+=36)n.fillRect(0,h,t,1);const f=t<=620?28:Math.max(Math.min(Math.max(32,t*.06),96),(t-1280)/2);return n.fillStyle="rgba(214,62,56,.55)",n.fillRect(f-6,0,1.5,o),n.fillRect(f-1.5,0,1.5,o),a}function he(t,o,r){const a=t.createProgram();if(!a)return null;for(const[n,s]of[[t.VERTEX_SHADER,o],[t.FRAGMENT_SHADER,r]]){const e=t.createShader(n);if(!e)return null;t.shaderSource(e,s),t.compileShader(e),t.attachShader(a,e)}return t.linkProgram(a),a}function me(t,o){return t.getProgramParameter(o,t.LINK_STATUS)?!0:(console.warn("paper-ball:",t.getProgramInfoLog(o)),!1)}function Ce(t,o,r){const[a,n,s,e,l,f]=[Math.cos(t),Math.sin(t),Math.cos(o),Math.sin(o),Math.cos(r),Math.sin(r)];return new Float32Array([s*l,s*f,-e,n*e*l-a*f,n*e*f+a*l,n*s,a*e*l+n*f,a*e*f-n*l,a*s])}function Le(){const t=document.documentElement,o=document.getElementById("boot-overlay");if(!o||t.dataset.boot!=="pending"||matchMedia("(prefers-reduced-motion: reduce)").matches)return;const r=t.clientWidth||innerWidth,a=t.clientHeight||innerHeight,n=Math.min(devicePixelRatio||1,2),s=document.createElement("canvas");s.className="boot-ball",s.setAttribute("aria-hidden","true"),s.width=Math.round(r*n),s.height=Math.round(a*n);const e=s.getContext("webgl2",{antialias:!0,alpha:!0,premultipliedAlpha:!0,powerPreference:"high-performance",failIfMajorPerformanceCaveat:!0});if(!e)return;const l=e.getExtension("WEBGL_debug_renderer_info"),f=l?String(e.getParameter(l.UNMASKED_RENDERER_WEBGL)):"";if(/swiftshader|llvmpipe|softpipe|software|basic render/i.test(f))return;const h=e.getExtension("KHR_parallel_shader_compile"),m=he(e,ge,be),E=e.getExtension("EXT_color_buffer_float")?he(e,_e,Me):null;if(!m)return;const M=Math.min(r,a)*.17+40,F=Math.sqrt(r*a)/1138,C=.0045/F,d=Array.from({length:I},(i,u)=>{const c=(u+Math.random()*.8)/I*Math.PI,v=(50+Math.random()*280)*F;return{dx:Math.cos(c),dy:Math.sin(c),freq:1/v,phase:Math.random(),amp:v/(330*F)*(.6+Math.random()*.6)}}),T=Math.min(240,Math.max(60,Math.round(r/7))),R=Math.min(240,Math.max(60,Math.round(a/7))),y=new Float32Array((T+1)*(R+1)*2);for(let i=0,u=0;i<=R;i++)for(let c=0;c<=T;c++)y[u++]=(c/T-.5)*r,y[u++]=(.5-i/R)*a;const g=new Uint32Array(T*R*6);for(let i=0,u=0;i<R;i++)for(let c=0;c<T;c++,u+=6){const v=i*(T+1)+c,P=v+1,A=v+T+1,x=A+1;g.set([v,A,P,P,A,x],u)}const L=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,L),e.bufferData(e.ARRAY_BUFFER,y,e.STATIC_DRAW),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,e.createBuffer()),e.bufferData(e.ELEMENT_ARRAY_BUFFER,g,e.STATIC_DRAW);const S=e.getParameter(e.MAX_TEXTURE_SIZE),ve=Math.min(n,S/Math.max(r,a));e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,e.createTexture()),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,we(r,a,ve)),e.generateMipmap(e.TEXTURE_2D),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE);const b=document.createElement("div");b.className="boot-ball-shadow",b.setAttribute("aria-hidden","true"),b.style.setProperty("--ball",`${M*2}px`),o.append(b,s),o.dataset.paper="loading";const k={x:.16+Math.random()*.08,y:-.2+Math.random()*.1,z:-(.5+Math.random()*.5)},J=performance.now();let ee=0,B=0,Y=0,K=0,D=!1,V=0;const N=[];let $=()=>{};Re(new Promise(i=>{$=i}));const X=()=>{D=!0,s.remove(),b.remove(),delete o.dataset.paper,e.getExtension("WEBGL_lose_context")?.loseContext(),$(),document.dispatchEvent(new CustomEvent("paper:flat"))};let te=null,ae=null,re=null,oe=null,ne=null,G=1;const j=i=>{const u=(i-J)/1e3,c=1-B,v=c*c,P=c*k.x+v*.05*Math.sin(u*2.1),A=c*k.y+v*.07*Math.sin(u*1.6+1),x=c*k.z+v*.06*Math.sin(u*1.3+2);e.uniform1f(te,B),G=Math.max(G,c),e.uniform1f(ae,M*(.42*Math.pow(c,1.25)+fe.depth*G*(1-c))),e.uniform1f(ne,fe.shade*G),e.uniformMatrix3fv(re,!1,Ce(P,A,x)),e.uniform3f(oe,0,0,-M*c),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.drawElements(e.TRIANGLES,g.length,e.UNSIGNED_INT,0),b.style.opacity=String(Math.pow(c,1.5)*.9),b.style.transform=`translate(-50%, -50%) scale(${1+B*3})`},se=i=>{if(D||!s.isConnected){D=!0,e.getExtension("WEBGL_lose_context")?.loseContext();return}if(!ee)ee=i,V=i,setTimeout($,ue.rest);else if(N.length<12&&(N.push(i-V),V=i,N.length===12&&[...N].sort((u,c)=>u-c)[6]>45)){X();return}if(Y){const u=de((i-Y)/ue.unfold);if(B=K+(1-K)*Pe(u),u>=1){j(i),D=!0,o.dataset.paper="flat",document.dispatchEvent(new CustomEvent("paper:flat"));return}}j(i),requestAnimationFrame(se)},pe=()=>{if(!me(e,m)){X();return}let i=Math.ceil(r/H.gpu),u=Math.ceil(a/H.gpu);const c=e.createTexture();e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,c),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,i,u,0,e.RGBA,e.FLOAT,null);let v=!1;if(E&&me(e,E)){const W=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,W),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,c,0),e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE){e.useProgram(E);const le=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,le),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const Z=e.getAttribLocation(E,"aQuad");e.enableVertexAttribArray(Z),e.vertexAttribPointer(Z,2,e.FLOAT,!1,0,0);const q=_=>e.getUniformLocation(E,_);e.uniform2f(q("uHalf"),r/2,a/2),e.uniform4fv(q("uFold"),d.flatMap(_=>[_.dx,_.dy,_.freq,_.phase])),e.uniform1fv(q("uFoldAmp"),d.map(_=>_.amp)),e.uniform1f(q("uNoise"),C),e.viewport(0,0,i,u),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.disableVertexAttribArray(Z),e.deleteBuffer(le),v=!0}e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(W)}v||(i=Math.ceil(r/H.cpu),u=Math.ceil(a/H.cpu),e.texImage2D(e.TEXTURE_2D,0,e.RGBA16F,i,u,0,e.RGBA,e.FLOAT,Ue(d,C,i,u,r,a))),e.useProgram(m),e.bindBuffer(e.ARRAY_BUFFER,L);const P=e.getAttribLocation(m,"aP");e.enableVertexAttribArray(P),e.vertexAttribPointer(P,2,e.FLOAT,!1,0,0);const A=30*Math.PI/180,x=a/2/Math.tan(A/2),U=20,w=x+4e3,ce=1/Math.tan(A/2),Te=new Float32Array([ce/(r/a),0,0,0,0,ce,0,0,0,0,(w+U)/(U-w),-1,0,0,2*w*U/(U-w)-x*((w+U)/(U-w)),x]),p=W=>e.getUniformLocation(m,W);e.uniform2f(p("uHalf"),r/2,a/2),e.uniform1f(p("uC"),1/M),e.uniform1f(p("uWrap"),Math.PI*1.22),e.uniformMatrix4fv(p("uMvp"),!1,Te),e.uniform3f(p("uEye"),0,0,x);const O=[-.42,.55,.72],Q=Math.hypot(...O);e.uniform3f(p("uLight"),O[0]/Q,O[1]/Q,O[2]/Q),e.uniform1i(p("uTex"),0),e.uniform1i(p("uCrease"),1),te=p("uU"),ae=p("uA"),re=p("uRot"),oe=p("uPivot"),ne=p("uRest"),e.viewport(0,0,s.width,s.height),e.enable(e.DEPTH_TEST),e.clearColor(0,0,0,0),j(performance.now()),o.dataset.paper="ball",requestAnimationFrame(se)},Ee=()=>!h||e.getProgramParameter(m,h.COMPLETION_STATUS_KHR)&&(!E||e.getProgramParameter(E,h.COMPLETION_STATUS_KHR)),ie=i=>{D||o.dataset.paper!=="loading"||(Ee()?pe():i-J>1500?X():requestAnimationFrame(ie))};requestAnimationFrame(ie),document.addEventListener("boot:reveal",()=>{if(o.dataset.paper==="loading"){X();return}K=B,Y=performance.now()},{once:!0})}Le();Ae();
