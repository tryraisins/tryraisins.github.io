const line = (...points) => points;
const loop = (...points) => [...points, points[0]];
const arc = (x, y, radius, start = 0, end = Math.PI * 2, steps = 30) => Array.from({ length: steps + 1 }, (_, index) => {
  const angle = start + (end - start) * index / steps;
  return [x + Math.cos(angle) * radius, y + Math.sin(angle) * radius];
});
const curve = (a, b, c, d, steps = 28) => Array.from({ length: steps + 1 }, (_, index) => {
  const t = index / steps, u = 1 - t;
  return [u ** 3 * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t ** 3 * d[0],
    u ** 3 * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t ** 3 * d[1]];
});
const ellipse = (x, y, rx, ry, start, end) => Array.from({ length: 37 }, (_, i) => {
  const angle = start + (end - start) * i / 36, dx = Math.cos(angle) * rx, dy = Math.sin(angle) * ry;
  return [x + dx * Math.cos(-.25) - dy * Math.sin(-.25), y + dx * Math.sin(-.25) + dy * Math.cos(-.25)];
});
const hatch = (x, y, count, length = 6) => Array.from({ length: count }, (_, index) => line(
  [x + index * 2.1, y + Math.sin(index * 1.8) * .7], [x + index * 2.1 - 3, y + length],
));

