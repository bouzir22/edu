export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  instructor?: User;
  schedule: string;
  maxStudents: number;
  enrolledCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  student?: User;
  course?: Course;
  enrolledAt: string;
}

export interface LiveSession {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  meetingUrl?: string;
  roomName: string;
  course?: Course;
  instructor?: User;
  participantCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SessionParticipant {
  id: string;
  sessionId: string;
  userId: string;
  user?: User;
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
}

export interface Question {
  id: string;
  type: 'multiple_choice' | 'single_answer' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  courseId: string;
  course?: Course;
  questions: Question[];
  timeLimit: number; // in minutes
  maxAttempts: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  exam?: Exam;
  student?: User;
  answers: Record<string, string>;
  score?: number;
  isGraded: boolean;
  submittedAt: string;
  gradedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}