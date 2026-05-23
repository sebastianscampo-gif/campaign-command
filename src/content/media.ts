/* =============================================================================
   CONTENT — Ecosistema mediático
   Posts del feed, tendencias, podcasts, prensa escrita, influencers y clips
   cortos. Contenido editorial — sirve como datos seed hasta que exista un
   simulador de medios.
   ============================================================================= */

export type MediaTab = 'stream' | 'press' | 'podcasts' | 'live';

export type Stance = 'friendly' | 'neutral' | 'hostile';

export type PressTone = 'pos' | 'neg' | 'warn';

export const STANCE_LABEL: Record<Stance, string> = {
  friendly: 'ALIADO',
  neutral: 'NEUTRAL',
  hostile: 'HOSTIL',
};

/* ---- Feed PULSE ------------------------------------------------------------ */

export interface MediaPost {
  readonly user: string;
  readonly handle: string;
  readonly color: string;
  readonly time: string;
  readonly text: string;
  readonly repost: string;
  readonly react: string;
  readonly views: string;
  readonly verified?: boolean;
}

export const MEDIA_POSTS: readonly MediaPost[] = [
  {
    user: 'Aurora Network',
    handle: '@aurora_news',
    color: '#5B8FB9',
    time: '2m',
    text: 'Vasconcelos lidera en proyecciones tempranas en Costa Atlántica con +11pt sobre Orellana.',
    repost: '1.8k',
    react: '4.2k',
    views: '214k',
    verified: true,
  },
  {
    user: 'Sara Orellana',
    handle: '@_orellana_2026',
    color: '#C24A4A',
    time: '6m',
    text: 'No vamos a ceder el norte. La verdadera campaña empieza ahora — y termina el 14 con nosotros adentro.',
    repost: '5.4k',
    react: '9.8k',
    views: '412k',
    verified: true,
  },
  {
    user: 'Minuto Político',
    handle: '@minutopolitico',
    color: '#C9A961',
    time: '12m',
    text: 'Hilo · por qué el debate de anoche cambió el ciclo. Vasconcelos llegó preparada y nadie en MNP lo vio venir.',
    repost: '2.1k',
    react: '12.4k',
    views: '88k',
  },
  {
    user: 'Frente Amplio Social',
    handle: '@frente_amplio',
    color: '#5E9B7E',
    time: '18m',
    text: 'Salimos al territorio. Hoy 8pm — Plaza Mayor. Llevá agua, paciencia y a tu vecino.',
    repost: '880',
    react: '2.1k',
    views: '34k',
  },
  {
    user: 'Ricardo Vega · Op.',
    handle: '@vegaopinion',
    color: '#8C95A0',
    time: '24m',
    text: 'Mi predicción: segunda vuelta, con margen de ±0.6 pt entre PRD y MNP. Salinas decide.',
    repost: '410',
    react: '1.2k',
    views: '22k',
  },
  {
    user: 'Voto Joven',
    handle: '@votojoven',
    color: '#E6B948',
    time: '28m',
    text: 'Censo de mesas: turnout joven (18-29) va por encima del 51%. Récord absoluto del ciclo.',
    repost: '1.4k',
    react: '3.6k',
    views: '62k',
  },
];

/* ---- Tendencias ------------------------------------------------------------ */

export interface MediaTrend {
  readonly tag: string;
  readonly volume: string;
  readonly spark: readonly number[];
}

export const MEDIA_TRENDS: readonly MediaTrend[] = [
  { tag: '#Vasconcelos2026', volume: '214k', spark: [6, 8, 10, 14, 18, 22, 26, 30, 32, 36, 38, 42] },
  { tag: '#DebateNacional', volume: '98k', spark: [24, 20, 28, 30, 28, 26, 24, 22, 18, 16, 14, 12] },
  { tag: '#Orellana', volume: '72k', spark: [12, 14, 18, 22, 18, 16, 18, 20, 18, 16, 14, 18] },
  { tag: '#FrenteAntiCrisis', volume: '41k', spark: [4, 6, 8, 9, 10, 12, 14, 16, 16, 18, 20, 22] },
  { tag: '#Bahía2026', volume: '33k', spark: [8, 10, 12, 14, 16, 18, 16, 14, 12, 12, 14, 16] },
  { tag: '#SequíaLlanos', volume: '18k', spark: [10, 12, 14, 12, 10, 14, 18, 22, 24, 20, 18, 16] },
];

/* ---- Podcasts -------------------------------------------------------------- */

export interface Podcast {
  readonly title: string;
  readonly sub: string;
  readonly stance: Stance;
  readonly episode: string;
  readonly audience: string;
}

