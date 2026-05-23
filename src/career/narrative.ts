/* =============================================================================
   CAREER — Narrativa
   Renderiza plantillas con tokens. Es una sustitución `{key}` simple: si la
   key no está en el dict, se reemplaza por `—`.

   También genera titulares post-elección y resúmenes de ciclo a partir de
   los CompletedElection y del estado.
   ============================================================================= */

import {
  CAREER_NARRATIVE_TEMPLATES,
  ELECTION_OUTCOME_TEMPLATES,
} from './content/narrative';
import { OFFICES } from './content/offices';
import { activeMemories } from './memory';
import type {
  CareerState,
  CompletedElection,
  PoliticalMemoryEntry,
} from './types';

export function renderTemplate(template: string, tokens: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const v = tokens[key];
    return v === undefined ? '—' : String(v);
  });
}

/** Construye el titular del resultado electoral. */
export function electionHeadline(
  state: CareerState,
  result: CompletedElection,
  scenarioStage: 'local' | 'regional' | 'national' | 'presidential',
  opponentName: string,
): string {
  let id = '';
  if (result.result === 'won') {
    id = scenarioStage === 'local' ? 'won_local' : scenarioStage === 'regional' ? 'won_regional' : 'won_presidential';
  } else if (result.result === 'lost_close') {
    id = 'lost_close';
  } else {
    id = 'lost_landslide';
  }

  const template = ELECTION_OUTCOME_TEMPLATES.find((t) => t.id === id);
  if (!template) return '';

  return renderTemplate(template.text, {
    name: state.player.name,
    region: result.region ?? 'la región',
    score: result.playerScore.toFixed(1),
    opponentScore: result.opponentScore.toFixed(1),
    opponent: opponentName,
  });
}

/** Genera narrativas emergentes del último ciclo. */
export function cycleNarratives(state: CareerState): string[] {
  const out: string[] = [];

  // Etiquetas activas → frase de medios.
  if (state.reputation.labels.length > 0) {
    const labelTemplate = CAREER_NARRATIVE_TEMPLATES.find((t) => t.id === 'media_label');
    if (labelTemplate) {
      out.push(renderTemplate(labelTemplate.text, { label: state.reputation.labels.join(' · ') }));
    }
  }

  // Promesa rota reciente → recuerdo de región.
  const brokenMemory = activeMemories(state.memory).find(
    (m: PoliticalMemoryEntry) => m.type === 'promise_broken' && m.region,
  );
  if (brokenMemory && brokenMemory.region) {
    const t = CAREER_NARRATIVE_TEMPLATES.find((tpl) => tpl.id === 'broken_promise_haunts');
    if (t) out.push(renderTemplate(t.text, { region: brokenMemory.region }));
  }

  // Mentor convertido en rival → frase de quiebre.
  if (state.rivals.length > 0) {
    const rivalId = state.rivals[0];
    if (rivalId) {
      const rival = state.npcs[rivalId];
      if (rival && rival.role === 'mentor') {
        const t = CAREER_NARRATIVE_TEMPLATES.find((tpl) => tpl.id === 'former_ally_now_rival');
        if (t) out.push(renderTemplate(t.text, { npc: rival.name }));
      }
    }
  }

  // Si ganó fama nacional pero perdió la última elección.
  const lastElection = state.completedElections[state.completedElections.length - 1];
  if (lastElection && lastElection.result !== 'won' && state.reputation.nationalFame > 50) {
    const t = CAREER_NARRATIVE_TEMPLATES.find((tpl) => tpl.id === 'lost_but_famous');
    if (t) {
      out.push(
        renderTemplate(t.text, {
          office_at_stake: OFFICES[state.currentOffice].label,
        }),
      );
    }
  }

  // Promesa cumplida reciente.
  const keptMemory = activeMemories(state.memory).find(
    (m: PoliticalMemoryEntry) => m.type === 'promise_kept' && m.region,
  );
  if (keptMemory && keptMemory.region) {
    const t = CAREER_NARRATIVE_TEMPLATES.find((tpl) => tpl.id === 'kept_promise_pays_off');
    if (t) out.push(renderTemplate(t.text, { region: keptMemory.region }));
  }

  return out;
}