export const sketches = [
  { name: 'portrait', paths: [loop([28, 40], [29, 57], [36, 69], [51, 73], [66, 64], [73, 48], [69, 34], [53, 27], [37, 29], [28, 40]), line([27, 44], [23, 31], [31, 23], [36, 27], [40, 17], [47, 24], [52, 16], [60, 24], [66, 23], [76, 32], [73, 43]), arc(40, 46, 2), arc(58, 45, 2.4), curve([40, 58], [47, 65], [56, 63], [61, 55]), line([25, 91], [32, 81], [42, 77], [41, 69], [58, 69], [59, 77], [71, 81], [76, 91]), line([49, 47], [46, 54], [51, 54]), curve([30, 44], [21, 39], [19, 57], [31, 55]), curve([70, 41], [81, 36], [82, 54], [71, 53]), line([42, 77], [50, 85], [59, 77]), ...hatch(35, 29, 12, 7), line([35, 85], [36, 91]), line([67, 84], [66, 91])] },
  { name: 'cat', paths: [loop([30, 39], [33, 18], [47, 31], [58, 28], [72, 17], [72, 42], [67, 62], [51, 69], [34, 61]), arc(41, 46, 2), arc(60, 45, 2.3), loop([48, 51], [54, 51], [51, 55]), curve([51, 55], [49, 61], [41, 61], [40, 57]), curve([51, 55], [53, 61], [59, 60], [62, 56]), line([35, 51], [15, 45]), line([35, 55], [13, 57]), line([66, 50], [85, 43]), line([66, 55], [86, 57]), curve([64, 76], [85, 87], [89, 57], [78, 62]), curve([37, 63], [26, 94], [77, 95], [64, 63]), line([43, 75], [41, 87], [46, 87]), line([56, 74], [58, 87], [53, 87]), line([34, 29], [40, 35]), line([67, 29], [61, 34]), ...hatch(37, 35, 3), ...hatch(55, 32, 3)] },
  { name: 'dinosaur', paths: [loop([18, 59], [30, 44], [47, 42], [58, 31], [68, 41], [82, 43], [72, 51], [77, 62], [62, 67], [58, 80], [51, 80], [49, 67], [39, 66], [35, 78], [28, 78], [29, 62]), line([61, 45], [64, 45]), line([20, 59], [10, 51]), line([45, 42], [41, 30]), line([52, 40], [49, 28])] },
  { name: 'landscape', paths: [line([8, 71], [26, 48], [39, 65], [57, 34], [82, 71]), line([8, 71], [92, 71]), line([18, 71], [31, 57], [41, 71]), arc(75, 30, 9), line([12, 82], [36, 77], [57, 82], [88, 76])] },
  { name: 'rocket', paths: [loop([48, 19], [61, 36], [59, 61], [50, 75], [41, 61], [39, 36]), arc(50, 42, 7), line([41, 57], [28, 65], [41, 67]), line([59, 57], [72, 65], [59, 67]), line([46, 75], [42, 88], [50, 82], [57, 88], [54, 75])] },
  { name: 'house', paths: [loop([25, 48], [50, 25], [75, 48], [75, 76], [25, 76]), loop([44, 76], [44, 58], [57, 58], [57, 76]), loop([31, 53], [40, 53], [40, 62], [31, 62]), line([65, 33], [65, 22], [72, 22], [72, 39])] },
  { name: 'flower', paths: [arc(50, 44, 8), curve([45, 37], [23, 8], [66, 8], [56, 38]), curve([57, 40], [84, 20], [91, 64], [57, 48]), curve([56, 50], [78, 80], [47, 81], [50, 52]), curve([46, 51], [22, 85], [10, 45], [43, 46]), curve([43, 43], [11, 39], [32, 15], [45, 37]), curve([50, 52], [48, 66], [51, 75], [49, 90]), curve([49, 74], [25, 71], [33, 58], [49, 74]), curve([50, 68], [71, 53], [76, 74], [50, 68]), ...hatch(46, 40, 5, 6), line([29, 91], [48, 89], [67, 91])] },
  { name: 'robot', paths: [loop([27, 32], [73, 32], [73, 71], [27, 71]), arc(50, 51, 4), loop([35, 43], [44, 43], [44, 52], [35, 52]), loop([56, 43], [65, 43], [65, 52], [56, 52]), line([50, 32], [50, 20]), arc(50, 17, 3), line([27, 58], [17, 58]), line([73, 58], [83, 58]), line([39, 80], [39, 71]), line([61, 80], [61, 71])] },
  { name: 'fish', paths: [curve([67, 51], [50, 14], [5, 47], [26, 62]).concat(curve([26, 62], [43, 76], [58, 67], [67, 51]).slice(1)), loop([65, 51], [85, 32], [81, 52], [86, 70]), arc(31, 48, 2.4), curve([24, 55], [30, 60], [34, 58], [38, 56]), curve([47, 34], [39, 18], [60, 20], [58, 39]), curve([47, 64], [51, 78], [62, 76], [57, 62]), curve([40, 37], [47, 45], [48, 56], [39, 65]), ...hatch(53, 44, 4, 10)] },
  { name: 'whale', paths: [loop([19, 60], [29, 43], [57, 40], [73, 51], [84, 38], [82, 57], [90, 64], [72, 67], [56, 77], [32, 75]), arc(44, 57, 3), line([55, 75], [58, 86]), line([58, 86], [61, 75])] },
  { name: 'mountains', paths: [line([10, 76], [33, 31], [51, 65], [69, 24], [92, 76]), line([10, 76], [92, 76]), line([28, 40], [33, 31], [39, 44]), line([64, 34], [69, 24], [75, 42]), line([15, 87], [35, 82], [56, 88], [85, 82])] },
  { name: 'coffee', paths: [loop([27, 39], [65, 39], [65, 69], [27, 69]), arc(66, 53, 11, -1.3, 1.3), arc(46, 79, 20, .1, Math.PI - .1), arc(39, 29, 8, -.2, 2.3), arc(53, 29, 8, -.2, 2.3)] },
  { name: 'guitar', paths: [arc(43, 60, 16), arc(57, 43, 16), line([52, 34], [69, 17]), loop([68, 14], [76, 18], [72, 25]), arc(43, 60, 5), line([47, 55], [71, 19])] },
  { name: 'light bulb', paths: [arc(50, 43, 20, Math.PI * 1.08, Math.PI * 2.92), line([39, 61], [43, 73], [57, 73], [61, 61]), line([43, 78], [57, 78]), line([46, 83], [54, 83]), line([50, 12], [50, 4]), line([25, 22], [18, 16]), line([75, 22], [82, 16])] },
  { name: 'planet', paths: [arc(50, 50, 23), ellipse(50, 50, 37, 12, .1, Math.PI - .1), ellipse(50, 50, 37, 12, Math.PI + .1, Math.PI * 2 - .1), arc(43, 42, 4), arc(61, 57, 3)] },
  { name: 'tree', paths: [line([50, 83], [50, 54]), line([50, 65], [35, 52]), line([50, 65], [64, 48]), arc(50, 42, 22), arc(33, 52, 14), arc(67, 52, 14), line([24, 84], [76, 84])] },
  { name: 'bicycle', paths: [arc(31, 66, 15), arc(70, 66, 15), line([31, 66], [43, 43], [57, 66], [31, 66]), line([43, 43], [61, 43]), line([57, 66], [67, 35]), line([61, 43], [68, 35]), line([41, 43], [36, 35]), line([67, 35], [76, 35])] },
  { name: 'cassette', paths: [loop([18, 32], [82, 32], [82, 70], [18, 70]), arc(37, 51, 9), arc(63, 51, 9), line([46, 51], [54, 51]), loop([34, 37], [66, 37], [66, 43], [34, 43]), line([40, 66], [60, 66])] },
  { name: 'snail', paths: [arc(42, 58, 20), Array.from({ length: 65 }, (_, i) => { const t = i / 64 * Math.PI * 4; return [42 + Math.cos(t) * (1 + i / 64 * 15), 58 + Math.sin(t) * (1 + i / 64 * 15)]; }), curve([60, 68], [81, 55], [95, 71], [85, 76]), curve([85, 76], [57, 81], [20, 80], [19, 75]), line([77, 64], [77, 47]), line([84, 64], [89, 45]), arc(77, 46, 2.5), arc(89, 44, 2.5), curve([79, 69], [80, 73], [86, 72], [88, 68]), ...hatch(31, 77, 10, 2)] },
  { name: 'hero insignia', paths: [arc(50, 50, 29), loop([33, 67], [51, 27], [68, 67], [57, 58], [50, 70], [43, 58]), line([41, 54], [59, 54]), arc(50, 50, 21)] },
];

