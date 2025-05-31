
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppHeader from '@/components/AppHeader';
import AppSidebarNav from '@/components/AppSidebarNav';
import { SidebarInset } from '@/components/ui/sidebar';
import { AuthProvider } from '@/context/AuthContext';
import PrivateRoute from '@/components/auth/PrivateRoute';

export const metadata: Metadata = {
  title: 'HarvestTrack',
  description: 'Monitor your produce supply chain in real-time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <AuthProvider>
          <PrivateRoute>
            <SidebarProvider defaultOpen={true} collapsible="icon">
              <div className="flex min-h-screen w-full flex-col">
                <AppHeader />
                <div className="flex flex-1">
                  <AppSidebarNav />
                  <SidebarInset className="flex-1 overflow-y-auto p-4 pt-2 md:p-6 md:pt-4 lg:p-8 lg:pt-6">
                    {children}
                  </SidebarInset>
                </div>
              </div>
            </SidebarProvider>
            <Toaster />
          </PrivateRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
