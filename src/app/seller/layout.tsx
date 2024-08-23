'use client'
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode, useMemo } from 'react';
import '../globals.css';
import SellerDashboardSidebar from './dashboard/(components)/SellerDashboardSidebar';
import SellerDashboardNavbar from './dashboard/(components)/SellerDashboardNavbar';
import AuthProvider from '../Providers';
import { useSession } from 'next-auth/react';


interface RootLayoutProps {
  children: ReactNode;
}

export default function VendeurLayout({ children }: RootLayoutProps) {
  const { data: session } = useSession();
  const queryClient = useMemo(() => new QueryClient(), []); // Create QueryClient only once

  return (
    
    <QueryClientProvider client={queryClient}>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <AuthProvider session={session}>
          <SellerDashboardSidebar />
          <SellerDashboardNavbar>
            <main className="flex flex-col gap-4 p-4 lg:gap-6">{children}</main>
            
          </SellerDashboardNavbar>
        </AuthProvider>
      </div>
    </QueryClientProvider>
  );
}
