import React from 'react';
import { Users, BookOpen, Activity, UserCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: Users, color: 'blue' },
    { title: 'Active Courses', value: '56', icon: BookOpen, color: 'green' },
    { title: 'Live Sessions', value: '12', icon: Activity, color: 'purple' },
    { title: 'Pending Approvals', value: '8', icon: UserCheck, color: 'orange' },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Registered as Student', time: '5 min ago' },
    { id: 2, user: 'Dr. Smith', action: 'Created new course', time: '1 hour ago' },
    { id: 3, user: 'Jane Wilson', action: 'Submitted exam', time: '2 hours ago' },
    { id: 4, user: 'Prof. Johnson', action: 'Started live session', time: '3 hours ago' },
  ];

  const pendingApprovals = [
    { id: 1, name: 'Dr. Emily Brown', role: 'Instructor', department: 'Mathematics', date: '2024-01-15' },
    { id: 2, name: 'Prof. Michael Davis', role: 'Instructor', department: 'Computer Science', date: '2024-01-14' },
    { id: 3, name: 'Dr. Sarah Wilson', role: 'Instructor', department: 'Physics', date: '2024-01-13' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <TrendingUp className="mr-2" size={16} />
            Analytics
          </Button>
          <Button variant="primary">
            <AlertCircle className="mr-2" size={16} />
            System Health
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="text-center">
            <div className={`flex items-center justify-center w-12 h-12 bg-${stat.color}-100 rounded-lg mx-auto mb-4`}>
              <stat.icon className={`text-${stat.color}-600`} size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Activity className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{activity.user}</h4>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* System Overview */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Server Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Database</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Healthy
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Storage Used</span>
              <span className="text-sm text-gray-600">2.4 GB / 10 GB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Active Sessions</span>
              <span className="text-sm text-gray-600">127</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Approvals</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Department</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((approval) => (
                <tr key={approval.id} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">{approval.name}</td>
                  <td className="py-3 text-sm text-gray-600">{approval.role}</td>
                  <td className="py-3 text-sm text-gray-600">{approval.department}</td>
                  <td className="py-3 text-sm text-gray-600">{approval.date}</td>
                  <td className="py-3 space-x-2">
                    <Button variant="success" size="sm">
                      Approve
                    </Button>
                    <Button variant="danger" size="sm">
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};