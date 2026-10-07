import * as THREE from 'three';

// A fixed GPU buffer keeps repeated collisions to one draw call and no meshes.
export function createCollisionSparks(scene, pixelRatio) {
  const capacity = 96;
  const positions = new Float32Array(capacity * 3);
  const velocities = new Float32Array(capacity * 3);
  const lifetimes = new Float32Array(capacity);
  const remaining = new Float32Array(capacity);
  const fades = new Float32Array(capacity);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('fade', new THREE.BufferAttribute(fades, 1).setUsage(THREE.DynamicDrawUsage));
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, toneMapped: false,
    uniforms: { pixelRatio: { value: pixelRatio } },
    vertexShader: `
      attribute float fade;
      uniform float pixelRatio;
      varying float alpha;
      void main() {
        alpha = fade;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = (2.0 + fade * 2.8) * pixelRatio;
      }`,
    fragmentShader: `
      varying float alpha;
      void main() {
        float radius = length(gl_PointCoord - vec2(0.5)) * 2.0;
        float coverage = 1.0 - smoothstep(0.45, 1.0, radius);
        vec3 color = mix(vec3(1.0, 0.28, 0.025), vec3(1.0, 0.91, 0.48), alpha * (1.0 - radius));
        gl_FragColor = vec4(color, coverage * alpha);
      }`,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.visible = false;
  points.renderOrder = 3;
  scene.add(points);
  let cursor = 0;
  let cooldown = 0;
  let active = 0;
  let bursts = 0;

  return {
    emit(x, y, z, speed) {
      if (speed < 14 || cooldown > 0) return false;
      const strength = Math.min(1, speed / 180);
      const count = 6 + Math.floor(strength * 6);
      for (let j = 0; j < count; j++) {
        const slot = cursor++ % capacity;
        const offset = slot * 3;
        const angle = Math.random() * Math.PI * 2;
        const velocity = 28 + Math.random() * (45 + strength * 75);
        positions[offset] = x;
        positions[offset + 1] = y;
        positions[offset + 2] = z;
        velocities[offset] = Math.cos(angle) * velocity;
        velocities[offset + 1] = 35 + Math.random() * 85;
        velocities[offset + 2] = Math.sin(angle) * velocity;
        lifetimes[slot] = remaining[slot] = .16 + Math.random() * .18;
        fades[slot] = 1;
      }
      cooldown = .025;
      bursts++;
      points.visible = true;
      return true;
    },
    update(dt) {
      cooldown = Math.max(0, cooldown - dt);
      active = 0;
      for (let slot = 0; slot < capacity; slot++) {
        if (remaining[slot] <= 0) continue;
        remaining[slot] = Math.max(0, remaining[slot] - dt);
        const offset = slot * 3;
        positions[offset] += velocities[offset] * dt;
        positions[offset + 1] += velocities[offset + 1] * dt;
        positions[offset + 2] += velocities[offset + 2] * dt;
        velocities[offset + 1] -= 320 * dt;
        fades[slot] = remaining[slot] / lifetimes[slot];
        if (remaining[slot] > 0) active++;
      }
      points.visible = active > 0;
    },
    upload() {
      if (!points.visible) return;
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.fade.needsUpdate = true;
    },
    clear() {
      remaining.fill(0);
      fades.fill(0);
      points.visible = false;
      active = 0;
      cooldown = 0;
    },
    get active() { return active; },
    get bursts() { return bursts; },
    dispose() {
      scene.remove(points);
      geometry.dispose();
      material.dispose();
    },
  };
}
