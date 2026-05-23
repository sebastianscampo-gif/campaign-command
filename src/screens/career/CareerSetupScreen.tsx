/* =============================================================================
   SCREENS — Career Setup
   Pantalla única (con secciones) donde el jugador construye su político. Al
   confirmar, arranca la carrera y navega al overview.
   ============================================================================= */

import { useState } from 'react';
import { Panel, SectionHead } from '@/components';
import { PROVINCES } from '@/content';
import type { PartyId, ProvinceId } from '@/content';
import {
  ARCHETYPES,
  ARCHETYPE_ORDER,
  useCareerStore,
} from '@/career';
import type {
  ArchetypeId,
  LeadershipStyle,
  MotivationId,
  SocialBackground,
} from '@/career';
import { useUiStore } from '@/state/uiStore';

const BACKGROUND_OPTIONS: readonly { id: SocialBackground; label: string }[] = [
  { id: 'working', label: 'Origen popular / trabajador' },
  { id: 'middle', label: 'Clase media urbana' },
  { id: 'upper', label: 'Élite tradicional' },
  { id: 'rural', label: 'Origen rural' },
  { id: 'academic', label: 'Origen académico' },
];

const LEADERSHIP_OPTIONS: readonly { id: LeadershipStyle; label: string }[] = [
  { id: 'inspirational', label: 'Inspiracional' },
  { id: 'pragmatic', label: 'Pragmático' },
  { id: 'authoritarian', label: 'De mando fuerte' },
  { id: 'collaborative', label: 'Colaborativo' },
  { id: 'confrontational', label: 'Confrontativo' },
];

const MOTIVATION_OPTIONS: readonly { id: MotivationId; label: string }[] = [
  { id: 'reform', label: 'Reformar el sistema' },
  { id: 'justice', label: 'Justicia social' },
  { id: 'order', label: 'Restablecer el orden' },
  { id: 'legacy', label: 'Construir un legado' },
  { id: 'revenge', label: 'Vengar una historia personal' },
  { id: 'power', label: 'Ejercer el poder' },
];

const STRENGTHS = [
  'Oratoria pública',
  'Negociación silenciosa',
  'Disciplina táctica',
  'Conocimiento técnico',
  'Lectura de masas',
  'Resistencia al desgaste',
];

const WEAKNESSES = [
  'Soberbia',
  'Impaciencia',
  'Sensibilidad a la crítica',
  'Falta de carisma masivo',
  'Pasado familiar incómodo',
  'Desconfianza patológica',
];

const PARTY_CHOICES: readonly { mode: 'inside_party' | 'independent' | 'movement'; label: string; description: string }[] = [
  {
    mode: 'inside_party',
    label: 'Dentro de un partido tradicional',
    description: 'Estructura, financiación y maquinaria — con deudas políticas.',
  },
  {
    mode: 'independent',
    label: 'Como independiente',
    description: 'Libertad ideológica, menos estructura, más esfuerzo.',
  },
  {
    mode: 'movement',
    label: 'Como movimiento outsider',
    description: 'Crecimiento rápido, alta polarización, baja institucionalidad.',
  },
];

const PARTY_IDS: readonly PartyId[] = ['PRD', 'MNP', 'FAS', 'VC'];

