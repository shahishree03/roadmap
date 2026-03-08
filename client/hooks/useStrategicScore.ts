import { useStore } from '../store/useStore';

/**
 * Calculates the overall strategic score for the user.
 * Formula:
 * (goal progress * 0.6) + (execution velocity * 0.2) + (network strength * 0.2)
 */
export const useStrategicScore = () => {
  const { goals, peers } = useStore();

  // 1. Goal Progress (0-100)
  const totalGoals = goals.length || 1;
  const roadmapProgress = goals.reduce((acc, g) => acc + g.progress, 0) / totalGoals;

  // 2. Execution Velocity (0-100)
  const allTasks = goals.flatMap(g => g.tasks);
  const completedTasks = allTasks.filter(t => t.completed).length;
  const avgVelocity = allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 50;

  // 3. Network Strength (Automatic based on peerCount)
  const peerCount = peers.length;
  let networkStrength = 5; // Default

  if (peerCount >= 500000) {
    networkStrength = 50;
  } else if (peerCount >= 50000) {
    networkStrength = 30;
  } else if (peerCount >= 5000) {
    networkStrength = 15;
  }

  // Final Calculation
  const finalScore = (roadmapProgress * 0.6) + (avgVelocity * 0.2) + (networkStrength * 0.2);

  return {
    finalScore: Math.round(finalScore),
    roadmapProgress: Math.round(roadmapProgress),
    executionVelocity: Math.round(avgVelocity),
    networkStrength: Math.round(networkStrength),
    peerCount
  };
};
