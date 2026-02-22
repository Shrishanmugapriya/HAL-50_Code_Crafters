import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { GIG_CATEGORIES, SKILL_OPTIONS } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function CreateGig() {
  const { createGig } = useApp();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const toggleTag = (t: string) => setTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description || !price || !deliveryDays) { toast.error('Fill all fields'); return; }
    createGig({ category, description, startingPrice: Number(price), tags, deliveryDays: Number(deliveryDays) });
    toast.success('Gig posted!');
    navigate('/my-gigs');
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Post a Gig</h1>
      <Card className="shadow-card border-border/60">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {GIG_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What do you offer?" rows={4} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Starting Price ($)</Label>
                <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="50" className="mt-1.5" />
              </div>
              <div>
                <Label>Delivery Time (days)</Label>
                <Input type="number" value={deliveryDays} onChange={e => setDeliveryDays(e.target.value)} placeholder="7" className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {SKILL_OPTIONS.map(s => (
                  <button type="button" key={s} onClick={() => toggleTag(s)}>
                    <Badge variant={tags.includes(s) ? 'default' : 'outline'}
                      className={tags.includes(s) ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}>
                      {s}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">Post Gig</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
