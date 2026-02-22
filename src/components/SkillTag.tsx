import { Badge } from '@/components/ui/badge';

export function SkillTag({ skill }: { skill: string }) {
  return (
    <Badge variant="secondary" className="bg-accent text-accent-foreground font-medium text-xs px-2.5 py-0.5">
      {skill}
    </Badge>
  );
}
