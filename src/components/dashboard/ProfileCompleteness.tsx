import React from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  MapPinIcon,
  PhoneIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import type { User } from '../../types';

interface ProfileCompletenessProps {
  user: User;
  isLoading?: boolean;
  onNavigateToProfile?: () => void;
}

interface ProfileSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  required: boolean;
  action?: string;
  items?: { label: string; completed: boolean }[];
}

const getCompletionPercentage = (sections: ProfileSection[]): number => {
  const totalSections = sections.length;
  const completedSections = sections.filter(section => section.completed).length;
  return totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
};

const getProfileSections = (user: User): ProfileSection[] => {
  const profile = user.profile;
  
  return [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Complete your personal details',
      icon: UserIcon,
      completed: !!(user.firstName && user.lastName && user.email),
      required: true,
      action: 'Complete basic info',
      items: [
        { label: 'First name', completed: !!user.firstName },
        { label: 'Last name', completed: !!user.lastName },
        { label: 'Email address', completed: !!user.email },
      ],
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Add your phone and address',
      icon: PhoneIcon,
      completed: !!(profile?.phoneNumber && profile?.address),
      required: true,
      action: 'Add contact details',
      items: [
        { label: 'Phone number', completed: !!profile?.phoneNumber },
        { label: 'Address', completed: !!profile?.address },
        { label: 'Emergency contact', completed: !!profile?.emergencyContact },
      ],
    },
    {
      id: 'academic',
      title: 'Academic Information',
      description: 'Share your educational background',
      icon: AcademicCapIcon,
      completed: !!(profile?.academicInfo?.currentGPA && profile?.academicInfo?.graduationYear),
      required: true,
      action: 'Complete academic profile',
      items: [
        { label: 'Current GPA', completed: !!profile?.academicInfo?.currentGPA },
        { label: 'Graduation year', completed: !!profile?.academicInfo?.graduationYear },
        { label: 'Intended major', completed: !!profile?.academicInfo?.intendedMajor },
        { label: 'Current level', completed: !!profile?.academicInfo?.currentLevel },
      ],
    },
    {
      id: 'location',
      title: 'Location Details',
      description: 'Specify your nationality and location',
      icon: MapPinIcon,
      completed: !!(profile?.nationality && profile?.address?.country),
      required: false,
      action: 'Add location info',
      items: [
        { label: 'Nationality', completed: !!profile?.nationality },
        { label: 'Country', completed: !!profile?.address?.country },
        { label: 'State/Province', completed: !!profile?.address?.state },
      ],
    },
    {
      id: 'documents',
      title: 'Profile Documents',
      description: 'Upload important documents',
      icon: DocumentTextIcon,
      completed: false, // This would be based on uploaded documents
      required: false,
      action: 'Upload documents',
      items: [
        { label: 'Profile photo', completed: !!user.avatar },
        { label: 'Official transcript', completed: false },
        { label: 'Resume/CV', completed: false },
      ],
    },
    {
      id: 'avatar',
      title: 'Profile Photo',
      description: 'Add a professional photo',
      icon: CameraIcon,
      completed: !!user.avatar,
      required: false,
      action: 'Upload photo',
    },
  ];
};