// Small, imperfect details make these classroom sketches, rather than icons.
const details = {
  dinosaur: [line([66, 48], [70, 49]), line([31, 77], [32, 73]), line([54, 79], [55, 74]), ...hatch(37, 52, 6, 8)],
  landscape: [curve([13, 26], [16, 18], [24, 19], [27, 25]), curve([26, 25], [29, 14], [39, 19], [39, 26]), line([12, 27], [40, 27]), ...hatch(29, 60, 5, 8)],
  rocket: [line([44, 58], [56, 58]), line([43, 61], [57, 61]), line([24, 19], [26, 15], [28, 19], [32, 21], [28, 23], [26, 27], [24, 23], [20, 21], [24, 19]), ...hatch(45, 29, 3, 6)],
  house: [line([22, 47], [49, 22], [78, 47]), line([34, 54], [34, 61]), line([31, 58], [40, 58]), arc(55, 67, 1.1), line([10, 79], [27, 77], [48, 80], [86, 78]), ...hatch(27, 68, 5, 7)],
  robot: [line([37, 62], [44, 64], [56, 64], [63, 60]), line([32, 35], [69, 35]), line([20, 53], [16, 58], [20, 63]), line([80, 53], [85, 58], [80, 62]), line([34, 80], [43, 80]), line([56, 80], [66, 80]), ...hatch(30, 65, 4, 3)],
  whale: [curve([28, 65], [32, 72], [41, 73], [51, 71]), curve([49, 69], [55, 59], [61, 61], [60, 74]), ...hatch(33, 66, 7, 5)],
  mountains: [line([78, 53], [88, 54], [89, 67]), ...hatch(35, 61, 5, 12), ...hatch(69, 50, 5, 17)],
  coffee: [curve([28, 39], [31, 43], [58, 43], [64, 39]), arc(46, 54, 6), line([43, 52], [49, 52]), curve([43, 56], [45, 58], [48, 58], [50, 54]), ...hatch(29, 55, 4, 10)],
  guitar: [line([40, 66], [48, 59]), line([50, 55], [72, 21]), line([46, 52], [68, 17]), ...hatch(33, 61, 4, 6)],
  'light bulb': [line([44, 72], [43, 54], [50, 61], [57, 53], [56, 72]), ...hatch(39, 29, 3, 7)],
  planet: [arc(45, 52, 2), arc(57, 37, 3), ...hatch(35, 54, 4, 8), line([85, 17], [85, 25]), line([81, 21], [89, 21])],
  tree: [line([47, 71], [47, 79]), ...hatch(41, 30, 7, 8), ...hatch(26, 51, 4, 7)],
  bicycle: [line([32, 34], [43, 34]), line([76, 35], [78, 42]), arc(54, 64, 3), line([54, 64], [50, 71], [46, 71]), line([12, 84], [85, 85])],
  cassette: [line([22, 34], [23, 38]), line([78, 33], [78, 38]), line([22, 65], [24, 68]), line([77, 65], [79, 67]), line([33, 59], [30, 70]), line([67, 59], [70, 70]), ...hatch(25, 43, 3, 10)],
  'hero insignia': [...hatch(38, 39, 3, 13), ...hatch(60, 43, 3, 9)],
};
sketches.forEach((sketch) => { sketch.paths.push(...(details[sketch.name] || [])); });

