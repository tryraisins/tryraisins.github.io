// Doodles that travel. A drawing's figure is moved with the individual
// translate, rotate and scale properties, so travel never repaints its canvas;
// only the effects (stars, puffs, spills) are drawn in pencil by doodle-notes.
// Speeds and distances are in figure heights, so phones and desktops match.

const LIGHT = 1, MEDIUM = 2, HEAVY = 3;
const GRAVITY = 2.6;
const ORBIT_TIME = 3000;
const SHAKE_TIME = 600;

// facing is the way the sketch is drawn: 1 faces right, -1 left, 0 has no front.
const kinds = {
  portrait: { weight: MEDIUM, radius: .36 },
  cat: { weight: MEDIUM, radius: .34, mover: 'cat', speed: .75 },
  rhino: { weight: MEDIUM, radius: .34, facing: 1, mover: 'charge', speed: 1.15, windup: 1000 },
  landscape: { weight: HEAVY, radius: .4 },
  rocket: { weight: LIGHT, radius: .3, mover: 'rocket', windup: 700 },
  house: { weight: HEAVY, radius: .36 },
  flower: { weight: LIGHT, radius: .32, flung: 'petals' },
  robot: { weight: MEDIUM, radius: .34, mover: 'walk', speed: .55 },
  fish: { weight: LIGHT, radius: .32, facing: -1, mover: 'swim', speed: .6, wave: .22 },
  whale: { weight: HEAVY, radius: .38, facing: -1, mover: 'swim', speed: .4, wave: .08 },
  mountains: { weight: HEAVY, radius: .4 },
  coffee: { weight: LIGHT, radius: .3, struck: 'spill' },
  guitar: { weight: LIGHT, radius: .32, flung: 'twang' },
  'light bulb': { weight: LIGHT, radius: .3, struck: 'shatter' },
  planet: { weight: HEAVY, radius: .38, captures: true },
  tree: { weight: HEAVY, radius: .38 },
  bicycle: { weight: MEDIUM, radius: .36, facing: 1, mover: 'ride', speed: .85 },
  cassette: { weight: LIGHT, radius: .32, flung: 'tape' },
  snail: { weight: LIGHT, radius: .3, facing: 1, mover: 'crawl', speed: .08, flung: 'shell' },
  'hero insignia': { weight: LIGHT, radius: .32, mover: 'hero', speed: 1 },
};
const kindOf = (state) => kinds[state.name] || { weight: LIGHT, radius: .32 };

export const createBody = () => ({
  x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0, tilt: null, dir: 1,
  mode: 'idle', fx: '', fxAt: 0, until: 0, gone: false,
  target: null, carrier: null, cargo: null, orbit: null,
  shakeUntil: 0, winceUntil: 0, look: [0, 0], contacts: new Set(), trail: null,
  geo: { x: 0, y: 0, w: 240, h: 175 }, layerSize: [1, 1], written: '',
});

const center = (state) => {
  const { geo, x, y } = state.body;
  return [geo.x + geo.w / 2 + x, geo.y + geo.h / 2 + y];
};
const radius = (state) => kindOf(state).radius * state.body.geo.h;
const place = (state, cx, cy) => {
  const body = state.body;
  body.x = cx - body.geo.x - body.geo.w / 2;
  body.y = cy - body.geo.y - body.geo.h / 2;
};
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const peersOf = (all, state) => all.filter((other) => other !== state && other.layer === state.layer);

function setFx(state, fx, now) {
  const body = state.body;
  body.fx = fx;
  body.fxAt = now;
  state.drawing.dataset.doodleFx = fx;
  state.nextAt = 0;
}

function setMode(state, mode) {
  state.body.mode = mode;
  state.drawing.dataset.doodleMode = mode;
}

// Read once per resize: the figure's CSS slot and the size of its section.
export function measure(state) {
  const { drawing, layer, body } = state;
  body.geo = { x: drawing.offsetLeft, y: drawing.offsetTop, w: drawing.offsetWidth || 240, h: drawing.offsetHeight || 175 };
  if (layer) body.layerSize = [layer.clientWidth || 1, layer.clientHeight || 1];
}

