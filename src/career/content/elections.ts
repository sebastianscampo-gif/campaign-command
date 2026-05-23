/* =============================================================================
   CAREER · CONTENT — Escenarios electorales encadenados
   La primera versión del Modo Carrera tiene exactamente 3 elecciones, una por
   ciclo. Cada una sube la apuesta y consume reputación + estado acumulado.
   ============================================================================= */

import type { ElectionScenario } from '../types';

export const CAREER_ELECTIONS: readonly ElectionScenario[] = [
  {
    id: 'local_mayor_bahia_real',
    stage: 'local',
    title: 'Elección Municipal · Bahía Real',
    region: 'CA',
    officeOnWin: 'mayor',
    winThreshold: 45,
    opponentName: 'Mariana Costa',
    opponentParty: 'MNP',
    fameReward: 8,
  },
  {
    id: 'regional_governor',
    stage: 'regional',
    title: 'Elección Regional · Gobernación',
    officeOnWin: 'governor',
    winThreshold: 52,
    opponentName: 'Alberto Lecuna',
    opponentParty: 'MNP',
    fameReward: 18,
  },
  {
    id: 'presidential',
    stage: 'presidential',
    title: 'Elecciones Generales · Presidencia',
    officeOnWin: 'president',
    winThreshold: 58,
    opponentName: 'Rodrigo Salinas Cárdenas',
    opponentParty: 'MNP',
    fameReward: 40,
  },
];
