/* =============================================================================
   MODAL — Root
   Monta el modal activo según el uiStore. El cierre con Escape lo gobierna App.
   ============================================================================= */

import { useUiStore } from '@/state/uiStore';
import { CandidateModal } from './CandidateModal';
import { CrisisModal } from './CrisisModal';

export function ModalRoot() {
  const modal = useUiStore((s) => s.modal);

  if (modal === 'crisis') return <CrisisModal />;
  if (modal === 'candidate') return <CandidateModal />;
  return null;
}
