import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Original procedural meshes. Page coordinates are simulation coordinates;
// the camera projects an oblique tabletop back into the same pixel space.
export function mountSpinningTops(host, hero) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
  catch { return () => {}; }
  host.replaceChildren(renderer.domElement);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  const camera = new THREE.OrthographicCamera();
  const viewAngle = .68, projection = Math.sin(viewAngle);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8d8175, 2.3));
  const light = new THREE.DirectionalLight(0xfff3de, 3.2);
  light.position.set(-250, 650, 200); light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.bias = -.0001;
  light.shadow.normalBias = .3;
  scene.add(light, light.target);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(6000, 6000), new THREE.ShadowMaterial({ opacity: .2 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const metal = new THREE.MeshStandardMaterial({ color: 0xbac3cc, metalness: .88, roughness: .25 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x202733, metalness: .5, roughness: .34 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd7ad56, metalness: .75, roughness: .27 });
  const states = [0x275ace, 0xc84231, 0xd6a926, 0x2f9d70, 0x8a5cf5].map((color, index) => {
    const pivot = new THREE.Group(), model = new THREE.Group();
    pivot.add(model); scene.add(pivot);
    const enamel = new THREE.MeshStandardMaterial({ color, metalness: .35, roughness: .23 });
    const add = (geometry, material, y) => {
      const mesh = new THREE.Mesh(geometry, material); mesh.position.y = y;
      mesh.castShadow = true; mesh.receiveShadow = true; model.add(mesh); return mesh;
    };
    // A solid lathed driver, machined weight disc, and domed hub.
    const profile = [[.06,0],[.13,.08],[.16,.24],[.27,.3],[.42,.39],[.58,.48],[.72,.56],[.76,.65],[.63,.72]];
    add(new THREE.LatheGeometry(profile.map(([r,y]) => new THREE.Vector2(r,y)), 48), dark, 0);
    add(new THREE.CylinderGeometry(.84,.77,.13,64), metal,.66);
    add(new THREE.CylinderGeometry(.68,.79,.15,48), enamel,.79);
    add(new THREE.CylinderGeometry(.36,.43,.13,48), metal,.91);
    add(new THREE.CylinderGeometry(.29,.34,.09,6), gold,1.01);
    add(new THREE.SphereGeometry(.22,24,12,0,Math.PI*2,0,Math.PI/2), enamel,1.045);
    const ring = add(new THREE.TorusGeometry(.58,.065,10,64),metal,.9); ring.rotation.x=Math.PI/2;
    for(let i=0;i<6;i++) {
      const shape = new THREE.Shape();
      shape.moveTo(.42,-.13); shape.lineTo(.8,-.26); shape.lineTo(1.02,-.1);
      shape.lineTo(.9,.17); shape.lineTo(.64,.24); shape.lineTo(.48,.1); shape.closePath();
      const blade = add(new THREE.ExtrudeGeometry(shape,{depth:.13,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.025}), i%2 ? enamel:metal,.81);
      blade.rotation.set(-Math.PI/2,0,i*Math.PI/3);
      const screw = add(new THREE.CylinderGeometry(.042,.042,.025,12),dark,.98);
      screw.position.x=Math.cos(i*Math.PI/3)*.48; screw.position.z=Math.sin(i*Math.PI/3)*.48;
    }
    return {pivot,model,index,x:0,y:0,vx:0,vy:0,spin:0,angle:0,age:0,life:0,tilt:0,precession:0,phase:'spinning',rest:0,radius:40,mass:1+index*.12};
  });
  const particles=[];
  const sparkGeometry=new THREE.SphereGeometry(1.3,4,3);
  const sparkMaterial=new THREE.MeshBasicMaterial({color:0xffba4a});
  let width=1,height=1,pointer=null,frame=0,last=0,accumulator=0,hold=0,elapsed=0,disposed=false,visible=true;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const random=(a,b)=>a+Math.random()*(b-a);
  const world=(x,y)=>[x-width/2,(y-height/2)/projection];
  function reset() {
    elapsed=0; hold=0; host.dataset.hitCount='0';
    states.forEach((s,i)=>{
      const a=i*Math.PI*2/5;
      // Give every cycle a different launch side: left, center, or right.
      // Each top gets its own small offset so the group does not spawn as a
      // rigid formation while remaining comfortably inside the hero bounds.
      const side=Math.floor(Math.random()*3);
      const center=side===0?width*.2:side===1?width*.5:width*.8;
      s.x=center+random(-Math.min(width*.08,56),Math.min(width*.08,56));
      s.y=Math.min(height*.3,240)+random(-42,42);
      s.x=Math.max(s.radius+12,Math.min(width-s.radius-12,s.x));
      s.vx=-Math.cos(a)*random(100,150); s.vy=-Math.sin(a)*random(100,150);
      s.spin=random(64,84); s.angle=random(0,6); s.age=0;s.life=85+random(-1.5,1.5);
      s.tilt=.03;s.precession=a;s.phase='spinning';s.rest=0;
    });
  }
  function resize() {
    const box=host.getBoundingClientRect(); width=box.width;height=box.height;
    renderer.setSize(width,height);
    camera.left=-width/2;camera.right=width/2;camera.top=height/2;camera.bottom=-height/2;camera.near=1;camera.far=5000;
    camera.position.set(0,Math.sin(viewAngle)*1800,Math.cos(viewAngle)*1800);camera.lookAt(0,0,0);camera.updateProjectionMatrix();
    const reach=Math.max(width,height); light.shadow.camera.left=-reach;light.shadow.camera.right=reach;light.shadow.camera.top=reach;light.shadow.camera.bottom=-reach;light.shadow.camera.far=3000;light.shadow.camera.updateProjectionMatrix();
    states.forEach(s=>{s.radius=width<620?26:43;s.model.scale.setScalar(s.radius);});
    reset(); pose();renderer.render(scene,camera);
  }
  function burst(x,y,speed) {
    if(speed<45||particles.length>36)return;
    const [wx,wz]=world(x,y);
    for(let i=0;i<6;i++) {const mesh=new THREE.Mesh(sparkGeometry,sparkMaterial);mesh.position.set(wx,22,wz);scene.add(mesh);particles.push({mesh,vx:random(-75,75),vy:random(30,100),vz:random(-75,75),life:.3});}
  }
  function wall(s,nx,ny,penetration,x,y) {
    s.x+=nx*penetration;s.y+=ny*penetration;
    const v=s.vx*nx+s.vy*ny;
    if(v<0){s.vx-=1.82*v*nx;s.vy-=1.82*v*ny;burst(x,y,-v);}
  }
  function step(dt) {
    elapsed+=dt;
    states.forEach(s=>{
      if(s.phase==='resting')return;
      s.age+=dt;
      const remaining=Math.max(0,1-s.age/s.life);
      s.spin=Math.max(0,65*Math.pow(remaining,.75));
      const instability=Math.max(0,1-s.spin/24);
      s.phase=remaining===0?'tumbling':instability>.05?'wobbling':'spinning';
      s.precession+=dt*(2+instability*9);
      const target=remaining===0?1.43:.025+instability*.48;
      s.tilt+=(target-s.tilt)*(1-Math.exp(-dt*(remaining===0?2.4:5)));
      if(remaining===0){s.rest+=dt;s.spin=5*Math.exp(-s.rest*2);if(s.rest>3){s.phase='resting';s.spin=0;s.vx=0;s.vy=0;}}
      s.angle+=s.spin*dt;
      const drag=s.phase==='tumbling'?2.5:.045;
      // A shallow bowl accelerates the tops smoothly towards one another.
      if(s.phase==='spinning'){s.vx+=(width*.77-s.x)*.65*dt;s.vy+=(Math.min(height*.3,240)-s.y)*.65*dt;}
      s.vx*=Math.exp(-drag*dt);s.vy*=Math.exp(-drag*dt);
      s.x+=s.vx*dt;s.y+=s.vy*dt;
      const r=s.radius+5;
      if(s.x<r)wall(s,1,0,r-s.x,r,s.y);if(s.x>width-r)wall(s,-1,0,s.x-width+r,width-r,s.y);
      if(s.y<r)wall(s,0,1,r-s.y,s.x,r);if(s.y>height-r)wall(s,0,-1,s.y-height+r,s.x,height-r);
      if(pointer){const dx=s.x-pointer.x,dy=s.y-pointer.y,d=Math.hypot(dx,dy);if(d>0&&d<r+12)wall(s,dx/d,dy/d,r+12-d,pointer.x,pointer.y);}
    });
    states.forEach((a,i)=>states.slice(i+1).forEach(b=>{
      const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),r=a.radius+b.radius;
      if(d>=r||d<.001)return;
      const nx=dx/d,ny=dy/d,ia=a.phase==='resting'?0:1/a.mass,ib=b.phase==='resting'?0:1/b.mass,sum=ia+ib;if(!sum)return;
      a.x-=nx*(r-d)*ia/sum;a.y-=ny*(r-d)*ia/sum;b.x+=nx*(r-d)*ib/sum;b.y+=ny*(r-d)*ib/sum;
      const v=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(v>=0)return;
      // Strong, slightly varied normal impulse keeps collisions energetic and
      // prevents the tops from settling into the same orbit or sticking.
      const impulse=-2.55*random(.92,1.12)*v/sum;
      a.vx-=impulse*nx*ia;a.vy-=impulse*ny*ia;b.vx+=impulse*nx*ib;b.vy+=impulse*ny*ib;
      for(const top of [a,b]){
        const speed=Math.hypot(top.vx,top.vy),limit=360;
        if(speed>limit){top.vx=top.vx/speed*limit;top.vy=top.vy/speed*limit;}
      }
      burst((a.x+b.x)/2,(a.y+b.y)/2,-v);host.dataset.hitCount=String(Number(host.dataset.hitCount||0)+1);
    }));
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.vy-=240*dt;p.mesh.position.x+=p.vx*dt;p.mesh.position.y+=p.vy*dt;p.mesh.position.z+=p.vz*dt;p.mesh.scale.setScalar(Math.max(0,p.life/.3));if(p.life<=0){scene.remove(p.mesh);particles.splice(i,1);}}
    if(states.every(s=>s.phase==='resting')){hold+=dt;if(hold>3)reset();}
  }
  function pose(){
    for(const s of states){
      const [x,z]=world(s.x,s.y);
      // Rotate the same solid object around its tip, then lift by the mesh's
      // lowest vertex so the underside remains in contact throughout a fall.
      if(s.phase!=='resting'){
        const tiltAxis=new THREE.Vector3(Math.cos(s.precession),0,Math.sin(s.precession));
        s.pivot.quaternion.setFromAxisAngle(tiltAxis,s.tilt);
        s.model.rotation.y=s.angle;
      }
      s.pivot.position.set(x,0,z);s.pivot.updateMatrixWorld(true);
      const bounds=new THREE.Box3().setFromObject(s.pivot);
      s.pivot.position.y=-bounds.min.y+.4;
    }
    host.dataset.phases=states.map(s=>s.phase).join(',');
  }
  function tick(now){
    if(disposed)return;
    const delta=Math.min(.05,(now-last)/1000||0);last=now;
    if(visible&&!document.hidden&&!reduced.matches){accumulator+=delta;while(accumulator>=1/120){step(1/120);accumulator-=1/120;}pose();renderer.render(scene,camera);}
    frame=requestAnimationFrame(tick);
  }
  const move=e=>{if(e.pointerType==='touch')return;const box=host.getBoundingClientRect();pointer={x:e.clientX-box.left,y:e.clientY-box.top};};
  const leave=()=>{pointer=null;};
  hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',leave);
  const observer=new ResizeObserver(resize);observer.observe(host);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;});intersection.observe(hero);
  const motionChange=()=>{reset();pose();renderer.render(scene,camera);};reduced.addEventListener('change',motionChange);
  resize();frame=requestAnimationFrame(tick);
  return ()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',leave);reduced.removeEventListener('change',motionChange);scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material)o.material.dispose();});environment.dispose();renderer.dispose();renderer.domElement.remove();};
}