// The drawing is complete: movers pick a direction, usually towards the
// nearest neighbour so that something actually happens.
export function startTurn(state, all, now) {
  const body = state.body, kind = kindOf(state);
  if (!kind.mover) return;
  const [cx, cy] = center(state);
  const peers = peersOf(all, state).filter((other) => (other.phase === 'drawing' || other.phase === 'active') && !other.body.gone);
  let target = null, best = Infinity;
  peers.forEach((other) => {
    const [ox, oy] = center(other);
    const distance = Math.hypot(ox - cx, oy - cy);
    if (distance < best) { best = distance; target = other; }
  });
  body.target = target;
  body.dir = target ? Math.sign(center(target)[0] - cx) || 1 : (cx < body.layerSize[0] / 2 ? 1 : -1);
  if (kind.windup) {
    setMode(state, 'windup');
    body.until = now + kind.windup;
  } else setMode(state, 'moving');
  if (kind.mover === 'crawl') startTrail(state);
}

// Still travelling, spinning, orbiting or waiting to come out of its shell.
// The page keeps stepping these even offscreen, or a rocket that flies out of
// view would hang there until the reader scrolled back.
export function inMotion(state) {
  const { mode, gone } = state.body;
  return !gone && (state.phase === 'active' || state.phase === 'erasing')
    && ['windup', 'moving', 'flung', 'orbiting', 'boom', 'carried', 'hidden'].includes(mode);
}

// A runner mid-charge gets a little longer to finish its run or leave, rather
// than freezing the moment its hold ends. Cats and snails stop on time.
export function travelling(state) {
  const mover = kindOf(state).mover;
  return state.body.mode === 'moving' && mover !== 'cat' && mover !== 'crawl';
}

// The hold is over and the drawing is about to be rubbed out where it is.
export function endTurn(state) {
  const body = state.body;
  if (body.cargo) drop(state);
  if (body.mode === 'moving' || body.mode === 'windup') {
    body.vx = 0; body.vy = 0;
    setMode(state, 'still');
  }
}

// A new sketch starts where the last one ended, pulled back inside the
// section if it left, and nudged clear of its neighbours.
export function resetBody(state, all) {
  const body = state.body;
  if (body.cargo) drop(state);
  if (body.carrier) body.carrier.body.cargo = null;
  fadeTrail(state);
  peersOf(all, state).forEach((other) => {
    other.body.contacts.delete(state);
    if (other.body.target === state) other.body.target = null;
    if (other.body.orbit?.planet === state) other.body.orbit.until = 0;
  });
  Object.assign(body, { vx: 0, vy: 0, angle: 0, spin: 0, tilt: null, gone: false, target: null, carrier: null, cargo: null, orbit: null, shakeUntil: 0 });
  body.contacts.clear();
  setMode(state, 'idle');
  setFx(state, '', 0);
  const { w, h } = body.geo;
  const [width, height] = body.layerSize;
  const keepIn = (value, size, extent) => (extent <= size * .5 ? size / 2 : clamp(value, size * .25, extent - size * .25));
  let [cx, cy] = center(state);
  cx = keepIn(cx, w, width); cy = keepIn(cy, h, height);
  peersOf(all, state).forEach((other) => {
    if (other.body.gone) return;
    const [ox, oy] = center(other);
    const gap = radius(state) + radius(other);
    const dx = cx - ox, dy = cy - oy, distance = Math.hypot(dx, dy);
    if (distance >= gap) return;
    const [ux, uy] = distance > .1 ? [dx / distance, dy / distance] : [0, cy < height / 2 ? 1 : -1];
    cx = keepIn(ox + ux * gap, w, width); cy = keepIn(oy + uy * gap, h, height);
  });
  place(state, cx, cy);
  write(state, 0);
}

function startTrail(state) {
  const layer = state.layer;
  if (!layer) return;
  let svg = layer.querySelector(':scope > svg[data-doodle-trails]');
  if (!svg) {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('data-doodle-trails', '');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none';
    layer.prepend(svg);
  }
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'rgba(57,54,46,.32)');
  path.setAttribute('stroke-width', '1.4');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-dasharray', '2 4');
  svg.append(path);
  state.body.trail = { path, points: [] };
}

function extendTrail(state) {
  const { trail, geo, dir } = state.body;
  if (!trail) return;
  const [cx, cy] = center(state);
  const point = [cx - dir * geo.h * .12, cy + geo.h * .27];
  const last = trail.points[trail.points.length - 1];
  if (last && Math.hypot(point[0] - last[0], point[1] - last[1]) < 6) return;
  trail.points.push(point);
  trail.path.setAttribute('d', `M${trail.points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}`);
}

