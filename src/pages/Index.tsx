import { useApp } from '@/contexts/AppContext';
import ClientDashboard from './ClientDashboard';
import StudentDashboard from './StudentDashboard';

const Index = () => {
  const { currentRole } = useApp();
  return currentRole === 'client' ? <ClientDashboard /> : <StudentDashboard />;
};

export default Index;
