/* =============================================================================
   CONTENT — Partidos políticos de San Esteban
   ============================================================================= */

import type { Party, PartyId } from './types';

export const PARTIES: Readonly<Record<PartyId, Party>> = {
  PRD: {
    id: 'PRD',
    name: 'Partido Republicano Democrático',
    short: 'PRD',
    ideology: 'Centro-izquierda · Socialdemócrata',
    color: '#5B8FB9',
    leader: 'Elena Vasconcelos',
    founded: 1953,
  },
  MNP: {
    id: 'MNP',
    name: 'Movimiento Nacional Popular',
    short: 'MNP',
    ideology: 'Centro-derecha · Conservador',
    color: '#C24A4A',
    leader: 'Rodrigo Salinas Cárdenas',
    founded: 1968,
  },
  FAS: {
    id: 'FAS',
    name: 'Frente Andino Soberano',
    short: 'FAS',
    ideology: 'Izquierda · Plurinacional',
    color: '#5E9B7E',
    leader: 'Inés Mamani Quispe',
    founded: 2009,
  },
  VC: {
    id: 'VC',
    name: 'Vanguardia Cívica',
    short: 'VC',
    ideology: 'Centro · Liberal',
    color: '#C9A961',
    leader: 'Marco Tagliaferri',
    founded: 2019,
  },
  IND: {
    id: 'IND',
    name: 'Independientes / Otros',
    short: 'IND',
    ideology: 'Diverso',
    color: '#8C95A0',
    leader: '—',
    founded: null,
  },
};

/** Orden canónico de partidos para gráficos y leyendas. */
export const PARTY_ORDER: readonly PartyId[] = [
  'PRD',
  'MNP',
  'FAS',
  'VC',
  'IND',
];
