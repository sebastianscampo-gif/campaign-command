/* =============================================================================
   CONTENT — Identidad del candidato del jugador
   Solo identidad fija. Las estadísticas mutables (aprobación, caja de campaña,
   imagen, momentum) viven en el estado de juego (state/scenario).
   ============================================================================= */

import type { Candidate } from './types';

export const CANDIDATE: Candidate = {
  name: 'Elena Vasconcelos',
  party: 'PRD',
  age: 52,
  background:
    'Senadora por Costa Atlántica (3 períodos). Ex-Ministra de Educación 2018-2021.',
  traits: ['Oradora', 'Disciplinada', 'Pragmática', 'Reservada'],
  ideology: { economic: -0.35, social: -0.55, authority: -0.25 },
  timeline: [
    { year: 1998, label: 'Concejala municipal · Bahía Real' },
    { year: 2007, label: 'Diputada Federal' },
    { year: 2015, label: 'Senadora por Costa Atlántica' },
    { year: 2018, label: 'Ministra de Educación' },
    { year: 2024, label: 'Precandidata presidencial · PRD' },
  ],
  scandals: [
    { year: 2021, severity: 'medio', label: 'Caso fideicomiso educativo' },
  ],
};
