/* =============================================================================
   APP — NewsTicker
   Cinta de titulares con desplazamiento continuo por CSS (keyframes), no por
   JavaScript: cero re-renders y cero coste por frame. La lista se duplica para
   un bucle sin costura; se pausa al pasar el cursor.
   ============================================================================= */

import { useGameStore } from '@/state/gameStore';

export function NewsTicker() {
  const news = useGameStore((s) => s.news);
  const loop = [...news, ...news];

  return (
    <div className="newsticker">
      <div className="newsticker__tag mono">EN VIVO</div>
      <div className="newsticker__viewport">
        <div className="newsticker__track">
          {loop.map((item, index) => (
            <span
              className="newsticker__item"
              data-tone={item.tone}
              key={`${item.time}-${item.src}-${index}`}
            >
              <span className="newsticker__time mono">{item.time}</span>
              <span className="newsticker__src mono">{item.src}</span>
              <span className="newsticker__headline">{item.headline}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
