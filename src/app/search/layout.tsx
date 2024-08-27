

export default function SearchLayout({
    children
  }: {
    children: React.ReactNode;
  }) {
    return (  
      <html lang="en" suppressHydrationWarning>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel='icon' href='/jemla.maIcon.svg' type="image/svg+xml" />
        </head>
        <body >
       
              {children}
        
        </body>
      </html>
    );
  }