'use client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode, useMemo } from 'react';
import '../globals.css';


import { useSession, SessionProvider } from 'next-auth/react'; // Import SessionProvider
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from '../Providers';
import AdminSidebar from './(components)/AdminSidebar';
import AdminNavbar from './(components)/AdminNavbar';

interface RootLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: RootLayoutProps) {
  const { data: session } = useSession();
  const queryClient = useMemo(() => new QueryClient(), []); 

  return (
    <AuthProvider session={session}> 
      <QueryClientProvider client={queryClient}>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
            <AdminSidebar/>
            <AdminNavbar>
            <main className="flex flex-col gap-4 p-4 lg:gap-6">
              {children}
            </main>
          </AdminNavbar>
          <Toaster />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}
