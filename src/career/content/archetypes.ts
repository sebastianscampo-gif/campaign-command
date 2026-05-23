/* =============================================================================
   CAREER · CONTENT — Arquetipos políticos
   Cada arquetipo aplica un modificador sobre las stats base del político.
   El modificador es aditivo y se acota a [0, 100] al cierre del setup.
   ============================================================================= */

import type {
  ArchetypeId,
  PoliticianStats,
} from '../types';

export interface Archetype {
  readonly id: ArchetypeId;
  readonly name: string;
  readonly tagline: string;
  readonly strengths: readonly string[];
  readonly weaknesses: readonly string[];
  readonly statModifiers: PoliticianStats;
  /** Etiqueta inicial que se aplica a la reputación. */
  readonly initialLabel: string;
}

const ZERO: PoliticianStats = {
  charisma: 0,
  strategy: 0,
  perceivedHonesty: 0,
  mediaSkill: 0,
  negotiation: 0,
  groundGame: 0,
  popularConnection: 0,
  technicalCompetence: 0,
  radicalism: 0,
  partyDiscipline: 0,
};

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  reformist: {
    id: 'reformist',
    name: 'Reformista',
    tagline: 'Cambio responsable, gestión transparente.',
    strengths: ['Jóvenes', 'Clase media', 'Educación', 'Transparencia', 'Medios'],
    weaknesses: ['Élites tradicionales', 'Maquinaria política clásica'],
    statModifiers: {
      ...ZERO,
      charisma: 8,
      perceivedHonesty: 14,
      mediaSkill: 10,
      technicalCompetence: 6,
      groundGame: -8,
      partyDiscipline: -4,
    },
    initialLabel: 'El Reformista',
  },
  populist: {
    id: 'populist',
    name: 'Populista',
    tagline: 'La voz que el pueblo esperaba.',
    strengths: ['Masas', 'Redes sociales', 'Discursos emocionales', 'Regiones marginadas'],
    weaknesses: ['Instituciones', 'Estabilidad'],
    statModifiers: {
      ...ZERO,
      charisma: 14,
      popularConnection: 16,
      mediaSkill: 8,
      radicalism: 10,
      technicalCompetence: -8,
      negotiation: -6,
    },
    initialLabel: 'La Voz del Pueblo',
  },
  technocrat: {
    id: 'technocrat',
    name: 'Tecnócrata',
    tagline: 'Datos, gestión, resultados.',
    strengths: ['Economía', 'Gestión', 'Moderados', 'Sector privado'],
    weaknesses: ['Carisma', 'Emoción', 'Conexión popular'],
    statModifiers: {
      ...ZERO,
      technicalCompetence: 18,
      strategy: 10,
      perceivedHonesty: 6,
      charisma: -10,
      popularConnection: -12,
      radicalism: -8,
    },
    initialLabel: 'El Tecnócrata Frío',
  },
  regional_baron: {
    id: 'regional_baron',
    name: 'Barón Regional',
    tagline: 'Territorio, lealtad, estructura.',
    strengths: ['Maquinaria territorial', 'Alianzas locales', 'Disciplina'],
    weaknesses: ['Imagen nacional', 'Transparencia'],
    statModifiers: {
      ...ZERO,
      groundGame: 18,
      negotiation: 10,
      partyDiscipline: 10,
      strategy: 4,
      perceivedHonesty: -8,
      mediaSkill: -6,
    },
    initialLabel: 'El Barón Regional',
  },
  outsider: {
    id: 'outsider',
    name: 'Outsider',
    tagline: 'Lo de afuera vino a cambiar lo de adentro.',
    strengths: ['Viralidad', 'Discurso anti-sistema', 'Crecimiento rápido'],
    weaknesses: ['Estructura', 'Experiencia', 'Alianzas'],
    statModifiers: {
      ...ZERO,
      charisma: 12,
      mediaSkill: 14,
      radicalism: 14,
      groundGame: -14,
      negotiation: -10,
      partyDiscipline: -16,
    },
    initialLabel: 'El Outsider',
  },
};

/** Base de stats antes del modificador del arquetipo. */
export const BASE_STATS: PoliticianStats = {
  charisma: 50,
  strategy: 50,
  perceivedHonesty: 50,
  mediaSkill: 50,
  negotiation: 50,
  groundGame: 50,
  popularConnection: 50,
  technicalCompetence: 50,
  radicalism: 30,
  partyDiscipline: 50,
};

export const ARCHETYPE_ORDER: readonly ArchetypeId[] = [
  'reformist',
  'populist',
  'technocrat',
  'regional_baron',
  'outsider',
];
