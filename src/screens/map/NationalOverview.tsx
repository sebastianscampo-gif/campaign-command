/* =============================================================================
   MAP — NationalOverview
   Panel derecho por defecto: agregado nacional cuando no hay provincia activa.
   ============================================================================= */

import { Panel, SectionHead, StatTile } from '@/components';
import {
  ACTIVE_ALERTS,
  COUNTRY,
  ELECTORATE_MILLIONS,
  ELECTORATE_RATIO,
  PROVINCES,
} from '@/content';
import type { PartyId } from '@/content';
import { useGameStore } from '@/state/gameStore';
import { VoteBar } from './VoteBar';

export function NationalOverview() {
  const provinces = useGameStore((s) => s.provinces);
  const day = useGameStore((s) => s.day);
  const totalDays = useGameStore((s) => s.totalDays);

  const totalPop = PROVINCES.reduce((sum, p) => sum + p.population, 0);
  const weighted: Record<string, number> = {};
  PROVINCES.forEach((geo) => {
    const { intent } = provinces[geo.id];
    (Object.keys(intent) as PartyId[]).forEach((party) => {
      weighted[party] = (weighted[party] ?? 0) + intent[party] * geo.population;
    });
  });
  const projection = (Object.entries(weighted) as [PartyId, number][])
    .map(([party, total]) => [party, total / totalPop] as [PartyId, number])
    .sort((a, b) => b[1] - a[1]);

  const hot = PROVINCES.map((geo) => {
    const state = provinces[geo.id];
    const values = state ? Object.values(state.intent).sort((a, b) => b - a) : [];
    const top1 = values[0] ?? 0;
    const top2 = values[1] ?? 0;
    return { geo, gap: top1 - top2 };
  })
    .sort((a, b) => a.gap - b.gap)
    .slice(0, 4);

  return (
    <Panel label="NACIONAL" caption="Vista agregada · 12 provincias">
      <div className="natov">
        <div className="natov__grid">
          <StatTile label="POBLACIÓN" value={`${COUNTRY.population}M`} />
          <StatTile
            label="ELECT. HÁBIL"
            value={`${ELECTORATE_MILLIONS}M`}
            sub={`${(ELECTORATE_RATIO * 100).toFixed(0)}% padrón`}
          />
          <StatTile label="GDP TOTAL" value={`$${COUNTRY.gdp}bn`} sub="PSE" />
          <StatTile label="CICLO" value={`${day}/${totalDays}`} sub="día" />
        </div>

        <SectionHead index="01" title="Proyección nacional" sub="ponderada por población" />
        <div className="natov__bars">
          {projection.map(([party, pct]) => (
            <VoteBar key={party} party={party} pct={pct} />
          ))}
        </div>

        <SectionHead index="02" title="Calor electoral" sub="provincias clave" />
        <div className="natov__hot">
          {hot.map(({ geo, gap }) => (
            <div className="hotrow" key={geo.id}>
              <span className="hotrow__id mono">{geo.id}</span>
              <span className="hotrow__name">{geo.name}</span>
              <span className="hotrow__gap mono" data-warn={gap < 4}>
                Δ {gap.toFixed(0)}pt
              </span>
              <span className="hotrow__pop mono">{geo.population}M</span>
            </div>
          ))}
        </div>

        <SectionHead index="03" title="Alertas activas" />
        <div className="natov__alerts">
          {ACTIVE_ALERTS.map((alert) => (
            <div className="alertrow" data-level={alert.level} key={alert.text}>
              <span className="alertrow__lvl mono">{alert.tag}</span>
              <span className="alertrow__text">{alert.text}</span>
              <span className="mono">{alert.timer}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}
