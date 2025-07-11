import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  BookOpen, 
  Video, 
  Award, 
  Calendar,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const isInstructor = user?.role === 'instructor';
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  // Mock data - replace with real API calls
  const overviewStats = {
    totalUsers: { value: 1234, change: 12.5, trend: 'up' },
    activeCourses: { value: 56, change: -2.3, trend: 'down' },
    completionRate: { value: 87.2, change: 5.8, trend: 'up' },
    avgGrade: { value: 85.4, change: 3.2, trend: 'up' },
    liveSessions: { value: 142, change: 18.7, trend: 'up' },
    engagement: { value: 92.1, change: 7.4, trend: 'up' }
  };

  const studentPerformance = [
    { course: 'Advanced Mathematics', enrolled: 45, completed: 38, avgGrade: 87.2, passRate: 84.4 },
    { course: 'Computer Science', enrolled: 78, completed: 65, avgGrade: 89.5, passRate: 83.3 },
    { course: 'Physics Laboratory', enrolled: 32, completed: 28, avgGrade: 85.8, passRate: 87.5 },
    { course: 'Modern History', enrolled: 56, completed: 48, avgGrade: 82.1, passRate: 85.7 },
    { course: 'Creative Writing', enrolled: 28, completed: 25, avgGrade: 91.3, passRate: 89.3 }
  ];

  const engagementData = [
    { day: 'Mon', sessions: 24, duration: 145, participants: 89 },
    { day: 'Tue', sessions: 31, duration: 167, participants: 112 },
    { day: 'Wed', sessions: 28, duration: 134, participants: 95 },
    { day: 'Thu', sessions: 35, duration: 189, participants: 128 },
    { day: 'Fri', sessions: 22, duration: 98, participants: 67 },
    { day: 'Sat', sessions: 18, duration: 87, participants: 54 },
    { day: 'Sun', sessions: 15, duration: 76, participants: 43 }
  ];

  const topCourses = [
    { name: 'Computer Science Fundamentals', students: 78, rating: 4.8, completion: 83.3 },
    { name: 'Advanced Mathematics', students: 45, rating: 4.6, completion: 84.4 },
    { name: 'Physics Laboratory', students: 32, rating: 4.7, completion: 87.5 },
    { name: 'Modern History', students: 56, rating: 4.5, completion: 85.7 },
    { name: 'Creative Writing', students: 28, rating: 4.9, completion: 89.3 }
  ];

  const recentActivity = [
    { type: 'course_completion', user: 'أحمد محمد', course: 'الرياضيات المتقدمة', time: '2 hours ago' },
    { type: 'high_score', user: 'فاطمة أحمد', course: 'علوم الحاسوب', score: 95, time: '4 hours ago' },
    { type: 'session_completed', user: 'د. سميث', course: 'الفيزياء', participants: 28, time: '6 hours ago' },
    { type: 'new_enrollment', user: 'سارة علي', course: 'الكتابة الإبداعية', time: '8 hours ago' },
    { type: 'exam_submitted', user: 'محمد حسن', course: 'التاريخ الحديث', time: '1 day ago' }
  ];

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const exportData = () => {
    // Implement export functionality
    console.log('Exporting analytics data...');
  };

  const getStatIcon = (key: string) => {
    switch (key) {
      case 'totalUsers': return Users;
      case 'activeCourses': return BookOpen;
      case 'completionRate': return Target;
      case 'avgGrade': return Award;
      case 'liveSessions': return Video;
      case 'engagement': return Activity;
      default: return BarChart3;
    }
  };

  const getStatColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingDown;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h1>
          <p className="text-gray-600 mt-1">
            {isAdmin 
              ? t('analytics.description.admin')
              : isInstructor 
              ? t('analytics.description.instructor')
              : t('analytics.description.student')
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">{t('analytics.periods.week')}</option>
            <option value="month">{t('analytics.periods.month')}</option>
            <option value="quarter">{t('analytics.periods.quarter')}</option>
            <option value="year">{t('analytics.periods.year')}</option>
          </select>
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} size={16} />
            {t('analytics.refresh')}
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="mr-2" size={16} />
            {t('analytics.export')}
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {Object.entries(overviewStats).map(([key, stat]) => {
          const Icon = getStatIcon(key);
          const TrendIcon = getTrendIcon(stat.trend);
          
          return (
            <Card key={key} className="text-center hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                <Icon className="text-blue-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {typeof stat.value === 'number' && stat.value % 1 !== 0 
                  ? stat.value.toFixed(1) 
                  : stat.value
                }
                {key === 'completionRate' || key === 'avgGrade' || key === 'engagement' ? '%' : ''}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{t(`analytics.metrics.${key}`)}</p>
              <div className={`flex items-center justify-center space-x-1 text-xs ${getStatColor(stat.trend)}`}>
                <TrendIcon size={12} />
                <span>{Math.abs(stat.change)}%</span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Performance */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{t('analytics.studentPerformance')}</h3>
            <Button variant="outline" size="sm">
              <PieChart className="mr-2" size={14} />
              {t('analytics.viewChart')}
            </Button>
          </div>
          <div className="space-y-4">
            {studentPerformance.map((course, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{course.course}</h4>
                  <span className="text-sm text-gray-600">
                    {course.completed}/{course.enrolled} {t('analytics.completed')}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">{t('analytics.avgGrade')}</p>
                    <p className="font-semibold text-blue-600">{course.avgGrade}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('analytics.passRate')}</p>
                    <p className="font-semibold text-green-600">{course.passRate}%</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{t('analytics.completion')}</span>
                    <span>{((course.completed / course.enrolled) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(course.completed / course.enrolled) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Engagement Analytics */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">{t('analytics.engagementAnalytics')}</h3>
            <Button variant="outline" size="sm">
              <BarChart3 className="mr-2" size={14} />
              {t('analytics.viewDetails')}
            </Button>
          </div>
          <div className="space-y-4">
            {engagementData.map((day, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{t(`analytics.days.${day.day.toLowerCase()}`)}</h4>
                    <p className="text-sm text-gray-600">{day.sessions} {t('analytics.sessions')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{day.participants} {t('analytics.participants')}</p>
                  <p className="text-xs text-gray-600">{day.duration} {t('analytics.minutes')}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performing Courses */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{t('analytics.topCourses')}</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">{t('analytics.allMetrics')}</option>
              <option value="enrollment">{t('analytics.enrollment')}</option>
              <option value="completion">{t('analytics.completion')}</option>
              <option value="rating">{t('analytics.rating')}</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left rtl:text-right py-3 text-sm font-medium text-gray-600">{t('analytics.course')}</th>
                <th className="text-left rtl:text-right py-3 text-sm font-medium text-gray-600">{t('analytics.students')}</th>
                <th className="text-left rtl:text-right py-3 text-sm font-medium text-gray-600">{t('analytics.rating')}</th>
                <th className="text-left rtl:text-right py-3 text-sm font-medium text-gray-600">{t('analytics.completion')}</th>
                <th className="text-left rtl:text-right py-3 text-sm font-medium text-gray-600">{t('analytics.trend')}</th>
              </tr>
            </thead>
            <tbody>
              {topCourses.map((course, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="text-blue-600" size={16} />
                      </div>
                      <span className="font-medium text-gray-900">{course.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-sm text-gray-600">{course.students}</td>
                  <td className="py-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-yellow-600">{course.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${course.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{course.completion}%</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center space-x-1 text-green-600">
                      <TrendingUp size={16} />
                      <span className="text-sm">+{(Math.random() * 10).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('analytics.recentActivity')}</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                {activity.type === 'course_completion' && <Award className="text-blue-600" size={16} />}
                {activity.type === 'high_score' && <Target className="text-green-600" size={16} />}
                {activity.type === 'session_completed' && <Video className="text-purple-600" size={16} />}
                {activity.type === 'new_enrollment' && <Users className="text-orange-600" size={16} />}
                {activity.type === 'exam_submitted' && <BookOpen className="text-red-600" size={16} />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.type === 'course_completion' && t('analytics.activities.courseCompletion', { user: activity.user, course: activity.course })}
                  {activity.type === 'high_score' && t('analytics.activities.highScore', { user: activity.user, course: activity.course, score: activity.score })}
                  {activity.type === 'session_completed' && t('analytics.activities.sessionCompleted', { user: activity.user, course: activity.course, participants: activity.participants })}
                  {activity.type === 'new_enrollment' && t('analytics.activities.newEnrollment', { user: activity.user, course: activity.course })}
                  {activity.type === 'exam_submitted' && t('analytics.activities.examSubmitted', { user: activity.user, course: activity.course })}
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};