/* =============================================================================
   SCREENS — Main Menu (cinematográfico)
   Pantalla de inicio. Fondo viviente, navegación principal con teclado y panel
   de preview por modo. Reemplaza al stub de la Fase 1.
   ============================================================================= */

import { useEffect, useState } from 'react';
import { COUNTRY } from '@/content';
import { assertDefined } from '@/lib/invariant';
import { useGameStore } from '@/state/gameStore';
import { useUiStore } from '@/state/uiStore';
import { MENU_ITEMS } from './menuItems';
import type { MenuItemId } from './menuItems';
import { MenuBackground } from './MenuBackground';
import { ModePreview } from './ModePreview';

const MODE_COUNT = String(MENU_ITEMS.length).padStart(2, '0');

export function MainMenuScreen() {
  const navigate = useUiStore((s) => s.navigate);
  const news = useGameStore((s) => s.news);
  const day = useGameStore((s) => s.day);
  const totalDays = useGameStore((s) => s.totalDays);

  const [activeId, setActiveId] = useState<MenuItemId>('continue');
  const activeIndex = MENU_ITEMS.findIndex((item) => item.id === activeId);
  const activeItem = assertDefined(MENU_ITEMS[activeIndex], 'activeId siempre existe en MENU_ITEMS');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const next = assertDefined(
          MENU_ITEMS[(activeIndex + 1) % MENU_ITEMS.length],
          'módulo dentro de rango',
        );
        setActiveId(next.id);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        const prevIdx = (activeIndex - 1 + MENU_ITEMS.length) % MENU_ITEMS.length;
        const prev = assertDefined(MENU_ITEMS[prevIdx], 'módulo dentro de rango');
        setActiveId(prev.id);
      } else if (event.key === 'Enter' && activeItem.action) {
        navigate(activeItem.action);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, activeItem, navigate]);

  const newsLoop = [...news, ...news];
  const daysLeft = totalDays - day;

  return (
    <div className="cmenu">
      <MenuBackground />

      <header className="cmenu__top">
        <div className="cmenu__top-l">
          <div className="cmenu__seal mono">▣ CC·001</div>
          <div className="cmenu__stampline mono">
            CAMPAIGN OPERATIONS SYSTEM · v1.4.2 · STABLE
          </div>
        </div>
        <div className="cmenu__top-c mono">
          <span className="cmenu__dot" />
          <span>NARRATIVE AI SERVER · ONLINE</span>
          <span className="cmenu__sep">│</span>
          <span>3.1M PLAYERS · WK 42</span>
        </div>
        <div className="cmenu__top-r mono">
          <div>BUILD 26.05.21 · EU-WEST · 32ms</div>
          <div>SESSION #4471 · AUTH OK</div>
        </div>
      </header>

      <div className="cmenu__identity">
        <span className="cmenu__crosshair cmenu__crosshair--tl" />
        <span className="cmenu__crosshair cmenu__crosshair--tr" />
        <span className="cmenu__crosshair cmenu__crosshair--bl" />
        <span className="cmenu__crosshair cmenu__crosshair--br" />

        <div className="cmenu__eyebrow mono">A SIMULATION OF POWER · 2026</div>
        <h1 className="cmenu__title">
          CAMPAIGN<span>COMMAND</span>
        </h1>
        <div className="cmenu__sub-title mono">CAMPAIGN OPERATIONS SYSTEM</div>
        <div className="cmenu__rule" />
        <div className="cmenu__tagline">El poder se conquista una decisión a la vez.</div>
        <div className="cmenu__metaline mono">
          {COUNTRY.name.toUpperCase()} · {COUNTRY.cycle.toUpperCase()} · {daysLeft} DÍAS PARA LAS
          GENERALES
        </div>
      </div>

      <aside className="cmenu__list">
        <div className="cmenu__listhead mono">
          <span>NAVEGACIÓN PRINCIPAL</span>
          <span>{MODE_COUNT} · MODES</span>
        </div>
        {MENU_ITEMS.map((item, i) => {
          const classes = [
            'cmitem',
            item.id === activeId && 'cmitem--active',
            item.primary && 'cmitem--primary',
          ]
            .filter(Boolean)
            .join(' ');
          return (
            <button
              key={item.id}
              type="button"
              className={classes}
              onMouseEnter={() => setActiveId(item.id)}
              onFocus={() => setActiveId(item.id)}
              onClick={() => {
                if (item.action) navigate(item.action);
              }}
            >
              <span className="cmitem__bar" />
              <span className="cmitem__idx mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="cmitem__body">
                <span className="cmitem__label">{item.label}</span>
                <span className="cmitem__sub mono">{item.sub}</span>
              </span>
              <span className="cmitem__arrow mono">→</span>
            </button>
          );
        })}
        <div className="cmenu__listfoot mono">
          <span>↑↓ NAV</span>
          <span>↵ SELECT</span>
          <span>ESC EXIT</span>
        </div>
      </aside>

      <section className="cmenu__preview">
        <div className="cmenu__preview-head mono">
          <span>// MODE PREVIEW</span>
          <span>
            {String(activeIndex + 1).padStart(2, '0')}/{MODE_COUNT}
          </span>
        </div>
        <div className="cmenu__preview-body">
          <ModePreview key={activeId} item={activeItem} onActivate={navigate} />
        </div>
      </section>

      <footer className="cmenu__bottom">
        <div className="cmenu__bottom-track">
          <div className="cmenu__bottom-inner">
            {newsLoop.map((n, i) => (
              <span className="cmenu__bottom-item mono" key={`${n.time}-${i}`}>
                <span className="cmenu__bottom-time">{n.time}</span>
                <span className="cmenu__bottom-src">{n.src}</span>
                <span className="cmenu__bottom-headline" data-tone={n.tone}>
                  {n.headline}
                </span>
                <span className="cmenu__bottom-sep">◆</span>
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
