// Dashboard Components
export { default as DashboardStats } from './DashboardStats';
export { default as ApplicationProgress } from './ApplicationProgress';
export { default as DeadlineCalendar } from './DeadlineCalendar';
export { default as DocumentChecklist } from './DocumentChecklist';
export { default as TaskManager } from './TaskManager';
export { default as NotificationCenter } from './NotificationCenter';
export { default as DataCharts } from './DataCharts';
export { default as ProfileCompleteness } from './ProfileCompleteness';
export { default as QuickStats } from './QuickStats';

// Re-export types for convenience
export type {
  DashboardStats as DashboardStatsType,
  DashboardActivity,
  Notification,
  NotificationType,
  Application,
  ApplicationStatus,
  ApplicationDocument,
  DocumentType,
} from '../../types';