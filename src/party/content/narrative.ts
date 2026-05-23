/* =============================================================================
   PARTY · CONTENT — Plantillas narrativas y reglas de legado del partido
   Los textos se renderizan en titulares post-elección y al cerrar la partida.
   Las reglas de legado son evaluadas en orden de prioridad: la primera que
   matchea da el archetype del partido.
   ============================================================================= */

import type { LegacyArchetype } from '../types';

export interface NarrativeTemplate {
  readonly id: string;
  readonly text: string;
}

/** Titulares post-elección del partido. */
export const PARTY_ELECTION_TEMPLATES: readonly NarrativeTemplate[] = [
  { id: 'local_won', text: '{sigla} se impone en {seats} intendencias: arranca la maquinaria.' },
  { id: 'local_split', text: '{sigla} gana terreno pero no consolida: {seats} intendencias y un horizonte abierto.' },
  { id: 'local_lost', text: '{sigla} no rompe el techo en las locales. La estructura cruje.' },
  { id: 'legislative_won', text: '{sigla} entra al Congreso con {seats} bancas: una bancada con peso propio.' },
  { id: 'legislative_split', text: '{sigla} suma bancas pero no logra el bloque que prometía.' },
  { id: 'legislative_lost', text: '{sigla} queda fuera del Congreso. El partido pierde caja y aire.' },
  { id: 'national_won', text: '{sigla} gana las nacionales: lo imposible se vuelve obvio retrospectivamente.' },
  { id: 'national_split', text: '{sigla} se queda en la segunda vuelta pero define al ganador. Poder sin palacio.' },
  { id: 'national_lost', text: '{sigla} no alcanza el ballotage. La pregunta es si hay partido para la próxima.' },
];

/** Resúmenes de fin de ciclo cuando ocurren virajes fuertes. */
export const PARTY_CYCLE_NARRATIVES: readonly NarrativeTemplate[] = [
  { id: 'faction_rupture_risk', text: 'Una facción del partido amenaza con romper si la dirigencia no cede.' },
  { id: 'territorial_growth', text: 'El partido ya tiene anclaje territorial donde antes no era escuchado.' },
  { id: 'donor_dependence', text: 'Los donantes corporativos pesan más en la mesa chica que las bases.' },
  { id: 'movement_loses_air', text: 'El movimiento perdió mística — funciona como aparato, ya no como causa.' },
  { id: 'ideology_diluted', text: 'La identidad del partido se diluyó en el último viraje. Los cuadros dudan.' },
  { id: 'ideology_consolidated', text: 'La línea quedó clara. Nadie discute hacia dónde va.' },
  { id: 'coalition_pays', text: 'La coalición tejida arriba se sostiene también en territorio.' },
  { id: 'coalition_burns', text: 'El aliado de ayer hoy disputa la marca con su propio nombre.' },
  { id: 'scandal_lingers', text: 'El último escándalo todavía pesa: los medios lo retoman cada vez que pueden.' },
  { id: 'machine_consolidated', text: 'La maquinaria territorial ya es independiente de la dirigencia central.' },
];

/* ---- Reglas de legado ----------------------------------------------------- */

export interface LegacyLabelRule {
  readonly archetype: LegacyArchetype;
  readonly label: string;
  readonly description: string;
  readonly priority: number;
}

export const PARTY_LEGACY_LABELS: readonly LegacyLabelRule[] = [
  {
    archetype: 'electoral_dominance',
    label: 'Dominio electoral',
    description: 'Tres elecciones consecutivas ganadas. El partido define la agenda nacional.',
    priority: 12,
  },
  {
    archetype: 'historic_movement',
    label: 'Movimiento histórico',
    description: 'Misticismo de movimiento alto y crecimiento territorial. Tu nombre quedó.',
    priority: 11,
  },
  {
    archetype: 'pure_ideological',
    label: 'Partido ideológico puro',
    description: 'Identidad intacta, polarizante. Nunca cediste, nunca alcanzaste el techo.',
    priority: 10,
  },
  {
    archetype: 'national_coalition',
    label: 'Coalición nacional',
    description: 'Sumaste fuerzas heterogéneas y ganaste. El partido es un mosaico.',
    priority: 10,
  },
  {
    archetype: 'territorial_machine',
    label: 'Máquina territorial',
    description: 'Fuerza concentrada en regiones específicas. Dominante donde estás.',
    priority: 9,
  },
  {
    archetype: 'democratic_revolution',
    label: 'Revolución democrática',
    description: 'Crecimiento explosivo, marca limpia, base movilizada.',
    priority: 9,
  },
  {
    archetype: 'eternal_party',
    label: 'Partido eterno',
    description: 'Sobreviviste a todas las internas y derrotas. Maquinaria perpetua.',
    priority: 8,
  },
  {
    archetype: 'presidential_party',
    label: 'Partido presidencial',
    description: 'Ganaste la nacional. El sello del palacio te quedó pegado.',
    priority: 8,
  },
  {
    archetype: 'regional_dominant',
    label: 'Partido regional dominante',
    description: 'Hegemonía en pocas regiones; nunca rompiste a nivel nacional.',
    priority: 7,
  },
  {
    archetype: 'system_breaker',
    label: 'Quiebra-sistemas',
    description: 'Polarización alta, escándalos, ruptura interna. El sistema no es lo que era.',
    priority: 6,
  },
  {
    archetype: 'forgotten',
    label: 'Partido olvidado',
    description: 'Tres ciclos sin huella. Otra sigla más en la lista.',
    priority: 1,
  },
];
