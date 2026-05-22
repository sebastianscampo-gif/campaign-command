# Campaign Command Naming

_Started 2026-05-22 04:39 UTC_

---

## User

El nombre del juego sera Campaign Command
Cambia donde dice Sistema de Comando Politico a Campaign Operations System

## Assistant

## Assistant

## User

<pasted_text name="Pasted text (223 lines)">
Quiero que evoluciones el diseño visual actual del juego hacia una experiencia AAA mucho más cinematográfica, viva, dinámica e inmersiva.

La dirección visual actual está funcionando, pero todavía se siente demasiado estática y parcialmente “dashboard”.

Quiero que ahora el juego se sienta como:
- una war room política,
- una operación electoral viva,
- una simulación política cinematográfica,
- una mezcla entre strategy UI premium y thriller político.

====================================================
PRIORIDAD PRINCIPAL
====================================================

Quiero que diseñes SISTEMAS DE TRANSICIÓN VISUAL CINEMATOGRÁFICOS entre modos de juego y pantallas.

Cuando el usuario hace hover o selecciona opciones como:

- Career Mode
- Party Mode
- New Campaign
- Historical Scenarios
- Multiplayer

la pantalla debe transformarse dinámicamente mediante:
- slide transitions,
- animated panel movement,
- cinematic overlays,
- moving political imagery,
- subtle motion graphics,
- layered depth.

====================================================
QUIERO “LIVING BACKGROUNDS”
====================================================

NO imágenes estáticas.

Quiero fondos vivos y dinámicos:
- multitudes moviéndose,
- flashes de cámaras,
- lluvia,
- humo,
- partículas,
- pantallas LED,
- glitches sutiles,
- movimiento de prensa,
- helicópteros,
- ticker movement,
- luces urbanas,
- banderas agitándose.

Todo debe ser elegante y cinematográfico.

====================================================
DISEÑA EXPERIENCIAS VISUALES PARA CADA MODO
====================================================

=================================
CAREER MODE
=================================

Visual:
- rally político masivo,
- candidato entrando al escenario,
- seguridad,
- fotógrafos,
- periodistas,
- supporters,
- tensión política.

Feeling:
“estás entrando a una carrera política real”.

=================================
PARTY MODE
=================================

Visual:
- convención partidista,
- delegados,
- negociación política,
- operadores,
- votaciones internas,
- maquinaria electoral.

=================================
NEW CAMPAIGN
=================================

Visual:
- headquarters de campaña,
- encuestas,
- voluntarios,
- buses,
- propaganda,
- estrategia electoral,
- preparación de discursos.

=================================
HISTORICAL SCENARIOS
=================================

Visual:
- archivos históricos,
- periódicos antiguos,
- televisores CRT,
- fotografías documentales,
- mapas envejecidos,
- estética histórica.

=================================
MULTIPLAYER
=================================

Visual:
- war room digital,
- múltiples campañas simultáneas,
- pantallas gigantes,
- negociación,
- mapas en vivo.

====================================================
QUIERO MÁS PROFUNDIDAD VISUAL
====================================================

Agrega:
- glassmorphism sutil,
- screen reflections,
- dynamic shadows,
- microanimations,
- live data movement,
- animated charts,
- subtle flickering,
- scanlines elegantes,
- holographic overlays,
- cinematic blur layers.

====================================================
EVOLUCIONA EL MAPA
====================================================

El mapa debe evolucionar hacia una experiencia AAA.

Agregar:
- animated electoral heat,
- swing-state pulsing,
- rally markers,
- crisis markers,
- media influence overlays,
- campaign movement paths,
- zoom levels,
- city detail layers,
- demographic overlays,
- infrastructure layers,
- turnout visualization.

Inspiración:
- Civilization
- Hearts of Iron
- election night TV coverage
- intelligence dashboards

====================================================
DISEÑA “ELECTION NIGHT MODE”
====================================================

Quiero una pantalla especial extremadamente cinematográfica para la noche electoral.

Debe incluir:
- live projections,
- TV aesthetics,
- anchors,
- provinces reporting,
- turnout estimates,
- disputed regions,
- breaking news,
- confetti,
- countdown tension,
- dramatic polling swings.

Debe sentirse como:
“la noche más importante de una elección presidencial”.