const DRAW_DURATION = 5200;
const HOLD_DURATION = 11000;
const ERASE_DURATION = 2600;
const DOODLE_START_INTERVAL_MIN = 1000;
const DOODLE_START_INTERVAL_MAX = 3000;
const LOOP_DURATION = DRAW_DURATION + HOLD_DURATION + ERASE_DURATION;

const lengthOf = (points) => points.slice(1).reduce((total, point, index) => total + Math.hypot(point[0] - points[index][0], point[1] - points[index][1]), 0);
const pathLength = (points) => lengthOf(points);

function drawPath(context, points, progress, width, height, seed) {
  if (progress <= 0) return;
  let remaining = pathLength(points) * Math.min(progress, 1);
  const scale = Math.min(width, height) / 100;
  const offsetX = (width - scale * 100) / 2;
  const rough = (x, y, distance, pass) => [
    offsetX + (x + Math.sin(distance * 2.1 + seed) * .24 + Math.sin(distance * .47 + seed) * .32) * scale + pass * .4,
    (y + Math.cos(distance * 1.7 + seed) * .22 + Math.sin(distance * .61 + seed * 2) * .28) * scale - pass * .3,
  ];
  const visible = [rough(...points[0], 0, 0)];
  let travelled = 0;
  for (let index = 1; index < points.length && remaining > 0; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    const segment = Math.hypot(point[0] - previous[0], point[1] - previous[1]);
    if (segment < .0001) continue;
    const amount = Math.min(1, remaining / segment), count = Math.max(1, Math.ceil(segment * amount / .9));
    for (let sample = 1; sample <= count; sample += 1) {
      const t = amount * sample / count;
      visible.push(rough(previous[0] + (point[0] - previous[0]) * t, previous[1] + (point[1] - previous[1]) * t, travelled + segment * t, 0));
    }
    travelled += segment;
    remaining -= segment;
  }
  // A soft rubbed edge, pressure changes and a faint second attempt at the line.
  for (const [pass, opacity, thickness] of [[1, .12, 1.45], [0, .68, .68], [2, .17, .38]]) {
    context.strokeStyle = `rgba(57, 54, 46, ${opacity})`;
    for (let start = 0; start < visible.length - 1; start += 6) {
      context.beginPath();
      const pressure = .82 + Math.sin(seed + start * .17) * .18;
      context.lineWidth = Math.max(.45, scale * thickness * pressure);
      const end = Math.min(visible.length - 1, start + 6);
      for (let i = start; i <= end; i += 1) {
        const [x, y] = visible[i];
        if (i === start) context.moveTo(x + pass * .25, y - pass * .19);
        else context.lineTo(x + pass * .25, y - pass * .19);
      }
      context.stroke();
    }
  }
  context.fillStyle = 'rgba(57, 54, 46, .2)';
  for (let i = 3; i < visible.length; i += 7) {
    const [x, y] = visible[i], grain = Math.sin(i * 13.7 + seed);
    context.fillRect(x + grain * scale, y + Math.cos(i * 4.3 + seed) * scale, .34 * scale, .28 * scale);
  }
}

function drawAuto(context, paths, progress, width, height) {
  const total = paths.reduce((sum, path) => sum + pathLength(path), 0);
  let remaining = total * Math.min(1, Math.max(0, progress));
  paths.forEach((path, index) => {
    const length = pathLength(path);
    drawPath(context, path, Math.min(1, remaining / length), width, height, index * 17.31);
    remaining -= length;
  });
}

