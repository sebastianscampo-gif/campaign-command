/* =============================================================================
   MAP — ActionBar
   Barra inferior de acciones de campaña. Las acciones requieren provincia
   seleccionada; "END DAY" avanza la jornada en el game store.
   ============================================================================= */

import type { ProvinceGeo } from '@/content';
import { useGameStore } from '@/state/gameStore';
import { ACTIONS } from './mapConfig';

interface ActionBarProps {
  selected: ProvinceGeo | null;
}

export function ActionBar({ selected }: ActionBarProps) {
  const advanceDay = useGameStore((s) => s.advanceDay);

  return (
    <div className="actionbar">
      <div className="actionbar__label mono">
        <span>ACCIONES</span>
        <span className="actionbar__target">
          {selected ? `→ ${selected.name.toUpperCase()}` : '· seleccionar provincia ·'}
        </span>
      </div>
      <div className="actionbar__actions">
        {ACTIONS.map((action) => (
          <button
            type="button"
            key={action.id}
            className="actionbtn"
            disabled={!selected}
            title={action.desc}
          >
            <span className="actionbtn__icon mono">{action.icon}</span>
            <span className="actionbtn__name">{action.label}</span>
            <span className="actionbtn__cost mono">{action.cost}</span>
          </button>
        ))}
      </div>
      <button type="button" className="endday" onClick={advanceDay}>
        <span>END DAY</span>
        <span className="mono">↵</span>
      </button>
    </div>
  );
}
