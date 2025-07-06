import React from 'react';
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
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
  ];

  const roleSpecificItems = {
    student: [
      { name: 'Live Sessions', href: '/sessions', icon: Video },
      { name: 'Exams', href: '/exams', icon: FileText },
      { name: 'Grades', href: '/grades', icon: Award },
    ],
    instructor: [
      { name: 'Live Sessions', href: '/sessions', icon: Video },
      { name: 'Exams', href: '/exams', icon: FileText },
      { name: 'Students', href: '/students', icon: GraduationCap },
      { name: 'Grades', href: '/grades', icon: BarChart3 },
    ],
    admin: [
      { name: 'Users', href: '/users', icon: Users },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'Approvals', href: '/approvals', icon: UserCheck },
      { name: 'Settings', href: '/settings', icon: Settings },
    ],
  };

  return [...commonItems, ...(roleSpecificItems[role as keyof typeof roleSpecificItems] || [])];
};

export const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  
  if (!user) return null;

  const navigationItems = getNavigationItems(user.role);

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <span className="text-xl font-bold">EduPlatform</span>
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
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};