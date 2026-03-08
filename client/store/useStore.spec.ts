import { beforeEach, describe, expect, it, vi } from 'vitest';

const createLocalStorageMock = () => {
  const storage = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => storage.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      storage.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      storage.delete(key);
    }),
    clear: vi.fn(() => {
      storage.clear();
    }),
  };
};

describe('useStore goal creation', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('adds a new goal with empty tasks and zero progress', async () => {
    const localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);

    const { useStore } = await import('./useStore');
    const initialCount = useStore.getState().goals.length;

    useStore.getState().addGoal({
      title: 'Launch portfolio site',
      type: 'short',
    });

    const goals = useStore.getState().goals;
    const newGoal = goals[goals.length - 1];

    expect(goals).toHaveLength(initialCount + 1);
    expect(newGoal).toMatchObject({
      title: 'Launch portfolio site',
      type: 'short',
      tasks: [],
      progress: 0,
    });
    expect(newGoal.id).toEqual(expect.any(String));
    expect(newGoal.id.length).toBeGreaterThan(0);
  });

  it('persists a created goal to roadmap storage', async () => {
    const localStorageMock = createLocalStorageMock();
    vi.stubGlobal('localStorage', localStorageMock);

    const { useStore } = await import('./useStore');

    useStore.getState().addGoal({
      title: 'Prepare for placement season',
      type: 'mid',
    });

    const persistedPayload = localStorageMock.setItem.mock.calls.find(
      ([key]) => key === 'roadmap-storage',
    )?.[1];

    expect(persistedPayload).toBeTruthy();

    const persistedState = JSON.parse(persistedPayload as string);
    const savedGoal = persistedState.state.goals[persistedState.state.goals.length - 1];

    expect(savedGoal).toMatchObject({
      title: 'Prepare for placement season',
      type: 'mid',
      tasks: [],
      progress: 0,
    });
  });
});
