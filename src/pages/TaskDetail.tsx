import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SkillTag } from '@/components/SkillTag';
import { TaskStatusBadge, UrgentBadge } from '@/components/StatusBadge';
import { RatingStars, RatingInput } from '@/components/RatingStars';
import { UserCard } from '@/components/UserCard';
import { CountdownTimer } from '@/components/CountdownTimer';
import { getRecommendedWorkers } from '@/lib/recommendations';
import { toast } from 'sonner';
import { Calendar, DollarSign, User, Sparkles } from 'lucide-react';
import { ApplicationStatusBadge } from '@/components/StatusBadge';

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    currentUser, currentRole, tasks, applications, users,
    applyToTask, selectApplicant, submitTask, requestRevision, completeTask, rateWorker, getUserById,
  } = useApp();
  const [message, setMessage] = useState('');
  const [submissionMsg, setSubmissionMsg] = useState('');
  const [revisionMsg, setRevisionMsg] = useState('');
  const [ratingScore, setRatingScore] = useState(0);
  const [ratingComment, setRatingComment] = useState('');

  const task = tasks.find(t => t.id === id);
  if (!task) return <p className="text-muted-foreground p-8 text-center">Task not found.</p>;

  const creator = getUserById(task.creatorId);
  const taskApps = applications.filter(a => a.taskId === task.id);
  const myApp = taskApps.find(a => a.applicantId === currentUser.id);
  const isCreator = task.creatorId === currentUser.id;
  const isWorker = task.selectedApplicantId === currentUser.id;
  const selectedWorker = task.selectedApplicantId ? getUserById(task.selectedApplicantId) : null;
  const recommended = isCreator && task.status === 'open' ? getRecommendedWorkers(task, users, 5) : [];
  const showTimer = (task.status === 'in_progress' || task.status === 'revision_requested') && task.acceptedAt;

  const handleApply = () => {
    if (!message.trim()) { toast.error('Write a message'); return; }
    applyToTask(task.id, message);
    toast.success('Applied!');
    setMessage('');
  };

  const handleSubmit = () => {
    if (!submissionMsg.trim()) { toast.error('Add a submission message'); return; }
    submitTask(task.id, submissionMsg);
    toast.success('Work submitted!');
    setSubmissionMsg('');
  };

  const handleRevision = () => {
    if (!revisionMsg.trim()) { toast.error('Add revision details'); return; }
    requestRevision(task.id, revisionMsg);
    toast.success('Revision requested');
    setRevisionMsg('');
  };

  const handleAcceptPay = () => {
    completeTask(task.id);
    toast.success('Task completed! Payment transferred.');
  };

  const handleRate = () => {
    if (ratingScore === 0) { toast.error('Select a rating'); return; }
    rateWorker(task.id, task.selectedApplicantId!, ratingScore, ratingComment);
    toast.success('Rating submitted!');
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          {task.urgent && <UrgentBadge />}
          <TaskStatusBadge status={task.status} />
        </div>
        <h1 className="text-2xl font-display font-bold text-foreground">{task.title}</h1>
      </div>

      <Card className="shadow-card border-border/60">
        <CardContent className="p-6 space-y-4">
          <p className="text-foreground">{task.description}</p>
          <div className="flex flex-wrap gap-1.5">{task.requiredSkills.map(s => <SkillTag key={s} skill={s} />)}</div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold text-foreground"><DollarSign size={14} className="text-primary" />${task.budget}</span>
            <span className="flex items-center gap-1"><Calendar size={14} />{new Date(task.deadline).toLocaleDateString()}</span>
            {creator && (
              <Link to={`/profile/${creator.id}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                <User size={14} />{creator.name}
              </Link>
            )}
          </div>
          {showTimer && <CountdownTimer deadline={task.deadline} />}
          {selectedWorker && (
            <div className="pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Selected Worker:</p>
              <UserCard user={selectedWorker} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Worker: Submit work */}
      {isWorker && (task.status === 'in_progress' || task.status === 'revision_requested') && (
        <Card className="shadow-card border-border/60">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">
              {task.status === 'revision_requested' ? 'Resubmit Work' : 'Submit Work'}
            </h3>
            {task.revisionMessages && task.revisionMessages.length > 0 && (
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                <p className="text-xs font-semibold text-warning-foreground mb-1">Revision Notes:</p>
                {task.revisionMessages.map((m, i) => (
                  <p key={i} className="text-sm text-foreground">• {m}</p>
                ))}
              </div>
            )}
            <Textarea value={submissionMsg} onChange={e => setSubmissionMsg(e.target.value)} placeholder="Describe your submission..." rows={3} />
            <Button onClick={handleSubmit} className="gradient-primary text-primary-foreground">Submit Work</Button>
          </CardContent>
        </Card>
      )}

      {/* Client: Review submission */}
      {isCreator && task.status === 'submitted' && (
        <Card className="shadow-card border-border/60">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Review Submission</h3>
            {task.submissionMessage && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="text-xs font-semibold text-primary mb-1">Submission:</p>
                <p className="text-sm text-foreground">{task.submissionMessage}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button onClick={handleAcceptPay} className="bg-success text-success-foreground hover:opacity-90 flex-1">
                Accept & Pay ${task.budget}
              </Button>
              <div className="flex-1 space-y-2">
                <Textarea value={revisionMsg} onChange={e => setRevisionMsg(e.target.value)} placeholder="What needs changing?" rows={2} />
                <Button onClick={handleRevision} variant="outline" className="w-full border-warning text-warning-foreground hover:bg-warning/10">
                  Request Revision
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Apply (Student role) */}
      {!isCreator && !isWorker && task.status === 'open' && !myApp && currentRole === 'student' && (
        <Card className="shadow-card border-border/60">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-display font-semibold text-foreground">Apply to this Task</h3>
            <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Why are you a good fit?" rows={3} />
            <Button onClick={handleApply} className="gradient-primary text-primary-foreground">Submit Application</Button>
          </CardContent>
        </Card>
      )}

      {myApp && (
        <Card className="shadow-card border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <p className="text-sm font-medium text-foreground">Your Application:</p>
              <ApplicationStatusBadge status={myApp.status} />
            </div>
            <p className="text-sm text-muted-foreground mt-2">{myApp.message}</p>
          </CardContent>
        </Card>
      )}

      {/* Creator: view applicants */}
      {isCreator && task.status === 'open' && (
        <section>
          <h3 className="font-display font-semibold text-foreground mb-3">Applicants ({taskApps.length})</h3>
          {taskApps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No applicants yet.</p>
          ) : (
            <div className="space-y-3">
              {taskApps.map(app => {
                const applicant = getUserById(app.applicantId);
                if (!applicant) return null;
                return (
                  <Card key={app.id} className="shadow-card border-border/60">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Link to={`/profile/${applicant.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                            {applicant.name}
                          </Link>
                          <RatingStars rating={applicant.averageRating} size={12} />
                          <p className="text-sm text-muted-foreground mt-1">{app.message}</p>
                        </div>
                        <Button size="sm" onClick={() => { selectApplicant(task.id, applicant.id); toast.success('Worker selected!'); }}
                          className="gradient-primary text-primary-foreground text-xs">
                          Select
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Rate worker */}
      {isCreator && task.status === 'completed' && !task.rated && (
        <Card className="shadow-card border-border/60">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-display font-semibold text-foreground">Rate the Worker</h3>
            <RatingInput value={ratingScore} onChange={setRatingScore} />
            <Textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} placeholder="Optional comment..." rows={2} />
            <Button onClick={handleRate} className="gradient-primary text-primary-foreground">Submit Rating</Button>
          </CardContent>
        </Card>
      )}

      {/* Recommended workers */}
      {recommended.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-primary" />
            <h3 className="font-display font-semibold text-foreground">Recommended Workers</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {recommended.map(w => <UserCard key={w.id} user={w} />)}
          </div>
        </section>
      )}
    </div>
  );
}
