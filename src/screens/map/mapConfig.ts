/* =============================================================================
   MAP — Configuración del war room
   Overlays (capas de datos coropléticas), capas decorativas, acciones y la
   función de color por provincia.

   Nota sobre color: la paleta de visualización (VIZ) es deliberadamente
   independiente del tema. Un mapa coroplético debe leer rojo=crisis /
   verde=momentum igual en cualquier paleta — si cambiara con el tema, el dato
   mentiría. Por eso NO usa los tokens de tema.
   ============================================================================= */

import { PARTIES } from '@/content';
import type { PartyId, ProvinceGeo } from '@/content';
import type { ProvinceState } from '@/state/types';

/* ---- Overlays -------------------------------------------------------------- */

export type OverlayId =
  | 'intent'
  | 'momentum'
  | 'issues'
  | 'turnout'
  | 'polar'
  | 'crisis'
  | 'econ'
  | 'approval'
  | 'media'
  | 'infra'
  | 'demo'
  | 'ideol';

export type OverlayCategory = 'A' | 'B' | 'C' | 'D';

export interface Overlay {
  id: OverlayId;
  label: string;
  icon: string;
  cat: OverlayCategory;
}

export const OVERLAYS: readonly Overlay[] = [
  { id: 'intent', label: 'Intención de Voto', icon: '◐', cat: 'A' },
  { id: 'momentum', label: 'Momentum', icon: '▲', cat: 'A' },
  { id: 'issues', label: 'Issue Dominante', icon: '◆', cat: 'A' },
  { id: 'turnout', label: 'Turnout Estimado', icon: '◯', cat: 'B' },
  { id: 'polar', label: 'Polarización', icon: '⌖', cat: 'B' },
  { id: 'crisis', label: 'Crisis & Tensión', icon: '△', cat: 'B' },
  { id: 'econ', label: 'Indicador Económico', icon: '$', cat: 'C' },
  { id: 'approval', label: 'Aprobación Personal', icon: '✓', cat: 'C' },
  { id: 'media', label: 'Influencia Mediática', icon: '◉', cat: 'C' },
  { id: 'infra', label: 'Infraestructura', icon: '⊞', cat: 'D' },
  { id: 'demo', label: 'Bloques Demográficos', icon: '✦', cat: 'D' },
  { id: 'ideol', label: 'Distribución Ideológica', icon: '⇌', cat: 'D' },
];

export const OVERLAY_GROUPS: readonly { cat: OverlayCategory; label: string }[] = [
  { cat: 'A', label: 'POLÍTICA · ELECTORAL' },
  { cat: 'B', label: 'SOCIAL · TENSIÓN' },
  { cat: 'C', label: 'ECONOMÍA · MEDIA' },
  { cat: 'D', label: 'DEMOGRAFÍA · INFRA' },
];

/* ---- Capas decorativas ----------------------------------------------------- */

export type LayerId =
  | 'cities'
  | 'rallies'
  | 'crises'
  | 'paths'
  | 'media'
  | 'infra'
  | 'hydro'
  | 'grid';

export type LayerState = Record<LayerId, boolean>;

export const LAYERS: readonly { id: LayerId; label: string }[] = [
  { id: 'cities', label: 'Ciudades' },
  { id: 'rallies', label: 'Rallies activos' },
  { id: 'crises', label: 'Crisis & alertas' },
  { id: 'paths', label: 'Campaign paths' },
  { id: 'media', label: 'Influencia mediática' },
  { id: 'infra', label: 'Infraestructura' },
  { id: 'hydro', label: 'Hidrografía' },
  { id: 'grid', label: 'Grid coordenado' },
];

export const DEFAULT_LAYERS: LayerState = {
  cities: true,
  rallies: true,
  crises: true,
  paths: true,
  media: false,
  infra: false,
  hydro: false,
  grid: true,
};

/* ---- Paleta de visualización ----------------------------------------------- */

const VIZ = {
  base: '#2A2F38',
  good: '#5E9B7E',
  bad: '#C24A4A',
  warm: '#C9A961',
  cool: '#5B8FB9',
  gold: '#E6B948',
  violet: '#9C7BD9',
} as const;

const ISSUE_COLORS: Record<string, string> = {
  'Seguridad fronteriza': VIZ.bad,
  'Minería y agua': VIZ.good,
  'Turismo y empleo': VIZ.cool,
  'Sequía y agro': VIZ.gold,
  'Costo de vida': VIZ.warm,
  'Puerto y comercio': VIZ.cool,
  'Pueblos originarios': VIZ.good,
  'Inundaciones': VIZ.cool,
  'Pesca y energía': VIZ.warm,
  'Ganadería y exportaciones': VIZ.warm,
  'Deforestación': VIZ.good,
  'Soberanía austral': VIZ.bad,
};

