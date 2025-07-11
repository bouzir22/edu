import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { JaaSMeeting } from '@jitsi/react-sdk';
import { LiveSession } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { useLiveSessionStore } from '../../stores/liveSessionStore';
import { Button } from '../ui/Button';
import { X, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';

interface JitsiMeetComponentProps {
  session: LiveSession;
  onClose: () => void;
}

export const JitsiMeetComponent: React.FC<JitsiMeetComponentProps> = ({ session, onClose }) => {
  const { user } = useAuthStore();
  const { joinSession, leaveSession } = useLiveSessionStore();
  const { t } = useTranslation();
  const [hasJoined, setHasJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(session.participantCount || 0);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      if (!mounted || !user) return;

      try {
        setIsLoading(true);
        setError(null);
        
        // Join the session in our backend
        await joinSession(session.id, user.id);
        setHasJoined(true);
        
        // Small delay to ensure everything is ready
        setTimeout(() => {
          if (mounted) {
            setIsLoading(false);
          }
        }, 1000);
        
      } catch (error) {
        if (mounted) {
          console.error('Failed to initialize session:', error);
          setError(t('liveSessions.connectionFailed'));
          setIsLoading(false);
        }
      }
    };

    initializeSession();

    return () => {
      mounted = false;
      if (hasJoined && user) {
        leaveSession(session.id, user.id);
      }
    };
  }, [session.id, user, joinSession, connectionAttempts]);

  const handleLeaveSession = () => {
    if (user && hasJoined) {
      leaveSession(session.id, user.id);
    }
    onClose();
  };

  const retryConnection = () => {
    if (connectionAttempts < maxRetries) {
      setConnectionAttempts(prev => prev + 1);
      setError(null);
      setIsLoading(true);
      setHasJoined(false);
    } else {
      setError(t('liveSessions.connectionFailed'));
    }
  };

  const switchToBuiltIn = () => {
    onClose();
  };

  // Event handlers for Jitsi events
  const handleApiReady = () => {
    console.log('Jitsi API is ready');
    setIsLoading(false);
    setError(null);
    setConnectionAttempts(0);
  };

  const handleReadyToClose = () => {
    console.log('Jitsi ready to close');
    handleLeaveSession();
  };

  const handleParticipantJoined = (participant: any) => {
    console.log('Participant joined:', participant);
    setParticipantCount(prev => prev + 1);
  };

  const handleParticipantLeft = (participant: any) => {
    console.log('Participant left:', participant);
    setParticipantCount(prev => Math.max(0, prev - 1));
  };

  const handleVideoConferenceJoined = (participant: any) => {
    console.log('Video conference joined:', participant);
    setHasJoined(true);
    setIsLoading(false);
  };

  const handleVideoConferenceLeft = () => {
    console.log('Video conference left');
    handleLeaveSession();
  };

  const handleError = (error: any) => {
    console.error('Jitsi error:', error);
    setError(t('liveSessions.connectionFailed'));
    setIsLoading(false);
  };

  // Generate room name with VPaaS prefix
  const roomName = `eduplatform-${session.roomName}-${session.id}`.replace(/[^a-zA-Z0-9-]/g, '');
  
  // App ID from your VPaaS magic cookie
  const appId = 'vpaas-magic-cookie-60973f5de48144e0a1f53ed85c9d0ffd';

  // Configuration overrides
  const configOverwrite = {
    startWithAudioMuted: false,
    startWithVideoMuted: false,
    enableWelcomePage: false,
    prejoinPageEnabled: false,
    disableModeratorIndicator: false,
    startScreenSharing: false,
    enableEmailInStats: false,
    enableClosePage: false,
    disableDeepLinking: true,
    disableInviteFunctions: true,
    doNotStoreRoom: true,
    enableNoisyMicDetection: true,
    resolution: 720,
    constraints: {
      video: {
        height: { ideal: 720, max: 720, min: 240 },
        width: { ideal: 1280, max: 1280, min: 320 }
      }
    },
    disableSimulcast: false,
    enableLayerSuspension: true,
    channelLastN: 20,
    p2p: {
      enabled: true,
      stunServers: [
        { urls: 'stun:meet-jit-si-turnrelay.jitsi.net:443' },
        { urls: 'stun:stun.l.google.com:19302' }
      ]
    },
    analytics: {
      disabled: true
    },
    remoteVideoMenu: {
      disabled: false,
      disableKick: user?.role === 'instructor' ? false : true,
      disableGrantModerator: user?.role === 'instructor' ? false : true
    },
    toolbarButtons: [
      'microphone',
      'camera',
      'closedcaptions',
      'desktop',
      'fullscreen',
      'fodeviceselection',
      'hangup',
      'profile',
      'chat',
      'raisehand',
      'videoquality',
      'filmstrip',
      'tileview',
      'select-background',
      'help',
      ...(user?.role === 'instructor' ? ['mute-everyone', 'security'] : [])
    ],
    testing: {
      enableFirefoxSimulcast: false
    }
  };

  // Interface configuration
  const interfaceConfigOverwrite = {
    SHOW_JITSI_WATERMARK: false,
    SHOW_WATERMARK_FOR_GUESTS: false,
    SHOW_BRAND_WATERMARK: false,
    BRAND_WATERMARK_LINK: '',
    SHOW_POWERED_BY: false,
    DISPLAY_WELCOME_PAGE_CONTENT: false,
    DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
    APP_NAME: 'EduPlatform',
    NATIVE_APP_NAME: 'EduPlatform',
    PROVIDER_NAME: 'EduPlatform',
    LANG_DETECTION: true,
    CONNECTION_INDICATOR_AUTO_HIDE_ENABLED: true,
    CONNECTION_INDICATOR_AUTO_HIDE_TIMEOUT: 5000,
    MAXIMUM_ZOOMING_COEFFICIENT: 1.3,
    FILM_STRIP_MAX_HEIGHT: 120,
    ENABLE_FEEDBACK_ANIMATION: false,
    DISABLE_VIDEO_BACKGROUND: false,
    DISABLE_BLUR: false,
    VIDEO_LAYOUT_FIT: 'both',
    TILE_VIEW_MAX_COLUMNS: 5,
    VERTICAL_FILMSTRIP: true,
    CLOSE_PAGE_GUEST_HINT: false,
    SHOW_PROMOTIONAL_CLOSE_PAGE: false,
    RANDOM_AVATAR_URL_PREFIX: false,
    RANDOM_AVATAR_URL_SUFFIX: false,
    FILM_STRIP_MAX_HEIGHT: 90,
    ENABLE_MOBILE_BROWSER: true,
    MOBILE_APP_PROMO: false
  };

  // User info
  const userInfo = {
    displayName: `${user?.firstName} ${user?.lastName}`,
    email: user?.email,
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('liveSessions.connectionFailed')}</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500 mb-6">
            {t('liveSessions.tryAgain')} {connectionAttempts + 1} من {maxRetries + 1}
          </p>
          <div className="flex flex-col space-y-3">
            {connectionAttempts < maxRetries ? (
              <Button variant="primary" onClick={retryConnection} fullWidth>
                <RefreshCw className="mr-2" size={16} />
                {t('liveSessions.tryAgain')}
              </Button>
            ) : (
              <Button variant="primary" onClick={switchToBuiltIn} fullWidth>
                {t('liveSessions.useBuiltInVideo')}
              </Button>
            )}
            <Button variant="outline" onClick={handleLeaveSession} fullWidth>
              {t('liveSessions.goBack')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header Controls */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold">{session.title}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>{t('liveSessions.live')}</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>{participantCount} {t('liveSessions.participants')}</span>
            </div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLeaveSession}
          className="text-white hover:bg-gray-800"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">{t('liveSessions.connectingToSession')}</h3>
            <p className="text-gray-300">Loading {session.title}</p>
            <p className="text-sm text-gray-400 mt-2">
              {connectionAttempts > 0 ? `${t('liveSessions.tryAgain')} ${connectionAttempts}...` : 'قد يستغرق هذا بضع لحظات'}
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={switchToBuiltIn}
                className="text-white border-white hover:bg-white hover:text-gray-900"
              >
                {t('liveSessions.useBuiltInVideo')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Jitsi Meeting Container */}
      <div className="flex-1 w-full h-full bg-gray-800" style={{ minHeight: 'calc(100vh - 80px)' }}>
        <JaaSMeeting
          appId={appId}
          roomName={roomName}
          configOverwrite={configOverwrite}
          interfaceConfigOverwrite={interfaceConfigOverwrite}
          userInfo={userInfo}
          onApiReady={handleApiReady}
          onReadyToClose={handleReadyToClose}
          onParticipantJoined={handleParticipantJoined}
          onParticipantLeft={handleParticipantLeft}
          onVideoConferenceJoined={handleVideoConferenceJoined}
          onVideoConferenceLeft={handleVideoConferenceLeft}
          onError={handleError}
          getIFrameRef={(node) => {
            if (node) {
              node.style.height = '100%';
              node.style.width = '100%';
            }
          }}
          // Add JWT if you have premium features enabled
          // jwt="your-jwt-token-here"
        />
      </div>
    </div>
  );
};