function fadeTrail(state) {
  const trail = state.body.trail;
  if (!trail) return;
  state.body.trail = null;
  trail.path.style.transition = 'opacity 1.6s ease';
  trail.path.style.opacity = '0';
  setTimeout(() => trail.path.remove(), 1700);
}

export function removeTrails(all) {
  all.forEach((state) => { state.body.trail?.path.remove(); state.body.trail = null; });
}

function still(state) {
  state.body.vx = 0; state.body.vy = 0;
  setMode(state, 'still');
}

function fling(state, by, now) {
  const body = state.body, h = body.geo.h;
  const dir = Math.sign(center(state)[0] - center(by)[0]) || by.body.dir || 1;
  body.vx = dir * (1.3 + Math.random() * .5) * h;
  body.vy = -(1.1 + Math.random() * .4) * h;
  body.spin = dir * (5 + Math.random() * 3);
  body.tilt = null;
  setMode(state, 'flung');
  setFx(state, kindOf(state).flung || 'flung', now);
}

// Something lighter has been hit: it shakes, spills, shatters or flies off.
function strike(state, by, now) {
  const kind = kindOf(state), body = state.body;
  if (body.cargo) drop(state);
  if (kind.weight === HEAVY) { body.shakeUntil = now + SHAKE_TIME; return; }
  if (kind.struck) { still(state); setFx(state, kind.struck, now); return; }
  fling(state, by, now);
}

function hide(state, now) {
  const body = state.body;
  body.vx = 0; body.vy = 0;
  body.until = now + 1500;
  setMode(state, 'hidden');
  setFx(state, 'shell', now);
}

function pickUp(robot, cargo, now) {
  robot.body.cargo = cargo;
  cargo.body.carrier = robot;
  cargo.body.angle = 0; cargo.body.spin = 0;
  setMode(cargo, 'carried');
  setFx(cargo, 'carried', now);
  setFx(robot, 'carrying', now);
}

function drop(robot) {
  const cargo = robot.body.cargo;
  robot.body.cargo = null;
  if (!cargo) return;
  cargo.body.carrier = null;
  const [cx, cy] = center(robot);
  place(cargo, cx + robot.body.dir * (radius(robot) + radius(cargo)), cy);
  still(cargo);
  setFx(cargo, '', robot.body.fxAt);
  if (robot.body.fx === 'carrying') setFx(robot, '', robot.body.fxAt);
}

function capture(state, planet, now) {
  const [px, py] = center(planet);
  const [cx, cy] = center(state);
  state.body.orbit = { planet, angle: Math.atan2((cy - py) / .55, cx - px), radius: (radius(planet) + radius(state)) * .95, until: now + ORBIT_TIME };
  state.body.tilt = null;
  setMode(state, 'orbiting');
  setFx(state, 'orbiting', now);
}

// A moving drawing has run into another one.
function hit(mover, other, group, now) {
  const kind = kindOf(mover), otherKind = kindOf(other), body = mover.body;
  const heavier = otherKind.weight >= kind.weight;
  switch (kind.mover) {
    case 'rocket':
      body.vx = 0; body.vy = 0;
      setMode(mover, 'boom');
      setFx(mover, 'boom', now);
      strike(other, mover, now);
      break;
    case 'charge':
      if (!heavier) { strike(other, mover, now); break; }
      still(mover);
      body.vx = -body.dir * .5 * body.geo.h;
      setFx(mover, 'ko', now);
      if (otherKind.weight === HEAVY) other.body.shakeUntil = now + SHAKE_TIME;
      group.forEach((state) => { if (state.name === 'portrait') { state.body.winceUntil = now + 1500; state.nextAt = 0; } });
      break;
    case 'ride':
      if (!heavier) { strike(other, mover, now); break; }
      still(mover);
      body.tilt = body.dir * 1.45;
      setFx(mover, 'tipped', now);
      if (otherKind.weight === HEAVY) other.body.shakeUntil = now + SHAKE_TIME;
      break;
    case 'swim':
      if (mover.name === 'whale') {
        setFx(mover, 'slap', now);
        strike(other, mover, now);
        if (otherKind.weight === HEAVY) body.dir *= -1;
      } else {
        body.dir *= -1;
        body.x += body.dir * 6;
      }
      break;
    case 'crawl':
      hide(mover, now);
      break;
    case 'cat':
      if (other.name === 'fish') { strike(other, mover, now); still(mover); }
      else if (other.name === 'snail') { hide(other, now); still(mover); }
      break;
    case 'walk':
      if (otherKind.weight === LIGHT && !body.cargo) pickUp(mover, other, now);
      else if (otherKind.weight === LIGHT) strike(other, mover, now);
      else { if (body.cargo) drop(mover); still(mover); setFx(mover, 'sparks', now); }
      break;
    case 'hero':
      if (otherKind.weight === LIGHT) strike(other, mover, now);
      break;
  }
}

