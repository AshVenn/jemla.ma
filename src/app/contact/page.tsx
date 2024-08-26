export const metadata = {
    title: 'Contactez-nous - Jemla.ma',
    description: "Vous avez des questions ou besoin d'assistance ? Contactez l'équipe de Jemla.ma, votre plateforme dédiée aux grossistes au Maroc. Nous sommes ici pour vous aider à optimiser votre commerce en gros.",
    openGraph: {
      title: 'Contactez-nous - Jemla.ma',
      description: "Pour toute question ou assistance, contactez-nous via Jemla.ma. Notre équipe est disponible pour vous aider à gérer et développer votre activité de grossiste au Maroc.",
      url: 'https://www.jemla.ma/contact',
      type: 'website',
      images: [
        {
          url: '/opengraph-image.png',
          alt: 'Contactez-nous - Jemla.ma',
        },
      ],
    },
    twitter: {
      handle: '@jemla.ma',
      site: '@jemla.ma',
      card: 'summary_large_image',
    },
  };
  
  export default function ContactUs() {
    return (
      <div>
        <h1>Contactez-nous</h1>
        <p>
          Si vous avez des questions, des commentaires ou si vous avez besoin d'assistance, n'hésitez pas à nous contacter. 
          Nous sommes là pour vous aider à tirer le meilleur parti de Jemla.ma.
        </p>
      </div>
    );
  }
  