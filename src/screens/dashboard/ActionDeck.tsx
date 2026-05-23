/* =============================================================================
   DASHBOARD — ActionDeck
   Mazo de cartas de acciones de campaña del día. La fuente de verdad es el
   catálogo de @/sim/actions; aquí solo se ordena para presentación.
   ============================================================================= */

import { ACTION_CATALOG, DASHBOARD_DECK, MAX_ACTIONS_PER_DAY } from '@/sim';
import { useGameStore } from '@/state/gameStore';

const FLAG_LABEL: Record<'hot' | 'critical', string> = {
  hot: 'HOT',
  critical: 'CRÍTICO',
};

function formatCost(money: number, days: number): string {
  if (money > 0 && days > 0) return `$${money.toFixed(1)}M · ${days}d`;
  if (money > 0) return `$${money.toFixed(1)}M`;
  if (days > 0) return `${days}d`;
  return '—';
}

export function ActionDeck() {
  const pendingCount = useGameStore((s) => s.pendingActions.length);
  const queueAction = useGameStore((s) => s.queueCampaignAction);

  return (
    <div className="deck">
      <div className="deck__head mono">
        <span className="deck__title">CAMPAIGN ACTIONS · DECISIONES DEL DÍA</span>
        <span className="deck__counts">
          <span>
            {String(pendingCount).padStart(2, '0')} / {String(MAX_ACTIONS_PER_DAY).padStart(2, '0')} ACCIONES USADAS
          </span>
          <span className="deck__sep">│</span>
          <span>RECUPERA 06:00</span>
        </span>
      </div>
      <div className="deck__grid">
        {DASHBOARD_DECK.map((kind) => {
          const action = ACTION_CATALOG[kind];
          const disabled = action.requiresProvince || pendingCount >= MAX_ACTIONS_PER_DAY;
          return (
            <button
              type="button"
              key={action.kind}
              className="actcard"
              data-tag={action.flag}
              disabled={disabled}
              onClick={() => queueAction(action.kind)}
              title={action.requiresProvince ? 'Seleccioná una provincia en el mapa' : undefined}
            >
              <div className="actcard__head">
                <span className="actcard__icon">{action.icon}</span>
                <span className="actcard__label">{action.label}</span>
                {action.flag && (
                  <span className="actcard__tag mono">{FLAG_LABEL[action.flag]}</span>
                )}
              </div>
              <div className="actcard__desc">{action.description}</div>
              <div className="actcard__foot mono">
                <span className="actcard__cost">{formatCost(action.costMoney, action.costDays)}</span>
                <span className="actcard__roi">{action.roiHint}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
