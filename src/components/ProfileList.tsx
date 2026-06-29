import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
}

export function ProfileList({ profiles, platform }: ProfileListProps) {
  return (
    <div className="w-full">
      {profiles.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No profiles found matching your search.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.user_id}
            profile={profile}
            platform={platform}
          />
        ))}
      </div>
    </div>
  );
}

