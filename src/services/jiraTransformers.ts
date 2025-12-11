import type {
  JiraApiIssue,
  JiraSprint,
  JiraApiConfig,
} from '../types/jiraApi';
import type { JiraIssue, SprintData, DeveloperSprintMetrics } from '../types';
import { getSprintIssues } from './jiraClient';

/**
 * Map Jira status to simplified app status
 */
function mapStatus(jiraStatus: string): 'To Do' | 'In Progress' | 'Done' {
  const statusLower = jiraStatus.toLowerCase();
  
  // Map common status categories
  if (statusLower.includes('done') || statusLower.includes('complete') || statusLower.includes('closed')) {
    return 'Done';
  }
  
  if (statusLower.includes('progress') || statusLower.includes('review') || statusLower.includes('testing')) {
    return 'In Progress';
  }
  
  return 'To Do';
}

/**
 * Extract story points from issue fields
 */
function extractStoryPoints(issue: JiraApiIssue, storyPointsField: string): number {
  const value = issue.fields[storyPointsField];
  
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return 0;
}

/**
 * Transform Jira API issue to app JiraIssue type
 */
export function transformIssue(
  apiIssue: JiraApiIssue,
  storyPointsField: string,
  sprintName?: string
): JiraIssue {
  return {
    key: apiIssue.key,
    summary: apiIssue.fields.summary,
    storyPoints: extractStoryPoints(apiIssue, storyPointsField),
    status: mapStatus(apiIssue.fields.status.name),
    assignee: apiIssue.fields.assignee?.displayName || 'Unassigned',
    sprint: sprintName || 'Unknown Sprint',
  };
}

/**
 * Calculate developer metrics from issues
 */
function calculateDeveloperMetrics(
  issues: JiraIssue[],
  hasCopilotMap?: Map<string, boolean>
): DeveloperSprintMetrics[] {
  // Group issues by developer
  const developerIssues = new Map<string, JiraIssue[]>();
  
  issues.forEach(issue => {
    if (issue.assignee !== 'Unassigned') {
      const existing = developerIssues.get(issue.assignee) || [];
      existing.push(issue);
      developerIssues.set(issue.assignee, existing);
    }
  });
  
  // Calculate metrics for each developer
  const metrics: DeveloperSprintMetrics[] = [];
  
  developerIssues.forEach((devIssues, developer) => {
    const assignedPoints = devIssues.reduce((sum, issue) => sum + issue.storyPoints, 0);
    const completedPoints = devIssues
      .filter(issue => issue.status === 'Done')
      .reduce((sum, issue) => sum + issue.storyPoints, 0);
    
    const completionRate = assignedPoints > 0 
      ? Math.round((completedPoints / assignedPoints) * 100)
      : 0;
    
    metrics.push({
      developer,
      assignedPoints,
      completedPoints,
      completionRate,
      hasCopilot: hasCopilotMap?.get(developer) ?? false,
    });
  });
  
  return metrics;
}

/**
 * Transform Jira sprint and issues to app SprintData type
 */
export function transformSprintData(
  sprint: JiraSprint,
  issues: JiraIssue[],
  hasCopilotMap?: Map<string, boolean>
): SprintData {
  const totalStoryPoints = issues.reduce((sum, issue) => sum + issue.storyPoints, 0);
  const completedStoryPoints = issues
    .filter(issue => issue.status === 'Done')
    .reduce((sum, issue) => sum + issue.storyPoints, 0);
  
  return {
    sprintName: sprint.name,
    startDate: sprint.startDate || '',
    endDate: sprint.endDate || sprint.completeDate || '',
    totalStoryPoints,
    completedStoryPoints,
    developers: calculateDeveloperMetrics(issues, hasCopilotMap),
  };
}

/**
 * Fetch and transform sprint data from Jira API
 */
export async function fetchSprintData(
  config: JiraApiConfig,
  sprint: JiraSprint,
  storyPointsField: string,
  hasCopilotMap?: Map<string, boolean>
): Promise<SprintData> {
  // Fetch all issues for this sprint
  const sprintIssuesResponse = await getSprintIssues(config, String(sprint.id));
  
  // Transform issues
  const issues = sprintIssuesResponse.issues.map(apiIssue =>
    transformIssue(apiIssue, storyPointsField, sprint.name)
  );
  
  // Transform to SprintData
  return transformSprintData(sprint, issues, hasCopilotMap);
}

/**
 * Create a mapping of developers to their Copilot status
 * This would typically come from GitHub Copilot API or configuration
 */
export function createCopilotMap(
  developers: string[],
  copilotDevelopers: string[] = []
): Map<string, boolean> {
  const map = new Map<string, boolean>();
  
  developers.forEach(dev => {
    map.set(dev, copilotDevelopers.includes(dev));
  });
  
  return map;
}

/**
 * Batch transform multiple sprints
 */
export async function fetchMultipleSprintData(
  config: JiraApiConfig,
  sprints: JiraSprint[],
  storyPointsField: string,
  hasCopilotMap?: Map<string, boolean>
): Promise<SprintData[]> {
  const sprintDataPromises = sprints.map(sprint =>
    fetchSprintData(config, sprint, storyPointsField, hasCopilotMap)
  );
  
  return Promise.all(sprintDataPromises);
}

/**
 * Get closed/completed sprints only
 */
export function filterClosedSprints(sprints: JiraSprint[]): JiraSprint[] {
  return sprints
    .filter(sprint => sprint.state === 'closed')
    .sort((a, b) => {
      const dateA = new Date(a.startDate || 0).getTime();
      const dateB = new Date(b.startDate || 0).getTime();
      return dateA - dateB; // Sort by start date ascending
    });
}

/**
 * Get the most recent N sprints
 */
export function getRecentSprints(sprints: JiraSprint[], count: number): JiraSprint[] {
  const closedSprints = filterClosedSprints(sprints);
  return closedSprints.slice(-count); // Get last N sprints
}
