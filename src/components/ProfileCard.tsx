import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatFollowers } from "@/utils/formatters";
import { useToggleList } from "@/hooks/useToggleList";
import { Button } from "@/components/ui/button";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export function ProfileCard({ profile, platform }: ProfileCardProps) {
  const navigate = useNavigate();
  const { toggleList, isInList } = useToggleList();
  const inList = isInList(profile.user_id);

  const handleClick = () => {
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleToggleList = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleList(profile, platform);
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 border border-gray-300 mb-2 cursor-pointer hover:bg-gray-50 w-full max-w-2xl"
    >
      <img src={profile.picture} className="w-12 h-12 rounded-full" alt={`${profile.fullname} profile picture`} />
      <div className="text-left flex-1">
        <div className="font-bold">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-gray-600">{profile.fullname}</div>
        <div className="text-sm">{formatFollowers(profile.followers)} followers</div>
      </div>
      <Button
        variant={inList ? "outline" : "default"}
        size="sm"
        onClick={handleToggleList}
      >
        {inList ? "Added ✓" : "Add to List"}
      </Button>
    </div>
  );
}
