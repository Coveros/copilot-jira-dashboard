import type {
  JiraApiConfig,
  JiraBoardsResponse,
  JiraSprintsResponse,
  JiraSprint,
  JiraSprintIssuesResponse,
  JiraSearchResponse,
  JiraField,
  JiraBoardConfiguration,
  JiraVelocityResponse,
  CacheEntry,
  JiraPaginationParams,
} from '../types/jiraApi';

// Cache storage
const cache = new Map<string, CacheEntry<unknown>>();

// Cache durations in milliseconds
const CACHE_DURATION = {
  SPRINT_DATA: 5 * 60 * 1000, // 5 minutes
  BOARD_CONFIG: 60 * 60 * 1000, // 1 hour
  FIELDS: 60 * 60 * 1000, // 1 hour
  BOARDS: 30 * 60 * 1000, // 30 minutes
};

/**
 * Get data from cache if valid, otherwise return null
 */
function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  const now = Date.now();
  if (now - entry.timestamp > entry.expiresIn) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Store data in cache
 */
function setCache<T>(key: string, data: T, expiresIn: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    expiresIn,
  });
}

/**
 * Clear all cache or specific keys
 */
export function clearCache(keyPattern?: string): void {
  if (!keyPattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.includes(keyPattern)) {
      cache.delete(key);
    }
  }
}

/**
 * Create authorization header for Jira API
 * Note: btoa is used for base64 encoding in browser environment
 */
function getAuthHeader(config: JiraApiConfig): string {
  const credentials = `${config.email}:${config.apiToken}`;
  return `Basic ${btoa(credentials)}`;
}

/**
 * Build full API URL, using proxy in development
 */
function buildUrl(baseUrl: string, endpoint: string, params?: Record<string, string | number>): string {
  // In development, use proxy to avoid CORS issues
  const isDevelopment = import.meta.env.DEV;
  const apiBase = isDevelopment ? '/api/jira' : baseUrl;
  
  const url = new URL(endpoint, apiBase);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  return url.toString();
}

/**
 * Make authenticated request to Jira API
 */
