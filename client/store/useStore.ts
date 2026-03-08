import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AppState, Peer, Goal, Task, GoalType, MetricType } from '../types';

const calculateProgress = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0;
  const completedCount = tasks.filter((t) => t.completed).length;
  return Math.round((completedCount / tasks.length) * 100);
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      peers: [
        {
          id: 'p1',
          name: 'Sarah Chen',
          role: 'Founding Partner',
          company: 'Nebula VC',
          linkedin: 'sarah-chen',
          github: 'schen',
          tags: ['Investor', 'Mentor'],
          createdAt: '2024-01-10T12:00:00Z',
        },
        {
          id: 'p2',
          name: 'Marcus Thorne',
          role: 'Lead Architect',
          company: 'Stellar Labs',
          github: 'mthorne',
          twitter: 'marcusthorne',
          tags: ['Tech Lead', 'Friend'],
          createdAt: '2024-02-15T15:30:00Z',
        },
      ],

      goals: [
        {
          id: 'g1',
          title: 'Daily Excellence',
          type: 'daily',
          progress: 50,
          tasks: [
            { id: 't1', title: 'Code for 2 hours', metricType: 'hours', value: 2, completed: true, date: new Date().toISOString() },
            { id: 't2', title: 'Solve 3 LeetCode problems', metricType: 'questions', value: 3, completed: false, date: new Date().toISOString() },
          ]
        },
        {
          id: 'g2',
          title: 'Career Sprint',
          type: 'short',
          progress: 0,
          tasks: []
        },
        {
          id: 'g3',
          title: 'Academic Milestone',
          type: 'mid',
          progress: 0,
          tasks: []
        },
        {
          id: 'g4',
          title: 'Startup Launch',
          type: 'long',
          progress: 0,
          tasks: []
        }
      ],

      addPeer: (peer) =>
        set((state) => ({
          peers: [
            ...state.peers,
            {
              ...peer,
              id: Math.random().toString(36).substring(7),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updatePeer: (id, updates) =>
        set((state) => ({
          peers: state.peers.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        })),

      deletePeer: (id) =>
        set((state) => ({
          peers: state.peers.filter((p) => p.id !== id),
        })),

      // Goal Actions
      addGoal: (goal) =>
        set((state) => ({
          goals: [
            ...state.goals,
            {
              ...goal,
              id: Math.random().toString(36).substring(7),
              tasks: [],
              progress: 0,
            },
          ],
        })),

      updateGoal: (id, updates) =>
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        })),

      deleteGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      // Task Actions
      addTask: (goalId, task) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? (() => {
                  const newTask: Task = {
                    ...task,
                    id: Math.random().toString(36).substring(7),
                    completed: false,
                    date: new Date().toISOString(),
                  };
                  const updatedTasks = [...g.tasks, newTask];
                  return {
                    ...g,
                    tasks: updatedTasks,
                    progress: calculateProgress(updatedTasks),
                  };
                })()
              : g
          ),
        })),

      updateTask: (goalId, taskId, updates) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  tasks: g.tasks.map((t) =>
                    t.id === taskId ? { ...t, ...updates } : t
                  ),
                  progress: calculateProgress(
                    g.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
                  ),
                }
              : g
          ),
        })),

      deleteTask: (goalId, taskId) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  tasks: g.tasks.filter((t) => t.id !== taskId),
                  progress: calculateProgress(g.tasks.filter((t) => t.id !== taskId)),
                }
              : g
          ),
        })),

      toggleTask: (goalId, taskId) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === goalId
              ? {
                  ...g,
                  tasks: g.tasks.map((t) =>
                    t.id === taskId ? { ...t, completed: !t.completed } : t
                  ),
                  progress: calculateProgress(
                    g.tasks.map((t) =>
                      t.id === taskId ? { ...t, completed: !t.completed } : t
                    )
                  ),
                }
              : g
          ),
        })),

      resetDailyGoals: () => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          goals: state.goals.map((g) => {
            if (g.type === 'daily') {
              const updatedTasks = g.tasks.map((t) => {
                const taskDate = t.date.split('T')[0];
                if (taskDate !== today) {
                  return { ...t, completed: false, date: new Date().toISOString() };
                }
                return t;
              });
              return { ...g, tasks: updatedTasks, progress: calculateProgress(updatedTasks) };
            }
            return g;
          }),
        }));
      },
    }),
    {
      name: 'roadmap-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
