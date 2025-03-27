import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EngagementStats } from './ProfileEngagementStats';

interface ProfileAnalyticsProps {
  stats?: EngagementStats;
  totalFollowers?: number;
}

export function ProfileAnalytics({ stats, totalFollowers }: ProfileAnalyticsProps) {
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
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-medium mb-4">Analytics</h3>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border">
              <h4 className="text-sm font-medium mb-2">Average Likes</h4>
              <p className="text-2xl font-semibold">{avgLikes.toFixed(0)}</p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="text-sm font-medium mb-2">Average Comments</h4>
              <p className="text-2xl font-semibold">{avgComments.toFixed(0)}</p>
            </div>
          </div>

          {stats.analyticsImage && (
            <div>
              <h4 className="text-sm font-medium mb-2">Analytics Screenshot</h4>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="cursor-pointer">
                    <img
                      src={stats.analyticsImage}
                      alt="Analytics Screenshot"
                      className="w-96 h-auto rounded-lg border hover:opacity-90 transition-opacity"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <img
                    src={stats.analyticsImage}
                    alt="Analytics Screenshot"
                    className="w-full rounded-lg"
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
