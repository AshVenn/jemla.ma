import '../globals.css'
import { Inter as FontSans } from "next/font/google"

import { cn } from "@/lib/utils"
import VendeurDashboardSidebard from "./dashboard/{components}/VendeurDashboardSidebard";
import VendeurDashboardNavbar from './dashboard/{components}/VendeurDashboardNavbar';


interface RootLayoutProps {
  children: React.ReactNode;
}

export default function VendeurLayout({ children }: RootLayoutProps) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
        <VendeurDashboardSidebard/>
        <VendeurDashboardNavbar>
        <main className='flex flex-col gap-4 p-4 lg:gap-6'>
            {children}
        </main>
        </VendeurDashboardNavbar>
    </div>
  )
}
