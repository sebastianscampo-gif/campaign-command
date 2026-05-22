/* =============================================================================
   MODAL — Dossier de la candidata
   Perfil completo: identidad e ideología (contenido) más imagen y aprobación
   en vivo (game store).
   ============================================================================= */

import { SectionHead } from '@/components';
import { CANDIDATE } from '@/content';
import { useGameStore } from '@/state/gameStore';
import { useUiStore } from '@/state/uiStore';

const AXIS_LABELS: Record<string, [string, string]> = {
  economic: ['ESTATISMO', 'MERCADO'],
  social: ['PROGRESISTA', 'CONSERVADOR'],
  authority: ['LIBERTARIO', 'AUTORITARIO'],
};

const IMAGE_LABELS: Record<string, string> = {
  charisma: 'CARISMA',
  competence: 'COMPETENCIA',
  integrity: 'INTEGRIDAD',
  decisiveness: 'DECISIÓN',
};

const APPROVAL_LABELS: Record<string, string> = {
  national: 'NACIONAL',
  men: 'HOMBRES',
  women: 'MUJERES',
  youth: 'JÓVENES',
  elders: 'MAYORES',
  urban: 'URBANO',
  rural: 'RURAL',
};

export function CandidateModal() {
  const candidate = useGameStore((s) => s.candidate);
  const closeModal = useUiStore((s) => s.closeModal);

  const initials = CANDIDATE.name
    .split(' ')
    .map((word) => word[0])
    .join('');

  return (
    <div className="shroud" onClick={closeModal}>
      <div className="dossier-modal" onClick={(e) => e.stopPropagation()}>
        <div className="dm__top">
          <div className="dm__topline mono">
            <span>DOSSIER · CANDIDATA</span>
            <span>FILE-PRD-001</span>
            <span>CLASIFICACIÓN · PÚBLICA</span>
          </div>
          <button type="button" className="iconbtn" onClick={closeModal} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="dm__body">
          <div className="dm__left">
            <div className="dm__photo">
              <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMid slice">
                <rect width="200" height="250" fill="#161D26" />
                <pattern id="dm-hatch" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M0,8 L8,0" stroke="#2A3340" strokeWidth="1" />
                </pattern>
                <rect width="200" height="250" fill="url(#dm-hatch)" />
                <text x="100" y="148" textAnchor="middle" fontSize="78" fill="#C9A961" fontFamily="var(--font-serif)">
                  {initials}
                </text>
                <text x="100" y="226" textAnchor="middle" fontSize="9" fill="#5A6470" fontFamily="var(--font-mono)">
                  [ FOTO OFICIAL ]
                </text>
              </svg>
            </div>
            <div className="dm__name">{CANDIDATE.name}</div>
            <div className="dm__role mono">CANDIDATA PRESIDENCIAL · PRD · 2026</div>
            <p className="dm__bio">{CANDIDATE.background}</p>

            <SectionHead index="01" title="Rasgos" />
            <div className="dm__traits">
              {CANDIDATE.traits.map((trait) => (
                <span className="dm__trait" key={trait}>
                  {trait}
                </span>
              ))}
            </div>

            <SectionHead index="02" title="Ideología" />
            <div className="dm__ideo">
              {(Object.entries(CANDIDATE.ideology) as [string, number][]).map(([axis, value]) => {
                const [left, right] = AXIS_LABELS[axis] ?? [axis, axis];
                return (
                  <div className="dm__ideo-row" key={axis}>
                    <span className="dm__ideo-label mono">{left}</span>
                    <div className="dm__ideo-track">
                      <span className="dm__ideo-center" />
                      <span
                        className="dm__ideo-marker"
                        style={{ left: `${((value + 1) / 2) * 100}%` }}
                      />
                    </div>
                    <span className="dm__ideo-label dm__ideo-label--right mono">{right}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="dm__right">
            <SectionHead index="03" title="Imagen pública" />
            <div className="dm__image">
              {(Object.entries(candidate.image) as [string, number][]).map(([key, value]) => (
                <div className="dm__imgrow" key={key}>
                  <span className="dm__imgrow-label mono">{IMAGE_LABELS[key] ?? key}</span>
                  <div className="dm__imgrow-bar">
                    <div className="dm__imgrow-fill" style={{ width: `${value}%` }} />
                  </div>
                  <span className="dm__imgrow-val mono">{value}/100</span>
                </div>
              ))}
            </div>

            <SectionHead index="04" title="Aprobación cruzada" />
            <div className="dm__appgrid">
              {(Object.entries(candidate.approval) as [string, number][]).map(([key, value]) => (
                <div className="dm__appcell" key={key}>
                  <div className="dm__appcell-label mono">{APPROVAL_LABELS[key] ?? key}</div>
                  <div
                    className="dm__appcell-val mono"
                    data-band={value > 50 ? 'good' : value > 40 ? 'ok' : 'bad'}
                  >
                    {value}%
                  </div>
                </div>
              ))}
            </div>

            <SectionHead index="05" title="Línea histórica" />
            <div className="dm__timeline">
              {CANDIDATE.timeline.map((entry) => (
                <div className="dm__tl-row" key={entry.year}>
                  <span className="dm__tl-year mono">{entry.year}</span>
                  <span className="dm__tl-dot" />
                  <span className="dm__tl-label">{entry.label}</span>
                </div>
              ))}
            </div>

            <SectionHead index="06" title="Escándalos y vulnerabilidades" />
            <div className="dm__scandals">
              {CANDIDATE.scandals.map((scandal) => (
                <div className="dm__scandal" key={scandal.year}>
                  <span className="dm__scandal-year mono">{scandal.year}</span>
                  <span className="dm__scandal-sev mono">SEV · {scandal.severity.toUpperCase()}</span>
                  <span className="dm__scandal-label">{scandal.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
