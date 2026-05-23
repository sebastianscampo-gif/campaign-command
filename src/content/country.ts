/* =============================================================================
   CONTENT — País
   Hechos fijos del país donde transcurre la campaña. Inmutable.
   ============================================================================= */

import type { Country } from './types';

export const COUNTRY: Country = {
  name: 'República de San Esteban',
  short: 'San Esteban',
  capital: 'Ciudad Aurora',
  currency: 'PSE',
  population: 26.9,
  gdp: 412.8,
  cycle: 'Elecciones Generales 2026',
  date: '14 · Septiembre · 2026',
};

/** Padrón electoral nacional, en millones. */
export const ELECTORATE_MILLIONS = 19.4;

/** Padrón electoral como porcentaje de la población. */
export const ELECTORATE_RATIO = 0.721;

/** Turnout histórico de la última elección general (referencia). */
export const HISTORICAL_TURNOUT = {
  year: 2022,
  pct: 64.1,
} as const;

/** Duración total del ciclo de campaña, en días. */
export const CAMPAIGN_TOTAL_DAYS = 92;

/** Día de la campaña en el que arranca el escenario base. */
export const SCENARIO_START_DAY = 64;

/** Fecha de la elección general, para mostrar en HUDs. */
export const ELECTION_DATE = '14·OCT·2026';
