/* =============================================================================
   CONTENT — Geografía de la República de San Esteban
   12 provincias dibujadas sobre un sistema de vértices compartidos. Los vértices
   garantizan que las fronteras encajen sin huecos: cada arista interna usa
   exactamente los mismos dos puntos en las dos provincias que la comparten.
   ============================================================================= */

import type { ProvinceGeo, ProvinceId, Vec2 } from './types';

/** viewBox del lienzo del mapa. Todas las coordenadas viven en este espacio. */
export const MAP_VIEWBOX = '0 0 1000 720';

/** 20 vértices compartidos. 14 en el borde exterior, 6 uniones internas. */
export const VERTICES = {
  // Borde exterior, sentido horario desde el noroeste.
  A: [260, 75],
  A1: [380, 68],
  B1: [620, 72],
  D: [790, 95],
  E: [855, 225],
  F: [870, 360],
  G: [840, 540],
  H: [720, 640],
  Jx: [590, 667],
  Jp: [390, 665],
  K: [270, 640],
  M: [160, 540],
  N: [150, 360],
  O: [200, 225],
  // Uniones internas.
  P1: [380, 225],
  Q1: [620, 225],
  P2: [380, 360],
  Q2: [620, 360],
  P3: [390, 540],
  Q3: [600, 540],
} as const satisfies Record<string, Vec2>;

type VertexKey = keyof typeof VERTICES;

/** Construye una cadena de puntos SVG a partir de claves de vértice. */
const poly = (...keys: readonly VertexKey[]): string =>
  keys.map((k) => VERTICES[k].join(',')).join(' ');

export const PROVINCES: readonly ProvinceGeo[] = [
  {
    id: 'NF',
    name: 'Norte Fronterizo',
    capital: 'Puerto Mirage',
    region: 'Norte',
    population: 1.8,
    isCapital: false,
    blurb:
      'Provincia rural, fronteriza, históricamente conservadora. Economía agroganadera y de paso fronterizo.',
    polygon: poly('A', 'A1', 'P1', 'O'),
    labelAt: [285, 150],
  },
  {
    id: 'SA',
    name: 'Sierra Andina',
    capital: 'Alto Verde',
    region: 'Norte',
    population: 2.4,
    isCapital: false,
    blurb:
      'Cordillera minera. Provincia bisagra, decide elecciones presidenciales.',
    polygon: poly('A1', 'B1', 'Q1', 'P1'),
    labelAt: [500, 150],
  },
  {
    id: 'CA',
    name: 'Costa Atlántica',
    capital: 'Bahía Real',
    region: 'Norte',
    population: 3.6,
    isCapital: false,
    blurb: 'Costa turística e industrial. Voto urbano joven, progresista.',
    polygon: poly('B1', 'D', 'E', 'Q1'),
    labelAt: [730, 160],
  },
  {
    id: 'LO',
    name: 'Llanos Occidentales',
    capital: 'San Tarcisio',
    region: 'Oeste',
    population: 1.4,
    isCapital: false,
    blurb:
      'Llanos agrícolas. Crisis hídrica desde 2024. Voto rural conservador, descontento.',
    polygon: poly('O', 'P1', 'P2', 'N'),
    labelAt: [275, 295],
  },
  {
    id: 'VC',
    name: 'Valle Central',
    capital: 'Ciudad Aurora',
    region: 'Centro',
    population: 6.8,
    isCapital: true,
    blurb:
      'Corazón económico y político. Contiene la capital, Ciudad Aurora. 28% del electorado.',
    polygon: poly('P1', 'Q1', 'Q2', 'P2'),
    labelAt: [500, 295],
  },
  {
    id: 'CE',
    name: 'Costa del Ébano',
    capital: 'Puerto Ébano',
    region: 'Este',
    population: 2.1,
    isCapital: false,
    blurb:
      'Hub portuario. Sindicatos fuertes, voto histórico de centro-izquierda.',
    polygon: poly('Q1', 'E', 'F', 'Q2'),
    labelAt: [745, 295],
  },
  {
    id: 'CR',
    name: 'Cordillera Real',
    capital: 'Quillota',
    region: 'Sur',
    population: 1.1,
    isCapital: false,
    blurb:
      'Comunidades indígenas. Tensión territorial con minería. Crece el Frente Andino Soberano.',
    polygon: poly('N', 'P2', 'P3', 'M'),
    labelAt: [275, 460],
  },
  {
    id: 'RG',
    name: 'Río Grande',
    capital: 'San Lucas',
    region: 'Sur',
    population: 2.6,
    isCapital: false,
    blurb:
      'Delta fluvial. Inundaciones recurrentes. Bastión histórico del MNP, hoy disputado.',
    polygon: poly('P2', 'Q2', 'Q3', 'P3'),
    labelAt: [500, 460],
  },
  {
    id: 'BR',
    name: 'Bahía Real',
    capital: 'Marbella',
    region: 'Este',
    population: 1.9,
    isCapital: false,
    blurb: 'Bahía pesquera. Conflicto con concesiones de gas offshore.',
    polygon: poly('Q2', 'F', 'G', 'Q3'),
    labelAt: [735, 460],
  },
  {
    id: 'PS',
    name: 'Pampa Sur',
    capital: 'Belisario',
    region: 'Sur',
    population: 0.9,
    isCapital: false,
    blurb:
      'Estancias ganaderas. Tradicionalmente MNP. Baja densidad poblacional.',
    polygon: poly('M', 'P3', 'Jp', 'K'),
    labelAt: [325, 605],
  },
  {
    id: 'SS',
    name: 'Selva del Sur',
    capital: 'La Concepción',
    region: 'Sur',
    population: 0.6,
    isCapital: false,
    blurb:
      'Selva amazónica protegida. Conflicto socio-ambiental. Movimientos comunitarios crecientes.',
    polygon: poly('P3', 'Q3', 'Jx', 'Jp'),
    labelAt: [495, 605],
  },
  {
    id: 'TA',
    name: 'Tierra Austral',
    capital: 'Fuerte Hernández',
    region: 'Sur',
    population: 0.7,
    isCapital: false,
    blurb:
      'Frontera austral. Bases militares, hidrocarburos, identidad patriótica fuerte.',
    polygon: poly('Q3', 'G', 'H', 'Jx'),
    labelAt: [705, 605],
  },
];

export const PROVINCE_BY_ID: Readonly<Record<ProvinceId, ProvinceGeo>> =
  Object.fromEntries(PROVINCES.map((p) => [p.id, p])) as Record<
    ProvinceId,
    ProvinceGeo
  >;

export const PROVINCE_IDS: readonly ProvinceId[] = PROVINCES.map((p) => p.id);
