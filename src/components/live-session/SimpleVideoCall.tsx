import React, { useState, useRef, useEffect } from 'react';
import { LiveSession } from '../../types';
import { useAuthStore } from '../../stores/authStore';
import { useLiveSessionStore } from '../../stores/liveSessionStore';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { X, Mic, MicOff, Video, VideoOff, Users, Phone, MessageCircle } from 'lucide-react';

interface SimpleVideoCallProps {
  session: LiveSession;
  onClose: () => void;
}

export const SimpleVideoCall: React.FC<SimpleVideoCallProps> = ({ session, onClose }) => {
  const { user } = useAuthStore();
  const { joinSession, leaveSession } = useLiveSessionStore();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [participantCount, setParticipantCount] = useState(session.participantCount || 1);
  const [messages, setMessages] = useState<Array<{id: string, user: string, message: string, time: string}>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    initializeCall();
    return () => {
      cleanup();
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsConnected(true);
      if (user) {
        joinSession(session.id, user.id);
      }
      
      // Simulate other participants joining
      setTimeout(() => {
        setParticipantCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      }, 2000);
      
    } catch (error) {
      console.error('Failed to access camera/microphone:', error);
      setIsConnected(true); // Continue without video
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (user) {
      leaveSession(session.id, user.id);
    }
  };

  const handleLeaveCall = () => {
    cleanup();
    onClose();
  };

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && user) {
      const message = {
        id: Date.now().toString(),
        user: `${user.firstName} ${user.lastName}`,
        message: newMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
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
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLeaveCall}
          className="text-white hover:bg-gray-700"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Area */}
        <div className="flex-1 relative bg-gray-800">
          {/* Main Video */}
          <div className="w-full h-full flex items-center justify-center">
            {isConnected ? (
              <div className="relative w-full h-full max-w-4xl">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover rounded-lg"
                />
                {isVideoOff && (
                  <div className="absolute inset-0 bg-gray-700 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl font-semibold">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </span>
                      </div>
                      <p className="text-sm">{user?.firstName} {user?.lastName}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Connecting to video call...</p>
              </div>
            )}
          </div>

          {/* Participant Thumbnails */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {[...Array(Math.min(participantCount - 1, 3))].map((_, index) => (
              <div key={index} className="w-24 h-18 bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-white text-xs text-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-xs">P{index + 1}</span>
                  </div>
                  <p className="text-xs">Participant {index + 1}</p>
                </div>
              </div>
            ))}
            {participantCount > 4 && (
              <div className="w-24 h-18 bg-gray-700 rounded-lg flex items-center justify-center">
                <div className="text-white text-xs text-center">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-xs">+{participantCount - 4}</span>
                  </div>
                  <p className="text-xs">More</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-gray-800 bg-opacity-90 rounded-full px-6 py-3">
              <Button
                variant={isMuted ? "danger" : "secondary"}
                size="sm"
                onClick={toggleMute}
                className="rounded-full w-12 h-12"
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </Button>
              
              <Button
                variant={isVideoOff ? "danger" : "secondary"}
                size="sm"
                onClick={toggleVideo}
                className="rounded-full w-12 h-12"
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className="rounded-full w-12 h-12"
              >
                <MessageCircle size={20} />
              </Button>
              
              <Button
                variant="danger"
                size="sm"
                onClick={handleLeaveCall}
                className="rounded-full w-12 h-12"
              >
                <Phone size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Chat</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="font-medium">{msg.user}</span>
                      <span>{msg.time}</span>
                    </div>
                    <div className="text-sm text-gray-900">{msg.message}</div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};