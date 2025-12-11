// Jira API Response Types
// Based on Jira Cloud REST API v3 and Agile API

// Configuration for Jira API authentication
export interface JiraApiConfig {
  baseUrl: string; // e.g., https://your-domain.atlassian.net
  email: string;
  apiToken: string;
  boardId?: string;
  storyPointsField?: string; // e.g., customfield_10016
}

// Board Types (Agile API)
export interface JiraBoard {
  id: number;
  self: string;
  name: string;
  type: string; // 'scrum' | 'kanban' | 'simple'
  location?: {
    projectId: number;
    displayName: string;
    projectName: string;
    projectKey: string;
    projectTypeKey: string;
    avatarURI: string;
    name: string;
  };
}

export interface JiraBoardsResponse {
  maxResults: number;
  startAt: number;
  total: number;
  isLast: boolean;
  values: JiraBoard[];
}

// Sprint Types (Agile API)
export interface JiraSprint {
  id: number;
  self: string;
  state: 'future' | 'active' | 'closed';
  name: string;
  startDate?: string;
  endDate?: string;
  completeDate?: string;
  originBoardId?: number;
  goal?: string;
}

export interface JiraSprintsResponse {
  maxResults: number;
  startAt: number;
  isLast: boolean;
  values: JiraSprint[];
}

// Issue Types (Platform API v3)
export interface JiraApiIssue {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    status: {
      self: string;
      description: string;
      iconUrl: string;
      name: string; // e.g., 'To Do', 'In Progress', 'Done'
      id: string;
      statusCategory: {
        self: string;
        id: number;
        key: string; // 'new', 'indeterminate', 'done'
        colorName: string;
        name: string;
      };
    };
    assignee?: {
      self: string;
      accountId: string;
      displayName: string;
      active: boolean;
      avatarUrls?: Record<string, string>;
    } | null;
    sprint?: JiraSprint | null;
    [key: string]: unknown; // For custom fields like story points
  };
}

export interface JiraSearchResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraApiIssue[];
}

// Board Configuration (Agile API)
export interface JiraBoardConfiguration {
  id: number;
  name: string;
  self: string;
  location?: {
    projectId: number;
    displayName: string;
    projectName: string;
    projectKey: string;
    projectTypeKey: string;
    avatarURI: string;
    name: string;
  };
  filter?: {
    id: string;
    self: string;
  };
  subQuery?: {
    query: string;
  };
  columnConfig?: {
    columns: Array<{
      name: string;
      statuses: Array<{
        id: string;
        self: string;
      }>;
    }>;
    constraintType?: string;
  };
  estimation?: {
    type: string; // 'field' | 'none'
    field?: {
      fieldId: string; // e.g., 'customfield_10016'
      displayName: string; // e.g., 'Story Points'
    };
  };
  ranking?: {
    rankCustomFieldId: number;
  };
}

// Field Types (Platform API v3)
export interface JiraField {
  id: string;
  key?: string;
  name: string;
  custom: boolean;
  orderable: boolean;
  navigable: boolean;
  searchable: boolean;
  clauseNames?: string[];
  schema?: {
    type: string;
    custom?: string;
    customId?: number;
  };
}

// Velocity Chart (Greenhopper API - internal API)
export interface JiraVelocityResponse {
  velocityStatEntries: {
    [sprintId: string]: {
      estimated: {
        value: number;
      };
      completed: {
        value: number;
      };
    };
  };
  sprints: Array<{
    id: number;
    name: string;
    state: string;
    goal?: string;
  }>;
}

// Sprint Issues Response (Agile API)
export interface JiraSprintIssuesResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraApiIssue[];
}

// Pagination helpers
export interface JiraPaginationParams {
  startAt?: number;
  maxResults?: number;
}

// Cache entry type
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milliseconds
}
