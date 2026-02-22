import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Notifications() {
  const { currentUser, notifications, markNotificationRead } = useApp();
  const myNotifs = notifications.filter(n => n.userId === currentUser.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
        <Bell size={22} /> Notifications
      </h1>
      {myNotifs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">No notifications yet.</p>
      ) : (
        <div className="space-y-2">
          {myNotifs.map(n => (
            <Card key={n.id} className={`shadow-card border-border/60 ${!n.read ? 'bg-primary/5 border-primary/20' : ''}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1">
                  {n.link ? (
                    <Link to={n.link} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                      {n.message}
                    </Link>
                  ) : (
                    <p className="text-sm font-medium text-foreground">{n.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-0.5">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
                {!n.read && (
                  <Button size="sm" variant="ghost" onClick={() => markNotificationRead(n.id)} className="text-xs">
                    <Check size={14} />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
