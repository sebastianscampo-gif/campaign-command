/* =============================================================================
   MAP — ProvincePopover
   Tarjeta flotante que aparece al pasar el cursor sobre una provincia. Se ubica
   con las variables CSS --px/--py que el lienzo escribe de forma imperativa.
   ============================================================================= */

import { Sparkline } from '@/components';
import { PARTIES, PROVINCES } from '@/content';
import type { PartyId, ProvinceId } from '@/content';
import { useGameStore } from '@/state/gameStore';

interface ProvincePopoverProps {
  id: ProvinceId;
}

export function ProvincePopover({ id }: ProvincePopoverProps) {
  const geo = PROVINCES.find((p) => p.id === id);
  const state = useGameStore((s) => s.provinces[id]);
  if (!geo) return null;

  const sorted = (Object.entries(state.intent) as [PartyId, number][]).sort(
    (a, b) => b[1] - a[1],
  );
  const top = sorted.slice(0, 3);
  const [leadParty, leadPct] = sorted[0];
  const gap = sorted[0][1] - sorted[1][1];
  const swing = gap < 4;

  const seed = geo.id.charCodeAt(0) * 0.5;
  const trend = Array.from(
    { length: 14 },
    (_, i) => leadPct - 2 + Math.sin(i * 0.55 + seed) * 2.2 + i * 0.06,
  );

  return (
    <div className="ppop">
      <span className="ppop__corner ppop__corner--tl" />
      <span className="ppop__corner ppop__corner--tr" />
      <span className="ppop__corner ppop__corner--bl" />
      <span className="ppop__corner ppop__corner--br" />

      <div className="ppop__head">
        <div className="ppop__id mono">PROV · {geo.id}</div>
        <div className="ppop__name">{geo.name}</div>
        <div className="ppop__cap mono">
          {geo.capital} · {geo.region.toUpperCase()}
        </div>
      </div>

      <div className="ppop__row mono">
        <span>POBLACIÓN</span>
        <span>{geo.population}M</span>
      </div>
      <div className="ppop__row mono">
        <span>TURNOUT</span>
        <span>{state.turnout}%</span>
      </div>
      <div className="ppop__row mono">
        <span>MOMENTUM</span>
        <span data-dir={state.momentum > 0 ? 'up' : state.momentum < 0 ? 'down' : 'flat'}>
          {state.momentum > 0 ? '▲ +' : state.momentum < 0 ? '▼ ' : '· '}
          {Math.abs(state.momentum)}
        </span>
      </div>
      <div className="ppop__row mono">
        <span>GAP 1° vs 2°</span>
        <span data-warn={swing}>
          {gap.toFixed(0)}pt{swing ? ' · SWING' : ''}
        </span>
      </div>

      <div className="ppop__bars">
        {top.map(([party, pct]) => (
          <div className="ppop__bar" key={party}>
            <span className="mono" style={{ color: PARTIES[party].color }}>
              {PARTIES[party].short}
            </span>
            <div className="ppop__bartrack">
              <div
                className="ppop__barfill"
                style={{ width: `${Math.min(100, pct * 2)}%`, background: PARTIES[party].color }}
              />
            </div>
            <span className="mono">{pct}%</span>
          </div>
        ))}
      </div>

      <div className="ppop__trend">
        <span className="ppop__trend-label mono">TREND · 14d</span>
        <Sparkline data={trend} color={PARTIES[leadParty].color} width={140} height={24} />
      </div>

      <div className="ppop__hint mono">▸ CLIC PARA DOSSIER COMPLETO</div>
    </div>
  );
}
