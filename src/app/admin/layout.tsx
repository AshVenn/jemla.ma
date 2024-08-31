'use client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode, useMemo } from 'react';
import '../globals.css';

import { useSession, SessionProvider } from 'next-auth/react'; // Import SessionProvider
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from '../Providers';
import AdminSidebar from './(components)/AdminSidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import AdminNavBar from './(components)/AdminNavbar';

interface RootLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: RootLayoutProps) {
  const { data: session } = useSession();
  const queryClient = useMemo(() => new QueryClient(), []); 

  return (
    <AuthProvider session={session}> 
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="flex min-h-screen">
            <AdminSidebar/>
            <div className="flex-1">
              <AdminNavBar>
                <main className="flex justify-center">
                  {children}
                </main>
              </AdminNavBar>
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
