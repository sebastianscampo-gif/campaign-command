/* =============================================================================
   PARTY · CONTENT — Plantillas de facciones
   10 facciones disponibles; cada tipo de partido activa 4. Cada plantilla
   define stats iniciales + ideología propia.
   ============================================================================= */

import type { FactionKind, ProvinceId } from '../types';

export interface FactionTemplate {
  readonly id: FactionKind;
  readonly name: string;
  readonly leader: string;
  readonly leaning: {
    readonly economic: number;
    readonly social: number;
    readonly radicalism: number;
  };
  /** Stats baseline. */
  readonly power: number;
  readonly loyalty: number;
  readonly discipline: number;
  readonly ambition: number;
  readonly resources: number;
  readonly mediaInfluence: number;
  readonly regions: readonly ProvinceId[];
  /** Demandas típicas que va a tener esta facción. */
  readonly typicalDemands: readonly string[];
}

export const FACTION_TEMPLATES: Record<FactionKind, FactionTemplate> = {
  old_guard: {
    id: 'old_guard',
    name: 'Vieja Guardia',
    leader: 'Hernán Ortúzar',
    leaning: { economic: 0.1, social: 0.2, radicalism: -0.4 },
    power: 70, loyalty: 50, discipline: 70, ambition: 40, resources: 60, mediaInfluence: 50,
    regions: ['VC', 'CA'],
    typicalDemands: [
      'Más avales para nuestros cuadros históricos.',
      'Que el discurso baje los tonos juveniles.',
    ],
  },
  youth: {
    id: 'youth',
    name: 'Juventudes del Partido',
    leader: 'Lucía Aguirre',
    leaning: { economic: -0.3, social: -0.5, radicalism: 0.3 },
    power: 35, loyalty: 75, discipline: 40, ambition: 65, resources: 25, mediaInfluence: 65,
    regions: ['VC', 'BR'],
    typicalDemands: [
      'Listas con 40% de menores de 35.',
      'Radicalizar el discurso de género y educación.',
    ],
  },
  technocrats: {
    id: 'technocrats',
    name: 'Ala Tecnócrata',
    leader: 'Diego Iturri',
    leaning: { economic: 0.2, social: -0.1, radicalism: -0.6 },
    power: 45, loyalty: 50, discipline: 80, ambition: 50, resources: 50, mediaInfluence: 55,
    regions: ['CA', 'VC'],
    typicalDemands: [
      'Plan económico serio antes de prometer nada.',
      'Filtros técnicos a los candidatos.',
    ],
  },
  populists: {
    id: 'populists',
    name: 'Ala Populista',
    leader: 'Marcos Beltrán',
    leaning: { economic: -0.4, social: 0.0, radicalism: 0.5 },
    power: 55, loyalty: 55, discipline: 35, ambition: 75, resources: 35, mediaInfluence: 75,
    regions: ['LO', 'NF'],
    typicalDemands: [
      'Discurso de masas, no de tecnócratas.',
      'Acto público multitudinario en una región abandonada.',
    ],
  },
  regionals: {
    id: 'regionals',
    name: 'Barones Regionales',
    leader: 'Carmen Saavedra',
    leaning: { economic: 0.0, social: 0.1, radicalism: -0.1 },
    power: 60, loyalty: 45, discipline: 60, ambition: 70, resources: 70, mediaInfluence: 45,
    regions: ['NF', 'PS', 'BR'],
    typicalDemands: [
      'Más recursos para sus provincias.',
      'Avales para sus operadores territoriales.',
    ],
  },
  business: {
    id: 'business',
    name: 'Facción Empresarial',
    leader: 'Tomás Korniak',
    leaning: { economic: 0.6, social: 0.1, radicalism: -0.5 },
    power: 50, loyalty: 30, discipline: 75, ambition: 60, resources: 85, mediaInfluence: 60,
    regions: ['CA', 'VC'],
    typicalDemands: [
      'No tocar concesiones estratégicas.',
      'Plan económico pro-mercado.',
    ],
  },
  union: {
    id: 'union',
    name: 'Facción Sindical',
    leader: 'Inés Mamani Quispe',
    leaning: { economic: -0.6, social: -0.2, radicalism: 0.4 },
    power: 50, loyalty: 55, discipline: 60, ambition: 50, resources: 55, mediaInfluence: 50,
    regions: ['LO', 'PS', 'NF'],
    typicalDemands: [
      'Compromisos laborales firmes.',
      'Que la campaña no abandone el norte.',
    ],
  },
  moderates: {
    id: 'moderates',
    name: 'Ala Moderada',
    leader: 'Sara Belmonte',
    leaning: { economic: 0.1, social: -0.1, radicalism: -0.6 },
    power: 45, loyalty: 55, discipline: 70, ambition: 45, resources: 40, mediaInfluence: 55,
    regions: ['VC', 'CA'],
    typicalDemands: [
      'Bajar el tono polarizante.',
      'Construir alianzas con el centro.',
    ],
  },
  radicals: {
    id: 'radicals',
    name: 'Ala Radical',
    leader: 'Javier "El Rojo" Linares',
    leaning: { economic: -0.7, social: -0.4, radicalism: 0.7 },
    power: 40, loyalty: 65, discipline: 30, ambition: 70, resources: 30, mediaInfluence: 70,
    regions: ['LO', 'BR'],
    typicalDemands: [
      'Pureza ideológica antes que pragmatismo.',
      'Romper con financistas del sistema.',
    ],
  },
  ground_ops: {
    id: 'ground_ops',
    name: 'Operadores Territoriales',
    leader: 'Roberto "El Negro" Suárez',
    leaning: { economic: 0.0, social: 0.0, radicalism: 0.0 },
    power: 55, loyalty: 60, discipline: 60, ambition: 55, resources: 50, mediaInfluence: 30,
    regions: ['CA', 'NF', 'LO', 'VC', 'BR'],
    typicalDemands: [
      'Bajar el aire para subir el barrio.',
      'Recursos para las maquinarias provinciales.',
    ],
  },
};

/** Inicializa el dict de facciones activas para un partido recién creado. */
export function seedFactions(activeKinds: readonly FactionKind[]): Record<FactionKind, FactionTemplate> {
  // Solo devolvemos las activas; el state luego las completa con campos mutables.
  const result = {} as Record<FactionKind, FactionTemplate>;
  for (const kind of activeKinds) {
    result[kind] = structuredClone(FACTION_TEMPLATES[kind]) as FactionTemplate;
  }
  return result;
}
