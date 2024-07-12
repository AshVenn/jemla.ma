'use client'
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactNode } from 'react';
import '../globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import VendeurDashboardSidebard from './dashboard/{components}/VendeurDashboardSidebard';
import VendeurDashboardNavbar from './dashboard/{components}/VendeurDashboardNavbar';
import AuthProvider from '../Providers';

interface RootLayoutProps {
  children: ReactNode;
}

// Initialize a new QueryClient
const queryClient = new QueryClient();

export default function VendeurLayout({ children }: RootLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <AuthProvider>
          <VendeurDashboardSidebard />
          <VendeurDashboardNavbar>
            <main className="flex flex-col gap-4 p-4 lg:gap-6">{children}</main>
          </VendeurDashboardNavbar>
        </AuthProvider>
      </div>
    </QueryClientProvider>
  );
}
