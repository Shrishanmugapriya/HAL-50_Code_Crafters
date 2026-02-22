import { Task, User, Gig } from '@/types';

export function scoreTaskForWorker(task: Task, worker: User): number {
  let score = 0;
  const matchingSkills = task.requiredSkills.filter(s => worker.skills.includes(s));
  score += matchingSkills.length * 30;
  if (task.urgent) score += 20;
  score += Math.min(task.budget / 10, 25);
  const daysSinceCreated = Math.max(1, (Date.now() - new Date(task.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  score += Math.max(0, 25 - daysSinceCreated * 2);
  return score;
}

export function scoreWorkerForTask(task: Task, worker: User): number {
  let score = 0;
  const matchingSkills = task.requiredSkills.filter(s => worker.skills.includes(s));
  score += matchingSkills.length * 30;
  score += worker.averageRating * 8;
  score += Math.min(worker.completedTasks * 3, 20);
  return score;
}

export function scoreGigForClient(gig: Gig, client: User, seller: User): number {
  let score = 0;
  // Skill match with client's interests (use tags)
  const matchingTags = gig.tags.filter(t => client.skills.includes(t));
  score += matchingTags.length * 20;
  // Higher rating
  score += seller.averageRating * 10;
  // Faster delivery
  score += Math.max(0, 20 - (gig.deliveryDays || 7) * 2);
  // Lower price preference
  score += Math.max(0, 30 - gig.startingPrice / 10);
  return score;
}

export function getRecommendedTasks(tasks: Task[], worker: User, limit = 5): Task[] {
  return tasks
    .filter(t => t.status === 'open' && t.creatorId !== worker.id)
    .map(t => ({ task: t, score: scoreTaskForWorker(t, worker) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.task);
}

export function getRecommendedWorkers(task: Task, users: User[], limit = 5): User[] {
  return users
    .filter(u => u.id !== task.creatorId)
    .map(u => ({ user: u, score: scoreWorkerForTask(task, u) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.user);
}

export function getRecommendedGigs(gigs: Gig[], users: User[], client: User, limit = 5): Gig[] {
  return gigs
    .filter(g => g.userId !== client.id)
    .map(g => {
      const seller = users.find(u => u.id === g.userId);
      return { gig: g, score: seller ? scoreGigForClient(g, client, seller) : 0 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.gig);
}
