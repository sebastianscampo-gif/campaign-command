/* =============================================================================
   SCREENS — Map View (war room)
   Mapa estratégico: riel de overlays, lienzo del país y panel de dossier.
   La provincia seleccionada vive en el uiStore; overlay/zoom/capas son estado
   local de la pantalla.
   ============================================================================= */

import { useCallback, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import { PROVINCES } from '@/content';
import type { ProvinceId } from '@/content';
import { useUiStore } from '@/state/uiStore';
import { ActionBar } from './ActionBar';
import { DEFAULT_LAYERS } from './mapConfig';
import type { LayerId, LayerState, OverlayId } from './mapConfig';
import { MapCrosshair } from './MapCrosshair';
import { MapHud } from './MapHud';
import { NationalOverview } from './NationalOverview';
import { OverlayRail } from './OverlayRail';
import { ProvinceDossier } from './ProvinceDossier';
import { ProvincePopover } from './ProvincePopover';
import { WarBar } from './WarBar';
import { WarMap } from './WarMap';

export function MapScreen() {
  const [overlay, setOverlay] = useState<OverlayId>('intent');
  const [zoom, setZoom] = useState(1);
  const [layers, setLayers] = useState<LayerState>(DEFAULT_LAYERS);
  const [hovered, setHovered] = useState<ProvinceId | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const selected = useUiStore((s) => s.selectedProvince);
  const selectProvince = useUiStore((s) => s.selectProvince);

  const selectedGeo = selected
    ? PROVINCES.find((p) => p.id === selected) ?? null
    : null;

  // Handlers estables: si cambian por identidad cada render, romperían el
  // React.memo del WarMap y el mapa entero re-renderizaría con cada hover.
  const toggleLayer = useCallback(
    (id: LayerId) => setLayers((current) => ({ ...current, [id]: !current[id] })),
    [],
  );

  const handleSelect = useCallback(
    (id: ProvinceId) => selectProvince(id === selected ? null : id),
    [selected, selectProvince],
  );

  const handleHover = useCallback((id: ProvinceId | null) => setHovered(id), []);

  const clearHover = useCallback(() => setHovered(null), []);

  /** Escribe la posición del cursor como variables CSS — sin re-render. */
  const handleMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const el = canvasRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--px', `${event.clientX - rect.left}px`);
    el.style.setProperty('--py', `${event.clientY - rect.top}px`);
  }, []);

  const handleCloseDossier = useCallback(() => selectProvince(null), [selectProvince]);

  return (
    <div className="mapview">
      <OverlayRail
        overlay={overlay}
        onOverlay={setOverlay}
        zoom={zoom}
        onZoom={setZoom}
        layers={layers}
        onToggleLayer={toggleLayer}
      />

      <div className="mapcanvas">
        <WarBar overlay={overlay} />
        <div
          className="mapcanvas__svgwrap"
          ref={canvasRef}
          onMouseMove={handleMove}
          onMouseLeave={clearHover}
        >
          <WarMap
            overlay={overlay}
            zoom={zoom}
            layers={layers}
            selected={selected}
            onSelect={handleSelect}
            onHover={handleHover}
          />
          <MapCrosshair targetRef={canvasRef} />
          <MapHud overlay={overlay} layers={layers} />
          {hovered && <ProvincePopover id={hovered} />}
        </div>
        <ActionBar selected={selectedGeo} />
      </div>

      <aside className="mapview__right">
        {selectedGeo ? (
          <ProvinceDossier geo={selectedGeo} onClose={handleCloseDossier} />
        ) : (
          <NationalOverview />
        )}
      </aside>
    </div>
  );
}
