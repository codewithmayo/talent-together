import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ImagePlus, X, Users } from 'lucide-react';

interface ProfileEngagementStatsProps {
  onStatsChange: (stats: EngagementStats) => void;
  initialStats?: EngagementStats;
  totalFollowers: number;
}

export interface EngagementStats {
  likes: [number, number, number];
  comments: [number, number, number];
  analyticsImage?: string;
  hideAnalytics: boolean;
}

export function ProfileEngagementStats({ onStatsChange, initialStats, totalFollowers }: ProfileEngagementStatsProps) {
  const [stats, setStats] = useState<EngagementStats>({
    likes: initialStats?.likes || [0, 0, 0],
    comments: initialStats?.comments || [0, 0, 0],
    analyticsImage: initialStats?.analyticsImage || '',
    hideAnalytics: initialStats?.hideAnalytics || false
  });

  const [engagementRate, setEngagementRate] = useState(0);
  const [engagementLevel, setEngagementLevel] = useState<'low' | 'moderate' | 'high' | 'viral'>('low');
  const [completionScore, setCompletionScore] = useState(0);

  useEffect(() => {
    if (initialStats) {
      setStats(initialStats);
    }
  }, [initialStats]);

  const calculateEngagementRate = (stats: EngagementStats, followers: number) => {
    if (!followers) return 0;
    
    const avgLikes = stats.likes.reduce((a, b) => a + b, 0) / 3;
    const avgComments = stats.comments.reduce((a, b) => a + b, 0) / 3;
    
    return ((avgLikes + avgComments) / followers) * 100;
  };

  const getEngagementLevel = (rate: number) => {
    if (rate >= 6) return 'viral';
    if (rate >= 3) return 'high';
    if (rate >= 1) return 'moderate';
    return 'low';
  };

  const calculateCompletionScore = () => {
    let score = 0;
    if (totalFollowers > 0) score += 20;
    if (stats.likes.some(l => l > 0)) score += 20;
    if (stats.comments.some(c => c > 0)) score += 20;
    if (stats.analyticsImage) score += 40;
    return score;
  };

  const handleInputChange = (field: string, value: string, index?: number) => {
    const numValue = parseInt(value) || 0;
    
    const newStats = { ...stats };
    if (field === 'likes' && index !== undefined) {
      const newLikes = [...stats.likes] as [number, number, number];
      newLikes[index] = numValue;
      newStats.likes = newLikes;
    } else if (field === 'comments' && index !== undefined) {
      const newComments = [...stats.comments] as [number, number, number];
      newComments[index] = numValue;
      newStats.comments = newComments;
    }

    setStats(newStats);
    onStatsChange(newStats);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newStats = { ...stats, analyticsImage: reader.result as string };
          setStats(newStats);
          onStatsChange(newStats);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  // Update effects whenever stats or totalFollowers change
  useEffect(() => {
    const rate = calculateEngagementRate(stats, totalFollowers);
    setEngagementRate(rate);
    setEngagementLevel(getEngagementLevel(rate));
    setCompletionScore(calculateCompletionScore());
  }, [stats, totalFollowers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-muted-foreground" />
        <div className="text-sm">
          <span className="font-medium">{totalFollowers.toLocaleString()}</span>
          <span className="text-muted-foreground ml-1">total followers</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Number of Likes (Last 3 Posts)</Label>
          <div className="grid grid-cols-3 gap-2 mt-1.5">
            {stats.likes.map((likes, index) => (
              <Input
                key={index}
                type="number"
                min="0"
                value={likes || ''}
                onChange={(e) => handleInputChange('likes', e.target.value, index)}
                placeholder={`Post ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div>
          <Label>Number of Comments (Last 3 Posts)</Label>
          <div className="grid grid-cols-3 gap-2 mt-1.5">
            {stats.comments.map((comments, index) => (
              <Input
                key={index}
                type="number"
                min="0"
                value={comments || ''}
                onChange={(e) => handleInputChange('comments', e.target.value, index)}
                placeholder={`Post ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Engagement Rate</Label>
            <Badge variant={
              engagementLevel === 'viral' ? 'default' :
              engagementLevel === 'high' ? 'default' :
              engagementLevel === 'moderate' ? 'secondary' :
              'outline'
            }>
              {engagementLevel.charAt(0).toUpperCase() + engagementLevel.slice(1)}
            </Badge>
          </div>
          <Progress value={Math.min(engagementRate * 10, 100)} className="h-2" />
          <p className="text-sm text-muted-foreground mt-1">
            {engagementRate.toFixed(2)}% engagement rate
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Profile Completion</Label>
            <Badge variant={completionScore === 100 ? 'default' : 'secondary'}>
              {completionScore}%
            </Badge>
          </div>
          <Progress value={completionScore} className="h-2" />
        </div>

        <div className="space-y-2">
          <Label>Analytics Screenshot</Label>
          <div className="flex items-center gap-4">
            {stats.analyticsImage ? (
              <div className="relative">
                <img
                  src={stats.analyticsImage}
                  alt="Analytics"
                  className="max-w-[200px] h-auto rounded-md"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                  onClick={() => {
                    const newStats = { ...stats, analyticsImage: '' };
                    setStats(newStats);
                    onStatsChange(newStats);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Upload Screenshot
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Upload a screenshot of your analytics dashboard (optional)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="hideAnalytics"
            checked={stats.hideAnalytics}
            onCheckedChange={(checked) => {
              const newStats = { ...stats, hideAnalytics: checked as boolean };
              setStats(newStats);
              onStatsChange(newStats);
            }}
          />
          <Label htmlFor="hideAnalytics" className="text-sm">
            Hide analytics from public profile
          </Label>
        </div>
      </div>
    </div>
  );
}
