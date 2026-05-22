/* =============================================================================
   LIB — Tema
   El sistema de tokens vive en CSS (styles/tokens.css): cada paleta y cada par
   tipográfico es un bloque `[data-theme]` / `[data-fonts]`. Aquí solo está la
   metadata para la UI de ajustes y la función que aplica el tema al documento.
   La fuente de verdad de los colores es el CSS — no se duplican aquí.
   ============================================================================= */

import type { FontPairId, PaletteId, ThemeConfig } from '@/state/types';

export interface PaletteMeta {
  id: PaletteId;
  label: string;
  /** Acento por defecto de la paleta, usado al cambiar de tema. */
  defaultAccent: string;
}

export const PALETTES: readonly PaletteMeta[] = [
  { id: 'warroom', label: 'War Room', defaultAccent: '#C9A961' },
  { id: 'cinematic', label: 'Geopolitical', defaultAccent: '#E8B86D' },
  { id: 'brutalist', label: 'Brutalist Paper', defaultAccent: '#A8321F' },
  { id: 'ember', label: 'Ember', defaultAccent: '#D97757' },
];

export interface FontPairMeta {
  id: FontPairId;
  label: string;
}

export const FONT_PAIRS: readonly FontPairMeta[] = [
  { id: 'institutional', label: 'Institutional' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'brutalmono', label: 'Brutalist Mono' },
];

/** Paleta de acentos disponibles en el panel de ajustes. */
export const ACCENT_SWATCHES: readonly string[] = [
  '#C9A961',
  '#E8B86D',
  '#D97757',
  '#5B8FB9',
  '#5E9B7E',
  '#A8321F',
  '#E6B948',
];

export const DEFAULT_THEME: ThemeConfig = {
  palette: 'warroom',
  fontPair: 'institutional',
  density: 9,
  accent: '#C9A961',
  showGrid: true,
  showTicker: true,
  breathe: true,
  cinematicCuts: true,
};

/**
 * Aplica el tema al documento. La paleta y la tipografía se conmutan vía
 * atributos `data-*` (los valores los resuelve el CSS). El acento y las
 * variables derivadas de densidad sí se escriben como propiedades inline,
 * porque son continuas y no caben en clases predefinidas.
 */
export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;
  root.dataset.theme = theme.palette;
  root.dataset.fonts = theme.fontPair;
  root.style.setProperty('--accent', theme.accent);

  const d = theme.density;
  root.style.setProperty('--pad-panel', `${Math.max(8, 18 - d)}px`);
  root.style.setProperty('--gap-grid', `${Math.max(6, 16 - d)}px`);
  root.style.setProperty('--font-base', `${Math.max(11, 15 - Math.floor(d / 3))}px`);
  root.style.setProperty('--row-h', `${Math.max(22, 32 - d)}px`);
}
