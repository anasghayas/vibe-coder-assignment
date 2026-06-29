import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 w-full">
      <Tabs value={selected} onValueChange={(val) => onChange(val as Platform)} className="w-full sm:w-auto">
        <TabsList className="grid w-full grid-cols-3 sm:w-[400px]">
          {PLATFORMS.map((p) => (
            <TabsTrigger key={p} value={p}>
              {getPlatformLabel(p)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name..."
          className="pl-9 w-full"
        />
      </div>
    </div>
  );
}
