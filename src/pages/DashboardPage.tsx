import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { StudentDashboard } from '../components/dashboard/StudentDashboard';
import { InstructorDashboard } from '../components/dashboard/InstructorDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'instructor':
      return <InstructorDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <div>Unknown role</div>;
  }
};