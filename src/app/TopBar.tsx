/* =============================================================================
   APP — TopBar (HUD global)
   Marca, navegación y estado de campaña. El reloj en vivo se actualiza de forma
   imperativa vía useFrame escribiendo en una ref: no provoca re-renders de
   React (a diferencia del prototipo, que hacía setState a 60fps).
   ============================================================================= */

import { useRef } from 'react';
import { COUNTRY } from '@/content';
import { useFrame } from '@/lib/useFrame';
import { useGameStore } from '@/state/gameStore';
import { useUiStore } from '@/state/uiStore';
import { NAV_ITEMS } from './nav';

export function TopBar() {
  const screen = useUiStore((s) => s.screen);
  const navigate = useUiStore((s) => s.navigate);
  const day = useGameStore((s) => s.day);
  const totalDays = useGameStore((s) => s.totalDays);

  const clockRef = useRef<HTMLSpanElement>(null);
  const lastSecond = useRef(-1);

  useFrame(
    () => {
      const now = new Date();
      const second = now.getSeconds();
      if (second === lastSecond.current) return;
      lastSecond.current = second;
      if (clockRef.current) {
        clockRef.current.textContent = now.toLocaleTimeString('es-ES', {
          hour12: false,
        });
      }
    },
    { decorative: false },
  );

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <div className="topbar__mark">◆</div>
        <div>
          <div className="topbar__name">CAMPAIGN COMMAND</div>
          <div className="topbar__sub">{COUNTRY.cycle}</div>
        </div>
      </div>

      <div className="topbar__status">
        <span className="topbar__label">DÍA</span>
        <span className="topbar__value mono">
          {day} / {totalDays}
        </span>
      </div>
      <div className="topbar__status">
        <span className="topbar__label">A ELECCIÓN</span>
        <span className="topbar__value mono">T-{totalDays - day}</span>
      </div>
      <div className="topbar__status">
        <span className="topbar__label">HORA</span>
        <span className="topbar__value topbar__clock mono" ref={clockRef}>
          --:--:--
        </span>
      </div>

      <nav className="topbar__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="topbar__navbtn"
            data-active={screen === item.id}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
