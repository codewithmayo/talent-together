import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EyeOff } from "lucide-react";

interface ProfileVisibilityBannerProps {
  isPublic?: boolean;
  isDashboard?: boolean;
}

export function ProfileVisibilityBanner({ isPublic, isDashboard = false }: ProfileVisibilityBannerProps) {
  const navigate = useNavigate();

  // Return null if isPublic is true OR if it's undefined (to prevent showing the banner by default)
  if (isPublic || isPublic === undefined) return null;

  return (
    <Alert className="mb-6">
      <EyeOff className="h-4 w-4" />
      <AlertTitle>Private Profile</AlertTitle>
      <AlertDescription className="flex items-center gap-4">
        {isDashboard ? (
          <>
            Your profile is currently hidden. Click Make Public to start getting discovered!
            <Button variant="outline" size="sm" onClick={() => navigate('/profile-edit')}>
              Make Public
            </Button>
          </>
        ) : (
          "Your profile is private. Other users won't be able to find you until you publish it."
        )}
      </AlertDescription>
    </Alert>
  );
}
