import React, { useEffect, useRef, useState } from 'react';
import { LiveSession } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { useLiveSessionStore } from '../../stores/liveSessionStore';
import { Button } from '../ui/Button';
import { X, Mic, MicOff, Video, VideoOff, Monitor, Users, Phone, AlertCircle } from 'lucide-react';
import { Card } from '../ui/Card';

interface JitsiMeetComponentProps {
  session: LiveSession;
  onClose: () => void;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

export const JitsiMeetComponent: React.FC<JitsiMeetComponentProps> = ({ session, onClose }) => {
  const { user } = useAuthStore();
  const { joinSession, leaveSession } = useLiveSessionStore();
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [participantCount, setParticipantCount] = useState(session.participantCount || 0);

  useEffect(() => {
    let mounted = true;

    const loadJitsiScript = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (window.JitsiMeetExternalAPI) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = () => {
          if (mounted) resolve();
        };
        script.onerror = () => {
          if (mounted) reject(new Error('Failed to load Jitsi Meet API'));
        };
        document.head.appendChild(script);

        // Fallback timeout
        setTimeout(() => {
          if (mounted && !window.JitsiMeetExternalAPI) {
            reject(new Error('Jitsi API load timeout'));
          }
        }, 10000);
      });
    };

    const initializeJitsi = async () => {
      if (!mounted) return;

      try {
        setIsLoading(true);
        setError(null);

        await loadJitsiScript();
        
        if (!jitsiContainerRef.current || !user || !mounted) return;

        // Clear any existing content
        jitsiContainerRef.current.innerHTML = '';

        const domain = 'meet.jit.si';
        const roomName = `eduplatform-${session.roomName}-${session.id}`;
        
        const options = {
          roomName: roomName,
          width: '100%',
          height: '100%',
          parentNode: jitsiContainerRef.current,
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            enableWelcomePage: false,
            prejoinPageEnabled: false,
            disableModeratorIndicator: false,
            startScreenSharing: false,
            enableEmailInStats: false,
            enableClosePage: false,
            disableDeepLinking: true,
            disableInviteFunctions: false,
            doNotStoreRoom: true,
            enableNoisyMicDetection: true,
            resolution: 720,
            constraints: {
              video: {
                height: { ideal: 720, max: 720, min: 240 }
              }
            },
            disableSimulcast: false,
            enableLayerSuspension: true,
            p2p: {
              enabled: true,
              stunServers: [
                { urls: 'stun:meet-jit-si-turnrelay.jitsi.net:443' }
              ]
            },
            analytics: {
              disabled: true
            },
            remoteVideoMenu: {
              disabled: false,
              disableKick: true,
              disableGrantModerator: true
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
              'download',
              'help',
              'mute-everyone',
              'security'
            ],
          },
          interfaceConfigOverwrite: {
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
          },
          userInfo: {
            displayName: `${user.firstName} ${user.lastName}`,
            email: user.email,
          },
        };

        if (!mounted) return;

        apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

        // Event listeners
        apiRef.current.addEventListener('videoConferenceJoined', () => {
          if (!mounted) return;
          setIsLoading(false);
          setHasJoined(true);
          setError(null);
          if (user) {
            joinSession(session.id, user.id);
          }
        });

        apiRef.current.addEventListener('videoConferenceLeft', () => {
          if (!mounted) return;
          handleLeaveSession();
        });

        apiRef.current.addEventListener('participantJoined', () => {
          if (!mounted) return;
          setParticipantCount(prev => prev + 1);
        });

        apiRef.current.addEventListener('participantLeft', () => {
          if (!mounted) return;
          setParticipantCount(prev => Math.max(0, prev - 1));
        });

        apiRef.current.addEventListener('audioMuteStatusChanged', (event: any) => {
          if (!mounted) return;
          setIsMuted(event.muted);
        });

        apiRef.current.addEventListener('videoMuteStatusChanged', (event: any) => {
          if (!mounted) return;
          setIsVideoOff(event.muted);
        });

        apiRef.current.addEventListener('readyToClose', () => {
          if (!mounted) return;
          handleLeaveSession();
        });

        apiRef.current.addEventListener('videoConferenceError', (error: any) => {
          if (!mounted) return;
          console.error('Jitsi conference error:', error);
          setError('Failed to join the video conference. Please try again.');
          setIsLoading(false);
        });

        // Timeout fallback
        setTimeout(() => {
          if (mounted && isLoading) {
            setIsLoading(false);
            if (!hasJoined) {
              setError('Connection timeout. Please check your internet connection and try again.');
            }
          }
        }, 15000);

      } catch (error) {
        if (!mounted) return;
        console.error('Failed to initialize Jitsi Meet:', error);
        setError('Failed to load video conference. Please refresh the page and try again.');
        setIsLoading(false);
      }
    };

    const handleLeaveSession = () => {
      if (user && hasJoined) {
        leaveSession(session.id, user.id);
      }
      if (apiRef.current) {
        try {
          apiRef.current.dispose();
        } catch (e) {
          console.warn('Error disposing Jitsi API:', e);
        }
        apiRef.current = null;
      }
      onClose();
    };

    initializeJitsi();

    return () => {
      mounted = false;
      if (apiRef.current) {
        try {
          apiRef.current.dispose();
        } catch (e) {
          console.warn('Error disposing Jitsi API on cleanup:', e);
        }
        apiRef.current = null;
      }
    };
  }, [session.id, session.roomName, user, joinSession]);

  const handleLeaveSession = () => {
    if (user && hasJoined) {
      leaveSession(session.id, user.id);
    }
    if (apiRef.current) {
      try {
        apiRef.current.dispose();
      } catch (e) {
        console.warn('Error disposing Jitsi API:', e);
      }
      apiRef.current = null;
    }
    onClose();
  };

  const toggleMute = () => {
    if (apiRef.current) {
      try {
        apiRef.current.executeCommand('toggleAudio');
      } catch (e) {
        console.warn('Error toggling audio:', e);
      }
    }
  };

  const toggleVideo = () => {
    if (apiRef.current) {
      try {
        apiRef.current.executeCommand('toggleVideo');
      } catch (e) {
        console.warn('Error toggling video:', e);
      }
    }
  };

  const toggleScreenShare = () => {
    if (apiRef.current) {
      try {
        apiRef.current.executeCommand('toggleShareScreen');
      } catch (e) {
        console.warn('Error toggling screen share:', e);
      }
    }
  };

  const hangUp = () => {
    if (apiRef.current) {
      try {
        apiRef.current.executeCommand('hangup');
      } catch (e) {
        console.warn('Error hanging up:', e);
        handleLeaveSession();
      }
    } else {
      handleLeaveSession();
    }
  };

  const retryConnection = () => {
    setError(null);
    setIsLoading(true);
    setHasJoined(false);
    
    // Reload the component
    window.location.reload();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Failed</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleLeaveSession} fullWidth>
              Go Back
            </Button>
            <Button variant="primary" onClick={retryConnection} fullWidth>
              Try Again
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
              <span>Live</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <Users size={16} />
              <span>{participantCount} participants</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isLoading && hasJoined && (
            <>
              <Button
                variant={isMuted ? "danger" : "secondary"}
                size="sm"
                onClick={toggleMute}
                className="text-white"
              >
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </Button>
              
              <Button
                variant={isVideoOff ? "danger" : "secondary"}
                size="sm"
                onClick={toggleVideo}
                className="text-white"
              >
                {isVideoOff ? <VideoOff size={16} /> : <Video size={16} />}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleScreenShare}
                className="text-white"
              >
                <Monitor size={16} />
              </Button>
              
              <Button
                variant="danger"
                size="sm"
                onClick={hangUp}
                className="text-white"
              >
                <Phone size={16} />
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeaveSession}
            className="text-white hover:bg-gray-800"
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-20">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Connecting to Session...</h3>
            <p className="text-gray-300">Loading {session.title}</p>
            <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
          </div>
        </div>
      )}

      {/* Jitsi Meet Container */}
      <div 
        ref={jitsiContainerRef} 
        className="flex-1 w-full h-full bg-gray-800"
        style={{ minHeight: 'calc(100vh - 80px)' }}
      />
    </div>
  );
};