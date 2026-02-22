import { useApp } from '@/contexts/AppContext';
import { OrderCard } from '@/components/OrderCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Orders() {
  const { currentUser, currentRole, orders } = useApp();

  const isClient = currentRole === 'client';
  const myOrders = orders.filter(o => isClient ? o.clientId === currentUser.id : o.studentId === currentUser.id);

  const pending = myOrders.filter(o => o.status === 'pending');
  const active = myOrders.filter(o => o.status === 'in_progress' || o.status === 'revision_requested');
  const submitted = myOrders.filter(o => o.status === 'submitted');
  const completed = myOrders.filter(o => o.status === 'completed');
  const rejected = myOrders.filter(o => o.status === 'rejected');

  const renderGrid = (list: typeof myOrders, empty: string) =>
    list.length > 0 ? (
      <div className="grid md:grid-cols-2 gap-4">{list.map(o => <OrderCard key={o.id} order={o} />)}</div>
    ) : (
      <p className="text-muted-foreground text-sm py-8 text-center">{empty}</p>
    );

  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="text-2xl font-display font-bold text-foreground">
        {isClient ? 'My Orders' : 'Incoming Orders'}
      </h1>

      <Tabs defaultValue="pending">
        <TabsList className="bg-muted">
          <TabsTrigger value="pending">{isClient ? 'Placed' : 'Incoming'} ({pending.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({active.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submitted.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">{renderGrid(pending, 'No pending orders.')}</TabsContent>
        <TabsContent value="active">{renderGrid(active, 'No active orders.')}</TabsContent>
        <TabsContent value="submitted">{renderGrid(submitted, 'No submitted orders.')}</TabsContent>
        <TabsContent value="completed">{renderGrid(completed, 'No completed orders.')}</TabsContent>
      </Tabs>
    </div>
  );
}
