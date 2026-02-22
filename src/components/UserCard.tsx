import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { RatingStars } from './RatingStars';
import { SkillTag } from './SkillTag';
import { User } from '@/types';
import { Briefcase } from 'lucide-react';

export function UserCard({ user }: { user: User }) {
  return (
    <Link to={`/profile/${user.id}`}>
      <Card className="shadow-card hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5 border-border/60">
        <CardContent className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h4 className="font-display font-semibold text-foreground text-sm">{user.name}</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Briefcase size={12} />{user.completedTasks} tasks
              </div>
            </div>
          </div>
          <RatingStars rating={user.averageRating} size={14} />
          <div className="flex flex-wrap gap-1 mt-2">
            {user.skills.slice(0, 3).map(s => <SkillTag key={s} skill={s} />)}
            {user.skills.length > 3 && (
              <span className="text-xs text-muted-foreground">+{user.skills.length - 3}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
