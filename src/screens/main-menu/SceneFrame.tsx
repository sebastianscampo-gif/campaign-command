/* =============================================================================
   MAIN MENU — SceneFrame
   Marco "maqueta viviente" que envuelve cada escena cinematográfica del preview.
   ============================================================================= */

import type { ReactNode } from 'react';

interface SceneFrameProps {
  label: string;
  caption: string;
  children: ReactNode;
  alert?: boolean;
}

export function SceneFrame({ label, caption, children, alert = false }: SceneFrameProps) {
  return (
    <div className={alert ? 'scene scene--alert' : 'scene'}>
      <div className="scene__head mono">
        <span>{label}</span>
        <span>{caption}</span>
      </div>
      <div className="scene__body">{children}</div>
      <span className="scene__corner scene__corner--tl" aria-hidden="true" />
      <span className="scene__corner scene__corner--tr" aria-hidden="true" />
      <span className="scene__corner scene__corner--bl" aria-hidden="true" />
      <span className="scene__corner scene__corner--br" aria-hidden="true" />
      <div className="scene__scan" aria-hidden="true" />
      <div className="scene__rec mono">● REC</div>
    </div>
  );
}
