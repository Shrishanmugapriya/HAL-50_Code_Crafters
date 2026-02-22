import { useApp } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';

export default function WalletPage() {
  const { currentUser, transactions, getUserById } = useApp();

  const myTxs = transactions.filter(
    t => (t.fromUserId === currentUser.id && t.type === 'payment') ||
         (t.toUserId === currentUser.id && t.type === 'earning')
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const stats = [
    { label: 'Balance', value: `$${currentUser.walletBalance}`, icon: DollarSign, color: 'text-primary' },
    { label: 'Total Earnings', value: `$${currentUser.totalEarnings}`, icon: TrendingUp, color: 'text-success' },
    { label: 'Total Spent', value: `$${currentUser.totalSpent}`, icon: TrendingDown, color: 'text-destructive' },
  ];

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-display font-bold text-foreground">Wallet</h1>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(s => (
          <Card key={s.label} className="shadow-card border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={s.color}><s.icon size={22} /></div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className="text-xl font-display font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section>
        <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
          <ArrowRightLeft size={16} />Transaction History
        </h3>
        {myTxs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">No transactions yet.</p>
        ) : (
          <div className="space-y-2">
            {myTxs.map(tx => {
              const isEarning = tx.toUserId === currentUser.id && tx.type === 'earning';
              const otherUser = getUserById(isEarning ? tx.fromUserId : tx.toUserId);
              return (
                <Card key={tx.id} className="shadow-card border-border/60">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {isEarning ? 'Earned from' : 'Paid to'} {otherUser?.name || 'Unknown'}
                      </p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`font-display font-bold text-lg ${isEarning ? 'text-success' : 'text-destructive'}`}>
                      {isEarning ? '+' : '-'}${tx.amount}
                    </span>
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
