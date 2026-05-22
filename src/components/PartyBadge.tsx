/* =============================================================================
   UI — PartyBadge
   Distintivo de partido: punto de color + sigla. Lee la identidad del partido
   de la capa de contenido.
   ============================================================================= */

import { PARTIES } from '@/content';
import type { PartyId } from '@/content';

interface PartyBadgeProps {
  id: PartyId;
  size?: 'sm' | 'md';
}

export function PartyBadge({ id, size = 'sm' }: PartyBadgeProps) {
  const party = PARTIES[id];

  return (
    <span className={`pbadge pbadge--${size}`}>
      <span
        className="pbadge__dot"
        style={{ background: party.color }}
        aria-hidden="true"
      />
      <span className="pbadge__id mono">{party.short}</span>
    </span>
  );
}
