import React from 'react';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { LiveSession } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { useLiveSessionStore } from '../../stores/liveSessionStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Video, Users, Clock, Play, Square, Monitor } from 'lucide-react';

interface SessionCardProps {
  session: LiveSession;
  onJoinSession: (session: LiveSession) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({ session, onJoinSession }) => {
  const { user } = useAuthStore();
  const { startSession, endSession, isLoading } = useLiveSessionStore();
  const { t } = useTranslation();

  const isInstructor = user?.role === 'instructor';
  const isUpcoming = new Date(session.startTime) > new Date();
  const isOngoing = session.isActive;
  const hasEnded = new Date(session.endTime) < new Date() && !session.isActive;

  const handleStartSession = async () => {
    try {
      await startSession(session.id);
      onJoinSession(session);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  const handleEndSession = async () => {
    try {
      await endSession(session.id);
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  };

  const handleJoinSession = () => {
    onJoinSession(session);
  };

  const getStatusBadge = () => {
    if (isOngoing) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
          {t('liveSessions.live')}
        </span>
      );
    }
    
    if (isUpcoming) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock size={12} className="mr-1" />
          {t('liveSessions.upcoming')}
        </span>
      );
    }
    
    if (hasEnded) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {t('exams.finished')}
        </span>
      );
    }
    
    return null;
  };

  const getActionButton = () => {
    if (hasEnded) {
      return null;
    }

    if (isInstructor) {
      if (isOngoing) {
        return (
          <div className="flex flex-col space-y-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleJoinSession}
              disabled={isLoading}
              fullWidth
            >
              <Video size={16} className="mr-1" />
              {t('liveSessions.joinSession')}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleEndSession}
              disabled={isLoading}
              fullWidth
            >
              <Square size={16} className="mr-1" />
              {t('liveSessions.endSession')}
            </Button>
          </div>
        );
      }
      
      if (isUpcoming) {
        return (
          <Button
            variant="success"
            size="sm"
            onClick={handleStartSession}
            disabled={isLoading}
            fullWidth
          >
            <Play size={16} className="mr-1" />
            {t('liveSessions.startSession')}
          </Button>
        );
      }
    } else {
      // Student view
      if (isOngoing) {
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={handleJoinSession}
            fullWidth
          >
            <Video size={16} className="mr-1" />
            {t('liveSessions.joinSession')}
          </Button>
        );
      }
      
      if (isUpcoming) {
        return (
          <Button
            variant="outline"
            size="sm"
            disabled
            fullWidth
          >
            <Clock size={16} className="mr-1" />
            {t('liveSessions.started')} {format(new Date(session.startTime), 'HH:mm')}
          </Button>
        );
      }
    }
    
    return null;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <Video className="text-blue-600" size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{session.title}</h4>
            {session.description && (
              <p className="text-sm text-gray-600 line-clamp-1">{session.description}</p>
            )}
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{t('liveSessions.startTime')}</span>
          <span className="font-medium">
            {format(new Date(session.startTime), 'MMM dd, HH:mm')}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{t('exams.duration')}</span>
          <span className="font-medium">
            {Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))} {t('exams.minutes')}
          </span>
        </div>
        
        {isOngoing && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{t('liveSessions.participants')}</span>
            <div className="flex items-center space-x-1">
              <Users size={14} />
              <span className="font-medium">{session.participantCount || 0}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        {getActionButton()}
      </div>
    </Card>
  );
};