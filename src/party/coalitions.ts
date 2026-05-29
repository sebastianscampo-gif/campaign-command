/* =============================================================================
   PARTY — Lógica de coaliciones
   Las coaliciones son acuerdos persistentes con otros partidos. Mientras están
   activas, aportan al score electoral según su tipo y etapa. Romperlas deja
   rastro (status 'broken') que la narrativa puede leer.
   ============================================================================= */

import type {
  Coalition,
  CoalitionType,
  ElectionStage,
  PartyId,
} from './types';

let coalitionCounter = 0;
function nextCoalitionId(): string {
  coalitionCounter += 1;
  return `coal_${Date.now().toString(36)}_${coalitionCounter}`;
}

export interface FormCoalitionInput {
  readonly partnerName: string;
  readonly partnerPartyId: PartyId;
  readonly type: CoalitionType;
  readonly terms: string;
  readonly forStage: ElectionStage | 'all';
  readonly cycle: number;
}

/** Crea una coalición activa. Si ya hay una activa con el mismo socio, no duplica. */
export function formCoalition(
  coalitions: readonly Coalition[],
  input: FormCoalitionInput,
): Coalition[] {
  const alreadyActive = coalitions.some(
    (c) => c.partnerPartyId === input.partnerPartyId && c.status === 'active',
  );
  if (alreadyActive) return [...coalitions];

  const coalition: Coalition = {
    id: nextCoalitionId(),
    partnerName: input.partnerName,
    partnerPartyId: input.partnerPartyId,
    type: input.type,
    terms: input.terms,
    forStage: input.forStage,
    status: 'active',
    createdCycle: input.cycle,
  };
  return [...coalitions, coalition];
}

export function activeCoalitions(coalitions: readonly Coalition[]): readonly Coalition[] {
  return coalitions.filter((c) => c.status === 'active');
}

/** Marca como rotas todas las coaliciones activas. Devuelve el nuevo array. */
export function breakAllCoalitions(coalitions: readonly Coalition[]): Coalition[] {
  return coalitions.map((c) =>
    c.status === 'active' ? { ...c, status: 'broken' as const } : c,
  );
}

/** Bonus de cuota nacional por coaliciones activas aplicables a la etapa. */
export function coalitionShareBonus(
  coalitions: readonly Coalition[],
  stage: ElectionStage,
): number {
  return activeCoalitions(coalitions)
    .filter((c) => c.forStage === 'all' || c.forStage === stage)
    .reduce((sum, c) => {
      const weight =
        c.type === 'electoral'
          ? 6
          : c.type === 'legislative'
            ? 4
            : c.type === 'single_candidacy'
              ? 5
              : 3;
      return sum + weight;
    }, 0);
}

export function _resetCoalitionCounter(): void {
  coalitionCounter = 0;
}
