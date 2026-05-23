/* =============================================================================
   CAREER · CONTENT — Plantillas narrativas
   Frases que el motor compone con datos del estado: titulares, etiquetas y
   resúmenes de fin de ciclo. Texto curado — sin IA aún.

   Cada plantilla usa `{tokens}` que `renderTemplate()` reemplaza con valores
   de un dictionary plano.
   ============================================================================= */

export interface NarrativeTemplate {
  readonly id: string;
  /** Plantilla con `{tokens}`. */
  readonly text: string;
}

/** Titulares post-elección (resultados). */
export const ELECTION_OUTCOME_TEMPLATES: readonly NarrativeTemplate[] = [
  { id: 'won_local', text: '{name} se consagra en {region}: {score}% contra {opponent}.' },
  { id: 'won_regional', text: '{name} gana la gobernación con {score}%. La región le abre paso a la nacional.' },
  { id: 'won_presidential', text: '{name}, electo presidente. Margen final: {score}%.' },
  { id: 'lost_close', text: '{name} pierde por margen estrecho ({score}% vs {opponentScore}%). El sistema le hace lugar igual.' },
  { id: 'lost_landslide', text: '{name} pierde por amplio margen. Habrá que reconstruir la narrativa.' },
];

/** Resúmenes de ciclo cuando el jugador hace un viraje fuerte. */
export const CAREER_NARRATIVE_TEMPLATES: readonly NarrativeTemplate[] = [
  { id: 'rising_promise', text: 'Tu imagen pasó de promesa local a figura nacional emergente.' },
  { id: 'broken_promise_recall', text: 'La región {region} aún recuerda tu ausencia durante la crisis.' },
  { id: 'former_ally_now_rival', text: 'Tu antiguo aliado {npc} ahora lidera una facción opositora dentro del partido.' },
  { id: 'media_label', text: 'Los medios te llaman {label}.' },
  { id: 'movement_growth_distrust', text: 'Tu movimiento creció rápido, pero los donantes tradicionales desconfían.' },
  { id: 'lost_but_famous', text: 'Perdiste {office_at_stake}, pero ganaste fama nacional tras el debate.' },
  { id: 'kept_promise_pays_off', text: 'Cumplir el compromiso en {region} consolidó tu base ahí.' },
  { id: 'broken_promise_haunts', text: 'La promesa rota en {region} sigue siendo bandera de tus opositores.' },
  { id: 'alliance_won_election', text: 'La alianza con {npc} fue decisiva para esta elección.' },
  { id: 'lost_to_own_party', text: 'Perdiste contra el aparato. Te queda fundar lo tuyo o aceptar el rol.' },
];

/** Etiquetas de legado disponibles con sus reglas de match. */
export interface LegacyLabelRule {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  /** Predicado simple sobre stats — el sistema de legado las evalúa y elige la más específica que matcheé. */
  readonly priority: number;
}

export const LEGACY_LABELS: readonly LegacyLabelRule[] = [
  { id: 'reformist_hero', label: 'Reformista histórico', description: 'Cambio responsable con resultados.', priority: 10 },
  { id: 'populist_dominant', label: 'Populista dominante', description: 'Movilización masiva y polarización ganadora.', priority: 10 },
  { id: 'promise_destroyed', label: 'Promesa destruida por escándalos', description: 'Carisma alto, escándalos pesados.', priority: 9 },
  { id: 'one_region_president', label: 'Presidente de una sola región', description: 'Ganaste arriba sin construir abajo.', priority: 8 },
  { id: 'polarizing_leader', label: 'Líder nacional polarizante', description: 'Mitad país adora, mitad odia.', priority: 8 },
  { id: 'technocrat_unloved', label: 'Tecnócrata exitoso pero impopular', description: 'Buenos números, ninguna calle.', priority: 7 },
  { id: 'regional_to_national', label: 'Caudillo regional reconvertido', description: 'De barón territorial a figura nacional.', priority: 7 },
  { id: 'outsider_breaker', label: 'Outsider que rompió el sistema', description: 'Sin estructura, con calle.', priority: 7 },
  { id: 'never_arrived', label: 'Político brillante que nunca llegó al poder', description: 'Talento, sin acceso.', priority: 5 },
  { id: 'survivor', label: 'El Sobreviviente', description: 'Aguantó escándalos, traiciones, derrotas — y siguió.', priority: 4 },
  { id: 'forgotten', label: 'Cuadro olvidado', description: 'Una carrera sin huella.', priority: 1 },
];
