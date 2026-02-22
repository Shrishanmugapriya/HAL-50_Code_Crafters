import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Task, Application, Gig, Order, Rating, Transaction, Notification } from '@/types';

interface AppState {
  currentUser: User;
  currentRole: UserRole;
  users: User[];
  tasks: Task[];
  applications: Application[];
  gigs: Gig[];
  orders: Order[];
  ratings: Rating[];
  transactions: Transaction[];
  notifications: Notification[];
  setCurrentUser: (user: User) => void;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<User>) => void;
  createTask: (task: Omit<Task, 'id' | 'creatorId' | 'status' | 'createdAt' | 'rated'>) => void;
  applyToTask: (taskId: string, message: string) => void;
  selectApplicant: (taskId: string, applicantId: string) => void;
  submitTask: (taskId: string, message: string) => void;
  requestRevision: (taskId: string, message: string) => void;
  completeTask: (taskId: string) => void;
  rateWorker: (taskId: string, workerId: string, score: number, comment: string) => void;
  createGig: (gig: Omit<Gig, 'id' | 'userId' | 'createdAt'>) => void;
  placeOrder: (gigId: string, description: string, budget: number, deadline: string) => void;
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  submitOrder: (orderId: string, message: string) => void;
  requestOrderRevision: (orderId: string, message: string) => void;
  completeOrder: (orderId: string) => void;
  rateOrder: (orderId: string, score: number, comment: string) => void;
  addNotification: (userId: string, message: string, link?: string) => void;
  markNotificationRead: (notifId: string) => void;
  getUserById: (id: string) => User | undefined;
}

const AppContext = createContext<AppState | undefined>(undefined);

const defaultUsers: User[] = [
  {
    id: 'user-1', name: 'Alex Rivera', bio: 'Full-stack developer with 5 years of experience in React and Node.js.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js'],
    avatar: '', completedTasks: 12, averageRating: 4.7, totalRatings: 10,
    walletBalance: 2500, totalEarnings: 4200, totalSpent: 1700,
  },
  {
    id: 'user-2', name: 'Sam Chen', bio: 'Creative designer specializing in UI/UX and brand identity.',
    skills: ['Design', 'UI/UX', 'Illustration', 'Photography'],
    avatar: '', completedTasks: 8, averageRating: 4.9, totalRatings: 7,
    walletBalance: 1800, totalEarnings: 3100, totalSpent: 1300,
  },
  {
    id: 'user-3', name: 'Jordan Lee', bio: 'Content writer and marketing strategist.',
    skills: ['Writing', 'Marketing', 'SEO', 'Social Media'],
    avatar: '', completedTasks: 15, averageRating: 4.5, totalRatings: 13,
    walletBalance: 3200, totalEarnings: 5500, totalSpent: 2300,
  },
  {
    id: 'user-4', name: 'Taylor Kim', bio: 'Data analyst and Python developer.',
    skills: ['Python', 'Data Entry', 'Accounting', 'DevOps'],
    avatar: '', completedTasks: 6, averageRating: 4.3, totalRatings: 5,
    walletBalance: 900, totalEarnings: 1400, totalSpent: 500,
  },
];

const defaultTasks: Task[] = [
  {
    id: 'task-1', creatorId: 'user-2', title: 'Build a React Landing Page',
    description: 'Need a responsive landing page with modern design, animations, and mobile support.',
    requiredSkills: ['React', 'TypeScript', 'UI/UX'], budget: 300, deadline: '2026-03-15',
    urgent: true, status: 'open', createdAt: '2026-02-18T10:00:00Z', rated: false,
  },
  {
    id: 'task-2', creatorId: 'user-3', title: 'SEO Audit for E-commerce Site',
    description: 'Perform a comprehensive SEO audit and provide actionable recommendations.',
    requiredSkills: ['SEO', 'Marketing', 'Writing'], budget: 150, deadline: '2026-03-01',
    urgent: false, status: 'open', createdAt: '2026-02-19T14:00:00Z', rated: false,
  },
  {
    id: 'task-3', creatorId: 'user-1', title: 'Design App Icon Set',
    description: 'Create a set of 20 custom icons for a mobile application.',
    requiredSkills: ['Design', 'Illustration'], budget: 200, deadline: '2026-03-10',
    urgent: false, status: 'open', createdAt: '2026-02-20T09:00:00Z', rated: false,
  },
  {
    id: 'task-4', creatorId: 'user-4', title: 'Write API Documentation',
    description: 'Document REST API endpoints with examples and error codes.',
    requiredSkills: ['Writing', 'JavaScript', 'Node.js'], budget: 180, deadline: '2026-03-05',
    urgent: true, status: 'open', createdAt: '2026-02-20T16:00:00Z', rated: false,
  },
];

