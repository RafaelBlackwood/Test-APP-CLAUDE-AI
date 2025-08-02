import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'application' | 'document' | 'deadline' | 'research' | 'financial' | 'other';
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  isRecommended?: boolean;
  applicationId?: string;
  university?: string;
  estimatedTime?: number; // in minutes
}

interface TaskManagerProps {
  tasks: Task[];
  isLoading?: boolean;
  onTaskComplete?: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskAdd?: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

const getPriorityColor = (priority: Task['priority']): string => {
  const colors = {
    high: 'border-l-error-500 bg-error-50',
    medium: 'border-l-warning-500 bg-warning-50',
    low: 'border-l-success-500 bg-success-50',
  };
  return colors[priority] || colors.low;
};

const getCategoryIcon = (category: Task['category']) => {
  const iconProps = { className: 'w-4 h-4' };
  
  switch (category) {
    case 'application':
      return <ClipboardDocumentListIcon {...iconProps} />;
    case 'document':
      return <DocumentTextIcon {...iconProps} />;
    case 'deadline':
      return <ClockIcon {...iconProps} />;
    case 'research':
      return <AcademicCapIcon {...iconProps} />;
    case 'financial':
      return <CurrencyDollarIcon {...iconProps} />;
    default:
      return <LightBulbIcon {...iconProps} />;
  }
};

const getCategoryColor = (category: Task['category']): string => {
  const colors = {
    application: 'bg-primary-100 text-primary-700',
    document: 'bg-blue-100 text-blue-700',
    deadline: 'bg-orange-100 text-orange-700',
    research: 'bg-purple-100 text-purple-700',
    financial: 'bg-green-100 text-green-700',
    other: 'bg-gray-100 text-gray-700',
  };
  return colors[category] || colors.other;
};

const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const TaskItem: React.FC<{
  task: Task;
  index: number;
  onComplete?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}> = ({ task, index, onComplete, onDelete }) => {
  const daysUntilDue = task.dueDate ? getDaysUntilDue(task.dueDate) : null;
  const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
  const isUrgent = daysUntilDue !== null && daysUntilDue <= 3 && daysUntilDue >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border-l-4 rounded-r-lg transition-all duration-200 ${
        task.completed ? 'opacity-60' : ''
      } ${getPriorityColor(task.priority)}`}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <button
            onClick={() => onComplete?.(task.id)}
            className={`mt-0.5 transition-colors ${
              task.completed
                ? 'text-success-600'
                : 'text-gray-400 hover:text-success-600'
            }`}
          >
            {task.completed ? (
              <CheckCircleIconSolid className="w-5 h-5" />
            ) : (
              <CheckCircleIcon className="w-5 h-5" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4
                    className={`font-medium ${
                      task.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </h4>
                  {task.isRecommended && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                      <LightBulbIcon className="w-3 h-3 mr-1" />
                      Recommended
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                
                {task.university && (
                  <p className="text-xs text-gray-500 mb-2">{task.university}</p>
                )}
              </div>

              <button
                onClick={() => onDelete?.(task.id)}
                className="text-gray-400 hover:text-error-600 transition-colors ml-2"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-xs">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full font-medium ${getCategoryColor(
                    task.category
                  )}`}
                >
                  {getCategoryIcon(task.category)}
                  <span className="ml-1 capitalize">{task.category}</span>
                </span>

                {task.estimatedTime && (
                  <span className="text-gray-500">
                    ~{task.estimatedTime}min
                  </span>
                )}
              </div>

              {task.dueDate && (
                <span
                  className={`text-xs font-medium ${
                    isOverdue
                      ? 'text-error-600'
                      : isUrgent
                      ? 'text-warning-600'
                      : 'text-gray-500'
                  }`}
                >
                  {isOverdue
                    ? `${Math.abs(daysUntilDue!)} days overdue`
                    : daysUntilDue === 0
                    ? 'Due today'
                    : `${daysUntilDue} days left`}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const QuickAddTask: React.FC<{
  onAdd?: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}> = ({ onAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd?.({
        title: title.trim(),
        description: '',
        priority,
        category: 'other',
        completed: false,
      });
      setTitle('');
      setIsOpen(false);
    }
  };

  return (
    <div className="border-t pt-4">
      <AnimatePresence>
        {isOpen ? (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700"
                >
                  Add Task
                </button>
              </div>
            </div>
          </motion.form>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Quick Task</span>
          </button>
        )}
      </AnimatePresence>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="border-l-4 border-l-gray-200 bg-gray-50 rounded-r-lg p-4 animate-pulse">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-gray-200 rounded-full mt-0.5"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
            <div className="flex items-center space-x-3">
              <div className="h-5 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  isLoading = false,
  onTaskComplete,
  onTaskDelete,
  onTaskAdd,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'recommended'>('all');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending':
        return !task.completed;
      case 'completed':
        return task.completed;
      case 'recommended':
        return task.isRecommended && !task.completed;
      default:
        return true;
    }
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
    recommended: tasks.filter(t => t.isRecommended && !t.completed).length,
  };

  const completionPercentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Task Manager</h2>
            <p className="text-gray-600">Stay organized with personalized recommendations</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{completionPercentage}%</div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        {/* Progress Bar */}
        {stats.total > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-success-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center space-x-2 mb-6">
          {[
            { key: 'all', label: 'All', count: stats.total },
            { key: 'pending', label: 'Pending', count: stats.pending },
            { key: 'completed', label: 'Completed', count: stats.completed },
            { key: 'recommended', label: 'Recommended', count: stats.recommended },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                filter === key
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {filter === 'completed' ? 'No completed tasks yet' : 'No tasks found'}
              </p>
              <p className="text-sm text-gray-400">
                {filter === 'pending' ? 'All tasks are completed!' : 'Try adjusting your filter'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks
                .sort((a, b) => {
                  // Sort by: recommended first, then by priority, then by due date
                  if (a.isRecommended && !b.isRecommended) return -1;
                  if (!a.isRecommended && b.isRecommended) return 1;
                  
                  const priorityOrder = { high: 3, medium: 2, low: 1 };
                  const aPriority = priorityOrder[a.priority];
                  const bPriority = priorityOrder[b.priority];
                  if (aPriority !== bPriority) return bPriority - aPriority;
                  
                  if (a.dueDate && b.dueDate) {
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                  }
                  if (a.dueDate && !b.dueDate) return -1;
                  if (!a.dueDate && b.dueDate) return 1;
                  
                  return 0;
                })
                .map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    onComplete={onTaskComplete}
                    onDelete={onTaskDelete}
                  />
                ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Quick Add Task */}
      <QuickAddTask onAdd={onTaskAdd} />
    </div>
  );
};

// Import missing icons
import {
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default TaskManager;