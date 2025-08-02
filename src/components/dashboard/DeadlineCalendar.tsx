import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isBefore } from 'date-fns';

interface Deadline {
  id: string;
  title: string;
  date: string;
  type: 'application' | 'financial_aid' | 'scholarship' | 'document' | 'interview';
  priority: 'high' | 'medium' | 'low';
  universityName: string;
  programName?: string;
  completed?: boolean;
}

interface DeadlineCalendarProps {
  deadlines: Deadline[];
  isLoading?: boolean;
}

const getTypeColor = (type: Deadline['type']): string => {
  const colors = {
    application: 'bg-primary-500',
    financial_aid: 'bg-green-500',
    scholarship: 'bg-yellow-500',
    document: 'bg-blue-500',
    interview: 'bg-purple-500',
  };
  return colors[type] || 'bg-gray-500';
};

const getPriorityColor = (priority: Deadline['priority']): string => {
  const colors = {
    high: 'border-l-error-500 bg-error-50',
    medium: 'border-l-warning-500 bg-warning-50',
    low: 'border-l-success-500 bg-success-50',
  };
  return colors[priority] || 'border-l-gray-500 bg-gray-50';
};

const getDaysUntilDeadline = (deadlineDate: string): number => {
  const today = new Date();
  const deadline = new Date(deadlineDate);
  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const DeadlineItem: React.FC<{ deadline: Deadline; index: number }> = ({ deadline, index }) => {
  const daysLeft = getDaysUntilDeadline(deadline.date);
  const isOverdue = daysLeft < 0;
  const isUrgent = daysLeft <= 7 && daysLeft >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`border-l-4 p-4 mb-3 rounded-r-lg ${getPriorityColor(deadline.priority)} ${
        deadline.completed ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className={`font-medium ${deadline.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {deadline.title}
            </h4>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(deadline.type)} text-white`}>
              {deadline.type.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">{deadline.universityName}</p>
          {deadline.programName && (
            <p className="text-xs text-gray-500 mb-2">{deadline.programName}</p>
          )}
          <div className="flex items-center space-x-4 text-xs">
            <span className="flex items-center text-gray-500">
              <CalendarDaysIcon className="w-3 h-3 mr-1" />
              {format(new Date(deadline.date), 'MMM dd, yyyy')}
            </span>
            <span className={`flex items-center font-medium ${
              isOverdue ? 'text-error-600' : isUrgent ? 'text-warning-600' : 'text-gray-500'
            }`}>
              <ClockIcon className="w-3 h-3 mr-1" />
              {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
            </span>
          </div>
        </div>
        {(isUrgent || isOverdue) && !deadline.completed && (
          <div className="ml-4">
            {isOverdue ? (
              <ExclamationTriangleIcon className="w-5 h-5 text-error-500" />
            ) : (
              <BellIcon className="w-5 h-5 text-warning-500" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CalendarView: React.FC<{ deadlines: Deadline[]; currentDate: Date; onDateSelect: (date: Date) => void }> = ({
  deadlines,
  currentDate,
  onDateSelect,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDeadlinesForDate = (date: Date) => {
    return deadlines.filter(deadline => isSameDay(new Date(deadline.date), date));
  };

  return (
    <div className="grid grid-cols-7 gap-1">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="p-2 text-center text-xs font-medium text-gray-500">
          {day}
        </div>
      ))}
      {monthDays.map(day => {
        const dayDeadlines = getDeadlinesForDate(day);
        const isCurrentMonth = isSameMonth(day, currentDate);
        const isCurrentDay = isToday(day);

        return (
          <button
            key={day.toISOString()}
            onClick={() => onDateSelect(day)}
            className={`relative p-2 text-sm rounded-lg transition-colors ${
              isCurrentMonth
                ? isCurrentDay
                  ? 'bg-primary-500 text-white font-medium'
                  : dayDeadlines.length > 0
                  ? 'bg-primary-50 text-primary-700 hover:bg-primary-100'
                  : 'text-gray-900 hover:bg-gray-50'
                : 'text-gray-400'
            }`}
          >
            {format(day, 'd')}
            {dayDeadlines.length > 0 && (
              <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                {dayDeadlines.slice(0, 3).map((deadline, index) => (
                  <div
                    key={deadline.id}
                    className={`w-1 h-1 rounded-full ${getTypeColor(deadline.type).replace('bg-', 'bg-')} ${
                      isCurrentDay ? 'bg-white' : ''
                    }`}
                  />
                ))}
                {dayDeadlines.length > 3 && (
                  <div className="w-1 h-1 rounded-full bg-gray-400" />
                )}
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export const DeadlineCalendar: React.FC<DeadlineCalendarProps> = ({ deadlines, isLoading = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-soft">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const upcomingDeadlines = deadlines
    .filter(deadline => !deadline.completed && new Date(deadline.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  const selectedDateDeadlines = selectedDate
    ? deadlines.filter(deadline => isSameDay(new Date(deadline.date), selectedDate))
    : [];

  return (
    <div className="bg-white rounded-xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Upcoming Deadlines</h2>
          <p className="text-gray-600">Stay on top of important dates</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              view === 'list'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              view === 'calendar'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-12">
                <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming deadlines</p>
                <p className="text-sm text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-0">
                {upcomingDeadlines.map((deadline, index) => (
                  <DeadlineItem key={deadline.id} deadline={deadline} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              <CalendarView
                deadlines={deadlines}
                currentDate={currentDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            {selectedDate && selectedDateDeadlines.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-t pt-4"
              >
                <h4 className="font-medium text-gray-900 mb-3">
                  {format(selectedDate, 'MMMM dd, yyyy')}
                </h4>
                <div className="space-y-2">
                  {selectedDateDeadlines.map((deadline, index) => (
                    <DeadlineItem key={deadline.id} deadline={deadline} index={index} />
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeadlineCalendar;