/* =============================================================================
   PARTY · CONTENT — Eventos del partido
   12 eventos narrativos con outcomes estructurados. Cubren: facciones, donantes,
   candidatos, ideología, coaliciones, escándalos.
   ============================================================================= */

import type { FactionKind, PartyEvent, PartyState } from '../types';

/* ---- Helpers de precondición ---------------------------------------------- */

/** El evento solo es elegible si esa facción está activa en el partido. */
const requiresFaction = (kind: FactionKind) => (state: PartyState): boolean =>
  Boolean(state.factions[kind]);

/** Hay al menos un candidato con riesgo de escándalo elevado. */
const hasRiskyCandidate = (state: PartyState): boolean =>
  Object.values(state.candidatePool).some((c) => c.scandalRisk >= 40);

/** Hay al menos un candidato avalado y ambicioso (apto para amenazar). */
const hasAmbitiousStar = (state: PartyState): boolean =>
  Object.values(state.candidatePool).some(
    (c) => c.endorsed && c.ambition >= 65 && c.popularity >= 55,
  );

export const PARTY_EVENTS: readonly PartyEvent[] = [
  {
    id: 'old_guard_demands_endorsements',
    title: 'La Vieja Guardia exige avales',
    classification: 'PRESIÓN INTERNA',
    description:
      'Ortúzar y los cuadros históricos te visitan. "Llevamos décadas armando esto. Si no hay listas con nuestra gente, vas a tener que explicarle a las bases por qué los descartaste."',
    trigger: 'cycle_start',
    factionId: 'old_guard',
    condition: requiresFaction('old_guard'),
    oneShot: true,
    options: [
      {
        id: 'concede',
        label: 'Ceder — más avales para la vieja guardia',
        cost: 'Frescura percibida',
        effect: 'Vieja guardia leal, juventudes molestas.',
        outcomes: [
          { kind: 'faction', factionId: 'old_guard', loyaltyDelta: 18, powerDelta: 8, ruptureRiskDelta: -10 },
          { kind: 'faction', factionId: 'youth', loyaltyDelta: -12, ruptureRiskDelta: 8 },
          { kind: 'brand', field: 'modernity', delta: -8 },
          { kind: 'brand', field: 'professionalism', delta: 4 },
          { kind: 'memory', type: 'faction_demand_accepted', description: 'Cediste avales a la Vieja Guardia.', impact: 4, severity: 'medium', factionId: 'old_guard' },
        ],
      },
      {
        id: 'split_quotas',
        label: 'Repartir cuotas — mitad y mitad',
        cost: 'Costo menor para ambos lados',
        effect: 'Nadie completamente feliz, nadie roto.',
        outcomes: [
          { kind: 'faction', factionId: 'old_guard', loyaltyDelta: 4 },
          { kind: 'faction', factionId: 'youth', loyaltyDelta: 4 },
          { kind: 'brand', field: 'internalOrder', delta: 6 },
          { kind: 'brand', field: 'ideologicalClarity', delta: -4 },
        ],
      },
      {
        id: 'refuse',
        label: 'Rechazar — la dirigencia decide sola',
        cost: 'Cisma con cuadros históricos',
        effect: 'Imagen de modernización; riesgo de ruptura.',
        outcomes: [
          { kind: 'faction', factionId: 'old_guard', loyaltyDelta: -20, ruptureRiskDelta: 25, disciplineDelta: -10 },
          { kind: 'faction', factionId: 'youth', loyaltyDelta: 12, powerDelta: 6 },
          { kind: 'brand', field: 'modernity', delta: 12 },
          { kind: 'brand', field: 'internalOrder', delta: -8 },
          { kind: 'label', add: 'La Renovación' },
        ],
      },
    ],
  },

  {
    id: 'youth_pushes_radicalization',
    title: 'Las juventudes piden radicalizar',
    classification: 'PRESIÓN IDEOLÓGICA',
    description:
      'Las Juventudes inundan redes con un manifiesto exigiendo que el partido se corra a la izquierda y rompa con el "consenso tibio". Aguirre, la líder visible, te cita en privado.',
    trigger: 'cycle_start',
    factionId: 'youth',
    condition: requiresFaction('youth'),
    oneShot: true,
    options: [
      {
        id: 'embrace',
        label: 'Abrazar el viraje',
        cost: 'Perdés moderados',
        effect: 'Más entusiasmo, más polarización.',
        outcomes: [
          { kind: 'ideology', axis: 'economic', delta: -0.15 },
          { kind: 'ideology', axis: 'social', delta: -0.1 },
          { kind: 'faction', factionId: 'youth', loyaltyDelta: 20, powerDelta: 10 },
          { kind: 'faction', factionId: 'radicals', loyaltyDelta: 12 },
          { kind: 'faction', factionId: 'moderates', loyaltyDelta: -18, ruptureRiskDelta: 15 },
          { kind: 'brand', field: 'polarization', delta: 14 },
          { kind: 'brand', field: 'movementMystique', delta: 10 },
        ],
      },
      {
        id: 'partial',
        label: 'Tomar parte del manifiesto, no todo',
        cost: 'Tibieza percibida',
        effect: 'Pequeños ajustes; ninguna facción contenta del todo.',
        outcomes: [
          { kind: 'ideology', axis: 'social', delta: -0.05 },
          { kind: 'faction', factionId: 'youth', loyaltyDelta: 4 },
          { kind: 'brand', field: 'narrativeCoherence', delta: -4 },
        ],
      },
      {
        id: 'refuse',
        label: 'Rechazar — el partido no cambia su rumbo',
        cost: 'Las juventudes amenazan con desbandar',
        effect: 'Disciplina al precio de fervor.',
        outcomes: [
          { kind: 'faction', factionId: 'youth', loyaltyDelta: -20, ruptureRiskDelta: 22 },
          { kind: 'faction', factionId: 'moderates', loyaltyDelta: 10 },
          { kind: 'brand', field: 'internalOrder', delta: 6 },
          { kind: 'brand', field: 'movementMystique', delta: -8 },
        ],
      },
    ],
  },

  {
    id: 'star_candidate_threatens',
    title: 'Un candidato estrella amenaza con irse',
    classification: 'CRISIS DE CONTROL',
    description:
      'Tu candidato más popular convoca prensa por su cuenta y filtra que está "evaluando opciones" si no recibe el aval para la próxima elección importante.',
    trigger: 'pre_election',
    condition: hasAmbitiousStar,
    oneShot: true,
    options: [
      {
        id: 'capitulate',
        label: 'Concederle el aval principal',
        cost: 'El partido queda subordinado a una figura',
        effect: 'Mantenés su poder de fuego electoral.',
        outcomes: [
          { kind: 'candidate_threat', candidateId: 'cand_vasconcelos', loyaltyDelta: 12, ambitionDelta: 10 },
          { kind: 'brand', field: 'movementMystique', delta: 6 },
          { kind: 'brand', field: 'internalOrder', delta: -8 },
          { kind: 'memory', type: 'candidate_endorsed', description: 'Cediste el aval principal bajo presión.', impact: -2, severity: 'medium', candidateId: 'cand_vasconcelos' },
        ],
      },
      {
        id: 'negotiate',
        label: 'Negociar — aval condicionado a disciplina',
        cost: 'Compromiso bilateral',
        effect: 'Queda, pero con límites.',
        outcomes: [
          { kind: 'candidate_threat', candidateId: 'cand_vasconcelos', loyaltyDelta: 4, ambitionDelta: -4 },
          { kind: 'brand', field: 'internalOrder', delta: 4 },
        ],
      },
      {
        id: 'let_go',
        label: 'Dejar que se vaya — el partido es más grande',
        cost: 'Pierde una figura',
        effect: 'Autoridad reafirmada, ojos puestos en quien queda.',
        outcomes: [
          { kind: 'candidate_threat', candidateId: 'cand_vasconcelos', loyaltyDelta: -40, ambitionDelta: 0 },
          { kind: 'brand', field: 'internalOrder', delta: 14 },
          { kind: 'brand', field: 'narrativeCoherence', delta: 6 },
          { kind: 'memory', type: 'candidate_expelled', description: 'Una figura estrella abandonó el partido.', impact: -4, severity: 'high', candidateId: 'cand_vasconcelos' },
          { kind: 'label', add: 'El Disciplinado' },
        ],
      },
    ],
  },

  {
    id: 'donor_offers_money',
    title: 'Un donante ofrece financiamiento condicionado',
    classification: 'OFERTA DE FINANCIAMIENTO',
    description:
      'El Grupo Korniak ofrece $4.5M para la campaña a cambio de un compromiso silencioso: no tocar las concesiones energéticas durante el próximo mandato.',
    trigger: 'cycle_start',
    condition: (state) => state.finances.money < 6,
    oneShot: true,
    options: [
      {
        id: 'accept',
        label: 'Aceptar — la campaña los necesita',
        cost: 'Compromiso silencioso',
        effect: 'Caja arriba; honestidad abajo.',
        outcomes: [
          { kind: 'finance', moneyDelta: 4.5, mediaInfluenceDelta: 4 },
          { kind: 'faction', factionId: 'business', loyaltyDelta: 14, powerDelta: 8 },
          { kind: 'brand', field: 'perceivedCorruption', delta: 10 },
          { kind: 'brand', field: 'popularConnection', delta: -6 },
          { kind: 'donor', donorKind: 'corporate', name: 'Grupo Korniak', amount: 4.5, conditions: 'No tocar concesiones energéticas.' },
          { kind: 'memory', type: 'donor_accepted', description: 'Aceptaste el financiamiento de Korniak.', impact: -4, severity: 'high', canRecur: true },
        ],
      },
      {
        id: 'reject_public',
        label: 'Rechazar públicamente',
        cost: 'Pierde caja',
        effect: 'Gana imagen, Korniak financia a un rival.',
        outcomes: [
          { kind: 'brand', field: 'publicTrust', delta: 10 },
          { kind: 'brand', field: 'ideologicalClarity', delta: 8 },
          { kind: 'faction', factionId: 'business', loyaltyDelta: -15 },
          { kind: 'memory', type: 'donor_rejected', description: 'Rechazaste públicamente la oferta de Korniak.', impact: 6, severity: 'medium' },
          { kind: 'label', add: 'El Honesto' },
        ],
      },
      {
        id: 'reject_quiet',
        label: 'Rechazar en silencio',
        cost: 'Sin upside narrativo',
        effect: 'Ni gana imagen ni gana enemigos.',
        outcomes: [
          { kind: 'brand', field: 'publicTrust', delta: 2 },
        ],
      },
    ],
  },

  {
    id: 'faction_leaks_to_press',
    title: 'Una facción filtró información a la prensa',
    classification: 'TRAICIÓN INTERNA',
    description:
      'Apareció en tapa una nota con detalles internos de las negociaciones del partido. Sabés que solo 3 personas tenían esa info, y todas son de la misma facción.',
    trigger: 'cycle_start',
    factionId: 'populists',
    condition: requiresFaction('populists'),
    oneShot: true,
    options: [
      {
        id: 'sanction',
        label: 'Sancionar a la facción públicamente',
        cost: 'Cisma evidente',
        effect: 'Disciplina al precio de cohesión.',
        outcomes: [
          { kind: 'faction', factionId: 'populists', powerDelta: -15, loyaltyDelta: -20, ruptureRiskDelta: 20 },
          { kind: 'brand', field: 'internalOrder', delta: 10 },
          { kind: 'brand', field: 'narrativeCoherence', delta: -8 },
          { kind: 'memory', type: 'internal_split', description: 'Castigaste públicamente a una facción por filtraciones.', impact: -3, severity: 'high', factionId: 'populists' },
        ],
      },
      {
        id: 'investigate_quietly',
        label: 'Investigar en silencio',
        cost: 'Lento, pero menos costoso',
        effect: 'La duda queda flotando.',
        outcomes: [
          { kind: 'brand', field: 'internalOrder', delta: -4 },
          { kind: 'brand', field: 'professionalism', delta: 4 },
        ],
      },
      {
        id: 'ignore',
        label: 'Ignorar — son cosas de la política',
        cost: 'Habilita más filtraciones futuras',
        effect: 'Norma de impunidad interna.',
        outcomes: [
          { kind: 'brand', field: 'internalOrder', delta: -12 },
          { kind: 'brand', field: 'professionalism', delta: -8 },
          { kind: 'faction', factionId: 'populists', disciplineDelta: -10 },
        ],
      },
    ],
  },

  {
    id: 'regional_leader_demands_list_control',
    title: 'Un barón regional quiere controlar una lista',
    classification: 'NEGOCIACIÓN TERRITORIAL',
    description:
      'Saavedra te plantea: si no maneja personalmente la lista del Norte, no garantiza la maquinaria. Y sin esa maquinaria, no hay forma de ganar en la región.',
    trigger: 'pre_election',
    factionId: 'regionals',
    condition: requiresFaction('regionals'),
    oneShot: true,
    options: [
      {
        id: 'cede_control',
        label: 'Cederle el control de la lista del Norte',
        cost: 'Pierde autoridad central',
        effect: 'Maquinaria asegurada, partido feudalizado.',
        outcomes: [
          { kind: 'faction', factionId: 'regionals', loyaltyDelta: 14, powerDelta: 14, resourcesDelta: 8 },
          { kind: 'territory', region: 'NF', machineryDelta: 14, supportDelta: 10 },
          { kind: 'brand', field: 'internalOrder', delta: -8 },
          { kind: 'brand', field: 'territorialStrength', delta: 8 },
          { kind: 'memory', type: 'faction_demand_accepted', description: 'Saavedra controla la lista del Norte.', impact: 4, severity: 'medium', factionId: 'regionals', region: 'NF' },
        ],
      },
      {
        id: 'compromise',
        label: 'Compromiso — co-decidir la lista',
        cost: 'Negociación lenta',
        effect: 'Acuerdo tibio.',
        outcomes: [
          { kind: 'faction', factionId: 'regionals', loyaltyDelta: 4 },
          { kind: 'territory', region: 'NF', machineryDelta: 6 },
          { kind: 'brand', field: 'internalOrder', delta: 4 },
        ],
      },
      {
        id: 'refuse',
        label: 'Rechazar — la dirigencia central manda',
        cost: 'Maquinaria del Norte se enfría',
        effect: 'Autoridad afirmada, territorio en riesgo.',
        outcomes: [
          { kind: 'faction', factionId: 'regionals', loyaltyDelta: -18, ruptureRiskDelta: 18 },
          { kind: 'territory', region: 'NF', machineryDelta: -14, supportDelta: -8 },
          { kind: 'brand', field: 'internalOrder', delta: 8 },
        ],
      },
    ],
  },

  {
    id: 'rival_coalition_offer',
    title: 'Otro partido propone una coalición',
    classification: 'OFERTA DE PACTO',
    description:
      'Vanguardia Cívica te ofrece sumar bloque legislativo común a cambio de un programa económico moderado pactado. Sus números son sólidos en VC.',
    trigger: 'pre_election',
    oneShot: true,
    options: [
      {
        id: 'accept',
        label: 'Aceptar — la matemática manda',
        cost: 'Pureza ideológica',
        effect: 'Bloque legislativo, programa moderado.',
        outcomes: [
          { kind: 'finance', mediaInfluenceDelta: 8, politicalCapitalDelta: 10 },
          { kind: 'brand', field: 'professionalism', delta: 10 },
          { kind: 'brand', field: 'movementMystique', delta: -10 },
          { kind: 'faction', factionId: 'business', loyaltyDelta: 8 },
          { kind: 'faction', factionId: 'radicals', loyaltyDelta: -15, ruptureRiskDelta: 18 },
          { kind: 'ideology', axis: 'economic', delta: 0.1 },
          { kind: 'coalition', partnerName: 'Vanguardia Cívica', partnerPartyId: 'VC', coalitionType: 'legislative', terms: 'Bloque legislativo común, programa moderado.', forStage: 'legislative' },
          { kind: 'memory', type: 'coalition_formed', description: 'Cerraste coalición con VC.', impact: 3, severity: 'medium' },
        ],
      },
      {
        id: 'reject',
        label: 'Rechazar — no negociamos la identidad',
        cost: 'Pierde acceso a bloque legislativo',
        effect: 'Pureza intacta, soledad relativa.',
        outcomes: [
          { kind: 'brand', field: 'ideologicalClarity', delta: 10 },
          { kind: 'brand', field: 'narrativeCoherence', delta: 6 },
          { kind: 'memory', type: 'coalition_broken', description: 'Rechazaste la propuesta de VC.', impact: -1, severity: 'low' },
        ],
      },
    ],
  },

  {
    id: 'poll_polarization_warning',
    title: 'Encuesta: el partido crece, pero polariza',
    classification: 'DIAGNÓSTICO DE OPINIÓN',
    description:
      'Una encuesta interna muestra que el partido sumó 4 puntos en intención de voto, pero su imagen negativa también subió 6 puntos. Estás creciendo y enojando al mismo tiempo.',
    trigger: 'cycle_start',
    condition: (state) => state.brand.polarization >= 40,
    oneShot: true,
    options: [
      {
        id: 'moderate_tone',
        label: 'Bajar el tono — buscar imagen positiva',
        cost: 'Frena el crecimiento agresivo',
        effect: 'Menos polarización; menos energía.',
        outcomes: [
          { kind: 'brand', field: 'polarization', delta: -10 },
          { kind: 'brand', field: 'publicTrust', delta: 8 },
          { kind: 'brand', field: 'movementMystique', delta: -6 },
          { kind: 'faction', factionId: 'radicals', loyaltyDelta: -8 },
        ],
      },
      {
        id: 'double_down',
        label: 'Doblar la apuesta — quien polariza, gana',
        cost: 'Más enemigos',
        effect: 'Crecimiento sostenido, costos en imagen.',
        outcomes: [
          { kind: 'brand', field: 'polarization', delta: 12 },
          { kind: 'brand', field: 'movementMystique', delta: 8 },
          { kind: 'brand', field: 'publicTrust', delta: -6 },
          { kind: 'faction', factionId: 'radicals', loyaltyDelta: 12 },
        ],
      },
    ],
  },

  {
    id: 'candidate_scandal',
    title: 'Un escándalo golpea a un candidato clave',
    classification: 'ESCÁNDALO INDIVIDUAL',
    description:
      'Aparecen denuncias por uso indebido de recursos en una intendencia controlada por uno de nuestros candidatos. La nota está creciendo en redes y portadas.',
    trigger: 'cycle_start',
    condition: hasRiskyCandidate,
    oneShot: true,
    options: [
      {
        id: 'protect',
        label: 'Defenderlo públicamente',
        cost: 'Comprometé al partido',
        effect: 'Si cae, cae con vos.',
        outcomes: [
          { kind: 'scandal', scandalType: 'abuse_of_power', title: 'Caso "fondos opacos"', description: 'Un candidato del partido enfrenta denuncias.', severity: 'high' },
          { kind: 'brand', field: 'perceivedCorruption', delta: 10 },
          { kind: 'brand', field: 'publicTrust', delta: -8 },
          { kind: 'faction', factionId: 'ground_ops', loyaltyDelta: 8 },
        ],
      },
      {
        id: 'distance',
        label: 'Tomar distancia, pedirle suspensión',
        cost: 'Perdés un cuadro',
        effect: 'Limitás el daño.',
        outcomes: [
          { kind: 'scandal', scandalType: 'abuse_of_power', title: 'Caso "fondos opacos"', description: 'Suspendiste al candidato involucrado.', severity: 'medium' },
          { kind: 'brand', field: 'publicTrust', delta: 4 },
          { kind: 'brand', field: 'internalOrder', delta: 6 },
        ],
      },
      {
        id: 'expel',
        label: 'Expulsarlo del partido — quiebre total',
        cost: 'Cisma con su sector',
        effect: 'Marca limpia, conflicto interno.',
        outcomes: [
          { kind: 'brand', field: 'publicTrust', delta: 10 },
          { kind: 'brand', field: 'internalOrder', delta: 10 },
          { kind: 'faction', factionId: 'ground_ops', loyaltyDelta: -15, ruptureRiskDelta: 15 },
          { kind: 'memory', type: 'candidate_expelled', description: 'Expulsaste al candidato por escándalo.', impact: 3, severity: 'high' },
        ],
      },
    ],
  },

  {
    id: 'region_demands_investment',
    title: 'Una región exige más inversión',
    classification: 'EXIGENCIA TERRITORIAL',
    description:
      'Llanos Occidentales lidera un reclamo: si no hay anuncio de obras y sedes nuevas en la región, las maquinarias locales no movilizan en la próxima elección.',
    trigger: 'pre_election',
    oneShot: true,
    options: [
      {
        id: 'invest',
        label: 'Invertir fuerte — anuncio de obras + sedes',
        cost: 'Caja',
        effect: 'Territorio fortalecido.',
        outcomes: [
          { kind: 'finance', moneyDelta: -2.5 },
          { kind: 'territory', region: 'LO', supportDelta: 12, machineryDelta: 10, officesDelta: 1 },
          { kind: 'brand', field: 'territorialStrength', delta: 8 },
          { kind: 'memory', type: 'region_conquered', description: 'Inversión fuerte en Llanos Occidentales.', impact: 4, severity: 'medium', region: 'LO' },
        ],
      },
      {
        id: 'partial',
        label: 'Inversión simbólica',
        cost: 'Costo bajo',
        effect: 'Tibieza percibida.',
        outcomes: [
          { kind: 'finance', moneyDelta: -0.6 },
          { kind: 'territory', region: 'LO', supportDelta: 3 },
        ],
      },
      {
        id: 'ignore',
        label: 'Ignorar — la región es secundaria',
        cost: 'Abandono percibido',
        effect: 'Pierde apoyos territoriales.',
        outcomes: [
          { kind: 'territory', region: 'LO', supportDelta: -10, machineryDelta: -8 },
          { kind: 'memory', type: 'region_abandoned', description: 'Llanos Occidentales fue abandonada.', impact: -6, severity: 'high', region: 'LO', canRecur: true },
        ],
      },
    ],
  },

  {
    id: 'union_pushes_program',
    title: 'La facción sindical empuja un compromiso laboral',
    classification: 'NEGOCIACIÓN PROGRAMÁTICA',
    description:
      'Mamani plantea: o el partido firma un compromiso público con la reforma laboral protectiva, o la facción no garantiza movilizar en la elección legislativa.',
    trigger: 'pre_election',
    factionId: 'union',
    condition: requiresFaction('union'),
    oneShot: true,
    options: [
      {
        id: 'commit',
        label: 'Firmar el compromiso',
        cost: 'Cierra puerta al sector empresarial',
        effect: 'Base sindical movilizada.',
        outcomes: [
          { kind: 'faction', factionId: 'union', loyaltyDelta: 18, powerDelta: 6 },
          { kind: 'faction', factionId: 'business', loyaltyDelta: -16, ruptureRiskDelta: 12 },
          { kind: 'brand', field: 'popularConnection', delta: 10 },
          { kind: 'brand', field: 'narrativeCoherence', delta: 6 },
          { kind: 'ideology', axis: 'economic', delta: -0.1 },
        ],
      },
      {
        id: 'soft_commit',
        label: 'Compromiso ambiguo',
        cost: 'Nadie del todo contento',
        effect: 'Pateás el problema.',
        outcomes: [
          { kind: 'faction', factionId: 'union', loyaltyDelta: -2 },
          { kind: 'brand', field: 'narrativeCoherence', delta: -4 },
        ],
      },
      {
        id: 'refuse',
        label: 'Rechazar — no firmamos cheques en blanco',
        cost: 'Pierde apoyo sindical',
        effect: 'Empresarios tranquilos, calle vacía.',
        outcomes: [
          { kind: 'faction', factionId: 'union', loyaltyDelta: -18, ruptureRiskDelta: 14 },
          { kind: 'faction', factionId: 'business', loyaltyDelta: 12 },
          { kind: 'ideology', axis: 'economic', delta: 0.1 },
        ],
      },
    ],
  },

  {
    id: 'ally_demands_positions',
    title: 'Un aliado pide puestos tras la victoria',
    classification: 'POST-VICTORIA',
    description:
      'Después del último resultado positivo, un partido aliado exige una cuota de cargos en futuras administraciones. "Hicimos lo difícil; ahora toca repartir."',
    trigger: 'post_election',
    oneShot: true,
    options: [
      {
        id: 'concede',
        label: 'Ceder posiciones',
        cost: 'Cuota de poder cedida',
        effect: 'Alianza fortalecida; cuadros internos celosos.',
        outcomes: [
          { kind: 'finance', politicalCapitalDelta: -12 },
          { kind: 'brand', field: 'internalOrder', delta: -6 },
          { kind: 'brand', field: 'professionalism', delta: 4 },
          { kind: 'faction', factionId: 'old_guard', loyaltyDelta: -8 },
          { kind: 'memory', type: 'coalition_formed', description: 'Cumpliste el pacto repartiendo posiciones.', impact: 2, severity: 'medium' },
        ],
      },
      {
        id: 'token',
        label: 'Ceder lo mínimo, no más',
        cost: 'Tensión con el aliado',
        effect: 'Pacto crujiendo.',
        outcomes: [
          { kind: 'finance', politicalCapitalDelta: -4 },
          { kind: 'brand', field: 'internalOrder', delta: -2 },
        ],
      },
      {
        id: 'refuse',
        label: 'Rechazar — los acuerdos fueron solo electorales',
        cost: 'Coalición se rompe',
        effect: 'Identidad afirmada.',
        outcomes: [
          { kind: 'memory', type: 'coalition_broken', description: 'Rompiste la coalición al rechazar la cuota.', impact: -3, severity: 'high', canRecur: true },
          { kind: 'brand', field: 'ideologicalClarity', delta: 8 },
          { kind: 'brand', field: 'internalOrder', delta: 6 },
        ],
      },
    ],
  },
];

export const PARTY_EVENT_BY_ID: Record<string, PartyEvent> = PARTY_EVENTS.reduce<
  Record<string, PartyEvent>
>((acc, e) => {
  acc[e.id] = e;
  return acc;
}, {});
