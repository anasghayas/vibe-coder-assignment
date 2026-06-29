import { toast } from "sonner";
import { useListStore } from "@/store/useListStore";
import type { Platform, UserProfileSummary } from "@/types";

export function useToggleList() {
  const { addItem, removeItem, isInList } = useListStore();

  const toggleList = (profile: UserProfileSummary, platform: Platform) => {
    if (isInList(profile.user_id)) {
      removeItem(profile.user_id);
      toast.info(`Removed @${profile.username} from list`);
    } else {
      const added = addItem(profile, platform);
      if (added) {
        toast.success(`Added @${profile.username} to list`);
      } else {
        toast.warning(`@${profile.username} is already in the list`);
      }
    }
  };

  return { toggleList, isInList };
}
