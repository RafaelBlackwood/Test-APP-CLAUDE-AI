import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface QuickStatsProps {
  isLoading?: boolean;
}

interface StatItem {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatItem: React.FC<{ stat: StatItem; index: number }> = ({ stat, index }) => {
  const getTrendIcon = () => {
    if (stat.trend === 'up') {
      return <TrendingUpIcon className="w-4 h-4 text-success-600" />;
    } else if (stat.trend === 'down') {
      return <TrendingDownIcon className="w-4 h-4 text-error-600" />;
    }
    return null;
  };

  const getTrendColor = () => {
    if (stat.trend === 'up') return 'text-success-600';
    if (stat.trend === 'down') return 'text-error-600';
    return 'text-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-lg p-4 border border-gray-100 hover:border-primary-200 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`p-1.5 rounded-md ${stat.color}`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-600">{stat.label}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
          {stat.trend !== 'neutral' && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {stat.change > 0 ? '+' : ''}{stat.change}%
              </span>
              <span className="text-xs text-gray-500">vs last month</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const QuickStats: React.FC<QuickStatsProps> = ({ isLoading = false }) => {
  const stats: StatItem[] = [
    {
      label: 'Applications',
      value: '12',
      change: 20,
      trend: 'up',
      icon: ClockIcon,
      color: 'bg-primary-500',
    },
    {
      label: 'Completed',
      value: '8',
      change: 15,
      trend: 'up',
      icon: CheckCircleIcon,
      color: 'bg-success-500',
    },
    {
      label: 'Success Rate',
      value: '75%',
      change: 5,
      trend: 'up',
      icon: TrendingUpIcon,
      color: 'bg-blue-500',
    },
    {
      label: 'Avg. Response',
      value: '12 days',
      change: -10,
      trend: 'down',
      icon: ClockIcon,
      color: 'bg-orange-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 animate-pulse">
            <div className="flex items-start space-x-2 mb-3">
              <div className="w-7 h-7 bg-gray-200 rounded-md"></div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatItem key={stat.label} stat={stat} index={index} />
      ))}
    </div>
  );
};

export default QuickStats;