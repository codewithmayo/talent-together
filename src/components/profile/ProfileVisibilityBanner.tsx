import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EyeOff } from "lucide-react";

interface ProfileVisibilityBannerProps {
  isPublic?: boolean;
  isDashboard?: boolean;
  underReview?: boolean;
  rejectionReason?: string;
}

export function ProfileVisibilityBanner({
  isPublic,
  isDashboard = false,
  underReview = false,
  rejectionReason,
}: ProfileVisibilityBannerProps) {
  const navigate = useNavigate();

  const shouldShowBanner = underReview || rejectionReason || isPublic === false;

  if (!shouldShowBanner) return null;

  return (
    <Alert className="mb-6">
      <EyeOff className="h-4 w-4" />
      <AlertTitle>
        {underReview
          ? "Profile Under Review"
          : rejectionReason
            ? "Profile Rejected"
            : "Private Profile"}
      </AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {isDashboard ? (
          underReview ? (
            <>
              Your profile is currently under review. We'll notify you once it's
              approved.
            </>
          ) : rejectionReason ? (
            <>
              <div>
                Your profile was rejected because of incomplete information.
                Please update your profile and submit it for review again.
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile-edit")}
              >
                Edit Profile
              </Button>
            </>
          ) : (
            <>
              Your profile is currently hidden. Click Make Public to start
              getting discovered!
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile-edit")}
              >
                Make Public
              </Button>
            </>
          )
        ) : underReview ? (
          "This profile is currently under review and will be available once approved."
        ) : rejectionReason ? (
          <>
            <div>
              Your profile was rejected because of incomplete information.
              Please update your profile and submit it for review again.
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/profile-edit")}
              className="mt-2"
            >
              Edit Profile
            </Button>
          </>
        ) : (
          "This profile is private. It will only be visible to others when made public."
        )}
      </AlertDescription>
    </Alert>
  );
}
