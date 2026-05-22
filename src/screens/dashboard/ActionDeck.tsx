/* =============================================================================
   DASHBOARD — ActionDeck
   Mazo de cartas de acciones de campaña del día.
   ============================================================================= */

import { ACTION_DECK } from './dashData';

export function ActionDeck() {
  return (
    <div className="deck">
      <div className="deck__head mono">
        <span className="deck__title">CAMPAIGN ACTIONS · DECISIONES DEL DÍA</span>
        <span className="deck__counts">
          <span>03 / 05 ACCIONES USADAS</span>
          <span className="deck__sep">│</span>
          <span>RECUPERA 06:00</span>
        </span>
      </div>
      <div className="deck__grid">
        {ACTION_DECK.map((action) => (
          <button type="button" key={action.label} className="actcard" data-tag={action.tag}>
            <div className="actcard__head">
              <span className="actcard__icon">{action.icon}</span>
              <span className="actcard__label">{action.label}</span>
              {action.tag && (
                <span className="actcard__tag mono">
                  {action.tag === 'hot' ? 'HOT' : 'CRÍTICO'}
                </span>
              )}
            </div>
            <div className="actcard__desc">{action.desc}</div>
            <div className="actcard__foot mono">
              <span className="actcard__cost">{action.cost}</span>
              <span className="actcard__roi">{action.roi}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
