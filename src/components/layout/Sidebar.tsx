import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  UserIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { ROUTES } from '../../constants';
import { cn } from '../../utils';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: number;
}

const navigation: SidebarItem[] = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD, icon: HomeIcon },
  { name: 'Universities', href: ROUTES.UNIVERSITIES, icon: AcademicCapIcon },
  { name: 'My Applications', href: ROUTES.APPLICATIONS, icon: ClipboardDocumentListIcon },
  { name: 'Documents', href: ROUTES.DOCUMENTS, icon: DocumentTextIcon },
  { name: 'Essays', href: ROUTES.ESSAYS, icon: DocumentTextIcon },
  { name: 'Recommendations', href: ROUTES.RECOMMENDATIONS, icon: UserIcon },
  { name: 'Deadlines', href: ROUTES.DEADLINES, icon: CalendarIcon },
  { name: 'Scholarships', href: ROUTES.SCHOLARSHIPS, icon: ChartBarIcon },
];

const secondaryNavigation: SidebarItem[] = [
  { name: 'Profile', href: ROUTES.PROFILE, icon: UserIcon },
  { name: 'Settings', href: ROUTES.SETTINGS, icon: CogIcon },
  { name: 'Help', href: ROUTES.HELP, icon: QuestionMarkCircleIcon },
];

export function Sidebar() {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === ROUTES.DASHBOARD) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex-1 px-3 space-y-1">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive(item.href)
                    ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 flex-shrink-0 h-5 w-5',
                    isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
                {item.badge && (
                  <span className="ml-auto inline-block py-0.5 px-2 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Secondary navigation */}
      <div className="flex-shrink-0 border-t border-gray-200">
        <div className="px-3 py-4 space-y-1">
          {secondaryNavigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive(item.href)
                  ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 flex-shrink-0 h-5 w-5',
                  isActive(item.href) ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}