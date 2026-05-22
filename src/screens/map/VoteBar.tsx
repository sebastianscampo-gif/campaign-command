/* =============================================================================
   MAP — VoteBar
   Fila de intención de voto con cabecera de partido. Compartida por el dossier
   provincial y la vista nacional.
   ============================================================================= */

import { PARTIES } from '@/content';
import type { PartyId } from '@/content';

interface VoteBarProps {
  party: PartyId;
  pct: number;
}

export function VoteBar({ party, pct }: VoteBarProps) {
  const meta = PARTIES[party];
  return (
    <div className="vbar">
      <div className="vbar__head">
        <span className="vbar__dot" style={{ background: meta.color }} />
        <span className="vbar__short mono">{meta.short}</span>
        <span className="vbar__name">{meta.name}</span>
        <span className="vbar__pct mono">{pct.toFixed(1)}%</span>
      </div>
      <div className="vbar__track">
        <div
          className="vbar__fill"
          style={{ width: `${Math.min(100, pct * 2)}%`, background: meta.color }}
        />
      </div>
    </div>
  );
}
