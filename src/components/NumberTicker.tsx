/* =============================================================================
   UI — NumberTicker
   Anima un número hasta su valor objetivo. A diferencia del prototipo (que hacía
   setState en cada frame, forzando re-renders), aquí la animación escribe el
   textContent de forma imperativa con el reloj global: cero re-renders mientras
   cuenta. Solo hay un re-render al empezar y otro al terminar (para liberar el
   suscriptor del reloj). Respeta prefers-reduced-motion.
   ============================================================================= */

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@/lib/useFrame';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface NumberTickerProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Duración de la animación en milisegundos. */
  duration?: number;
}

export function NumberTicker({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 600,
}: NumberTickerProps) {
  const reducedMotion = useReducedMotion();
  const spanRef = useRef<HTMLSpanElement>(null);
  const fromRef = useRef(0);
  const startRef = useRef<number | null>(null);
  const [animating, setAnimating] = useState(!reducedMotion);

  const format = (n: number): string =>
    `${prefix}${n.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    if (reducedMotion) {
      setAnimating(false);
      return;
    }
    startRef.current = null;
    setAnimating(true);
  }, [value, reducedMotion]);

  useFrame(
    (time) => {
      if (startRef.current === null) startRef.current = time;
      const progress = Math.min(1, (time - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = fromRef.current + (value - fromRef.current) * eased;
      if (spanRef.current) spanRef.current.textContent = format(current);
      if (progress >= 1) {
        fromRef.current = value;
        setAnimating(false);
      }
    },
    { decorative: false, enabled: animating },
  );

  return (
    <span ref={spanRef}>{format(reducedMotion ? value : fromRef.current)}</span>
  );
}
