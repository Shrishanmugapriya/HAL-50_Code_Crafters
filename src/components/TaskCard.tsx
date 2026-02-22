import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { SkillTag } from './SkillTag';
import { TaskStatusBadge, UrgentBadge, OverdueBadge } from './StatusBadge';
import { CountdownTimer } from './CountdownTimer';
import { Task } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Calendar, DollarSign, User } from 'lucide-react';

export function TaskCard({ task }: { task: Task }) {
  const { getUserById } = useApp();
  const creator = getUserById(task.creatorId);
  const showTimer = (task.status === 'in_progress' || task.status === 'revision_requested') && task.acceptedAt;
  const isOverdue = showTimer && new Date(task.deadline).getTime() < Date.now();

  return (
    <Link to={`/tasks/${task.id}`}>
      <Card className={`shadow-card hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5 border-border/60 ${isOverdue ? 'border-destructive/50' : ''}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-display font-semibold text-foreground text-base leading-tight line-clamp-2">{task.title}</h3>
            <div className="flex items-center gap-1.5 shrink-0">
              {task.urgent && <UrgentBadge />}
              {isOverdue && <OverdueBadge />}
              <TaskStatusBadge status={task.status} />
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{task.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {task.requiredSkills.map(s => <SkillTag key={s} skill={s} />)}
          </div>

          {showTimer && (
            <div className="mb-3">
              <CountdownTimer deadline={task.deadline} />
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <DollarSign size={14} className="text-primary" />${task.budget}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />{new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
            {creator && (
              <span className="flex items-center gap-1">
                <User size={14} />{creator.name}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
