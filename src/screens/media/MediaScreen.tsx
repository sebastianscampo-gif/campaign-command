/* =============================================================================
   SCREENS — Media Ecosystem
   Sala de operaciones mediáticas. Pantalla inmersiva con su propia barra y
   pestañas. La sentiment-wave se anima con CSS.
   ============================================================================= */

import { useState } from 'react';
import { Sparkline } from '@/components';
import { useUiStore } from '@/state/uiStore';
import { LiveTVPane, MepCard, PodcastsPane, PressPane, StreamPane } from './MediaPanes';
import {
  MEDIA_FRAMES,
  MEDIA_POSTS,
  MEDIA_TRENDS,
  PRESS_RELEASES,
} from '@/content';
import type { MediaTab } from '@/content';

const TABS: readonly { id: MediaTab; label: string }[] = [
  { id: 'stream', label: '◐ STREAM' },
  { id: 'press', label: '▤ PRESS' },
  { id: 'podcasts', label: '◯ PODCASTS' },
  { id: 'live', label: '● LIVE TV' },
];

const SENT_WAVE = Array.from({ length: 48 }, (_, i) => i);

function initials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function MediaScreen() {
  const [tab, setTab] = useState<MediaTab>('stream');
  const navigate = useUiStore((s) => s.navigate);

  return (
    <div className="mediaeco">
      <header className="mediaeco__top">
        <div className="mediaeco__brand">
          <div className="mediaeco__brand-mark">◯</div>
          <div>
            <div className="mediaeco__brand-name">MEDIA ECOSYSTEM</div>
            <div className="mediaeco__brand-sub mono">STREAM · PRESS · PODCASTS · TRENDS</div>
          </div>
        </div>
        <nav className="mediaeco__tabs">
          {TABS.map((item) => (
            <button
              type="button"
              key={item.id}
              className={tab === item.id ? 'mediaeco__tab mediaeco__tab--active' : 'mediaeco__tab'}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mediaeco__top-right mono">
          <span>
            SENTIMENT NET · <span className="mep-pos">+18.4</span>
          </span>
          <span>REACH · 4.2M / 24h</span>
          <button type="button" className="mediaeco__exit" onClick={() => navigate('menu')}>
            ← MENU
          </button>
        </div>
      </header>

      <aside className="mediaeco__left">
        <MepCard title="STREAM · PULSE FEED" meta="LIVE · 1.4k/min" flush>
          {MEDIA_POSTS.map((post) => (
            <article className="mep-post" key={post.handle}>
              <div className="mep-post__avatar" style={{ background: post.color }}>
                {initials(post.user)}
              </div>
              <div className="mep-post__main">
                <div className="mep-post__head">
                  <span className="mep-post__user">
                    {post.user}
                    {post.verified && <span className="mep-post__check">◈</span>}
                  </span>
                  <span className="mep-post__handle mono">{post.handle}</span>
                  <span className="mep-post__time mono">· {post.time}</span>
                </div>
                <p className="mep-post__text">{post.text}</p>
                <div className="mep-post__meta mono">
                  <span>↻ {post.repost}</span>
                  <span>♡ {post.react}</span>
                  <span>◐ {post.views}</span>
                  <span className="mep-post__reply">✎ RESPONDER</span>
                </div>
              </div>
            </article>
          ))}
        </MepCard>
      </aside>

      <main className="mediaeco__center">
        {tab === 'stream' && <StreamPane />}
        {tab === 'press' && <PressPane />}
        {tab === 'podcasts' && <PodcastsPane />}
        {tab === 'live' && <LiveTVPane />}
      </main>

      <aside className="mediaeco__right">
        <MepCard title="TENDENCIAS · NACIONAL" meta="06" flush>
          {MEDIA_TRENDS.map((trend, i) => (
            <div className="mep-trend" key={trend.tag}>
              <span className="mep-trend__rank mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="mep-trend__tag">{trend.tag}</span>
              <span className="mep-trend__vol mono">{trend.volume}</span>
              <Sparkline data={trend.spark} color="var(--accent)" width={84} height={20} />
            </div>
          ))}
        </MepCard>

        <MepCard title="SENTIMENT · CANDIDATA" meta="+18.4">
          <div className="mep-wave">
            {SENT_WAVE.map((i) => (
              <span key={i} style={{ animationDelay: `${(i * 0.05) % 1.4}s` }} />
            ))}
          </div>
          <div className="mep-sentiment">
            <div className="mep-sentiment__cell">
              <div className="mep-sentiment__label mono">POSITIVO</div>
              <div className="mep-sentiment__val mep-pos">52%</div>
              <div className="mep-sentiment__sub mono">+3.2 24h</div>
            </div>
            <div className="mep-sentiment__cell">
              <div className="mep-sentiment__label mono">NEUTRAL</div>
              <div className="mep-sentiment__val">31%</div>
              <div className="mep-sentiment__sub mono">−1.1 24h</div>
            </div>
            <div className="mep-sentiment__cell">
              <div className="mep-sentiment__label mono">NEGATIVO</div>
              <div className="mep-sentiment__val mep-neg">17%</div>
              <div className="mep-sentiment__sub mono">−2.1 24h</div>
            </div>
          </div>
        </MepCard>

        <MepCard title="PRESS RELEASES" meta="04" flush>
          {PRESS_RELEASES.map((release) => (
            <div className="mep-release" key={release.headline}>
              <span className="mep-release__src mono">{release.src}</span>
              <span className="mep-release__headline" data-tone={release.tone}>
                {release.headline}
              </span>
              <span className="mep-release__time mono">{release.time}</span>
            </div>
          ))}
        </MepCard>
      </aside>

      <div className="mediaeco__lower">
        <div className="mediaeco__lower-head mono">
          <span>FRAMES · CLIPS CORTOS · TRENDING</span>
          <span>08 ACTIVOS · 4.2M VIEWS / 24H</span>
        </div>
        <div className="mediaeco__frames">
          {MEDIA_FRAMES.map((frame) => (
            <div className="mep-frame" key={frame.handle}>
              <span className="mep-frame__views mono">● {frame.views}</span>
              <div className="mep-frame__caption mono">
                <span className="mep-frame__handle">{frame.handle}</span>
                <span>{frame.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
