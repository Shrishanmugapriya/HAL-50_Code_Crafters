import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { TaskCard } from '@/components/TaskCard';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Tasks() {
  const { currentUser, currentRole, tasks, applications } = useApp();

  const openTasks = tasks.filter(t => t.status === 'open');
  const myCreated = tasks.filter(t => t.creatorId === currentUser.id);
  const myAppliedIds = new Set(applications.filter(a => a.applicantId === currentUser.id).map(a => a.taskId));
  const myApplied = tasks.filter(t => myAppliedIds.has(t.id));
  const myInProgress = tasks.filter(
    t => (t.status === 'in_progress' || t.status === 'submitted' || t.status === 'revision_requested') &&
      (t.creatorId === currentUser.id || t.selectedApplicantId === currentUser.id)
  );
  const myCompleted = tasks.filter(
    t => t.status === 'completed' && (t.creatorId === currentUser.id || t.selectedApplicantId === currentUser.id)
  );

  const renderGrid = (list: typeof tasks, empty: string) =>
    list.length > 0 ? (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{list.map(t => <TaskCard key={t.id} task={t} />)}</div>
    ) : (
      <p className="text-muted-foreground text-sm py-8 text-center">{empty}</p>
    );

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-foreground">
          {currentRole === 'client' ? 'My Tasks' : 'Open Tasks'}
        </h1>
        {currentRole === 'client' && (
          <Link
            to="/tasks/create"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
          >
            <Plus size={16} />Create Task
          </Link>
        )}
      </div>

      <Tabs defaultValue={currentRole === 'client' ? 'created' : 'all'}>
        <TabsList className="bg-muted">
          <TabsTrigger value="all">All Open ({openTasks.length})</TabsTrigger>
          {currentRole === 'client' && <TabsTrigger value="created">My Created ({myCreated.length})</TabsTrigger>}
          {currentRole === 'student' && <TabsTrigger value="applied">Applied ({myApplied.length})</TabsTrigger>}
          <TabsTrigger value="progress">In Progress ({myInProgress.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({myCompleted.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderGrid(openTasks, 'No open tasks.')}</TabsContent>
        <TabsContent value="created">{renderGrid(myCreated, 'You haven\'t created any tasks.')}</TabsContent>
        <TabsContent value="applied">{renderGrid(myApplied, 'You haven\'t applied to any tasks.')}</TabsContent>
        <TabsContent value="progress">{renderGrid(myInProgress, 'No tasks in progress.')}</TabsContent>
        <TabsContent value="completed">{renderGrid(myCompleted, 'No completed tasks yet.')}</TabsContent>
      </Tabs>
    </div>
  );
}
