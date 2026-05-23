/* =============================================================================
   APP — Componente raíz
   Aplica el tema, enruta la pantalla activa y monta el HUD global. Toda la
   navegación y el tema se leen del uiStore; no hay estado local de pantalla.
   ============================================================================= */

import { useEffect } from 'react';
import { applyTheme } from '@/lib/theme';
import { useUiStore } from '@/state/uiStore';
import type { ScreenId } from '@/state/types';
import { ScreenRouter } from '@/screens';
import { ModalRoot } from '@/screens/modals';
import { TopBar } from './TopBar';
import { NewsTicker } from './NewsTicker';

/** Pantallas inmersivas: ocupan todo el viewport, sin barra ni ticker. */
const FULLSCREEN: ReadonlySet<ScreenId> = new Set<ScreenId>([
  'menu',
  'election',
  'media',
  'career-setup',
  'career-overview',
  'career-legacy',
]);

export function App() {
  const screen = useUiStore((s) => s.screen);
  const theme = useUiStore((s) => s.theme);
  const closeModal = useUiStore((s) => s.closeModal);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeModal]);

  const isFullscreen = FULLSCREEN.has(screen);
  const showTicker = theme.showTicker && !isFullscreen;

  return (
    <div className="app" data-screen={screen}>
      {!isFullscreen && <TopBar />}
      <main className="app__view">
        <ScreenRouter screen={screen} />
      </main>
      {showTicker && <NewsTicker />}
      <ModalRoot />
    </div>
  );
}
