import { useCallback, useRef, useState } from 'react';

interface MagneticState {
  x: number;
  y: number;
  hovered: boolean;
}

// A button that visibly leans toward the cursor (and springs back on
// leave) reads as interactive without needing an icon to say so — the
// object itself is reacting to your presence. `strength` caps how far
// it can pull, in px.
export function useMagnetic<T extends HTMLElement>(strength = 14) {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<MagneticState>({ x: 0, y: 0, hovered: false });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const relY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setState((s) => ({ ...s, x: relX * strength, y: relY * strength }));
    },
    [strength]
  );

  const onMouseEnter = useCallback(() => {
    setState((s) => ({ ...s, hovered: true }));
  }, []);

  const onMouseLeave = useCallback(() => {
    setState({ x: 0, y: 0, hovered: false });
  }, []);

  return { ref, ...state, onMouseMove, onMouseEnter, onMouseLeave };
}
