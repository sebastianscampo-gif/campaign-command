/* =============================================================================
   MAIN MENU — Fondo viviente
   Capas atmosféricas del menú. Toda la animación es CSS (parallax, pulsos,
   flashes, grano): el menú no provoca ni un re-render por frame, frente al
   prototipo que hacía setState a 60fps sobre todo el árbol del menú.
   ============================================================================= */

import { PROVINCES } from '@/content';
import { hashRange } from './scenes/rand';

const FLASHES = Array.from({ length: 14 }, (_, i) => ({
  x: hashRange(i + 3, 8, 92),
  y: hashRange(i + 60, 58, 94),
  delay: hashRange(i + 90, 0, 9),
  duration: hashRange(i + 120, 5, 12),
}));

export function MenuBackground() {
  return (
    <div className="cmenu__bg" aria-hidden="true">
      <svg viewBox="0 0 1000 720" preserveAspectRatio="xMidYMid slice" className="cmenu__map">
        <defs>
          <radialGradient id="cmenu-rad" cx="50%" cy="48%" r="62%">
            <stop offset="0%" stopColor="#1A2230" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#070A0E" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="1000" height="720" fill="url(#cmenu-rad)" />

        <g>
          {PROVINCES.map((p) => (
            <polygon
              key={p.id}
              points={p.polygon}
              fill="#11171F"
              fillOpacity="0.55"
              stroke="#1F2731"
              strokeWidth="0.7"
            />
          ))}
        </g>

        <g stroke="#161D26" strokeWidth="0.4">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 60} x2="1000" y2={i * 60} />
          ))}
          {Array.from({ length: 18 }, (_, i) => (
            <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="720" />
          ))}
        </g>

        <g>
          <circle cx="500" cy="295" r="4" fill="var(--accent)" />
          <circle
            className="cmenu-pulse"
            cx="500"
            cy="295"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.6"
          />
          <circle
            className="cmenu-pulse"
            cx="500"
            cy="295"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="0.4"
            style={{ animationDelay: '1.6s' }}
          />
        </g>

        <g className="cmenu-heli">
          <circle cx="0" cy="118" r="2.4" fill="var(--accent)" opacity="0.85" />
          <circle cx="0" cy="118" r="6" fill="none" stroke="var(--accent)" strokeWidth="0.4" opacity="0.45" />
        </g>
      </svg>

      <div className="cmenu__crowd cmenu__crowd--far" />
      <div className="cmenu__crowd cmenu__crowd--near" />

      <div className="cmenu__flashes">
        {FLASHES.map((f, i) => (
          <span
            key={i}
            className="cmenu__flash"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              animationDelay: `${f.delay}s`,
              animationDuration: `${f.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="cmenu__vignette" />
      <div className="cmenu__scan" />
      <div className="cmenu__grain" />
    </div>
  );
}
