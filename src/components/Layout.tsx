import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import {
  LayoutDashboard, ListTodo, Briefcase, UserCircle, Wallet, Plus, ShoppingCart,
  Bell, GraduationCap, Building2,
} from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const clientNav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks', icon: ListTodo, label: 'My Tasks' },
  { to: '/gigs', icon: Briefcase, label: 'Browse Gigs' },
  { to: '/orders', icon: ShoppingCart, label: 'My Orders' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
];

const studentNav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/my-gigs', icon: Briefcase, label: 'My Gigs' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/tasks', icon: ListTodo, label: 'Open Tasks' },
  { to: '/wallet', icon: Wallet, label: 'Earnings' },
  { to: '/profile', icon: UserCircle, label: 'Profile' },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { currentUser, currentRole, users, switchUser, switchRole, notifications } = useApp();

  const navItems = currentRole === 'client' ? clientNav : studentNav;
  const unreadCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border shrink-0 flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Briefcase size={16} className="text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-lg text-sidebar-foreground">HyperGig</h1>
          </Link>
        </div>

        {/* User Switcher */}
        <div className="p-4 border-b border-sidebar-border space-y-3">
          <div>
            <label className="text-xs text-sidebar-foreground/60 mb-1.5 block font-medium">Switch User</label>
            <Select value={currentUser.id} onValueChange={switchUser}>
              <SelectTrigger className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground text-sm h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {users.map(u => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Role Switcher */}
          <div>
            <label className="text-xs text-sidebar-foreground/60 mb-1.5 block font-medium">Role</label>
            <div className="flex rounded-lg overflow-hidden border border-sidebar-border">
              <button
                onClick={() => switchRole('client')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${
                  currentRole === 'client'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground'
                }`}
              >
                <Building2 size={13} />Client
              </button>
              <button
                onClick={() => switchRole('student')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-colors ${
                  currentRole === 'student'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground'
                }`}
              >
                <GraduationCap size={13} />Student
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const active = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}

          {/* Notifications */}
          <Link
            to="/notifications"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === '/notifications'
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
            }`}
          >
            <Bell size={18} />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-auto bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0 min-w-[18px] h-[18px] flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </Link>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          {currentRole === 'client' ? (
            <Link
              to="/tasks/create"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg gradient-primary text-primary-foreground font-medium text-sm transition-opacity hover:opacity-90"
            >
              <Plus size={16} />Post a Task
            </Link>
          ) : (
            <Link
              to="/gigs/create"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg gradient-primary text-primary-foreground font-medium text-sm transition-opacity hover:opacity-90"
            >
              <Plus size={16} />Post a Gig
            </Link>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
