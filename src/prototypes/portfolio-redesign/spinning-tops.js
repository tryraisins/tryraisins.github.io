import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { createCollisionSparks } from './spinning-top-effects.js';

// Page coordinates are simulation coordinates; the camera projects an oblique
// tabletop back into the same pixel space. Each top lands, sleeps, precesses
// faster as it slows, wobbles, rolls round on its rim and comes to rest.
export function mountSpinningTops(host, hero, { pad = null, ring = null } = {}) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); }
  catch { return () => {}; }
  // Reading shader status after every link forces the driver to finish
  // compiling on the main thread; compileAsync below does that work off it.
  renderer.debug.checkShaderErrors = false;
  // A graphite layer under the tops records tip paths. It is a soft smudge, so
  // it never needs a retina-sized buffer.
  const trailCanvas = document.createElement('canvas');
  const trail = trailCanvas.getContext('2d');
  host.replaceChildren(trailCanvas, renderer.domElement);
  // Devices are guessed into a quality tier up front and a frame-time watchdog
  // can drop one more tier while the page runs. Old integrated GPUs (a 2013
  // MacBook among them) are the reason this exists.
  let tier = detectTier();
  let pixelRatio = ratioFor(tier);
  const trailRatio = Math.min(pixelRatio, 1);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = tier < 2;
  // three r186 renders PCFSoftShadowMap as PCF anyway; naming PCF directly
  // keeps precompiled programs identical to the ones the renderer uses.
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.04;

  const scene = new THREE.Scene();
  // The studio reflections are baked once the shaders are ready (see prepare).
  let environment = null;

  const camera = new THREE.OrthographicCamera();
  // An orthographic 55-degree tabletop view exposes the blade faces and driver
  // without perspective scaling changing pointer and collision alignment.
  const viewAngle = Math.PI * 55 / 180;
  const projection = Math.sin(viewAngle);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8d8175, 1));
  const light = new THREE.DirectionalLight(0xfff6e8, 2.2);
  light.position.set(-250, 650, 200);
  light.castShadow = tier < 2;
  light.shadow.mapSize.set(tier === 0 ? 1024 : 512, tier === 0 ? 1024 : 512);
  light.shadow.bias = -.0001;
  light.shadow.normalBias = .3;
  light.shadow.radius = 4;
  scene.add(light, light.target);
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(6000, 6000),
    new THREE.ShadowMaterial({ opacity: .22 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const canvasTexture = (size, draw) => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    draw(canvas.getContext('2d'), size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };
  // Concentric streaks: what a camera sees of blades and studs at speed.
  const streakTexture = canvasTexture(256, (context, size) => {
    const centre = size / 2;
    for (let radius = 4; radius < centre; radius += 1.5) {
      context.strokeStyle = `rgba(255,255,255,${.35 + Math.random() * .65})`;
      context.lineWidth = 1.6;
      context.beginPath();
      context.arc(centre, centre, radius, 0, Math.PI * 2);
      context.stroke();
    }
  });
  const contactTexture = canvasTexture(64, (context, size) => {
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, 'rgba(0,0,0,1)');
    gradient.addColorStop(.35, 'rgba(0,0,0,.55)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
  });

  const finishPixels = new Uint8Array(32 * 32 * 4);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const offset = (y * 32 + x) * 4;
      const grain = 180 + Math.sin(y * 2.1) * 20 + Math.sin(x * 3.4 + y) * 8;
      finishPixels[offset] = finishPixels[offset + 1] = finishPixels[offset + 2] = grain;
      finishPixels[offset + 3] = 255;
    }
  }
  const finish = new THREE.DataTexture(finishPixels, 32, 32, THREE.RGBAFormat);
  finish.wrapS = finish.wrapT = THREE.RepeatWrapping;
  finish.repeat.set(3, 2);
  finish.needsUpdate = true;
  const steel = new THREE.MeshStandardMaterial({ color: 0x9aa2ab, metalness: 1, roughness: .34, roughnessMap: finish });
  const gunmetal = new THREE.MeshStandardMaterial({ color: 0x2a2f36, metalness: .7, roughness: .42 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xc39a4a, metalness: 1, roughness: .3, roughnessMap: finish });
  const cream = new THREE.MeshStandardMaterial({ color: 0xf2dfb4, metalness: .05, roughness: .5 });
  const woodPixels = new Uint8Array(128 * 64 * 4);
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 128; x++) {
      // Growth rings disturbed by slow noise, plus fine fibre.
      const ring = Math.sin((y + Math.sin(x * .07) * 5 + Math.sin(x * .023 + 1.3) * 9) * .55);
      const grain = ring * 14 + Math.sin(y * 3.1 + x * .2) * 3 + (Math.random() - .5) * 6;
      const offset = (y * 128 + x) * 4;
      woodPixels[offset] = 190 + grain;
      woodPixels[offset + 1] = 128 + grain * .72;
      woodPixels[offset + 2] = 70 + grain * .42;
      woodPixels[offset + 3] = 255;
    }
  }
  const woodGrain = new THREE.DataTexture(woodPixels, 128, 64, THREE.RGBAFormat);
  woodGrain.wrapS = THREE.RepeatWrapping;
  woodGrain.wrapT = THREE.RepeatWrapping;
  woodGrain.repeat.set(2, 1.4);
  woodGrain.colorSpace = THREE.SRGBColorSpace;
  woodGrain.needsUpdate = true;
  const wood = new THREE.MeshStandardMaterial({ color: 0xffe2b8, map: woodGrain, metalness: .01, roughness: .58 });
  const woodDark = new THREE.MeshStandardMaterial({ color: 0x5f301d, metalness: .02, roughness: .62 });
  // Five silhouettes: turned wood, lithographed tin, steel blades, a machined
  // brass gear and a three-fin turbine. Wide screens repeat the first three
  // in new colours.
  const palette = [0x2346b5, 0xc8372b, 0x275ace, 0x3a4048, 0xe87835, 0x2f9d70, 0xd9a21e, 0x7a3fb8];
  const random = (a, b) => a + Math.random() * (b - a);
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function radialShape(teeth, inner, outer, skew = 0) {
    const shape = new THREE.Shape();
    for (let i = 0; i < teeth * 4; i++) {
      const angle = i * Math.PI / (teeth * 2) + skew;
      const radius = i % 4 < 2 ? outer : inner;
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
    // Baked geometry repeats each corner for every triangle that uses it, so
    // keep one copy of each before the directional search.
    const unique = new Map();
    const vertex = new THREE.Vector3();
    model.traverse((object) => {
      if (!object.isMesh || object.userData.ignoreSupport) return;
      const positions = object.geometry?.getAttribute('position');
      if (!positions) return;
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i).applyMatrix4(object.matrixWorld);
        const key = `${vertex.x.toFixed(4)},${vertex.y.toFixed(4)},${vertex.z.toFixed(4)}`;
        if (!unique.has(key)) unique.set(key, vertex.clone());
      }
    });
    const vertices = [...unique.values()];

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
          const value = vertex.dot(direction);
          if (value < minimum) {
            minimum = value;
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
    const design = index % 5;
    // One standard material covers every silhouette. The tin top used to carry
    // a clearcoat, which costs a second specular lobe per pixel and is invisible
    // on a 56px toy, so it now reads as lacquer through roughness alone.
    const enamel = new THREE.MeshStandardMaterial({
      color,
      metalness: design === 1 ? .45 : .08,
      roughness: design === 1 ? .16 : .32,
    });
    const accent = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color).offsetHSL(index % 2 ? .035 : -.035, -.08, -.09),
      metalness: .06,
      roughness: .4,
    });
    // Asymmetric parts (blades, teeth, fins, fasteners) are what strobe at
    // speed, so they are baked separately and fade into a blur disc.
    const add = (geometry, material, y = 0, detail = false) => {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.y = y;
      mesh.userData.detail = detail;
      model.add(mesh);
      return mesh;
    };
    const torus = (radius, tube, material, y) => {
      const mesh = add(new THREE.TorusGeometry(radius, tube, 6, 32), material, y);
      mesh.rotation.x = Math.PI / 2;
      return mesh;
    };
    const studRing = (count, radius, y, material, studRadius = .045) => {
      const fastener = new THREE.CylinderGeometry(studRadius, studRadius, .025, 6);
      for (let i = 0; i < count; i++) {
        const angle = i * Math.PI * 2 / count;
        const stud = add(fastener, material, y, true);
        stud.position.x = Math.cos(angle) * radius;
        stud.position.z = Math.sin(angle) * radius;
      }
    };

    let contactRadius = .88;
    let inertiaFactor = .52;
    let mass = 1;

    if (design === 0) {
      // Traditional wooden top: pear profile, painted waist stripes, tall peg.
      const profile = [[.025, 0], [.05, .06], [.12, .22], [.3, .43], [.58, .62], [.76, .76], [.82, .86], [.8, .95], [.7, 1.03], [.48, 1.1], [.16, 1.13]];
      add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 40), wood);
      torus(.69, .045, cream, .74);
      torus(.57, .04, enamel, .9);
      torus(.79, .022, woodDark, .84);
      add(new THREE.CylinderGeometry(.085, .13, .36, 20), woodDark, 1.28);
      add(new THREE.SphereGeometry(.12, 16, 8), enamel, 1.46);
      contactRadius = .82; inertiaFactor = .43; mass = .82;
    } else if (design === 1) {
      // Lithographed tin: soft dome, printed bands, plunger knob.
      const profile = [[.055, 0], [.14, .12], [.27, .34], [.63, .55], [.88, .7], [.91, .83], [.7, 1.01], [.36, 1.14], [.2, 1.16]];
      add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 48), enamel);
      torus(.86, .05, cream, .79);
      torus(.74, .03, brass, .93);
      torus(.52, .025, cream, 1.07);
      studRing(10, .64, 1.02, cream, .03);
      add(new THREE.CylinderGeometry(.13, .19, .34, 24), brass, 1.3);
      add(new THREE.SphereGeometry(.18, 16, 8), enamel, 1.5);
      contactRadius = .93; inertiaFactor = .56; mass = 1.05;
    } else if (design === 2) {
      // Battle top: six swept steel blades around a dense weight disc.
      const profile = [[.055, 0], [.13, .08], [.17, .25], [.3, .39], [.57, .54], [.71, .63]];
      add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 40), gunmetal);
      add(new THREE.CylinderGeometry(.83, .76, .13, 40), steel, .64);
      add(new THREE.CylinderGeometry(.63, .75, .13, 40), enamel, .77);
      for (let i = 0; i < 6; i++) {
        const shape = new THREE.Shape();
        shape.moveTo(.35, -.1);
        shape.quadraticCurveTo(.69, -.32, .92, -.23);
        shape.lineTo(1.0, -.04);
        shape.quadraticCurveTo(.82, .2, .58, .2);
        shape.lineTo(.4, .12);
        shape.closePath();
        const blade = add(new THREE.ExtrudeGeometry(shape, {
          depth: .12, bevelEnabled: true, bevelSegments: 1, curveSegments: 4, steps: 1, bevelSize: .025, bevelThickness: .02,
        }), i % 2 ? enamel : steel, .8, true);
        blade.rotation.set(-Math.PI / 2, 0, i * Math.PI / 3);
      }
      add(new THREE.CylinderGeometry(.29, .35, .16, 32), brass, .98);
      torus(.38, .025, gunmetal, .94);
      studRing(6, .5, .99, gunmetal);
      contactRadius = 1.04; inertiaFactor = .68; mass = 1.35;
    } else if (design === 3) {
      // Machined brass gear: twelve scallops, exposed fasteners, recessed core.
      const profile = [[.05, 0], [.12, .08], [.17, .27], [.32, .44], [.58, .57], [.7, .65]];
      add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 40), gunmetal);
      const gear = add(new THREE.ExtrudeGeometry(radialShape(12, .8, 1.0, Math.PI / 24), {
        depth: .13, bevelEnabled: true, bevelSegments: 1, steps: 1, bevelSize: .02, bevelThickness: .015,
      }), brass, .69, true);
      gear.rotation.x = -Math.PI / 2;
      add(new THREE.CylinderGeometry(.66, .7, .15, 40), enamel, .84);
      torus(.48, .065, brass, .97);
      add(new THREE.CylinderGeometry(.24, .3, .18, 32), steel, 1.02);
      studRing(8, .58, 1.02, steel, .04);
      contactRadius = 1.03; inertiaFactor = .72; mass = 1.48;
    } else {
      // Three-lobed turbine: swept fins and concentric centre rings.
      const profile = [[.05, 0], [.12, .09], [.16, .26], [.3, .43], [.55, .57], [.66, .65]];
      add(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 40), gunmetal);
      add(new THREE.CylinderGeometry(.77, .7, .1, 40), steel, .67);
      for (let i = 0; i < 3; i++) {
        const fin = new THREE.Shape();
        fin.moveTo(.22, -.18);
        fin.bezierCurveTo(.55, -.5, 1.05, -.32, .99, .07);
        fin.quadraticCurveTo(.81, -.08, .53, .27);
        fin.lineTo(.25, .2);
        fin.closePath();
        const rotor = add(new THREE.ExtrudeGeometry(fin, {
          depth: .14, bevelEnabled: true, bevelSegments: 1, curveSegments: 5, steps: 1, bevelSize: .03, bevelThickness: .02,
        }), enamel, .78, true);
        rotor.rotation.set(-Math.PI / 2, 0, i * Math.PI * 2 / 3);
      }
      add(new THREE.CylinderGeometry(.43, .57, .14, 40), accent, .92);
      torus(.48, .055, steel, .98);
      torus(.3, .045, brass, 1.03);
      add(new THREE.CylinderGeometry(.17, .24, .18, 24), gunmetal, 1.04);
      studRing(3, .47, 1.04, cream, .055);
      contactRadius = 1.03; inertiaFactor = .64; mass = 1.22;
    }

    // Bake static parts into one surface per material. Detail parts get their
    // own material copies so they can fade without touching the solid body.
    model.updateMatrixWorld(true);
    const batches = new Map();
    const originals = new Set();
    for (const mesh of [...model.children]) {
      const baked = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
      baked.applyMatrix4(mesh.matrix);
      baked.clearGroups();
      const key = `${mesh.material.uuid}:${mesh.userData.detail ? 'detail' : 'solid'}`;
      if (!batches.has(key)) batches.set(key, { material: mesh.material, detail: mesh.userData.detail, parts: [] });
      batches.get(key).parts.push(baked);
      originals.add(mesh.geometry);
      model.remove(mesh);
    }
    const details = [];
    const blurs = [];
    for (const { material, detail, parts } of batches.values()) {
      const merged = mergeGeometries(parts);
      for (const part of parts) part.dispose();
      const surface = detail ? material.clone() : material;
      if (detail) {
        surface.transparent = true;
        details.push(surface);
      }
      const mesh = new THREE.Mesh(merged, surface);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      model.add(mesh);
      if (!detail) continue;
      // A streaked ring covering the swept band of these parts.
      const positions = merged.getAttribute('position');
      let inner = Infinity;
      let outer = 0;
      let top = -Infinity;
      for (let i = 0; i < positions.count; i++) {
        const radius = Math.hypot(positions.getX(i), positions.getZ(i));
        inner = Math.min(inner, radius);
        outer = Math.max(outer, radius);
        top = Math.max(top, positions.getY(i));
      }
      const blurMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(material.color).lerp(new THREE.Color(0xffffff), material.metalness > .5 ? .25 : .05),
        map: streakTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(new THREE.RingGeometry(Math.max(.02, inner * .92), outer, 56, 1), blurMaterial);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = top + .004;
      ring.renderOrder = 2;
      ring.userData.ignoreSupport = true;
      model.add(ring);
      blurs.push(blurMaterial);
    }
    for (const geometry of originals) geometry.dispose();
    const support = sampleSupportVertices(model);

    const contactMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, map: contactTexture, transparent: true, opacity: .4, depthWrite: false });
    const contact = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), contactMaterial);
    contact.rotation.x = -Math.PI / 2;
    contact.renderOrder = 1;
    scene.add(contact);

    return {
      pivot, model, support, details, blurs, contact, contactMaterial, index, design,
      metal: design >= 2,
      x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, spin: 0, angle: 0,
      tilt: 0, tiltVelocity: 0, precession: 0, wobble: 0,
      nutation: 0, nutationPhase: 0, rock: 0, rockPhase: 0, roll: 0,
      phase: 'resting', rest: 0, delay: 0, radius: 40, contactRadius, collisionRadius: 40,
      mass, inertiaFactor, inertia: 1, friction: 1, airDrag: .012, lying: 1.36,
      trailX: null, trailY: null, active: true,
    };
  }

  // Tops are built only when the screen size needs them, so phones skip the
  // geometry for the ones they never show. The desktop count was cut from eight
  // to five: five silhouettes is the whole set anyway, and each one is a shadow
  // caster on older GPUs.
  const states = [];
  const countFor = (viewport) => viewport > 1200 ? 5 : viewport > 620 ? 4 : 3;
  const radiusFor = (viewport) => viewport > 1200 ? 56 : viewport > 620 ? 46 : 34;
  let topCount = countFor(window.innerWidth);
  const sparks = createCollisionSparks(scene, renderer.getPixelRatio());

  // 0: current desktop GPU. 1: phones and older laptops. 2: four threads or
  // less, which is where a 2013 MacBook and cheap Android phones land.
  function detectTier() {
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory;
    if (cores <= 4 || (typeof memory === 'number' && memory <= 4)) return 2;
    if (matchMedia('(pointer: coarse)').matches || cores < 8) return 1;
    return 0;
  }

  function ratioFor(value) {
    const cap = value === 0 ? 1.5 : value === 1 ? 1.25 : 1;
    return Math.min(devicePixelRatio || 1, cap);
  }

  // Called once at startup and again whenever the watchdog steps down. The
  // drawing buffer has to be resized for a new pixel ratio to take effect.
  function applyQuality() {
    pixelRatio = ratioFor(tier);
    renderer.setPixelRatio(pixelRatio);
    const shadows = tier < 2;
    renderer.shadowMap.enabled = shadows;
    light.castShadow = shadows;
    if (light.shadow.map) { light.shadow.map.dispose(); light.shadow.map = null; }
    light.shadow.mapSize.set(tier === 0 ? 1024 : 512, tier === 0 ? 1024 : 512);
    sparks.setPixelRatio(pixelRatio);
    if (width && height) {
      renderer.setSize(width, height);
      sizeLayer(trailCanvas, trail, trailRatio);
    }
    host.dataset.quality = String(tier);
  }
  const scratchPoint = new THREE.Vector3();
  const tiltQuaternion = new THREE.Quaternion();
  const supportQuaternion = new THREE.Quaternion();
  const spinQuaternion = new THREE.Quaternion();
  const tiltAxis = new THREE.Vector3();
  const yAxis = new THREE.Vector3(0, 1, 0);
  const gravity = 2200;
  let width = 0;
  let height = 0;
  let pointer = null;
  let ready = false;
  let ringClear = false;
  let ringCheck = 0;
  let frame = 0;
  let last = 0;
  let lastRendered = 0;
  let accumulator = 0;
  let fadeClock = 0;
  let hold = 0;
  let disposed = false;
  let collisionEnergy = 0;
  let nextMetricsAt = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Tops are a hero toy: once the hero leaves the viewport the simulation stops.
  let heroVisible = true;
  const world = (x, y) => [x - width / 2, (y - height / 2) / projection];
  const grounded = (state) => state.delay <= 0 && state.z < 4;

  function sizeTop(state) {
    state.radius = radiusFor(window.innerWidth);
    state.collisionRadius = state.radius * state.contactRadius;
    state.model.scale.setScalar(state.radius);
    state.inertia = state.inertiaFactor * state.mass * state.radius * state.radius;
    state.trailX = state.trailY = null;
    return state;
  }

  function addTop() {
    const state = sizeTop(makeTop(palette[states.length], states.length));
    states.push(state);
    state.active = states.length <= topCount;
    state.pivot.visible = state.contact.visible = false;
    return state;
  }

  function setTopCount(nextCount) {
    topCount = nextCount;
    // Before the first round prepare() builds tops one per frame; afterwards
    // a wider window builds any extra tops straight away.
    if (ready) while (states.length < topCount) addTop();
    states.forEach((state, index) => {
      state.active = index < topCount;
      state.pivot.visible = state.active;
      state.contact.visible = state.active;
    });
    host.dataset.topCount = String(topCount);
  }

  // Renders are skipped until the shaders have compiled in the background.
  function draw() {
    if (ready) renderer.render(scene, camera);
  }

  function padArea() {
    if (!(pad instanceof HTMLElement)) return null;
    const box = pad.getBoundingClientRect();
    if (box.width < 40 || box.bottom < 0 || box.top > height) return null;
    return box;
  }

  function spinUp(state, strength = random(.85, 1)) {
    // Each top gets its own spin and friction so they do not all die together.
    state.spin = (52 + 26 * strength) * (Math.random() < .2 ? -1 : 1);
    state.friction = random(.95, 1.4) * (1 + state.design * .04);
    state.airDrag = random(.009, .014);
    state.tilt = random(.06, .11);
    state.tiltVelocity = 0;
    state.precession = random(0, Math.PI * 2);
    state.wobble = .02;
    state.nutation = .04;
    state.rock = 0;
    state.roll = 0;
    state.rest = 0;
    state.trailX = state.trailY = null;
    state.phase = 'airborne';
  }

  function launch(state, delay = 0, slot = random(0, 1)) {
    const margin = state.radius + 12;
    const area = padArea();
    // Tops land spread round the ring and are flung outward, so the ring
    // empties within a few seconds and they meet out on the page.
    const around = slot * Math.PI * 2 + random(-.35, .35);
    let direction = random(0, Math.PI * 2);
    if (area) {
      const reach = random(.2, .55);
      state.x = clamp(area.left + area.width * (.5 + Math.cos(around) * reach * .5), margin, width - margin);
      state.y = clamp(area.top + area.height * (.5 + Math.sin(around) * reach * .5), margin, height - margin);
      direction = around + random(-.6, .6);
    } else {
      state.x = margin + random(0, 1) * Math.max(0, width - margin * 2);
      state.y = margin + random(0, 1) * Math.max(0, height - margin * 2);
    }
    const speed = random(150, 260) * state.radius / 56;
    state.vx = Math.cos(direction) * speed;
    state.vy = Math.sin(direction) * speed;
    state.z = random(70, 110);
    state.vz = 0;
    state.delay = delay;
    state.leftRing = false;
    spinUp(state);
  }

  function reset() {
    hold = 0;
    collisionEnergy = 0;
    sparks.clear();
    host.dataset.hitCount = '0';
    setRingClear(false);
    // The ring is sketched first; the tops start dropping in as it closes and
    // arrive one after another instead of appearing mid-spin.
    const sketching = ready && ring ? ring.draw() : 0;
    const lead = Math.max(.25, sketching - .2);
    const order = states.slice(0, topCount).sort(() => Math.random() - .5);
    order.forEach((state, index) => launch(state, lead + index * .32, index / order.length));
    states.forEach((state) => {
      if (state.active) return;
      state.phase = 'resting';
      state.vx = state.vy = 0;
    });
  }

  function setRingClear(clear) {
    if (clear === ringClear) return;
    ringClear = clear;
    host.dataset.ring = clear ? 'clear' : 'occupied';
    if (pad instanceof HTMLElement) pad.toggleAttribute('data-ring-clear', clear);
    if (clear) ring?.erase();
  }

  function checkRing() {
    // The ring hides once every top has landed and rolled fully outside it at
    // least once (tops chasing each other often cross back in), and returns
    // with the next round.
    if (ringClear) return;
    const area = padArea();
    const active = states.slice(0, topCount);
    for (const state of active) {
      if (state.leftRing || state.delay > 0 || state.z > 4) continue;
      if (!area) {
        state.leftRing = true;
        continue;
      }
      const dx = (state.x - (area.left + area.width / 2)) / (area.width / 2 + state.collisionRadius);
      const dy = (state.y - (area.top + area.height / 2)) / (area.height / 2 + state.collisionRadius);
      if (dx * dx + dy * dy > 1) state.leftRing = true;
    }
    if (active.every((state) => state.leftRing)) setRingClear(true);
  }

  function sizeLayer(canvas, context, ratio = 1) {
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }

  function resize() {
    const box = host.getBoundingClientRect();
    if (!box.width || !box.height || (box.width === width && box.height === height)) return;
    const previousWidth = width;
    const previousHeight = height;
    const previousCount = topCount;
    width = box.width;
    height = box.height;
    setTopCount(countFor(window.innerWidth));
    renderer.setSize(width, height);
    sizeLayer(trailCanvas, trail, trailRatio);
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
    states.forEach(sizeTop);
    if (!previousWidth) {
      reset();
    } else {
      const widthChanged = width !== previousWidth;
      states.forEach((state, index) => {
        if (!state.active) return;
        if (index >= previousCount) {
          launch(state, .2);
          return;
        }
        const edge = state.collisionRadius + 5;
        state.x = clamp(state.x * (widthChanged ? width / previousWidth : 1), edge, width - edge);
        // Browser bars change height during mobile scroll. Keep each top anchored
        // in screen space; remap both axes only when the viewport width changes.
        state.y = clamp(state.y * (widthChanged ? height / previousHeight : 1), edge, height - edge);
      });
      sparks.clear();
    }
    pose(0);
    draw();
  }

  function burst(x, y, speed, elevation, source) {
    const [wx, wz] = world(x, y);
    if (sparks.emit(wx, elevation, wz, speed)) {
      host.dataset.sparkSource = source;
      host.dataset.sparkBursts = String(sparks.bursts);
    }
  }

  function scuff(x, y, strength) {
    // Wood and tin leave a small graphite mark instead of sparks.
    if (reduced.matches || strength < 20) return;
    trail.strokeStyle = 'rgba(23,23,25,.32)';
    trail.lineWidth = 1;
    for (let i = 0; i < 4; i++) {
      const angle = random(0, Math.PI * 2);
      const length = random(3, 7);
      trail.beginPath();
      trail.moveTo(x + random(-3, 3), y + random(-3, 3));
      trail.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length);
      trail.stroke();
    }
    host.dataset.scuffs = String(Number(host.dataset.scuffs || 0) + 1);
  }

  let previousScrollY = window.scrollY;
  function onScroll() {
    const scrollDelta = window.scrollY - previousScrollY;
    previousScrollY = window.scrollY;
    if (reduced.matches || !heroVisible) return;
    const nudge = Math.max(-6, Math.min(6, -scrollDelta * .035));
    if (Math.abs(nudge) < .15) return;
    for (let i = 0; i < topCount; i++) {
      const state = states[i];
      if (state.phase === 'resting' || !grounded(state)) continue;
      state.vy = Math.max(-165, Math.min(165, state.vy + nudge));
    }
  }

  function wall(state, nx, ny, penetration, x, y, restitution = .78, source = 'edge') {
    state.x += nx * penetration;
    state.y += ny * penetration;
    const pointerVX = source === 'mouse' ? pointer.vx : 0;
    const pointerVY = source === 'mouse' ? pointer.vy : 0;
    const normalSpeed = (state.vx - pointerVX) * nx + (state.vy - pointerVY) * ny;
    if (normalSpeed >= 0) return;
    const inverseMass = 1 / state.mass;
    const normalImpulse = -(1 + restitution) * normalSpeed / inverseMass;
    state.vx += normalImpulse * nx * inverseMass;
    state.vy += normalImpulse * ny * inverseMass;
    const tx = -ny;
    const ty = nx;
    const tangentSpeed = (state.vx - pointerVX) * tx + (state.vy - pointerVY) * ty + state.spin * state.collisionRadius;
    const tangentInverseMass = inverseMass
      + state.collisionRadius * state.collisionRadius / Math.max(state.inertia, 1);
    const tangentImpulse = clamp(-tangentSpeed / tangentInverseMass, -normalImpulse * .28, normalImpulse * .28);
    state.vx += tangentImpulse * tx * inverseMass;
    state.vy += tangentImpulse * ty * inverseMass;
    state.spin += tangentImpulse * state.collisionRadius / Math.max(state.inertia, 1);
    state.nutation = Math.min(.18, state.nutation + Math.abs(normalSpeed) * .0006);
    if (source === 'mouse') {
      if (state.metal) burst(x, y, -normalSpeed, state.radius * .82, source);
      else scuff(x, y, -normalSpeed);
      host.dataset.mouseHitCount = String(Number(host.dataset.mouseHitCount || 0) + 1);
    }
  }

  function collide(a, b) {
    if (!grounded(a) || !grounded(b)) return;
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
    // Resting tops are heavy and sticky but can still be shoved and rocked.
    const invA = (a.phase === 'resting' ? .25 : 1) / a.mass;
    const invB = (b.phase === 'resting' ? .25 : 1) / b.mass;
    const inverseMass = invA + invB;

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
    // Same spin direction: the rims meet moving in opposite directions, so
    // they scrape and bounce apart hard. Opposite spins mesh like gears.
    const spinningA = Math.abs(a.spin) > 2;
    const spinningB = Math.abs(b.spin) > 2;
    const sameDirection = spinningA && spinningB && Math.sign(a.spin) === Math.sign(b.spin);
    const tangentSpeed = rvx * tx + rvy * ty + a.spin * a.collisionRadius + b.spin * b.collisionRadius;
    const slip = clamp(Math.abs(tangentSpeed) / 900, 0, 1);
    const restitution = .82 + Math.min(.1, severity / 1500) + (sameDirection ? .2 * slip : 0);
    // Spinning rims fling each other apart, harder the faster they turn.
    const scale = Math.min(a.radius, b.radius) / 56;
    const rimKick = clamp(Math.abs(a.spin) + Math.abs(b.spin), 0, 140) * (sameDirection ? 1.6 : 1.1) * scale;
    const normalImpulse = (-(1 + restitution) * normalSpeed + rimKick) / inverseMass;
    const jx = normalImpulse * nx;
    const jy = normalImpulse * ny;
    a.vx -= jx * invA;
    a.vy -= jy * invA;
    b.vx += jx * invB;
    b.vy += jy * invB;

    // Glancing friction converts some spin into sideways recoil.
    const tangentImpulse = clamp(-tangentSpeed / (inverseMass * 4), -normalImpulse * .22, normalImpulse * .22);
    a.vx -= tangentImpulse * tx * invA;
    a.vy -= tangentImpulse * ty * invA;
    b.vx += tangentImpulse * tx * invB;
    b.vy += tangentImpulse * ty * invB;

    const impact = clamp(severity / 160, 0, 1);
    if (sameDirection) {
      // Scraping costs only a sliver of spin, so busy rounds still run long.
      const loss = .01 + .02 * impact;
      a.spin *= 1 - loss * (b.mass / (a.mass + b.mass)) * 2;
      b.spin *= 1 - loss * (a.mass / (a.mass + b.mass)) * 2;
    } else if (spinningA || spinningB) {
      // The faster top hands spin to the slower one, which can wake it briefly.
      const share = .2 * Math.max(.25, impact);
      const fast = Math.abs(a.spin) >= Math.abs(b.spin) ? a : b;
      const slow = fast === a ? b : a;
      const transfer = (Math.abs(fast.spin) - Math.abs(slow.spin)) * share;
      fast.spin -= Math.sign(fast.spin) * transfer;
      slow.spin = (Math.abs(slow.spin) + transfer * .95) * (Math.sign(slow.spin) || -Math.sign(fast.spin));
      if (slow.phase === 'resting' && Math.abs(slow.spin) > 10) {
        slow.phase = 'rimroll';
        slow.roll = 0;
      }
    }

    for (const [state, other] of [[a, b], [b, a]]) {
      const kick = (severity + rimKick) * (other.mass / state.mass);
      // A hop and a nod that settles within about a second.
      if (state.phase !== 'resting') state.vz = Math.max(state.vz, Math.min(170, kick * .45));
      state.nutation = Math.min(.26, state.nutation + kick * .0011);
      state.wobble = Math.min(.18, state.wobble + kick * .00022);
      if (state.phase === 'resting') state.rock = Math.min(.22, state.rock + kick * .0016);
      // Only a hard hit on a top that is nearly spent tips it over.
      if (state.phase === 'wobbling' && Math.abs(state.spin) < 14 && kick > 150) {
        state.tiltVelocity += kick * .003;
      }
    }

    const energyAfter = .5 * a.mass * (a.vx * a.vx + a.vy * a.vy)
      + .5 * b.mass * (b.vx * b.vx + b.vy * b.vy)
      + .5 * a.inertia * a.spin * a.spin
      + .5 * b.inertia * b.spin * b.spin;
    collisionEnergy += Math.max(0, energyBefore - energyAfter);
    const contactX = a.x + nx * a.collisionRadius;
    const contactY = a.y + ny * a.collisionRadius;
    if (a.metal && b.metal) burst(contactX, contactY, severity + rimKick, Math.min(a.radius, b.radius) * .82, 'top');
    else scuff(contactX, contactY, severity + rimKick);
    host.dataset.hitCount = String(Number(host.dataset.hitCount || 0) + 1);
  }

  function stepTop(state, dt) {
    if (!state.active) return;
    if (state.delay > 0) {
      state.delay -= dt;
      return;
    }

    // Vertical motion: launch drops and collision hops.
    if (state.z > 0 || state.vz > 0) {
      state.vz -= gravity * dt;
      state.z += state.vz * dt;
      if (state.z <= 0) {
        state.z = 0;
        if (state.vz < -140) {
          // The tip strikes the paper and hops, losing some speed to the skid.
          state.vz = -state.vz * .3;
          // A dropped top lands hard; a hop from a collision lands on a
          // spinning tip whose gyroscopic stiffness shrugs most of it off.
          state.tiltVelocity += state.phase === 'airborne' ? random(.2, .5) : random(.03, .1);
          state.nutation = Math.min(.2, state.nutation + .05);
          state.vx *= .82;
          state.vy *= .82;
        } else {
          state.vz = 0;
          if (state.phase === 'airborne') state.phase = 'spinning';
        }
      }
    }

    if (pointer && grounded(state)) {
      // Pointer coordinates refer to the visible rim, not its hidden ground tip.
      const dx = state.x - pointer.x;
      const dy = state.y - (pointer.y + state.radius * .82 * Math.cos(viewAngle));
      const distance = Math.hypot(dx, dy);
      if (distance > .001 && distance < state.collisionRadius + 12) {
        const nx = dx / distance;
        const ny = dy / distance;
        const approach = (state.vx - pointer.vx) * nx + (state.vy - pointer.vy) * ny;
        if (state.phase === 'resting' && approach < 0) state.rock = Math.min(.2, state.rock + .08);
        wall(state, nx, ny, state.collisionRadius + 12 - distance,
          state.x - nx * state.collisionRadius, state.y - ny * state.collisionRadius, .55, 'mouse');
      }
    }

    if (state.phase === 'resting') {
      state.rest += dt;
      state.rockPhase += 9 * dt;
      state.rock *= Math.exp(-2.4 * dt);
      state.vx *= Math.exp(-5 * dt);
      state.vy *= Math.exp(-5 * dt);
      state.x += state.vx * dt;
      state.y += state.vy * dt;
      edges(state);
      return;
    }

    const spinMagnitude = Math.abs(state.spin);
    // Stability falls from 1 above the critical speed to 0 when the top can
    // no longer hold itself up.
    const stability = clamp((spinMagnitude - 8) / 22, 0, 1);
    const airborne = state.phase === 'airborne';

    if (state.phase !== 'rimroll' && !airborne) {
      if (state.tilt > .95 || spinMagnitude < 6) {
        state.phase = 'rimroll';
        state.roll = 0;
      } else if (spinMagnitude > 30 && state.tilt < .14) state.phase = 'spinning';
      else if (spinMagnitude > 18) state.phase = 'precessing';
      else state.phase = 'wobbling';
    }

    // Tip friction is steady, air drag grows with speed, and the wobble itself
    // scrubs energy once the top leans.
    const scrub = state.phase === 'wobbling' || state.phase === 'rimroll' ? 2.4 : .4;
    const angularLoss = (state.friction + state.airDrag * spinMagnitude + scrub * state.tilt + state.wobble * 2) * dt
      * (state.phase === 'rimroll' ? 3 : 1);
    if (spinMagnitude <= angularLoss) state.spin = 0;
    else state.spin -= Math.sign(state.spin) * angularLoss;
    state.angle = (state.angle + displayRate(state.spin) * dt) % (Math.PI * 2);

    let targetTilt;
    let tiltSpring = 14;
    let tiltDamping = 5;
    if (airborne) {
      targetTilt = .06;
    } else if (state.phase === 'spinning') {
      targetTilt = .015 + state.wobble * .25;
      tiltSpring = 22;
      tiltDamping = 8;
    } else if (state.phase === 'precessing') {
      targetTilt = .035 + Math.pow(1 - stability, 1.5) * .4 + state.wobble;
    } else if (state.phase === 'wobbling') {
      targetTilt = .14 + Math.pow(1 - stability, 1.3) * .78 + state.wobble;
      tiltSpring = 11;
      tiltDamping = 4.2;
    } else {
      targetTilt = state.lying;
      tiltSpring = 6;
      tiltDamping = 2.6;
    }
    state.tiltVelocity += (targetTilt - state.tilt) * tiltSpring * dt;
    state.tiltVelocity *= Math.exp(-tiltDamping * dt);
    state.tilt = clamp(state.tilt + state.tiltVelocity * dt, .01, state.lying + .04);

    // Gyroscopic precession speeds up as spin falls: Ω ≈ m·g·l / (I·ω).
    let precessionRate = clamp(105 / Math.max(spinMagnitude, 4), .4, 14);
    if (state.phase === 'rimroll') {
      // Like a settling coin, the rim rolls round faster as it flattens.
      state.roll += dt;
      precessionRate = Math.min(26, 4 + 2.4 / Math.max(.06, state.lying - state.tilt));
    }
    const direction = Math.sign(state.spin) || 1;
    state.precession += direction * precessionRate * dt;
    state.nutationPhase += (7 + spinMagnitude * .45) * dt;
    const nutationTarget = state.phase === 'wobbling' ? .05 * (1 - stability) : .004;
    state.nutation += (nutationTarget - state.nutation) * Math.min(1, 1.6 * dt);
    state.wobble *= Math.exp(-(state.phase === 'spinning' ? .25 : .55) * dt);

    if (!airborne && state.z <= 0) {
      // A leaning tip slides sideways, so the top walks in loops as it precesses.
      const walk = 230 * state.tilt * Math.min(spinMagnitude, 30) / 30;
      state.vx += -Math.sin(state.precession) * walk * direction * dt;
      state.vy += Math.cos(state.precession) * walk * direction * dt;
      if (state.phase === 'rimroll') {
        const rollRadius = state.radius * .12 * (state.lying - state.tilt + .08);
        state.vx += -Math.sin(state.precession) * rollRadius * precessionRate * dt * 4;
        state.vy += Math.cos(state.precession) * rollRadius * precessionRate * dt * 4;
      }
    }

    if (!airborne && state.z <= 0 && spinMagnitude > 22) {
      // A lively top drifts across the paper and is drawn toward the nearest
      // other spinning top, so they meet often instead of settling apart.
      const scale = state.radius / 56;
      let nearest = null;
      let nearestDistance = Infinity;
      for (let i = 0; i < topCount; i++) {
        const other = states[i];
        if (other === state || other.phase === 'resting' || !grounded(other)) continue;
        const distance = Math.hypot(other.x - state.x, other.y - state.y);
        if (distance < nearestDistance) { nearest = other; nearestDistance = distance; }
      }
      if (nearest && nearestDistance > 1) {
        const pull = 70 * scale * stability;
        state.vx += (nearest.x - state.x) / nearestDistance * pull * dt;
        state.vy += (nearest.y - state.y) / nearestDistance * pull * dt;
      }
      const speed = Math.hypot(state.vx, state.vy);
      if (speed < 120 * scale * stability) {
        const heading = speed > 1 ? Math.atan2(state.vy, state.vx) : random(0, Math.PI * 2);
        state.vx += Math.cos(heading) * 90 * scale * dt;
        state.vy += Math.sin(heading) * 90 * scale * dt;
      }
    }

    const linearDrag = airborne ? .1
      : state.phase === 'spinning' ? .08
        : state.phase === 'precessing' ? .16
          : state.phase === 'wobbling' ? .5 : 2.4;
    state.vx *= Math.exp(-linearDrag * dt);
    state.vy *= Math.exp(-linearDrag * dt);
    state.x += state.vx * dt;
    state.y += state.vy * dt;
    edges(state);

    if (state.phase === 'rimroll' && state.tilt > state.lying - .05 && state.roll > 1.6) {
      state.phase = 'resting';
      state.spin = 0;
      state.tilt = state.lying;
      state.tiltVelocity = 0;
      state.rock = .1;
      state.rockPhase = 0;
      state.rest = 0;
    }
  }

  function edges(state) {
    const radius = state.collisionRadius + 5;
    if (state.x < radius) wall(state, 1, 0, radius - state.x, radius, state.y);
    if (state.x > width - radius) wall(state, -1, 0, state.x - width + radius, width - radius, state.y);
    if (state.y < radius) wall(state, 0, 1, radius - state.y, state.x, radius);
    if (state.y > height - radius) wall(state, 0, -1, state.y - height + radius, state.x, height - radius);
  }

  // At 60 fps a fast top would jump hundreds of degrees per frame and strobe.
  // The visible body turns at a capped rate while detail fades into blur.
  function displayRate(spin) {
    const magnitude = Math.abs(spin);
    return Math.sign(spin) * (magnitude < 12 ? magnitude : 12 + (magnitude - 12) * .08);
  }

  function drawTrails() {
    // One batched path per rendered frame; stroking per physics step costs
    // far more than the physics itself.
    trail.strokeStyle = 'rgba(23,23,25,.2)';
    trail.lineWidth = 1.05;
    trail.beginPath();
    let segments = 0;
    for (let i = 0; i < topCount; i++) {
      const state = states[i];
      const drawing = state.delay <= 0 && state.z < 2 && state.phase !== 'resting' && state.phase !== 'airborne';
      if (!drawing) {
        state.trailX = state.trailY = null;
        continue;
      }
      if (state.trailX === null) {
        state.trailX = state.x;
        state.trailY = state.y;
        continue;
      }
      if (Math.hypot(state.x - state.trailX, state.y - state.trailY) < 1.2) continue;
      trail.moveTo(state.trailX, state.trailY);
      trail.lineTo(state.x, state.y);
      segments++;
      state.trailX = state.x;
      state.trailY = state.y;
    }
    if (segments) trail.stroke();
  }

  function fadeTrails(dt) {
    // Fade in coarse steps: tiny per-frame alphas round away on 8-bit canvases
    // and would leave permanent ghosts. About eight seconds to disappear.
    fadeClock += dt;
    if (fadeClock < .6) return;
    fadeClock = 0;
    trail.save();
    trail.setTransform(1, 0, 0, 1, 0, 0);
    trail.globalCompositeOperation = 'destination-out';
    trail.fillStyle = 'rgba(0,0,0,.2)';
    trail.fillRect(0, 0, trailCanvas.width, trailCanvas.height);
    trail.restore();
  }

  let simTime = 0;
  function step(dt) {
    simTime += dt;
    if (pointer) {
      pointer.age += dt;
      if (pointer.age > .08) pointer.vx = pointer.vy = 0;
    }
    let allResting = true;
    for (let i = 0; i < topCount; i++) {
      stepTop(states[i], dt);
      for (let j = 0; j < i; j++) collide(states[j], states[i]);
    }
    for (let i = 0; i < topCount; i++) allResting &&= states[i].phase === 'resting';
    sparks.update(dt);
    ringCheck += dt;
    if (ringCheck > .25) {
      ringCheck = 0;
      checkRing();
    }
    if (allResting) {
      hold += dt;
      if (hold > 3) reset();
    } else {
      hold = 0;
    }
  }

  function pose() {
    let totalEnergy = 0;
    for (const state of states) {
      const visible = state.active && state.delay <= 0;
      state.pivot.visible = visible;
      state.contact.visible = visible;
      if (!visible) continue;
      const [x, z] = world(state.x, state.y);
      const resting = state.phase === 'resting';
      const tilt = resting
        ? state.tilt - Math.abs(Math.sin(state.rockPhase)) * state.rock
        : state.tilt + Math.sin(state.nutationPhase) * state.nutation;
      tiltAxis.set(Math.cos(state.precession), 0, Math.sin(state.precession));
      tiltQuaternion.setFromAxisAngle(tiltAxis, clamp(tilt, .005, 1.5));
      state.pivot.quaternion.copy(tiltQuaternion);
      state.model.rotation.y = state.angle;
      supportQuaternion.copy(tiltQuaternion).multiply(spinQuaternion.setFromAxisAngle(yAxis, state.angle));

      let minimumY = Infinity;
      for (const supportPoint of state.support) {
        scratchPoint.copy(supportPoint)
          .multiplyScalar(state.radius)
          .applyQuaternion(supportQuaternion);
        minimumY = Math.min(minimumY, scratchPoint.y);
      }
      state.pivot.position.set(x, -minimumY + .4 + state.z, z);

      // Contact point: tight under the tip, broad when the top lies down.
      const lean = clamp(tilt / state.lying, 0, 1);
      const spread = state.radius * (.28 + lean * 1.1);
      state.contact.position.set(x - Math.cos(state.precession) * lean * state.radius * .5, .2, z - Math.sin(state.precession) * lean * state.radius * .5);
      state.contact.scale.set(spread, spread * (.7 + lean * .3), 1);
      state.contactMaterial.opacity = (.42 - lean * .12) * clamp(1 - state.z / 90, 0, 1);

      const blur = reduced.matches ? 0 : clamp((Math.abs(state.spin) - 10) / 26, 0, 1);
      for (const material of state.details) material.opacity = 1 - blur * .72;
      for (const material of state.blurs) material.opacity = blur * .55;
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
      host.dataset.sparkCount = String(sparks.active);
      host.dataset.renderCalls = String(renderer.info.render.calls);
      host.dataset.renderTriangles = String(renderer.info.render.triangles);
      host.dataset.cameraElevation = '55';
      host.dataset.simTime = simTime.toFixed(1);
    }
  }

  // Frames are only requested while the tops can actually be seen. Scrolling
  // past the hero costs nothing at all: no physics, no WebGL, no compositing of
  // a full-viewport transparent canvas over the page.
  function start() {
    if (disposed || frame || !ready || reduced.matches || document.hidden || !heroVisible) return;
    last = performance.now();
    lastRendered = last - 1000 / 60;
    frame = requestAnimationFrame(tick);
  }

  // The quality tier is a guess. If the device still cannot deliver frames,
  // step down instead of stuttering: fewer pixels, then no shadows, then half
  // the refresh rate. Two steps maximum keeps the tops looking like tops.
  const frameSamples = [];
  let lastStepDown = 0;
  function watchFrame(delta) {
    const now = performance.now();
    if (now - lastStepDown < 4000) return;
    frameSamples.push(delta);
    if (frameSamples.length < 90) return;
    const slow = frameSamples.filter((sample) => sample > .028).length;
    frameSamples.length = 0;
    if (slow < 45 || tier > 1) return;
    tier += 1;
    lastStepDown = now;
    accumulator = 0;
    applyQuality();
  }

  function tick(now) {
    frame = 0;
    if (disposed) return;
    if (!ready || document.hidden || reduced.matches || !heroVisible) return;
    const delta = Math.min(.05, (now - last) / 1000 || 0);
    last = now;
    watchFrame(delta);
    accumulator += delta;
    while (accumulator >= 1 / 120) {
      step(1 / 120);
      accumulator -= 1 / 120;
    }
    const budget = tier === 2 ? 1000 / 30 : 1000 / 60;
    const elapsed = now - lastRendered;
    if (elapsed >= budget - .5) {
      lastRendered = now - (elapsed % budget);
      fadeTrails(elapsed / 1000);
      drawTrails();
      pose();
      sparks.upload();
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(tick);
  }

  const local = (event) => {
    const box = host.getBoundingClientRect();
    return [event.clientX - box.left, event.clientY - box.top];
  };
  const move = (event) => {
    if (event.pointerType === 'touch') return;
    const [x, y] = local(event);
    const elapsed = pointer ? Math.max(.008, (event.timeStamp - pointer.time) / 1000) : 1;
    const vx = pointer ? clamp((x - pointer.x) / elapsed, -450, 450) : 0;
    const vy = pointer ? clamp((y - pointer.y) / elapsed, -450, 450) : 0;
    pointer = { x, y, vx, vy, time: event.timeStamp, age: 0 };
  };
  const leave = () => { pointer = null; };
  const pointerSurface = hero.closest('[data-play-root]') || window;
  pointerSurface.addEventListener('pointermove', move);
  pointerSurface.addEventListener('pointerleave', leave);
  window.addEventListener('blur', leave);
  window.addEventListener('scroll', onScroll, { passive: true });
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  // A second observer decides whether the tops should run at all. `data-idle`
  // also fades the layer out, so a paused scene is never left on screen.
  let heroObserver = null;
  if ('IntersectionObserver' in window) {
    heroObserver = new IntersectionObserver((entries) => {
      const visible = entries[0]?.isIntersecting ?? true;
      if (visible === heroVisible) return;
      heroVisible = visible;
      if (visible) {
        host.removeAttribute('data-idle');
        start();
      } else {
        host.setAttribute('data-idle', '');
        cancelAnimationFrame(frame);
        frame = 0;
      }
    }, { threshold: .12 });
    heroObserver.observe(hero);
  }
  const onDocumentVisibility = () => { if (!document.hidden) start(); };
  document.addEventListener('visibilitychange', onDocumentVisibility);
  const motionChange = () => {
    trail.clearRect(0, 0, width, height);
    if (reduced.matches) settleStill();
    else reset();
    nextMetricsAt = 0;
    pose();
    draw();
    if (!reduced.matches) start();
  };
  // Reduced motion: a still arrangement of upright tops, no trails.
  function settleStill() {
    states.forEach((state, index) => {
      if (!state.active) return;
      launch(state, 0);
      state.z = 0;
      state.vz = 0;
      state.phase = index % 3 === 2 ? 'resting' : 'spinning';
      state.tilt = state.phase === 'resting' ? state.lying : .03;
      state.spin = 0;
      state.nutation = 0;
      state.rock = 0;
    });
    setRingClear(false);
    if (ready) ring?.draw();
  }
  reduced.addEventListener('change', motionChange);
  // Browser tests can fast-forward the fixed-step simulation with ?spin-debug.
  if (new URLSearchParams(location.search).has('spin-debug')) {
    window.__spinTops = {
      advance(seconds) {
        for (let elapsed = 0; elapsed < seconds; elapsed += 1 / 120) step(1 / 120);
        fadeTrails(seconds);
        drawTrails();
        nextMetricsAt = 0;
        pose();
        draw();
      },
      tops: () => states.slice(0, topCount).map(({ x, y, phase, delay }) => ({ x, y, phase, delay })),
      size: () => ({ width, height }),
    };
  }
  resize();
  // Every shader is compiled in the background (KHR_parallel_shader_compile)
  // before it is first used, so the page never waits on the GPU driver.
  // Reflections on tops this small do not need the default 256px bake.
  const envSize = 64;
  async function prepare() {
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
    const room = new RoomEnvironment();
    const pmrem = new THREE.PMREMGenerator(renderer);
    // The environment bake renders the room into a float target without tone
    // mapping, then blurs it with PMREM's own shaders. Compiling all of them
    // against a matching target yields the programs the bake will look up.
    const bakeTarget = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
    const warm = new THREE.Scene();
    warm.add(new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ side: THREE.BackSide, depthWrite: false, depthTest: false })));
    // Top materials are keyed on the baked map's height, so a stand-in of the
    // same size lets them compile alongside the bake instead of after it.
    const bakeSize = { width: 3 * Math.max(envSize, 112), height: 4 * envSize };
    try {
      // Private PMREMGenerator internals (three r186); if they change, the
      // bake still works and only loses these warm-ups.
      pmrem._setSize(envSize);
      const target = pmrem._allocateTargets();
      bakeSize.width = target.width;
      bakeSize.height = target.height;
      target.dispose();
      // Programs are keyed on which attributes exist, so give the probes a position.
      const probe = new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
      for (const material of [pmrem._blurMaterial, pmrem._ggxMaterial]) {
        if (material) warm.add(new THREE.Mesh(probe, material));
      }
    } catch {}
    renderer.setRenderTarget(bakeTarget);
    const bakeCamera = new THREE.PerspectiveCamera();
    const compiling = [room, warm].map((target) => renderer.compileAsync(target, bakeCamera).catch(() => {}));

    // Shadow casting draws each top into a depth target with a depth material.
    // A probe lit like the page and compiled against a target warms it. Tier 2
    // never casts shadows, so it skips the probe entirely.
    const shadowScene = new THREE.Scene();
    const shadowLight = new THREE.DirectionalLight();
    shadowLight.castShadow = true;
    const depthProbe = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshDepthMaterial());
    shadowScene.add(new THREE.HemisphereLight(), shadowLight, depthProbe);
    if (tier < 2) compiling.push(renderer.compileAsync(shadowScene, camera).catch(() => {}));
    renderer.setRenderTarget(null);

    // Building a top takes a few milliseconds, so spread them across frames
    // while the GPU process compiles.
    while (states.length < topCount) {
      addTop();
      await nextFrame();
      if (disposed) break;
    }
    const standIn = new THREE.Texture(bakeSize);
    standIn.mapping = THREE.CubeUVReflectionMapping;
    scene.environment = standIn;
    // All tops are shown for the pass so every material is compiled.
    const shown = states.map((state) => state.pivot.visible);
    for (const state of states) state.pivot.visible = state.contact.visible = true;
    if (!disposed) compiling.push(renderer.compileAsync(scene, camera).catch(() => {}));
    states.forEach((state, index) => { state.pivot.visible = state.contact.visible = shown[index]; });
    scene.environment = null;

    await Promise.all(compiling);
    bakeTarget.dispose();
    warm.children[0].geometry.dispose();
    warm.children[0].material.dispose();
    depthProbe.geometry.dispose();
    depthProbe.material.dispose();
    if (!disposed) {
      environment = pmrem.fromScene(room, .04, .1, 100, { size: envSize });
      scene.environment = environment.texture;
    }
    room.dispose();
    pmrem.dispose();
  }

  prepare().then(() => {
    if (disposed) return;
    ready = true;
    host.dataset.ready = '';
    setTopCount(countFor(window.innerWidth));
    applyQuality();
    if (reduced.matches) settleStill();
    else reset();
    nextMetricsAt = 0;
    pose();
    draw();
    start();
  });

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    heroObserver?.disconnect();
    document.removeEventListener('visibilitychange', onDocumentVisibility);
    window.removeEventListener('scroll', onScroll);
    pointerSurface.removeEventListener('pointermove', move);
    pointerSurface.removeEventListener('pointerleave', leave);
    window.removeEventListener('blur', leave);
    if (pad instanceof HTMLElement) pad.removeAttribute('data-ring-clear');
    reduced.removeEventListener('change', motionChange);
    ring?.dispose();
    sparks.dispose();
    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) object.material.dispose();
    });
    woodGrain.dispose();
    finish.dispose();
    streakTexture.dispose();
    contactTexture.dispose();
    environment?.dispose();
    renderer.dispose();
    host.replaceChildren();
  };
}