====================================================
MEDIA ECOSYSTEM
====================================================

Diseña interfaces para:
- fake Twitter/X,
- TikTok political trends,
- TV news,
- livestreams,
- podcasts,
- headlines,
- political commentators.

====================================================
IMPORTANTE
====================================================

No quiero conceptos vagos.

Quiero:
- layouts detallados,
- mockups específicos,
- motion design concepts,
- transición entre pantallas,
- UX flows,
- organización espacial,
- layering visual,
- jerarquía visual,
- sistemas UI reales.

Todo debe sentirse:
- premium,
- político,
- elegante,
- tenso,
- moderno,
- inmersivo,
- vivo,
- AAA.
</pasted_text>

## Assistant

_[tool: list_files]_

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

I'll plan this carefully. Let me peek at the map and data quickly, then execute.

_[tool: update_todos]_

I'll evolve this into a much more cinematic experience. Given the scope, I'll focus on the highest-impact changes: rebrand to **Campaign Command**, build a cinematic mode-preview system in the main menu (with living rally/convention/HQ/archive/war-room scenes), add an **Election Night Mode** screen, and a generic **Media Ecosystem** screen (original, non-branded — no Twitter/X/TikTok marks).

_[tool: read_file]_

_[tool: str_replace_edit]_

Now I'll make the renames and build the cinematic upgrade. Batching the small renames first:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now let me rebuild the Main Menu with cinematic per-mode preview scenes. I'll write a fresh version:

_[tool: write_file]_

## Assistant

## Assistant

## User

<pasted_text name="Pasted text (156 lines)">
Quiero que evoluciones el menú principal actual de mi juego político hacia una experiencia AAA cinematográfica e inmersiva.

La UI actual ya tiene:
- estética política oscura,
- dashboard estratégico,
- feeling de war room,
- tipografía serif elegante,
- paneles tácticos.

NO quiero rediseñar desde cero.
Quiero evolucionar el diseño actual.

====================================================
OBJETIVO
====================================================

Quiero que el menú principal se sienta vivo, político y cinematográfico.

Debe sentirse como:
- una operación política real,
- una campaña presidencial moderna,
- una mezcla entre thriller político y strategy game AAA.

====================================================
TRANSICIONES ENTRE OPCIONES
====================================================

Cuando el usuario hace hover o selecciona:

- Continue Campaign
- New Campaign
- Career Mode
- Party Mode
- Historical Scenarios
- Multiplayer
- Mods

la pantalla debe hacer transiciones dinámicas cinematográficas.

NO quiero simplemente cambiar de panel.

Quiero:
- slide transitions,
- moving panels,
- animated overlays,
- cinematic movement,
- depth transitions,
- subtle camera movement,
- layered UI motion.

====================================================
QUIERO “LIVING BACKGROUNDS”
====================================================

Cada modo debe revelar un fondo político vivo y cinematográfico.

=================================
CAREER MODE
=================================

Mostrar:
- político entrando a rally,
- multitudes,
- flashes,
- seguridad,
- periodistas,
- lluvia ligera,
- banderas,
- cámaras.

Feeling:
“una carrera política acaba de comenzar”.

=================================
PARTY MODE
=================================

Mostrar:
- convención partidista,
- delegados,
- votaciones,
- operadores políticos,
- pantallas gigantes,
- maquinaria electoral.

=================================
NEW CAMPAIGN
=================================

Mostrar:
- headquarters de campaña,
- voluntarios,
- impresión de propaganda,
- encuestas,
- buses,
- preparación de discursos.

=================================
HISTORICAL SCENARIOS
=================================

Mostrar:
- archivos históricos,
- periódicos viejos,
- televisores CRT,
- imágenes documentales,
- estética histórica política.

=================================
MULTIPLAYER
=================================

Mostrar:
- war room digital,
- múltiples campañas,
- mapas en vivo,
- negociación política.

====================================================
MICROANIMACIONES
====================================================

Agregar:
- flickering elegante,
- data movement,
- hover glow,
- breathing animations,
- ticker movement,
- live indicators,
- subtle particles,
- smoke,
- ambient movement.

====================================================
IMPORTANTE
====================================================

No quiero descripciones vagas.

