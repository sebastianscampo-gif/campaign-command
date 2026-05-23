/* =============================================================================
   MODAL — Career Event
   Mirror del CrisisModal pero leyendo del careerStore. Renderiza el evento
   activo del modo carrera y permite elegir una opción o postponerlo.
   ============================================================================= */

import { useState } from 'react';
import { useCareerStore } from '@/career';
import { useUiStore } from '@/state/uiStore';

export function CareerEventModal() {
  const event = useCareerStore((s) => s.state?.activeCareerEvent ?? null);
  const resolveActiveEvent = useCareerStore((s) => s.resolveActiveEvent);
  const dismissActiveEvent = useCareerStore((s) => s.dismissActiveEvent);
  const closeModal = useUiStore((s) => s.closeModal);
  const [chosen, setChosen] = useState<string | null>(null);

  if (!event) return null;

  const handleDismiss = () => {
    dismissActiveEvent();
    closeModal();
  };

  const handleConfirm = () => {
    if (!chosen) return;
    resolveActiveEvent(chosen);
    closeModal();
  };

  return (
    <div className="shroud" onClick={closeModal}>
      <div className="crisis" onClick={(e) => e.stopPropagation()}>
        <div className="crisis__siren">
          <span className="crisis__siren-dot" />
          <span className="mono">EVENTO DE CARRERA · {event.classification}</span>
          <button type="button" className="iconbtn" onClick={closeModal} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="crisis__body">
          <div className="crisis__left">
            <div className="crisis__id mono">{event.id.toUpperCase()}</div>
            <h2 className="crisis__headline">{event.title}</h2>
            <p className="crisis__summary">{event.description}</p>
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
                  key={option.id}
                  className="crisisopt"
                  data-selected={chosen === option.id}
                  onClick={() => setChosen(option.id)}
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

            <div className="crisis__actions">
              <button type="button" className="btn btn--ghost" onClick={handleDismiss}>
                POSPONER
              </button>
              <button
                type="button"
                className="btn btn--primary"
                disabled={chosen === null}
                onClick={handleConfirm}
              >
                CONFIRMAR DECISIÓN
                {chosen !== null
                  ? ` · ${String.fromCharCode(
                      65 + event.options.findIndex((o) => o.id === chosen),
                    )}`
                  : ''}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
