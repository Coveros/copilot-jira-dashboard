import { mockDeveloperCopilotMetrics } from '../data/mockCopilotData';
import { mockSprintData } from '../data/mockJiraData';
import type { ProductivityMetrics, DashboardSummary } from '../types';

export const getCombinedProductivityMetrics = (): ProductivityMetrics[] => {
  const metrics: ProductivityMetrics[] = [];

  mockSprintData.forEach((sprint) => {
    sprint.developers.forEach((dev) => {
      // Find corresponding Copilot metrics
      const copilotData = mockDeveloperCopilotMetrics.find(
        (cm) => cm.developer === dev.developer && cm.date === sprint.startDate
      );

      metrics.push({
        developer: dev.developer,
        period: sprint.sprintName,
        storyPointsCompleted: dev.completedPoints,
        copilotAcceptanceRate: copilotData?.acceptance_rate || 0,
        copilotSuggestions: copilotData?.suggestions_count || 0,
        hasCopilot: dev.hasCopilot,
        velocity: dev.completedPoints,
      });
    });
  });

  return metrics;
};

export const getDashboardSummary = (): DashboardSummary => {
  const allMetrics = getCombinedProductivityMetrics();
  const latestSprint = mockSprintData[mockSprintData.length - 1];
  const firstSprint = mockSprintData[0];

  const developersWithCopilot = latestSprint.developers.filter(
    (d) => d.hasCopilot
  ).length;

  const totalDevelopers = latestSprint.developers.length;

  // Calculate average acceptance rate for developers with Copilot in latest sprint
  const latestCopilotMetrics = allMetrics.filter(
    (m) => m.period === latestSprint.sprintName && m.hasCopilot
  );
  const averageAcceptanceRate =
    latestCopilotMetrics.reduce((sum, m) => sum + m.copilotAcceptanceRate, 0) /
    latestCopilotMetrics.length;

  // Calculate velocity with and without Copilot
  const metricsWithCopilot = allMetrics.filter((m) => m.hasCopilot);
  const metricsWithoutCopilot = allMetrics.filter((m) => !m.hasCopilot);

  const averageVelocityWithCopilot =
    metricsWithCopilot.reduce((sum, m) => sum + m.velocity, 0) /
    metricsWithCopilot.length;

  const averageVelocityWithoutCopilot =
    metricsWithoutCopilot.length > 0
      ? metricsWithoutCopilot.reduce((sum, m) => sum + m.velocity, 0) /
        metricsWithoutCopilot.length
      : firstSprint.developers.reduce((sum, d) => sum + d.completedPoints, 0) /
        firstSprint.developers.length;

  const productivityIncrease =
    ((averageVelocityWithCopilot - averageVelocityWithoutCopilot) /
      averageVelocityWithoutCopilot) *
    100;

  return {
    totalDevelopers,
    developersWithCopilot,
    averageAcceptanceRate,
    averageVelocityWithCopilot,
    averageVelocityWithoutCopilot,
    productivityIncrease,
  };
};

// Get velocity trend over time
export const getVelocityTrend = () => {
  return mockSprintData.map((sprint) => {
    const withCopilot = sprint.developers.filter((d) => d.hasCopilot);
    const withoutCopilot = sprint.developers.filter((d) => !d.hasCopilot);

    return {
      sprint: sprint.sprintName,
      date: sprint.startDate,
      withCopilot:
        withCopilot.length > 0
          ? withCopilot.reduce((sum, d) => sum + d.completedPoints, 0) /
            withCopilot.length
          : 0,
      withoutCopilot:
        withoutCopilot.length > 0
          ? withoutCopilot.reduce((sum, d) => sum + d.completedPoints, 0) /
            withoutCopilot.length
          : 0,
      totalCompleted: sprint.completedStoryPoints,
      totalAssigned: sprint.totalStoryPoints,
      completionRate:
        (sprint.completedStoryPoints / sprint.totalStoryPoints) * 100,
    };
  });
};

// Get Copilot adoption over time
export const getCopilotAdoption = () => {
  return mockSprintData.map((sprint) => ({
    sprint: sprint.sprintName,
    date: sprint.startDate,
    developersWithCopilot: sprint.developers.filter((d) => d.hasCopilot).length,
    totalDevelopers: sprint.developers.length,
    adoptionRate:
      (sprint.developers.filter((d) => d.hasCopilot).length /
        sprint.developers.length) *
      100,
  }));
};

// Get developer comparison
export const getDeveloperComparison = () => {
  const developers = new Set(mockSprintData[0].developers.map((d) => d.developer));
  
  return Array.from(developers).map((devName) => {
    // Get metrics before Copilot (first sprint)
    const beforeCopilot = mockSprintData[0].developers.find(
      (d) => d.developer === devName
    );
    
    // Get metrics after Copilot (last sprint)
    const afterCopilot = mockSprintData[mockSprintData.length - 1].developers.find(
      (d) => d.developer === devName
    );

    // Get latest Copilot metrics
    const latestCopilotMetrics = mockDeveloperCopilotMetrics
      .filter((m) => m.developer === devName)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return {
      developer: devName,
      beforeVelocity: beforeCopilot?.completedPoints || 0,
      afterVelocity: afterCopilot?.completedPoints || 0,
      improvement: afterCopilot && beforeCopilot
        ? ((afterCopilot.completedPoints - beforeCopilot.completedPoints) /
            beforeCopilot.completedPoints) *
          100
        : 0,
      acceptanceRate: latestCopilotMetrics?.acceptance_rate || 0,
      currentVelocity: afterCopilot?.completedPoints || 0,
    };
  });
};
