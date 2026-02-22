import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { OrderStatusBadge } from './StatusBadge';
import { CountdownTimer } from './CountdownTimer';
import { Order } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { DollarSign, User, Calendar } from 'lucide-react';

export function OrderCard({ order }: { order: Order }) {
  const { getUserById } = useApp();
  const client = getUserById(order.clientId);
  const student = getUserById(order.studentId);
  const showTimer = order.status === 'in_progress' || order.status === 'revision_requested';
  const isOverdue = showTimer && new Date(order.deadline).getTime() < Date.now();

  return (
    <Link to={`/orders/${order.id}`}>
      <Card className={`shadow-card hover:shadow-elevated transition-all duration-200 hover:-translate-y-0.5 border-border/60 ${isOverdue ? 'border-destructive/50' : ''}`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <p className="font-display font-semibold text-foreground text-sm line-clamp-2">{order.description}</p>
            <OrderStatusBadge status={order.status} />
          </div>

          {showTimer && (
            <div className="mb-3">
              <CountdownTimer deadline={order.deadline} />
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <DollarSign size={14} className="text-primary" />${order.budget}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={14} />{new Date(order.deadline).toLocaleDateString()}
              </span>
            </div>
            <span className="flex items-center gap-1">
              <User size={14} />{client?.name || student?.name}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
