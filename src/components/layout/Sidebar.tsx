import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Video, 
  FileText, 
  Users, 
  Calendar, 
  Settings,
  BarChart3,
  GraduationCap,
  UserCheck,
  Award
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { clsx } from 'clsx';

const getNavigationItems = (role: string) => {
  const commonItems = [
    { name: 'navigation.dashboard', href: '/dashboard', icon: Home },
    { name: 'navigation.courses', href: '/courses', icon: BookOpen },
    { name: 'navigation.schedule', href: '/schedule', icon: Calendar },
  ];

  const roleSpecificItems = {
    student: [
      { name: 'navigation.liveSessions', href: '/sessions', icon: Video },
      { name: 'navigation.exams', href: '/exams', icon: FileText },
      { name: 'navigation.grades', href: '/grades', icon: Award },
    ],
    instructor: [
      { name: 'navigation.liveSessions', href: '/sessions', icon: Video },
      { name: 'navigation.exams', href: '/exams', icon: FileText },
      { name: 'navigation.students', href: '/students', icon: GraduationCap },
      { name: 'navigation.grades', href: '/grades', icon: BarChart3 },
    ],
    admin: [
      { name: 'navigation.users', href: '/users', icon: Users },
      { name: 'navigation.analytics', href: '/analytics', icon: BarChart3 },
      { name: 'navigation.approvals', href: '/approvals', icon: UserCheck },
      { name: 'navigation.settings', href: '/settings', icon: Settings },
    ],
  };

  return [...commonItems, ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || [])];
};

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  if (!user) return null;

  const navigationItems = getNavigationItems(user.role);

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <img 
            src="/OU-S-Logo.svg" 
            className="h-8 w-auto filter brightness-0 invert"
          />
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                clsx(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                )
              }
            >
              <item.icon size={18} />
              <span>{t(item.name)}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};