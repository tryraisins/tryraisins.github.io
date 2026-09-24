const line = (...points) => points;
const loop = (...points) => [...points, points[0]];
const arc = (x, y, radius, start = 0, end = Math.PI * 2, steps = 30) => Array.from({ length: steps + 1 }, (_, index) => {
  const angle = start + (end - start) * index / steps;
  return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius];
});

export const sketches = [
  { name: 'portrait', paths: [arc(50, 48, 25), arc(50, 37, 26, Math.PI, Math.PI * 2), line([40, 47], [45, 47]), line([55, 47], [60, 47]), arc(50, 56, 7, .1, Math.PI - .1), line([35, 78], [42, 66], [58, 66], [66, 78])] },
  { name: 'cat', paths: [loop([30, 38], [39, 23], [48, 31], [58, 23], [70, 38], [67, 65], [50, 72], [33, 65]), line([39, 49], [45, 49]), line([55, 49], [61, 49]), line([50, 53], [50, 59]), line([50, 59], [39, 62]), line([50, 59], [61, 62]), line([34, 42], [18, 37]), line([34, 49], [16, 50]), line([66, 42], [82, 37]), line([66, 49], [84, 50])] },
  { name: 'dinosaur', paths: [loop([18, 59], [30, 44], [47, 42], [58, 31], [68, 41], [82, 43], [72, 51], [77, 62], [62, 67], [58, 80], [51, 80], [49, 67], [39, 66], [35, 78], [28, 78], [29, 62]), line([61, 45], [64, 45]), line([20, 59], [10, 51]), line([45, 42], [41, 30]), line([52, 40], [49, 28])] },
  { name: 'landscape', paths: [line([8, 71], [26, 48], [39, 65], [57, 34], [82, 71]), line([8, 71], [92, 71]), line([18, 71], [31, 57], [41, 71]), arc(75, 30, 9), line([12, 82], [36, 77], [57, 82], [88, 76])] },
  { name: 'rocket', paths: [loop([48, 19], [61, 36], [59, 61], [50, 75], [41, 61], [39, 36]), arc(50, 42, 7), line([41, 57], [28, 65], [41, 67]), line([59, 57], [72, 65], [59, 67]), line([46, 75], [42, 88], [50, 82], [57, 88], [54, 75])] },
  { name: 'house', paths: [loop([25, 48], [50, 25], [75, 48], [75, 76], [25, 76]), loop([44, 76], [44, 58], [57, 58], [57, 76]), loop([31, 53], [40, 53], [40, 62], [31, 62]), line([65, 33], [65, 22], [72, 22], [72, 39])] },
  { name: 'flower', paths: [arc(50, 50, 8), arc(50, 35, 13), arc(64, 45, 13), arc(60, 61, 13), arc(40, 61, 13), arc(36, 45, 13), line([50, 58], [50, 82]), arc(43, 72, 10, .2, 2.5), arc(57, 67, 10, .6, 2.9)] },
  { name: 'robot', paths: [loop([27, 32], [73, 32], [73, 71], [27, 71]), arc(50, 51, 4), loop([35, 43], [44, 43], [44, 52], [35, 52]), loop([56, 43], [65, 43], [65, 52], [56, 52]), line([50, 32], [50, 20]), arc(50, 17, 3), line([27, 58], [17, 58]), line([73, 58], [83, 58]), line([39, 80], [39, 71]), line([61, 80], [61, 71])] },
  { name: 'fish', paths: [arc(47, 51, 22), loop([65, 51], [84, 33], [84, 69]), arc(39, 47, 3), line([28, 56], [44, 62], [57, 58]), line([19, 44], [9, 36]), line([19, 56], [9, 64])] },
  { name: 'whale', paths: [loop([19, 60], [29, 43], [57, 40], [73, 51], [84, 38], [82, 57], [90, 64], [72, 67], [56, 77], [32, 75]), arc(44, 57, 3), line([55, 75], [58, 86]), line([58, 86], [61, 75])] },
  { name: 'mountains', paths: [line([10, 76], [33, 31], [51, 65], [69, 24], [92, 76]), line([10, 76], [92, 76]), line([28, 40], [33, 31], [39, 44]), line([64, 34], [69, 24], [75, 42]), line([15, 87], [35, 82], [56, 88], [85, 82])] },
  { name: 'coffee', paths: [loop([27, 39], [65, 39], [65, 69], [27, 69]), arc(66, 53, 11, -1.3, 1.3), arc(46, 79, 20, .1, Math.PI - .1), arc(39, 29, 8, -.2, 2.3), arc(53, 29, 8, -.2, 2.3)] },
  { name: 'guitar', paths: [arc(43, 60, 16), arc(57, 43, 16), line([52, 34], [69, 17]), loop([68, 14], [76, 18], [72, 25]), arc(43, 60, 5), line([47, 55], [71, 19])] },
  { name: 'light bulb', paths: [arc(50, 43, 20, Math.PI * 1.08, Math.PI * 2.92), line([39, 61], [43, 73], [57, 73], [61, 61]), line([43, 78], [57, 78]), line([46, 83], [54, 83]), line([50, 12], [50, 4]), line([25, 22], [18, 16]), line([75, 22], [82, 16])] },
  { name: 'planet', paths: [arc(50, 50, 23), arc(50, 50, 34, .2, Math.PI - .2), arc(50, 50, 34, Math.PI + .2, Math.PI * 2 - .2), arc(43, 42, 4), arc(61, 57, 3)] },
  { name: 'tree', paths: [line([50, 83], [50, 54]), line([50, 65], [35, 52]), line([50, 65], [64, 48]), arc(50, 42, 22), arc(33, 52, 14), arc(67, 52, 14), line([24, 84], [76, 84])] },
  { name: 'bicycle', paths: [arc(31, 66, 15), arc(70, 66, 15), line([31, 66], [43, 43], [57, 66], [31, 66]), line([43, 43], [61, 43]), line([57, 66], [67, 35]), line([61, 43], [68, 35]), line([41, 43], [36, 35]), line([67, 35], [76, 35])] },
  { name: 'cassette', paths: [loop([18, 32], [82, 32], [82, 70], [18, 70]), arc(37, 51, 9), arc(63, 51, 9), line([46, 51], [54, 51]), loop([34, 37], [66, 37], [66, 43], [34, 43]), line([40, 66], [60, 66])] },
  { name: 'snail', paths: [arc(42, 58, 20), arc(42, 58, 10), line([60, 68], [80, 68], [85, 60]), line([80, 68], [85, 78]), line([77, 58], [79, 48]), line([84, 58], [88, 48]), arc(79, 48, 2), arc(88, 48, 2)] },
  { name: 'hero insignia', paths: [arc(50, 50, 29), loop([33, 67], [51, 27], [68, 67], [57, 58], [50, 70], [43, 58]), line([41, 54], [59, 54]), arc(50, 50, 21)] },
];

