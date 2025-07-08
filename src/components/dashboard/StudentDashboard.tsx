import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Calendar, Clock, Award, Video, FileText } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useLiveSessionStore } from '../../stores/liveSessionStore';
import { format } from 'date-fns';

export const StudentDashboard: React.FC = () => {
  const { activeSessions, fetchActiveSessions } = useLiveSessionStore();
  const { t } = useTranslation();

  useEffect(() => {
    fetchActiveSessions();
  }, [fetchActiveSessions]);

  const upcomingClasses = [
    { id: 1, title: 'Advanced Mathematics', time: '10:00 AM', instructor: 'Dr. Smith', room: 'Room A-101' },
    { id: 2, title: 'Computer Science', time: '2:00 PM', instructor: 'Prof. Johnson', room: 'Lab B-205' },
    { id: 3, title: 'Physics Laboratory', time: '4:00 PM', instructor: 'Dr. Brown', room: 'Lab C-301' },
  ];

  const enrolledCourses = [
    { id: 1, title: 'Advanced Mathematics', progress: 75, instructor: 'Dr. Smith' },
    { id: 2, title: 'Computer Science', progress: 60, instructor: 'Prof. Johnson' },
    { id: 3, title: 'Physics Laboratory', progress: 85, instructor: 'Dr. Brown' },
  ];

  const recentGrades = [
    { id: 1, subject: 'Mathematics Quiz', grade: 'A-', date: '2024-01-15' },
    { id: 2, subject: 'CS Assignment', grade: 'B+', date: '2024-01-12' },
    { id: 3, subject: 'Physics Lab Report', grade: 'A', date: '2024-01-10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.studentDashboard')}</h1>
        <Button variant="primary">
          <Calendar className="mr-2 rtl:ml-2 rtl:mr-0" size={16} />
          {t('dashboard.viewSchedule')}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
            <BookOpen className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">3</h3>
          <p className="text-sm text-gray-600">{t('dashboard.enrolledCourses')}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
            <Award className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">B+</h3>
          <p className="text-sm text-gray-600">{t('dashboard.averageGrade')}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
            <Video className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{activeSessions.length}</h3>
          <p className="text-sm text-gray-600">{t('dashboard.liveSessionsNow')}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
            <FileText className="text-orange-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">1</h3>
          <p className="text-sm text-gray-600">{t('dashboard.pendingExams')}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Sessions */}
        {activeSessions.length > 0 && (
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.liveSessionsNow')}</h3>
            <div className="space-y-3">
              {activeSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                      <Video className="text-green-600" size={16} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{session.title}</h4>
                      <p className="text-sm text-gray-600">
                        Started {format(new Date(session.startTime), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-sm text-green-600 mb-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                     <span>{t('liveSessions.live')}</span>
                    </div>
                    <Button variant="success" size="sm">
                     {t('dashboard.join')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Today's Classes */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.todaysClasses')}</h3>
          <div className="space-y-3">
            {upcomingClasses.map((class_) => (
              <div key={class_.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                    <Clock className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{class_.title}</h4>
                    <p className="text-sm text-gray-600">{class_.instructor} • {class_.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{class_.time}</p>
                  <Button variant="outline" size="sm">
                    {t('dashboard.join')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Course Progress */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.courseProgress')}</h3>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-900">{course.title}</h4>
                  <span className="text-sm text-gray-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{course.instructor}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.recentGrades')}</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left rtl:text-right py-2 text-sm font-medium text-gray-600">{t('grades.assignment')}</th>
                <th className="text-left rtl:text-right py-2 text-sm font-medium text-gray-600">{t('dashboard.grade')}</th>
                <th className="text-left rtl:text-right py-2 text-sm font-medium text-gray-600">{t('dashboard.date')}</th>
              </tr>
            </thead>
            <tbody>
              {recentGrades.map((grade) => (
                <tr key={grade.id} className="border-b border-gray-100">
                  <td className="py-3 text-sm text-gray-900">{grade.subject}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {grade.grade}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{grade.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};