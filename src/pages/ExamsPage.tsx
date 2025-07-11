import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Clock, Users, FileText, Calendar, CheckCircle, AlertCircle, Play, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';

export const ExamsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const isInstructor = user?.role === 'instructor';
  const isStudent = user?.role === 'student';

  const exams = [
    {
      id: 1,
      title: 'Advanced Mathematics Final Exam',
      course: 'Advanced Mathematics',
      description: 'Comprehensive final examination covering calculus, linear algebra, and differential equations.',
      startDate: '2024-01-20T09:00:00Z',
      endDate: '2024-01-20T12:00:00Z',
      duration: 180, // minutes
      totalQuestions: 25,
      totalPoints: 100,
      attempts: 1,
      maxAttempts: 1,
      status: 'upcoming',
      submissions: 0,
      totalStudents: 45,
      isActive: true,
    },
    {
      id: 2,
      title: 'Computer Science Midterm',
      course: 'Computer Science Fundamentals',
      description: 'Midterm examination on algorithms, data structures, and programming concepts.',
      startDate: '2024-01-15T14:00:00Z',
      endDate: '2024-01-15T16:00:00Z',
      duration: 120,
      totalQuestions: 20,
      totalPoints: 80,
      attempts: 1,
      maxAttempts: 2,
      status: 'completed',
      submissions: 32,
      totalStudents: 35,
      isActive: false,
      score: 85,
      grade: 'A-',
    },
    {
      id: 3,
      title: 'Physics Laboratory Quiz',
      course: 'Physics Laboratory',
      description: 'Quick assessment on laboratory procedures and safety protocols.',
      startDate: '2024-01-18T10:00:00Z',
      endDate: '2024-01-18T10:30:00Z',
      duration: 30,
      totalQuestions: 10,
      totalPoints: 50,
      attempts: 0,
      maxAttempts: 1,
      status: 'active',
      submissions: 12,
      totalStudents: 28,
      isActive: true,
    },
  ];

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || exam.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (exam: any) => {
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);

    if (now < startDate) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock size={12} className="mr-1" />
          {t('exams.upcoming')}
        </span>
      );
    } else if (now >= startDate && now <= endDate) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
          {t('exams.status.active')}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <CheckCircle size={12} className="mr-1" />
          {t('exams.completed')}
        </span>
      );
    }
  };

  const getActionButton = (exam: any) => {
    const now = new Date();
    const startDate = new Date(exam.startDate);
    const endDate = new Date(exam.endDate);

    if (isInstructor) {
      return (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Eye size={14} className="mr-1" />
            {t('common.view')}
          </Button>
          <Button variant="primary" size="sm">
            {t('exams.manage')}
          </Button>
        </div>
      );
    }

    if (isStudent) {
      if (now < startDate) {
        return (
          <Button variant="outline" size="sm" disabled>
            <Clock size={14} className="mr-1" />
            {t('exams.startTime')} {format(startDate, 'MMM dd, HH:mm')}
          </Button>
        );
      } else if (now >= startDate && now <= endDate && exam.attempts < exam.maxAttempts) {
        return (
          <Button variant="success" size="sm">
            <Play size={14} className="mr-1" />
            {t('exams.startExam')}
          </Button>
        );
      } else if (exam.attempts >= exam.maxAttempts || now > endDate) {
        return (
          <Button variant="outline" size="sm">
            <Eye size={14} className="mr-1" />
            {t('exams.viewResults')}
          </Button>
        );
      }
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('exams.title')}</h1>
          <p className="text-gray-600 mt-1">
            {isInstructor 
              ? t('exams.description.instructor')
              : t('exams.description.student')
            }
          </p>
        </div>
        {isInstructor && (
          <Button variant="primary">
            <Plus className="mr-2" size={16} />
            {t('exams.createExam')}
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t('common.search') + '...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">{t('exams.title')}</option>
          <option value="upcoming">{t('exams.upcoming')}</option>
          <option value="active">{t('exams.status.active')}</option>
          <option value="completed">{t('exams.completed')}</option>
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
            <FileText className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{exams.length}</h3>
          <p className="text-sm text-gray-600">{t('exams.totalExams')}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {exams.filter(e => {
              const now = new Date();
              const start = new Date(e.startDate);
              const end = new Date(e.endDate);
              return now >= start && now <= end;
            }).length}
          </h3>
          <p className="text-sm text-gray-600">{t('exams.activeNow')}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
            <Clock className="text-orange-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {exams.filter(e => new Date(e.startDate) > new Date()).length}
          </h3>
          <p className="text-sm text-gray-600">{t('exams.upcoming')}</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
            <CheckCircle className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isStudent 
              ? exams.filter(e => e.score).length
              : exams.filter(e => new Date(e.endDate) < new Date()).length
            }
          </h3>
          <p className="text-sm text-gray-600">
            {isStudent ? t('exams.completed') : t('exams.finished')}
          </p>
        </Card>
      </div>

      {/* Exams List */}
      <div className="space-y-4">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                  <FileText className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{exam.title}</h3>
                    {getStatusBadge(exam)}
                  </div>
                  <p className="text-sm text-blue-600 font-medium mb-2">{exam.course}</p>
                  <p className="text-gray-600 text-sm mb-3">{exam.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">{t('exams.startTime')}</p>
                      <p className="font-medium">{format(new Date(exam.startDate), 'MMM dd, HH:mm')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('exams.duration')}</p>
                      <p className="font-medium">{exam.duration} {t('exams.minutes')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('exams.questions')}</p>
                      <p className="font-medium">{exam.totalQuestions}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">{t('exams.points')}</p>
                      <p className="font-medium">{exam.totalPoints}</p>
                    </div>
                  </div>

                  {isInstructor && (
                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Users size={14} className="text-gray-400" />
                        <span className="text-gray-600">
                          {exam.submissions}/{exam.totalStudents} submitted
                        </span>
                      </div>
                      <div className="text-gray-600">
                        {t('exams.completion')}: {Math.round((exam.submissions / exam.totalStudents) * 100)}%
                      </div>
                    </div>
                  )}

                  {isStudent && exam.score && (
                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{t('exams.score')}:</span>
                        <span className="font-semibold text-green-600">{exam.score}%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{t('exams.grade')}:</span>
                        <span className="font-semibold text-blue-600">{exam.grade}</span>
                      </div>
                    </div>
                  )}

                  {isStudent && exam.attempts > 0 && !exam.score && (
                    <div className="mt-3 text-sm">
                      <span className="text-gray-600">
                        {t('exams.attempts')}: {exam.attempts}/{exam.maxAttempts}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                {getActionButton(exam)}
                {exam.attempts < exam.maxAttempts && new Date() < new Date(exam.endDate) && isStudent && (
                  <span className="text-xs text-gray-500">
                    {exam.maxAttempts - exam.attempts} {t('exams.attemptsLeft')}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredExams.length === 0 && (
        <Card className="text-center py-12">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('exams.noExamsFound')}</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedFilter !== 'all'
              ? t('exams.noExamsFound')
              : isInstructor
              ? t('exams.createFirstExam')
              : t('exams.noExamsScheduled')
            }
          </p>
          {isInstructor && !searchTerm && selectedFilter === 'all' && (
            <Button variant="primary">
              <Plus className="mr-2" size={16} />
              {t('exams.createFirstExam')}
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};