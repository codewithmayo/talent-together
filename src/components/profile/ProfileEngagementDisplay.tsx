import { Badge } from '@/components/ui/badge';
import { EngagementStats } from './ProfileEngagementStats';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BarChart3 } from 'lucide-react';

interface ProfileEngagementDisplayProps {
  stats?: EngagementStats;
  totalFollowers?: number;
}

export function ProfileEngagementDisplay({ stats, totalFollowers }: ProfileEngagementDisplayProps) {
  if (!stats || stats.hideAnalytics) return null;

  const calculateEngagementRate = () => {
    if (!totalFollowers) return 0;
    
    const avgLikes = stats.likes.reduce((a, b) => a + b, 0) / 3;
    const avgComments = stats.comments.reduce((a, b) => a + b, 0) / 3;
    
    return ((avgLikes + avgComments) / totalFollowers) * 100;
  };

  const getEngagementLevel = (rate: number) => {
    if (rate >= 6) return { level: 'viral', color: 'bg-yellow-500 hover:bg-yellow-600' };
    if (rate >= 3) return { level: 'high', color: 'bg-green-500 hover:bg-green-600' };
    if (rate >= 1) return { level: 'moderate', color: 'bg-blue-500 hover:bg-blue-600' };
    return { level: 'low', color: 'bg-gray-500 hover:bg-gray-600' };
  };

  const avgLikes = stats.likes.reduce((a, b) => a + b, 0) / 3;
  const avgComments = stats.comments.reduce((a, b) => a + b, 0) / 3;
  const engagementRate = calculateEngagementRate();
  const { level, color } = getEngagementLevel(engagementRate);

  return (
    <div className="flex items-center gap-2">
      <BarChart3 className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={color}>
          {engagementRate.toFixed(2)}% Engagement
        </Badge>
        <Badge variant="outline" className={color}>
          {level.charAt(0).toUpperCase() + level.slice(1)} Engagement
        </Badge>
      </div>
    </div>
  );
}
