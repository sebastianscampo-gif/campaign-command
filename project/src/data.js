/* =========================================================================
   JUEGO POLÍTICO — Data layer
   República de San Esteban (ficticia)
   ========================================================================= */

window.GAME_DATA = (function () {

  // -----------------------------------------------------------------------
  // VERTICES — 21 puntos compartidos por las provincias
  // viewBox: 0 0 1000 720
  // -----------------------------------------------------------------------
  const V = {
    // outer border (clockwise from NW)
    A:  [260, 75],
    A1: [380, 68],   // top split
    B1: [620, 72],   // top split
    D:  [790, 95],
    E:  [855, 225],
    F:  [870, 360],
    G:  [840, 540],
    H:  [720, 640],
    Jx: [590, 667],  // bottom split
    Jp: [390, 665],  // bottom split
    K:  [270, 640],
    M:  [160, 540],
    N:  [150, 360],
    O:  [200, 225],
    // internal junctions
    P1: [380, 225], Q1: [620, 225],
    P2: [380, 360], Q2: [620, 360],
    P3: [390, 540], Q3: [600, 540],
  };

  const poly = (...keys) => keys.map(k => V[k].join(',')).join(' ');

  // -----------------------------------------------------------------------
  // PROVINCES — 12
  // -----------------------------------------------------------------------
  const PROVINCES = [
    {
      id: 'NF', name: 'Norte Fronterizo', capital: 'Puerto Mirage',
      polygon: poly('A','A1','P1','O'),
      labelAt: [285, 150], population: 1.8, region: 'Norte',
      intent: { PRD: 22, MNP: 41, FAS: 18, VC: 12, IND: 7 },
      momentum: -3, turnout: 54, approval: 38, leaning: +0.55,
      dominantIssue: 'Seguridad fronteriza', crisis: 2, gdp: 4.1,
      blurb: 'Provincia rural, fronteriza, históricamente conservadora. Economía agroganadera y de paso fronterizo.',
    },
    {
      id: 'SA', name: 'Sierra Andina', capital: 'Alto Verde',
      polygon: poly('A1','B1','Q1','P1'),
      labelAt: [500, 150], population: 2.4, region: 'Norte',
      intent: { PRD: 28, MNP: 26, FAS: 24, VC: 14, IND: 8 },
      momentum: +5, turnout: 67, approval: 44, leaning: +0.05,
      dominantIssue: 'Minería y agua', crisis: 4, gdp: 5.8,
      blurb: 'Cordillera minera. Provincia bisagra, decide elecciones presidenciales.',
    },
    {
      id: 'CA', name: 'Costa Atlántica', capital: 'Bahía Real',
      polygon: poly('B1','D','E','Q1'),
      labelAt: [730, 160], population: 3.6, region: 'Norte',
      intent: { PRD: 38, MNP: 18, FAS: 27, VC: 11, IND: 6 },
      momentum: +2, turnout: 71, approval: 52, leaning: -0.25,
      dominantIssue: 'Turismo y empleo', crisis: 1, gdp: 7.2,
      blurb: 'Costa turística e industrial. Voto urbano joven, progresista.',
    },
    {
      id: 'LO', name: 'Llanos Occidentales', capital: 'San Tarcisio',
      polygon: poly('O','P1','P2','N'),
      labelAt: [275, 295], population: 1.4, region: 'Oeste',
      intent: { PRD: 19, MNP: 36, FAS: 21, VC: 16, IND: 8 },
      momentum: -1, turnout: 62, approval: 41, leaning: +0.40,
      dominantIssue: 'Sequía y agro', crisis: 5, gdp: 3.6,
      blurb: 'Llanos agrícolas. Crisis hídrica desde 2024. Voto rural conservador, descontento.',
    },
    {
      id: 'VC', name: 'Valle Central', capital: 'Ciudad Aurora ★',
      polygon: poly('P1','Q1','Q2','P2'),
      labelAt: [500, 295], population: 6.8, region: 'Centro',
      intent: { PRD: 34, MNP: 21, FAS: 26, VC: 13, IND: 6 },
      momentum: +8, turnout: 76, approval: 49, leaning: -0.15,
      dominantIssue: 'Costo de vida', crisis: 3, gdp: 9.4,
      blurb: 'Corazón económico y político. Contiene la capital, Ciudad Aurora. 28% del electorado.',
      isCapital: true,
    },
    {
      id: 'CE', name: 'Costa del Ébano', capital: 'Puerto Ébano',
      polygon: poly('Q1','E','F','Q2'),
      labelAt: [745, 295], population: 2.1, region: 'Este',
      intent: { PRD: 31, MNP: 24, FAS: 22, VC: 17, IND: 6 },
      momentum: +1, turnout: 69, approval: 46, leaning: -0.10,
      dominantIssue: 'Puerto y comercio', crisis: 2, gdp: 6.1,
      blurb: 'Hub portuario. Sindicatos fuertes, voto histórico de centro-izquierda.',
    },
    {
      id: 'CR', name: 'Cordillera Real', capital: 'Quillota',
      polygon: poly('N','P2','P3','M'),
      labelAt: [275, 460], population: 1.1, region: 'Sur',
      intent: { PRD: 24, MNP: 19, FAS: 32, VC: 18, IND: 7 },
      momentum: +4, turnout: 58, approval: 36, leaning: -0.20,
      dominantIssue: 'Pueblos originarios', crisis: 6, gdp: 2.9,
      blurb: 'Comunidades indígenas. Tensión territorial con minería. Crece el Frente Andino Soberano.',
    },
    {
      id: 'RG', name: 'Río Grande', capital: 'San Lucas',
      polygon: poly('P2','Q2','Q3','P3'),
      labelAt: [500, 460], population: 2.6, region: 'Sur',
      intent: { PRD: 29, MNP: 27, FAS: 23, VC: 14, IND: 7 },
      momentum: 0, turnout: 65, approval: 42, leaning: +0.05,
      dominantIssue: 'Inundaciones', crisis: 7, gdp: 4.4,
      blurb: 'Delta fluvial. Inundaciones recurrentes. Bastión histórico del MNP, hoy disputado.',
    },
    {
      id: 'BR', name: 'Bahía Real', capital: 'Marbella',
      polygon: poly('Q2','F','G','Q3'),
      labelAt: [735, 460], population: 1.9, region: 'Este',
      intent: { PRD: 26, MNP: 31, FAS: 19, VC: 17, IND: 7 },
      momentum: -2, turnout: 64, approval: 40, leaning: +0.20,
      dominantIssue: 'Pesca y energía', crisis: 3, gdp: 5.3,
      blurb: 'Bahía pesquera. Conflicto con concesiones de gas offshore.',
    },
    {
      id: 'PS', name: 'Pampa Sur', capital: 'Belisario',
      polygon: poly('M','P3','Jp','K'),
      labelAt: [325, 605], population: 0.9, region: 'Sur',
      intent: { PRD: 17, MNP: 44, FAS: 14, VC: 18, IND: 7 },
      momentum: -4, turnout: 60, approval: 43, leaning: +0.50,
      dominantIssue: 'Ganadería y exportaciones', crisis: 2, gdp: 3.1,
      blurb: 'Estancias ganaderas. Tradicionalmente MNP. Baja densidad poblacional.',
    },
    {
      id: 'SS', name: 'Selva del Sur', capital: 'La Concepción',
      polygon: poly('P3','Q3','Jx','Jp'),
      labelAt: [495, 605], population: 0.6, region: 'Sur',
      intent: { PRD: 21, MNP: 22, FAS: 35, VC: 16, IND: 6 },
      momentum: +6, turnout: 49, approval: 33, leaning: -0.15,
      dominantIssue: 'Deforestación', crisis: 8, gdp: 2.1,
      blurb: 'Selva amazónica protegida. Conflicto socio-ambiental. Movimientos comunitarios crecientes.',
    },
    {
      id: 'TA', name: 'Tierra Austral', capital: 'Fuerte Hernández',
      polygon: poly('Q3','G','H','Jx'),
      labelAt: [705, 605], population: 0.7, region: 'Sur',
      intent: { PRD: 25, MNP: 33, FAS: 17, VC: 18, IND: 7 },
      momentum: +1, turnout: 71, approval: 47, leaning: +0.25,
      dominantIssue: 'Soberanía austral', crisis: 1, gdp: 4.7,
      blurb: 'Frontera austral. Bases militares, hidrocarburos, identidad patriótica fuerte.',
    },
  ];

  // -----------------------------------------------------------------------
  // PARTIDOS POLÍTICOS
  // -----------------------------------------------------------------------
  const PARTIES = {
    PRD: { id:'PRD', name:'Partido Republicano Democrático', short:'PRD',
           ideology:'Centro-izquierda · Socialdemócrata', color:'#5B8FB9',
           leader:'Elena Vasconcelos', founded:1953 },
    MNP: { id:'MNP', name:'Movimiento Nacional Popular',  short:'MNP',
           ideology:'Centro-derecha · Conservador',       color:'#C24A4A',
           leader:'Rodrigo Salinas Cárdenas', founded:1968 },
    FAS: { id:'FAS', name:'Frente Andino Soberano',       short:'FAS',
           ideology:'Izquierda · Plurinacional',          color:'#5E9B7E',
           leader:'Inés Mamani Quispe', founded:2009 },
    VC:  { id:'VC',  name:'Vanguardia Cívica',            short:'VC',
           ideology:'Centro · Liberal',                   color:'#C9A961',
           leader:'Marco Tagliaferri', founded:2019 },
    IND: { id:'IND', name:'Independientes / Otros',       short:'IND',
           ideology:'Diverso',                            color:'#8C95A0',
           leader:'—', founded:null },
  };

  // -----------------------------------------------------------------------
  // CANDIDATO DEL JUGADOR (Player Character)
  // -----------------------------------------------------------------------
  const PLAYER = {
    name: 'Elena Vasconcelos',
    party: 'PRD',
    age: 52,
    background: 'Senadora por Costa Atlántica (3 períodos). Ex-Ministra de Educación 2018-2021.',
    traits: ['Oradora','Disciplinada','Pragmática','Reservada'],
    ideology: { economic: -0.35, social: -0.55, authority: -0.25 },
    approval: { national: 47, men: 42, women: 52, youth: 58, elders: 39, urban: 54, rural: 32 },
    image: { charisma: 71, competence: 78, integrity: 64, decisiveness: 55 },
    war_chest: 24.6, // millones
    media_share: 0.34,
    momentum: +8,
    scandals: [
      { year: 2021, severity:'medio', label:'Caso fideicomiso educativo' },
    ],
    timeline: [
      { year: 1998, label: 'Concejala municipal · Bahía Real' },
      { year: 2007, label: 'Diputada Federal' },
      { year: 2015, label: 'Senadora por Costa Atlántica' },
      { year: 2018, label: 'Ministra de Educación' },
      { year: 2024, label: 'Precandidata presidencial · PRD' },
    ],
  };

  // -----------------------------------------------------------------------
  // POLLING NACIONAL — últimas 12 semanas
  // -----------------------------------------------------------------------
  const POLLING = [
    { w:'S-12', PRD:24, MNP:34, FAS:18, VC:16, IND:8 },
    { w:'S-11', PRD:25, MNP:33, FAS:19, VC:15, IND:8 },
    { w:'S-10', PRD:26, MNP:32, FAS:20, VC:15, IND:7 },
    { w:'S-9',  PRD:27, MNP:31, FAS:21, VC:14, IND:7 },
    { w:'S-8',  PRD:27, MNP:30, FAS:22, VC:14, IND:7 },
    { w:'S-7',  PRD:28, MNP:30, FAS:21, VC:14, IND:7 },
    { w:'S-6',  PRD:29, MNP:29, FAS:21, VC:14, IND:7 },
    { w:'S-5',  PRD:30, MNP:28, FAS:22, VC:13, IND:7 },
    { w:'S-4',  PRD:30, MNP:28, FAS:23, VC:13, IND:6 },
    { w:'S-3',  PRD:31, MNP:27, FAS:23, VC:13, IND:6 },
    { w:'S-2',  PRD:30, MNP:27, FAS:24, VC:13, IND:6 },
    { w:'S-1',  PRD:31, MNP:26, FAS:24, VC:13, IND:6 },
  ];

  // -----------------------------------------------------------------------
  // ISSUE SALIENCE — top 8
  // -----------------------------------------------------------------------
  const ISSUES = [
    { id:'inflacion',    label:'Inflación y costo de vida', salience: 84, owned:'MNP', delta:+2 },
    { id:'seguridad',    label:'Seguridad pública',          salience: 71, owned:'MNP', delta:+5 },
    { id:'empleo',       label:'Empleo formal',              salience: 68, owned:'PRD', delta:-1 },
    { id:'corrupcion',   label:'Corrupción',                 salience: 62, owned:'VC',  delta:+3 },
    { id:'agua',         label:'Crisis hídrica',             salience: 54, owned:'FAS', delta:+8 },
    { id:'mineria',      label:'Minería e indígenas',        salience: 47, owned:'FAS', delta:+4 },
    { id:'educacion',    label:'Educación pública',          salience: 41, owned:'PRD', delta:0  },
    { id:'aborto',       label:'Derechos reproductivos',     salience: 38, owned:'PRD', delta:-2 },
  ];

  // -----------------------------------------------------------------------
  // VOTER BLOCS
  // -----------------------------------------------------------------------
  const BLOCS = [
    { id:'urb_pro', label:'Urbano progresista', share:18, you:62, them:14, swing:6  },
    { id:'urb_mid', label:'Clase media urbana', share:22, you:34, them:38, swing:18 },
    { id:'rural',   label:'Rural conservador',  share:14, you:18, them:55, swing:9  },
    { id:'joven',   label:'Jóvenes 18–29',      share:16, you:41, them:22, swing:24 },
    { id:'mayor',   label:'Adultos 60+',        share:19, you:36, them:44, swing:7  },
    { id:'indig',   label:'Pueblos originarios',share:6,  you:28, them:11, swing:14 },
    { id:'inform',  label:'Sector informal',    share:5,  you:31, them:32, swing:22 },
  ];

  // -----------------------------------------------------------------------
  // CALENDARIO DE CAMPAÑA
  // -----------------------------------------------------------------------
  const CALENDAR = [
    { day:'Lun 12', type:'rally',   where:'Ciudad Aurora',    note:'Acto central · 18:00',     intensity:9 },
    { day:'Mar 13', type:'travel',  where:'→ Bahía Real',     note:'Vuelo 07:40 · 2h tránsito',intensity:3 },
    { day:'Mar 13', type:'media',   where:'Bahía Real',       note:'Entrevista Canal 7',       intensity:6 },
    { day:'Mié 14', type:'rally',   where:'Bahía Real',       note:'Acto sindicatos portuarios', intensity:8 },
    { day:'Jue 15', type:'debate',  where:'TV Federal',       note:'DEBATE NACIONAL · 21:00',  intensity:10 },
    { day:'Vie 16', type:'fund',    where:'Ciudad Aurora',    note:'Cena de recaudación',      intensity:5 },
    { day:'Sáb 17', type:'travel',  where:'→ Quillota',       note:'Cordillera Real',          intensity:4 },
    { day:'Dom 18', type:'rally',   where:'Quillota',         note:'Acto comunidades originarias', intensity:7 },
  ];

  // -----------------------------------------------------------------------
  // NEWS TICKER + BREAKING
  // -----------------------------------------------------------------------
  const NEWS = [
    { time:'14:32', src:'CANAL 7',     headline:'Vasconcelos lidera intención de voto por 5 puntos en última encuesta nacional', tone:'positive' },
    { time:'14:18', src:'EL CLARÍN',   headline:'MNP denuncia "manipulación estadística" en encuestadora oficial', tone:'negative' },
    { time:'13:55', src:'RADIO PLATA', headline:'Protesta de regantes corta ruta provincial en Llanos Occidentales',   tone:'neutral' },
    { time:'13:40', src:'AURORA HOY',  headline:'Bolsa cierra en alza tras anuncio de plan económico de Vasconcelos', tone:'positive' },
    { time:'13:22', src:'LA SEMANA',   headline:'Mamani (FAS) confirma apoyo en segunda vuelta condicional',         tone:'positive' },
    { time:'13:01', src:'NORTE TV',    headline:'Inseguridad en Norte Fronterizo: 3er ataque a transporte en una semana', tone:'negative' },
    { time:'12:44', src:'EL DÍA',      headline:'Salinas Cárdenas (MNP) llama a "frente antiprogresista"',           tone:'negative' },
    { time:'12:30', src:'RED SOCIAL',  headline:'#VasconcelosPresidenta trending nacional · 312k menciones',         tone:'positive' },
  ];

  // -----------------------------------------------------------------------
  // CRISIS / EVENT (active)
  // -----------------------------------------------------------------------
  const ACTIVE_EVENT = {
    id: 'EVT-2026-047',
    classification: 'CRISIS · NIVEL 3',
    headline: 'Corte de ruta en Llanos Occidentales se extiende a 4° día',
    summary: 'Asociación de regantes y productores agrícolas mantienen bloqueo de Ruta Federal 14, exigiendo subsidio de emergencia hídrica. Pérdidas estimadas $42M/día. La policía provincial reporta tensión creciente.',
    location: 'LO',
    timer: '03:47:21',
    sentiment: { national: -12, local: -28, base: -8 },
    options: [
      { label:'Visitar la zona y reunirse con regantes',
        cost:'2 días de campaña · $1.2M',
        effect:'Aprobación local +6 · Imagen pragmática +4 · Riesgo: protesta hostil' },
      { label:'Anunciar plan hídrico de $200M',
        cost:'Capital político elevado · Compromiso fiscal',
        effect:'Aprobación rural +9 · MNP atacará "gasto irresponsable" · Aprueba issue:agua' },
      { label:'Delegar en gobernador provincial',
        cost:'Sin costo directo',
        effect:'Sin cambio nacional · Aprobación local -5 · Liberación de agenda' },
      { label:'Endurecer discurso de orden público',
        cost:'Quiebre con base progresista',
        effect:'+ Voto urbano conservador · - Aprobación FAS-leaning · Riesgo de escisión' },
    ],
  };

  // -----------------------------------------------------------------------
  // SOCIAL MEDIA FEED
  // -----------------------------------------------------------------------
  const SOCIAL = [
    { handle:'@AuroraPolítica',  meta:'12k seguidores · hace 4 min',  text:'Vasconcelos en Ciudad Aurora: "El país no se gobierna desde un escritorio, se gobierna escuchando." Aplausos largos.', engagement:'8.4k' },
    { handle:'@RodrigoSalinas_OK', meta:'oficial · hace 18 min',       text:'No vamos a permitir que se confunda al pueblo con promesas vacías. El MNP defiende la familia, el orden y el trabajo.', engagement:'14.2k' },
    { handle:'@InésMamani',      meta:'oficial · hace 42 min',         text:'Sin agua para los Llanos no hay soberanía alimentaria. El Estado no puede mirar a otro lado.', engagement:'6.1k' },
    { handle:'@CanalSiete',      meta:'media · hace 1 h',              text:'BREAKING — Debate Nacional confirmado: jueves 21:00. Moderan A. Reyes y C. Belaúnde.', engagement:'22.7k' },
    { handle:'@DataPolítica',    meta:'analista · hace 2 h',           text:'Hilo 🧵 Por qué la diferencia entre PRD y MNP sigue achicándose en Valle Central pese al momentum de Vasconcelos. ↓', engagement:'3.9k' },
  ];

  // -----------------------------------------------------------------------
  // RETURN
  // -----------------------------------------------------------------------
  return {
    V, PROVINCES, PARTIES, PLAYER, POLLING, ISSUES, BLOCS,
    CALENDAR, NEWS, ACTIVE_EVENT, SOCIAL,
    COUNTRY: {
      name: 'República de San Esteban',
      short: 'San Esteban',
      capital: 'Ciudad Aurora',
      currency: 'PSE',
      population: 26.9,
      gdp: 412.8,
      cycle: 'Elecciones Generales 2026',
      day: 64, totalDays: 92, // T-28 to election
      date: '14 · Septiembre · 2026',
      timeToElection: '28 días',
    },
  };
})();
