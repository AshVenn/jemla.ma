'use client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode, useMemo } from 'react';
import '../globals.css';
import SellerDashboardSidebar from './dashboard/(components)/SellerDashboardSidebar';
import SellerDashboardNavbar from './dashboard/(components)/SellerDashboardNavbar';
import { useSession, SessionProvider } from 'next-auth/react'; // Import SessionProvider
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from '../Providers';

interface RootLayoutProps {
  children: ReactNode;
}

export default function VendeurLayout({ children }: RootLayoutProps) {
  const { data: session } = useSession();
  const queryClient = useMemo(() => new QueryClient(), []); 

  return (
    <AuthProvider session={session}> 
      <QueryClientProvider client={queryClient}>
        <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
          <SellerDashboardSidebar />
          <SellerDashboardNavbar>
            <main className="flex flex-col gap-4 p-4 lg:gap-6">
              {children}
            </main>
          </SellerDashboardNavbar>
          <Toaster />
        </div>
      </QueryClientProvider>
    </AuthProvider>
  );
}
