import Image from 'next/image'
import Link from 'next/link'
import { Search, UserPlus, LogIn, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import JemlaWithTextSS from '@/lib/assets/JemlaWithTextSS'
import MobileNav from './header/mobile-nav'
import { FeaturedProductsCarousel } from './products/carousel'

// Assume this function fetches featured products from the server

export default async function HomePage() {

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <JemlaWithTextSS height='40' width='250' />
          <div className="flex items-center space-x-4">
            <form className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input type="search" placeholder="Rechercher des produits..." className="pl-10 pr-4 py-2 w-64 bg-gray-100 rounded-full transition-all duration-300 focus:w-80" />
              </div>
            </form>
            <Button variant="outline" size="icon" className="hidden md:flex animate-bounce">
              <Link href="/register">
              <UserPlus className="h-5 w-5" />
              <span className="sr-only">S'inscrire</span>
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="hidden md:flex">
              <Link href="/login">
              <LogIn className="h-5 w-5" />
              <span className="sr-only">Se connecter</span>
              </Link>
            </Button>
            <MobileNav/>
          </div>
        </div>
      </header>

      <main>
      <section className="relative flex items-center justify-center overflow-hidden min-h-screen pt-20">
        <div className="relative z-10 text-center px-4 animate-fade-in-up space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-black">
            Révolutionnez Votre<br />Expérience de Gros
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-black">
            Commandes simplifiées, prix compétitifs et variété inégalée, le tout en un seul endroit.
          </p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-100">
            <Link href="/products">Explorez les Produits</Link>
          </Button>
        </div>
      </section>


        <section className="py-20 bg-gray-50">
          <FeaturedProductsCarousel/>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Pourquoi Nous Choisir</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: 'Remises en Gros', description: 'Économisez plus quand vous achetez plus. Notre tarification par paliers garantit les meilleures offres pour votre entreprise.' },
                { title: 'Assurance Qualité', description: 'Chaque produit subit des contrôles de qualité rigoureux pour répondre à nos normes élevées.' },
                { title: 'Expédition Rapide', description: 'Grâce à notre logistique efficace, vos commandes vous parviennent en un temps record.' }
              ].map((feature, index) => (
                <div key={index} className={`border-l-4 border-black pl-6 animate-fade-in animation-delay-${index * 300}`}>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Témoignages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { text: "Produit de grande qualité, service excellent !", author: "Client Satisfait" },
                { text: "Livraison rapide et produits conformes à la description.", author: "Client Heureux" },
                { text: "Je recommande fortement JemlaMa pour vos achats en gros.", author: "Client Fidèle" }
              ].map((testimonial, index) => (
                <div key={index} className={`bg-white p-6 rounded-lg shadow-lg animate-fade-in animation-delay-${index * 300}`}>
                  <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                  <div className="text-gray-700">- {testimonial.author}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-black text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-in">Prêt à Transformer Votre Entreprise ?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-300">Rejoignez des milliers d'entreprises satisfaites qui ont rationalisé leurs achats en gros avec JemlaMa.</p>
            <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black animate-fade-in animation-delay-600">
              <Link href="/register">Commencez Aujourd'hui</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">JemlaMa</h3>
              <p className="text-sm text-gray-300">Votre partenaire de confiance en solutions de gros.</p>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="hover:underline">Produits</Link></li>
                <li><Link href="/about" className="hover:underline">À Propos de Nous</Link></li>
                <li><Link href="/contact" className="hover:underline">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Service Client</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="hover:underline">FAQ</Link></li>
                <li><Link href="/shipping" className="hover:underline">Politique d'Expédition</Link></li>
                <li><Link href="/returns" className="hover:underline">Retours & Remboursements</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Instagram'].map((social) => (
                  <Link key={social} href={`https://${social.toLowerCase()}.com`} className="text-gray-300 hover:text-white">
                    <span className="sr-only">{social}</span>
                    <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            <p>&copy; 2024 JemlaMa. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
