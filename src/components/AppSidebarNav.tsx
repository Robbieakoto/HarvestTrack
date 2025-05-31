'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Leaf, LayoutDashboard, MapPin, FileText, BrainCircuit, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QrScannerModal from '@/components/QrScannerModal';
import React from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tracking', label: 'Geolocation Tracking', icon: MapPin },
  { href: '/reports', label: 'Automated Reports', icon: FileText },
  { href: '/predict', label: 'Predict Delay', icon: BrainCircuit },
];

export default function AppSidebarNav() {
  const pathname = usePathname();
  const [isQrModalOpen, setIsQrModalOpen] = React.useState(false);

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon" className="hidden md:block">
        <SidebarHeader className="p-4 justify-center items-center flex-col">
            {/* Header content if any, like logo for collapsed state, handled by AppHeader now.
                Can add a smaller logo here specifically for the sidebar if needed when expanded.
             */}
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, side: 'right', align: 'center' }}
                  >
                    <a>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="default" className="w-full group-data-[collapsible=icon]:hidden" onClick={() => setIsQrModalOpen(true)}>
            <ScanLine className="mr-2 h-4 w-4" />
            Scan QR Code
          </Button>
           <Button variant="default" size="icon" className="w-full hidden group-data-[collapsible=icon]:flex justify-center" onClick={() => setIsQrModalOpen(true)} aria-label="Scan QR Code">
            <ScanLine className="h-5 w-5" />
          </Button>
        </SidebarFooter>
      </Sidebar>
      {/* Mobile navigation is typically handled by a sheet triggered by SidebarTrigger in AppHeader */}
      {/* However, if we want a persistent mobile sheet triggered from elsewhere, or a different mobile nav: */}
      <div className="md:hidden"> {/* Placeholder for potential mobile-specific nav elements if sidebar sheet is not enough */}
         {/* The existing sidebar component handles mobile via a Sheet. SidebarTrigger in AppHeader manages this. */}
      </div>
      <QrScannerModal isOpen={isQrModalOpen} onOpenChange={setIsQrModalOpen} />
    </>
  );
}
