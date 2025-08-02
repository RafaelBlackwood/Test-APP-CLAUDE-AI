import React from 'react';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type { DashboardStats as StatsType } from '../../types';

interface DashboardStatsProps {
  stats: StatsType;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-shadow duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success-600' : 'text-error-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl p-6 shadow-soft animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    ))}
  </div>
);

export const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  stats, 
  isLoading = false 
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: ClipboardDocumentListIcon,
      color: 'bg-primary-500',
      trend: { value: 12, isPositive: true },
    },
    {
      title: 'Submitted',
      value: stats.submittedApplications,
      icon: CheckCircleIcon,
      color: 'bg-blue-500',
      trend: { value: 8, isPositive: true },
    },
    {
      title: 'Accepted',
      value: stats.acceptedApplications,
      icon: TrophyIcon,
      color: 'bg-success-500',
      trend: { value: 25, isPositive: true },
    },
    {
      title: 'Pending Deadlines',
      value: stats.pendingDeadlines,
      icon: ExclamationTriangleIcon,
      color: 'bg-warning-500',
      trend: { value: 5, isPositive: false },
    },
    {
      title: 'Interviews',
      value: stats.upcomingInterviews,
      icon: AcademicCapIcon,
      color: 'bg-purple-500',
    },
    {
      title: 'In Progress',
      value: stats.totalApplications - stats.submittedApplications,
      icon: ClockIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {statCards.map((card, index) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          trend={card.trend}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};

export default DashboardStats;