Quiero:
- layouts específicos,
- motion concepts,
- transición exacta entre pantallas,
- organización visual,
- layering,
- jerarquía visual,
- dirección artística precisa.

Todo debe sentirse:
- premium,
- político,
- elegante,
- inmersivo,
- tenso,
- moderno,
- AAA.
</pasted_text>

## Assistant

_[tool: write_file]_

I'm building exactly that. Continuing now — let me create the cinematic scene components (rally, convention, HQ, archive, war room, election night, media), plus the cinema CSS layer, the Election Night screen, the Media Ecosystem screen, and wire it up.Now the cinema CSS layer:

_[tool: write_file]_

Now the Election Night Mode screen:

_[tool: write_file]_

Now the Media Ecosystem screen (original, generic — not Twitter/X/TikTok):

_[tool: write_file]_

Now wire it all up in app.jsx — add screens for `election` and `media` (full-screen), add the cinematic transition cut overlay, expose tweak buttons:

_[tool: write_file]_

_[tool: str_replace_edit]_

I need to fix CSS so election and media screens are full-height (no topbar/ticker grid):Let me check this loads cleanly:

_[tool: show_html]_

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

Listo. **Campaign Command** está en pie con el sistema cinematográfico que pediste:

**Renombrado** → `Campaign Command` + `Campaign Operations System` en title, topbar, menu y tweaks panel.

**Main Menu (cinematic)** — living backgrounds en capas:
- silueta del mapa nacional + capital pulsando + grid coordenado
- 2 bandas de multitud en parallax (cerca/lejos) deslizando lentamente
- flashes de cámara aleatorios sobre la zona del escenario
- helicóptero recorriendo el cielo
- vignette + scanlines + grain animado + ticker inferior infinito
- crosshairs y title con caret parpadeante

**Mode previews** (panel derecho cambia según hover, con animación de entrada):
- **Career Mode** → escena Rally (multitud en filas, spotlights animados, lluvia ligera, banderas ondeando, candidato en podio, flashes, ticker, LED panels) + timeline 1992→2046 + 3 pilares.
- **Party Mode** → escena Convención (delegados como puntos coloreados por facción, pantallas LED con tally en vivo, banner rojo, spotlight barriendo) + breakdown de facciones.
- **New Campaign** → escena HQ (whiteboard con poll chart animado, 3 monitores: schedule/call-time con waveform/mapa de voluntarios, siluetas alrededor de la mesa) + sliders de ideología/populismo/experiencia.
- **Historical Scenarios** → escena Archivo (perforaciones de film moviéndose, CRT con anchor + scanline barriendo, recorte de periódico con halftone, partículas de polvo, sepia wash) + 6 escenarios datados.
- **Multiplayer** → escena War Room (mapa central compartido con paths de movimiento dashed, 4 pantallas de jugadores con sparklines, panel de negociación con "escribiendo…", siluetas de operadores).

**Election Night Mode** — pantalla completa:
- broadcast top bar con hora live + % mesas
- anchors con cámaras pulsando y comentarios narrativos
- breaking news rojo + swing-states + swingograph animado
- mapa nacional grande con provincias pulsando (toss-ups con borde amarillo respirando, capital con doble pulso, marcadores de celebración PRD)
- proyección nacional con barras + provincias-status (CALLED / TOSS / pendientes)
- turnout bar histórico + bandas de confetti cuando líder > 30%
- big breaking ticker rojo en loop

**Media Ecosystem** — pantalla completa, original (no Twitter/X/TikTok):
- 4 tabs: STREAM · PRESS · PODCASTS · LIVE TV
- feed PULSE con posts originales, verificación ◈, métricas
- live TV con estudio simulado (anchors, dos pantallas, lower-third rojo, ticker)
- tendencias con sparklines por hashtag
- sentiment waveform animado + cells positivo/neutral/negativo
- press releases por outlet ficticio
- podcasts marcados aliado/neutral/hostil
- carrusel de FRAMES (clips cortos verticales con waveforms animados)

**Transición cinematográfica** entre pantallas — overlay con clip-path inset que se abre verticalmente, con haz dorado horizontal y label monospace centrado ("MAP · STRATEGIC OPERATIONS", "ELECTION NIGHT · LIVE", etc.). Toggleable en Tweaks → "Cinematic cuts".

