// GitHub Copilot Metrics Types (based on GitHub API)
export interface CopilotMetrics {
  date: string;
  total_suggestions_count: number;
  total_acceptances_count: number;
  total_lines_suggested: number;
  total_lines_accepted: number;
  total_active_users: number;
  total_chat_acceptances: number;
  total_chat_turns: number;
  total_active_chat_users: number;
}

export interface DeveloperCopilotMetrics {
  developer: string;
  date: string;
  suggestions_count: number;
  acceptances_count: number;
  lines_suggested: number;
  lines_accepted: number;
  acceptance_rate: number;
  chat_turns: number;
  chat_acceptances: number;
}

// Jira Types
export interface JiraIssue {
  key: string;
  summary: string;
  storyPoints: number;
  status: 'To Do' | 'In Progress' | 'Done';
  assignee: string;
  sprint: string;
}

export interface SprintData {
  sprintName: string;
  startDate: string;
  endDate: string;
  totalStoryPoints: number;
  completedStoryPoints: number;
  developers: DeveloperSprintMetrics[];
}

export interface DeveloperSprintMetrics {
  developer: string;
  assignedPoints: number;
  completedPoints: number;
  completionRate: number;
  hasCopilot: boolean;
}

// Combined Analytics Types
export interface ProductivityMetrics {
  developer: string;
  period: string;
  storyPointsCompleted: number;
  copilotAcceptanceRate: number;
  copilotSuggestions: number;
  hasCopilot: boolean;
  velocity: number; // story points per sprint
}

export interface DashboardSummary {
  totalDevelopers: number;
  developersWithCopilot: number;
  averageAcceptanceRate: number;
  averageVelocityWithCopilot: number;
  averageVelocityWithoutCopilot: number;
  productivityIncrease: number; // percentage
}
