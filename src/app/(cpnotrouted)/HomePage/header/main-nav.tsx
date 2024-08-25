import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components//ui/button';
import JemlaWithTextSS from '@/lib/assets/JemlaWithTextSS';

export default function MainNav() {
  return (
    <div className='hidden md:flex items-center justify-between w-full'>
      {/* Logo */}
      <Link href='/' className='mr-2'>
        <JemlaWithTextSS width='220' />
      </Link>
      
      {/* Navigation Links */}
      <nav className='flex items-center gap-4'>
        <Button variant='ghost' className=' text-lg'><Link href='/categories'>Catégories</Link></Button>
        <Button variant='ghost' className=' text-lg'><Link href='/nouveautes'>Nouveautés</Link></Button>
        <Button variant='ghost' className=' text-lg'><Link href='/a-propos'>À Propos</Link></Button>
        <Button variant='ghost' className=' text-lg'><Link href='/contact'>Contact</Link></Button>
      </nav>
      
      {/* Search Input with Button */}
      <form action='/search' method='get' className='flex items-center mr-2'>
        <Input 
        className=' w-full'
          type='search' 
          name='query'
          placeholder='Rechercher des produits...' 
        />
      </form>
      
      {/* Account Links */}
      <div className='flex items-center gap-2'>
        <Link href='/login'><Button variant='ghost' className=' border-r' type='button'>Connecter</Button></Link>
        <Link href='/register'><Button className='' type='button'>S'inscrire</Button></Link>
      </div>
    </div>
  );
}
