/* =============================================================================
   DASHBOARD — BroadcastBar
   Franja superior estilo sala de operaciones. Pegajosa al hacer scroll.
   ============================================================================= */

import { useGameStore } from '@/state/gameStore';
import { useUiStore } from '@/state/uiStore';

export function BroadcastBar() {
  const day = useGameStore((s) => s.day);
  const totalDays = useGameStore((s) => s.totalDays);
  const provinces = useGameStore((s) => s.provinces);
  const activeEvent = useGameStore((s) => s.activeEvent);
  const openModal = useUiStore((s) => s.openModal);

  const states = Object.values(provinces);
  const tension = Math.round(
    (states.reduce((sum, p) => sum + p.crisis, 0) / states.length) * 10,
  );
  const threat = tension > 60 ? 'L3 · CRÍTICO' : tension > 40 ? 'L2 · ELEVADO' : 'L1 · NORMAL';
  const level = tension > 60 ? 'high' : tension > 40 ? 'mid' : 'low';

  return (
    <div className="bbar">
      <div className="bbar__side mono">
        <span className="bbar__class">▣ CAMPAIGN OPERATIONS · CC-OPS</span>
        <span className="bbar__sep">│</span>
        <span>
          DÍA {day}/{totalDays} · T−{totalDays - day}
        </span>
        <span className="bbar__sep">│</span>
        <span>BRIEFING · 06:00</span>
      </div>
      <div className="bbar__center mono">
        <span className="bbar__live" />
        <span>LIVE FEED · INTEL</span>
      </div>
      <div className="bbar__side bbar__side--right mono">
        <span className="bbar__threat" data-level={level}>
          THREAT · {threat}
        </span>
        {activeEvent && (
          <button type="button" className="bbar__alert" onClick={() => openModal('crisis')}>
            <span className="bbar__alert-dot" />
            CRISIS · {activeEvent.location} · {activeEvent.timer}
          </button>
        )}
      </div>
    </div>
  );
}
