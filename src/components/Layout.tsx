import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SelectedListPanel } from "./SelectedListPanel";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  return (
    <div className="p-4 min-h-screen">
      <header className="mb-6 border-b pb-4 flex justify-between items-start">
        <div>
          <Link to="/" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Influencer Search
          </Link>
          {title && <h1 className="text-2xl mt-2">{title}</h1>}
        </div>
        <SelectedListPanel />
      </header>
      <main>{children}</main>
    </div>
  );
}
