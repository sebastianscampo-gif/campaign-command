/* =============================================================================
   MAP — NationalOverview
   Panel derecho por defecto: agregado nacional cuando no hay provincia activa.
   ============================================================================= */

import { Panel, SectionHead, StatTile } from '@/components';
import { COUNTRY, PROVINCES } from '@/content';
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
    const values = Object.values(provinces[geo.id].intent).sort((a, b) => b - a);
    return { geo, gap: values[0] - values[1] };
  })
    .sort((a, b) => a.gap - b.gap)
    .slice(0, 4);

  return (
    <Panel label="NACIONAL" caption="Vista agregada · 12 provincias">
      <div className="natov">
        <div className="natov__grid">
          <StatTile label="POBLACIÓN" value={`${COUNTRY.population}M`} />
          <StatTile label="ELECT. HÁBIL" value="19.4M" sub="72% padrón" />
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
          <div className="alertrow" data-level="high">
            <span className="alertrow__lvl mono">L3</span>
            <span className="alertrow__text">Corte de ruta · Llanos Occidentales</span>
            <span className="mono">03:47</span>
          </div>
          <div className="alertrow" data-level="mid">
            <span className="alertrow__lvl mono">L2</span>
            <span className="alertrow__text">Debate nacional confirmado · 3d</span>
            <span className="mono">—</span>
          </div>
          <div className="alertrow" data-level="low">
            <span className="alertrow__lvl mono">L1</span>
            <span className="alertrow__text">MNP convocará frente antiprogresista</span>
            <span className="mono">12h</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}