const SectionItem: React.FC<{
  section: ProfileSection;
  index: number;
  onNavigateToProfile?: () => void;
}> = ({ section, index, onNavigateToProfile }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border rounded-lg transition-all duration-200 ${
        section.completed
          ? 'border-success-200 bg-success-50'
          : section.required
          ? 'border-warning-200 bg-warning-50'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">
            {section.completed ? (
              <CheckCircleIconSolid className="w-5 h-5 text-success-600" />
            ) : section.required ? (
              <ExclamationTriangleIcon className="w-5 h-5 text-warning-600" />
            ) : (
              <section.icon className="w-5 h-5 text-gray-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <h4
                  className={`font-medium ${
                    section.completed ? 'text-success-900' : 'text-gray-900'
                  }`}
                >
                  {section.title}
                </h4>
                {section.required && !section.completed && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-700">
                    Required
                  </span>
                )}
              </div>
              
              {section.items && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ArrowRightIcon
                    className={`w-4 h-4 transition-transform ${
                      isExpanded ? 'rotate-90' : ''
                    }`}
                  />
                </button>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-3">{section.description}</p>

            {!section.completed && (
              <button
                onClick={onNavigateToProfile}
                className={`text-sm font-medium transition-colors ${
                  section.required
                    ? 'text-warning-600 hover:text-warning-700'
                    : 'text-primary-600 hover:text-primary-700'
                }`}
              >
                {section.action} →
              </button>
            )}

            {/* Expandable Items */}
            {section.items && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-gray-200"
              >
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center space-x-2">
                      {item.completed ? (
                        <CheckCircleIcon className="w-4 h-4 text-success-600" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <span
                        className={`text-sm ${
                          item.completed ? 'text-success-700' : 'text-gray-600'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-soft animate-pulse">
    <div className="mb-6">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="text-center">
          <div className="h-6 bg-gray-200 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-gray-200 rounded mt-0.5"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ProfileCompleteness: React.FC<ProfileCompletenessProps> = ({
  user,
  isLoading = false,
  onNavigateToProfile,
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const sections = getProfileSections(user);
  const completionPercentage = getCompletionPercentage(sections);
  const completedSections = sections.filter(s => s.completed).length;
  const requiredIncomplete = sections.filter(s => s.required && !s.completed).length;

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Completeness</h2>
            <p className="text-gray-600">Complete your profile to improve application success</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">{completionPercentage}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full transition-colors ${
                completionPercentage === 100
                  ? 'bg-success-500'
                  : completionPercentage >= 75
                  ? 'bg-primary-500'
                  : completionPercentage >= 50
                  ? 'bg-warning-500'
                  : 'bg-error-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{completedSections}</div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-warning-600">{requiredIncomplete}</div>
            <div className="text-xs text-gray-500">Required</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600">{sections.length - completedSections}</div>
            <div className="text-xs text-gray-500">Remaining</div>
          </div>
        </div>

        {/* Completion Message */}
        {completionPercentage === 100 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-success-50 border border-success-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-3">
              <CheckCircleIconSolid className="w-6 h-6 text-success-600" />
              <div>
                <h3 className="font-medium text-success-900">Profile Complete!</h3>
                <p className="text-sm text-success-700">
                  Your profile is fully complete and ready for applications.
                </p>
              </div>
            </div>
          </motion.div>
        ) : requiredIncomplete > 0 ? (
          <div className="bg-warning-50 border border-warning-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-warning-600" />
              <div>
                <h3 className="font-medium text-warning-900">Complete Required Sections</h3>
                <p className="text-sm text-warning-700">
                  {requiredIncomplete} required section{requiredIncomplete !== 1 ? 's' : ''} need{requiredIncomplete === 1 ? 's' : ''} your attention.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="w-6 h-6 text-primary-600" />
              <div>
                <h3 className="font-medium text-primary-900">Great Progress!</h3>
                <p className="text-sm text-primary-700">
                  All required sections are complete. Consider adding optional information.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section List */}
      <div className="space-y-3">
        {sections
          .sort((a, b) => {
            // Sort by: incomplete required first, then incomplete optional, then completed
            if (a.required && !a.completed && (!b.required || b.completed)) return -1;
            if (b.required && !b.completed && (!a.required || a.completed)) return 1;
            if (!a.completed && b.completed) return -1;
            if (a.completed && !b.completed) return 1;
            return 0;
          })
          .map((section, index) => (
            <SectionItem
              key={section.id}
              section={section}
              index={index}
              onNavigateToProfile={onNavigateToProfile}
            />
          ))}
      </div>

      {/* Action Button */}
      {completionPercentage < 100 && (
        <div className="mt-6 pt-6 border-t">
          <button
            onClick={onNavigateToProfile}
            className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            Complete Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileCompleteness;