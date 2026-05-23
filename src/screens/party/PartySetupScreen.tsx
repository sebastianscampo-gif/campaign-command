/* =============================================================================
   SCREENS — Party Setup
   Pantalla de creación del partido: identidad, tipo, ideología y estrategia.
   ============================================================================= */

import { useState } from 'react';
import { Panel, SectionHead } from '@/components';
import { PROVINCES } from '@/content';
import type { ProvinceId } from '@/content';
import {
  PARTY_TYPES,
  PARTY_TYPE_ORDER,
  usePartyStore,
} from '@/party';
import type {
  GrowthStrategy,
  Ideology,
  LeadershipStyle,
  PartyTypeId,
} from '@/party';
import { useUiStore } from '@/state/uiStore';

const LEADERSHIP_OPTIONS: readonly { id: LeadershipStyle; label: string }[] = [
  { id: 'inspirational', label: 'Inspiracional' },
  { id: 'pragmatic', label: 'Pragmático' },
  { id: 'authoritarian', label: 'Mando fuerte' },
  { id: 'collegial', label: 'Colegiado' },
  { id: 'confrontational', label: 'Confrontativo' },
];

const STRATEGY_OPTIONS: readonly { id: GrowthStrategy; label: string; description: string }[] = [
  { id: 'territorial', label: 'Territorial', description: 'Sumar provincias, abrir sedes, maquinaria.' },
  { id: 'media', label: 'Mediática', description: 'Influencia en aire y redes, marca primero.' },
  { id: 'institutional', label: 'Institucional', description: 'Bancadas, alianzas legislativas, profesionalismo.' },
  { id: 'militant', label: 'Militante', description: 'Movilización de bases, juventudes activas.' },
  { id: 'opportunistic', label: 'Oportunista', description: 'Pactos coyunturales, cambios de eje, alta volatilidad.' },
];

const PALETTE = ['#d83f3f', '#1f6ee8', '#1e8c5c', '#e4a700', '#7c3aed', '#0d1117'];

