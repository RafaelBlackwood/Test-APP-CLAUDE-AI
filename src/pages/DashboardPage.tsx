import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  AcademicCapIcon,
  BellIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants';
import {
  DashboardStats,
  ApplicationProgress,
  DeadlineCalendar,
  DocumentChecklist,
  TaskManager,
  NotificationCenter,
  DataCharts,
  ProfileCompleteness,
} from '../components/dashboard';
import { dashboardMockData } from '../data/mockDashboardData';
import type { User } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'tasks' | 'notifications'>('overview');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="space-y-6 md:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Welcome Section */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-primary-600 via-blue-600 to-purple-600 rounded-xl p-6 md:p-8 text-white shadow-strong"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Welcome back, {user.firstName || 'Student'}!
            </h1>
            <p className="text-primary-100 mb-4">
              Here's an overview of your university application progress.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to={ROUTES.APPLICATION_CREATE}
              className="inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-soft"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Start New Application
            </Link>
            <Link
              to={ROUTES.PROFILE}
              className="inline-flex items-center px-4 py-2 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              <Cog6ToothIcon className="w-5 h-5 mr-2" />
              Settings
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={itemVariants} className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {[
            { key: 'overview', label: 'Overview', icon: AcademicCapIcon },
            { key: 'analytics', label: 'Analytics', icon: ChartBarIcon },
            { key: 'tasks', label: 'Tasks', icon: ClockIcon },
            { key: 'notifications', label: 'Notifications', icon: BellIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <motion.div variants={itemVariants}>
        {activeTab === 'overview' && (
          <div className="space-y-6 md:space-y-8">
            {/* Stats Cards */}
            <DashboardStats stats={dashboardMockData.stats} isLoading={isLoading} />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-6 md:space-y-8">
                <ApplicationProgress
                  applications={dashboardMockData.applications}
                  isLoading={isLoading}
                />
                
                <DeadlineCalendar
                  deadlines={dashboardMockData.deadlines}
                  isLoading={isLoading}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6 md:space-y-8">
                <ProfileCompleteness
                  user={user}
                  isLoading={isLoading}
                  onNavigateToProfile={() => window.location.href = ROUTES.PROFILE}
                />

                <DocumentChecklist
                  documents={dashboardMockData.documents}
                  isLoading={isLoading}
                  onUpload={(type) => console.log('Upload', type)}
                  onView={(doc) => console.log('View', doc)}
                  onDelete={(id) => console.log('Delete', id)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 md:space-y-8">
            <DataCharts
              applications={dashboardMockData.applications}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6 md:space-y-8">
            <TaskManager
              tasks={dashboardMockData.tasks}
              isLoading={isLoading}
              onTaskComplete={(id) => console.log('Complete task', id)}
              onTaskDelete={(id) => console.log('Delete task', id)}
              onTaskAdd={(task) => console.log('Add task', task)}
            />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 md:space-y-8">
            <NotificationCenter
              notifications={dashboardMockData.notifications}
              isLoading={isLoading}
              onMarkAsRead={(id) => console.log('Mark as read', id)}
              onMarkAllAsRead={() => console.log('Mark all as read')}
              onDelete={(id) => console.log('Delete notification', id)}
              onClearAll={() => console.log('Clear all notifications')}
            />
          </div>
        )}
      </motion.div>

      {/* Quick Actions Footer - Only show on overview */}
      {activeTab === 'overview' && (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-soft"
        >
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h2>
            <p className="text-gray-600">Common tasks to help you stay on track</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardMockData.quickActions.map((action) => (
              <Link
                key={action.id}
                to={action.href}
                className="flex items-start p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors">
                  <AcademicCapIcon className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                  {action.priority === 'high' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-700 mt-2">
                      High Priority
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}