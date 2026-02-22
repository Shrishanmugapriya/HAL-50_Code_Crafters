import { useApp } from '@/contexts/AppContext';
import { GigCard } from '@/components/GigCard';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { GIG_CATEGORIES } from '@/types';
import { Badge } from '@/components/ui/badge';

export default function Gigs() {
  const { gigs, currentRole } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filtered = gigs.filter(g => {
    if (search && !g.description.toLowerCase().includes(search.toLowerCase()) && !g.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
    if (selectedCategory && g.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">Gig Marketplace</h1>
        {currentRole === 'student' && (
          <Link
            to="/gigs/create"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />Post a Gig
          </Link>
        )}
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gigs..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelectedCategory('')}>
            <Badge variant={!selectedCategory ? 'default' : 'outline'} className={!selectedCategory ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}>All</Badge>
          </button>
          {GIG_CATEGORIES.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c === selectedCategory ? '' : c)}>
              <Badge variant={selectedCategory === c ? 'default' : 'outline'} className={selectedCategory === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}>
                {c}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(g => <GigCard key={g.id} gig={g} />)}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm py-8 text-center">No gigs found.</p>
      )}
    </div>
  );
}
