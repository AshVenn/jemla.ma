import { AvatarDropdown } from '@/app/(cpnotrouted)/avatarLogout'
import { ModeToggle } from '../../../(cpnotrouted)/mode-toggle'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { LayoutDashboard, Box, ShoppingCart,BarChart3, Settings } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'
import JemlaWithText from '@/lib/assets/JemlaWithText'

function VendeurDashboardNavbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 lg:h-[55px] items-center gap-4 border-b px-3">
        <Dialog>
          <SheetTrigger className="min-[1024px]:hidden p-2 transition">
            <HamburgerMenuIcon />
            <Link href="/seller/dashboard">
              <span className="sr-only">Acceuil</span>
            </Link>
          </SheetTrigger>
          <SheetContent side="left">
          <SheetHeader>
                      <Link href="/seller/dashboard">
                      <SheetTitle>
                        <div className="flex items-center justify-center">
                          <JemlaWithText width="140" height="140" />
                        </div>
                      </SheetTitle>
                    </Link>
            </SheetHeader>
            <div className="flex flex-col space-y-3 mt-[1rem]">
              <DialogClose asChild>
                <Link href="/seller/dashboard">
                  <Button variant="outline" className="w-full">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link href="/seller/products">
                  <Button variant="outline" className="w-full">
                    <Box className="mr-2 h-4 w-4" />
                    Produits
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link href="/seller/orders">
                  <Button variant="outline" className="w-full">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Commandes
                  </Button>
                </Link>
              </DialogClose>
              <DialogClose asChild>
                <Link href="/seller/analytics">
                  <Button variant="outline" className="w-full">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytique
                  </Button>
                </Link>
              </DialogClose>
              <Separator className="my-3" />
              <DialogClose asChild>
                <Link href="/seller/settings">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Button>
                </Link>
              </DialogClose>
            </div>
          </SheetContent>
        </Dialog>
        <div className="flex justify-center items-center gap-2 ml-auto">
          {/* <UserProfile /> */}
          <ModeToggle />
          <AvatarDropdown/>
        </div>
      </header>
      {children}
    </div>
  )
}

export default VendeurDashboardNavbar
