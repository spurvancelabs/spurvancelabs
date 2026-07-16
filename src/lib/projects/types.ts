export type { Project, ProjectMember, Ticket, Sprint, Comment, Attachment, Label, TimeLog, Activity, Milestone } from '@prisma/client';

export const TICKET_STATUSES = ['BACKLOG', 'TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED'] as const;
export const TICKET_PRIORITIES = ['LOWEST', 'LOW', 'MEDIUM', 'HIGH', 'HIGHEST'] as const;
export const TICKET_TYPES = ['STORY', 'TASK', 'BUG', 'EPIC', 'SUB_TASK'] as const;
export const PROJECT_STATUSES = ['ACTIVE', 'ON_HOLD', 'COMPLETED', 'ARCHIVED'] as const;
export const SPRINT_STATUSES = ['PLANNING', 'ACTIVE', 'COMPLETED'] as const;
export const PROJECT_ROLES = ['PROJECT_OWNER', 'PROJECT_MANAGER', 'DEVELOPER', 'CLIENT', 'VIEWER'] as const;

export const STATUS_COLORS: Record<string, string> = {
  BACKLOG: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  TODO: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  IN_REVIEW: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  DONE: 'bg-green-500/10 text-green-400 border-green-500/20',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export const PRIORITY_COLORS: Record<string, string> = {
  LOWEST: 'bg-gray-500/10 text-gray-400',
  LOW: 'bg-blue-500/10 text-blue-400',
  MEDIUM: 'bg-yellow-500/10 text-yellow-400',
  HIGH: 'bg-orange-500/10 text-orange-400',
  HIGHEST: 'bg-red-500/10 text-red-400',
};

export const TYPE_COLORS: Record<string, string> = {
  STORY: 'bg-green-500/10 text-green-400',
  TASK: 'bg-blue-500/10 text-blue-400',
  BUG: 'bg-red-500/10 text-red-400',
  EPIC: 'bg-purple-500/10 text-purple-400',
  SUB_TASK: 'bg-gray-500/10 text-gray-400',
};

export const STATUS_LABELS: Record<string, string> = {
  BACKLOG: 'Backlog',
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  IN_REVIEW: 'In Review',
  DONE: 'Done',
  CANCELLED: 'Cancelled',
};

export const PRIORITY_LABELS: Record<string, string> = {
  LOWEST: 'Lowest',
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  HIGHEST: 'Highest',
};

export const TYPE_LABELS: Record<string, string> = {
  STORY: 'Story',
  TASK: 'Task',
  BUG: 'Bug',
  EPIC: 'Epic',
  SUB_TASK: 'Sub-task',
};

export interface TicketWithDetails {
  id: string;
  key: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  type: string;
  storyPoints: number | null;
  order: number;
  startDate: Date | null;
  dueDate: Date | null;
  estimatedHours: number | null;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
  assignee: { id: string; name: string | null; email: string; image: string | null } | null;
  reporter: { id: string; name: string | null; email: string; image: string | null };
  sprint: { id: string; name: string; status: string } | null;
  parent: { id: string; key: string; title: string } | null;
  _count: { comments: number; attachments: number; timeLogs: number };
}

export interface ProjectWithDetails {
  id: string;
  name: string;
  description: string | null;
  key: string;
  status: string;
  color: string | null;
  icon: string | null;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  owner: { id: string; name: string | null; email: string; image: string | null };
  _count: { members: number; tickets: number; sprints: number };
}

export interface SprintWithDetails {
  id: string;
  name: string;
  goal: string | null;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  _count: { tickets: number };
}
