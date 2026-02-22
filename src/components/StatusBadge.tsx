import { Badge } from '@/components/ui/badge';
import { TaskStatus, ApplicationStatus, OrderStatus } from '@/types';

const taskStatusConfig: Record<TaskStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-info/15 text-info border-info/30' },
  in_progress: { label: 'In Progress', className: 'bg-urgent/15 text-urgent-foreground border-urgent/30' },
  submitted: { label: 'Submitted', className: 'bg-primary/15 text-primary border-primary/30' },
  revision_requested: { label: 'Revision', className: 'bg-warning/15 text-warning-foreground border-warning/30' },
  completed: { label: 'Completed', className: 'bg-success/15 text-success border-success/30' },
};

const appStatusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-muted text-muted-foreground border-border' },
  selected: { label: 'Selected', className: 'bg-success/15 text-success border-success/30' },
  rejected: { label: 'Rejected', className: 'bg-destructive/15 text-destructive border-destructive/30' },
};

const orderStatusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-muted text-muted-foreground border-border' },
  accepted: { label: 'Accepted', className: 'bg-info/15 text-info border-info/30' },
  rejected: { label: 'Rejected', className: 'bg-destructive/15 text-destructive border-destructive/30' },
  in_progress: { label: 'In Progress', className: 'bg-urgent/15 text-urgent-foreground border-urgent/30' },
  submitted: { label: 'Submitted', className: 'bg-primary/15 text-primary border-primary/30' },
  revision_requested: { label: 'Revision', className: 'bg-warning/15 text-warning-foreground border-warning/30' },
  completed: { label: 'Completed', className: 'bg-success/15 text-success border-success/30' },
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const config = taskStatusConfig[status];
  return <Badge variant="outline" className={`${config.className} text-xs font-medium`}>{config.label}</Badge>;
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const config = appStatusConfig[status];
  return <Badge variant="outline" className={`${config.className} text-xs font-medium`}>{config.label}</Badge>;
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = orderStatusConfig[status];
  return <Badge variant="outline" className={`${config.className} text-xs font-medium`}>{config.label}</Badge>;
}

export function UrgentBadge() {
  return (
    <Badge className="bg-urgent text-urgent-foreground text-xs font-semibold animate-pulse">
      ⚡ Urgent
    </Badge>
  );
}

export function OverdueBadge() {
  return (
    <Badge className="bg-destructive text-destructive-foreground text-xs font-semibold">
      ⏰ Overdue
    </Badge>
  );
}
