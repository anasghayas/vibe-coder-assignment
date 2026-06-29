import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useListStore } from "@/store/useListStore";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export function SelectedListPanel() {
  const { items, removeItem, clearList } = useListStore();

  const handleRemove = (userId: string, username: string) => {
    removeItem(userId);
    toast.info(`Removed @${username} from list`);
  };

  const handleClear = () => {
    clearList();
    toast.info("Cleared the list");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          My List
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Saved Profiles ({items.length})</span>
            {items.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear}
                className="text-muted-foreground hover:text-destructive h-auto py-1 px-2 text-xs"
              >
                Clear all
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        {items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Your list is empty.</p>
            <p className="text-sm">Find influencers and add them to your list!</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="flex flex-col gap-3">
              {items.map(({ profile, platform }) => (
                <div 
                  key={profile.user_id}
                  className="flex items-center gap-3 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.picture} alt={profile.fullname} />
                    <AvatarFallback>{profile.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/profile/${profile.username}?platform=${platform}`}
                      className="font-medium text-sm hover:underline truncate block"
                    >
                      @{profile.username}
                    </Link>
                    <p className="text-xs text-muted-foreground truncate">{profile.fullname}</p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive h-8 w-8"
                    onClick={() => handleRemove(profile.user_id, profile.username)}
                    title="Remove from list"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
