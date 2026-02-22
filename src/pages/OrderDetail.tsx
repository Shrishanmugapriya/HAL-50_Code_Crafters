import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { OrderStatusBadge } from '@/components/StatusBadge';
import { CountdownTimer } from '@/components/CountdownTimer';
import { RatingInput } from '@/components/RatingStars';
import { UserCard } from '@/components/UserCard';
import { toast } from 'sonner';
import { DollarSign, Calendar, User } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    currentUser, orders, gigs,
    acceptOrder, rejectOrder, submitOrder, requestOrderRevision, completeOrder, rateOrder, getUserById,
  } = useApp();

  const [submissionMsg, setSubmissionMsg] = useState('');
  const [revisionMsg, setRevisionMsg] = useState('');
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const order = orders.find(o => o.id === id);
  if (!order) return <p className="text-muted-foreground p-8 text-center">Order not found.</p>;

  const isClient = order.clientId === currentUser.id;
  const isStudent = order.studentId === currentUser.id;
  const client = getUserById(order.clientId);
  const student = getUserById(order.studentId);
  const gig = gigs.find(g => g.id === order.gigId);
  const showTimer = order.status === 'in_progress' || order.status === 'revision_requested';

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <OrderStatusBadge status={order.status} />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">Order Details</h1>
      </div>

      <Card className="shadow-card border-border/60">
        <CardContent className="p-6 space-y-4">
          {gig && <p className="text-xs text-muted-foreground">Gig: {gig.category}</p>}
          <p className="text-foreground">{order.description}</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold text-foreground"><DollarSign size={14} className="text-primary" />${order.budget}</span>
            <span className="flex items-center gap-1"><Calendar size={14} />{new Date(order.deadline).toLocaleDateString()}</span>
          </div>
          {showTimer && <CountdownTimer deadline={order.deadline} />}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border">
            {client && <div><p className="text-xs text-muted-foreground mb-1">Client</p><UserCard user={client} /></div>}
            {student && <div><p className="text-xs text-muted-foreground mb-1">Student</p><UserCard user={student} /></div>}
          </div>
        </CardContent>
      </Card>

      {/* Student: Accept/Reject pending order */}
      {isStudent && order.status === 'pending' && (
        <div className="flex gap-3">
          <Button onClick={() => { acceptOrder(order.id); toast.success('Order accepted!'); }} className="flex-1 bg-success text-success-foreground hover:opacity-90">
            Accept Order
          </Button>
          <Button onClick={() => { rejectOrder(order.id); toast.info('Order declined'); }} variant="outline" className="flex-1 border-destructive text-destructive">
            Decline
          </Button>
        </div>
      )}

      {/* Student: Submit work */}
      {isStudent && (order.status === 'in_progress' || order.status === 'revision_requested') && (
        <Card className="shadow-card border-border/60">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">
              {order.status === 'revision_requested' ? 'Resubmit Work' : 'Submit Work'}
            </h3>
            {order.revisionMessages && order.revisionMessages.length > 0 && (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                <p className="text-xs font-semibold text-warning-foreground mb-1">Revision Notes:</p>
                {order.revisionMessages.map((m, i) => <p key={i} className="text-sm text-foreground">• {m}</p>)}
              </div>
            )}
            <Textarea value={submissionMsg} onChange={e => setSubmissionMsg(e.target.value)} placeholder="Describe your submission..." rows={3} />
            <Button onClick={() => { if (!submissionMsg.trim()) { toast.error('Add a message'); return; } submitOrder(order.id, submissionMsg); toast.success('Work submitted!'); setSubmissionMsg(''); }} className="gradient-primary text-primary-foreground">
              Submit Work
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Client: Review submission */}
      {isClient && order.status === 'submitted' && (
        <Card className="shadow-card border-border/60">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Review Submission</h3>
            {order.submissionMessage && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="text-xs font-semibold text-primary mb-1">Submission:</p>
                <p className="text-sm text-foreground">{order.submissionMessage}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={() => { completeOrder(order.id); toast.success('Payment released!'); }} className="bg-success text-success-foreground hover:opacity-90 flex-1">
                Accept & Pay ${order.budget}
              </Button>
              <div className="flex-1 space-y-2">
                <Textarea value={revisionMsg} onChange={e => setRevisionMsg(e.target.value)} placeholder="What needs changing?" rows={2} />
                <Button onClick={() => { if (!revisionMsg.trim()) { toast.error('Add details'); return; } requestOrderRevision(order.id, revisionMsg); toast.success('Revision requested'); setRevisionMsg(''); }} variant="outline" className="w-full border-warning text-warning-foreground hover:bg-warning/10">
                  Request Revision
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Client: Rate */}
      {isClient && order.status === 'completed' && !order.rated && (
        <Card className="shadow-card border-border/60">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Rate the Student</h3>
            <RatingInput value={ratingScore} onChange={setRatingScore} />
            <Textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} placeholder="Optional comment..." rows={2} />
            <Button onClick={() => { if (ratingScore === 0) { toast.error('Select a rating'); return; } rateOrder(order.id, ratingScore, ratingComment); toast.success('Rating submitted!'); }} className="gradient-primary text-primary-foreground">
              Submit Rating
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