const REGION_COLORS = {
  Norte: VIZ.warm,
  Centro: VIZ.cool,
  Oeste: VIZ.gold,
  Este: VIZ.violet,
  Sur: VIZ.good,
} as const;

/** Interpola dos colores hex. `t` se acota a [0, 1]. */
export function lerpColor(from: string, to: string, t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const channel = (hex: string, i: number): number =>
    parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16);
  const mix = (i: number): string => {
    const value = Math.round(
      channel(from, i) + (channel(to, i) - channel(from, i)) * clamped,
    );
    return value.toString(16).padStart(2, '0');
  };
  return `#${mix(0)}${mix(1)}${mix(2)}`;
}

function leadingParty(intent: ProvinceState['intent']): PartyId {
  const entries = Object.entries(intent) as [PartyId, number][];
  return entries.reduce((top, current) =>
    current[1] > top[1] ? current : top,
  )[0];
}

/** Color de relleno de una provincia según el overlay activo. */
export function provinceColor(
  geo: ProvinceGeo,
  state: ProvinceState,
  overlay: OverlayId,
): string {
  switch (overlay) {
    case 'intent':
      return PARTIES[leadingParty(state.intent)].color;
    case 'momentum': {
      const t = Math.max(-8, Math.min(8, state.momentum));
      return t >= 0
        ? lerpColor(VIZ.base, VIZ.good, t / 8)
        : lerpColor(VIZ.base, VIZ.bad, -t / 8);
    }
    case 'issues':
      return ISSUE_COLORS[state.dominantIssue] ?? VIZ.base;
    case 'turnout':
      return lerpColor(VIZ.base, VIZ.warm, (state.turnout - 45) / 35);
    case 'polar':
      return lerpColor(VIZ.base, VIZ.bad, Math.abs(state.leaning) * 1.6);
    case 'crisis':
      return lerpColor(VIZ.base, VIZ.bad, state.crisis / 8);
    case 'econ':
      return lerpColor(VIZ.base, VIZ.good, (state.gdp - 2) / 8);
    case 'approval':
      return lerpColor(VIZ.base, VIZ.cool, (state.approval - 30) / 30);
    case 'media':
      return lerpColor(VIZ.base, VIZ.violet, (geo.population * state.turnout) / 100 / 1.6);
    case 'infra':
      return lerpColor(VIZ.base, VIZ.cool, (state.gdp / 10 + state.turnout / 100) / 1.7);
    case 'demo':
      return REGION_COLORS[geo.region] ?? VIZ.base;
    case 'ideol':
      return lerpColor(VIZ.cool, VIZ.bad, (state.leaning + 1) / 2);
  }
}

/* ---- Leyenda --------------------------------------------------------------- */

export interface LegendEntry {
  color: string;
  label: string;
}

/** Entradas de leyenda para el overlay activo. */
export function legendFor(overlay: OverlayId): readonly LegendEntry[] {
  switch (overlay) {
    case 'intent':
      return (Object.values(PARTIES) as { short: string; color: string }[]).map((p) => ({
        color: p.color,
        label: p.short,
      }));
    case 'momentum':
      return [
        { color: VIZ.bad, label: 'NEG' },
        { color: VIZ.base, label: '0' },
        { color: VIZ.good, label: 'POS' },
      ];
    case 'crisis':
      return [
        { color: VIZ.base, label: 'BAJO' },
        { color: VIZ.bad, label: 'ALTO' },
      ];
    case 'turnout':
      return [
        { color: VIZ.base, label: '45%' },
        { color: VIZ.warm, label: '80%' },
      ];
    case 'media':
      return [
        { color: VIZ.base, label: 'BAJA' },
        { color: VIZ.violet, label: 'SATURADA' },
      ];
    case 'infra':
      return [
        { color: VIZ.base, label: 'RURAL' },
        { color: VIZ.cool, label: 'METRO' },
      ];
    case 'ideol':
      return [
        { color: VIZ.cool, label: 'PRO-JUGADOR' },
        { color: VIZ.bad, label: 'ADVERSO' },
      ];
    case 'demo':
      return [
        { color: REGION_COLORS.Norte, label: 'NORTE' },
        { color: REGION_COLORS.Centro, label: 'CENTRO' },
        { color: REGION_COLORS.Oeste, label: 'OESTE' },
        { color: REGION_COLORS.Este, label: 'ESTE' },
        { color: REGION_COLORS.Sur, label: 'SUR' },
      ];
    case 'polar':
      return [
        { color: VIZ.base, label: 'NEUTRO' },
        { color: VIZ.bad, label: 'POLARIZADO' },
      ];
    case 'econ':
      return [
        { color: VIZ.base, label: 'DÉBIL' },
        { color: VIZ.good, label: 'FUERTE' },
      ];
    case 'approval':
      return [
        { color: VIZ.base, label: '30%' },
        { color: VIZ.cool, label: '60%' },
      ];
    case 'issues':
      return [];
  }
}
