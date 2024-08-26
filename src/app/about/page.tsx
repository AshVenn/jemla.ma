import React from 'react'

export const metadata = {
    title: "À propos",
    description: "Découvrez Jemla.ma, une plateforme moderne et innovante dédiée aux grossistes au Maroc. Apprenez-en plus sur notre mission de connecter les grossistes avec des clients à travers tout le pays, offrant une expérience de commerce en gros efficace et simplifiée.",
    keywords: "Jemla.ma, grossistes, Maroc, commerce en gros, plateforme B2B, achat en gros, vente en gros",
    author: "Jemla.ma",
    robots: "index, follow",
    openGraph: {
      title: "À propos de Jemla.ma - Votre Plateforme pour les Grossistes au Maroc",
      description: "Jemla.ma est une plateforme dédiée aux grossistes marocains, facilitant les transactions B2B à travers le pays. Notre mission est de rendre le commerce en gros plus accessible et efficace.",
      url: "https://www.jemla.ma/about",
      type: "website",
      images: [
        {
          url: "'/opengraph-image.png'",
          alt: "Jemla.ma - Plateforme pour les grossistes au Maroc",
        },
      ],
    },
  };
  
function About() {
  return (
    <div>About</div>
  )
}

export default About