const DRAW_DURATION = 5200;
const HOLD_DURATION = 11000;
const ERASE_DURATION = 2600;
const DOODLE_START_INTERVAL_MIN = 1000;
const DOODLE_START_INTERVAL_MAX = 3000;
const LOOP_DURATION = DRAW_DURATION + HOLD_DURATION + ERASE_DURATION;

const lengthOf = (points) => points.slice(1).reduce((total, point, index) => total + Math.hypot(point[0] - points[index][0], point[1] - points[index][1]), 0);
const pathLength = (points) => lengthOf(points);

function drawPath(context, points, progress, width, height) {
  if (progress <= 0) return;
  let remaining = pathLength(points) * Math.min(progress, 1);
  context.beginPath();
  context.moveTo(points[0][0] * width / 100, points[0][1] * height / 100);
  for (let index = 1; index < points.length && remaining > 0; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    const segment = Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    const amount = Math.min(1, remaining / segment);
    context.lineTo((previous[0] + (point[0] - previous[0]) * amount) * width / 100, (previous[1] + (point[1] - previous[1]) * amount) * height / 100);
    remaining -= segment;
  }
  context.stroke();
}

function drawAuto(context, paths, progress, width, height) {
  const total = paths.reduce((sum, path) => sum + pathLength(path), 0);
  let remaining = total * Math.min(1, Math.max(0, progress));
  paths.forEach((path) => {
    const length = pathLength(path);
    drawPath(context, path, Math.min(1, remaining / length), width, height);
    remaining -= length;
  });
}

