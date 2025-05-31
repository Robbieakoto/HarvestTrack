import { Leaf } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 py-6 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="block md:hidden" /> {/* Hidden on md and up, sidebar rail takes over */}
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl">HarvestTrack</span>
        </Link>
      </div>
      {/* Add other header items here if needed, e.g., user menu, notifications */}
    </header>
  );
}
