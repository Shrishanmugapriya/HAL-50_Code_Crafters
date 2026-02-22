import { useApp } from '@/contexts/AppContext';
import { TaskCard } from '@/components/TaskCard';
import { GigCard } from '@/components/GigCard';
import { OrderCard } from '@/components/OrderCard';
import { getRecommendedTasks } from '@/lib/recommendations';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, Briefcase, ShoppingCart, Sparkles, ListTodo } from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser, tasks, applications, gigs, orders } = useApp();

  const myGigs = gigs.filter(g => g.userId === currentUser.id);
  const incomingOrders = orders.filter(o => o.studentId === currentUser.id && o.status === 'pending');
  const activeOrders = orders.filter(o => o.studentId === currentUser.id && (o.status === 'in_progress' || o.status === 'revision_requested'));
  const submittedOrders = orders.filter(o => o.studentId === currentUser.id && o.status === 'submitted');
  const myAppIds = new Set(applications.filter(a => a.applicantId === currentUser.id).map(a => a.taskId));
  const myActiveTasks = tasks.filter(t => t.selectedApplicantId === currentUser.id && (t.status === 'in_progress' || t.status === 'revision_requested'));
  const recommended = getRecommendedTasks(tasks, currentUser, 5);

  const stats = [
    { label: 'Balance', value: `$${currentUser.walletBalance}`, icon: DollarSign, color: 'text-primary' },
    { label: 'Earnings', value: `$${currentUser.totalEarnings}`, icon: TrendingUp, color: 'text-success' },
    { label: 'My Gigs', value: myGigs.length, icon: Briefcase, color: 'text-info' },
    { label: 'Active Orders', value: activeOrders.length + myActiveTasks.length, icon: ShoppingCart, color: 'text-urgent' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Student Dashboard 🎓
        </h1>
        <p className="text-muted-foreground mt-1">Manage your gigs and incoming work.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="shadow-card border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={s.color}><s.icon size={22} /></div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Incoming Orders */}
      {incomingOrders.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">📥 Incoming Orders</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {incomingOrders.map(o => <OrderCard key={o.id} order={o} />)}
          </div>
        </section>
      )}

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Active Orders</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {activeOrders.map(o => <OrderCard key={o.id} order={o} />)}
          </div>
        </section>
      )}

      {/* Active Tasks (as worker) */}
      {myActiveTasks.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">
            <ListTodo size={18} className="inline mr-2" />Active Tasks
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {myActiveTasks.map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        </section>
      )}

      {/* Recommended Tasks */}
      {recommended.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">Recommended Tasks</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommended.slice(0, 3).map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        </section>
      )}

      {/* My Gigs */}
      {myGigs.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">My Gigs</h2>
            <Link to="/my-gigs" className="text-sm text-primary hover:underline font-medium">View all →</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGigs.slice(0, 3).map(g => <GigCard key={g.id} gig={g} />)}
          </div>
        </section>
      )}
    </div>
  );
}
