/* =============================================================================
   DASHBOARD — Paneles de la candidata (02 · 04 · 09)
   Vitals, momentum y aprobación demográfica.
   ============================================================================= */

import { Gauge, Panel } from '@/components';
import {
  CANDIDATE,
  DEMOGRAPHIC_LABELS,
  EXTRA_VITALS,
  IMAGE_VITAL_NOTES,
  MOMENTUM_FACTORS,
} from '@/content';
import { assertDefined } from '@/lib/invariant';
import { useGameStore } from '@/state/gameStore';

/** Banda de color de un valor 0…100. */
function band(value: number): 'good' | 'ok' | 'low' | 'bad' {
  if (value > 70) return 'good';
  if (value > 50) return 'ok';
  if (value > 35) return 'low';
  return 'bad';
}

/* ---- 02 · Vitals ----------------------------------------------------------- */

interface VitalRow {
  label: string;
  value: number;
  note: string;
  warn?: boolean;
}

function VitalBar({ label, value, note, warn }: VitalRow) {
  return (
    <div className="vital" data-warn={warn === true}>
      <div className="vital__head mono">
        <span className="vital__label">{label}</span>
        <span className="vital__value" data-band={band(value)}>
          {value}
        </span>
      </div>
      <div className="vital__track">
        <div className="vital__fill" data-band={band(value)} style={{ width: `${value}%` }} />
        {[25, 50, 75].map((tick) => (
          <span key={tick} className="vital__tick" style={{ left: `${tick}%` }} />
        ))}
      </div>
      <div className="vital__note mono">{note}</div>
    </div>
  );
}

export function VitalsPanel() {
  const image = useGameStore((s) => s.candidate.image);

  const vitals: VitalRow[] = [
    assertDefined(EXTRA_VITALS[0], 'EXTRA_VITALS tiene 3 entradas'),
    { label: 'CHARISMA', value: image.charisma, note: IMAGE_VITAL_NOTES.charisma ?? '' },
    { label: 'COMPETENCE', value: image.competence, note: IMAGE_VITAL_NOTES.competence ?? '' },
    { label: 'INTEGRITY', value: image.integrity, note: IMAGE_VITAL_NOTES.integrity ?? '' },
    { label: 'DECISIVENESS', value: image.decisiveness, note: IMAGE_VITAL_NOTES.decisiveness ?? '', warn: true },
    assertDefined(EXTRA_VITALS[1], 'EXTRA_VITALS tiene 3 entradas'),
    assertDefined(EXTRA_VITALS[2], 'EXTRA_VITALS tiene 3 entradas'),
  ];

  return (
    <Panel label="02" caption="Candidata · vitals" className="span-4">
      <div className="vitals">
        {vitals.map((vital) => (
          <VitalBar key={vital.label} {...vital} />
        ))}
        <div className="scandals">
          <div className="scandals__head mono">
            <span>⚠ ESCÁNDALOS EN AGENDA</span>
            <span>{String(CANDIDATE.scandals.length).padStart(2, '0')}</span>
          </div>
          {CANDIDATE.scandals.map((scandal) => (
            <div className="scandals__row" key={scandal.year}>
              <span className="scandals__year mono">{scandal.year}</span>
              <span className="scandals__label">{scandal.label}</span>
              <span className="scandals__sev mono">{scandal.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ---- 04 · Momentum --------------------------------------------------------- */

export function MomentumPanel() {
  const net = MOMENTUM_FACTORS.reduce((sum, factor) => sum + factor.value, 0);
  const index = 50 + net;

  return (
    <Panel label="04" caption="Momentum" className="span-4">
      <div className="momentum">
        <Gauge value={index} label="ÍNDICE" color="var(--pos)" size={148} />
        <div className="momentum__rows">
          {MOMENTUM_FACTORS.map((factor) => (
            <div className="momentum__row mono" key={factor.label}>
              <span>{factor.label}</span>
              <span data-dir={factor.value >= 0 ? 'up' : 'down'}>
                {factor.value >= 0 ? '+' : ''}
                {factor.value}
              </span>
            </div>
          ))}
          <div className="momentum__row momentum__row--total mono">
            <span>NETO 7d</span>
            <span data-dir="up">+{net}</span>
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ---- 09 · Aprobación demográfica ------------------------------------------- */

export function DemographicsPanel() {
  const approval = useGameStore((s) => s.candidate.approval);
  const rows = Object.entries(approval) as [string, number][];

  return (
    <Panel label="09" caption="Aprobación · demográfica" className="span-4">
      <div className="appdemo">
        {rows.map(([key, value]) => (
          <div className="appdemo__row" key={key}>
            <span className="appdemo__label mono">{DEMOGRAPHIC_LABELS[key] ?? key.toUpperCase()}</span>
            <div className="appdemo__track">
              <div
                className="appdemo__fill"
                data-band={value > 50 ? 'good' : value > 40 ? 'ok' : 'bad'}
                style={{ width: `${value}%` }}
              />
              <span className="appdemo__mid" />
            </div>
            <span className="appdemo__value mono">{value}%</span>
          </div>
        ))}
        <div className="appdemo__foot mono">
          <span>━ 50% UMBRAL DE PARIDAD</span>
          <span className="dash-pos">+4pt vs semana</span>
        </div>
      </div>
    </Panel>
  );
}
