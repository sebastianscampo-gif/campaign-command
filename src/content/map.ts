/* =============================================================================
   CONTENT — Geografía decorativa del mapa
   Datos de adorno que el war room usa para pintar ciudades, rallies y rutas
   sobre las provincias. No son provincias en sí — son superposiciones.
   ============================================================================= */

import type { ProvinceId, Vec2 } from './types';

/** Ciudades visibles a partir del nivel de zoom medio. */
export interface City {
  readonly position: Vec2;
  readonly name: string;
  readonly population: string;
}

export const CITIES: readonly City[] = [
  { position: [285, 150], name: 'PUERTO MIRAGE', population: '0.6M' },
  { position: [500, 150], name: 'ALTO VERDE', population: '0.9M' },
  { position: [730, 160], name: 'BAHÍA REAL', population: '1.4M' },
  { position: [275, 295], name: 'SAN TARCISIO', population: '0.5M' },
  { position: [730, 360], name: 'LITORAL SUR', population: '0.8M' },
  { position: [285, 540], name: 'VEGA AZUL', population: '0.4M' },
  { position: [725, 540], name: 'SANTA CRUZ', population: '0.9M' },
  { position: [390, 665], name: 'TIERRA NEGRA', population: '0.3M' },
];

/** Marcadores de rally activos / recientes sobre el mapa. */
export interface RallyMarker {
  readonly position: Vec2;
  readonly label: string;
  readonly when: string;
  readonly big: boolean;
}

export const RALLIES: readonly RallyMarker[] = [
  { position: [730, 160], label: 'BAHÍA REAL', when: 'HOY · 20h', big: true },
  { position: [285, 150], label: 'PUERTO MIRAGE', when: 'AYER · 19h', big: false },
  { position: [500, 295], label: 'CIUDAD AURORA', when: 'D-2', big: false },
];

/** Centros desde los que se irradian los pulsos del overlay "media". */
export const MEDIA_HUBS: readonly Vec2[] = [
  [500, 295],
  [730, 160],
  [725, 540],
];

/** Itinerario reciente del candidato — se dibuja como polilínea con marcha. */
export const TOUR_PROVINCES: readonly ProvinceId[] = ['VC', 'CA', 'VC', 'SA', 'VC', 'LO', 'VC'];
