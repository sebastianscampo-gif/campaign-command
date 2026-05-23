/* =============================================================================
   SCREENS — StyleGuide
   Documentación viva del sistema de diseño (Fase 2). Muestra cada primitivo con
   datos reales de los stores, de modo que la fase sea revisable de un vistazo.
   ============================================================================= */

import {
  Bar,
  Gauge,
  LineChart,
  NumberTicker,
  Panel,
  PartyBadge,
  ProvinceMap,
  SectionHead,
  Sparkline,
  StatTile,
} from '@/components';
import type { ChartPoint } from '@/components';
import { PARTIES, PARTY_ORDER } from '@/content';
import type { PartyId } from '@/content';
import { assertDefined } from '@/lib/invariant';
import { useGameStore } from '@/state/gameStore';
import { useUiStore } from '@/state/uiStore';
import type { VoteShare } from '@/state/types';

const PALETTE_TOKENS = [
  '--bg',
  '--bg-panel',
  '--bg-elev',
  '--border',
  '--text',
  '--text-dim',
  '--text-muted',
  '--accent',
  '--pos',
  '--neg',
  '--warn',
  '--info',
];

function leadingParty(intent: VoteShare): PartyId {
  const entries = Object.entries(intent) as [PartyId, number][];
  return entries.reduce((top, current) =>
    current[1] > top[1] ? current : top,
  )[0];
}

export function StyleGuideScreen() {
  const polling = useGameStore((s) => s.polling);
  const candidate = useGameStore((s) => s.candidate);
  const provinces = useGameStore((s) => s.provinces);
  const issues = useGameStore((s) => s.issues);
  const selectedProvince = useUiStore((s) => s.selectedProvince);
  const selectProvince = useUiStore((s) => s.selectProvince);

  const latest = assertDefined(polling[polling.length - 1], 'polling no vacío');

  const chartData: ChartPoint[] = polling.map((point) => ({
    label: point.week,
    values: point.intent,
  }));
  const chartSeries = PARTY_ORDER.map((id) => ({
    key: id,
    label: PARTIES[id].short,
    color: PARTIES[id].color,
  }));

  return (
    <div className="sg">
      <header className="sg__head">
        <div className="sg__eyebrow mono">FASE 2 · SISTEMA DE DISEÑO</div>
        <h1 className="sg__title">Primitivos de interfaz</h1>
        <p className="sg__lede">
          Diez componentes tipados y reutilizables. Todos consumen tokens del
          tema y datos reales de los stores. Cambiá de paleta para verlos
          re-tematizarse en vivo.
        </p>
      </header>

      <Panel label="01 · TOKENS DE COLOR" caption="Paleta activa">
        <div className="sg__swatches">
          {PALETTE_TOKENS.map((token) => (
            <div className="sg__swatch" key={token}>
              <div
                className="sg__chip"
                style={{ background: `var(${token})` }}
              />
              <span className="sg__chip-name mono">{token}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel label="02 · PANEL" caption="Contenedor brutalista">
        <div className="sg__row">
          <Panel label="ESTÁNDAR" caption="con cabecera" right="●">
            <p className="sg__text">
              Borde fino, marcas de esquina en acento y cabecera opcional.
            </p>
          </Panel>
          <Panel label="DENSO" dense>
            <p className="sg__text">Padding reducido para zonas compactas.</p>
          </Panel>
          <Panel label="ACENTO" accent>
            <p className="sg__text">Borde resaltado con el color de acento.</p>
          </Panel>
        </div>
      </Panel>

      <Panel label="03 · STATTILE + NUMBERTICKER" caption="KPIs animados">
        <div className="sg__grid">
          <StatTile
            label="APROBACIÓN NACIONAL"
            value={<NumberTicker value={candidate.approval.national} suffix="%" />}
            delta={3}
            tone="accent"
            sub="vs. semana previa"
          />
          <StatTile
            label="MOMENTUM"
            value={<NumberTicker value={candidate.momentum} prefix="+" />}
            delta={2}
            tone="pos"
          />
          <StatTile
            label="CAJA DE CAMPAÑA"
            value={
              <NumberTicker
                value={candidate.warChest}
                decimals={1}
                prefix="$"
                suffix="M"
              />
            }
            delta={-1.2}
          />
          <StatTile
            label="INTEGRIDAD"
            value={candidate.image.integrity}
            large
            tone="info"
          />
        </div>
      </Panel>

      <Panel label="04 · BAR" caption={`Intención de voto · ${latest.week}`}>
        <div className="sg__stack">
          {PARTY_ORDER.map((id) => (
            <Bar
              key={id}
              label={PARTIES[id].short}
              pct={latest.intent[id]}
              color={PARTIES[id].color}
              value={`${latest.intent[id]}%`}
            />
          ))}
        </div>
      </Panel>

      <Panel label="05 · GAUGE" caption="Indicadores radiales">
        <div className="sg__row sg__row--center">
          <Gauge value={candidate.approval.national} label="APROBACIÓN" />
          <Gauge
            value={candidate.image.competence}
            label="COMPETENCIA"
            color="var(--info)"
          />
          <Gauge
            value={candidate.image.charisma}
            label="CARISMA"
            color="var(--pos)"
          />
        </div>
      </Panel>

      <Panel label="06 · SPARKLINE" caption="Tendencias compactas">
        <div className="sg__row">
          {(['PRD', 'MNP', 'FAS'] as const).map((id) => (
            <div className="sg__spark" key={id}>
              <PartyBadge id={id} size="md" />
              <Sparkline
                data={polling.map((point) => point.intent[id])}
                color={PARTIES[id].color}
                fill
                dots
                baseline
              />
            </div>
          ))}
        </div>
      </Panel>

      <Panel label="07 · LINECHART" caption="Encuesta nacional · 12 semanas">
        <LineChart data={chartData} series={chartSeries} width={620} />
      </Panel>

      <Panel label="08 · SECTIONHEAD" caption="Encabezados de sección">
        <SectionHead
          index="§ 08.1"
          title="Coalición y bloques"
          sub="análisis del electorado"
          right={`${issues.length} temas activos`}
        />
      </Panel>

      <Panel label="09 · PARTYBADGE" caption="Distintivos de partido">
        <div className="sg__row sg__row--center">
          {PARTY_ORDER.map((id) => (
            <PartyBadge key={id} id={id} size="md" />
          ))}
        </div>
      </Panel>

      <Panel
        label="10 · PROVINCEMAP"
        caption="Mapa coloreado por partido líder"
        right="Clic para seleccionar"
        noPad
      >
        <ProvinceMap
          fillOf={(id) => PARTIES[leadingParty(provinces[id].intent)].color}
          selected={selectedProvince}
          onSelect={selectProvince}
          showLabels
          showGrid
        />
      </Panel>
    </div>
  );
}
