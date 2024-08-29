import Link from 'next/link';
import { Input } from '@/components/ui/input';
import JemlaWithTextSS from '@/lib/assets/JemlaWithTextSS';
import { Button } from '@/components/ui/button';
export default function MainNav() {
  return (
    <div className='flex items-center justify-between w-full px-4'>
      {/* Logo - Hidden on md and below */}
      <Link href='/' className='mr-2 hidden md:block'>
        <JemlaWithTextSS width='220' />
      </Link>
      
      {/* Navigation Links - Hidden on md and below */}
      <nav className='hidden md:flex items-center gap-4'>
        <Link href='/categories' className='text-lg'><Button variant='ghost'>Catégories</Button></Link>
        <Link href='/whatsnew' className='text-lg'><Button variant='ghost'>Nouveautés</Button></Link>
        <Link href='/about' className='text-lg'><Button variant='ghost'>À Propos</Button></Link>
        <Link href='/contact' className='text-lg'><Button variant='ghost'>Contact</Button></Link>
      </nav>
      
      {/* Search Input - Always Visible */}
      <form action='/search' method='get' className='flex items-center flex-grow'>
        <Input 
          className='w-full max-w-xs md:max-w-md'
          type='search' 
          name='query'
          placeholder='Rechercher des produits...' 
        />
      </form>
      
      {/* Account Links - Hidden on md and below */}
      <div className='flex items-center gap-2 hidden md:flex'>
        <Link href='/login'><Button variant='ghost' className='border-r' type='button'>Connecter</Button></Link>
        <Link href='/register'><Button type='button'>S'inscrire</Button></Link>
      </div>
    </div>
  );
}
