import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, Platform, ProfileDetailResponse } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useToggleList } from "@/hooks/useToggleList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, Users, Heart, MessageCircle, Activity } from "lucide-react";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platformParam = searchParams.get("platform");
  const platform: Platform =
    platformParam === "youtube" || platformParam === "tiktok"
      ? platformParam
      : "instagram";
  const { toggleList, isInList } = useToggleList();
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <p>Invalid profile</p>
        <Link to="/">Back</Link>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-muted-foreground">Loading profile...</p>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <p className="text-destructive mb-4">
          Could not load profile details for {username}
        </p>
        <Button variant="outline" asChild>
          <Link to="/">Back to search</Link>
        </Button>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Link>
        </Button>

        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent w-full" />
          
          <CardContent className="px-6 sm:px-10 pb-10 relative">
            <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 mb-8">
              <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                <AvatarImage src={user.picture} alt={user.fullname} />
                <AvatarFallback className="text-4xl">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold tracking-tight">{user.fullname}</h1>
                  <Badge variant="secondary" className="capitalize">{platform}</Badge>
                </div>
                <div className="flex items-center gap-2 text-lg text-muted-foreground">
                  @{user.username}
                  <VerifiedBadge verified={user.is_verified} />
                </div>
              </div>

              <div className="pb-2">
                <Button
                  variant={isInList(user.user_id) ? "outline" : "default"}
                  size="lg"
                  onClick={() => toggleList(user, platform)}
                  className="w-full sm:w-auto"
                >
                  {isInList(user.user_id) ? "Added ✓" : "Add to List"}
                </Button>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Followers</span>
                </div>
                <p className="text-2xl font-bold">{formatFollowersDetail(user.followers)}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">Likes</span>
                </div>
                <p className="text-2xl font-bold">{formatFollowersDetail(user.avg_likes || 0)}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Comments</span>
                </div>
                <p className="text-2xl font-bold">{formatFollowersDetail(user.avg_comments || 0)}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Engagement</span>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {formatEngagementRate(user.engagement_rate)}
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">About</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {user.description || "No bio available."}
              </p>
              
            </div>
            
            {user.url && (
              <Button variant="outline" asChild className="mt-8 w-full sm:w-auto">
                <a href={user.url} target="_blank" rel="noopener noreferrer">
                  View Profile on {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
