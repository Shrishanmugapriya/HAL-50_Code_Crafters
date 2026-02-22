import { useApp } from '@/contexts/AppContext';
import { GigCard } from '@/components/GigCard';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function MyGigs() {
  const { currentUser, gigs } = useApp();
  const myGigs = gigs.filter(g => g.userId === currentUser.id);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">My Gigs</h1>
        <Link
          to="/gigs/create"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />Post a Gig
        </Link>
      </div>
      {myGigs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myGigs.map(g => <GigCard key={g.id} gig={g} />)}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm py-8 text-center">You haven't posted any gigs yet.</p>
      )}
    </div>
  );
}
