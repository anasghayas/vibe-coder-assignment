import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  const data = getSearchData(platform);
  return data.accounts.map((item) => {
    const p = item.account.user_profile;
    // Normalize data: some APIs (like YouTube) might omit 'username' but have 'handle'
    return {
      ...p,
      username: p.username || p.handle || p.custom_name || p.user_id || "unknown",
      fullname: p.fullname || p.username || p.handle || "Unknown",
    };
  });
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query) return profiles;
  const lowerQuery = query.toLowerCase();
  return profiles.filter((p) => {
    const matchUsername = p.username.toLowerCase().includes(lowerQuery);
    const matchFullname = p.fullname.toLowerCase().includes(lowerQuery);
    return matchUsername || matchFullname;
  });
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube") return "YouTube";
  return "TikTok";
}
