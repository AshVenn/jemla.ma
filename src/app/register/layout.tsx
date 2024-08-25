'use client';
import { ReactNode } from 'react';
import AuthProvider from '../Providers';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RegisterLayout({ children }: RootLayoutProps) {
  return (

      <AuthProvider session={null}>
        <main>
          {children}
        </main>
      </AuthProvider>

  );
}
