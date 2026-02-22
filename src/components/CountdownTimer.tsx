import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface Props {
  deadline: string;
  startedAt?: string;
}

export function CountdownTimer({ deadline }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(deadline).getTime();
  const diff = target - now;
  const overdue = diff <= 0;

  const abs = Math.abs(diff);
  const days = Math.floor(abs / 86400000);
  const hours = Math.floor((abs % 86400000) / 3600000);
  const mins = Math.floor((abs % 3600000) / 60000);
  const secs = Math.floor((abs % 60000) / 1000);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  parts.push(`${hours}h`);
  parts.push(`${String(mins).padStart(2, '0')}m`);
  parts.push(`${String(secs).padStart(2, '0')}s`);

  return (
    <div className={`flex items-center gap-1.5 text-sm font-mono font-semibold ${overdue ? 'text-destructive' : 'text-foreground'}`}>
      {overdue ? <AlertTriangle size={14} /> : <Clock size={14} />}
      <span>{overdue ? 'OVERDUE ' : ''}{parts.join(' ')}</span>
    </div>
  );
}
