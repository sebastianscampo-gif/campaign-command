/* =============================================================================
   DASHBOARD — Paneles de inteligencia (06 · 08 · 10)
   Feed en vivo, calendario de campaña y asesoría estratégica.
   ============================================================================= */

import { Panel } from '@/components';
import { useGameStore } from '@/state/gameStore';
import { useUiStore } from '@/state/uiStore';
import { STRATEGY_RECS, TRENDS, TV_COMMENTARY } from './dashData';

/* ---- 06 · Live tickers ----------------------------------------------------- */

export function TickerPanel() {
  const news = useGameStore((s) => s.news);
  const navigate = useUiStore((s) => s.navigate);

  const fullRoom = (
    <button type="button" className="linkbtn mono" onClick={() => navigate('media')}>
      SALA COMPLETA →
    </button>
  );

  return (
    <Panel label="06" caption="Live tickers · intel feed" className="span-4" right={fullRoom}>
      <div className="intel">
        <div className="intel__head mono">
          <span className="intel__dot" data-kind="breaking" />
          <span>BREAKING · 24h</span>
          <span className="intel__count">{news.length} items</span>
        </div>
        <div className="intel__list">
          {news.slice(0, 4).map((item) => (
            <div className="intel__row" key={item.time + item.src} data-tone={item.tone}>
              <span className="intel__time mono">{item.time}</span>
              <span className="intel__src mono">{item.src}</span>
              <span className="intel__headline">{item.headline}</span>
            </div>
          ))}
        </div>

        <div className="intel__head mono">
          <span className="intel__dot" data-kind="social" />
          <span>SOCIAL · TRENDING</span>
          <span className="intel__count">{String(TRENDS.length).padStart(2, '0')}</span>
        </div>
        <div className="intel__trends">
          {TRENDS.map((trend) => (
            <div className="intel__trend mono" key={trend.tag}>
              <span className="intel__trend-rank">{trend.rank}</span>
              <span className="intel__trend-tag">{trend.tag}</span>
              <span className="intel__trend-count">{trend.count}</span>
              <span className="intel__trend-dir" data-dir={trend.dir}>
                {trend.dir === 'up' ? '▲' : trend.dir === 'down' ? '▼' : '—'}
              </span>
            </div>
          ))}
        </div>

        <div className="intel__head mono">
          <span className="intel__dot" data-kind="tv" />
          <span>TV · COMMENTARY</span>
        </div>
        <div className="intel__tv">
          {TV_COMMENTARY.map((line) => (
            <div className="intel__tv-row" key={line.channel}>
              <span className="intel__tv-ch mono" data-tone={line.tone}>
                {line.channel}
              </span>
              <span className="intel__tv-text">{line.text}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ---- 08 · Campaign calendar ------------------------------------------------ */

export function CalendarPanel() {
  const calendar = useGameStore((s) => s.calendar);

  return (
    <Panel label="08" caption="Campaign calendar · 7d" className="span-4">
      <div className="cal">
        {calendar.map((event) => (
          <div className="calrow" key={event.day + event.where} data-type={event.type}>
            <span className="calrow__day mono">{event.day}</span>
            <span className="calrow__type mono">{event.type.toUpperCase()}</span>
            <div className="calrow__main">
              <div className="calrow__where">{event.where}</div>
              <div className="calrow__note mono">{event.note}</div>
            </div>
            <div className="calrow__intensity" aria-label={`Intensidad ${event.intensity}/10`}>
              {Array.from({ length: 10 }, (_, j) => (
                <span key={j} className="calrow__tick" data-on={j < event.intensity} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ---- 10 · Strategy advisory ------------------------------------------------ */

export function StrategyPanel() {
  return (
    <Panel label="10" caption="Strategy panel · AI advisory" className="span-8">
      <div className="strat">
        <div className="strat__head mono">
          <span>● RECOMENDACIONES DEL DÍA · MODELO BAYESIANO</span>
          <span>{String(STRATEGY_RECS.length).padStart(2, '0')} ACTIVAS</span>
        </div>
        {STRATEGY_RECS.map((rec) => (
          <div className="strat__row" data-tone={rec.tone} key={rec.title}>
            <span className="strat__prio mono">{rec.priority}</span>
            <div className="strat__body">
              <div className="strat__title">{rec.title}</div>
              <div className="strat__exp">{rec.explanation}</div>
            </div>
            <span className="strat__roi mono" data-tone={rec.roiTone}>
              {rec.roi}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