const loose = (state) => state.body.mode === 'flung' || state.body.mode === 'orbiting';
// A drawing being rubbed out is still on the page, so it can still be hit.
const touchable = (state) => (state.phase === 'active' || state.phase === 'erasing') && !state.body.gone && state.body.mode !== 'carried' && state.body.mode !== 'boom';

function meet(a, b, group, now) {
  for (const [state, planet] of [[a, b], [b, a]]) {
    if (kindOf(planet).captures && kindOf(state).weight === LIGHT && state.name !== 'rocket' && state.body.mode !== 'orbiting') {
      capture(state, planet, now);
      return;
    }
  }
  if (loose(a) || loose(b)) return;
  const movers = [a, b].filter((state) => state.body.mode === 'moving').sort((p, q) => kindOf(q).weight - kindOf(p).weight);
  movers.forEach((mover) => {
    if (mover.body.mode !== 'moving') return;
    const other = mover === a ? b : a;
    hit(mover, other, group, now);
    if (other.name === 'snail' && (other.body.mode === 'moving' || other.body.mode === 'idle')) hide(other, now);
  });
}

function steer(state, group, dt, now) {
  const body = state.body, kind = kindOf(state), h = body.geo.h, speed = (kind.speed || 0) * h;
  const [cx, cy] = center(state);
  switch (kind.mover) {
    case 'rocket':
      body.vx *= .9;
      body.vy = Math.max(-2.6 * h, body.vy - 1.2 * h * dt);
      break;
    case 'hero':
      body.vx = body.dir * speed * .75;
      body.vy = -speed * .75;
      break;
    case 'cat': {
      const prey = group.find((other) => (other.name === 'fish' || other.name === 'snail') && other.phase === 'active'
        && !other.body.gone && other.body.mode !== 'hidden' && !loose(other) && other.body.mode !== 'carried');
      if (!prey) { body.vx = 0; body.vy = 0; break; }
      const [px, py] = center(prey);
      const dx = px - cx, dy = py - cy, distance = Math.hypot(dx, dy) || 1;
      body.vx = dx / distance * speed;
      body.vy = dy / distance * speed;
      break;
    }
    default: {
      body.vx = body.dir * speed;
      let vy = 0;
      const target = body.target;
      if (target && !target.body.gone && target.phase !== 'gap') {
        const [tx, ty] = center(target);
        if (Math.sign(tx - cx) === body.dir) vy = clamp((ty - cy) * 1.4, -.4 * h, .4 * h);
      }
      if (kind.wave) vy += Math.cos(now / 1000 * 2.6) * kind.wave * h;
      body.vy = vy;
    }
  }
}

function move(state, group, dt, now) {
  const body = state.body, h = body.geo.h;
  if (body.gone || state.phase === 'waiting' || state.phase === 'gap') return;
  switch (body.mode) {
    case 'windup':
      if (now >= body.until) setMode(state, 'moving');
      break;
    case 'moving':
      steer(state, group, dt, now);
      break;
    case 'flung':
      body.vy += GRAVITY * h * dt;
      body.angle += body.spin * dt;
      break;
    case 'still': {
      const friction = Math.exp(-5 * dt);
      body.vx *= friction; body.vy *= friction;
      if (body.tilt !== null) body.angle += (body.tilt - body.angle) * Math.min(1, dt * 6);
      break;
    }
    case 'hidden':
      if (now >= body.until) { setMode(state, 'moving'); setFx(state, '', now); }
      break;
    case 'boom':
      if (now - body.fxAt > 900) body.gone = true;
      break;
    case 'carried': {
      const carrier = body.carrier;
      if (!carrier || carrier.body.cargo !== state) { body.carrier = null; still(state); setFx(state, '', now); break; }
      const [cx, cy] = center(carrier);
      place(state, cx, cy - carrier.body.geo.h * .62);
      return;
    }
    case 'orbiting': {
      const orbit = body.orbit;
      orbit.angle += 2.6 * dt;
      const [px, py] = center(orbit.planet);
      place(state, px + Math.cos(orbit.angle) * orbit.radius, py + Math.sin(orbit.angle) * orbit.radius * .55);
      body.angle += dt * 1.5;
      if (now >= orbit.until || orbit.planet.body.gone) {
        body.vx = -Math.sin(orbit.angle) * orbit.radius * 2.6 * 1.6;
        body.vy = Math.cos(orbit.angle) * orbit.radius * .55 * 2.6 * 1.6 - .6 * h;
        body.spin = 6;
        body.orbit = null;
        setMode(state, 'flung');
        setFx(state, kindOf(state).flung || 'flung', now);
      }
      return;
    }
  }
  body.x += body.vx * dt;
  body.y += body.vy * dt;
  if (body.mode === 'moving' && body.trail) extendTrail(state);
}

