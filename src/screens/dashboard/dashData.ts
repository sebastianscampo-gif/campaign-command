/* =============================================================================
   DASHBOARD — Datos de presentación
   Contenido que no vive en el game store: mazo de acciones, recomendaciones del
   asesor, tendencias y comentario de TV. Maquetado del prototipo.
   ============================================================================= */

export interface DeckAction {
  icon: string;
  label: string;
  cost: string;
  roi: string;
  desc: string;
  tag?: 'hot' | 'critical';
}

export const ACTION_DECK: readonly DeckAction[] = [
  { icon: '★', label: 'RALLY', cost: '$1.2M · 1d', roi: '+3.2pt', desc: 'Acto masivo · alta visibilidad', tag: 'hot' },
  { icon: '◐', label: 'TV AD', cost: '$0.6M', roi: '+1.8pt', desc: 'Pauta regional 48h' },
  { icon: '◉', label: 'SOCIAL', cost: '$0.2M', roi: '+0.9pt', desc: 'Campaña digital coordinada' },
  { icon: '✎', label: 'DEBATE PREP', cost: '2d', roi: '+2.6pt', desc: '4 simulacros · D-3', tag: 'critical' },
  { icon: '$', label: 'FUNDRAISER', cost: '1d', roi: '+$2.4M', desc: 'Cena alto perfil · 24 donantes' },
  { icon: '◈', label: 'ENDORSEMENT', cost: '—', roi: '+1.4pt', desc: 'Mamani (FAS) · negociación abierta' },
  { icon: '⚔', label: 'OPP ATTACK', cost: '$0.4M', roi: '±2.0pt', desc: 'Riesgo elevado · backlash 18%' },
  { icon: '✦', label: 'SPEECH', cost: '1d', roi: '+2.1pt', desc: 'Anuncio de plataforma educativa' },
];

export interface StrategyRec {
  priority: string;
  title: string;
  explanation: string;
  roi: string;
  roiTone: 'pos' | 'warn' | 'neg';
  tone?: 'critical' | 'warn';
}

export const STRATEGY_RECS: readonly StrategyRec[] = [
  {
    priority: '★★★',
    title: 'Atender la crisis hídrica en Llanos Occidentales',
    explanation:
      'Riesgo de perder 1.4pt nacionales si escala 48h. Un anuncio temprano consolida la narrativa.',
    roi: '+2.1pt',
    roiTone: 'pos',
    tone: 'critical',
  },
  {
    priority: '★★',
    title: 'Pauta televisiva en Valle Central',
    explanation: '28% del padrón. Margen vs MNP en VC: 13pt. Saturación televisiva óptima.',
    roi: '+1.4pt',
    roiTone: 'pos',
  },
  {
    priority: '★★',
    title: 'Preparación de debate · 4 simulacros',
    explanation: 'Issues débiles: seguridad y corrupción. Necesitás respuesta en menos de 45s.',
    roi: 'crítico',
    roiTone: 'warn',
  },
  {
    priority: '⚠',
    title: 'EVITAR: comentar el caso fideicomiso 2021',
    explanation: 'El MNP intentará reactivarlo. Pivotear hacia educación y salud.',
    roi: '−3pt',
    roiTone: 'neg',
    tone: 'warn',
  },
];

export interface Trend {
  rank: string;
  tag: string;
  count: string;
  dir: 'up' | 'down' | 'flat';
}

export const TRENDS: readonly Trend[] = [
  { rank: '01', tag: '#Vasconcelos2026', count: '214k', dir: 'up' },
  { rank: '02', tag: '#DebateNacional', count: '98k', dir: 'up' },
  { rank: '03', tag: '#Orellana', count: '72k', dir: 'flat' },
  { rank: '04', tag: '#FrenteAntiCrisis', count: '41k', dir: 'up' },
  { rank: '05', tag: '#SequíaLlanos', count: '18k', dir: 'down' },
];

export interface Commentary {
  channel: string;
  tone: 'warm' | 'neg' | 'info';
  text: string;
}

export const TV_COMMENTARY: readonly Commentary[] = [
  { channel: 'CH 04', tone: 'warm', text: '"PRD consolida la narrativa de cambio responsable" — Mendizábal' },
  { channel: 'CH 11', tone: 'neg', text: '"Vasconcelos evita responder sobre el fideicomiso" — Vega' },
  { channel: 'CH 22', tone: 'info', text: '"Llanos sigue cortado · gobierno provincial sin acuerdo" — corresponsal' },
];

export interface ExtraVital {
  label: string;
  value: number;
  note: string;
  warn?: boolean;
}

/** Vitales derivados que no forman parte de CandidateImage. */
export const EXTRA_VITALS: readonly ExtraVital[] = [
  { label: 'ENERGY', value: 62, note: 'Próximo descanso D-2' },
  { label: 'TRUST', value: 56, note: 'Estable' },
  { label: 'REPUTATION', value: 71, note: '+4 esta semana' },
];

export interface MomentumFactor {
  label: string;
  value: number;
}

export const MOMENTUM_FACTORS: readonly MomentumFactor[] = [
  { label: 'BASE', value: 12 },
  { label: 'MEDIA', value: 8 },
  { label: 'FUND', value: 5 },
  { label: 'EVENTOS', value: -3 },
  { label: 'RIVALES', value: -2 },
];
