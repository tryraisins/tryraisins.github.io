// The launch ring is drawn fresh for every round the way a child would draw
// it: one quick wobbly loop that never quite closes, with a second pass over
// part of it, then rubbed out with a back-and-forth eraser that leaves a
// smudge. Coordinates are in the SVG's 540 x 330 viewBox.
const SVG = 'http://www.w3.org/2000/svg';
const CX = 270;
const CY = 165;
const RX = 246;
const RY = 146;

const random = (a, b) => a + Math.random() * (b - a);

function element(name, attributes = {}) {
  const node = document.createElementNS(SVG, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
  return node;
}

// Catmull-Rom through the points, written as cubic Béziers.
function smoothPath(points) {
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[Math.max(0, i - 1)];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const [x3, y3] = points[Math.min(points.length - 1, i + 2)];
    d += ` C${(x1 + (x2 - x0) / 6).toFixed(1)} ${(y1 + (y2 - y0) / 6).toFixed(1)} ${(x2 - (x3 - x1) / 6).toFixed(1)} ${(y2 - (y3 - y1) / 6).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return d;
}

// One loop: lumpy radius from slow waves, a hand that drifts outward so the
// end misses the start, and an overshoot past where it began.
function loopPoints() {
  const start = random(-2.2, -1.2);
  const direction = Math.random() < .7 ? -1 : 1;
  const sweep = Math.PI * 2 + random(.18, .42);
  const waves = [[2, random(.025, .045), random(0, 6.3)], [3, random(.015, .03), random(0, 6.3)], [5, random(.004, .01), random(0, 6.3)]];
  const drift = random(.03, .07);
  const points = [];
  const steps = 54;
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const angle = start + direction * sweep * progress;
    let scale = 1 - drift / 2 + drift * progress;
    for (const [frequency, amplitude, phase] of waves) scale += Math.sin(angle * frequency + phase) * amplitude;
    points.push([
      CX + Math.cos(angle) * RX * scale + random(-.6, .6),
      CY + Math.sin(angle) * RY * scale * random(.995, 1.005),
    ]);
  }
  return { points, start, direction, sweep };
}

export function createLaunchRing(svg) {
  if (!(svg instanceof SVGSVGElement)) return null;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const id = `ring-${Math.random().toString(36).slice(2, 8)}`;
  const defs = element('defs');
  // A little displacement roughens the edge like graphite on paper.
  const filter = element('filter', { id: `${id}-pencil`, x: '-5%', y: '-5%', width: '110%', height: '110%' });
  filter.append(
    element('feTurbulence', { type: 'fractalNoise', baseFrequency: '.9', numOctaves: 2, seed: Math.floor(random(1, 99)), result: 'grain' }),
    element('feDisplacementMap', { in: 'SourceGraphic', in2: 'grain', scale: 1.6 }),
  );
  const mask = element('mask', { id: `${id}-eraser`, maskUnits: 'userSpaceOnUse', x: -40, y: -40, width: 620, height: 410 });
  const maskPaper = element('rect', { x: -40, y: -40, width: 620, height: 410, fill: '#fff' });
  const scrub = element('path', { fill: 'none', stroke: '#000', 'stroke-width': 34, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 });
  mask.append(maskPaper, scrub);
  defs.append(filter, mask);

  const stroke = (width, opacity) => element('path', {
    fill: 'none', stroke: '#2a2a2e', 'stroke-width': width, 'stroke-opacity': opacity,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, filter: `url(#${id}-pencil)`,
  });
  const smudge = stroke(5, .1);
  const drawing = element('g', { mask: `url(#${id}-eraser)` });
  const main = stroke(1.9, .62);
  const retrace = stroke(1.3, .38);
  drawing.append(main, retrace);
  svg.replaceChildren(defs, smudge, drawing);
  svg.style.visibility = 'hidden';

  let animations = [];
  let erased = true;
  const stopAll = () => {
    animations.forEach((animation) => animation.cancel());
    animations = [];
  };
  const hide = (path) => { path.style.strokeDasharray = '1 2'; path.style.strokeDashoffset = '1'; };
  const show = (path) => { path.style.strokeDasharray = '1 0'; path.style.strokeDashoffset = '0'; };
  const play = (target, keyframes, options) => {
    const animation = target.animate(keyframes, { fill: 'forwards', ...options });
    animations.push(animation);
    return animation;
  };

  function sketch() {
    const loop = loopPoints();
    main.setAttribute('d', smoothPath(loop.points));
    smudge.setAttribute('d', main.getAttribute('d'));
    // Going back over the top third of the loop, slightly off the first line.
    const from = Math.floor(random(2, 14));
    const to = Math.min(loop.points.length - 1, from + Math.floor(random(14, 22)));
    retrace.setAttribute('d', smoothPath(loop.points.slice(from, to + 1).map(([x, y]) => [x + random(-2.2, 2.2), y + random(-2.4, 2.4)])));
    // The eraser follows the loop, rubbing back and forth across the line.
    const rub = [];
    const rubs = 34;
    for (let i = 0; i <= rubs * 2; i++) {
      const angle = loop.start + loop.direction * loop.sweep * (i / (rubs * 2));
      const across = (i % 2 ? 1 : -1) * random(14, 22);
      const nx = Math.cos(angle) / RX;
      const ny = Math.sin(angle) / RY;
      const length = Math.hypot(nx, ny);
      rub.push([CX + Math.cos(angle) * RX + nx / length * across, CY + Math.sin(angle) * RY + ny / length * across]);
    }
    scrub.setAttribute('d', `M${rub.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')}`);
  }

  return {
    // Returns how long the drawing takes, in seconds.
    draw() {
      stopAll();
      sketch();
      erased = false;
      svg.style.visibility = 'visible';
      smudge.style.opacity = '0';
      // Even a zero-length dash leaves a round cap, which would rub a hole.
      scrub.style.display = 'none';
      if (reduced.matches) {
        show(main);
        show(retrace);
        return 0;
      }
      hide(main);
      hide(retrace);
      // A child's hand speeds along the sides and slows round the ends.
      const loopTime = random(1050, 1350);
      play(main, [
        { strokeDasharray: '1 2', strokeDashoffset: 1, easing: 'ease-in' },
        { strokeDashoffset: .76, offset: .2 },
        { strokeDashoffset: .52, offset: .45, easing: 'ease-out' },
        { strokeDashoffset: .3, offset: .66 },
        { strokeDasharray: '1 2', strokeDashoffset: 0 },
      ], { duration: loopTime, easing: 'linear' });
      const retraceTime = random(380, 520);
      play(retrace, [
        { strokeDasharray: '1 2', strokeDashoffset: 1 },
        { strokeDasharray: '1 2', strokeDashoffset: 0 },
      ], { duration: retraceTime, delay: loopTime + random(60, 160), easing: 'cubic-bezier(.3,.1,.5,1)' });
      return (loopTime + retraceTime + 160) / 1000;
    },
    erase() {
      if (erased) return;
      erased = true;
      stopAll();
      if (reduced.matches) {
        svg.style.visibility = 'hidden';
        return;
      }
      show(main);
      show(retrace);
      hide(scrub);
      scrub.style.display = '';
      const rubTime = random(1300, 1700);
      play(scrub, [
        { strokeDasharray: '1 2', strokeDashoffset: 1 },
        { strokeDasharray: '1 2', strokeDashoffset: 0 },
      ], { duration: rubTime, easing: 'cubic-bezier(.4,.2,.6,.9)' });
      // Rubbing leaves a grey smear along the old line that soon fades.
      play(smudge, [{ opacity: 0 }, { opacity: 1, offset: .35 }, { opacity: 0 }], { duration: rubTime + 2200, easing: 'ease-out' })
        .finished.then(() => { if (erased) svg.style.visibility = 'hidden'; }, () => {});
    },
    dispose() {
      stopAll();
    },
  };
}
