/* =============================================================================
   MAP — MapHud
   Marcas de esquina "clasificadas" superpuestas sobre el lienzo del mapa.
   ============================================================================= */

import { useGameStore } from '@/state/gameStore';
import { LAYERS, OVERLAYS } from './mapConfig';
import type { LayerState, OverlayId } from './mapConfig';

interface MapHudProps {
  overlay: OverlayId;
  layers: LayerState;
}

export function MapHud({ overlay, layers }: MapHudProps) {
  const day = useGameStore((s) => s.day);
  const totalDays = useGameStore((s) => s.totalDays);
  const candidate = useGameStore((s) => s.candidate);
  const overlayLabel = OVERLAYS.find((o) => o.id === overlay)?.label.toUpperCase() ?? '';
  const activeLayers = Object.values(layers).filter(Boolean).length;

  return (
    <>
      <div className="warhud warhud--tl mono">
        <div>▣ CC·OPS · DÍA {day}/{totalDays}</div>
        <div className="warhud__sub">SECTOR · SAN ESTEBAN</div>
      </div>
      <div className="warhud warhud--tr mono">
        <div>OVERLAY · {overlayLabel}</div>
        <div className="warhud__sub">
          LAYERS · {activeLayers}/{LAYERS.length}
        </div>
      </div>
      <div className="warhud warhud--bl mono">
        <div>WAR CHEST · ${candidate.warChest}M</div>
        <div className="warhud__sub">MOMENTUM · +{candidate.momentum}</div>
      </div>
    </>
  );
}
