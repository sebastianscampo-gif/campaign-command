/* =============================================================================
   LIB — Reloj de animación (singleton requestAnimationFrame)
   Un único bucle rAF para toda la app. Los consumidores se suscriben con un
   callback y reciben (time, dt) en cada frame. Esto reemplaza el patrón del
   prototipo, donde cada pantalla disparaba su propio setInterval/setState a
   60fps y forzaba re-renders de React constantes.

   El bucle se detiene solo cuando no hay suscriptores y se pausa cuando la
   pestaña deja de estar visible (sin desperdiciar batería en segundo plano).
   ============================================================================= */

export type FrameCallback = (time: number, dt: number) => void;

class Clock {
  private readonly callbacks = new Set<FrameCallback>();
  private rafId: number | null = null;
  private lastTime = 0;
  private running = false;

  constructor() {
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibility);
    }
  }

  /** Registra un callback de frame. Devuelve una función para darse de baja. */
  subscribe(callback: FrameCallback): () => void {
    this.callbacks.add(callback);
    this.start();
    return () => {
      this.callbacks.delete(callback);
      if (this.callbacks.size === 0) this.stop();
    };
  }

  private start(): void {
    if (this.running || this.callbacks.size === 0) return;
    if (typeof document !== 'undefined' && document.hidden) return;
    this.running = true;
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame(this.tick);
  }

  private stop(): void {
    this.running = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private readonly tick = (now: number): void => {
    if (!this.running) return;
    // Acota el delta para evitar saltos enormes al volver de una pestaña inactiva.
    const dt = Math.min(now - this.lastTime, 100);
    this.lastTime = now;
    for (const cb of this.callbacks) cb(now, dt);
    this.rafId = requestAnimationFrame(this.tick);
  };

  private readonly handleVisibility = (): void => {
    if (document.hidden) this.stop();
    else this.start();
  };
}

export const clock = new Clock();