function collide(group, now) {
  for (let i = 0; i < group.length; i += 1) {
    for (let j = i + 1; j < group.length; j += 1) {
      const a = group[i], b = group[j];
      if (!touchable(a) || !touchable(b)) { a.body.contacts.delete(b); b.body.contacts.delete(a); continue; }
      const [ax, ay] = center(a), [bx, by] = center(b);
      if (Math.hypot(ax - bx, ay - by) >= radius(a) + radius(b)) { a.body.contacts.delete(b); b.body.contacts.delete(a); continue; }
      [a, b].forEach((state) => { if (state.body.mode === 'hidden') state.body.until = Math.max(state.body.until, now + 1200); });
      if (a.body.contacts.has(b)) continue;
      a.body.contacts.add(b); b.body.contacts.add(a);
      meet(a, b, group, now);
    }
  }
}

function write(state, now) {
  const body = state.body, kind = kindOf(state);
  let jx = 0, jy = 0;
  if (now < body.shakeUntil) {
    const fade = (body.shakeUntil - now) / SHAKE_TIME;
    jx = Math.sin(now * .09) * 4 * fade;
    jy = Math.cos(now * .11) * 1.5 * fade;
  }
  const mirror = Boolean(kind.facing) && body.dir !== kind.facing;
  const key = `${(body.x + jx).toFixed(1)} ${(body.y + jy).toFixed(1)} ${body.angle.toFixed(3)} ${mirror}`;
  if (key === body.written) return;
  body.written = key;
  const style = state.drawing.style;
  style.translate = body.x || body.y || jx || jy ? `${(body.x + jx).toFixed(1)}px ${(body.y + jy).toFixed(1)}px` : '';
  style.rotate = body.angle ? `${body.angle.toFixed(3)}rad` : '';
  style.scale = mirror ? '-1 1' : '';
}

export function step(all, dt, now) {
  const layers = new Map();
  all.forEach((state) => {
    if (!state.layer) return;
    if (!layers.has(state.layer)) layers.set(state.layer, []);
    layers.get(state.layer).push(state);
  });
  layers.forEach((group) => {
    group.forEach((state) => move(state, group, dt, now));
    collide(group, now);
    group.forEach((state) => {
      const body = state.body;
      if (state.name === 'portrait') {
        const [cx, cy] = center(state);
        let look = [0, 0], best = Infinity;
        group.forEach((other) => {
          if (other === state || other.body.gone || !['moving', 'windup', 'flung', 'orbiting'].includes(other.body.mode)) return;
          const [ox, oy] = center(other);
          const distance = Math.hypot(ox - cx, oy - cy) || 1;
          if (distance < best) { best = distance; look = [(ox - cx) / distance, (oy - cy) / distance]; }
        });
        body.look = look;
      }
      if (!body.gone && (state.phase === 'active' || state.phase === 'erasing')) {
        const [cx, cy] = center(state);
        const { w, h } = body.geo, [width, height] = body.layerSize;
        if (cx + w / 2 < 0 || cx - w / 2 > width || cy + h / 2 < 0 || cy - h / 2 > height) body.gone = true;
      }
      write(state, now);
    });
  });
}

// What doodle-notes needs to draw this turn's effects in pencil.
export function fxFor(state, now) {
  const body = state.body;
  return {
    kind: body.fx,
    t: (now - body.fxAt) / 1000,
    running: body.mode === 'windup' || (body.mode === 'moving' && Math.abs(body.vx) + Math.abs(body.vy) > 1),
    look: body.look,
    wince: now < body.winceUntil,
  };
}

export function clearMotion(all) {
  all.forEach((state) => {
    const style = state.drawing.style;
    style.translate = ''; style.rotate = ''; style.scale = '';
    state.body.written = '';
  });
}
