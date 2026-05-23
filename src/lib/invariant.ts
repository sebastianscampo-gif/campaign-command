/* =============================================================================
   LIB — Aserciones de invariantes
   `noUncheckedIndexedAccess` agrega `| undefined` a accesos por índice/clave
   abierta. Para los casos donde el código garantiza que el valor existe (por
   modulo, longitud conocida, sembrado de escenario), `assertDefined` documenta
   esa garantía y la verifica en runtime (en dev).
   ============================================================================= */

/** Lanza si `value` es null/undefined. Devuelve el valor con tipo no-nullable. */
export function assertDefined<T>(value: T | null | undefined, message: string): T {
  if (value === undefined || value === null) {
    throw new Error(`Invariant violated: ${message}`);
  }
  return value;
}
