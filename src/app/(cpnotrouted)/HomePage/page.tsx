import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Header from './header';
import Link from 'next/link';



export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Nav Menu */}
      <header className="bg-white shadow">
             <Header/>
      </header>

      {/* Hero Section */}
      <section className="bg-cover bg-center h-96" style={{ backgroundImage: "url('/hero-bg.jpg')" }}>
        <div className="container mx-auto flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Bienvenue chez JEMLA.MA</h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">Votre partenaire de confiance pour des produits de qualité en gros.</p>
            <Button type="button" asChild className="mt-8">
            <Link href="#produits" className="px-6 py-3 text-lg rounded-none">
              Voir les Produits
            </Link>
          </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="produits" className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Produits Vedettes</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image src="/product1.jpg" alt="Produit 1" width={500} height={300} className="rounded-md"/>
            <h3 className="mt-4 text-xl font-semibold">Produit 1</h3>
            <p className="mt-2 text-gray-600">Description du produit 1...</p>
            <Button asChild className="mt-4">
              <a href="#" className="px-4 py-2">
                Acheter
              </a>
            </Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image src="/product2.jpg" alt="Produit 2" width={500} height={300} className="rounded-md"/>
            <h3 className="mt-4 text-xl font-semibold">Produit 2</h3>
            <p className="mt-2 text-gray-600">Description du produit 2...</p>
            <Button asChild className="mt-4">
              <a href="#" className="px-4 py-2">
                Acheter
              </a>
            </Button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Image src="/product3.jpg" alt="Produit 3" width={500} height={300} className="rounded-md"/>
            <h3 className="mt-4 text-xl font-semibold">Produit 3</h3>
            <p className="mt-2 text-gray-600">Description du produit 3...</p>
            <Button asChild className="mt-4">
              <a href="#" className="px-4 py-2">
                Acheter
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Témoignages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600">"Produit de grande qualité, service excellent !"</p>
              <div className="mt-4 text-gray-700">- Client Satisfait</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600">"Livraison rapide et produits conformes à la description."</p>
              <div className="mt-4 text-gray-700">- Client Heureux</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600">"Je recommande fortement NomDuSite pour vos achats en gros."</p>
              <div className="mt-4 text-gray-700">- Client Fidèle</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 JemlaMa. Tous droits réservés.</p>
          <p>Suivez-nous sur les réseaux sociaux :</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-gray-400">Facebook</a>
            <a href="#" className="hover:text-gray-400">Twitter</a>
            <a href="#" className="hover:text-gray-400">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
