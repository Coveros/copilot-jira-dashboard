import type { SprintData, JiraIssue } from '../types';

// Mock sprint data showing before and after Copilot adoption
export const mockSprintData: SprintData[] = [
  // Sprint 1 - Baseline (no Copilot for most)
  {
    sprintName: 'Sprint 23',
    startDate: '2024-01-01',
    endDate: '2024-01-14',
    totalStoryPoints: 78,
    completedStoryPoints: 62,
    developers: [
      {
        developer: 'Sarah Chen',
        assignedPoints: 15,
        completedPoints: 13,
        completionRate: 87,
        hasCopilot: true, // Early adopter
      },
      {
        developer: 'Marcus Johnson',
        assignedPoints: 13,
        completedPoints: 11,
        completionRate: 85,
        hasCopilot: true, // Early adopter
      },
      {
        developer: 'Emily Rodriguez',
        assignedPoints: 13,
        completedPoints: 10,
        completionRate: 77,
        hasCopilot: false,
      },
      {
        developer: 'David Kim',
        assignedPoints: 13,
        completedPoints: 9,
        completionRate: 69,
        hasCopilot: false,
      },
      {
        developer: 'Aisha Patel',
        assignedPoints: 12,
        completedPoints: 10,
        completionRate: 83,
        hasCopilot: false,
      },
      {
        developer: 'James Wilson',
        assignedPoints: 12,
        completedPoints: 9,
        completionRate: 75,
        hasCopilot: false,
      },
    ],
  },
  // Sprint 2 - Partial rollout
  {
    sprintName: 'Sprint 24',
    startDate: '2024-01-15',
    endDate: '2024-01-31',
    totalStoryPoints: 82,
    completedStoryPoints: 71,
    developers: [
      {
        developer: 'Sarah Chen',
        assignedPoints: 16,
        completedPoints: 15,
        completionRate: 94,
        hasCopilot: true,
      },
      {
        developer: 'Marcus Johnson',
        assignedPoints: 14,
        completedPoints: 13,
        completionRate: 93,
        hasCopilot: true,
      },
      {
        developer: 'Emily Rodriguez',
        assignedPoints: 14,
        completedPoints: 13,
        completionRate: 93,
        hasCopilot: true, // Just got Copilot
      },
      {
        developer: 'David Kim',
        assignedPoints: 13,
        completedPoints: 10,
        completionRate: 77,
        hasCopilot: true, // Just got Copilot
      },
      {
        developer: 'Aisha Patel',
        assignedPoints: 13,
        completedPoints: 11,
        completionRate: 85,
        hasCopilot: false,
      },
      {
        developer: 'James Wilson',
        assignedPoints: 12,
        completedPoints: 9,
        completionRate: 75,
        hasCopilot: false,
      },
    ],
  },
  // Sprint 3 - Full rollout
  {
    sprintName: 'Sprint 25',
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    totalStoryPoints: 89,
    completedStoryPoints: 82,
    developers: [
      {
        developer: 'Sarah Chen',
        assignedPoints: 17,
        completedPoints: 16,
        completionRate: 94,
        hasCopilot: true,
      },
      {
        developer: 'Marcus Johnson',
        assignedPoints: 15,
        completedPoints: 14,
        completionRate: 93,
        hasCopilot: true,
      },
      {
        developer: 'Emily Rodriguez',
        assignedPoints: 15,
        completedPoints: 14,
        completionRate: 93,
        hasCopilot: true,
      },
      {
        developer: 'David Kim',
        assignedPoints: 14,
        completedPoints: 12,
        completionRate: 86,
        hasCopilot: true,
      },
      {
        developer: 'Aisha Patel',
        assignedPoints: 14,
        completedPoints: 13,
        completionRate: 93,
        hasCopilot: true, // Just got Copilot
      },
      {
        developer: 'James Wilson',
        assignedPoints: 14,
        completedPoints: 13,
        completionRate: 93,
        hasCopilot: true, // Just got Copilot
      },
    ],
  },
  // Sprint 4 - Optimized with Copilot
  {
    sprintName: 'Sprint 26',
    startDate: '2024-02-15',
    endDate: '2024-02-29',
    totalStoryPoints: 95,
    completedStoryPoints: 89,
    developers: [
      {
        developer: 'Sarah Chen',
        assignedPoints: 18,
        completedPoints: 17,
        completionRate: 94,
        hasCopilot: true,
      },
      {
        developer: 'Marcus Johnson',
        assignedPoints: 16,
        completedPoints: 15,
        completionRate: 94,
        hasCopilot: true,
      },
      {
        developer: 'Emily Rodriguez',
        assignedPoints: 16,
        completedPoints: 15,
        completionRate: 94,
        hasCopilot: true,
      },
      {
        developer: 'David Kim',
        assignedPoints: 15,
        completedPoints: 14,
        completionRate: 93,
        hasCopilot: true,
      },
      {
        developer: 'Aisha Patel',
        assignedPoints: 15,
        completedPoints: 14,
        completionRate: 93,
        hasCopilot: true,
      },
      {
        developer: 'James Wilson',
        assignedPoints: 15,
        completedPoints: 14,
        completionRate: 93,
        hasCopilot: true,
      },
    ],
  },
  // Sprint 5 - Peak performance
  {
    sprintName: 'Sprint 27',
    startDate: '2024-03-01',
    endDate: '2024-03-14',
    totalStoryPoints: 102,
    completedStoryPoints: 97,
    developers: [
      {
        developer: 'Sarah Chen',
        assignedPoints: 19,
        completedPoints: 18,
        completionRate: 95,
        hasCopilot: true,
      },
      {
        developer: 'Marcus Johnson',
        assignedPoints: 17,
        completedPoints: 16,
        completionRate: 94,
        hasCopilot: true,
      },
      {
        developer: 'Emily Rodriguez',
        assignedPoints: 17,
        completedPoints: 16,
        completionRate: 94,
        hasCopilot: true,
      },
      {
        developer: 'David Kim',
        assignedPoints: 17,
        completedPoints: 16,
        completionRate: 94,
        hasCopilot: true,
      },
      {
        developer: 'Aisha Patel',
        assignedPoints: 16,
        completedPoints: 15,
        completionRate: 94,
        hasCopilot: true,
      },
      {
        developer: 'James Wilson',
        assignedPoints: 16,
        completedPoints: 16,
        completionRate: 100,
        hasCopilot: true,
      },
    ],
  },
];

