/* =============================================================================
   DASHBOARD — PollingPanel (01)
   Pantalla grande de tendencia de encuestas.
   ============================================================================= */

import { LineChart, Panel } from '@/components';
import type { ChartPoint, ChartSeries } from '@/components';
import { PARTIES } from '@/content';
import type { PartyId } from '@/content';
import { useGameStore } from '@/state/gameStore';

const SERIES_PARTIES: readonly PartyId[] = ['PRD', 'MNP', 'FAS', 'VC'];

export function PollingPanel() {
  const polling = useGameStore((s) => s.polling);
  const latest = polling[polling.length - 1];
  const first = polling[0];

  const data: ChartPoint[] = polling.map((point) => ({
    label: point.week,
    values: point.intent,
  }));
  const series: ChartSeries[] = SERIES_PARTIES.map((id) => ({
    key: id,
    label: PARTIES[id].short,
    color: PARTIES[id].color,
  }));

  return (
    <Panel
      label="01"
      caption="Polling nacional · big screen"
      className="span-8"
      right={<span className="dash-dim mono">proyección bayesiana · ±2.1pt</span>}
    >
      <div className="bigscreen">
        <div className="bigscreen__chrome mono">
          <span>● LIVE · CHANNEL 04</span>
          <span>S-12 → S-1 · 12 SEMANAS</span>
        </div>
        <div className="bigscreen__chart">
          <LineChart data={data} series={series} width={760} height={260} />
          <div className="bigscreen__sweep" aria-hidden="true" />
        </div>
        <div className="bigscreen__foot mono">
          <span>VALID · 18.4k MUESTRAS</span>
          <span className="bigscreen__sep">│</span>
          <span>MARGEN ±2.1pt</span>
          <span className="bigscreen__sep">│</span>
          <span>METODOLOGÍA · MIXED-MODE</span>
          <span className="bigscreen__next">NEXT POLL · D-3</span>
        </div>
      </div>

      <div className="polling-foot">
        {SERIES_PARTIES.map((id) => {
          const delta = latest.intent[id] - first.intent[id];
          return (
            <div className="polling-foot__row" key={id}>
              <span className="polling-foot__dot" style={{ background: PARTIES[id].color }} />
              <span className="polling-foot__short mono">{PARTIES[id].short}</span>
              <span className="polling-foot__pct mono">{latest.intent[id]}%</span>
              <span
                className="polling-foot__delta mono"
                data-dir={delta >= 0 ? 'up' : 'down'}
              >
                {delta >= 0 ? '+' : ''}
                {delta}pt
              </span>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