function drawReverse(context, paths, progress, width, height) {
  let remaining = paths.reduce((sum, path) => sum + pathLength(path), 0) * Math.max(0, 1 - progress);
  paths.forEach((path, index) => {
    const length = pathLength(path);
    const visible = Math.min(length, Math.max(0, remaining));
    drawPath(context, path, visible / length, width, height, index * 17.31);
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
  const settle = Math.min(1, time / .7);
  const paths = originalPaths.map((path) => path.map(([x, y]) => [x, y]));
  const sway = Math.sin(time * 2.2) * settle;

  if (name === 'portrait') {
    const blink = Math.max(0, Math.cos(time * 1.5 + 1.8)) ** 38 * settle;
    [2, 3].forEach((index) => {
      const center = index === 2 ? 46 : 45;
      paths[index] = paths[index].map(([x, y]) => [x, center + (y - center) * (1 - blink * .92)]);
    });
    paths[4] = paths[4].map(([x, y]) => [x, y + Math.sin((x - 40) / 21 * Math.PI) * sway * 1.4]);
    paths.forEach((path, index) => { if (index !== 5 && index < 21) paths[index] = rotatePath(path, 50, 71, sway * .045); });
  } else if (name === 'cat') {
    const blink = Math.max(0, Math.cos(time * 1.3 + 1.5)) ** 30 * settle;
    [1, 2].forEach((index) => { paths[index] = paths[index].map(([x, y]) => [x, (index === 1 ? 46 : 45) + (y - (index === 1 ? 46 : 45)) * (1 - blink * .95)]); });
    paths.forEach((path, index) => { if (index < 10 || index >= 14) paths[index] = rotatePath(path, 51, 64, sway * .065); });
    paths[10] = rotatePath(paths[10], 64, 76, Math.sin(time * 3.4) * .34 * settle);
    paths[11] = paths[11].map(([x, y]) => [51 + (x - 51) * (1 + sway * .018), y]);
  } else if (name === 'dinosaur') {
    const step = Math.sin(time * 5) * 4 * settle;
    paths.forEach((path, index) => { paths[index] = translatePath(path, Math.sin(time * 1.2) * 4 * settle, -Math.abs(step) * .3); });
    paths[0] = paths[0].map(([x, y]) => [x + (y > 70 ? (x < 44 ? step : -step) : 0), y]);
    paths[2] = rotatePath(paths[2], 20, 58, sway * .12);
  } else if (name === 'landscape') {
    paths[3] = translatePath(paths[3], 0, Math.sin(time * 1.3) * 2 * settle);
    const cloudX = (time * 8) % 120 - 12;
    paths.push(sample(0, 1, 20, (t) => [cloudX + t * 13, 22 + Math.sin(t * Math.PI * 2) * 1.8]));
  } else if (name === 'rocket') {
    const lift = (1 - Math.cos(time * 1.7)) * 4 * settle;
    paths.forEach((path, index) => { if (index !== 7) paths[index] = translatePath(rotatePath(path, 50, 54, Math.sin(time * 1.7) * .075 * settle), Math.sin(time * 1.1) * 3 * settle, -lift); });
    const flame = Math.sin(time * 16) * 4 * settle;
    paths[4] = paths[4].map(([x, y], index) => [x, y + (index > 0 && index < 4 ? flame : 0)]);
  } else if (name === 'house') {
    const smoke = time * 2;
    paths.push(sample(0, 1, 16, (t) => [68 + Math.sin(smoke + t * 3) * (1 + t * 2), 22 - t * 13]));
    const windowGlow = .5 + Math.sin(time * 2.8) * .5;
    paths.push(windowGlow > .62 ? loop([32, 54], [39, 54], [39, 61], [32, 61]) : line([35, 54], [35, 61]));
  } else if (name === 'flower') {
    const bend = Math.sin(time * 1.8) * 7 * settle;
    paths.forEach((path, index) => {
      if (index === paths.length - 1) return;
      paths[index] = path.map(([x, y]) => [x + Math.max(0, (90 - y) / 46) ** 2 * bend, y]);
    });
  } else if (name === 'robot') {
    const blink = Math.max(0, Math.cos(time * 1.25 + 2)) ** 24 * settle;
    [2, 3].forEach((index) => {
      const middle = (paths[index][0][1] + paths[index][2][1]) / 2;
      paths[index] = paths[index].map(([x, y]) => [x, middle + (y - middle) * (1 - blink)]);
    });
    paths[6] = rotatePath(paths[6], 27, 58, sway * .3);
    paths[7] = rotatePath(paths[7], 73, 58, -sway * .5);
    paths[12] = rotatePath(paths[12], 27, 58, sway * .3);
    paths[13] = rotatePath(paths[13], 73, 58, -sway * .5);
    paths.forEach((path, index) => { paths[index] = translatePath(path, 0, Math.sin(time * 3) * 1.1 * settle); });
  } else if (name === 'fish') {
    paths[1] = rotatePath(paths[1], 65, 51, Math.sin(time * 5) * .3 * settle);
    paths.forEach((path, index) => { paths[index] = translatePath(path, Math.sin(time * 1.3) * 5 * settle, Math.sin(time * 2.5) * 1.4 * settle); });
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
      const steam = sample(0, 1, 16, (t) => [x + Math.sin(curl + t * 4) * (1 + t * 2), 34 - t * 19]);
      paths[3 + index] = paths[3 + index].map(([px, py], point) => {
        const other = steam[Math.min(steam.length - 1, Math.round(point / (paths[3 + index].length - 1) * (steam.length - 1)))];
        return [px + (other[0] - px) * settle, py + (other[1] - py) * settle];
      });
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
    const pedal = time * 3.3;
    paths[11] = line([54, 64], [54 + Math.cos(pedal) * 7, 64 + Math.sin(pedal) * 7], [58 + Math.cos(pedal) * 7, 64 + Math.sin(pedal) * 7]);
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
    const creep = (1 - Math.cos(time * .7)) * 2.8 * settle;
    const nod = Math.sin(time * 1.6) * .13 * settle;
    [4, 5, 6, 7].forEach((index) => { paths[index] = rotatePath(paths[index], 80, 60, nod); });
    paths.forEach((path, index) => { paths[index] = translatePath(path, creep, 0); });
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
    return { drawing, canvas, context: canvas.getContext('2d'), index, sketch: index % sketches.length,
      phase: 'waiting', started: nextStart, visible: true, width: 240, height: 175, ratio: 1 };
  });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, lastDraw = 0, hiddenAt = 0;
  const draw = (state, now) => {
    const { canvas, context, width, height, ratio } = state;
    if (!context) return;
    const elapsed = reduced.matches ? DRAW_DURATION : now - state.started;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    if (elapsed < 0) { state.drawing.dataset.doodleState = 'waiting'; return; }
    // Count complete cycles even if a slow frame skips the end of an erase.
    const cycle = Math.floor(elapsed / LOOP_DURATION);
    state.sketch = (state.index + cycle * (1 + state.index)) % sketches.length;
    const phase = elapsed - cycle * LOOP_DURATION;
    if (phase < DRAW_DURATION) state.phase = 'drawing';
    else if (phase < DRAW_DURATION + HOLD_DURATION) state.phase = 'complete';
    else state.phase = 'reversing';
    state.drawing.dataset.doodleState = state.phase;
    state.drawing.dataset.doodleSketch = sketches[state.sketch].name;
    state.drawing.dataset.doodleCycle = String(cycle);
    context.lineJoin = 'round'; context.lineCap = 'round'; context.globalCompositeOperation = 'source-over';
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
  };
  const loopFrame = (now) => {
    if (reduced.matches || now - lastDraw >= 1000 / 30) {
      drawings.forEach((state) => { if (state.visible || reduced.matches) draw(state, now); });
      lastDraw = now;
    }
    if (!reduced.matches && !document.hidden) frame = requestAnimationFrame(loopFrame);
  };
  const motionChange = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(loopFrame);
  };
  const resize = (state) => {
    const box = state.canvas.getBoundingClientRect();
    state.width = box.width || 240; state.height = box.height || 175;
    state.ratio = Math.min(window.devicePixelRatio || 1, 2);
    state.canvas.width = Math.round(state.width * state.ratio);
    state.canvas.height = Math.round(state.height * state.ratio);
    draw(state, performance.now());
  };
  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => { const state = drawings.find((item) => item.canvas === entry.target); if (state) resize(state); });
  });
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { const state = drawings.find((item) => item.drawing === entry.target); if (state) { state.visible = entry.isIntersecting; if (state.visible) draw(state, performance.now()); } });
  }, { rootMargin: '120px' });
  drawings.forEach((state) => { resize(state); resizeObserver.observe(state.canvas); visibilityObserver.observe(state.drawing); });
  const visibilityChange = () => {
    if (document.hidden) { hiddenAt = performance.now(); cancelAnimationFrame(frame); }
    else { if (hiddenAt) drawings.forEach((state) => { state.started += performance.now() - hiddenAt; }); hiddenAt = 0; motionChange(); }
  };
  document.addEventListener('visibilitychange', visibilityChange);
  reduced.addEventListener('change', motionChange);
  frame = requestAnimationFrame(loopFrame);
  return () => { cancelAnimationFrame(frame); reduced.removeEventListener('change', motionChange); document.removeEventListener('visibilitychange', visibilityChange); resizeObserver.disconnect(); visibilityObserver.disconnect(); };
}
