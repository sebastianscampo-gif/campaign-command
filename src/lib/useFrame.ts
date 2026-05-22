/* =============================================================================
   LIB — useFrame
   Suscribe un callback al reloj global de animación durante el ciclo de vida
   del componente. Pensado para actualizaciones imperativas (escribir en refs
   del DOM/SVG) SIN provocar re-renders de React.

   Respeta `prefers-reduced-motion`: si el usuario pide movimiento reducido y el
   efecto es puramente decorativo (`decorative: true`, valor por defecto), el
   callback no se suscribe. Para actualizaciones funcionales que deben seguir
   corriendo (un reloj en vivo, un cronómetro), pasar `decorative: false`.
   ============================================================================= */

import { useEffect, useRef } from 'react';
import { clock, type FrameCallback } from '@/lib/clock';
import { useReducedMotion } from '@/lib/useReducedMotion';

export interface UseFrameOptions {
  /** Si es false, el callback no se suscribe. Por defecto true. */
  enabled?: boolean;
  /** Si es true (defecto), se desactiva cuando se pide movimiento reducido. */
  decorative?: boolean;
}

export function useFrame(
  callback: FrameCallback,
  options: UseFrameOptions = {},
): void {
  const { enabled = true, decorative = true } = options;
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const reducedMotion = useReducedMotion();
  const active = enabled && !(decorative && reducedMotion);

  useEffect(() => {
    if (!active) return;
    return clock.subscribe((time, dt) => callbackRef.current(time, dt));
  }, [active]);
}
