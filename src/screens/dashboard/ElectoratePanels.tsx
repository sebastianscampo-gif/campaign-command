/* =============================================================================
   DASHBOARD — Paneles del electorado (03 · 05 · 07)
   Saliencia de issues, fuerza de coalición y bloques de votantes.
   ============================================================================= */

import { Panel } from '@/components';
import { PARTIES } from '@/content';
import type { PartyId } from '@/content';
import { useGameStore } from '@/state/gameStore';

/* ---- 03 · Issue salience --------------------------------------------------- */

export function IssuesPanel() {
  const issues = useGameStore((s) => s.issues);

  return (
    <Panel label="03" caption="Issue salience" className="span-4">
      <div className="issues">
        {issues.map((issue, i) => {
          const party = PARTIES[issue.owned];
          return (
            <div className="issue" key={issue.id}>
              <span className="issue__idx mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="issue__label">{issue.label}</span>
              <span className="issue__owner mono" style={{ color: party.color }}>
                ◆ {party.short}
              </span>
              <span className="issue__pct mono">{issue.salience}</span>
              <span
                className="issue__delta mono"
                data-dir={issue.delta > 0 ? 'up' : issue.delta < 0 ? 'down' : 'flat'}
              >
                {issue.delta > 0 ? '+' : ''}
                {issue.delta}
              </span>
              <div className="issue__bar">
                <div
                  className="issue__fill"
                  style={{ width: `${issue.salience}%`, background: party.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

/* ---- 05 · Coalition strength ----------------------------------------------- */

interface CoalitionNode {
  party: PartyId;
  role: string;
  hint?: string;
  kind: 'you' | 'ally' | 'neutral' | 'opp';
}

const COALITION: readonly CoalitionNode[] = [
  { party: 'PRD', role: 'TU BLOQUE', kind: 'you' },
  { party: 'FAS', role: 'ALIADO', hint: 'Mamani · apoyo condicional', kind: 'ally' },
  { party: 'VC', role: 'NEUTRAL', hint: 'Tagliaferri · en silencio', kind: 'neutral' },
  { party: 'IND', role: 'DISPERSO', kind: 'neutral' },
  { party: 'MNP', role: 'OPOSICIÓN', kind: 'opp' },
];

export function CoalitionPanel() {
  const polling = useGameStore((s) => s.polling);
  const intent = polling[polling.length - 1].intent;
  const ownBloc = intent.PRD + intent.FAS;

  return (
    <Panel label="05" caption="Coalition strength" className="span-4">
      <div className="coalition">
        {COALITION.map((node) => (
          <div className="coalnode" data-kind={node.kind} key={node.party}>
            <div className="coalnode__head mono">
              <span className="coalnode__party">{PARTIES[node.party].short}</span>
              <span className="coalnode__val">{intent[node.party]}%</span>
            </div>
            <div className="coalnode__role mono">{node.role}</div>
            {node.hint && <div className="coalnode__hint">{node.hint}</div>}
          </div>
        ))}
        <div className="coalition__total mono">
          <span>BLOQUE PROPIO + ALIADO</span>
          <span className="dash-pos">{ownBloc}%</span>
        </div>
      </div>
    </Panel>
  );
}

/* ---- 07 · Voter blocs ------------------------------------------------------ */

export function BlocsPanel() {
  const blocs = useGameStore((s) => s.blocs);

  return (
    <Panel label="07" caption="Voter blocs" className="span-4">
      <div className="blocs">
        {blocs.map((bloc) => (
          <div className="bloc" key={bloc.id}>
            <div className="bloc__head">
              <span className="bloc__name">{bloc.label}</span>
              <span className="bloc__share mono">{bloc.share}% del padrón</span>
            </div>
            <div className="bloc__bar">
              <div className="bloc__seg bloc__seg--you" style={{ width: `${bloc.you}%` }} />
              <div className="bloc__seg bloc__seg--swing" style={{ width: `${bloc.swing}%` }} />
              <div className="bloc__seg bloc__seg--them" style={{ width: `${bloc.them}%` }} />
            </div>
            <div className="bloc__foot mono">
              <span className="dash-pos">{bloc.you}% tú</span>
              <span className="dash-dim">{bloc.swing}% swing</span>
              <span className="dash-neg">{bloc.them}% rivales</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
