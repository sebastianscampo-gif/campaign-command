/* =============================================================================
   MAP — WarBar
   Franja superior del lienzo: clasificación, overlay activo y tensión nacional.
   ============================================================================= */

import { useGameStore } from '@/state/gameStore';
import { OVERLAYS } from './mapConfig';
import type { OverlayId } from './mapConfig';

interface WarBarProps {
  overlay: OverlayId;
}

export function WarBar({ overlay }: WarBarProps) {
  const provinces = useGameStore((s) => s.provinces);
  const states = Object.values(provinces);
  const tension =
    states.reduce((sum, p) => sum + p.crisis, 0) / states.length / 10;
  const overlayLabel = OVERLAYS.find((o) => o.id === overlay)?.label.toUpperCase() ?? '';
  const high = tension > 0.3;

  return (
    <div className="warbar">
      <div className="warbar__side mono">
        <span className="warbar__class">▣ CLASIFICADO · CC-OPS</span>
        <span className="warbar__sep">│</span>
        <span>OVERLAY · {overlayLabel}</span>
      </div>
      <div className="warbar__center mono">
        <span className="warbar__live-dot" />
        <span>LIVE FEED</span>
        <span className="warbar__sep">│</span>
        <span data-tension={high ? 'high' : 'normal'}>
          TENSIÓN {(tension * 100).toFixed(0)}%
        </span>
      </div>
      <div className="warbar__side warbar__side--right mono">
        <span>SECTOR · SAN ESTEBAN</span>
        <span className="warbar__signal">▌▌▌▌▌</span>
      </div>
    </div>
  );
}