export const PODCASTS: readonly Podcast[] = [
  { title: 'Contrapeso', sub: 'Aurora · Política · Diario', stance: 'neutral', episode: 'EP 412 · 1h 14m', audience: '88k' },
  { title: 'Ruido de Fondo', sub: 'Análisis · Económico', stance: 'friendly', episode: 'EP 084 · 52m', audience: '34k' },
  { title: 'Caja Negra', sub: 'Investigación · Semanal', stance: 'hostile', episode: 'EP 198 · 1h 38m', audience: '124k' },
  { title: 'Mesa Servida', sub: 'Opinión · Cultural', stance: 'neutral', episode: 'EP 011 · 44m', audience: '18k' },
  { title: 'El Operador', sub: 'Backstage · Campañas', stance: 'friendly', episode: 'EP 056 · 1h 02m', audience: '42k' },
  { title: 'Plaza Pública', sub: 'Calle · Voz ciudadana', stance: 'hostile', episode: 'EP 220 · 38m', audience: '68k' },
];

/* ---- Press releases (right rail) ------------------------------------------ */

export interface PressRelease {
  readonly src: string;
  readonly headline: string;
  readonly tone: PressTone;
  readonly time: string;
}

export const PRESS_RELEASES: readonly PressRelease[] = [
  { src: 'EL ESTANDARTE', headline: 'PRD consolida la delantera en debate televisado', tone: 'pos', time: '14:24' },
  { src: 'AURORA TIMES', headline: 'Orellana convoca a frente antiprogresista', tone: 'neg', time: '13:48' },
  { src: 'LA VOZ AUSTRAL', headline: 'Sequía en Llanos: candidatos evitan compromiso', tone: 'warn', time: '12:11' },
  { src: 'DIARIO DEL PUERTO', headline: 'Bahía Real bate récord histórico de asistencia', tone: 'pos', time: '10:32' },
];

/* ---- Press articles (página completa) ------------------------------------- */

export interface PressArticle {
  readonly src: string;
  readonly date: string;
  readonly headline: string;
  readonly summary: string;
  readonly tone: PressTone;
}

export const PRESS_ARTICLES: readonly PressArticle[] = [
  {
    src: 'EL ESTANDARTE',
    date: '12·OCT·2026',
    headline: 'PRD consolida la delantera tras el debate televisado',
    summary:
      'La candidata mostró dominio del temario económico y rural. Encuestas internas la dan al frente por +2.4 pt.',
    tone: 'pos',
  },
  {
    src: 'AURORA TIMES',
    date: '12·OCT·2026',
    headline: 'Orellana convoca a un frente antiprogresista',
    summary: 'El candidato de MNP intenta unificar el voto opositor a 28 días de las generales.',
    tone: 'neg',
  },
  {
    src: 'LA VOZ AUSTRAL',
    date: '11·OCT·2026',
    headline: 'Sequía en Llanos: candidatos sin propuestas concretas',
    summary: 'Las cuatro fuerzas principales evitan comprometerse con la mesa de crisis hídrica del oeste.',
    tone: 'warn',
  },
];

/* ---- Influencers ----------------------------------------------------------- */

export interface Influencer {
  readonly handle: string;
  readonly reach: string;
  readonly stance: Stance;
}

export const INFLUENCERS: readonly Influencer[] = [
  { handle: '@aurora_news', reach: '2.1M', stance: 'friendly' },
  { handle: '@minutopolitico', reach: '1.4M', stance: 'neutral' },
  { handle: '@vegaopinion', reach: '820k', stance: 'hostile' },
  { handle: '@frente_amplio', reach: '412k', stance: 'friendly' },
  { handle: '@votojoven', reach: '380k', stance: 'friendly' },
];

/* ---- Frames (clips cortos) ------------------------------------------------- */

export interface MediaFrame {
  readonly handle: string;
  readonly views: string;
  readonly text: string;
}

export const MEDIA_FRAMES: readonly MediaFrame[] = [
  { handle: '@auroranews', views: '214k', text: 'Highlights del debate' },
  { handle: '@voto_joven', views: '88k', text: 'POV: votando con 19' },
  { handle: '@calle_ahora', views: '62k', text: 'Llegada a Plaza Mayor' },
  { handle: '@minuto_politico', views: '52k', text: '¿Qué dijo Orellana?' },
  { handle: '@frente_amplio', views: '41k', text: 'Voluntarios día 64' },
  { handle: '@_vegaopinion', views: '33k', text: '3 razones para segunda vuelta' },
  { handle: '@costa_atl', views: '28k', text: 'Bahía Real concentra' },
  { handle: '@check_politico', views: '22k', text: 'Fact-check · datos PRD' },
];

/* ---- Live TV --------------------------------------------------------------- */

export const TV_CHANNELS: readonly string[] = [
  'CHANNEL 04 · AURORA NETWORK',
  'CHANNEL 11 · PRENSA NACIONAL',
  'CHANNEL 22 · LA VOZ AUSTRAL',
  'TV PÚBLICA',
];

/** Borrador de "anuncio oficial" que el jugador estaría redactando. */
export const COMPOSE_DRAFT = {
  meta: 'Borrador · 22:14',
  body: 'Gracias por estar con nosotros esta noche. Lo que está pasando en San Esteban no es la victoria de un partido — es una promesa que volvió a su lugar.',
  hold: '[insertar dato CA]',
} as const;
