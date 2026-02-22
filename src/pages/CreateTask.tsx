import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { SKILL_OPTIONS } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CreateTask() {
  const { createTask } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [urgent, setUrgent] = useState(false);

  const toggleSkill = (s: string) =>
    setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || skills.length === 0 || !budget || !deadline) {
      toast.error('Please fill all fields');
      return;
    }
    createTask({ title, description, requiredSkills: skills, budget: Number(budget), deadline, urgent });
    toast.success('Task created!');
    navigate('/tasks');
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Create a Task</h1>
      <Card className="shadow-card border-border/60">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Build a landing page" className="mt-1.5" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what you need..." rows={4} className="mt-1.5" />
            </div>
            <div>
              <Label>Required Skills</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {SKILL_OPTIONS.map(s => (
                  <button type="button" key={s} onClick={() => toggleSkill(s)}>
                    <Badge variant={skills.includes(s) ? 'default' : 'outline'}
                      className={skills.includes(s) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}>
                      {s}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Budget ($)</Label>
                <Input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="100" className="mt-1.5" />
              </div>
              <div>
                <Label>Deadline</Label>
                <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={urgent} onCheckedChange={setUrgent} />
              <Label>Mark as Urgent</Label>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">
              Post Task
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