const defaultGigs: Gig[] = [
  {
    id: 'gig-1', userId: 'user-1', category: 'Web Development',
    description: 'I will build a responsive React website with modern UI.',
    startingPrice: 200, tags: ['React', 'TypeScript', 'Responsive'], deliveryDays: 7,
    createdAt: '2026-02-17T10:00:00Z',
  },
  {
    id: 'gig-2', userId: 'user-2', category: 'Design & Creative',
    description: 'I will create stunning UI/UX designs for your app or website.',
    startingPrice: 150, tags: ['UI/UX', 'Figma', 'Mobile Design'], deliveryDays: 5,
    createdAt: '2026-02-18T12:00:00Z',
  },
  {
    id: 'gig-3', userId: 'user-3', category: 'Writing & Translation',
    description: 'I will write SEO-optimized blog posts and website copy.',
    startingPrice: 50, tags: ['SEO', 'Blog', 'Copywriting'], deliveryDays: 3,
    createdAt: '2026-02-19T08:00:00Z',
  },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`hypergig_${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

function saveState(key: string, value: unknown) {
  localStorage.setItem(`hypergig_${key}`, JSON.stringify(value));
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => loadState('users', defaultUsers));
  const [currentUser, setCurrentUserState] = useState<User>(() => {
    const saved = loadState<User | null>('currentUser', null);
    return saved || users[0];
  });
  const [currentRole, setCurrentRole] = useState<UserRole>(() => loadState('currentRole', 'client'));
  const [tasks, setTasks] = useState<Task[]>(() => loadState('tasks', defaultTasks));
  const [applications, setApplications] = useState<Application[]>(() => loadState('applications', []));
  const [gigs, setGigs] = useState<Gig[]>(() => loadState('gigs', defaultGigs));
  const [orders, setOrders] = useState<Order[]>(() => loadState('orders', []));
  const [ratings, setRatings] = useState<Rating[]>(() => loadState('ratings', []));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadState('transactions', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadState('notifications', []));

  useEffect(() => { saveState('users', users); }, [users]);
  useEffect(() => { saveState('currentUser', currentUser); }, [currentUser]);
  useEffect(() => { saveState('currentRole', currentRole); }, [currentRole]);
  useEffect(() => { saveState('tasks', tasks); }, [tasks]);
  useEffect(() => { saveState('applications', applications); }, [applications]);
  useEffect(() => { saveState('gigs', gigs); }, [gigs]);
  useEffect(() => { saveState('orders', orders); }, [orders]);
  useEffect(() => { saveState('ratings', ratings); }, [ratings]);
  useEffect(() => { saveState('transactions', transactions); }, [transactions]);
  useEffect(() => { saveState('notifications', notifications); }, [notifications]);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    setUsers(prev => prev.map(u => u.id === user.id ? user : u));
  };

  const switchUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUserState(user);
  };

  const switchRole = (role: UserRole) => setCurrentRole(role);

  const updateProfile = (updates: Partial<User>) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
  };

  const getUserById = (id: string) => users.find(u => u.id === id);

  const addNotification = (userId: string, message: string, link?: string) => {
    const notif: Notification = {
      id: `notif-${generateId()}`, userId, message, read: false, link,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  // ── Task CRUD ──
  const createTask = (taskData: Omit<Task, 'id' | 'creatorId' | 'status' | 'createdAt' | 'rated'>) => {
    const task: Task = {
      ...taskData, id: `task-${generateId()}`, creatorId: currentUser.id,
      status: 'open', createdAt: new Date().toISOString(), rated: false,
    };
    setTasks(prev => [task, ...prev]);
  };

  const applyToTask = (taskId: string, message: string) => {
    const app: Application = {
      id: `app-${generateId()}`, taskId, applicantId: currentUser.id,
      message, status: 'pending', createdAt: new Date().toISOString(),
    };
    setApplications(prev => [...prev, app]);
    const task = tasks.find(t => t.id === taskId);
    if (task) addNotification(task.creatorId, `${currentUser.name} applied to "${task.title}"`, `/tasks/${taskId}`);
  };

  const selectApplicant = (taskId: string, applicantId: string) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: 'in_progress' as const, selectedApplicantId: applicantId, acceptedAt: new Date().toISOString() } : t
    ));
    setApplications(prev => prev.map(a =>
      a.taskId === taskId
        ? { ...a, status: a.applicantId === applicantId ? 'selected' as const : 'rejected' as const }
        : a
    ));
    const task = tasks.find(t => t.id === taskId);
    addNotification(applicantId, `You were selected for "${task?.title}"`, `/tasks/${taskId}`);
  };

  const submitTask = (taskId: string, message: string) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: 'submitted' as const, submissionMessage: message } : t
    ));
    const task = tasks.find(t => t.id === taskId);
    if (task) addNotification(task.creatorId, `Work submitted for "${task.title}"`, `/tasks/${taskId}`);
  };

  const requestRevision = (taskId: string, message: string) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: 'revision_requested' as const, revisionMessages: [...(t.revisionMessages || []), message] } : t
    ));
    const task = tasks.find(t => t.id === taskId);
    if (task && task.selectedApplicantId) addNotification(task.selectedApplicantId, `Revision requested for "${task.title}"`, `/tasks/${taskId}`);
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.selectedApplicantId) return;

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'completed' as const } : t));

    const tx1: Transaction = {
      id: `tx-${generateId()}`, fromUserId: task.creatorId, toUserId: task.selectedApplicantId,
      taskId, amount: task.budget, type: 'payment', createdAt: new Date().toISOString(),
    };
    const tx2: Transaction = {
      id: `tx-${generateId()}`, fromUserId: task.creatorId, toUserId: task.selectedApplicantId,
      taskId, amount: task.budget, type: 'earning', createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, tx1, tx2]);

    setUsers(prev => prev.map(u => {
      if (u.id === task.creatorId) return { ...u, walletBalance: u.walletBalance - task.budget, totalSpent: u.totalSpent + task.budget };
      if (u.id === task.selectedApplicantId) return { ...u, walletBalance: u.walletBalance + task.budget, totalEarnings: u.totalEarnings + task.budget, completedTasks: u.completedTasks + 1 };
      return u;
    }));

    if (currentUser.id === task.creatorId) setCurrentUserState(prev => ({ ...prev, walletBalance: prev.walletBalance - task.budget, totalSpent: prev.totalSpent + task.budget }));
    else if (currentUser.id === task.selectedApplicantId) setCurrentUserState(prev => ({ ...prev, walletBalance: prev.walletBalance + task.budget, totalEarnings: prev.totalEarnings + task.budget, completedTasks: prev.completedTasks + 1 }));

    addNotification(task.selectedApplicantId, `Payment of $${task.budget} received for "${task.title}"`, '/wallet');
  };

  const rateWorker = (taskId: string, workerId: string, score: number, comment: string) => {
    const rating: Rating = {
      id: `rat-${generateId()}`, taskId, fromUserId: currentUser.id,
      toUserId: workerId, score, comment, createdAt: new Date().toISOString(),
    };
    setRatings(prev => [...prev, rating]);
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, rated: true } : t));

    setUsers(prev => prev.map(u => {
      if (u.id === workerId) {
        const newTotal = u.totalRatings + 1;
        const newAvg = ((u.averageRating * u.totalRatings) + score) / newTotal;
        return { ...u, averageRating: Math.round(newAvg * 10) / 10, totalRatings: newTotal };
      }
      return u;
    }));
  };

  // ── Gig & Order CRUD ──
  const createGig = (gigData: Omit<Gig, 'id' | 'userId' | 'createdAt'>) => {
    const gig: Gig = { ...gigData, id: `gig-${generateId()}`, userId: currentUser.id, createdAt: new Date().toISOString() };
    setGigs(prev => [gig, ...prev]);
  };

  const placeOrder = (gigId: string, description: string, budget: number, deadline: string) => {
    const gig = gigs.find(g => g.id === gigId);
    if (!gig) return;
    const order: Order = {
      id: `order-${generateId()}`, gigId, clientId: currentUser.id, studentId: gig.userId,
      description, budget, deadline, status: 'pending', createdAt: new Date().toISOString(), rated: false,
    };
    setOrders(prev => [order, ...prev]);
    addNotification(gig.userId, `New order from ${currentUser.name}`, `/orders/${order.id}`);
  };

  const acceptOrder = (orderId: string) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'in_progress' as const, acceptedAt: new Date().toISOString() } : o
    ));
    const order = orders.find(o => o.id === orderId);
    if (order) addNotification(order.clientId, `Your order was accepted`, `/orders/${orderId}`);
  };

  const rejectOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'rejected' as const } : o));
    const order = orders.find(o => o.id === orderId);
    if (order) addNotification(order.clientId, `Your order was declined`, `/orders/${orderId}`);
  };

  const submitOrder = (orderId: string, message: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'submitted' as const, submissionMessage: message } : o));
    const order = orders.find(o => o.id === orderId);
    if (order) addNotification(order.clientId, `Work submitted for your order`, `/orders/${orderId}`);
  };

  const requestOrderRevision = (orderId: string, message: string) => {
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status: 'revision_requested' as const, revisionMessages: [...(o.revisionMessages || []), message] } : o
    ));
    const order = orders.find(o => o.id === orderId);
    if (order) addNotification(order.studentId, `Revision requested for your order`, `/orders/${orderId}`);
  };

  const completeOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed' as const } : o));

    const tx1: Transaction = { id: `tx-${generateId()}`, fromUserId: order.clientId, toUserId: order.studentId, taskId: orderId, amount: order.budget, type: 'payment', createdAt: new Date().toISOString() };
    const tx2: Transaction = { id: `tx-${generateId()}`, fromUserId: order.clientId, toUserId: order.studentId, taskId: orderId, amount: order.budget, type: 'earning', createdAt: new Date().toISOString() };
    setTransactions(prev => [...prev, tx1, tx2]);

    setUsers(prev => prev.map(u => {
      if (u.id === order.clientId) return { ...u, walletBalance: u.walletBalance - order.budget, totalSpent: u.totalSpent + order.budget };
      if (u.id === order.studentId) return { ...u, walletBalance: u.walletBalance + order.budget, totalEarnings: u.totalEarnings + order.budget, completedTasks: u.completedTasks + 1 };
      return u;
    }));

    if (currentUser.id === order.clientId) setCurrentUserState(prev => ({ ...prev, walletBalance: prev.walletBalance - order.budget, totalSpent: prev.totalSpent + order.budget }));
    else if (currentUser.id === order.studentId) setCurrentUserState(prev => ({ ...prev, walletBalance: prev.walletBalance + order.budget, totalEarnings: prev.totalEarnings + order.budget, completedTasks: prev.completedTasks + 1 }));

    addNotification(order.studentId, `Payment of $${order.budget} received!`, '/wallet');
  };

  const rateOrder = (orderId: string, score: number, comment: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const rating: Rating = {
      id: `rat-${generateId()}`, taskId: orderId, fromUserId: currentUser.id,
      toUserId: order.studentId, score, comment, createdAt: new Date().toISOString(),
    };
    setRatings(prev => [...prev, rating]);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, rated: true } : o));
    setUsers(prev => prev.map(u => {
      if (u.id === order.studentId) {
        const newTotal = u.totalRatings + 1;
        const newAvg = ((u.averageRating * u.totalRatings) + score) / newTotal;
        return { ...u, averageRating: Math.round(newAvg * 10) / 10, totalRatings: newTotal };
      }
      return u;
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser, currentRole, users, tasks, applications, gigs, orders, ratings, transactions, notifications,
      setCurrentUser, switchUser, switchRole, updateProfile,
      createTask, applyToTask, selectApplicant, submitTask, requestRevision, completeTask, rateWorker,
      createGig, placeOrder, acceptOrder, rejectOrder, submitOrder, requestOrderRevision, completeOrder, rateOrder,
      addNotification, markNotificationRead, getUserById,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
