import {
  Sheet,
  SheetHeader,
  SheetContent,
  SheetDescription,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import JemlaWithText from '@/lib/assets/JemlaWithTextSS';
import Link from 'next/link';
import { BiSolidCategory } from "react-icons/bi";
import { Menu, UserPlus, LogIn, Flame, Info, MailQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MobileNav() {
  return (
    <div className='md:hidden'>
      <Sheet>
        <SheetTrigger className='p-2 hover:bg-gray-100 focus:outline-none transition duration-200'>
          <Menu className='text-2xl' />
        </SheetTrigger>
        <SheetContent 
          side="left" 
          className='bg-white text-black transition-transform transform-gpu duration-500 ease-out'
        >
          <SheetHeader>
            <SheetTitle>
              <div className='flex justify-center'>
                <Link href='/'>
                  <JemlaWithText width='200' height='50' />
                </Link>
              </div>
            </SheetTitle>
            <SheetDescription>
              Explorez les fonctionnalités de Jemla.ma et gérez votre activité en toute simplicité.
            </SheetDescription>
          </SheetHeader>
          <nav className='flex flex-col gap-4 mt-6 text-lg'>
            <Link 
              href='/categories' 
              className='flex items-center gap-2 transform transition-transform duration-300 ease-out hover:translate-x-2'
            >
              <BiSolidCategory /> Catégories
            </Link>
            <Separator />
            <Link 
              href='/whatsnew' 
              className='flex items-center gap-2 transform transition-transform duration-300 ease-out hover:translate-x-2'
            >
              <Flame /> Nouveautés
            </Link>
            <Separator />
            <Link 
              href='/about' 
              className='flex items-center gap-2 transform transition-transform duration-300 ease-out hover:translate-x-2'
            >
              <Info /> À Propos
            </Link>
            <Separator />
            <Link 
              href='/contact' 
              className='flex items-center gap-2 transform transition-transform duration-300 ease-out hover:translate-x-2'
            >
              <MailQuestion /> Contact
            </Link>
            <Separator />
            <div className='flex justify-between'>
              <Link href='/login'>
                <Button variant='ghost' type='button' className='text-lg border-b'>
                  <LogIn />
                  Connecter
                </Button>
              </Link>
              <Link href='/register'>
                <Button 
                  type='button' 
                  className='text-lg text-white hover:bg-white hover:text-primary border-b border-white hover:border-primary transition-colors duration-300'
                >
                  <UserPlus/>
                  S'inscrire
                </Button>
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
