import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Award, BarChart3, Download, Filter, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { format } from 'date-fns';

export const GradesPage: React.FC = () => {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('current');

  const isInstructor = user?.role === 'instructor';
  const isStudent = user?.role === 'student';

  const grades = [
    {
      id: 1,
      course: 'Advanced Mathematics',
      courseCode: 'MATH 401',
      assignment: 'Final Exam',
      type: 'exam',
      score: 92,
      maxScore: 100,
      percentage: 92,
      grade: 'A-',
      weight: 40,
      submittedAt: '2024-01-20T12:00:00Z',
      gradedAt: '2024-01-22T10:30:00Z',
      feedback: 'Excellent work on calculus problems. Minor errors in differential equations section.',
      instructor: 'Dr. Emily Smith',
    },
    {
      id: 2,
      course: 'Computer Science Fundamentals',
      courseCode: 'CS 101',
      assignment: 'Programming Assignment 3',
      type: 'assignment',
      score: 85,
      maxScore: 100,
      percentage: 85,
      grade: 'B+',
      weight: 15,
      submittedAt: '2024-01-18T23:59:00Z',
      gradedAt: '2024-01-20T14:15:00Z',
      feedback: 'Good implementation of algorithms. Code structure could be improved.',
      instructor: 'Prof. Michael Johnson',
    },
    {
      id: 3,
      course: 'Physics Laboratory',
      courseCode: 'PHYS 201L',
      assignment: 'Lab Report 5',
      type: 'lab',
      score: 88,
      maxScore: 100,
      percentage: 88,
      grade: 'B+',
      weight: 10,
      submittedAt: '2024-01-15T17:00:00Z',
      gradedAt: '2024-01-17T09:20:00Z',
      feedback: 'Thorough analysis and good experimental technique. Conclusion needs more detail.',
      instructor: 'Dr. Sarah Brown',
    },
    {
      id: 4,
      course: 'Advanced Mathematics',
      courseCode: 'MATH 401',
      assignment: 'Midterm Exam',
      type: 'exam',
      score: 78,
      maxScore: 100,
      percentage: 78,
      grade: 'C+',
      weight: 30,
      submittedAt: '2024-01-10T11:00:00Z',
      gradedAt: '2024-01-12T16:45:00Z',
      feedback: 'Solid understanding of basic concepts. Need to work on complex problem solving.',
      instructor: 'Dr. Emily Smith',
    },
    {
      id: 5,
      course: 'Computer Science Fundamentals',
      courseCode: 'CS 101',
      assignment: 'Quiz 3',
      type: 'quiz',
      score: 95,
      maxScore: 100,
      percentage: 95,
      grade: 'A',
      weight: 5,
      submittedAt: '2024-01-08T14:30:00Z',
      gradedAt: '2024-01-08T15:00:00Z',
      feedback: 'Perfect understanding of data structures concepts.',
      instructor: 'Prof. Michael Johnson',
    },
  ];

  const courseStats = [
    {
      course: 'Advanced Mathematics',
      courseCode: 'MATH 401',
      currentGrade: 'B+',
      percentage: 87.2,
      trend: 'up',
      assignments: 8,
      completed: 6,
      instructor: 'Dr. Emily Smith',
    },
    {
      course: 'Computer Science Fundamentals',
      courseCode: 'CS 101',
      currentGrade: 'A-',
      percentage: 89.5,
      trend: 'up',
      assignments: 12,
      completed: 10,
      instructor: 'Prof. Michael Johnson',
    },
    {
      course: 'Physics Laboratory',
      courseCode: 'PHYS 201L',
      currentGrade: 'B+',
      percentage: 86.8,
      trend: 'down',
      assignments: 6,
      completed: 5,
      instructor: 'Dr. Sarah Brown',
    },
  ];

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = grade.assignment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         grade.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || grade.course === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam': return '📝';
      case 'assignment': return '💻';
      case 'quiz': return '❓';
      case 'lab': return '🔬';
      default: return '📄';
    }
  };

  const overallGPA = courseStats.reduce((acc, course) => acc + course.percentage, 0) / courseStats.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="text-gray-600 mt-1">
            {isStudent 
              ? "Track your academic performance and progress"
              : "Manage and review student grades and performance"
            }
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2" size={16} />
            Export
          </Button>
          <Button variant="outline">
            <BarChart3 className="mr-2" size={16} />
            Analytics
          </Button>
        </div>
      </div>

      {/* Overall Performance */}
      {isStudent && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
              <Award className="text-blue-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{overallGPA.toFixed(1)}%</h3>
            <p className="text-sm text-gray-600">Overall GPA</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{courseStats.length}</h3>
            <p className="text-sm text-gray-600">Active Courses</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
              <BarChart3 className="text-purple-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {courseStats.reduce((acc, course) => acc + course.completed, 0)}
            </h3>
            <p className="text-sm text-gray-600">Completed Assignments</p>
          </Card>

          <Card className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
              <Calendar className="text-orange-600" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {courseStats.reduce((acc, course) => acc + (course.assignments - course.completed), 0)}
            </h3>
            <p className="text-sm text-gray-600">Pending</p>
          </Card>
        </div>
      )}

      {/* Course Overview */}
      {isStudent && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Course Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {courseStats.map((course) => (
              <Card key={course.courseCode} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.course}</h3>
                    <p className="text-sm text-gray-600">{course.courseCode}</p>
                    <p className="text-xs text-gray-500 mt-1">{course.instructor}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {course.trend === 'up' ? (
                      <TrendingUp className="text-green-500" size={16} />
                    ) : (
                      <TrendingDown className="text-red-500" size={16} />
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(course.percentage)}`}>
                      {course.currentGrade}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Current Grade</span>
                      <span className="font-medium">{course.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{course.completed}/{course.assignments} assignments</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Courses</option>
          {Array.from(new Set(grades.map(g => g.course))).map(course => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="current">Current Semester</option>
          <option value="fall2023">Fall 2023</option>
          <option value="spring2023">Spring 2023</option>
        </select>
      </div>

      {/* Grades List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Grades</h2>
        {filteredGrades.map((grade) => (
          <Card key={grade.id} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="text-2xl">{getTypeIcon(grade.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{grade.assignment}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full capitalize">
                      {grade.type}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 font-medium mb-2">
                    {grade.course} ({grade.courseCode})
                  </p>
                  <p className="text-sm text-gray-600 mb-3">{grade.feedback}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Submitted</p>
                      <p className="font-medium">{format(new Date(grade.submittedAt), 'MMM dd, HH:mm')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Graded</p>
                      <p className="font-medium">{format(new Date(grade.gradedAt), 'MMM dd, HH:mm')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Weight</p>
                      <p className="font-medium">{grade.weight}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Instructor</p>
                      <p className="font-medium">{grade.instructor}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(grade.percentage)} mb-2`}>
                  {grade.grade}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {grade.score}/{grade.maxScore}
                </div>
                <div className="text-sm text-gray-600">
                  {grade.percentage}%
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredGrades.length === 0 && (
        <Card className="text-center py-12">
          <BarChart3 className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No grades found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCourse !== 'all'
              ? "No grades match your current search or filter criteria."
              : "No grades are available yet. Complete assignments to see your grades here."
            }
          </p>
        </Card>
      )}
    </div>
  );
};