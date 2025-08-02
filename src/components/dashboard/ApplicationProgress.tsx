import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import type { Application, ApplicationStatus } from '../../types';

interface ApplicationProgressProps {
  applications: Application[];
  isLoading?: boolean;
}

interface ProgressTimelineProps {
  application: Application;
}

const getStatusColor = (status: ApplicationStatus): string => {
  const colors: Record<ApplicationStatus, string> = {
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    submitted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    under_review: 'bg-orange-100 text-orange-800 border-orange-200',
    interview_scheduled: 'bg-purple-100 text-purple-800 border-purple-200',
    accepted: 'bg-success-100 text-success-800 border-success-200',
    rejected: 'bg-error-100 text-error-800 border-error-200',
    waitlisted: 'bg-amber-100 text-amber-800 border-amber-200',
    deferred: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    withdrawn: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[status] || colors.draft;
};

const getStatusIcon = (status: ApplicationStatus) => {
  const iconProps = { className: 'w-4 h-4' };
  
  switch (status) {
    case 'accepted':
      return <CheckCircleIconSolid {...iconProps} className="w-4 h-4 text-success-600" />;
    case 'rejected':
    case 'withdrawn':
      return <XCircleIcon {...iconProps} className="w-4 h-4 text-error-600" />;
    case 'submitted':
    case 'under_review':
      return <CheckCircleIcon {...iconProps} className="w-4 h-4 text-blue-600" />;
    case 'interview_scheduled':
      return <ExclamationTriangleIcon {...iconProps} className="w-4 h-4 text-purple-600" />;
    default:
      return <ClockIcon {...iconProps} className="w-4 h-4 text-gray-600" />;
  }
};

const getProgressPercentage = (status: ApplicationStatus): number => {
  const progressMap: Record<ApplicationStatus, number> = {
    draft: 10,
    in_progress: 30,
    submitted: 60,
    under_review: 75,
    interview_scheduled: 85,
    accepted: 100,
    rejected: 100,
    waitlisted: 90,
    deferred: 80,
    withdrawn: 100,
  };
  return progressMap[status] || 0;
};

const ProgressTimeline: React.FC<ProgressTimelineProps> = ({ application }) => {
  const steps = [
    { label: 'Application Started', status: 'draft' },
    { label: 'In Progress', status: 'in_progress' },
    { label: 'Submitted', status: 'submitted' },
    { label: 'Under Review', status: 'under_review' },
    { label: 'Decision', status: application.status },
  ];

  const currentStepIndex = steps.findIndex(step => 
    step.status === application.status || 
    (step.status === 'under_review' && ['interview_scheduled', 'accepted', 'rejected', 'waitlisted', 'deferred'].includes(application.status))
  );

  return (
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;
        
        return (
          <React.Fragment key={step.status}>
            <div className="flex items-center">
              <div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-primary-500 border-primary-500'
                    : isCurrent
                    ? 'bg-white border-primary-500'
                    : 'bg-gray-200 border-gray-300'
                }`}
              />
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 transition-all duration-300 ${
                  isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="bg-white rounded-lg p-6 shadow-soft animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="w-24 h-6 bg-gray-200 rounded"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-3 h-3 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const ApplicationProgress: React.FC<ApplicationProgressProps> = ({ 
  applications, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Progress</h2>
          <p className="text-gray-600">Track your application status</p>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Progress</h2>
          <p className="text-gray-600">Track your application status</p>
        </div>
        <div className="text-center py-12">
          <ClipboardDocumentListIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No applications yet</p>
          <p className="text-sm text-gray-400">Start your first application to see progress here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Application Progress</h2>
        <p className="text-gray-600">Track your application status</p>
      </div>

      <div className="space-y-6">
        {applications.slice(0, 5).map((application, index) => {
          const progressPercentage = getProgressPercentage(application.status);
          
          return (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-gray-100 rounded-lg p-4 hover:border-primary-200 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {/* Assuming university and program names are available in the application */}
                    University Application #{application.id.slice(-4)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Deadline: {new Date(application.deadlineDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {getStatusIcon(application.status)}
                    <span className="ml-1 capitalize">
                      {application.status.replace('_', ' ')}
                    </span>
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium text-gray-900">
                    {progressPercentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-primary-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                  />
                </div>
              </div>

              {/* Timeline */}
              <ProgressTimeline application={application} />
            </motion.div>
          );
        })}
      </div>

      {applications.length > 5 && (
        <div className="mt-6 text-center">
          <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            View all applications ({applications.length})
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicationProgress;