import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SkillTag } from '@/components/SkillTag';
import { RatingStars } from '@/components/RatingStars';
import { DollarSign, User, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function GigDetail() {
  const { id } = useParams<{ id: string }>();
  const { currentUser, currentRole, gigs, getUserById, placeOrder } = useApp();
  const navigate = useNavigate();
  const gig = gigs.find(g => g.id === id);

  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');

  if (!gig) return <p className="text-muted-foreground p-8 text-center">Gig not found.</p>;

  const seller = getUserById(gig.userId);
  const isOwner = gig.userId === currentUser.id;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !budget || !deadline) { toast.error('Fill all fields'); return; }
    placeOrder(gig.id, description, Number(budget), deadline);
    toast.success('Order placed!');
    navigate('/orders');
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold text-foreground">Gig Details</h1>

      <Card className="shadow-card border-border/60">
        <CardContent className="p-6 space-y-4">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">{gig.category}</span>
          <p className="text-foreground">{gig.description}</p>
          <div className="flex flex-wrap gap-1.5">{gig.tags.map(t => <SkillTag key={t} skill={t} />)}</div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold text-foreground"><DollarSign size={14} className="text-primary" />From ${gig.startingPrice}</span>
            <span className="flex items-center gap-1"><Clock size={14} />{gig.deliveryDays} day delivery</span>
          </div>
          {seller && (
            <div className="pt-3 border-t border-border">
              <Link to={`/profile/${seller.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
                  {seller.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{seller.name}</p>
                  <RatingStars rating={seller.averageRating} size={12} />
                </div>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Place Order (Client only, not own gig) */}
      {!isOwner && currentRole === 'client' && (
        <Card className="shadow-card border-border/60">
          <CardContent className="p-6">
            <h3 className="font-display font-semibold text-foreground mb-4">Place an Order</h3>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <Label>What do you need?</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your requirements..." rows={3} className="mt-1.5" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Budget ($)</Label>
                  <Input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder={String(gig.startingPrice)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold">
                Place Order
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
