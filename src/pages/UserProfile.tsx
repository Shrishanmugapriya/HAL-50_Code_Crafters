import { useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { RatingStars } from '@/components/RatingStars';
import { SkillTag } from '@/components/SkillTag';
import { GigCard } from '@/components/GigCard';
import { TaskCard } from '@/components/TaskCard';
import { Briefcase, DollarSign, TrendingUp } from 'lucide-react';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const { users, tasks, gigs, ratings } = useApp();
  const user = users.find(u => u.id === id);

  if (!user) return <p className="text-muted-foreground p-8 text-center">User not found.</p>;

  const userGigs = gigs.filter(g => g.userId === user.id);
  const completedTasks = tasks.filter(t => t.status === 'completed' && t.selectedApplicantId === user.id);
  const userRatings = ratings.filter(r => r.toUserId === user.id);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <Card className="shadow-card border-border/60">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl shrink-0">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">{user.name}</h1>
              <p className="text-muted-foreground mt-1">{user.bio}</p>
              <div className="mt-3"><RatingStars rating={user.averageRating} /></div>
              <div className="flex flex-wrap gap-1.5 mt-3">{user.skills.map(s => <SkillTag key={s} skill={s} />)}</div>
              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Briefcase size={14} />{user.completedTasks} completed</span>
                <span className="flex items-center gap-1"><TrendingUp size={14} />${user.totalEarnings} earned</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings */}
      {userRatings.length > 0 && (
        <section>
          <h3 className="font-display font-semibold text-foreground mb-3">Reviews ({userRatings.length})</h3>
          <div className="space-y-2">
            {userRatings.map(r => (
              <Card key={r.id} className="shadow-card border-border/60">
                <CardContent className="p-4">
                  <RatingStars rating={r.score} size={14} />
                  {r.comment && <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Gigs */}
      {userGigs.length > 0 && (
        <section>
          <h3 className="font-display font-semibold text-foreground mb-3">Gigs</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {userGigs.map(g => <GigCard key={g.id} gig={g} />)}
          </div>
        </section>
      )}

      {/* Completed */}
      {completedTasks.length > 0 && (
        <section>
          <h3 className="font-display font-semibold text-foreground mb-3">Completed Tasks</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {completedTasks.map(t => <TaskCard key={t.id} task={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}
