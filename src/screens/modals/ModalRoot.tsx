/* =============================================================================
   MODAL — Root
   Monta el modal activo según el uiStore. El cierre con Escape lo gobierna App.
   ============================================================================= */

import { useUiStore } from '@/state/uiStore';
import { CandidateModal } from './CandidateModal';
import { CareerEventModal } from './CareerEventModal';
import { CrisisModal } from './CrisisModal';
import { PartyEventModal } from './PartyEventModal';

export function ModalRoot() {
  const modal = useUiStore((s) => s.modal);

  if (modal === 'crisis') return <CrisisModal />;
  if (modal === 'candidate') return <CandidateModal />;
  if (modal === 'career-event') return <CareerEventModal />;
  if (modal === 'party-event') return <PartyEventModal />;
  return null;
}
