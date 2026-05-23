/* =============================================================================
   CAREER · CONTENT — Eventos de carrera
   Catálogo de eventos narrativos. Cada uno se dispara en su trigger y consume
   un slot de modal. Las options están escritas como "outcomes" estructurados
   para que el motor los aplique sin parsear texto.
   ============================================================================= */

import type { CareerEvent } from '../types';

export const CAREER_EVENTS: readonly CareerEvent[] = [
  /* ---- Ciclo local --------------------------------------------------------- */
  {
    id: 'mentor_offers_support',
    title: 'El mentor te ofrece apoyo',
    classification: 'OFRECIMIENTO · ALTO IMPACTO',
    description:
      'Hernán Ortúzar te llama a su oficina. "Te aviso: tengo capital político disponible, pero solo lo gasto en gente que va a recordar de dónde vino." Quiere lealtad explícita a cambio de aval público.',
    trigger: 'cycle_start',
    stages: ['local'],
    characterId: 'mentor_ortuzar',
    oneShot: true,
    options: [
      {
        id: 'accept',
        label: 'Aceptar — alinearse con Ortúzar',
        cost: 'Lealtad partidista alta',
        effect: 'Apoyo del aparato. Te quedás dependiente.',
        outcomes: [
          { kind: 'relation', npcId: 'mentor_ortuzar', trustDelta: 18, loyaltyDelta: 15 },
          { kind: 'reputation', field: 'partyLoyalty', delta: 12 },
          { kind: 'reputation', field: 'publicTrust', delta: 5 },
          { kind: 'memory', type: 'alliance_formed', description: 'Te aliaste públicamente con Ortúzar.', impact: 6, severity: 'medium', characterId: 'mentor_ortuzar' },
        ],
      },
      {
        id: 'negotiate',
        label: 'Negociar — apoyo sin lealtad explícita',
        cost: 'Costo político medio',
        effect: 'Mantenés autonomía; menos peso del aparato.',
        outcomes: [
          { kind: 'relation', npcId: 'mentor_ortuzar', trustDelta: 5, loyaltyDelta: -3 },
          { kind: 'reputation', field: 'honesty', delta: 3 },
          { kind: 'memory', type: 'controversial_decision', description: 'Negociaste apoyo sin entregar lealtad.', impact: 2, severity: 'low', characterId: 'mentor_ortuzar' },
        ],
      },
      {
        id: 'refuse',
        label: 'Rechazar — construirse solo',
        cost: 'Pierde aval institucional',
        effect: 'Crece como independiente. Más rivales internos.',
        outcomes: [
          { kind: 'relation', npcId: 'mentor_ortuzar', trustDelta: -15, loyaltyDelta: -10 },
          { kind: 'reputation', field: 'honesty', delta: 6 },
          { kind: 'reputation', field: 'partyLoyalty', delta: -10 },
          { kind: 'label', add: 'El Independiente' },
        ],
      },
    ],
  },

  {
    id: 'regional_leader_demands',
    title: 'Un líder regional exige inversión',
    classification: 'EXIGENCIA TERRITORIAL',
    description:
      'Inés Mamani exige un compromiso por escrito sobre agua para los Llanos. Si lo asumís, te obligás. Si lo evitás, se vuelve enemiga.',
    trigger: 'cycle_start',
    stages: ['local', 'regional', 'national'],
    characterId: 'social_leader_mamani',
    oneShot: true,
    options: [
      {
        id: 'commit',
        label: 'Comprometerse públicamente',
        cost: 'Promesa cara de cumplir',
        effect: 'Apoyo de comunidades; cuenta pendiente.',
        outcomes: [
          { kind: 'relation', npcId: 'social_leader_mamani', trustDelta: 22, loyaltyDelta: 12 },
          { kind: 'promise', description: 'Plan hídrico para Llanos Occidentales', topic: 'agua', region: 'LO', costToKeep: 14, costToBreak: 18 },
          { kind: 'memory', type: 'promise_made', description: 'Prometiste plan hídrico en Llanos.', impact: 4, severity: 'high', region: 'LO', characterId: 'social_leader_mamani' },
        ],
      },
      {
        id: 'vague',
        label: 'Apoyo verbal sin compromiso',
        cost: 'Riesgo de quedar como "el que prometió todo"',
        effect: 'Margen pero erosión silenciosa.',
        outcomes: [
          { kind: 'relation', npcId: 'social_leader_mamani', trustDelta: -3 },
          { kind: 'reputation', field: 'honesty', delta: -3 },
        ],
      },
      {
        id: 'reject',
        label: 'Decir que no — fiscalmente no se puede',
        cost: 'Pierde apoyo del bloque social',
        effect: 'Mamani se vuelve abiertamente hostil.',
        outcomes: [
          { kind: 'relation', npcId: 'social_leader_mamani', trustDelta: -25, fearDelta: 8 },
          { kind: 'add_rival', npcId: 'social_leader_mamani' },
          { kind: 'reputation', field: 'economicCredibility', delta: 8 },
          { kind: 'memory', type: 'enemy_created', description: 'Mamani se posicionó como rival pública.', impact: -6, severity: 'high', characterId: 'social_leader_mamani' },
        ],
      },
    ],
  },

  {
    id: 'donor_offer',
    title: 'Un donante ofrece financiamiento',
    classification: 'OFERTA · INFLUENCIA CONDICIONAL',
    description:
      'Tomás Korniak te ofrece USD 1.2M para tu campaña. A cambio, espera que no toques las concesiones eléctricas en tu jurisdicción.',
    trigger: 'cycle_start',
    stages: ['local', 'regional', 'national'],
    characterId: 'businessman_korniak',
    oneShot: true,
    options: [
      {
        id: 'accept',
        label: 'Aceptar — la campaña los necesita',
        cost: 'Compromiso silencioso',
        effect: 'Más caja; cuenta pendiente futura.',
        outcomes: [
          { kind: 'relation', npcId: 'businessman_korniak', trustDelta: 15, loyaltyDelta: 8 },
          { kind: 'reputation', field: 'economicCredibility', delta: 6 },
          { kind: 'reputation', field: 'honesty', delta: -8 },
          { kind: 'memory', type: 'pending_favor', description: 'Le debés un favor concreto a Korniak.', impact: -4, severity: 'high', characterId: 'businessman_korniak' },
          { kind: 'action_points', delta: 1 },
        ],
      },
      {
        id: 'reject_publicly',
        label: 'Rechazar públicamente',
        cost: 'Pierde fondos, gana imagen',
        effect: 'Korniak financiará al rival.',
        outcomes: [
          { kind: 'relation', npcId: 'businessman_korniak', trustDelta: -18 },
          { kind: 'add_rival', npcId: 'businessman_korniak' },
          { kind: 'reputation', field: 'honesty', delta: 12 },
          { kind: 'reputation', field: 'publicTrust', delta: 8 },
          { kind: 'label', add: 'El Honesto' },
        ],
      },
      {
        id: 'reject_quietly',
        label: 'Rechazar en silencio',
        cost: 'Sin upside narrativo',
        effect: 'No te enemistás, no te comprometés.',
        outcomes: [
          { kind: 'relation', npcId: 'businessman_korniak', trustDelta: -6 },
        ],
      },
    ],
  },

  /* ---- Ciclo regional ----------------------------------------------------- */

  {
    id: 'journalist_investigation',
    title: 'Una periodista investiga tu pasado',
    classification: 'CONTRADICCIÓN · ALTO RIESGO',
    description:
      'Camila Belaúnde descubre una contradicción entre lo que dijiste en el ciclo anterior y lo que hacés ahora. Te pide entrevista. Si esquivás, lo va a contar igual.',
    trigger: 'pre_election',
    stages: ['regional', 'national'],
    characterId: 'journalist_belaunde',
    oneShot: true,
    options: [
      {
        id: 'confront',
        label: 'Dar la entrevista y reconocer',
        cost: 'Costo público inmediato',
        effect: 'Honestidad sube; controla daño.',
        outcomes: [
          { kind: 'relation', npcId: 'journalist_belaunde', trustDelta: 12, respect: 6 } as never,
          { kind: 'reputation', field: 'honesty', delta: 10 },
          { kind: 'reputation', field: 'publicTrust', delta: 6 },
        ],
      },
      {
        id: 'spin',
        label: 'Dar la entrevista y reencuadrar',
        cost: 'Confianza si falla el spin',
        effect: 'Si lo bancan los medios, neutralizás.',
        outcomes: [
          { kind: 'reputation', field: 'mediaSkill' as never, delta: 6 } as never,
          { kind: 'reputation', field: 'honesty', delta: -4 },
          { kind: 'memory', type: 'controversial_decision', description: 'Manejaste la contradicción con un giro mediático.', impact: -2, severity: 'medium' },
        ],
      },
      {
        id: 'avoid',
        label: 'Evitar — que se queme sola',
        cost: 'La nota sale igual y peor',
        effect: 'Escándalo activo en el ciclo.',
        outcomes: [
          { kind: 'scandal', title: 'Caso "contradicciones del pasado"', description: 'Belaúnde publicó sin tu versión.', severity: 'medium' },
          { kind: 'relation', npcId: 'journalist_belaunde', trustDelta: -18 },
          { kind: 'reputation', field: 'honesty', delta: -10 },
          { kind: 'reputation', field: 'publicTrust', delta: -10 },
        ],
      },
    ],
  },

  {
    id: 'party_pressure_moderate',
    title: 'El partido te pide moderar el discurso',
    classification: 'PRESIÓN INTERNA',
    description:
      'Diego Iturri te llama: tu discurso reciente está incomodando a los socios institucionales. Si moderás, ganás aval. Si no, podés perder la candidatura.',
    trigger: 'pre_election',
    stages: ['regional', 'national'],
    characterId: 'party_boss_iturri',
    oneShot: true,
    options: [
      {
        id: 'moderate',
        label: 'Moderar el discurso',
        cost: 'Pierde filo, gana institución',
        effect: 'Apoyo interno sube; radicalismo baja.',
        outcomes: [
          { kind: 'relation', npcId: 'party_boss_iturri', trustDelta: 12, loyaltyDelta: 8 },
          { kind: 'party', internalSupportDelta: 12, disciplineDelta: 8 },
          { kind: 'reputation', field: 'radicalism', delta: -10 },
          { kind: 'reputation', field: 'partyLoyalty', delta: 8 },
        ],
      },
      {
        id: 'hold',
        label: 'Sostener la línea',
        cost: 'Tensión con la dirigencia',
        effect: 'Identidad fuerte; menos aval.',
        outcomes: [
          { kind: 'relation', npcId: 'party_boss_iturri', trustDelta: -10 },
          { kind: 'party', internalSupportDelta: -8, ruptureRiskDelta: 10 },
          { kind: 'reputation', field: 'authority', delta: 6 },
          { kind: 'reputation', field: 'polarization', delta: 4 },
        ],
      },
      {
        id: 'escalate',
        label: 'Radicalizar — pelearle al aparato',
        cost: 'Cisma latente',
        effect: 'Outsider mode dentro del partido.',
        outcomes: [
          { kind: 'relation', npcId: 'party_boss_iturri', trustDelta: -22 },
          { kind: 'party', internalSupportDelta: -18, ruptureRiskDelta: 22, disciplineDelta: -15 },
          { kind: 'reputation', field: 'radicalism', delta: 14 },
          { kind: 'reputation', field: 'polarization', delta: 10 },
          { kind: 'label', add: 'El Disidente' },
        ],
      },
    ],
  },

  {
    id: 'rival_leaks_promise',
    title: 'Tu rival filtra una promesa incumplida',
    classification: 'ATAQUE · DAÑO REPUTACIONAL',
    description:
      'Rodrigo Salinas Cárdenas publica un compilado de tus promesas viejas con datos. La acusación va a quedar circulando.',
    trigger: 'pre_election',
    stages: ['regional', 'national'],
    characterId: 'rival_salinas',
    oneShot: true,
    options: [
      {
        id: 'apologize',
        label: 'Reconocer públicamente',
        cost: 'Costo de imagen inmediato',
        effect: 'Honestidad sube; baja narrativa de cinismo.',
        outcomes: [
          { kind: 'reputation', field: 'honesty', delta: 10 },
          { kind: 'reputation', field: 'publicTrust', delta: 6 },
          { kind: 'reputation', field: 'authority', delta: -4 },
        ],
      },
      {
        id: 'counterattack',
        label: 'Contraatacar — exponer su archivo',
        cost: 'Escalada de polarización',
        effect: 'Empata el daño, pero ensucia.',
        outcomes: [
          { kind: 'reputation', field: 'polarization', delta: 12 },
          { kind: 'reputation', field: 'authority', delta: 6 },
          { kind: 'relation', npcId: 'rival_salinas', trustDelta: -10, fearDelta: 5 },
        ],
      },
      {
        id: 'ignore',
        label: 'Ignorar — pivotar a otra agenda',
        cost: 'El tema circula libre',
        effect: 'Cinismo percibido.',
        outcomes: [
          { kind: 'reputation', field: 'honesty', delta: -6 },
          { kind: 'reputation', field: 'publicTrust', delta: -6 },
          { kind: 'memory', type: 'controversial_decision', description: 'Ignoraste un ataque sobre tus promesas.', impact: -3, severity: 'medium' },
        ],
      },
    ],
  },

  /* ---- Ciclo presidencial ------------------------------------------------- */

  {
    id: 'movement_offers_endorsement',
    title: 'Un movimiento ciudadano quiere que adoptes su causa',
    classification: 'OFERTA · BASE SOCIAL',
    description:
      'Un movimiento contra la concentración energética te ofrece aval público. Korniak (que financia a tu rival) se enojaría. Tu equipo está dividido.',
    trigger: 'pre_election',
    stages: ['national', 'presidential'],
    oneShot: true,
    options: [
      {
        id: 'embrace',
        label: 'Sumarte abiertamente a la causa',
        cost: 'Romper con sector empresarial',
        effect: 'Base ampliada; capital privado se aleja.',
        outcomes: [
          { kind: 'reputation', field: 'popularity', delta: 12 },
          { kind: 'reputation', field: 'socialCredibility', delta: 10 },
          { kind: 'reputation', field: 'economicCredibility', delta: -10 },
          { kind: 'relation', npcId: 'businessman_korniak', trustDelta: -15 },
          { kind: 'label', add: 'La Voz del Pueblo' },
        ],
      },
      {
        id: 'symbolic',
        label: 'Apoyo simbólico, sin propuesta concreta',
        cost: 'Erosión silenciosa',
        effect: 'Tibieza percibida.',
        outcomes: [
          { kind: 'reputation', field: 'popularity', delta: 3 },
          { kind: 'reputation', field: 'honesty', delta: -4 },
        ],
      },
      {
        id: 'decline',
        label: 'Rechazar — mantener el centro',
        cost: 'Pierde base movilizada',
        effect: 'Élite tranquila, militancia frustrada.',
        outcomes: [
          { kind: 'reputation', field: 'economicCredibility', delta: 6 },
          { kind: 'reputation', field: 'popularity', delta: -6 },
        ],
      },
    ],
  },

  {
    id: 'national_crisis',
    title: 'Crisis nacional: te pone a prueba',
    classification: 'EVENTO · OPORTUNIDAD',
    description:
      'Una catástrofe natural sacude el norte. El gobierno responde con retraso. Tu acción puede elevarte a estadista — o exponerte como oportunista.',
    trigger: 'pre_election',
    stages: ['national', 'presidential'],
    oneShot: true,
    options: [
      {
        id: 'lead',
        label: 'Viajar y liderar en el terreno',
        cost: 'Días de campaña + riesgo de logística',
        effect: 'Salto cualitativo si sale bien.',
        outcomes: [
          { kind: 'reputation', field: 'authority', delta: 14 },
          { kind: 'reputation', field: 'governmentCapacity', delta: 10 },
          { kind: 'reputation', field: 'nationalFame', delta: 16 },
          { kind: 'memory', type: 'crisis_handled', description: 'Liderazgo personal en la crisis del norte.', impact: 8, severity: 'high', region: 'NF' },
          { kind: 'label', add: 'El Estadista' },
        ],
      },
      {
        id: 'donate',
        label: 'Anuncio: tu fundación se suma al esfuerzo',
        cost: 'Costo financiero',
        effect: 'Imagen de gestión silenciosa.',
        outcomes: [
          { kind: 'reputation', field: 'honesty', delta: 6 },
          { kind: 'reputation', field: 'popularity', delta: 6 },
        ],
      },
      {
        id: 'criticize',
        label: 'Criticar al gobierno sin actuar',
        cost: 'Visto como oportunista',
        effect: 'Polariza sin construir.',
        outcomes: [
          { kind: 'reputation', field: 'polarization', delta: 8 },
          { kind: 'reputation', field: 'honesty', delta: -8 },
          { kind: 'memory', type: 'crisis_ignored', description: 'No fuiste al norte durante la crisis.', impact: -6, severity: 'high', region: 'NF' },
        ],
      },
    ],
  },

  /* ---- Eventos transversales ---------------------------------------------- */

  {
    id: 'old_promise_resurfaces',
    title: 'Una vieja promesa vuelve a circular',
    classification: 'MEMORIA POLÍTICA',
    description:
      'Los líderes locales de Llanos Occidentales preguntan por la promesa hídrica que firmaste hace años. Esperan respuesta antes de la elección.',
    trigger: 'cycle_start',
    stages: ['regional', 'national', 'presidential'],
    oneShot: false,
    options: [
      {
        id: 'fulfill',
        label: 'Anunciar plan para cumplir',
        cost: 'Compromiso fiscal alto',
        effect: 'Reactiva el apoyo de la región.',
        outcomes: [
          { kind: 'memory', type: 'promise_kept', description: 'Cumpliste el compromiso hídrico en Llanos.', impact: 8, severity: 'high', region: 'LO' },
          { kind: 'reputation', field: 'honesty', delta: 10 },
          { kind: 'reputation', field: 'economicCredibility', delta: -6 },
        ],
      },
      {
        id: 'rebrand',
        label: 'Anunciar un plan más chico, distinto',
        cost: 'Lectura tibia',
        effect: 'Te cubrís, no entusiasmás.',
        outcomes: [
          { kind: 'reputation', field: 'honesty', delta: 2 },
          { kind: 'memory', type: 'controversial_decision', description: 'Reemplazaste la promesa de Llanos por una versión menor.', impact: -2, severity: 'medium', region: 'LO' },
        ],
      },
      {
        id: 'ignore',
        label: 'No dar respuesta',
        cost: 'Promesa pasa a "incumplida"',
        effect: 'Castigo de la región y de la prensa.',
        outcomes: [
          { kind: 'memory', type: 'promise_broken', description: 'Llanos confirma que no cumpliste la promesa hídrica.', impact: -8, severity: 'high', region: 'LO' },
          { kind: 'reputation', field: 'honesty', delta: -12 },
          { kind: 'reputation', field: 'popularity', delta: -6 },
          { kind: 'label', add: 'La Promesa Incumplida' },
        ],
      },
    ],
  },

  {
    id: 'faction_block',
    title: 'Una facción interna intenta bloquearte',
    classification: 'GUERRA INTERNA',
    description:
      'Un grupo dentro del partido junta firmas para empujarte hacia un cargo menor. Si los ignorás, podés perder la candidatura interna. Si negociás, te debilitan.',
    trigger: 'pre_election',
    stages: ['regional', 'national'],
    oneShot: true,
    options: [
      {
        id: 'fight',
        label: 'Confrontar — exponer la maniobra',
        cost: 'Cisma público',
        effect: 'Identidad clara, partido herido.',
        outcomes: [
          { kind: 'party', internalSupportDelta: -8, ruptureRiskDelta: 14 },
          { kind: 'reputation', field: 'authority', delta: 10 },
          { kind: 'reputation', field: 'polarization', delta: 6 },
        ],
      },
      {
        id: 'negotiate',
        label: 'Negociar concesiones',
        cost: 'Pierdes filo y caja interna',
        effect: 'Sigue la candidatura, pero condicionada.',
        outcomes: [
          { kind: 'party', internalSupportDelta: 6, disciplineDelta: 4 },
          { kind: 'reputation', field: 'authority', delta: -6 },
        ],
      },
      {
        id: 'split',
        label: 'Fundar un movimiento propio',
        cost: 'Salto al vacío',
        effect: 'Outsider real con todo lo que implica.',
        outcomes: [
          { kind: 'party', internalSupportDelta: -40, ruptureRiskDelta: 60, disciplineDelta: -40 },
          { kind: 'reputation', field: 'radicalism', delta: 10 },
          { kind: 'reputation', field: 'nationalFame', delta: 8 },
          { kind: 'label', add: 'El Outsider' },
        ],
      },
    ],
  },

  {
    id: 'governor_overture',
    title: 'Tagliaferri sondea alianza',
    classification: 'NEGOCIACIÓN · CENTRO',
    description:
      'Marco Tagliaferri (VC) te invita a un café "informal". Quiere apoyar a un candidato que pueda ganar — y eso podrías ser vos, si te movés al centro.',
    trigger: 'pre_election',
    stages: ['regional', 'national', 'presidential'],
    characterId: 'governor_tagliaferri',
    oneShot: true,
    options: [
      {
        id: 'embrace',
        label: 'Negociar alianza explícita',
        cost: 'Atarse a una agenda económica concreta',
        effect: 'VC se suma; base se queja.',
        outcomes: [
          { kind: 'relation', npcId: 'governor_tagliaferri', trustDelta: 18, loyaltyDelta: 10 },
          { kind: 'add_ally', npcId: 'governor_tagliaferri' },
          { kind: 'reputation', field: 'economicCredibility', delta: 12 },
          { kind: 'reputation', field: 'popularity', delta: -4 },
        ],
      },
      {
        id: 'soft',
        label: 'Mantenerse abierto sin firmar nada',
        cost: 'Sin upside concreto',
        effect: 'Mantenés opciones, no consolidás.',
        outcomes: [
          { kind: 'relation', npcId: 'governor_tagliaferri', trustDelta: 4 },
        ],
      },
      {
        id: 'reject',
        label: 'Rechazar — tu plataforma no se negocia',
        cost: 'Tagliaferri irá con el rival',
        effect: 'Identidad pura, menos centro.',
        outcomes: [
          { kind: 'relation', npcId: 'governor_tagliaferri', trustDelta: -15 },
          { kind: 'reputation', field: 'authority', delta: 6 },
          { kind: 'reputation', field: 'economicCredibility', delta: -6 },
        ],
      },
    ],
  },

  {
    id: 'mentor_betrayal',
    title: 'Tu mentor te exige obediencia o se va',
    classification: 'RELACIÓN · TENSIÓN',
    description:
      'Ortúzar siente que te está perdiendo. Te plantea un ultimátum: lo seguís en su línea o se distancia públicamente.',
    trigger: 'cycle_start',
    stages: ['regional', 'national'],
    characterId: 'mentor_ortuzar',
    oneShot: true,
    options: [
      {
        id: 'obey',
        label: 'Alinearse — preservar el mentor',
        cost: 'Pierde autonomía',
        effect: 'Apoyo conservado, identidad diluida.',
        outcomes: [
          { kind: 'relation', npcId: 'mentor_ortuzar', trustDelta: 12, loyaltyDelta: 14 },
          { kind: 'reputation', field: 'partyLoyalty', delta: 10 },
          { kind: 'reputation', field: 'authority', delta: -6 },
        ],
      },
      {
        id: 'distance',
        label: 'Distanciarse con respeto',
        cost: 'Final de una etapa',
        effect: 'Maduración pública.',
        outcomes: [
          { kind: 'relation', npcId: 'mentor_ortuzar', trustDelta: -12, loyaltyDelta: -10 },
          { kind: 'reputation', field: 'authority', delta: 8 },
          { kind: 'memory', type: 'betrayal', description: 'Ortúzar se distanció después de tu negativa.', impact: -3, severity: 'medium', characterId: 'mentor_ortuzar' },
        ],
      },
      {
        id: 'denounce',
        label: 'Denunciarlo abiertamente',
        cost: 'Cierre traumático',
        effect: 'Visibilidad alta, herida narrativa.',
        outcomes: [
          { kind: 'relation', npcId: 'mentor_ortuzar', trustDelta: -30 },
          { kind: 'add_rival', npcId: 'mentor_ortuzar' },
          { kind: 'memory', type: 'betrayal', description: 'Rompiste públicamente con tu mentor.', impact: -8, severity: 'high', characterId: 'mentor_ortuzar' },
          { kind: 'reputation', field: 'authority', delta: 12 },
          { kind: 'reputation', field: 'honesty', delta: -6 },
          { kind: 'label', add: 'El Traidor' },
        ],
      },
    ],
  },
];

/** Mapa por id para lookups rápidos. */
export const CAREER_EVENT_BY_ID: Record<string, CareerEvent> = CAREER_EVENTS.reduce<
  Record<string, CareerEvent>
>((acc, event) => {
  acc[event.id] = event;
  return acc;
}, {});