function drawReverse(context, paths, progress, width, height) {
  let remaining = paths.reduce((sum, path) => sum + pathLength(path), 0) * Math.max(0, 1 - progress);
  paths.forEach((path) => {
    const length = pathLength(path);
    const visible = Math.min(length, Math.max(0, remaining));
    drawPath(context, path, visible / length, width, height);
    remaining -= length;
  });
}

const translatePath = (path, dx, dy) => path.map(([x, y]) => [x + dx, y + dy]);
const rotatePath = (path, cx, cy, angle) => path.map(([x, y]) => [
  cx + (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle),
  cy + (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle),
]);
const sample = (from, to, count, pointAt) => Array.from({ length: count + 1 }, (_, index) => pointAt(index / count, from, to));

export function animatedPaths(name, originalPaths, time) {
  const settle = Math.min(1, time / .45);
  const paths = originalPaths.map((path) => path.map(([x, y]) => [x, y]));
  const sway = Math.sin(time * 2.2) * settle;

  if (name === 'portrait') {
    const blink = Math.max(0, Math.cos(time * 1.5)) ** 28 * settle;
    [2, 3].forEach((index) => {
      const center = (paths[index][0][0] + paths[index][1][0]) / 2;
      paths[index] = paths[index].map(([x, y]) => [center + (x - center) * (1 - blink), y + blink * 1.4]);
    });
  } else if (name === 'cat') {
    paths[0] = rotatePath(paths[0], 50, 65, sway * .035);
    const tailWag = Math.sin(time * 2.7) * 8 * settle;
    paths.push(sample(0, 1, 14, (t) => [66 + t * 15, 63 + Math.sin(t * Math.PI) * (4 + tailWag) + t * 4]));
  } else if (name === 'dinosaur') {
    const step = Math.sin(time * 2.5) * 1.4 * settle;
    paths[0] = translatePath(paths[0], 0, Math.abs(step));
    paths[0] = paths[0].map(([x, y]) => [x, y + (x < 43 && y > 63 ? step : 0)]);
    paths[2] = rotatePath(paths[2], 20, 58, sway * .12);
  } else if (name === 'landscape') {
    paths[3] = translatePath(paths[3], 0, Math.sin(time * 1.3) * 2 * settle);
    const cloudX = (time * 8) % 120 - 12;
    paths.push(sample(0, 1, 20, (t) => [cloudX + t * 13, 22 + Math.sin(t * Math.PI * 2) * 1.8]));
  } else if (name === 'rocket') {
    const lift = (1 - Math.cos(time * 2.1)) * 1.5 * settle;
    paths.forEach((path, index) => { paths[index] = translatePath(path, 0, -lift); });
    const flame = Math.sin(time * 16) * 2.5 * settle;
    paths[4] = paths[4].map(([x, y], index) => [x, y + (index > 0 && index < 4 ? flame : 0)]);
  } else if (name === 'house') {
    const smoke = time * 2;
    paths.push(sample(0, 1, 16, (t) => [68 + Math.sin(smoke + t * 3) * (1 + t * 2), 22 - t * 13]));
    const windowGlow = .5 + Math.sin(time * 2.8) * .5;
    paths.push(windowGlow > .62 ? loop([32, 54], [39, 54], [39, 61], [32, 61]) : line([35, 54], [35, 61]));
  } else if (name === 'flower') {
    const bend = Math.sin(time * 1.8) * 6 * settle;
    paths[6] = paths[6].map(([x, y]) => [x + ((y - 58) / 24) * bend, y]);
    paths.slice(0, 6).forEach((path, index) => { paths[index] = translatePath(path, bend, 0); });
    paths[7] = rotatePath(paths[7], 50, 72, sway * .08);
    paths[8] = rotatePath(paths[8], 50, 67, -sway * .08);
  } else if (name === 'robot') {
    const blink = Math.max(0, Math.cos(time * 1.25)) ** 24 * settle;
    [2, 3].forEach((index) => {
      const middle = (paths[index][0][1] + paths[index][2][1]) / 2;
      paths[index] = paths[index].map(([x, y]) => [x, middle + (y - middle) * (1 - blink)]);
    });
    paths[6] = rotatePath(paths[6], 27, 58, sway * .13);
    paths[7] = rotatePath(paths[7], 73, 58, -sway * .13);
  } else if (name === 'fish') {
    paths[1] = rotatePath(paths[1], 65, 51, Math.sin(time * 5) * .25 * settle);
    paths[0] = translatePath(paths[0], Math.sin(time * 2.5) * 1.2 * settle, 0);
    const bubble = (time * 10) % 28;
    paths.push(arc(24, 52 - bubble, 1.4, 0, Math.PI * 2, 12));
  } else if (name === 'whale') {
    const tailBeat = Math.sin(time * 2.1) * 2.5 * settle;
    paths[0] = paths[0].map(([x, y]) => [x > 78 ? x + tailBeat : x, y]);
    const blow = Math.max(0, Math.sin(time * 1.8)) * settle;
    paths.push(sample(0, 1, 10, (t) => [51 + Math.sin(t * Math.PI * 2) * 2, 41 - t * (4 + blow * 8)]));
  } else if (name === 'mountains') {
    const cloudX = (time * 7) % 120 - 12;
    paths.push(sample(0, 1, 20, (t) => [cloudX + t * 13, 22 + Math.sin(t * Math.PI * 2) * 1.8]));
    paths.push(arc(77, 34 + Math.sin(time) * 1.5, 6, Math.PI, Math.PI * 2, 16));
  } else if (name === 'coffee') {
    [0, 1].forEach((index) => {
      const x = index ? 53 : 39;
      const curl = time * 2 + index * Math.PI;
      paths.push(sample(0, 1, 16, (t) => [x + Math.sin(curl + t * 4) * (1 + t * 2), 34 - t * 19]));
    });
  } else if (name === 'guitar') {
    const vibration = Math.sin(time * 24) * 1.8 * settle;
    paths[5] = sample(0, 1, 14, (t) => [47 + t * 24 + Math.sin(t * Math.PI * 5) * vibration, 55 - t * 36]);
  } else if (name === 'light bulb') {
    const pulse = (Math.sin(time * 3) + 1) * .5 * settle;
    [[4, [50, 12]], [5, [25, 22]], [6, [75, 22]]].forEach(([index, [cx, cy]]) => {
      paths[index] = paths[index].map(([x, y]) => [cx + (x - cx) * (1 + pulse * .24), cy + (y - cy) * (1 + pulse * .24)]);
    });
  } else if (name === 'planet') {
    const satellite = time * 1.2;
    paths.push(arc(50 + Math.cos(satellite) * 34, 50 + Math.sin(satellite) * 19, 2.2, 0, Math.PI * 2, 12));
  } else if (name === 'bicycle') {
    [31, 70].forEach((center, wheel) => {
      const angle = time * 3.3 * (wheel ? -1 : 1);
      for (let spoke = 0; spoke < 4; spoke += 1) {
        const a = angle + spoke * Math.PI / 2;
        paths.push(line([center, 66], [center + Math.cos(a) * 13, 66 + Math.sin(a) * 13]));
      }
    });
  } else if (name === 'cassette') {
    [37, 63].forEach((center, reel) => {
      const angle = time * (reel ? -2.8 : 2.8);
      for (let spoke = 0; spoke < 3; spoke += 1) {
        const a = angle + spoke * Math.PI * 2 / 3;
        paths.push(line([center, 51], [center + Math.cos(a) * 7, 51 + Math.sin(a) * 7]));
      }
    });
  } else if (name === 'tree') {
    paths[1] = rotatePath(paths[1], 50, 65, sway * .1);
    paths[2] = rotatePath(paths[2], 50, 65, -sway * .1);
    [3, 4, 5].forEach((index) => {
      paths[index] = translatePath(paths[index], Math.sin(time * 2.2 + index) * 1.5 * settle, 0);
    });
  } else if (name === 'snail') {
    const creep = (1 - Math.cos(time * .7)) * 1.1 * settle;
    paths.slice(0, 4).forEach((path, index) => { paths[index] = translatePath(path, creep, 0); });
    const nod = Math.sin(time * 1.6) * .13 * settle;
    [4, 5, 6, 7].forEach((index) => { paths[index] = rotatePath(paths[index], 80, 60, nod); });
  } else if (name === 'hero insignia') {
    paths.forEach((path, index) => { paths[index] = rotatePath(path, 50, 50, sway * .08); });
  }

  return paths;
}

