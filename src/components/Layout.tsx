import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SelectedListPanel } from "./SelectedListPanel";
import { Search } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8 mx-auto">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Search className="h-5 w-5" />
              </div>
              <span className="hidden sm:inline-block text-xl">InfluencerSearch</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <SelectedListPanel />
          </div>
        </div>
      </header>
      
      <main className="container max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        {title && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
