"use client";
import "../globals.css";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Updated import

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define the schema using zod with French validation messages
const formSchema = z.object({
  email: z.string().email("Adresse e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

export default function Login() {
  const router = useRouter(); // useRouter from next/navigation
  const [logInError, setLogInError] = React.useState<string | null>(null);

  // Set up the form with react-hook-form and zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      console.log("SignIn Response:", res); // Log the signIn response

      if (res.error) {
        setLogInError(res.error);
        return;
      }

      // Fetch the session after a successful sign-in
      const session = await getSession();
      console.log("Session Object:", session);

      // Assuming you have access to the user's type after login
      const userType = session?.user?.type;
      console.log("User Type:", userType); // Check userType in console

      switch (userType) {
        case 'vendeur':
          console.log("Redirecting to vendeur dashboard");
          router.push("/vendeur/dashboard");
          break;
        case 'client':
          console.log("Redirecting to client dashboard");
          router.push("/client/dashboard");
          break;
        case 'admin':
          console.log("Redirecting to admin dashboard");
          router.push("/admin/dashboard");
          break;
        default:
          console.log("Unknown user type:", userType);
          // Handle any other cases or unexpected types
          break;
      }
    } catch (e) {
      console.log(e);
      // Handle error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>S'authentifier</CardTitle>
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
              <FormMessage>{logInError}</FormMessage>
              <Button type="submit" className="w-full">
                S'authentifier
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/register">Vous êtes nouveau? S'inscrire?</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
