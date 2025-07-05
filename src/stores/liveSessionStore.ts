import { create } from 'zustand';
import { LiveSession, SessionParticipant } from '../types';

interface LiveSessionState {
  sessions: LiveSession[];
  activeSessions: LiveSession[];
  currentSession: LiveSession | null;
  participants: SessionParticipant[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchSessions: (courseId?: string) => Promise<void>;
  fetchActiveSessions: () => Promise<void>;
  createSession: (sessionData: Partial<LiveSession>) => Promise<LiveSession>;
  startSession: (sessionId: string) => Promise<void>;
  endSession: (sessionId: string) => Promise<void>;
  joinSession: (sessionId: string, userId: string) => Promise<void>;
  leaveSession: (sessionId: string, userId: string) => Promise<void>;
  setCurrentSession: (session: LiveSession | null) => void;
  clearError: () => void;
}

// Mock data for development
const mockSessions: LiveSession[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Advanced Mathematics - Calculus Review',
    description: 'Review session for upcoming calculus exam',
    startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(), // 90 minutes from now
    isActive: false,
    roomName: 'math-calculus-review-1',
    participantCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    courseId: '2',
    title: 'Computer Science - Algorithm Discussion',
    description: 'Interactive discussion on sorting algorithms',
    startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // Started 15 minutes ago
    endTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // Ends in 45 minutes
    isActive: true,
    roomName: 'cs-algorithms-discussion-2',
    participantCount: 12,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useLiveSessionStore = create<LiveSessionState>((set, get) => ({
  sessions: [],
  activeSessions: [],
  currentSession: null,
  participants: [],
  isLoading: false,
  error: null,

  fetchSessions: async (courseId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredSessions = mockSessions;
      if (courseId) {
        filteredSessions = mockSessions.filter(session => session.courseId === courseId);
      }
      
      set({ sessions: filteredSessions });
    } catch (error) {
      set({ error: 'Failed to fetch sessions' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchActiveSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual Supabase query
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const activeSessions = mockSessions.filter(session => session.isActive);
      set({ activeSessions });
    } catch (error) {
      set({ error: 'Failed to fetch active sessions' });
    } finally {
      set({ isLoading: false });
    }
  },

  createSession: async (sessionData: Partial<LiveSession>) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual Supabase insert
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSession: LiveSession = {
        id: Math.random().toString(36).substr(2, 9),
        courseId: sessionData.courseId!,
        title: sessionData.title!,
        description: sessionData.description,
        startTime: sessionData.startTime!,
        endTime: sessionData.endTime!,
        isActive: false,
        roomName: `session-${Date.now()}`,
        participantCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      set(state => ({
        sessions: [...state.sessions, newSession]
      }));
      
      return newSession;
    } catch (error) {
      set({ error: 'Failed to create session' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  startSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual Supabase update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        sessions: state.sessions.map(session =>
          session.id === sessionId
            ? { ...session, isActive: true, updatedAt: new Date().toISOString() }
            : session
        ),
        activeSessions: state.activeSessions.some(s => s.id === sessionId)
          ? state.activeSessions.map(session =>
              session.id === sessionId
                ? { ...session, isActive: true, updatedAt: new Date().toISOString() }
                : session
            )
          : [...state.activeSessions, ...state.sessions.filter(s => s.id === sessionId).map(s => ({ ...s, isActive: true }))]
      }));
    } catch (error) {
      set({ error: 'Failed to start session' });
    } finally {
      set({ isLoading: false });
    }
  },

  endSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Mock implementation - replace with actual Supabase update
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set(state => ({
        sessions: state.sessions.map(session =>
          session.id === sessionId
            ? { ...session, isActive: false, updatedAt: new Date().toISOString() }
            : session
        ),
        activeSessions: state.activeSessions.filter(session => session.id !== sessionId)
      }));
    } catch (error) {
      set({ error: 'Failed to end session' });
    } finally {
      set({ isLoading: false });
    }
  },

  joinSession: async (sessionId: string, userId: string) => {
    try {
      // Mock implementation - replace with actual Supabase operations
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Update participant count
      set(state => ({
        sessions: state.sessions.map(session =>
          session.id === sessionId
            ? { ...session, participantCount: (session.participantCount || 0) + 1 }
            : session
        ),
        activeSessions: state.activeSessions.map(session =>
          session.id === sessionId
            ? { ...session, participantCount: (session.participantCount || 0) + 1 }
            : session
        )
      }));
    } catch (error) {
      set({ error: 'Failed to join session' });
    }
  },

  leaveSession: async (sessionId: string, userId: string) => {
    try {
      // Mock implementation - replace with actual Supabase operations
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Update participant count
      set(state => ({
        sessions: state.sessions.map(session =>
          session.id === sessionId
            ? { ...session, participantCount: Math.max(0, (session.participantCount || 0) - 1) }
            : session
        ),
        activeSessions: state.activeSessions.map(session =>
          session.id === sessionId
            ? { ...session, participantCount: Math.max(0, (session.participantCount || 0) - 1) }
            : session
        )
      }));
    } catch (error) {
      set({ error: 'Failed to leave session' });
    }
  },

  setCurrentSession: (session: LiveSession | null) => {
    set({ currentSession: session });
  },

  clearError: () => {
    set({ error: null });
  },
}));