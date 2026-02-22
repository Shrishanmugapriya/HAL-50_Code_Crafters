import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { SkillTag } from './SkillTag';
import { Gig } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { DollarSign, User, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function GigCard({ gig }: { gig: Gig }) {
  const { getUserById } = useApp();
  const user = getUserById(gig.userId);

  return (
    <Link to={`/gigs/${gig.id}`}>
      <Card className="shadow-card hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5 border-border/60">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs font-medium">
              {gig.category}
            </Badge>
            <span className="flex items-center gap-1 font-semibold text-foreground text-sm">
              <DollarSign size={14} className="text-primary" />From ${gig.startingPrice}
            </span>
          </div>

          <p className="text-sm text-foreground mb-3 line-clamp-3">{gig.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {gig.tags.map(t => <SkillTag key={t} skill={t} />)}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {user && (
              <span className="flex items-center gap-1.5">
                <User size={14} />{user.name}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock size={14} />{gig.deliveryDays}d delivery
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