// Sample Jira issues for context
export const mockJiraIssues: JiraIssue[] = [
  // Sprint 23 issues
  {
    key: 'PROJ-234',
    summary: 'Implement user authentication service',
    storyPoints: 8,
    status: 'Done',
    assignee: 'Sarah Chen',
    sprint: 'Sprint 23',
  },
  {
    key: 'PROJ-235',
    summary: 'Create dashboard component',
    storyPoints: 5,
    status: 'Done',
    assignee: 'Sarah Chen',
    sprint: 'Sprint 23',
  },
  {
    key: 'PROJ-236',
    summary: 'Fix pagination bug in user list',
    storyPoints: 3,
    status: 'In Progress',
    assignee: 'Marcus Johnson',
    sprint: 'Sprint 23',
  },
  {
    key: 'PROJ-237',
    summary: 'Add export functionality to reports',
    storyPoints: 8,
    status: 'Done',
    assignee: 'Marcus Johnson',
    sprint: 'Sprint 23',
  },
  {
    key: 'PROJ-238',
    summary: 'Optimize database queries',
    storyPoints: 5,
    status: 'Done',
    assignee: 'Emily Rodriguez',
    sprint: 'Sprint 23',
  },
  {
    key: 'PROJ-239',
    summary: 'Update API documentation',
    storyPoints: 5,
    status: 'Done',
    assignee: 'Emily Rodriguez',
    sprint: 'Sprint 23',
  },
  // Sprint 27 issues (with Copilot)
  {
    key: 'PROJ-301',
    summary: 'Implement real-time notifications',
    storyPoints: 13,
    status: 'Done',
    assignee: 'Sarah Chen',
    sprint: 'Sprint 27',
  },
  {
    key: 'PROJ-302',
    summary: 'Build analytics dashboard',
    storyPoints: 8,
    status: 'Done',
    assignee: 'Marcus Johnson',
    sprint: 'Sprint 27',
  },
  {
    key: 'PROJ-303',
    summary: 'Create automated testing suite',
    storyPoints: 8,
    status: 'Done',
    assignee: 'Emily Rodriguez',
    sprint: 'Sprint 27',
  },
  {
    key: 'PROJ-304',
    summary: 'Implement caching layer',
    storyPoints: 8,
    status: 'Done',
    assignee: 'David Kim',
    sprint: 'Sprint 27',
  },
  {
    key: 'PROJ-305',
    summary: 'Build user activity tracking',
    storyPoints: 8,
    status: 'Done',
    assignee: 'Aisha Patel',
    sprint: 'Sprint 27',
  },
  {
    key: 'PROJ-306',
    summary: 'Migrate to microservices architecture',
    storyPoints: 13,
    status: 'Done',
    assignee: 'James Wilson',
    sprint: 'Sprint 27',
  },
];