**Tweaks panel** ahora incluye accesos directos a Election Night Mode y Media Ecosystem.

**Siguientes pasos** (no hechos en este pase para no diluir el foco):
- Evolución del mapa principal (rally paths animados, ondas de influencia mediática, ciudades como capas de detalle al hacer zoom)
- Modo dashboard con holographic overlays
- Sonido ambiente (war room hum, crowd noise distante)

¿Quieres que siga con la evolución del mapa o profundice alguna de las escenas (más densidad de multitud, post-procesado tipo bloom, motion blur en el helicóptero)?

## User

<system-info comment="Only acknowledge these if relevant">
Current date is now May 22, 2026
</system-info>

<pasted_text name="Pasted text (128 lines)">
Quiero que rediseñes y expandas el mapa electoral principal de mi juego político para convertirlo en una experiencia AAA estratégica y cinematográfica.

La versión actual funciona como concepto, pero todavía se siente demasiado simple y “placeholder”.

Quiero que el mapa se convierta en el corazón visual del juego.

Inspiraciones:
- Civilization
- Hearts of Iron
- election night coverage
- intelligence dashboards
- geopolitical command centers

====================================================
OBJETIVO
====================================================

El mapa debe sentirse:
- estratégico,
- político,
- dinámico,
- vivo,
- premium,
- táctico,
- profundamente interactivo.

====================================================
AGREGAR
====================================================

=================================
OVERLAYS DINÁMICOS
=================================

Diseñar overlays para:
- intención de voto,
- polarización,
- turnout,
- crisis,
- economía,
- media influence,
- infrastructure,
- ideological distribution,
- demographic blocs.

=================================
ANIMACIONES
=================================

Agregar:
- electoral heat pulsing,
- swing-state glow,
- live territory updates,
- rally markers,
- crisis alerts,
- animated borders,
- movement paths,
- media influence spread,
- flashing hotspots.

=================================
ZOOM LEVELS
=================================

Cuando haces zoom:
- aparecen ciudades,
- demographics,
- local polling,
- infrastructure,
- campaign offices,
- rallies,
- issue salience,
- media penetration.

=================================
MAPA VIVO
=================================

Agregar:
- moving lights,
- ambient motion,
- subtle clouds,
- atmospheric overlays,
- dynamic terrain shading,
- political tension indicators.

=================================
INTERACCIÓN
=================================

Diseñar:
- hover states,
- territory selection,
- contextual panels,
- animated tooltips,
- decision overlays,
- quick actions.

====================================================
QUIERO UN “WAR ROOM MAP”
====================================================

El jugador debe sentir:
“estoy controlando una campaña presidencial real”.

No quiero un mapa casual.

Quiero:
- tensión,
- datos,
- política,
- estrategia,
- profundidad visual.

====================================================
IMPORTANTE
====================================================

No quiero explicaciones generales.

Quiero:
- mockups detallados,
- layouts,
- panel organization,
- visual hierarchy,
- interaction systems,
- cinematic map concepts,
- AAA political strategy UI.
</pasted_text>

## Assistant

_[tool: read_file]_

Plan: evolve the map into a real war-room — add atmospheric layers (clouds, tension vignette), animated campaign paths, media influence ripples, swing-state glow, crisis pulses with alert flags, city detail at high zoom, more overlays (media/infra/demographics), and a chrome HUD with coordinates + mission timer.

_[tool: write_file]_

I'll evolve the map. New file with atmosphere, animated paths, swing-state glow, media ripples, crisis rings, city detail, expanded overlays, HUD chrome, and a radar mini-map.Now add the war-room CSS additions:

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

**Mapa evolucionado a War Room**. Resumen de lo que cambió:

**Atmósfera y profundidad**
- Vignette radial + grid coordenado + grid fino al hacer zoom > 1.5
- Nubes drifting que cruzan el mapa lentamente (3 capas paralax)
- Tension overlay rojo dinámico (intensidad = promedio crisis nacional)
- Cursor crosshair con líneas dashed que siguen el mouse
- Radar barriendo en compass top-right

