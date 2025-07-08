import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, User, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                <img 
                  src="/OU-S-Logo.svg" 
                  className="h-8 w-auto"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role === 'student' ? t('auth.student') : 
                     user?.role === 'instructor' ? t('auth.instructor') : user?.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <LanguageSwitcher />
                <Button variant="ghost" size="sm">
                  <Settings size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};