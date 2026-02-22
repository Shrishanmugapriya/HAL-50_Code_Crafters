import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { SKILL_OPTIONS } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RatingStars } from '@/components/RatingStars';
import { SkillTag } from '@/components/SkillTag';
import { ApplicationStatusBadge } from '@/components/StatusBadge';
import { toast } from 'sonner';
import { Briefcase, DollarSign, TrendingUp, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { currentUser, updateProfile, applications, tasks } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [skills, setSkills] = useState(currentUser.skills);

  const toggleSkill = (s: string) => setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSave = () => {
    updateProfile({ name, bio, skills });
    setEditing(false);
    toast.success('Profile updated!');
  };

  const myApps = applications.filter(a => a.applicantId === currentUser.id);

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">My Profile</h1>
        {!editing && (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Edit size={14} className="mr-1.5" />Edit
          </Button>
        )}
      </div>

      <Card className="shadow-card border-border/60">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-xl shrink-0">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-4">
                  <div><Label>Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
                  <div><Label>Bio</Label><Textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="mt-1" /></div>
                  <div>
                    <Label>Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {SKILL_OPTIONS.map(s => (
                        <button type="button" key={s} onClick={() => toggleSkill(s)}>
                          <Badge variant={skills.includes(s) ? 'default' : 'outline'}
                            className={skills.includes(s) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}>
                            {s}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="gradient-primary text-primary-foreground">Save</Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-display font-bold text-xl text-foreground">{currentUser.name}</h2>
                  <p className="text-muted-foreground mt-1">{currentUser.bio}</p>
                  <div className="mt-3"><RatingStars rating={currentUser.averageRating} /></div>
                  <div className="flex flex-wrap gap-1.5 mt-3">{currentUser.skills.map(s => <SkillTag key={s} skill={s} />)}</div>
                  <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Briefcase size={14} />{currentUser.completedTasks} completed</span>
                    <span className="flex items-center gap-1"><DollarSign size={14} />${currentUser.walletBalance} balance</span>
                    <span className="flex items-center gap-1"><TrendingUp size={14} />${currentUser.totalEarnings} earned</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications status */}
      <section>
        <h3 className="font-display font-semibold text-foreground mb-3">My Applications</h3>
        {myApps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No applications yet.</p>
        ) : (
          <div className="space-y-2">
            {myApps.map(app => {
              const task = tasks.find(t => t.id === app.taskId);
              return (
                <Card key={app.id} className="shadow-card border-border/60">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <Link to={`/tasks/${app.taskId}`} className="font-medium text-foreground hover:text-primary transition-colors">
                        {task?.title || 'Unknown Task'}
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{app.message.slice(0, 60)}...</p>
                    </div>
                    <ApplicationStatusBadge status={app.status} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
