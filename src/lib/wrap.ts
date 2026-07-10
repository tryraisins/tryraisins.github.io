// Wrap a value into [min, max) — used by the marquee to keep translateX
// bounded so the duplicated ribbon appears seamless.
export function wrap(min: number, max: number, v: number) {
  const range = max - min;
  const mod = ((((v - min) % range) + range) % range);
  return mod + min;
}