**Animaciones políticas**
- **Swing-state glow**: provincias con gap < 4pt entre 1°/2° respiran con borde ámbar variable
- **Crisis pulses**: círculos rojos expandiéndose + triángulo de alerta + label "⚠ CRISIS L2/L3"
- **Media influence ripples**: 3 epicentros con ondas concéntricas que se expanden y desaparecen (también vía overlay 'media' o layer toggle)
- **Campaign path animado**: dashed line de Vasconcelos VC→CA→VC→SA→VC→LO→VC con `strokeDashoffset` moviéndose + caravana (dot luminoso) recorriendo el camino + bandera ▸ AHORA pulsando en el destino actual
- **Capital con anillos rotando** (dashed compass-style)
- **Rallies como pin flags** con label panel "RALLY · BAHÍA REAL · HOY 20h"

**Zoom levels**
- 1.3× → aparecen city dots (9 ciudades subordinadas)
- 1.6× → aparecen names + populations sobre cada ciudad
- 1.5× → grid fino se activa
- Hint en rail: "◉ CITY DETAIL · ON" / "◯ CITY MARKERS · ON" / "· VISTA NACIONAL ·"

**12 overlays organizados en 4 categorías**:
- A · POLÍTICA: Intención · Momentum · Issue
- B · SOCIAL: Turnout · Polarización · Crisis
- C · ECON/MEDIA: Indicador económico · Aprobación · **Influencia mediática** (nuevo)
- D · DEMO/INFRA: **Infraestructura** · **Bloques demográficos** · **Distribución ideológica** (3 nuevos)

**8 layers toggleables**: Cities · Rallies · Crisis · Campaign paths · Media · Infraestructura (highways dashed) · Hidrografía (ríos) · Grid

**War Room HUD**
- Top warbar: ▣ CLASIFICADO · CC-OPS · overlay activo · LIVE timer · TENSIÓN % (cambia rojo/ámbar) · LAT/LON del cursor en vivo · barra de señal
- 3 corner HUDs con brackets dorados: CC·OPS DAY 64/92 · OVERLAY actual + Layers count · WAR CHEST + MOMENTUM
- **PIP minimap** bottom-right (200×130) con viewport rectangle dashed cuando zoom > 1
- **Legend bar** bottom-left contextual al overlay activo

**Interacción enriquecida**
- Hover popover: corner brackets, header con region, gap warning "SWING" si < 4pt, **trend sparkline 14d** del partido líder, hint "▸ CLICK PARA DOSSIER"
- Click provincia → **QuickRadial panel** flota a la derecha con 5 acciones (RALLY · AD TV · PUERTA · SPEECH · VISITA) con border-left-color codificado + animación slide-in
- Action bar ahora tiene íconos grandes a la izquierda de cada acción

Verificador corriendo en background. ¿Quieres que siga con holographic overlays en el dashboard o evolucione el modal de crisis?

## User

<pasted_text name="Pasted text (113 lines)">
Quiero que diseñes la pantalla principal de campaña política de mi juego como una verdadera war room electoral AAA.

Debe sentirse como:
- headquarters presidencial,
- centro de estrategia política,
- sala de análisis electoral,
- operación política viva.

====================================================
OBJETIVO
====================================================

La pantalla principal de campaña debe combinar:
- data visualization premium,
- political tension,
- strategic decision-making,
- cinematic presentation.

====================================================
DISEÑAR
====================================================

=================================
PANEL CENTRAL
=================================

Mostrar:
- polling,
- momentum,
- electoral map,
- swing regions,
- approval,
- issue salience,
- coalition strength.

=================================
CAMPAIGN ACTIONS
=================================

Diseñar UI para:
- rallies,
- TV ads,
- social media,
- debates,
- fundraising,
- endorsements,
- opposition attacks,
- speech preparation.

=================================
LIVE MEDIA FEED
=================================

Agregar:
- breaking news,
- headlines,
- social media trends,
- TV commentary,
- scandals,
- live reactions.

=================================
CANDIDATE STATUS
=================================

Mostrar:
- energy,
- approval,
- reputation,
- charisma,
- trust,
- scandals,
- demographic support.

=================================
WAR ROOM FEELING
=================================

Agregar:
- giant screens,
- live tickers,
- blinking alerts,
- strategic overlays,
- moving data,
- cinematic lighting,
- dark political atmosphere.

====================================================
MICROANIMACIONES
====================================================

Agregar:
- live chart animation,
- updating polling,
- hover transitions,
- panel movement,
- glow states,
- ticker flow,
- breathing UI.

