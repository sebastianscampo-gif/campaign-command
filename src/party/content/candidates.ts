/* =============================================================================
   PARTY · CONTENT — Candidatos sembrados
   10 candidatos disponibles; el jugador decide a quiénes avalar y para qué
   etapa. Cada uno viene de una facción y tiene tradeoffs claros.
   ============================================================================= */

import type { PartyCandidate } from '../types';

export const SEED_CANDIDATES: readonly Omit<PartyCandidate, 'endorsed' | 'endorsedFor' | 'history'>[] = [
  {
    id: 'cand_vasconcelos',
    name: 'Elena Vasconcelos',
    age: 52,
    region: 'CA',
    role: 'star',
    popularity: 70, charisma: 78, loyalty: 60, scandalRisk: 25, groundGame: 55,
    mediaSkill: 80, ambition: 75, experience: 70, futurePotential: 80,
    ideology: { economic: -0.3, social: -0.5 },
    faction: 'moderates',
  },
  {
    id: 'cand_iturri',
    name: 'Diego Iturri',
    age: 58,
    region: 'VC',
    role: 'technocrat',
    popularity: 45, charisma: 40, loyalty: 70, scandalRisk: 10, groundGame: 40,
    mediaSkill: 50, ambition: 55, experience: 80, futurePotential: 55,
    ideology: { economic: 0.2, social: -0.1 },
    faction: 'technocrats',
  },
  {
    id: 'cand_aguirre',
    name: 'Lucía Aguirre',
    age: 32,
    region: 'BR',
    role: 'viral_outsider',
    popularity: 55, charisma: 75, loyalty: 70, scandalRisk: 35, groundGame: 30,
    mediaSkill: 85, ambition: 80, experience: 25, futurePotential: 90,
    ideology: { economic: -0.4, social: -0.6 },
    faction: 'youth',
  },
  {
    id: 'cand_saavedra',
    name: 'Carmen Saavedra',
    age: 60,
    region: 'NF',
    role: 'regional_leader',
    popularity: 65, charisma: 50, loyalty: 50, scandalRisk: 30, groundGame: 85,
    mediaSkill: 40, ambition: 70, experience: 75, futurePotential: 55,
    ideology: { economic: 0.0, social: 0.1 },
    faction: 'regionals',
  },
  {
    id: 'cand_beltran',
    name: 'Marcos Beltrán',
    age: 45,
    region: 'LO',
    role: 'activist',
    popularity: 60, charisma: 70, loyalty: 55, scandalRisk: 30, groundGame: 55,
    mediaSkill: 75, ambition: 75, experience: 45, futurePotential: 75,
    ideology: { economic: -0.5, social: 0.0 },
    faction: 'populists',
  },
  {
    id: 'cand_mamani',
    name: 'Inés Mamani Quispe',
    age: 48,
    region: 'LO',
    role: 'activist',
    popularity: 55, charisma: 65, loyalty: 50, scandalRisk: 15, groundGame: 60,
    mediaSkill: 55, ambition: 50, experience: 60, futurePotential: 65,
    ideology: { economic: -0.6, social: -0.2 },
    faction: 'union',
  },
  {
    id: 'cand_korniak',
    name: 'Tomás Korniak',
    age: 55,
    region: 'CA',
    role: 'businessman',
    popularity: 35, charisma: 50, loyalty: 30, scandalRisk: 55, groundGame: 30,
    mediaSkill: 60, ambition: 65, experience: 65, futurePotential: 50,
    ideology: { economic: 0.7, social: 0.2 },
    faction: 'business',
  },
  {
    id: 'cand_ortuzar_jr',
    name: 'Hernán Ortúzar Jr.',
    age: 38,
    region: 'VC',
    role: 'heir',
    popularity: 40, charisma: 45, loyalty: 80, scandalRisk: 20, groundGame: 60,
    mediaSkill: 50, ambition: 50, experience: 40, futurePotential: 65,
    ideology: { economic: 0.0, social: 0.0 },
    faction: 'old_guard',
  },
  {
    id: 'cand_linares',
    name: 'Javier "El Rojo" Linares',
    age: 50,
    region: 'BR',
    role: 'activist',
    popularity: 50, charisma: 60, loyalty: 80, scandalRisk: 40, groundGame: 50,
    mediaSkill: 65, ambition: 65, experience: 55, futurePotential: 60,
    ideology: { economic: -0.7, social: -0.4 },
    faction: 'radicals',
  },
  {
    id: 'cand_suarez',
    name: 'Roberto "El Negro" Suárez',
    age: 54,
    region: 'CA',
    role: 'old_cacique',
    popularity: 50, charisma: 45, loyalty: 65, scandalRisk: 45, groundGame: 90,
    mediaSkill: 35, ambition: 60, experience: 80, futurePotential: 45,
    ideology: { economic: 0.0, social: 0.0 },
    faction: 'ground_ops',
  },
];

export function seedCandidatePool(): Record<string, PartyCandidate> {
  const out: Record<string, PartyCandidate> = {};
  for (const c of SEED_CANDIDATES) {
    out[c.id] = {
      ...structuredClone(c),
      endorsed: false,
      endorsedFor: null,
      history: [],
    } as PartyCandidate;
  }
  return out;
}
