import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight, Video, BookOpen } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks, startOfDay } from 'date-fns';

export const SchedulePage: React.FC = () => {
  const { user } = useAuthStore();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const isInstructor = user?.role === 'instructor';

  const events = [
    {
      id: 1,
      title: 'Advanced Mathematics Lecture',
      course: 'MATH 401',
      type: 'lecture',
      startTime: '2024-01-22T09:00:00Z',
      endTime: '2024-01-22T10:30:00Z',
      location: 'Room A-101',
      instructor: 'Dr. Emily Smith',
      students: 45,
      isOnline: false,
      description: 'Calculus and differential equations',
    },
    {
      id: 2,
      title: 'CS Fundamentals Lab',
      course: 'CS 101',
      type: 'lab',
      startTime: '2024-01-22T14:00:00Z',
      endTime: '2024-01-22T16:00:00Z',
      location: 'Computer Lab B-205',
      instructor: 'Prof. Michael Johnson',
      students: 32,
      isOnline: false,
      description: 'Programming assignment workshop',
    },
    {
      id: 3,
      title: 'Physics Lab Session',
      course: 'PHYS 201L',
      type: 'lab',
      startTime: '2024-01-23T10:00:00Z',
      endTime: '2024-01-23T12:00:00Z',
      location: 'Physics Lab C-301',
      instructor: 'Dr. Sarah Brown',
      students: 28,
      isOnline: false,
      description: 'Electromagnetic experiments',
    },
    {
      id: 4,
      title: 'Mathematics Tutorial',
      course: 'MATH 401',
      type: 'tutorial',
      startTime: '2024-01-23T15:00:00Z',
      endTime: '2024-01-23T16:00:00Z',
      location: 'Online',
      instructor: 'Dr. Emily Smith',
      students: 15,
      isOnline: true,
      description: 'Q&A session for upcoming exam',
    },
    {
      id: 5,
      title: 'CS Project Presentation',
      course: 'CS 101',
      type: 'presentation',
      startTime: '2024-01-24T11:00:00Z',
      endTime: '2024-01-24T12:30:00Z',
      location: 'Auditorium D-100',
      instructor: 'Prof. Michael Johnson',
      students: 78,
      isOnline: false,
      description: 'Student project presentations',
    },
    {
      id: 6,
      title: 'Office Hours',
      course: 'MATH 401',
      type: 'office_hours',
      startTime: '2024-01-24T14:00:00Z',
      endTime: '2024-01-24T16:00:00Z',
      location: 'Office A-205',
      instructor: 'Dr. Emily Smith',
      students: 0,
      isOnline: false,
      description: 'Individual student consultations',
    },
    {
      id: 7,
      title: 'Physics Lecture',
      course: 'PHYS 201',
      type: 'lecture',
      startTime: '2024-01-25T09:00:00Z',
      endTime: '2024-01-25T10:30:00Z',
      location: 'Lecture Hall E-150',
      instructor: 'Dr. Sarah Brown',
      students: 65,
      isOnline: false,
      description: 'Quantum mechanics introduction',
    },
    {
      id: 8,
      title: 'Study Group Session',
      course: 'CS 101',
      type: 'study_group',
      startTime: '2024-01-26T16:00:00Z',
      endTime: '2024-01-26T18:00:00Z',
      location: 'Library Study Room 3',
      instructor: 'Student Led',
      students: 12,
      isOnline: false,
      description: 'Collaborative study session',
    },
  ];

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startTime), date)
    ).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab': return 'bg-green-100 text-green-800 border-green-200';
      case 'tutorial': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'presentation': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'office_hours': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'study_group': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'lecture': return <BookOpen size={16} />;
      case 'lab': return <Users size={16} />;
      case 'tutorial': return <Video size={16} />;
      case 'presentation': return <Calendar size={16} />;
      case 'office_hours': return <Clock size={16} />;
      case 'study_group': return <Users size={16} />;
      default: return <Calendar size={16} />;
    }
  };

  const todayEvents = getEventsForDate(new Date());
  const upcomingEvents = events
    .filter(event => new Date(event.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-1">
            {isInstructor 
              ? "Manage your teaching schedule and office hours"
              : "View your class schedule and upcoming events"
            }
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'week' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                viewMode === 'day' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Day
            </button>
          </div>
          {isInstructor && (
            <Button variant="primary">
              <Plus className="mr-2" size={16} />
              Add Event
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{todayEvents.length}</h3>
          <p className="text-sm text-gray-600">Today's Events</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
            <Clock className="text-green-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{upcomingEvents.length}</h3>
          <p className="text-sm text-gray-600">This Week</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
            <BookOpen className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {events.filter(e => e.type === 'lecture').length}
          </h3>
          <p className="text-sm text-gray-600">Lectures</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4">
            <Video className="text-orange-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {events.filter(e => e.isOnline).length}
          </h3>
          <p className="text-sm text-gray-600">Online Events</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {viewMode === 'week' ? 'Weekly Schedule' : 'Daily Schedule'}
              </h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                >
                  <ChevronLeft size={16} />
                </Button>
                <span className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
                  {format(weekStart, 'MMM dd')} - {format(addDays(weekStart, 6), 'MMM dd, yyyy')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>

            {viewMode === 'week' ? (
              <div className="space-y-4">
                {weekDays.map((day) => {
                  const dayEvents = getEventsForDate(day);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <div key={day.toISOString()} className={`border rounded-lg p-4 ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-medium ${isToday ? 'text-blue-900' : 'text-gray-900'}`}>
                          {format(day, 'EEEE, MMM dd')}
                          {isToday && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Today</span>}
                        </h3>
                        <span className="text-sm text-gray-500">{dayEvents.length} events</span>
                      </div>
                      
                      {dayEvents.length > 0 ? (
                        <div className="space-y-2">
                          {dayEvents.map((event) => (
                            <div key={event.id} className={`p-3 rounded-lg border ${getEventTypeColor(event.type)}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-2">
                                  {getEventTypeIcon(event.type)}
                                  <div>
                                    <h4 className="font-medium text-sm">{event.title}</h4>
                                    <p className="text-xs opacity-75">{event.course}</p>
                                  </div>
                                </div>
                                <div className="text-right text-xs">
                                  <p className="font-medium">
                                    {format(new Date(event.startTime), 'HH:mm')} - {format(new Date(event.endTime), 'HH:mm')}
                                  </p>
                                  <p className="opacity-75 flex items-center">
                                    {event.isOnline ? <Video size={12} className="mr-1" /> : <MapPin size={12} className="mr-1" />}
                                    {event.location}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No events scheduled</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Day view implementation would go here */}
                <p className="text-center text-gray-500 py-8">Day view coming soon</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h3>
            {todayEvents.length > 0 ? (
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <span className="text-xs text-gray-500">
                        {format(new Date(event.startTime), 'HH:mm')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{event.course}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      {event.isOnline ? <Video size={12} className="mr-1" /> : <MapPin size={12} className="mr-1" />}
                      {event.location}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No events today</p>
            )}
          </Card>

          {/* Upcoming Events */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getEventTypeColor(event.type)}`}>
                        {event.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{event.course}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(event.startTime), 'MMM dd, HH:mm')}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      {event.isOnline ? <Video size={12} className="mr-1" /> : <MapPin size={12} className="mr-1" />}
                      {event.location}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No upcoming events</p>
            )}
          </Card>

          {/* Quick Actions */}
          {isInstructor && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" fullWidth>
                  <Plus className="mr-2" size={14} />
                  Schedule Office Hours
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <Calendar className="mr-2" size={14} />
                  Create Recurring Event
                </Button>
                <Button variant="outline" size="sm" fullWidth>
                  <Video className="mr-2" size={14} />
                  Schedule Online Session
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};