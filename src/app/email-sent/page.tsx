import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Confirmation() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Email envoyé</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
          Merci pour votre inscription ! Votre email sera confirmé dans les 2 prochaines heures. Veuillez consulter votre boîte de réception pour d'éventuelles mises à jour.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
