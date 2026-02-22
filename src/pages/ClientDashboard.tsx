import { useApp } from '@/contexts/AppContext';
import { TaskCard } from '@/components/TaskCard';
import { GigCard } from '@/components/GigCard';
import { getRecommendedWorkers, getRecommendedGigs } from '@/lib/recommendations';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingDown, ListTodo, Briefcase, ShoppingCart, Sparkles } from 'lucide-react';
import { UserCard } from '@/components/UserCard';

export default function ClientDashboard() {
  const { currentUser, tasks, orders, gigs, users } = useApp();

  const myOpenTasks = tasks.filter(t => t.creatorId === currentUser.id && t.status === 'open');
  const myInProgress = tasks.filter(t => t.creatorId === currentUser.id && (t.status === 'in_progress' || t.status === 'submitted' || t.status === 'revision_requested'));
  const mySubmitted = tasks.filter(t => t.creatorId === currentUser.id && t.status === 'submitted');
  const myCompleted = tasks.filter(t => t.creatorId === currentUser.id && t.status === 'completed');
  const myOrders = orders.filter(o => o.clientId === currentUser.id);
  const recommendedGigs = getRecommendedGigs(gigs, users, currentUser, 5);
  const recommendedWorkersMap = myOpenTasks.slice(0, 2).map(t => ({
    task: t,
    workers: getRecommendedWorkers(t, users, 3),
  }));

  const stats = [
    { label: 'Wallet', value: `$${currentUser.walletBalance}`, icon: DollarSign, color: 'text-primary' },
    { label: 'Total Spent', value: `$${currentUser.totalSpent}`, icon: TrendingDown, color: 'text-destructive' },
    { label: 'Open Tasks', value: myOpenTasks.length, icon: ListTodo, color: 'text-info' },
    { label: 'Active Orders', value: myOrders.filter(o => o.status === 'in_progress' || o.status === 'submitted').length, icon: ShoppingCart, color: 'text-urgent' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Client Dashboard 👋
        </h1>
        <p className="text-muted-foreground mt-1">Manage your tasks and orders.</p>
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

      {/* Submissions awaiting review */}
      {mySubmitted.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">⚡ Awaiting Your Review</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySubmitted.map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        </section>
      )}

      {/* Open Tasks */}
      {myOpenTasks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display font-semibold text-foreground">My Open Tasks</h2>
            <Link to="/tasks" className="text-sm text-primary hover:underline font-medium">View all →</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myOpenTasks.slice(0, 6).map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        </section>
      )}

      {/* Recommended Workers */}
      {recommendedWorkersMap.some(r => r.workers.length > 0) && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">Recommended Workers</h2>
          </div>
          {recommendedWorkersMap.map(({ task, workers }) => workers.length > 0 && (
            <div key={task.id} className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                For "<Link to={`/tasks/${task.id}`} className="text-primary hover:underline">{task.title}</Link>"
              </p>
              <div className="grid md:grid-cols-3 gap-3">
                {workers.map(w => <UserCard key={w.id} user={w} />)}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* In Progress */}
      {myInProgress.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">In Progress</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {myInProgress.map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        </section>
      )}

      {/* Recommended Gigs */}
      {recommendedGigs.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-primary" />
            <h2 className="text-lg font-display font-semibold text-foreground">Recommended Gigs</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedGigs.slice(0, 3).map(g => <GigCard key={g.id} gig={g} />)}
          </div>
        </section>
      )}

      {/* Completed */}
      {myCompleted.length > 0 && (
        <section>
          <h2 className="text-lg font-display font-semibold text-foreground mb-4">Completed Tasks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCompleted.slice(0, 3).map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}
