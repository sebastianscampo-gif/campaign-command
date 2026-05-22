/* =============================================================================
   SCREENS — ScreenStub
   Presentación común de las pantallas provisionales de la Fase 1. Cada pantalla
   pasa datos reales leídos de los stores: el objetivo es demostrar que el flujo
   contenido → estado → UI funciona antes de construir las pantallas definitivas.
   ============================================================================= */

import { NAV_ITEMS } from '@/app/nav';
import { useUiStore } from '@/state/uiStore';

export interface StubRow {
  label: string;
  value: string;
}

interface ScreenStubProps {
  eyebrow: string;
  title: string;
  lede: string;
  rows: readonly StubRow[];
}

export function ScreenStub({ eyebrow, title, lede, rows }: ScreenStubProps) {
  const screen = useUiStore((s) => s.screen);
  const navigate = useUiStore((s) => s.navigate);

  return (
    <section className="stub">
      <div className="stub__eyebrow mono">{eyebrow}</div>
      <h1 className="stub__title">{title}</h1>
      <p className="stub__lede">{lede}</p>

      <dl className="stub__rows">
        {rows.map((row) => (
          <div className="stub__row" key={row.label}>
            <dt className="mono">{row.label}</dt>
            <dd className="mono">{row.value}</dd>
          </div>
        ))}
      </dl>

      <nav className="stub__nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="stub__navbtn"
            data-active={screen === item.id}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <p className="stub__note mono">
        FASE 1 · FUNDACIÓN — pantalla provisional. Datos en vivo desde los
        stores de Zustand.
      </p>
    </section>
  );
}
