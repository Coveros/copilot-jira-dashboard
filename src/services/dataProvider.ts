import type { SprintData } from '../types';
import type { JiraApiConfig } from '../types/jiraApi';
import { mockSprintData } from '../data/mockJiraData';
import { listSprints, getStoryPointsField, clearCache as clearJiraCache } from './jiraClient';
import { fetchMultipleSprintData, getRecentSprints } from './jiraTransformers';

/**
 * Get Jira API configuration from environment variables
 */
function getJiraConfig(): JiraApiConfig | null {
  const baseUrl = import.meta.env.VITE_JIRA_BASE_URL;
  const email = import.meta.env.VITE_JIRA_EMAIL;
  const apiToken = import.meta.env.VITE_JIRA_API_TOKEN;
  const boardId = import.meta.env.VITE_JIRA_BOARD_ID;
  const storyPointsField = import.meta.env.VITE_JIRA_STORY_POINTS_FIELD;

  // Validate required fields
  if (!baseUrl || !email || !apiToken) {
    return null;
  }

  return {
    baseUrl,
    email,
    apiToken,
    boardId,
    storyPointsField,
  };
}

/**
 * Check if live data should be used
 */
function shouldUseLiveData(): boolean {
  return import.meta.env.VITE_USE_LIVE_DATA === 'true';
}

/**
 * Fetch sprint data from Jira API
 */
async function fetchLiveSprintData(): Promise<SprintData[]> {
  const config = getJiraConfig();
  
  if (!config) {
    throw new Error(
      'Jira configuration is incomplete. Please check your environment variables.'
    );
  }

  if (!config.boardId) {
    throw new Error(
      'VITE_JIRA_BOARD_ID is required for fetching live data.'
    );
  }

  try {
    // Get story points field
    const storyPointsField = config.storyPointsField || 
      await getStoryPointsField(config, config.boardId);
    
    if (!storyPointsField) {
      throw new Error(
        'Could not determine story points field. Please set VITE_JIRA_STORY_POINTS_FIELD.'
      );
    }

    // List sprints for the board
    const sprintsResponse = await listSprints(config, config.boardId);
    
    // Get recent closed sprints (last 5)
    const recentSprints = getRecentSprints(sprintsResponse.values, 5);
    
    if (recentSprints.length === 0) {
      console.warn('No closed sprints found. Falling back to mock data.');
      return mockSprintData;
    }

    // TODO: In a real implementation, you would fetch Copilot data from GitHub API
    // and create a map of developers to their Copilot status. For now, we'll use
    // an empty map which defaults all developers to not having Copilot.
    // Example:
    // const copilotMap = await fetchCopilotUsers(config);
    const copilotMap = new Map<string, boolean>();

    // Fetch and transform sprint data
    const sprintData = await fetchMultipleSprintData(
      config,
      recentSprints,
      storyPointsField,
      copilotMap
    );

    return sprintData;
  } catch (error) {
    console.error('Error fetching live sprint data:', error);
    throw error;
  }
}

/**
 * Get sprint data - returns either mock or live data based on configuration
 */
export async function getSprintData(): Promise<SprintData[]> {
  if (shouldUseLiveData()) {
    try {
      return await fetchLiveSprintData();
    } catch (error) {
      console.error('Failed to fetch live data, falling back to mock data:', error);
      return mockSprintData;
    }
  }
  
  return mockSprintData;
}

/**
 * Clear all cached data
 */
export function clearCache(): void {
  clearJiraCache();
}

/**
 * Check if live data is available and configured
 */
export function isLiveDataAvailable(): boolean {
  const config = getJiraConfig();
  return config !== null && !!config.boardId;
}

/**
 * Get current data source info
 */
export function getDataSourceInfo(): {
  isLive: boolean;
  isConfigured: boolean;
  config: Partial<JiraApiConfig> | null;
} {
  const shouldUseLive = shouldUseLiveData();
  const config = getJiraConfig();
  
  return {
    isLive: shouldUseLive,
    isConfigured: config !== null && !!config.boardId,
    config: config ? {
      baseUrl: config.baseUrl,
      boardId: config.boardId,
      // Don't expose sensitive data
    } : null,
  };
}
