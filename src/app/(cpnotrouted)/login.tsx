"use client";
import "../globals.css";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import mis à jour

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Définir le schéma en utilisant zod avec des messages de validation en français
const formSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

export default function Login() {
  const router = useRouter(); // useRouter de next/navigation
  const [logInError, setLogInError] = React.useState<string | null>(null);

  // Configurer le formulaire avec react-hook-form et zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  // Fonction pour gérer la soumission du formulaire
  const onSubmit = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log("Réponse de SignIn:", res); // Afficher la réponse de signIn

      if (res.error) {
        // Utiliser des messages d'erreur plus spécifiques
        if (res.error === 'CredentialsSignin') {
          setLogInError("Identifiants incorrects. Veuillez vérifier votre email et mot de passe.");
        } else {
          setLogInError("Une erreur est survenue lors de la connexion. Veuillez réessayer.");
        }
        return;
      }

      // Récupérer la session après une connexion réussie
      const session = await getSession();
      console.log("Objet Session:", session);

      // Supposant que vous avez accès au type d'utilisateur après la connexion
      const userType = session?.user?.type;
      console.log("Type d'utilisateur:", userType); // Vérifier le type d'utilisateur dans la console

      switch (userType) {
        case 'seller':
          console.log("Redirection vers le tableau de bord vendeur");
          router.push("/seller/dashboard");
          break;
        case 'client':
          console.log("Redirection vers le tableau de bord client");
          router.push("/client/dashboard");
          break;
        case 'admin':
          console.log("Redirection vers le tableau de bord administrateur");
          router.push("/admin/dashboard");
          break;
        default:
          console.log("Type d'utilisateur inconnu:", userType);
          // Gérer les autres cas ou types inattendus
          break;
      }
    } catch (e) {
      console.log(e);
      setLogInError("Une erreur inattendue est survenue. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mot de passe" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.password?.message}</FormMessage>
                  </FormItem>
                )}
              />
              {logInError && <FormMessage>{logInError}</FormMessage>}
              <Button type="submit" className="w-full">
                Connexion
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/register">Nouveau ici ? Inscrivez-vous</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
