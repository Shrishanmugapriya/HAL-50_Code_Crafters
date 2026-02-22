export type UserRole = 'client' | 'student';

export interface User {
  id: string;
  name: string;
  bio: string;
  skills: string[];
  avatar: string;
  completedTasks: number;
  averageRating: number;
  totalRatings: number;
  walletBalance: number;
  totalEarnings: number;
  totalSpent: number;
}

export type TaskStatus = 'open' | 'in_progress' | 'submitted' | 'revision_requested' | 'completed';
export type ApplicationStatus = 'pending' | 'selected' | 'rejected';
export type OrderStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'submitted' | 'revision_requested' | 'completed';

export interface Task {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  budget: number;
  deadline: string;
  urgent: boolean;
  status: TaskStatus;
  selectedApplicantId?: string;
  createdAt: string;
  rated: boolean;
  acceptedAt?: string;
  submissionMessage?: string;
  revisionMessages?: string[];
}

export interface Application {
  id: string;
  taskId: string;
  applicantId: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Gig {
  id: string;
  userId: string;
  category: string;
  description: string;
  startingPrice: number;
  tags: string[];
  deliveryDays: number;
  createdAt: string;
}

export interface Order {
  id: string;
  gigId: string;
  clientId: string;
  studentId: string;
  description: string;
  budget: number;
  deadline: string;
  status: OrderStatus;
  acceptedAt?: string;
  submissionMessage?: string;
  revisionMessages?: string[];
  createdAt: string;
  rated: boolean;
}

export interface Rating {
  id: string;
  taskId: string;
  fromUserId: string;
  toUserId: string;
  score: number;
  comment: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  taskId: string;
  amount: number;
  type: 'payment' | 'earning';
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export const SKILL_OPTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'Design', 'UI/UX', 'Photography', 'Writing', 'Marketing',
  'Data Entry', 'Translation', 'Video Editing', 'SEO',
  'Mobile Dev', 'DevOps', 'Illustration', 'Social Media',
  'Accounting', 'Customer Support',
];

export const GIG_CATEGORIES = [
  'Web Development', 'Mobile Development', 'Design & Creative',
  'Writing & Translation', 'Marketing', 'Video & Animation',
  'Data & Analytics', 'Business', 'Lifestyle', 'Other',
];
