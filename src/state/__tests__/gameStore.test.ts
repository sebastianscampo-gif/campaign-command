import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from '../gameStore';

/** Reinicia el store antes de cada test para que no haya filtrado entre casos. */
beforeEach(() => {
  // Limpia el persisted state que zustand persist guarda en jsdom.
  localStorage.clear();
  useGameStore.getState().resetGame();
});

describe('queueCampaignAction', () => {
  it('agrega la acción al pending queue', () => {
    useGameStore.getState().queueCampaignAction('social');
    expect(useGameStore.getState().pendingActions.length).toBe(1);
    expect(useGameStore.getState().pendingActions[0]?.kind).toBe('social');
  });

  it('ignora acciones que requieren provincia si no se la pasa', () => {
    useGameStore.getState().queueCampaignAction('rally');
    expect(useGameStore.getState().pendingActions.length).toBe(0);
  });

  it('acepta acciones que requieren provincia cuando se la pasa', () => {
    useGameStore.getState().queueCampaignAction('rally', 'CA');
    expect(useGameStore.getState().pendingActions.length).toBe(1);
    expect(useGameStore.getState().pendingActions[0]?.province).toBe('CA');
  });
});

describe('cancelCampaignAction', () => {
  it('elimina la acción por id', () => {
    useGameStore.getState().queueCampaignAction('social');
    const id = useGameStore.getState().pendingActions[0]?.id;
    expect(id).toBeDefined();
    useGameStore.getState().cancelCampaignAction(id ?? '');
    expect(useGameStore.getState().pendingActions.length).toBe(0);
  });
});

describe('simulateNextDay', () => {
  it('incrementa el día', () => {
    const beforeDay = useGameStore.getState().day;
    useGameStore.getState().simulateNextDay();
    expect(useGameStore.getState().day).toBe(beforeDay + 1);
  });

  it('mueve las acciones pendientes al historial', () => {
    useGameStore.getState().queueCampaignAction('social');
    expect(useGameStore.getState().pendingActions.length).toBe(1);
    useGameStore.getState().simulateNextDay();
    expect(useGameStore.getState().pendingActions.length).toBe(0);
    expect(useGameStore.getState().actionHistory.length).toBe(1);
  });

  it('produce un turn summary', () => {
    useGameStore.getState().simulateNextDay();
    expect(useGameStore.getState().currentTurnSummary).not.toBeNull();
  });

  it('no avanza más allá del último día de campaña', () => {
    const state = useGameStore.getState();
    // Forzar día = totalDays
    useGameStore.setState({ day: state.totalDays });
    useGameStore.getState().simulateNextDay();
    expect(useGameStore.getState().day).toBe(state.totalDays);
  });
});

describe('resetGame', () => {
  it('vuelve al snapshot inicial', () => {
    useGameStore.getState().queueCampaignAction('social');
    useGameStore.getState().simulateNextDay();
    expect(useGameStore.getState().actionHistory.length).toBeGreaterThan(0);
    useGameStore.getState().resetGame();
    expect(useGameStore.getState().actionHistory.length).toBe(0);
    expect(useGameStore.getState().pendingActions.length).toBe(0);
  });
});