export function mountDoodles(root) {
  const doodles = [...root.querySelectorAll('[data-doodle]')]
    .map((drawing) => ({ drawing, canvas: drawing.querySelector('[data-doodle-canvas]') }))
    .filter((state) => state.canvas instanceof HTMLCanvasElement);
  let nextStart = performance.now();
  const drawings = doodles.map(({ drawing, canvas }, index) => {
    if (index > 0) nextStart += DOODLE_START_INTERVAL_MIN + Math.random() * (DOODLE_START_INTERVAL_MAX - DOODLE_START_INTERVAL_MIN);
    return { drawing, canvas, sketch: index % sketches.length, phase: 'drawing', started: nextStart };
  });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const draw = (state, now) => {
    const canvas = state.canvas;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.width; const height = canvas.height;
    const elapsed = reduced.matches ? 8000 : now - state.started;
    const phase = elapsed % LOOP_DURATION;
    if (phase < DRAW_DURATION) state.phase = 'drawing';
    else if (phase < DRAW_DURATION + HOLD_DURATION) state.phase = 'complete';
    else state.phase = 'reversing';
    state.drawing.dataset.doodleState = state.phase;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = 'rgba(48, 49, 43, .76)'; context.lineWidth = Math.max(1.2, width / 155); context.lineJoin = 'round'; context.lineCap = 'round'; context.globalCompositeOperation = 'multiply';
    const sketch = sketches[state.sketch];
    const elapsedHold = (phase - DRAW_DURATION) / 1000;
    const paths = state.phase !== 'drawing' && !reduced.matches
      ? animatedPaths(sketch.name, sketch.paths, state.phase === 'complete' ? elapsedHold : HOLD_DURATION / 1000)
      : sketch.paths;
    if (state.phase === 'drawing') drawAuto(context, paths, phase / DRAW_DURATION, width, height);
    if (state.phase === 'complete') {
      drawAuto(context, paths, 1, width, height);
    }
    if (state.phase === 'reversing') { const reverse = (phase - DRAW_DURATION - HOLD_DURATION) / ERASE_DURATION; drawReverse(context, paths, reverse, width, height); }
    if (state.phase === 'reversing' && phase >= LOOP_DURATION - 20) { state.sketch = (state.sketch + 1 + indexOf(state)) % sketches.length; state.started = now; }
  };
  const indexOf = (state) => drawings.indexOf(state);
  const loopFrame = (now) => {
    drawings.forEach((state) => draw(state, now));
    if (!reduced.matches) frame = requestAnimationFrame(loopFrame);
  };
  const motionChange = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(loopFrame);
  };
  reduced.addEventListener('change', motionChange);
  frame = requestAnimationFrame(loopFrame);
  return () => { cancelAnimationFrame(frame); reduced.removeEventListener('change', motionChange); };
}
