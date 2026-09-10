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

function drawUserReverse(context, strokes, progress, width, height) {
  let remaining = strokes.reduce((sum, stroke) => sum + pathLength(stroke), 0) * Math.max(0, 1 - progress);
  const visible = new Map();
  [...strokes].reverse().forEach((stroke) => {
    const length = pathLength(stroke);
    visible.set(stroke, Math.min(length, Math.max(0, remaining)));
    remaining -= length;
  });
  strokes.forEach((stroke) => drawPath(context, stroke, (visible.get(stroke) || 0) / pathLength(stroke), width, height));
}

function drawSecondary(context, name, time, width, height) {
  const x = (value) => value * width / 100;
  const y = (value) => value * height / 100;
  context.save();
  context.globalAlpha = .42;
  context.lineWidth = 1.6;
  context.setLineDash([5, 6]);
  context.beginPath();
  if (name === 'mountains' || name === 'landscape') {
    const cloudX = (time * 8) % 130 - 20;
    context.arc(x(cloudX), y(23), x(6), 0, Math.PI * 2);
    context.arc(x(cloudX + 7), y(21), x(8), 0, Math.PI * 2);
    context.moveTo(x(10 + Math.sin(time * 2) * 3), y(64)); context.lineTo(x(30), y(62));
    context.moveTo(x(18 + Math.sin(time * 1.4) * 4), y(69)); context.lineTo(x(38), y(67));
  } else if (name === 'tree') {
    context.moveTo(x(30), y(42 + Math.sin(time * 2) * 2)); context.lineTo(x(27), y(48));
    context.moveTo(x(71), y(50 + Math.sin(time * 1.7) * 2)); context.lineTo(x(74), y(57));
    context.arc(x(37 + Math.sin(time) * 5), y(74 + (time % 2) * 8), x(2), 0, Math.PI * 2);
  } else if (name === 'light bulb') {
    const pulse = Math.sin(time * 3) * 3;
    context.moveTo(x(50), y(2)); context.lineTo(x(50), y(10 + pulse));
    context.moveTo(x(19), y(13)); context.lineTo(x(26 + pulse), y(20));
    context.moveTo(x(81), y(13)); context.lineTo(x(74 - pulse), y(20));
  } else if (name === 'planet') {
    context.arc(x(50), y(50), x(36), time % 2, Math.PI + (time % 2));
  } else if (name === 'flower') {
    context.moveTo(x(50), y(59)); context.lineTo(x(50 + Math.sin(time * 2) * 4), y(82));
  }
  context.stroke();
  context.restore();
}

export function mountDoodles(root) {
  const notes = [...root.querySelectorAll('[data-doodle]')].map((note, index) => ({
    note, canvas: note.querySelector('[data-doodle-canvas]'), sketch: index % sketches.length, phase: 'drawing', started: performance.now() + index * 500, userStrokes: [], activeStroke: null,
  })).filter((state) => state.canvas instanceof HTMLCanvasElement);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const draw = (state, now) => {
    const canvas = state.canvas;
    const context = canvas.getContext('2d');
    if (!context) return;
    const width = canvas.width; const height = canvas.height;
    const elapsed = reduced.matches ? 8000 : now - state.started;
    const phase = elapsed % 23000;
    const previousPhase = state.phase;
    if (phase < 8000) state.phase = 'drawing';
    else if (phase < 19000) state.phase = 'complete';
    else state.phase = 'reversing';
    if (state.phase === 'reversing' && previousPhase === 'complete' && state.activeStroke) {
      if (state.activeStroke.length > 1) state.userStrokes.push(state.activeStroke);
      state.activeStroke = null;
    }
    state.note.dataset.doodleState = state.phase;
    context.clearRect(0, 0, width, height);
    context.strokeStyle = 'rgba(48, 49, 43, .82)'; context.lineWidth = 2.1; context.lineJoin = 'round'; context.lineCap = 'round';
    const paths = sketches[state.sketch].paths;
    if (state.phase === 'drawing') drawAuto(context, paths, phase / 8000, width, height);
    if (state.phase === 'complete') {
      drawAuto(context, paths, 1, width, height);
      state.userStrokes.forEach((stroke) => drawPath(context, stroke, 1, width, height));
      drawSecondary(context, sketches[state.sketch].name, (phase - 8000) / 1000, width, height);
    }
    if (state.phase === 'reversing') { const reverse = (phase - 19000) / 4000; drawReverse(context, paths, reverse, width, height); drawUserReverse(context, state.userStrokes, reverse, width, height); }
    if (state.activeStroke && state.phase === 'complete') drawPath(context, state.activeStroke, 1, width, height);
    if (state.phase === 'reversing' && phase >= 22980) { state.userStrokes = []; state.activeStroke = null; state.sketch = (state.sketch + 1 + indexOf(state)) % sketches.length; state.started = now; }
  };
  const indexOf = (state) => notes.indexOf(state);
  const loopFrame = (now) => { notes.forEach((state) => draw(state, now)); frame = requestAnimationFrame(loopFrame); };
  const point = (event, canvas) => { const rect = canvas.getBoundingClientRect(); return [(event.clientX - rect.left) * canvas.width / rect.width, (event.clientY - rect.top) * canvas.height / rect.height]; };
  const cleanups = notes.map((state) => {
    const canvas = state.canvas;
    const down = (event) => { if (state.phase !== 'complete') return; canvas.setPointerCapture(event.pointerId); state.activeStroke = [point(event, canvas)]; };
    const move = (event) => { if (!state.activeStroke || state.phase !== 'complete') return; state.activeStroke.push(point(event, canvas)); };
    const up = () => {
      if (!state.activeStroke) return;
      if (state.phase === 'complete' && state.activeStroke.length > 1) state.userStrokes.push(state.activeStroke);
      state.activeStroke = null;
    };
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move); canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    return () => { canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); };
  });
  frame = requestAnimationFrame(loopFrame);
  return () => { cancelAnimationFrame(frame); cleanups.forEach((cleanup) => cleanup()); };
}
