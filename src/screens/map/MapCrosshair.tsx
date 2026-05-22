/* =============================================================================
   MAP — MapCrosshair
   Mira de coordenadas que sigue al cursor sobre el mapa. Aislada a propósito:
   escucha mousemove sobre el lienzo y mantiene su propia posición, de modo que
   el movimiento del cursor no re-renderiza el mapa pesado.
   ============================================================================= */

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';

interface CrosshairState {
  x: number;
  y: number;
  lat: number;
  lon: number;
  visible: boolean;
}

const HIDDEN: CrosshairState = { x: 0, y: 0, lat: 0, lon: 0, visible: false };

interface MapCrosshairProps {
  targetRef: RefObject<HTMLDivElement | null>;
}

export function MapCrosshair({ targetRef }: MapCrosshairProps) {
  const [state, setState] = useState<CrosshairState>(HIDDEN);

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      setState({
        x,
        y,
        lat: (y / rect.height) * 8 + 12,
        lon: (x / rect.width) * 8 + 64,
        visible: true,
      });
    };
    const onLeave = () => setState(HIDDEN);

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [targetRef]);

  if (!state.visible) return null;

  return (
    <div className="crosshair" aria-hidden="true">
      <div className="crosshair__v" style={{ left: state.x }} />
      <div className="crosshair__h" style={{ top: state.y }} />
      <div className="crosshair__ring" style={{ left: state.x, top: state.y }} />
      <div className="crosshair__read mono" style={{ left: state.x, top: state.y }}>
        {state.lat.toFixed(2)}°N · {state.lon.toFixed(2)}°W
      </div>
    </div>
  );
}
