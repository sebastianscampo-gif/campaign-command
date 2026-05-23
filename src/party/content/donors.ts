/* =============================================================================
   PARTY · CONTENT — Donantes potenciales
   Cada uno tiene un costo distinto: dinero rápido vs daño narrativo. Los
   eventos de cycle_start pueden ofrecer estos al jugador.
   ============================================================================= */

import type { DonorKind } from '../types';

export interface DonorTemplate {
  readonly kind: DonorKind;
  readonly name: string;
  readonly amount: number;
  readonly conditions: string;
  /** Riesgo reputacional al aceptar (penalización en honestidad/transparencia). */
  readonly reputationCost: number;
  /** Cuánta facción empresarial/sindical/etc se fortalece al aceptar. */
  readonly factionBoost: 'business' | 'union' | 'youth' | 'ground_ops' | null;
}

export const DONOR_OFFERS: readonly DonorTemplate[] = [
  {
    kind: 'corporate',
    name: 'Grupo Korniak',
    amount: 4.5,
    conditions: 'No tocar concesiones energéticas durante 4 años.',
    reputationCost: 10,
    factionBoost: 'business',
  },
  {
    kind: 'corporate',
    name: 'Cámara de Comercio del Litoral',
    amount: 3.0,
    conditions: 'Bajar la propuesta de impuesto al patrimonio.',
    reputationCost: 7,
    factionBoost: 'business',
  },
  {
    kind: 'union',
    name: 'Federación Sindical Norte',
    amount: 1.8,
    conditions: 'Compromiso público con reforma laboral protectiva.',
    reputationCost: -3, // sube credibilidad popular
    factionBoost: 'union',
  },
  {
    kind: 'small_donors',
    name: 'Campaña de pequeños donantes',
    amount: 1.2,
    conditions: 'Mantener cuentas públicas auditables.',
    reputationCost: -8, // muy buena imagen
    factionBoost: null,
  },
  {
    kind: 'crowdfund',
    name: 'Plataforma de crowdfunding ciudadano',
    amount: 0.8,
    conditions: 'Transparencia total — sin condiciones ocultas.',
    reputationCost: -10,
    factionBoost: 'youth',
  },
  {
    kind: 'state_funding',
    name: 'Aporte estatal por bancada',
    amount: 2.4,
    conditions: 'Aplica solo si pasaste el umbral legal.',
    reputationCost: 0,
    factionBoost: null,
  },
];
