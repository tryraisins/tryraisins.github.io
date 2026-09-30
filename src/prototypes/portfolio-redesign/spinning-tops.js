import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// Page coordinates are simulation coordinates; the camera projects an oblique
// tabletop back into the same pixel space.
export function mountSpinningTops(host, hero) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
  catch { return () => {}; }
  host.replaceChildren(renderer.domElement);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();

  const camera = new THREE.OrthographicCamera();
  const viewAngle = .68;
  const projection = Math.sin(viewAngle);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8d8175, 1.65));
  const light = new THREE.DirectionalLight(0xfff3de, 2.45);
  light.position.set(-250, 650, 200);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.bias = -.0001;
  light.shadow.normalBias = .3;
  scene.add(light, light.target);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(6000, 6000),
    new THREE.ShadowMaterial({ opacity: .2 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const metal = new THREE.MeshStandardMaterial({ color: 0x9da7b0, metalness: .82, roughness: .34 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x202733, metalness: .5, roughness: .34 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xd7ad56, metalness: .75, roughness: .27 });
  const cream = new THREE.MeshStandardMaterial({ color: 0xf2dfb4, metalness: .08, roughness: .55 });
  const woodPixels = new Uint8Array(64 * 32 * 4);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 64; x++) {
      const grain = Math.sin(x * .62 + Math.sin(y * .47) * 2.3) * 10 + Math.sin(x * .13 + y * .8) * 5;
      const offset = (y * 64 + x) * 4;
      woodPixels[offset] = 126 + grain;
      woodPixels[offset + 1] = 66 + grain * .55;
      woodPixels[offset + 2] = 35 + grain * .3;
      woodPixels[offset + 3] = 255;
    }
  }
  const woodGrain = new THREE.DataTexture(woodPixels, 64, 32, THREE.RGBAFormat);
  woodGrain.wrapS = THREE.RepeatWrapping;
  woodGrain.wrapT = THREE.RepeatWrapping;
  woodGrain.repeat.set(2.5, 1.5);
  woodGrain.colorSpace = THREE.SRGBColorSpace;
  woodGrain.needsUpdate = true;
  const wood = new THREE.MeshStandardMaterial({ color: 0xb08062, map: woodGrain, metalness: .01, roughness: .78 });
  const woodDark = new THREE.MeshStandardMaterial({ color: 0x5f301d, metalness: .02, roughness: .7 });
  const palette = [0x275ace, 0xc84231, 0xd6a926, 0x2f9d70, 0x8a5cf5, 0xe87835, 0x1e8f96, 0xd54b83, 0x719b35];
  const random = (a, b) => a + Math.random() * (b - a);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function radialShape(teeth, inner, outer, skew = 0) {
    const shape = new THREE.Shape();
    for (let i = 0; i < teeth * 2; i++) {
      const angle = i * Math.PI / teeth + skew;
      const radius = i % 2 ? inner : outer;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }

  function sampleSupportVertices(model) {
    model.updateMatrixWorld(true);
    const vertices = [];
    model.traverse((object) => {
      if (!object.isMesh || object.userData.ignoreSupport) return;
      const positions = object.geometry?.getAttribute('position');
      if (!positions) return;
      for (let i = 0; i < positions.count; i++) {
        vertices.push(new THREE.Vector3()
          .fromBufferAttribute(positions, i)
          .applyMatrix4(object.matrixWorld));
      }
    });

    // Retain directional extrema from the full transformed geometry. This is a
    // compact support hull that includes pegs, domes, blades, teeth, and studs.
    const selected = new Map();
    const direction = new THREE.Vector3();
    for (let latitude = 0; latitude <= 12; latitude++) {
      const polar = latitude * Math.PI / 12;
      for (let longitude = 0; longitude < 24; longitude++) {
        const azimuth = longitude * Math.PI / 12;
        direction.set(
          Math.sin(polar) * Math.cos(azimuth),
          Math.cos(polar),
          Math.sin(polar) * Math.sin(azimuth),
        );
        let support = vertices[0];
        let minimum = Infinity;
        for (const vertex of vertices) {
          const projection = vertex.dot(direction);
          if (projection < minimum) {
            minimum = projection;
            support = vertex;
          }
        }
        if (support) {
          const key = `${support.x.toFixed(5)},${support.y.toFixed(5)},${support.z.toFixed(5)}`;
          selected.set(key, support.clone());
        }
      }
    }
    return [...selected.values()];
  }

  function makeTop(color, index) {
    const pivot = new THREE.Group();
    const model = new THREE.Group();
    pivot.add(model);
    scene.add(pivot);
    const enamel = new THREE.MeshStandardMaterial({ color, metalness: .3, roughness: .25 });
    const accent = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color).offsetHSL(index % 2 ? .08 : -.06, .02, .11),
      metalness: .2,
      roughness: .3,
    });
    const blurMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const add = (geometry, material, y = 0, parent = model) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = y;
      mesh.castShadow = material !== blurMaterial;
      mesh.receiveShadow = material !== blurMaterial;
      parent.add(mesh);
      return mesh;
    };
    const torus = (radius, tube, material, y) => {
      const mesh = add(new THREE.TorusGeometry(radius, tube, 10, 48), material, y);
      mesh.rotation.x = Math.PI / 2;
      return mesh;
    };
    const studRing = (count, radius, y, material, studRadius = .045) => {
      for (let i = 0; i < count; i++) {
        const angle = i * Math.PI * 2 / count;
        const stud = add(new THREE.CylinderGeometry(studRadius, studRadius, .035, 10), material, y);
        stud.position.x = Math.cos(angle) * radius;
        stud.position.z = Math.sin(angle) * radius;
      }
    };

    let contactRadius = .88;
    let inertiaFactor = .52;
    let mass = 1;
    const design = index % 5;

    if (design === 0) {
      // Traditional wooden top: pear profile, painted waist stripes, tall peg.
      const profile = [[.03, 0], [.09, .08], [.18, .25], [.38, .48], [.7, .64], [.82, .77], [.64, .93], [.3, 1.04], [.13, 1.12]];
      add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 48), wood);
      torus(.69, .045, cream, .74);
      torus(.57, .04, enamel, .9);
      add(new THREE.CylinderGeometry(.095, .13, .48, 24), woodDark, 1.24);
      add(new THREE.SphereGeometry(.14, 20, 10), enamel, 1.5);
      contactRadius = .82; inertiaFactor = .43; mass = .82;
    } else if (design === 1) {
      // Rounded enamel toy: soft dome, double pinstripe, broad lower skirt.
      const profile = [[.055, 0], [.14, .12], [.27, .34], [.63, .55], [.88, .7], [.91, .83], [.7, 1.01], [.36, 1.14], [.2, 1.16]];
      add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 56), enamel);
      torus(.84, .055, cream, .79);
      torus(.7, .035, accent, .96);
      add(new THREE.CylinderGeometry(.16, .22, .3, 32), gold, 1.28);
      add(new THREE.SphereGeometry(.2, 24, 12), cream, 1.46);
      contactRadius = .93; inertiaFactor = .56; mass = 1.05;
    } else if (design === 2) {
      // Angular battle top: six offset blades around a dense weight disc.
      const profile = [[.055, 0], [.13, .08], [.17, .25], [.3, .39], [.57, .54], [.71, .63]];
      add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 40), dark);
      add(new THREE.CylinderGeometry(.84, .76, .13, 48), metal, .7);
      add(new THREE.CylinderGeometry(.65, .77, .15, 36), enamel, .82);
      for (let i = 0; i < 6; i++) {
        const shape = new THREE.Shape();
        shape.moveTo(.38, -.12);
        shape.lineTo(.76, -.25);
        shape.lineTo(1.02, -.08);
        shape.lineTo(.86, .17);
        shape.lineTo(.55, .24);
        shape.closePath();
        const blade = add(new THREE.ExtrudeGeometry(shape, {
          depth: .13, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .03, bevelThickness: .02,
        }), i % 2 ? enamel : metal, .8);
        blade.rotation.set(-Math.PI / 2, 0, i * Math.PI / 3);
      }
      add(new THREE.CylinderGeometry(.29, .35, .16, 6), gold, .98);
      studRing(6, .5, .99, dark);
      contactRadius = 1.04; inertiaFactor = .68; mass = 1.35;
    } else if (design === 3) {
      // Machined gear top: twelve scallops, exposed fasteners, recessed core.
      const profile = [[.05, 0], [.12, .08], [.17, .27], [.32, .44], [.58, .57], [.7, .65]];
      add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 40), dark);
      const gear = add(new THREE.ExtrudeGeometry(radialShape(12, .78, 1.0, Math.PI / 24), {
        depth: .17, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .025, bevelThickness: .02,
      }), metal, .69);
      gear.rotation.x = -Math.PI / 2;
      add(new THREE.CylinderGeometry(.65, .7, .19, 48), enamel, .84);
      torus(.48, .065, gold, .97);
      add(new THREE.CylinderGeometry(.28, .33, .15, 12), dark, 1.01);
      studRing(8, .58, 1.02, accent, .04);
      contactRadius = 1.03; inertiaFactor = .72; mass = 1.48;
    } else {
      // Three-lobed turbine: asymmetric-looking fins and concentric center rings.
      const profile = [[.05, 0], [.12, .09], [.16, .26], [.3, .43], [.55, .57], [.66, .65]];
      add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 40), dark);
      const rotor = add(new THREE.ExtrudeGeometry(radialShape(6, .62, 1.01, Math.PI / 12), {
        depth: .16, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .035, bevelThickness: .025,
      }), enamel, .71);
      rotor.rotation.x = -Math.PI / 2;
      add(new THREE.CylinderGeometry(.59, .69, .18, 36), accent, .86);
      torus(.48, .055, metal, .98);
      torus(.3, .045, gold, 1.03);
      add(new THREE.CylinderGeometry(.17, .24, .18, 6), dark, 1.04);
      studRing(3, .47, 1.04, cream, .055);
      contactRadius = 1.03; inertiaFactor = .64; mass = 1.22;
    }

    // Repeated silhouette families get different physical trim, collars, and
    // fastener layouts so the nine-top desktop field is not palette-swapping.
    if (index >= 5 && design === 0) {
      torus(.72, .035, woodDark, .7);
      torus(.63, .035, cream, .82);
      add(new THREE.CylinderGeometry(.16, .2, .12, 24), gold, 1.08);
    } else if (index >= 5 && design === 1) {
      torus(.82, .045, dark, .84);
      studRing(5, .56, 1.06, gold, .05);
      add(new THREE.CylinderGeometry(.11, .17, .2, 24), accent, 1.58);
    } else if (index >= 5 && design === 2) {
      torus(.89, .045, gold, .88);
      torus(.43, .035, accent, 1.04);
      add(new THREE.CylinderGeometry(.13, .2, .22, 6), enamel, 1.13);
    } else if (index >= 5 && design === 3) {
      torus(.73, .05, enamel, .77);
      add(new THREE.CylinderGeometry(.2, .31, .22, 12), gold, 1.13);
      studRing(4, .37, 1.15, cream, .055);
    }

    const support = sampleSupportVertices(model);
    const motionBlur = add(new THREE.RingGeometry(contactRadius * .72, contactRadius * 1.04, 64), blurMaterial, .77);
    motionBlur.rotation.x = -Math.PI / 2;
    motionBlur.renderOrder = 2;
    motionBlur.userData.ignoreSupport = true;

    return {
      pivot, model, motionBlur, blurMaterial, support, index, design,
      x: 0, y: 0, vx: 0, vy: 0, spin: 0, angle: 0,
      tilt: 0, tiltVelocity: 0, precession: 0, wobble: 0,
      phase: 'spinning', rest: 0, radius: 40, contactRadius, collisionRadius: 40,
      mass, inertiaFactor, inertia: 1, spinDrag: .4, active: true,
    };
  }

  const states = palette.map(makeTop);
  let topCount = window.innerWidth > 1200 ? 9 : 7;
  const particles = [];
  const sparkGeometry = new THREE.SphereGeometry(1.3, 4, 3);
  const sparkMaterial = new THREE.MeshBasicMaterial({ color: 0xffba4a });
  const scratchPoint = new THREE.Vector3();
  const tiltQuaternion = new THREE.Quaternion();
  const tiltAxis = new THREE.Vector3();
  const yAxis = new THREE.Vector3(0, 1, 0);
  let width = 1;
  let height = 1;
  let pointer = null;
  let frame = 0;
  let last = 0;
  let accumulator = 0;
  let hold = 0;
  let disposed = false;
  let collisionEnergy = 0;
  let nextMetricsAt = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const world = (x, y) => [x - width / 2, (y - height / 2) / projection];

  function setTopCount(nextCount) {
    topCount = nextCount;
    states.forEach((state, index) => {
      state.active = index < topCount;
      state.pivot.visible = state.active;
    });
    host.dataset.topCount = String(topCount);
  }

  function reset() {
    hold = 0;
    collisionEnergy = 0;
    host.dataset.hitCount = '0';
    states.forEach((state, index) => {
      if (!state.active) {
        state.phase = 'resting';
        state.rest = 0;
        state.vx = 0;
        state.vy = 0;
        return;
      }
      const margin = state.radius + 12;
      const lane = (index + random(.18, .82)) / topCount;
      state.x = margin + lane * Math.max(0, width - margin * 2);
      state.y = margin + random(0, 1) * Math.max(0, height - margin * 2);
      const launch = random(82, 172);
      const direction = random(0, Math.PI * 2);
      state.vx = Math.cos(direction) * launch;
      state.vy = Math.sin(direction) * launch;
      state.spin = random(62, 78) * (Math.random() < .22 ? -1 : 1);
      state.spinDrag = random(.66, .84) * (1 + state.design * .0125);
      state.angle = random(0, Math.PI * 2);
      state.tilt = random(.018, .05);
      state.tiltVelocity = 0;
      state.precession = random(0, Math.PI * 2);
      state.wobble = random(0, .014);
      state.phase = 'spinning';
      state.rest = 0;
    });
  }

  function resize() {
    const box = host.getBoundingClientRect();
    width = box.width;
    height = box.height;
    setTopCount(window.innerWidth > 1200 ? 9 : 7);
    renderer.setSize(width, height);
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.near = 1;
    camera.far = 5000;
    camera.position.set(0, Math.sin(viewAngle) * 1800, Math.cos(viewAngle) * 1800);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    const reach = Math.max(width, height);
    light.shadow.camera.left = -reach;
    light.shadow.camera.right = reach;
    light.shadow.camera.top = reach;
    light.shadow.camera.bottom = -reach;
    light.shadow.camera.far = 3000;
    light.shadow.camera.updateProjectionMatrix();
    states.forEach((state) => {
      state.radius = width < 620 ? 26 : 43;
      state.collisionRadius = state.radius * state.contactRadius;
      state.model.scale.setScalar(state.radius);
      state.inertia = state.inertiaFactor * state.mass * state.radius * state.radius;
    });
    reset();
    pose();
    renderer.render(scene, camera);
  }

  function burst(x, y, speed) {
    if (speed < 52 || particles.length > 36) return;
    const [wx, wz] = world(x, y);
    for (let i = 0; i < 5; i++) {
      const mesh = new THREE.Mesh(sparkGeometry, sparkMaterial);
      mesh.position.set(wx, 22, wz);
      scene.add(mesh);
      particles.push({ mesh, vx: random(-75, 75), vy: random(30, 100), vz: random(-75, 75), life: .3 });
    }
  }

  let previousScrollY = window.scrollY;
  function onScroll() {
    const scrollDelta = window.scrollY - previousScrollY;
    previousScrollY = window.scrollY;
    const nudge = Math.max(-6, Math.min(6, -scrollDelta * .035));
    if (Math.abs(nudge) < .15) return;
    states.slice(0, topCount).forEach((state) => {
      if (state.phase === 'resting') return;
      state.vy = Math.max(-165, Math.min(165, state.vy + nudge));
    });
  }

  function wall(state, nx, ny, penetration, x, y, restitution = .64) {
    state.x += nx * penetration;
    state.y += ny * penetration;
    const normalSpeed = state.vx * nx + state.vy * ny;
    if (normalSpeed >= 0) return;
    const inverseMass = 1 / state.mass;
    const normalImpulse = -(1 + restitution) * normalSpeed / inverseMass;
    state.vx += normalImpulse * nx * inverseMass;
    state.vy += normalImpulse * ny * inverseMass;
    const tx = -ny;
    const ty = nx;
    const tangentSpeed = state.vx * tx + state.vy * ty + state.spin * state.collisionRadius;
    const tangentInverseMass = inverseMass
      + state.collisionRadius * state.collisionRadius / Math.max(state.inertia, 1);
    const tangentImpulse = clamp(
      -tangentSpeed / tangentInverseMass,
      -normalImpulse * .28,
      normalImpulse * .28,
    );
    state.vx += tangentImpulse * tx * inverseMass;
    state.vy += tangentImpulse * ty * inverseMass;
    state.spin += tangentImpulse * state.collisionRadius / Math.max(state.inertia, 1);
    state.wobble = Math.min(.28, state.wobble + Math.abs(normalSpeed) * .0007);
    burst(x, y, -normalSpeed);
  }

  function collide(a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distance = Math.hypot(dx, dy);
    const combinedRadius = a.collisionRadius + b.collisionRadius;
    if (distance >= combinedRadius || distance < .001) return;
    const nx = dx / distance;
    const ny = dy / distance;
    const tx = -ny;
    const ty = nx;
    const rvx = b.vx - a.vx;
    const rvy = b.vy - a.vy;
    const normalSpeed = rvx * nx + rvy * ny;
    const severity = Math.abs(normalSpeed);
    if (normalSpeed < 0) {
      for (const state of [a, b]) {
        if (state.phase === 'resting' && severity > 42) {
          state.phase = 'rocking';
          state.rest = 0;
          state.tiltVelocity = -Math.min(.22, severity * .0015);
        }
      }
    }
    const invA = a.phase === 'resting' ? 0 : 1 / a.mass;
    const invB = b.phase === 'resting' ? 0 : 1 / b.mass;
    const inverseMass = invA + invB;
    if (!inverseMass) return;

    const overlap = combinedRadius - distance;
    a.x -= nx * overlap * invA / inverseMass;
    a.y -= ny * overlap * invA / inverseMass;
    b.x += nx * overlap * invB / inverseMass;
    b.y += ny * overlap * invB / inverseMass;
    if (normalSpeed >= 0) return;

    const energyBefore = .5 * a.mass * (a.vx * a.vx + a.vy * a.vy)
      + .5 * b.mass * (b.vx * b.vx + b.vy * b.vy)
      + .5 * a.inertia * a.spin * a.spin
      + .5 * b.inertia * b.spin * b.spin;
    const restitution = .68 + Math.min(.08, severity / 1800);
    const normalImpulse = -(1 + restitution) * normalSpeed / inverseMass;
    const jx = normalImpulse * nx;
    const jy = normalImpulse * ny;
    a.vx -= jx * invA;
    a.vy -= jy * invA;
    b.vx += jx * invB;
    b.vy += jy * invB;

    const tangentSpeed = rvx * tx + rvy * ty
      + a.spin * a.collisionRadius + b.spin * b.collisionRadius;
    const angularInvA = invA ? a.collisionRadius * a.collisionRadius / Math.max(a.inertia, 1) : 0;
    const angularInvB = invB ? b.collisionRadius * b.collisionRadius / Math.max(b.inertia, 1) : 0;
    const angularInverseMass = inverseMass + angularInvA + angularInvB;
    const idealTangentImpulse = -tangentSpeed / angularInverseMass;
    const tangentImpulse = clamp(idealTangentImpulse, -normalImpulse * .24, normalImpulse * .24);
    a.vx -= tangentImpulse * tx * invA;
    a.vy -= tangentImpulse * ty * invA;
    b.vx += tangentImpulse * tx * invB;
    b.vy += tangentImpulse * ty * invB;
    if (invA) a.spin += tangentImpulse * a.collisionRadius / Math.max(a.inertia, 1);
    if (invB) b.spin += tangentImpulse * b.collisionRadius / Math.max(b.inertia, 1);

    a.wobble = Math.min(.32, a.wobble + severity * .00075 / a.mass);
    b.wobble = Math.min(.32, b.wobble + severity * .00075 / b.mass);
    const energyAfter = .5 * a.mass * (a.vx * a.vx + a.vy * a.vy)
      + .5 * b.mass * (b.vx * b.vx + b.vy * b.vy)
      + .5 * a.inertia * a.spin * a.spin
      + .5 * b.inertia * b.spin * b.spin;
    collisionEnergy += Math.max(0, energyBefore - energyAfter);
    burst((a.x + b.x) / 2, (a.y + b.y) / 2, severity);
    host.dataset.hitCount = String(Number(host.dataset.hitCount || 0) + 1);
  }

  function stepTop(state, dt) {
    if (state.phase === 'resting') return;

    const spinMagnitude = Math.abs(state.spin);
    const gyroscopicStability = clamp((spinMagnitude - 7) / 27, 0, 1);
    const instability = 1 - gyroscopicStability;
    const wobbleFriction = state.wobble * 2.2 + instability * instability * 1.7;
    const angularLoss = (state.spinDrag + wobbleFriction) * dt;
    if (spinMagnitude <= angularLoss) state.spin = 0;
    else state.spin -= Math.sign(state.spin) * angularLoss;
    state.angle += state.spin * dt;

    if (spinMagnitude > 28 && state.tilt < .13) state.phase = 'spinning';
    else if (spinMagnitude > 5 && state.tilt < .82) state.phase = 'wobbling';
    else if (state.tilt < 1.28) state.phase = 'tipping';
    else state.phase = 'rocking';

    let targetTilt;
    let tiltSpring;
    let tiltDamping;
    if (state.phase === 'spinning') {
      targetTilt = .026 + state.wobble * .25;
      tiltSpring = 22;
      tiltDamping = 8;
    } else if (state.phase === 'wobbling') {
      targetTilt = .08 + Math.pow(instability, 1.8) * .76 + state.wobble;
      tiltSpring = 13;
      tiltDamping = 5.5;
    } else {
      targetTilt = 1.49;
      tiltSpring = state.phase === 'tipping' ? 7 : 18;
      tiltDamping = state.phase === 'tipping' ? 3.6 : 4.8;
    }
    state.tiltVelocity += (targetTilt - state.tilt) * tiltSpring * dt;
    state.tiltVelocity *= Math.exp(-tiltDamping * dt);
    state.tilt = clamp(state.tilt + state.tiltVelocity * dt, .012, 1.53);

    const precessionRate = state.phase === 'spinning'
      ? 1.3 + 17 / Math.max(spinMagnitude, 8)
      : state.phase === 'wobbling'
        ? 2.8 + instability * 7.5
        : Math.max(.35, 5.5 - state.rest * 1.35);
    state.precession += Math.sign(state.spin || 1) * precessionRate * dt;
    state.wobble *= Math.exp(-(state.phase === 'spinning' ? .22 : .55) * dt);

    const linearDrag = state.phase === 'spinning' ? .075
      : state.phase === 'wobbling' ? .2
        : state.phase === 'tipping' ? .75 : 2.6;
    state.vx *= Math.exp(-linearDrag * dt);
    state.vy *= Math.exp(-linearDrag * dt);
    state.x += state.vx * dt;
    state.y += state.vy * dt;

    const radius = state.collisionRadius + 5;
    if (state.x < radius) wall(state, 1, 0, radius - state.x, radius, state.y);
    if (state.x > width - radius) wall(state, -1, 0, state.x - width + radius, width - radius, state.y);
    if (state.y < radius) wall(state, 0, 1, radius - state.y, state.x, radius);
    if (state.y > height - radius) wall(state, 0, -1, state.y - height + radius, state.x, height - radius);
    if (pointer) {
      const dx = state.x - pointer.x;
      const dy = state.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < radius + 12) {
        wall(state, dx / distance, dy / distance, radius + 12 - distance, pointer.x, pointer.y, .68);
      }
    }

    if (state.phase === 'rocking') {
      state.rest += dt;
      const speed = Math.hypot(state.vx, state.vy);
      if (state.rest > 2.6 && speed < 3 && Math.abs(state.spin) < 1.1 && Math.abs(state.tiltVelocity) < .025) {
        state.phase = 'resting';
        state.spin = 0;
        state.vx = 0;
        state.vy = 0;
        state.tilt = 1.49;
        state.tiltVelocity = 0;
      }
    } else {
      state.rest = 0;
    }
  }

  function step(dt) {
    states.slice(0, topCount).forEach((state) => stepTop(state, dt));
    states.slice(0, topCount).forEach((a, index) => {
      states.slice(index + 1, topCount).forEach((b) => collide(a, b));
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.life -= dt;
      particle.vy -= 240 * dt;
      particle.mesh.position.x += particle.vx * dt;
      particle.mesh.position.y += particle.vy * dt;
      particle.mesh.position.z += particle.vz * dt;
      particle.mesh.scale.setScalar(Math.max(0, particle.life / .3));
      if (particle.life <= 0) {
        scene.remove(particle.mesh);
        particles.splice(i, 1);
      }
    }

    if (states.slice(0, topCount).every((state) => state.phase === 'resting')) {
      hold += dt;
      if (hold > 3) reset();
    }
  }

  function pose() {
    let totalEnergy = 0;
    for (const state of states) {
      if (!state.active) continue;
      const [x, z] = world(state.x, state.y);
      tiltAxis.set(Math.cos(state.precession), 0, Math.sin(state.precession));
      tiltQuaternion.setFromAxisAngle(tiltAxis, state.tilt);
      state.pivot.quaternion.copy(tiltQuaternion);
      state.model.rotation.y = state.angle;

      let minimumY = Infinity;
      for (const supportPoint of state.support) {
        scratchPoint.copy(supportPoint)
          .applyAxisAngle(yAxis, state.angle)
          .multiplyScalar(state.radius)
          .applyQuaternion(tiltQuaternion);
        minimumY = Math.min(minimumY, scratchPoint.y);
      }
      state.pivot.position.set(x, -minimumY + .4, z);

      const blurStrength = clamp((Math.abs(state.spin) - 24) / 46, 0, 1);
      state.blurMaterial.opacity = blurStrength * .13;
      state.motionBlur.scale.setScalar(1 + blurStrength * .08);
      state.motionBlur.visible = blurStrength > .02 && state.phase !== 'resting';
      totalEnergy += .5 * state.mass * (state.vx * state.vx + state.vy * state.vy)
        + .5 * state.inertia * state.spin * state.spin;
    }
    const now = performance.now();
    if (now >= nextMetricsAt) {
      nextMetricsAt = now + 200;
      const active = states.slice(0, topCount);
      const spins = active.map((state) => Math.abs(state.spin));
      const tilts = active.map((state) => state.tilt);
      const spinRange = [Math.min(...spins), Math.max(...spins)].map((value) => Number(value.toFixed(1)));
      const tiltRange = [Math.min(...tilts), Math.max(...tilts)].map((value) => Number(value.toFixed(2)));
      host.dataset.phases = active.map((state) => state.phase).join(',');
      host.dataset.spinRange = spinRange.join(',');
      host.dataset.topState = JSON.stringify({
        p: active.map((state) => state.phase[0]).join(''),
        s: spinRange,
        t: tiltRange,
        e: Math.round(totalEnergy),
        c: Math.round(collisionEnergy),
      });
    }
  }

  function tick(now) {
    if (disposed) return;
    const delta = Math.min(.05, (now - last) / 1000 || 0);
    last = now;
    if (!document.hidden && !reduced.matches) {
      accumulator += delta;
      while (accumulator >= 1 / 120) {
        step(1 / 120);
        accumulator -= 1 / 120;
      }
      pose();
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(tick);
  }

  const move = (event) => {
    if (event.pointerType === 'touch') return;
    const box = host.getBoundingClientRect();
    pointer = { x: event.clientX - box.left, y: event.clientY - box.top };
  };
  const leave = () => { pointer = null; };
  hero.addEventListener('pointermove', move);
  hero.addEventListener('pointerleave', leave);
  window.addEventListener('scroll', onScroll, { passive: true });
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const motionChange = () => {
    reset();
    pose();
    renderer.render(scene, camera);
  };
  reduced.addEventListener('change', motionChange);
  resize();
  frame = requestAnimationFrame(tick);

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('scroll', onScroll);
    hero.removeEventListener('pointermove', move);
    hero.removeEventListener('pointerleave', leave);
    reduced.removeEventListener('change', motionChange);
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) object.material.dispose();
    });
    woodGrain.dispose();
    sparkGeometry.dispose();
    sparkMaterial.dispose();
    environment.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
