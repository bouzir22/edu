import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';

export const CoursesPage: React.FC = () => {
  const { user } = useAuthStore();

  const courses = [
    {
      id: 1,
      title: 'Advanced Mathematics',
      description: 'Comprehensive course covering advanced mathematical concepts including calculus, linear algebra, and differential equations.',
      instructor: 'Dr. Emily Smith',
      thumbnail: 'https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=400',
      students: 45,
      duration: '12 weeks',
      difficulty: 'Advanced',
      isEnrolled: true,
    },
    {
      id: 2,
      title: 'Computer Science Fundamentals',
      description: 'Introduction to programming concepts, algorithms, and data structures using Python.',
      instructor: 'Prof. Michael Johnson',
      thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=400',
      students: 78,
      duration: '16 weeks',
      difficulty: 'Beginner',
      isEnrolled: false,
    },
    {
      id: 3,
      title: 'Physics Laboratory',
      description: 'Hands-on physics experiments and practical applications of theoretical concepts.',
      instructor: 'Dr. Sarah Brown',
      thumbnail: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400',
      students: 32,
      duration: '14 weeks',
      difficulty: 'Intermediate',
      isEnrolled: true,
    },
    {
      id: 4,
      title: 'Modern History',
      description: 'Exploration of world history from the 18th century to present day.',
      instructor: 'Prof. David Wilson',
      thumbnail: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=400',
      students: 56,
      duration: '12 weeks',
      difficulty: 'Intermediate',
      isEnrolled: false,
    },
    {
      id: 5,
      title: 'Creative Writing',
      description: 'Develop your writing skills through various creative exercises and workshops.',
      instructor: 'Dr. Lisa Martinez',
      thumbnail: 'https://images.pexels.com/photos/1591447/pexels-photo-1591447.jpeg?auto=compress&cs=tinysrgb&w=400',
      students: 28,
      duration: '10 weeks',
      difficulty: 'Beginner',
      isEnrolled: false,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        {user?.role === 'instructor' && (
          <Button variant="primary">
            <Plus className="mr-2" size={16} />
            Create Course
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search courses..."
            className="w-full"
            icon={<Search size={20} />}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2" size={16} />
          Filter
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
                <span>Duration</span>
              </div>
              
              <div className="pt-2">
                {course.isEnrolled ? (
                  <Button variant="outline" fullWidth>
                    View Course
                  </Button>
                ) : (
                  <Button variant="primary" fullWidth>
                    Enroll Now
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