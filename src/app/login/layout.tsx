'use client';
import { ReactNode, useMemo } from 'react';
import AuthProvider from '../Providers';

interface RootLayoutProps {
  children: ReactNode;
}

export default function LoginLayout({ children }: RootLayoutProps) {
  return (
  
        <AuthProvider session={null}>
            <main>
              {children}
            </main>
        </AuthProvider>
  );
}
