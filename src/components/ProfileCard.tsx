import { memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { formatFollowers } from "@/utils/formatters";
import { useToggleList } from "@/hooks/useToggleList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
}

export const ProfileCard = memo(function ProfileCard({ profile, platform }: ProfileCardProps) {
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
    <Card 
      onClick={handleClick}
      className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group overflow-hidden"
    >
      <CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-primary/20 transition-colors">
          <AvatarImage src={profile.picture} alt={profile.fullname} />
          <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 font-semibold text-lg truncate">
            @{profile.username}
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <div className="text-sm text-muted-foreground truncate">{profile.fullname}</div>
          <div className="text-sm font-medium mt-1">{formatFollowers(profile.followers)} followers</div>
        </div>
        
        <Button
          variant={inList ? "secondary" : "default"}
          size="sm"
          onClick={handleToggleList}
          className="shrink-0"
        >
          {inList ? "Added ✓" : "Add to List"}
        </Button>
      </CardContent>
    </Card>
  );
});
