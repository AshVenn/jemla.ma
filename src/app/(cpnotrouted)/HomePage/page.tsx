import { Button } from '@/components/ui/button';
import Header from './header/header';
import Link from 'next/link';
import { FeaturedProductsCarousel } from './products/carousel'; // Adjust the path as needed

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Nav Menu */}
      <header className="bg-white shadow">
        <Header />
      </header>

      {/* Hero Section */}
      <section 
        className="bg-cover bg-center h-96 flex items-center justify-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-animation"></div>
        <div className="relative z-10 container mx-auto text-center">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-white">
            Bienvenue chez JEMLA.MA
          </h1>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-white">
            Votre partenaire de confiance pour des produits de qualité en gros.
          </p>
          <Button type="button" asChild className="mt-8">
            <Link href="#produits" className="px-6 py-3 text-lg rounded-none bg-black text-white hover:bg-gray-700">
              Voir les Produits
            </Link>
          </Button>
        </div>
      </section>

      {/* Featured Products */}
      <section id="produits" className="container mx-auto py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Produits Vedettes</h2>
        <div className="flex justify-center">
          <FeaturedProductsCarousel />
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