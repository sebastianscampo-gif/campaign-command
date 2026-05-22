/* =============================================================================
   CONTENT — Tipos de la capa de contenido (datos inmutables)
   El contenido define la identidad fija del mundo de juego: geografía, partidos
   y la identidad del candidato. Nunca cambia en runtime.
   ============================================================================= */

export type PartyId = 'PRD' | 'MNP' | 'FAS' | 'VC' | 'IND';

export type RegionId = 'Norte' | 'Oeste' | 'Centro' | 'Este' | 'Sur';

export type ProvinceId =
  | 'NF' | 'SA' | 'CA' | 'LO' | 'VC' | 'CE'
  | 'CR' | 'RG' | 'BR' | 'PS' | 'SS' | 'TA';

export type Vec2 = readonly [number, number];

/* ---- Partidos --------------------------------------------------------------- */

export interface Party {
  readonly id: PartyId;
  readonly name: string;
  readonly short: string;
  readonly ideology: string;
  readonly color: string;
  readonly leader: string;
  readonly founded: number | null;
}

/* ---- Geografía -------------------------------------------------------------- */

export interface ProvinceGeo {
  readonly id: ProvinceId;
  readonly name: string;
  readonly capital: string;
  readonly region: RegionId;
  /** Población en millones de habitantes. */
  readonly population: number;
  readonly isCapital: boolean;
  readonly blurb: string;
  /** Cadena de puntos SVG lista para <polygon points>. */
  readonly polygon: string;
  /** Coordenada de anclaje de la etiqueta dentro del viewBox del mapa. */
  readonly labelAt: Vec2;
}

/* ---- Candidato (identidad) -------------------------------------------------- */

export interface Ideology {
  /** Eje económico: -1 estatista … +1 mercado. */
  readonly economic: number;
  /** Eje social: -1 progresista … +1 conservador. */
  readonly social: number;
  /** Eje de autoridad: -1 libertario … +1 autoritario. */
  readonly authority: number;
}

export interface TimelineEntry {
  readonly year: number;
  readonly label: string;
}

export interface Scandal {
  readonly year: number;
  readonly severity: string;
  readonly label: string;
}

export interface Candidate {
  readonly name: string;
  readonly party: PartyId;
  readonly age: number;
  readonly background: string;
  readonly traits: readonly string[];
  readonly ideology: Ideology;
  readonly timeline: readonly TimelineEntry[];
  readonly scandals: readonly Scandal[];
}

/* ---- País ------------------------------------------------------------------- */

export interface Country {
  readonly name: string;
  readonly short: string;
  readonly capital: string;
  readonly currency: string;
  /** Población nacional en millones. */
  readonly population: number;
  /** PIB en miles de millones. */
  readonly gdp: number;
  readonly cycle: string;
  readonly date: string;
}
