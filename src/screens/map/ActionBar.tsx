/* =============================================================================
   MAP — ActionBar
   Barra inferior de acciones de campaña. La provincia seleccionada limita
   qué acciones se pueden encolar. "END DAY" dispara la simulación.
   ============================================================================= */

import type { ProvinceGeo } from '@/content';
import { ACTION_CATALOG, MAP_BAR_ACTIONS } from '@/sim';
import { useGameStore } from '@/state/gameStore';

interface ActionBarProps {
  selected: ProvinceGeo | null;
}

function formatCost(money: number, days: number): string {
  if (money > 0 && days > 0) return `$${money.toFixed(1)}M · ${days}d`;
  if (money > 0) return `$${money.toFixed(1)}M`;
  if (days > 0) return `${days}d`;
  return '—';
}

export function ActionBar({ selected }: ActionBarProps) {
  const simulateNextDay = useGameStore((s) => s.simulateNextDay);
  const queueCampaignAction = useGameStore((s) => s.queueCampaignAction);

  return (
    <div className="actionbar">
      <div className="actionbar__label mono">
        <span>ACCIONES</span>
        <span className="actionbar__target">
          {selected ? `→ ${selected.name.toUpperCase()}` : '· seleccionar provincia ·'}
        </span>
      </div>
      <div className="actionbar__actions">
        {MAP_BAR_ACTIONS.map((kind) => {
          const action = ACTION_CATALOG[kind];
          const requiresProvince = action.requiresProvince;
          const disabled = requiresProvince && !selected;
          return (
            <button
              type="button"
              key={action.kind}
              className="actionbtn"
              disabled={disabled}
              title={action.description}
              onClick={() => {
                if (requiresProvince && selected) {
                  queueCampaignAction(action.kind, selected.id);
                } else if (!requiresProvince) {
                  queueCampaignAction(action.kind);
                }
              }}
            >
              <span className="actionbtn__icon mono">{action.icon}</span>
              <span className="actionbtn__name">{action.label}</span>
              <span className="actionbtn__cost mono">{formatCost(action.costMoney, action.costDays)}</span>
            </button>
          );
        })}
      </div>
      <button type="button" className="endday" onClick={simulateNextDay}>
        <span>END DAY</span>
        <span className="mono">↵</span>
      </button>
    </div>
  );
}
