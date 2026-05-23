/* =============================================================================
   MODAL — Crisis
   Briefing del evento activo: contexto, opciones de respuesta y consejo de
   campaña. Cierra al confirmar, posponer, hacer clic fuera o pulsar Escape.
   ============================================================================= */

import { useState } from 'react';
import { ProvinceMap } from '@/components';
import { CRISIS_ADVISORS, PROVINCES } from '@/content';
import { useGameStore } from '@/state/gameStore';
import { useUiStore } from '@/state/uiStore';

export function CrisisModal() {
  const event = useGameStore((s) => s.activeEvent);
  const resolveEventChoice = useGameStore((s) => s.resolveEventChoice);
  const dismissActiveEvent = useGameStore((s) => s.dismissActiveEvent);
  const closeModal = useUiStore((s) => s.closeModal);
  const [chosen, setChosen] = useState<number | null>(null);

  const handlePostpone = () => {
    dismissActiveEvent();
    closeModal();
  };

  const handleConfirm = () => {
    if (chosen === null) return;
    resolveEventChoice(chosen);
    closeModal();
  };

  if (!event) return null;
  const province = PROVINCES.find((p) => p.id === event.location);

  return (
    <div className="shroud" onClick={closeModal}>
      <div className="crisis" onClick={(e) => e.stopPropagation()}>
        <div className="crisis__siren">
          <span className="crisis__siren-dot" />
          <span className="mono">EVENTO ENTRANTE · {event.classification}</span>
          <span className="crisis__timer mono">TIMER {event.timer}</span>
          <button type="button" className="iconbtn" onClick={closeModal} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="crisis__body">
          <div className="crisis__left">
            <div className="crisis__id mono">{event.id}</div>
            {province && (
              <div className="crisis__loc mono">
                ◉ {province.id} · {province.name.toUpperCase()} · CAP {province.capital.toUpperCase()}
              </div>
            )}
            <h2 className="crisis__headline">{event.headline}</h2>
            <p className="crisis__summary">{event.summary}</p>

            <div className="crisis__meta">
              <div className="crisis__meta-row mono">
                <span>SENTIMIENTO NACIONAL</span>
                <span className="crisis-neg">{event.sentiment.national}</span>
              </div>
              <div className="crisis__meta-row mono">
                <span>SENTIMIENTO LOCAL</span>
                <span className="crisis-neg">{event.sentiment.local}</span>
              </div>
              <div className="crisis__meta-row mono">
                <span>BASE PROPIA</span>
                <span className="crisis-neg">{event.sentiment.base}</span>
              </div>
              <div className="crisis__meta-row mono">
                <span>RIESGO DE ESCALADA</span>
                <span className="crisis-warn">ALTO · 48h</span>
              </div>
            </div>

            <div className="crisis__minimap">
              <ProvinceMap
                fillOf={(id) => (id === event.location ? '#C24A4A' : 'var(--bg-elev)')}
                showLabels={false}
              />
            </div>
          </div>

          <div className="crisis__right">
            <div className="crisis__head mono">
              <span>OPCIONES DE RESPUESTA</span>
              <span>{String(event.options.length).padStart(2, '0')}</span>
            </div>
            <div className="crisis__opts">
              {event.options.map((option, i) => (
                <button
                  type="button"
                  key={option.label}
                  className="crisisopt"
                  data-selected={chosen === i}
                  onClick={() => setChosen(i)}
                >
                  <div className="crisisopt__idx mono">{String.fromCharCode(65 + i)}</div>
                  <div className="crisisopt__body">
                    <div className="crisisopt__label">{option.label}</div>
                    <div className="crisisopt__line mono">▸ COSTO · {option.cost}</div>
                    <div className="crisisopt__line mono">▸ EFECTO · {option.effect}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="crisis__advisors">
              <div className="crisis__advisors-head mono">CONSEJO DE CAMPAÑA</div>
              {CRISIS_ADVISORS.map((advisor) => (
                <div className="crisis__advisor" key={advisor.role}>
                  <span className="crisis__advisor-role mono">{advisor.role}</span>
                  <span className="crisis__advisor-quote">“{advisor.quote}”</span>
                  <span className="crisis__advisor-rec mono">{advisor.recommendation}</span>
                </div>
              ))}
            </div>

            <div className="crisis__actions">
              <button type="button" className="btn btn--ghost" onClick={handlePostpone}>
                POSPONER 1h
              </button>
              <button
                type="button"
                className="btn btn--primary"
                disabled={chosen === null}
                onClick={handleConfirm}
              >
                CONFIRMAR DECISIÓN
                {chosen !== null ? ` · ${String.fromCharCode(65 + chosen)}` : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
