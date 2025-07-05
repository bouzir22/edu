import React, { useEffect, useState } from 'react';
import { Plus, Video, Calendar, Users, Settings } from 'lucide-react';
import { useLiveSessionStore } from '../stores/liveSessionStore';
import { useAuthStore } from '../stores/authStore';
import { LiveSession } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SessionCard } from '../components/live-session/SessionCard';
import { CreateSessionModal } from '../components/live-session/CreateSessionModal';
import { JitsiMeetComponent } from '../components/live-session/JitsiMeetComponent';
import { SimpleVideoCall } from '../components/live-session/SimpleVideoCall';

export const LiveSessionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    sessions, 
    activeSessions, 
    fetchSessions, 
    fetchActiveSessions, 
    isLoading 
  } = useLiveSessionStore();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [videoProvider, setVideoProvider] = useState<'jitsi' | 'simple'>('simple');

  useEffect(() => {
    fetchSessions();
    fetchActiveSessions();
    
    // Refresh active sessions every 30 seconds
    const interval = setInterval(() => {
      fetchActiveSessions();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchSessions, fetchActiveSessions]);

  const handleJoinSession = (session: LiveSession) => {
    setActiveSession(session);
  };

  const handleCloseSession = () => {
    setActiveSession(null);
    // Refresh sessions after leaving
    fetchSessions();
    fetchActiveSessions();
  };

  const isInstructor = user?.role === 'instructor';
  const upcomingSessions = sessions.filter(session => 
    new Date(session.startTime) > new Date() && !session.isActive
  );
  const pastSessions = sessions.filter(session => 
    new Date(session.endTime) < new Date() && !session.isActive
  );

  if (activeSession) {
    return videoProvider === 'jitsi' ? (
      <JitsiMeetComponent 
        session={activeSession} 
        onClose={handleCloseSession} 
      />
    ) : (
      <SimpleVideoCall 
        session={activeSession} 
        onClose={handleCloseSession} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Live Sessions</h1>
          <p className="text-gray-600 mt-1">
            {isInstructor 
              ? "Manage and conduct live video sessions for your courses"
              : "Join live sessions and interact with instructors and classmates"
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Video Provider:</label>
            <select
              value={videoProvider}
              onChange={(e) => setVideoProvider(e.target.value as 'jitsi' | 'simple')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="simple">Built-in Video</option>
              <option value="jitsi">Jitsi Meet</option>
            </select>
          </div>
          {isInstructor && (
            <Button 
              variant="primary" 
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2" size={16} />
              Create Session
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{activeSessions.length}</h3>
          <p className="text-sm text-gray-600">Live Now</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{upcomingSessions.length}</h3>
          <p className="text-sm text-gray-600">Upcoming</p>
        </Card>

        <Card className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
            <Users className="text-purple-600" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {activeSessions.reduce((total, session) => total + (session.participantCount || 0), 0)}
          </h3>
          <p className="text-sm text-gray-600">Active Participants</p>
        </Card>
      </div>

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-gray-900">Live Now</h2>
            <span className="text-sm text-gray-500">({activeSessions.length} active)</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoinSession={handleJoinSession}
              />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Calendar className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Sessions</h2>
            <span className="text-sm text-gray-500">({upcomingSessions.length} scheduled)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoinSession={handleJoinSession}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Video className="text-gray-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900">Past Sessions</h2>
            <span className="text-sm text-gray-500">({pastSessions.length} completed)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastSessions.slice(0, 6).map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onJoinSession={handleJoinSession}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && sessions.length === 0 && (
        <Card className="text-center py-12">
          <Video className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600 mb-4">
            {isInstructor 
              ? "Create your first live session to start conducting online classes."
              : "No live sessions are currently scheduled. Check back later or contact your instructor."
            }
          </p>
          {isInstructor && (
            <Button 
              variant="primary" 
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="mr-2" size={16} />
              Create Your First Session
            </Button>
          )}
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};