/* =============================================================================
   MEDIA ECOSYSTEM — Paneles centrales (uno por pestaña)
   ============================================================================= */

import type { ReactNode } from 'react';
import {
  INFLUENCERS,
  PODCASTS,
  PRESS_ARTICLES,
  STANCE_LABEL,
  TV_CHANNELS,
} from './mediaData';

export function MepCard({
  title,
  meta,
  flush = false,
  children,
}: {
  title: string;
  meta?: string;
  flush?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mep-card">
      <div className="mep-card__head mono">
        <span>{title}</span>
        {meta && <span>{meta}</span>}
      </div>
      <div className={flush ? 'mep-card__body mep-card__body--flush' : 'mep-card__body'}>
        {children}
      </div>
    </div>
  );
}

/* ---- STREAM ---------------------------------------------------------------- */

const VOLUME_BARS = Array.from(
  { length: 52 },
  (_, i) => 14 + (Math.sin(i * 0.5) * 0.5 + 0.5) * 62 + (i / 52) * 18,
);

export function StreamPane() {
  return (
    <div className="mep-stack">
      <MepCard title="COMPOSE · ANUNCIO OFICIAL" meta="BORRADOR">
        <div className="mep-compose">
          <span className="mep-compose__meta mono">Borrador · 22:14</span>
          <p className="mep-compose__text">
            Gracias por estar con nosotros esta noche. Lo que está pasando en San Esteban no es la
            victoria de un partido — es <em>una promesa</em> que volvió a su lugar.
            <span className="mep-compose__token">[insertar dato CA]</span>
          </p>
        </div>
        <div className="mep-compose__actions">
          {['PUBLICAR · PULSE', 'HILO · 12 POSTS', 'FRAME · 60s', '+ TODOS'].map((label) => (
            <button type="button" key={label} className="mep-btn">
              {label}
            </button>
          ))}
        </div>
      </MepCard>

      <MepCard title="VOLUMEN · ÚLTIMOS 60 MIN" meta="+22%">
        <div className="mep-volume">
          {VOLUME_BARS.map((height, i) => (
            <span key={i} style={{ height: `${height}%` }} />
          ))}
        </div>
      </MepCard>

      <MepCard title="INFLUENCERS · TOP REACH" meta="32" flush>
        {INFLUENCERS.map((person) => (
          <div className="mep-influencer mono" key={person.handle}>
            <span className="mep-influencer__handle">{person.handle}</span>
            <span className="mep-influencer__reach">{person.reach}</span>
            <span className="mep-influencer__stance" data-stance={person.stance}>
              {STANCE_LABEL[person.stance]}
            </span>
          </div>
        ))}
      </MepCard>
    </div>
  );
}

/* ---- LIVE TV --------------------------------------------------------------- */

export function LiveTVPane() {
  return (
    <MepCard title="LIVE · AURORA TV · CHANNEL 04" meta="● ON AIR">
      <div className="mep-live">
        <svg viewBox="0 0 600 320" preserveAspectRatio="xMidYMid slice" className="mep-live__svg">
          <defs>
            <linearGradient id="livetv-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1A0A0F" />
              <stop offset="100%" stopColor="#050709" />
            </linearGradient>
          </defs>
          <rect width="600" height="320" fill="url(#livetv-bg)" />
          <rect x="60" y="20" width="220" height="120" fill="#0E1A28" stroke="#26404E" strokeWidth="0.5" />
          <text x="170" y="42" textAnchor="middle" fill="#5B8FB9" fontSize="10" className="mep-live__mono">
            PROYECCIÓN · 38%
          </text>
          <text x="170" y="84" textAnchor="middle" fill="#F4E9C8" fontSize="34" fontFamily="var(--font-serif)">
            29.4%
          </text>
          <text x="170" y="104" textAnchor="middle" fill="#5B8FB9" fontSize="11" className="mep-live__mono">
            PRD · VASCONCELOS
          </text>
          <rect x="320" y="20" width="220" height="120" fill="#1A0A0A" stroke="#3A1A1A" strokeWidth="0.5" />
          <text x="430" y="42" textAnchor="middle" fill="#C24A4A" fontSize="10" className="mep-live__mono">
            PROYECCIÓN · 38%
          </text>
          <text x="430" y="84" textAnchor="middle" fill="#F4E9C8" fontSize="34" fontFamily="var(--font-serif)">
            28.1%
          </text>
          <text x="430" y="104" textAnchor="middle" fill="#C24A4A" fontSize="11" className="mep-live__mono">
            MNP · ORELLANA
          </text>
          <rect x="120" y="200" width="360" height="90" fill="#2A1414" />
          {[220, 380].map((x, i) => (
            <g key={x} transform={`translate(${x} 180)`}>
              <circle r="22" fill="#1A1010" />
              <path d="M -34 50 Q -34 18 0 18 Q 34 18 34 50 Z" fill="#1A1010" />
              <text y="64" textAnchor="middle" fill="#F4E9C8" fontSize="8" className="mep-live__mono">
                {i === 0 ? 'CARLA MENDIZÁBAL' : 'IVÁN OTÁROLA'}
              </text>
            </g>
          ))}
        </svg>
        <div className="mep-live__chrome mono">● LIVE · STUDIO 01 · CAM 02</div>
        <div className="mep-live__lower3">
          <div className="mep-live__l3-eyebrow mono">▶ AVANCE · MESAS REPORTANDO</div>
          <div className="mep-live__l3-head">
            Vasconcelos al frente con +1.3 pt sobre Orellana
          </div>
        </div>
      </div>

      <div className="mep-channels">
        {TV_CHANNELS.map((channel) => (
          <div className="mep-channel" key={channel}>
            <span className="mep-channel__live mono">● LIVE</span>
            <span className="mep-channel__name mono">{channel}</span>
          </div>
        ))}
      </div>
    </MepCard>
  );
}

/* ---- PRESS ----------------------------------------------------------------- */

export function PressPane() {
  return (
    <div className="mep-stack">
      {PRESS_ARTICLES.map((article) => (
        <div className="mep-card" key={article.headline}>
          <div className="mep-card__head mono">
            <span>
              {article.src} · {article.date}
            </span>
            <span className="mep-press__tone" data-tone={article.tone}>
              {article.tone === 'pos' ? 'FAVORABLE' : article.tone === 'neg' ? 'HOSTIL' : 'NEUTRAL'}
            </span>
          </div>
          <div className="mep-card__body">
            <h3 className="mep-press__headline">{article.headline}</h3>
            <p className="mep-press__summary">{article.summary}</p>
            <div className="mep-press__foot mono">
              <span>◐ 412k LECTORES</span>
              <span>↻ 1.2k COMPARTIDOS</span>
              <span>◈ ENVIAR A WAR ROOM</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---- PODCASTS -------------------------------------------------------------- */

export function PodcastsPane() {
  return (
    <MepCard title="PODCASTS · COMENTARISTAS" meta={`${PODCASTS.length} ACTIVOS`} flush>
      {PODCASTS.map((podcast) => (
        <div className="mep-pod" key={podcast.title}>
          <div className="mep-pod__cover">◯</div>
          <div className="mep-pod__info">
            <div className="mep-pod__title">{podcast.title}</div>
            <div className="mep-pod__sub mono">
              {podcast.sub} · {podcast.episode} · {podcast.audience}
            </div>
          </div>
          <span className="mep-pod__stance" data-stance={podcast.stance}>
            {STANCE_LABEL[podcast.stance]}
          </span>
        </div>
      ))}
    </MepCard>
  );
}