export function PartySetupScreen() {
  const startParty = usePartyStore((s) => s.startParty);
  const navigate = useUiStore((s) => s.navigate);

  const [name, setName] = useState('Partido Reformista Democrático');
  const [sigla, setSigla] = useState('PRD');
  const [color, setColor] = useState(PALETTE[1] ?? '#1f6ee8');
  const [slogan, setSlogan] = useState('Reformar sin romper.');
  const [type, setType] = useState<PartyTypeId>('traditional');
  const [originRegion, setOriginRegion] = useState<ProvinceId>('CA');
  const [leadershipStyle, setLeadershipStyle] = useState<LeadershipStyle>('pragmatic');
  const [growthStrategy, setGrowthStrategy] = useState<GrowthStrategy>('territorial');
  const [ideology, setIdeology] = useState<Ideology>({
    economic: 0,
    social: 0,
    authority: 0,
    globalism: 0,
    security: 0,
    market: 0,
    environment: 0,
  });

  const handleStart = () => {
    startParty({
      name: name.trim() || 'Partido sin nombre',
      sigla: sigla.trim().toUpperCase().slice(0, 5) || 'XXX',
      color,
      slogan: slogan.trim() || 'Sin slogan.',
      type,
      originRegion,
      leadershipStyle,
      growthStrategy,
      ideology,
    });
    navigate('party-overview');
  };

  const setIdeologyAxis = (axis: keyof Ideology, value: number) => {
    setIdeology({ ...ideology, [axis]: value });
  };

  return (
    <div className="ps">
      <header className="ps__head">
        <div className="ps__eyebrow mono">MODO PARTIDO · CREACIÓN</div>
        <h1 className="ps__title">Construí tu partido</h1>
        <p className="ps__lede">
          Definí su identidad, su tipo, su ideología y su estrategia de crecimiento.
          Vas a liderarlo en 3 elecciones encadenadas.
        </p>
      </header>

      <div className="ps__grid">
        <Panel label="01" caption="Identidad">
          <div className="ps__form">
            <label className="ps__field">
              <span className="ps__label mono">NOMBRE</span>
              <input
                type="text"
                className="ps__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="ps__field">
              <span className="ps__label mono">SIGLA</span>
              <input
                type="text"
                className="ps__input"
                maxLength={5}
                value={sigla}
                onChange={(e) => setSigla(e.target.value.toUpperCase())}
              />
            </label>
            <label className="ps__field">
              <span className="ps__label mono">SLOGAN</span>
              <input
                type="text"
                className="ps__input"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />
            </label>
            <div className="ps__field">
              <span className="ps__label mono">COLOR</span>
              <div className="ps__palette">
                {PALETTE.map((c) => (
                  <button
                    type="button"
                    key={c}
                    className="ps__swatch"
                    data-selected={c === color}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>
            <label className="ps__field">
              <span className="ps__label mono">REGIÓN DE ORIGEN</span>
              <select
                className="ps__input"
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
          </div>
        </Panel>

        <Panel label="02" caption="Tipo de partido" className="ps__types-panel">
          <div className="ps__types">
            {PARTY_TYPE_ORDER.map((id) => {
              const def = PARTY_TYPES[id];
              return (
                <button
                  type="button"
                  key={id}
                  className="ps__type"
                  data-selected={type === id}
                  onClick={() => setType(id)}
                >
                  <div className="ps__type-name">{def.name}</div>
                  <div className="ps__type-tag mono">{def.tagline}</div>
                  <div className="ps__type-strong mono">+ {def.strengths.slice(0, 3).join(' · ')}</div>
                  <div className="ps__type-weak mono">− {def.weaknesses.join(' · ')}</div>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel label="03" caption="Ideología (7 ejes)">
          <SectionHead title="Cada eje -1..+1" sub="Editable durante la partida con costo." />
          <div className="ps__slider-group">
            <SliderRow label="ECONOMÍA" left="Izquierda" right="Derecha" value={ideology.economic} onChange={(v) => setIdeologyAxis('economic', v)} />
            <SliderRow label="SOCIAL" left="Progresista" right="Conservador" value={ideology.social} onChange={(v) => setIdeologyAxis('social', v)} />
            <SliderRow label="AUTORIDAD" left="Democrático" right="Autoritario" value={ideology.authority} onChange={(v) => setIdeologyAxis('authority', v)} />
            <SliderRow label="GLOBAL" left="Nacionalista" right="Globalista" value={ideology.globalism} onChange={(v) => setIdeologyAxis('globalism', v)} />
            <SliderRow label="SEGURIDAD" left="Garantista" right="Mano dura" value={ideology.security} onChange={(v) => setIdeologyAxis('security', v)} />
            <SliderRow label="ESTADO" left="Estatista" right="Libre mercado" value={ideology.market} onChange={(v) => setIdeologyAxis('market', v)} />
            <SliderRow label="AMBIENTE" left="Extractivista" right="Verde" value={ideology.environment} onChange={(v) => setIdeologyAxis('environment', v)} />
          </div>
        </Panel>

        <Panel label="04" caption="Estilo y estrategia">
          <div className="ps__form">
            <label className="ps__field">
              <span className="ps__label mono">ESTILO DE LIDERAZGO</span>
              <select
                className="ps__input"
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
          </div>
          <SectionHead title="Estrategia de crecimiento" />
          <div className="ps__strategies">
            {STRATEGY_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.id}
                className="ps__strategy"
                data-selected={growthStrategy === opt.id}
                onClick={() => setGrowthStrategy(opt.id)}
              >
                <div className="ps__strategy-label">{opt.label}</div>
                <div className="ps__strategy-desc">{opt.description}</div>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="ps__footer">
        <button type="button" className="ps__back" onClick={() => navigate('menu')}>
          ← VOLVER AL MENÚ
        </button>
        <button type="button" className="ps__start" onClick={handleStart}>
          FUNDAR PARTIDO <span className="mono">↵</span>
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
    <div className="ps__slider">
      <span className="ps__slider-label mono">{label}</span>
      <span className="ps__slider-side mono">{left}</span>
      <input
        type="range"
        min={-1}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="ps__slider-input"
      />
      <span className="ps__slider-side mono">{right}</span>
      <span className="ps__slider-val mono">{value.toFixed(2)}</span>
    </div>
  );
}
