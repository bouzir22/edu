import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';

export const CoursesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const courses = [
    {
      id: 1,
      title: 'الرياضيات المتقدمة',
      description: 'مقرر شامل يغطي المفاهيم الرياضية المتقدمة بما في ذلك التفاضل والتكامل والجبر الخطي والمعادلات التفاضلية.',
      instructor: 'د. إيميلي سميث',
      thumbnail: 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=400',
      students: 45,
      duration: '12 أسبوع',
      difficulty: 'متقدم',
      isEnrolled: true,
    },
    {
      id: 2,
      title: 'أساسيات علوم الحاسوب',
      description: 'مقدمة في مفاهيم البرمجة والخوارزميات وهياكل البيانات باستخدام Python.',
      instructor: 'أ. مايكل جونسون',
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      students: 78,
      duration: '16 أسبوع',
      difficulty: 'مبتدئ',
      isEnrolled: false,
    },
    {
      id: 3,
      title: 'مختبر الفيزياء',
      description: 'تجارب فيزيائية عملية وتطبيقات عملية للمفاهيم النظرية.',
      instructor: 'د. سارة براون',
      thumbnail: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
      students: 32,
      duration: '14 أسبوع',
      difficulty: 'متوسط',
      isEnrolled: true,
    },
    {
      id: 4,
      title: 'التاريخ الحديث',
      description: 'استكشاف التاريخ العالمي من القرن الثامن عشر حتى يومنا هذا.',
      instructor: 'أ. ديفيد ويلسون',
      thumbnail: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
      students: 56,
      duration: '12 أسبوع',
      difficulty: 'متوسط',
      isEnrolled: false,
    },
    {
      id: 5,
      title: 'الكتابة الإبداعية',
      description: 'طور مهاراتك في الكتابة من خلال تمارين وورش عمل إبداعية متنوعة.',
      instructor: 'د. ليزا مارتينيز',
      thumbnail: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400',
      students: 28,
      duration: '10 أسابيع',
      difficulty: 'مبتدئ',
      isEnrolled: false,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'مبتدئ': 
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'متوسط':
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'متقدم':
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('courses.title')}</h1>
        {user?.role === 'instructor' && (
          <Button variant="primary">
            <Plus className="mr-2 rtl:ml-2 rtl:mr-0" size={16} />
            {t('courses.createCourse')}
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t('courses.searchCourses')}
            className="w-full"
            icon={<Search size={20} />}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 rtl:ml-2 rtl:mr-0" size={16} />
          {t('common.filter')}
        </Button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{course.instructor}</span>
                <span>{course.students} students</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{course.duration}</span>
                <span>{t('courses.duration')}</span>
              </div>
              
              <div className="pt-2">
                {course.isEnrolled ? (
                  <Button variant="outline" fullWidth>
                    {t('courses.viewCourse')}
                  </Button>
                ) : (
                  <Button variant="primary" fullWidth>
                    {t('courses.enrollNow')}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};