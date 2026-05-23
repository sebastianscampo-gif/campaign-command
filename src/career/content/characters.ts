/* =============================================================================
   CAREER · CONTENT — Personajes recurrentes
   8 NPCs que pueblan la carrera. Sus stats iniciales son seeds; las decisiones
   del jugador los mueven en runtime (trust/loyalty/fear/respect).

   Patrón: cada NPC tiene una "agenda" implícita en sus stats que el sistema
   de relaciones consulta para decidir si propone alianza, traiciona, etc.
   ============================================================================= */

import type { NpcCharacter } from '../types';

/** NPCs sembrados. Las stats son baseline antes de cualquier interacción. */
export const SEED_NPCS: readonly NpcCharacter[] = [
  {
    id: 'mentor_ortuzar',
    name: 'Hernán Ortúzar',
    role: 'mentor',
    ideology: { economic: -0.2, social: -0.3, authority: -0.1 },
    ambition: 30,
    loyalty: 60,
    trust: 65,
    fear: 10,
    respect: 70,
    interests: ['Educación', 'Reforma institucional', 'Continuidad'],
    currentRelation: 'allied',
    history: ['Te ofreció apoyo cuando empezabas.'],
    betrayalRisk: 10,
    partyId: 'PRD',
  },
  {
    id: 'rival_salinas',
    name: 'Rodrigo Salinas Cárdenas',
    role: 'rival',
    ideology: { economic: 0.5, social: 0.6, authority: 0.4 },
    ambition: 90,
    loyalty: 10,
    trust: 20,
    fear: 25,
    respect: 40,
    interests: ['Orden público', 'Familia tradicional', 'Empresa'],
    currentRelation: 'hostile',
    history: ['Te conoce desde hace años y te subestima.'],
    betrayalRisk: 80,
    partyId: 'MNP',
  },
  {
    id: 'journalist_belaunde',
    name: 'Camila Belaúnde',
    role: 'journalist',
    ideology: { economic: -0.1, social: -0.2, authority: -0.3 },
    ambition: 55,
    loyalty: 30,
    trust: 50,
    fear: 5,
    respect: 60,
    interests: ['Transparencia', 'Investigación', 'Audiencia'],
    currentRelation: 'neutral',
    history: ['No te debe nada — y le gusta hacerlo notar.'],
    betrayalRisk: 30,
  },
  {
    id: 'party_boss_iturri',
    name: 'Diego Iturri',
    role: 'party_boss',
    ideology: { economic: -0.1, social: -0.1, authority: 0.1 },
    ambition: 70,
    loyalty: 45,
    trust: 50,
    fear: 30,
    respect: 50,
    interests: ['Estabilidad', 'Disciplina partidaria', 'Cuotas'],
    currentRelation: 'neutral',
    history: ['Controla la maquinaria del PRD. Te observa.'],
    betrayalRisk: 40,
    partyId: 'PRD',
  },
  {
    id: 'donor_moreno',
    name: 'Aurelio Moreno',
    role: 'donor',
    ideology: { economic: 0.6, social: 0.1, authority: 0.0 },
    ambition: 60,
    loyalty: 35,
    trust: 50,
    fear: 5,
    respect: 50,
    interests: ['Negocios', 'Estabilidad fiscal', 'Acceso al poder'],
    currentRelation: 'neutral',
    history: ['Quiere influencia, no protagonismo.'],
    betrayalRisk: 50,
  },
  {
    id: 'social_leader_mamani',
    name: 'Inés Mamani Quispe',
    role: 'social_leader',
    ideology: { economic: -0.6, social: -0.5, authority: -0.4 },
    ambition: 65,
    loyalty: 40,
    trust: 45,
    fear: 0,
    respect: 75,
    interests: ['Pueblos originarios', 'Agua', 'Justicia territorial'],
    currentRelation: 'neutral',
    history: ['Lidera el FAS. Vale más como aliada que como enemiga.'],
    betrayalRisk: 25,
    partyId: 'FAS',
    region: 'LO',
  },
  {
    id: 'governor_tagliaferri',
    name: 'Marco Tagliaferri',
    role: 'governor',
    ideology: { economic: 0.2, social: 0.0, authority: 0.1 },
    ambition: 75,
    loyalty: 30,
    trust: 50,
    fear: 15,
    respect: 55,
    interests: ['Valle Central', 'Comercio', 'Lobby empresarial'],
    currentRelation: 'neutral',
    history: ['Lidera Vanguardia Cívica. Centrista táctico.'],
    betrayalRisk: 50,
    partyId: 'VC',
    region: 'VC',
  },
  {
    id: 'businessman_korniak',
    name: 'Tomás Korniak',
    role: 'businessman',
    ideology: { economic: 0.8, social: 0.3, authority: 0.2 },
    ambition: 50,
    loyalty: 20,
    trust: 30,
    fear: 5,
    respect: 45,
    interests: ['Energía', 'Concesiones', 'Bajos impuestos'],
    currentRelation: 'neutral',
    history: ['Si lo recibís, exigirá favores. Si no, financiará rivales.'],
    betrayalRisk: 70,
  },
];

/** Inicializa el diccionario de NPCs por id, deep-clonado (no shared refs). */
export function seedNpcs(): Record<string, NpcCharacter> {
  return SEED_NPCS.reduce<Record<string, NpcCharacter>>((acc, npc) => {
    acc[npc.id] = structuredClone(npc) as NpcCharacter;
    return acc;
  }, {});
}
