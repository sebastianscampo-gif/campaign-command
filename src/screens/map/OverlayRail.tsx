/* =============================================================================
   MAP — OverlayRail
   Riel izquierdo: selección de overlay, zoom y capas decorativas.
   ============================================================================= */

import {
  LAYERS,
  OVERLAYS,
  OVERLAY_GROUPS,
} from './mapConfig';
import type { LayerId, LayerState, OverlayId } from './mapConfig';

interface OverlayRailProps {
  overlay: OverlayId;
  onOverlay: (id: OverlayId) => void;
  zoom: number;
  onZoom: (zoom: number) => void;
  layers: LayerState;
  onToggleLayer: (id: LayerId) => void;
}

export function OverlayRail({
  overlay,
  onOverlay,
  zoom,
  onZoom,
  layers,
  onToggleLayer,
}: OverlayRailProps) {
  const zoomHint =
    zoom > 1.7 ? '◉ CITY DETAIL · ON' : zoom > 1.3 ? '◯ CITY MARKERS · ON' : '· VISTA NACIONAL ·';

  return (
    <aside className="rail">
      <div className="rail__head mono">
        <span>OVERLAYS · 12</span>
        <span>{overlay.toUpperCase()}</span>
      </div>

      {OVERLAY_GROUPS.map((group) => (
        <div className="rail__group" key={group.cat}>
          <div className="rail__group-label mono">— {group.label}</div>
          {OVERLAYS.filter((o) => o.cat === group.cat).map((o) => {
            const index = OVERLAYS.findIndex((x) => x.id === o.id) + 1;
            return (
              <button
                type="button"
                key={o.id}
                className={overlay === o.id ? 'railbtn railbtn--active' : 'railbtn'}
                onClick={() => onOverlay(o.id)}
              >
                <span className="railbtn__idx mono">{String(index).padStart(2, '0')}</span>
                <span className="railbtn__icon mono">{o.icon}</span>
                <span className="railbtn__label">{o.label}</span>
              </button>
            );
          })}
        </div>
      ))}

      <div className="rail__head rail__head--spaced mono">
        <span>ZOOM</span>
        <span>{zoom.toFixed(2)}×</span>
      </div>
      <div className="zoombar">
        <button
          type="button"
          className="zoombar__btn mono"
          onClick={() => onZoom(Math.max(0.7, Math.round((zoom - 0.15) * 100) / 100))}
          aria-label="Alejar"
        >
          −
        </button>
        <input
          type="range"
          className="zoombar__range"
          min={0.7}
          max={2.4}
          step={0.05}
          value={zoom}
          onChange={(e) => onZoom(Number(e.target.value))}
          aria-label="Nivel de zoom"
        />
        <button
          type="button"
          className="zoombar__btn mono"
          onClick={() => onZoom(Math.min(2.4, Math.round((zoom + 0.15) * 100) / 100))}
          aria-label="Acercar"
        >
          +
        </button>
      </div>
      <div className="rail__hint mono">{zoomHint}</div>

      <div className="rail__head rail__head--spaced mono">
        <span>LAYERS</span>
        <span>
          {Object.values(layers).filter(Boolean).length}/{LAYERS.length}
        </span>
      </div>
      <div className="rail__layers">
        {LAYERS.map((layer) => (
          <button
            type="button"
            key={layer.id}
            className={layers[layer.id] ? 'layerchip' : 'layerchip layerchip--off'}
            onClick={() => onToggleLayer(layer.id)}
          >
            <span className="layerchip__box mono">{layers[layer.id] ? '▣' : '□'}</span>
            {layer.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
