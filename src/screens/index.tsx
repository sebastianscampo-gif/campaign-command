/* =============================================================================
   SCREENS — Enrutador de pantallas
   Mapea el ScreenId activo al componente de pantalla. Switch exhaustivo sobre
   la unión ScreenId: añadir una pantalla nueva sin cubrirla es error de tipos.
   ============================================================================= */

import type { ScreenId } from '@/state/types';
import { MainMenuScreen } from './main-menu';
import { MapScreen } from './map';
import { DashboardScreen } from './dashboard';
import { ElectionNightScreen } from './election';
import { MediaScreen } from './media';
import { PlaceholderScreen } from './PlaceholderScreen';
import { StyleGuideScreen } from './StyleGuideScreen';
import {
  CareerOverviewScreen,
  CareerSetupScreen,
  LegacySummaryScreen,
} from './career';
import {
  PartyLegacySummaryScreen,
  PartyOverviewScreen,
  PartySetupScreen,
} from './party';

interface ScreenRouterProps {
  screen: ScreenId;
}

export function ScreenRouter({ screen }: ScreenRouterProps) {
  switch (screen) {
    case 'menu':
      return <MainMenuScreen />;
    case 'map':
      return <MapScreen />;
    case 'dashboard':
      return <DashboardScreen />;
    case 'election':
      return <ElectionNightScreen />;
    case 'media':
      return <MediaScreen />;
    case 'gov':
      return (
        <PlaceholderScreen
          eyebrow="GOVERNANCE · MODE"
          title="Modo gobierno"
          lede="Disponible tras ganar la elección. Gestión del Ejecutivo."
        />
      );
    case 'party':
      return <PartySetupScreen />;
    case 'profile':
      return (
        <PlaceholderScreen
          eyebrow="CANDIDATE · DOSSIER"
          title="Dossier de la candidata"
          lede="Perfil completo de Elena Vasconcelos: trayectoria, imagen e ideología."
        />
      );
    case 'styleguide':
      return <StyleGuideScreen />;
    case 'career-setup':
      return <CareerSetupScreen />;
    case 'career-overview':
      return <CareerOverviewScreen />;
    case 'career-legacy':
      return <LegacySummaryScreen />;
    case 'party-setup':
      return <PartySetupScreen />;
    case 'party-overview':
      return <PartyOverviewScreen />;
    case 'party-legacy':
      return <PartyLegacySummaryScreen />;
  }
}
