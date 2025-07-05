import React, { useEffect } from 'react';
import { BookOpen, Users, Calendar, BarChart3, Video, FileText, Plus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useLiveSessionStore } from '../../stores/liveSessionStore';
import { format } from 'date-fns';

export const InstructorDashboard: React.FC = () => {
  const { activeSessions, sessions, fetchSessions, fetchActiveSessions } = useLiveSessionStore();

  useEffect(() => {
    fetchSessions();
    fetchActiveSessions();
  }, [fetchSessions, fetchActiveSessions]);

  const courses = [
    { id: 1, title: 'Advanced Mathematics', students: 45, sessions: 12, completion: 75 },
    { id: 2, title: 'Linear Algebra', students: 32, sessions: 8, completion: 60 },
    { id: 3, title: 'Statistics', students: 28, sessions: 10, completion: 85 },
  ];

  const upcomingSessions = sessions.filter(session => 
    new Date(session.startTime) > new Date() && !session.isActive
  ).slice(0, 3);

  const pendingGrades = [
    { id: 1, exam: 'Mathematics Final', submissions: 45, pending: 12 },
    { id: 2, exam: 'Statistics Quiz', submissions: 28, pending: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="mr-2" size={16} />
            Schedule
          </Button>
          <Button variant="primary">
            <BookOpen className="mr-2" size={16} />
            New Course
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
            <BookOpen className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">3</h3>
          <p className="text-sm text-gray-600">Active Courses</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
            <Users className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">105</h3>
          <p className="text-sm text-gray-600">Total Students</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
            <Video className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{activeSessions.length}</h3>
          <p className="text-sm text-gray-600">Live Sessions Now</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
            <FileText className="text-orange-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">17</h3>
          <p className="text-sm text-gray-600">Pending Grades</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Live Sessions */}
        {activeSessions.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Active Live Sessions</h3>
              <div className="flex items-center space-x-1 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{session.title}</h4>
                    <Button variant="success" size="sm">
                      Join
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Started</p>
                      <p className="font-medium">{format(new Date(session.startTime), 'HH:mm')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Participants</p>
                      <p className="font-medium">{session.participantCount || 0}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* My Courses */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">My Courses</h3>
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Students</p>
                    <p className="font-medium">{course.students}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Sessions</p>
                    <p className="font-medium">{course.sessions}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Completion</p>
                    <p className="font-medium">{course.completion}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h3>
            <Button variant="outline" size="sm">
              <Plus className="mr-1" size={14} />
              Create
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                      <Video className="text-blue-600" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <p className="text-sm text-gray-600">
                        {format(new Date(session.startTime), 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Button variant="primary" size="sm">
                      Start
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Video size={32} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No upcoming sessions</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Pending Grades */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Grades</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-sm font-medium text-gray-600">Exam</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Submissions</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Pending</th>
                <th className="text-left py-2 text-sm font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingGrades.map((grade) => (
                <tr key={grade.id} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">{grade.exam}</td>
                  <td className="py-3 text-sm text-gray-600">{grade.submissions}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {grade.pending} pending
                    </span>
                  </td>
                  <td className="py-3">
                    <Button variant="outline" size="sm">
                      Grade
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