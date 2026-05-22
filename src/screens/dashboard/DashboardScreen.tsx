/* =============================================================================
   SCREENS — Campaign Dashboard (war room)
   Sala de operaciones de campaña: barra de transmisión, hero de la candidata,
   mazo de acciones y diez paneles de inteligencia sobre una grilla de 12.
   ============================================================================= */

import { ActionDeck } from './ActionDeck';
import { BroadcastBar } from './BroadcastBar';
import { CalendarPanel, StrategyPanel, TickerPanel } from './IntelPanels';
import { BlocsPanel, CoalitionPanel, IssuesPanel } from './ElectoratePanels';
import { DashHero } from './DashHero';
import { DemographicsPanel, MomentumPanel, VitalsPanel } from './CandidatePanels';
import { PollingPanel } from './PollingPanel';

export function DashboardScreen() {
  return (
    <div className="dash">
      <div className="dash__scanlines" aria-hidden="true" />

      <BroadcastBar />
      <DashHero />
      <ActionDeck />

      <div className="dash__grid">
        <PollingPanel />
        <VitalsPanel />
        <IssuesPanel />
        <MomentumPanel />
        <CoalitionPanel />
        <TickerPanel />
        <BlocsPanel />
        <CalendarPanel />
        <DemographicsPanel />
        <StrategyPanel />
      </div>
    </div>
  );
}