async function makeRequest<T>(
  config: JiraApiConfig,
  endpoint: string,
  options: RequestInit = {},
  params?: Record<string, string | number>
): Promise<T> {
  const url = buildUrl(config.baseUrl, endpoint, params);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': getAuthHeader(config),
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    // Don't expose full error details to avoid leaking sensitive information
    throw new Error(
      `Jira API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * List all boards
 */
export async function listBoards(
  config: JiraApiConfig,
  pagination?: JiraPaginationParams
): Promise<JiraBoardsResponse> {
  const cacheKey = `boards:${pagination?.startAt || 0}:${pagination?.maxResults || 50}`;
  const cached = getFromCache<JiraBoardsResponse>(cacheKey);
  if (cached) return cached;

  const params: Record<string, string | number> = {
    startAt: pagination?.startAt || 0,
    maxResults: pagination?.maxResults || 50,
  };

  const response = await makeRequest<JiraBoardsResponse>(
    config,
    '/rest/agile/1.0/board',
    {},
    params
  );

  setCache(cacheKey, response, CACHE_DURATION.BOARDS);
  return response;
}

/**
 * List sprints for a board
 */
export async function listSprints(
  config: JiraApiConfig,
  boardId: string,
  pagination?: JiraPaginationParams
): Promise<JiraSprintsResponse> {
  const cacheKey = `sprints:${boardId}:${pagination?.startAt || 0}`;
  const cached = getFromCache<JiraSprintsResponse>(cacheKey);
  if (cached) return cached;

  const params: Record<string, string | number> = {
    startAt: pagination?.startAt || 0,
    maxResults: pagination?.maxResults || 50,
  };

  const response = await makeRequest<JiraSprintsResponse>(
    config,
    `/rest/agile/1.0/board/${boardId}/sprint`,
    {},
    params
  );

  setCache(cacheKey, response, CACHE_DURATION.SPRINT_DATA);
  return response;
}

/**
 * Get sprint details
 */
export async function getSprint(config: JiraApiConfig, sprintId: string): Promise<JiraSprint> {
  const cacheKey = `sprint:${sprintId}`;
  const cached = getFromCache<JiraSprint>(cacheKey);
  if (cached) return cached;

  const response = await makeRequest<JiraSprint>(
    config,
    `/rest/agile/1.0/sprint/${sprintId}`
  );

  setCache(cacheKey, response, CACHE_DURATION.SPRINT_DATA);
  return response;
}

/**
 * Get issues for a sprint
 */
export async function getSprintIssues(
  config: JiraApiConfig,
  sprintId: string,
  pagination?: JiraPaginationParams
): Promise<JiraSprintIssuesResponse> {
  const cacheKey = `sprint-issues:${sprintId}:${pagination?.startAt || 0}`;
  const cached = getFromCache<JiraSprintIssuesResponse>(cacheKey);
  if (cached) return cached;

  const params: Record<string, string | number> = {
    startAt: pagination?.startAt || 0,
    maxResults: pagination?.maxResults || 100,
  };

  const response = await makeRequest<JiraSprintIssuesResponse>(
    config,
    `/rest/agile/1.0/sprint/${sprintId}/issue`,
    {},
    params
  );

  setCache(cacheKey, response, CACHE_DURATION.SPRINT_DATA);
  return response;
}

/**
 * Search for issues using JQL
 */
export async function searchIssues(
  config: JiraApiConfig,
  jql: string,
  fields?: string[],
  pagination?: JiraPaginationParams
): Promise<JiraSearchResponse> {
  const body = {
    jql,
    fields: fields || ['*all'],
    startAt: pagination?.startAt || 0,
    maxResults: pagination?.maxResults || 100,
  };

  const response = await makeRequest<JiraSearchResponse>(
    config,
    '/rest/api/3/search',
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
    undefined
  );

  return response;
}

/**
 * Get all fields (including custom fields)
 */
export async function getFields(config: JiraApiConfig): Promise<JiraField[]> {
  const cacheKey = 'fields';
  const cached = getFromCache<JiraField[]>(cacheKey);
  if (cached) return cached;

  const response = await makeRequest<JiraField[]>(config, '/rest/api/3/field');

  setCache(cacheKey, response, CACHE_DURATION.FIELDS);
  return response;
}

/**
 * Get board configuration (includes story points field)
 */
export async function getBoardConfiguration(
  config: JiraApiConfig,
  boardId: string
): Promise<JiraBoardConfiguration> {
  const cacheKey = `board-config:${boardId}`;
  const cached = getFromCache<JiraBoardConfiguration>(cacheKey);
  if (cached) return cached;

  const response = await makeRequest<JiraBoardConfiguration>(
    config,
    `/rest/agile/1.0/board/${boardId}/configuration`
  );

  setCache(cacheKey, response, CACHE_DURATION.BOARD_CONFIG);
  return response;
}

/**
 * Get velocity chart data (Greenhopper API)
 */
export async function getVelocityChart(
  config: JiraApiConfig,
  boardId: string
): Promise<JiraVelocityResponse> {
  const cacheKey = `velocity:${boardId}`;
  const cached = getFromCache<JiraVelocityResponse>(cacheKey);
  if (cached) return cached;

  const params = {
    rapidViewId: boardId,
  };

  const response = await makeRequest<JiraVelocityResponse>(
    config,
    '/rest/greenhopper/1.0/rapid/charts/velocity',
    {},
    params
  );

  setCache(cacheKey, response, CACHE_DURATION.SPRINT_DATA);
  return response;
}

/**
 * Auto-detect story points field by searching field names
 */
export async function detectStoryPointsField(config: JiraApiConfig): Promise<string | null> {
  try {
    const fields = await getFields(config);
    
    // Common story points field names
    const storyPointsPatterns = [
      /story\s*points?/i,
      /story\s*point\s*estimate/i,
      /points?/i,
      /estimate/i,
    ];

    for (const field of fields) {
      if (field.custom) {
        for (const pattern of storyPointsPatterns) {
          if (pattern.test(field.name)) {
            return field.id;
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to detect story points field:', error);
    return null;
  }
}

/**
 * Get story points field from board configuration or auto-detect
 */
export async function getStoryPointsField(
  config: JiraApiConfig,
  boardId: string
): Promise<string | null> {
  try {
    // First try to get from board configuration
    const boardConfig = await getBoardConfiguration(config, boardId);
    
    if (boardConfig.estimation?.field?.fieldId) {
      return boardConfig.estimation.field.fieldId;
    }

    // Fallback to auto-detection
    return await detectStoryPointsField(config);
  } catch (error) {
    console.error('Failed to get story points field:', error);
    // Try auto-detection as last resort
    return await detectStoryPointsField(config);
  }
}

/**
 * Fetch all pages of a paginated response
 */
export async function fetchAllPages<T extends { isLast?: boolean; startAt: number; maxResults: number; values?: unknown[]; issues?: unknown[] }>(
  fetchFn: (pagination: JiraPaginationParams) => Promise<T>,
  maxPages = 10
): Promise<T[]> {
  const results: T[] = [];
  let startAt = 0;
  const maxResults = 100;
  let pageCount = 0;

  while (pageCount < maxPages) {
    const response = await fetchFn({ startAt, maxResults });
    results.push(response);

    // Check if we have more pages
    const items = response.values || response.issues || [];
    if (response.isLast === true || items.length < maxResults) {
      break;
    }

    startAt += maxResults;
    pageCount++;
  }

  return results;
}