export function CareerSetupScreen() {
  const startCareer = useCareerStore((s) => s.startCareer);
  const navigate = useUiStore((s) => s.navigate);

  const [name, setName] = useState('Elena Vasconcelos');
  const [age, setAge] = useState(42);
  const [originRegion, setOriginRegion] = useState<ProvinceId>('CA');
  const [socialBackground, setSocialBackground] = useState<SocialBackground>('middle');
  const [economic, setEconomic] = useState(0);
  const [social, setSocial] = useState(0);
  const [authority, setAuthority] = useState(0);
  const [leadershipStyle, setLeadershipStyle] = useState<LeadershipStyle>('inspirational');
  const [motivation, setMotivation] = useState<MotivationId>('reform');
  const [strength, setStrength] = useState(STRENGTHS[0] ?? '');
  const [weakness, setWeakness] = useState(WEAKNESSES[0] ?? '');
  const [archetype, setArchetype] = useState<ArchetypeId>('reformist');
  const [partyMode, setPartyMode] = useState<'inside_party' | 'independent' | 'movement'>('inside_party');
  const [partyId, setPartyId] = useState<PartyId>('PRD');

  const handleStart = () => {
    startCareer({
      setup: {
        name: name.trim() || 'Político sin nombre',
        age,
        originRegion,
        socialBackground,
        ideology: { economic, social, authority },
        leadershipStyle,
        motivation,
        strength,
        weakness,
        archetype,
      },
      partyMode,
      partyId: partyMode === 'inside_party' ? partyId : undefined,
    });
    navigate('career-overview');
  };

  return (
    <div className="cs">
      <header className="cs__head">
        <div className="cs__eyebrow mono">MODO CARRERA · CREACIÓN</div>
        <h1 className="cs__title">Construí tu político</h1>
        <p className="cs__lede">
          Definí quién es, de dónde viene y cómo se mueve. Las elecciones de acá afectan toda la carrera.
        </p>
      </header>

      <div className="cs__grid">
        <Panel label="01" caption="Identidad">
          <div className="cs__form">
            <label className="cs__field">
              <span className="cs__label mono">NOMBRE</span>
              <input
                type="text"
                className="cs__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="cs__field">
              <span className="cs__label mono">EDAD</span>
              <input
                type="number"
                min={28}
                max={75}
                className="cs__input"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </label>
            <label className="cs__field">
              <span className="cs__label mono">REGIÓN DE ORIGEN</span>
              <select
                className="cs__input"
                value={originRegion}
                onChange={(e) => setOriginRegion(e.target.value as ProvinceId)}
              >
                {PROVINCES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.id})
                  </option>
                ))}
              </select>
            </label>
            <label className="cs__field">
              <span className="cs__label mono">ORIGEN SOCIAL</span>
              <select
                className="cs__input"
                value={socialBackground}
                onChange={(e) => setSocialBackground(e.target.value as SocialBackground)}
              >
                {BACKGROUND_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Panel>

        <Panel label="02" caption="Ideología y estilo">
          <SectionHead title="Ejes ideológicos" sub="−1 izquierda · +1 derecha" />
          <div className="cs__slider-group">
            <SliderRow label="ECONÓMICO" left="Estatismo" right="Mercado" value={economic} onChange={setEconomic} />
            <SliderRow label="SOCIAL" left="Progresista" right="Conservador" value={social} onChange={setSocial} />
            <SliderRow label="AUTORIDAD" left="Libertario" right="Autoritario" value={authority} onChange={setAuthority} />
          </div>

          <SectionHead title="Estilo y motivación" />
          <div className="cs__form">
            <label className="cs__field">
              <span className="cs__label mono">ESTILO DE LIDERAZGO</span>
              <select
                className="cs__input"
                value={leadershipStyle}
                onChange={(e) => setLeadershipStyle(e.target.value as LeadershipStyle)}
              >
                {LEADERSHIP_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="cs__field">
              <span className="cs__label mono">MOTIVACIÓN PRINCIPAL</span>
              <select
                className="cs__input"
                value={motivation}
                onChange={(e) => setMotivation(e.target.value as MotivationId)}
              >
                {MOTIVATION_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="cs__field">
              <span className="cs__label mono">FORTALEZA</span>
              <select
                className="cs__input"
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
              >
                {STRENGTHS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="cs__field">
              <span className="cs__label mono">DEBILIDAD</span>
              <select
                className="cs__input"
                value={weakness}
                onChange={(e) => setWeakness(e.target.value)}
              >
                {WEAKNESSES.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Panel>

        <Panel label="03" caption="Arquetipo" className="cs__archetypes-panel">
          <div className="cs__archetypes">
            {ARCHETYPE_ORDER.map((id) => {
              const arch = ARCHETYPES[id];
              return (
                <button
                  type="button"
                  key={id}
                  className="cs__arch"
                  data-selected={archetype === id}
                  onClick={() => setArchetype(id)}
                >
                  <div className="cs__arch-name">{arch.name}</div>
                  <div className="cs__arch-tag mono">{arch.tagline}</div>
                  <div className="cs__arch-strong mono">
                    + {arch.strengths.slice(0, 3).join(' · ')}
                  </div>
                  <div className="cs__arch-weak mono">− {arch.weaknesses.join(' · ')}</div>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel label="04" caption="Vehículo político">
          <div className="cs__party">
            {PARTY_CHOICES.map((opt) => (
              <button
                type="button"
                key={opt.mode}
                className="cs__party-opt"
                data-selected={partyMode === opt.mode}
                onClick={() => setPartyMode(opt.mode)}
              >
                <div className="cs__party-label">{opt.label}</div>
                <div className="cs__party-desc">{opt.description}</div>
              </button>
            ))}
          </div>
          {partyMode === 'inside_party' && (
            <div className="cs__form">
              <label className="cs__field">
                <span className="cs__label mono">PARTIDO</span>
                <select
                  className="cs__input"
                  value={partyId}
                  onChange={(e) => setPartyId(e.target.value as PartyId)}
                >
                  {PARTY_IDS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </Panel>
      </div>

      <div className="cs__footer">
        <button type="button" className="cs__back" onClick={() => navigate('menu')}>
          ← VOLVER AL MENÚ
        </button>
        <button type="button" className="cs__start" onClick={handleStart}>
          COMENZAR CARRERA <span className="mono">↵</span>
        </button>
      </div>
    </div>
  );
}

function SliderRow({
  label,
  left,
  right,
  value,
  onChange,
}: {
  label: string;
  left: string;
  right: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="cs__slider">
      <span className="cs__slider-label mono">{label}</span>
      <span className="cs__slider-side mono">{left}</span>
      <input
        type="range"
        min={-1}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="cs__slider-input"
      />
      <span className="cs__slider-side mono">{right}</span>
      <span className="cs__slider-val mono">{value.toFixed(2)}</span>
    </div>
  );
}
