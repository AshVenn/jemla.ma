"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

// Définir le schéma en utilisant zod avec des messages de validation en français
const formSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function Login() {
  const { data: session} = useSession();
  const router = useRouter();
  const [logInError, setLogInError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (session) {
      const userType = session?.user?.type;
      router.push(`/${userType}/dashboard`);
    }
  }, [session, router]);

  // Configurer le formulaire avec react-hook-form et zod resolver
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  // Fonction pour gérer la soumission du formulaire
  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!res || res.error) {
        setLogInError(res?.error === 'CredentialsSignin' 
          ? "Identifiants incorrects. Veuillez vérifier votre email et mot de passe." 
          : "Une erreur est survenue lors de la connexion. Veuillez réessayer.");
        return;
      }

      // No need to manually handle session, the useEffect will handle the redirect
    } catch (error) {
      console.error(error);
      setLogInError("Une erreur inattendue est survenue. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
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
              {logInError && (
                <p className="text-red-500 text-sm">{logInError}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Connexion"}
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