====================================================
IMPORTANTE
====================================================

No quiero solo dashboards genéricos.

Quiero:
- diseño político cinematográfico,
- layouts AAA,
- panel hierarchy,
- strategic clarity,
- visual tension,
- premium UI systems.
</pasted_text>

## Assistant

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: write_file]_

Now append the war room CSS to dashboard.css:

_[tool: read_file]_

Now I'll append the war room CSS additions:

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: fork_verifier_agent]_

**Campaign Dashboard evolucionado a War Room AAA.** Lo que cambió:

**Atmósfera de fondo**
- Capa de scanlines sutiles + vignette radial sobre todo el dashboard
- Background oscuro #050709 con washes radiales dorados/rojos en el hero

**Top Broadcast Bar (sticky)**
- ▣ CAMPAIGN OPERATIONS · CC-OPS · DAY 64/92 · T−28 · timer animado en vivo
- "● LIVE FEED · INTEL" centrado con dot pulsando
- THREAT box que cambia color (L1 verde → L2 ámbar → L3 rojo con pulse) + CRISIS · LO · timer activo

**Hero (3 columnas)**
- **Candidata**: portrait SVG con silueta + iniciales + badge dorado "PRD · CANDIDATA" + live dot rojo + nombre serif 30px + traits + botón "FULL DOSSIER →"
- **KPIs**: 5 tiles gigantes (INTENT VOTO / APROBACIÓN / MOMENTUM / WAR CHEST / MEDIA SHARE) con valores serif 38px + delta arrows + sub-info ("BURN $0.8M/d · 30d RESTANTES", "UMBRAL 50% −3pt"). El leader tile (Intent Voto) tiene borde dorado top + tag "● 1°" + leve respiración
- **Crisis Alert**: caja roja con pulse-line superior, sentiment breakdown (NACIONAL/LOCAL/BASE), botón "ABRIR BRIEFING ↵"

**Campaign Actions Row** — 8 cards horizontales:
RALLY (HOT) · TV AD · SOCIAL · DEBATE PREP (CRÍTICO) · FUNDRAISER · ENDORSEMENT · OPP ATTACK · SPEECH
- Cada card: ícono dorado grande + label + descripción + cost mono + ROI verde
- Tags HOT (dorado pulsando) y CRÍTICO (rojo)
- Hover: levanta 1px, borde dorado

**Big Polling Screen** (span 8)
- Chrome "● LIVE · CHANNEL 04 · S-12 → S-1"
- Scanlines overlay + barrido vertical dorado animado cruzando el chart
- Foot: VALID 18.4k MUESTRAS · MARGEN ±2.1pt · METODOLOGÍA · NEXT POLL D-3

**Candidate Vitals** (span 4) — NUEVO
- 7 barras animadas: ENERGY · CHARISMA · COMPETENCE · INTEGRITY · DECISIVENESS · TRUST · REPUTATION
- Colores dinámicos por umbral (verde >70 / dorado >50 / ámbar >35 / rojo)
- Tick marks cada 25/50/75% en cada track
- Notas contextuales ("Próximo descanso D-2", "Fideicomiso 2021 −12")
- Warn flag ⚠ en Energy + Decisiveness
- **Escándalos box** rojo con fideicomiso 2021

**Live Tickers** (span 4) — NUEVO
- 3 secciones con dots de colores: BREAKING (rojo pulse) · SOCIAL TRENDING (dorado) · TV COMMENTARY (azul)
- Breaking: 4 headlines con border-left coloreado por tono
- Trending: 5 hashtags con volumen y ▲/▼
- TV: 3 commentary lines por canal

**Coalition Strength** (span 2) — NUEVO
- 5 nodos: PRD (tú, dorado) · FAS (aliado, condicional) · VC (neutral) · IND (disperso) · MNP (opp, rojo)
- BLOQUE PROPIO total: 68%

**Resto** (mantenidos del original): Momentum Gauge · Issue Salience · Voter Blocs · Calendar · Aprobación Demográfica · Strategy Advisory (con fila crítica ahora con pulse dorado)

Verificador corriendo. ¿Sigo con el modal de crisis cinematográfico o evoluciono el dossier de candidata?

## User

Verifier agent check completed

## Assistant

