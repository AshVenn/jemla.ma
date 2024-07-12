'use client'
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z
  .object({
    email: z.string().email('Adresse e-mail invalide'),
    password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
    confirmPassword: z.string().min(6, 'Le mot de passe de confirmation doit comporter au moins 6 caractères'),
    serviceType: z.string().min(1, 'Veuillez sélectionner un type de service'),
    lastName: z.string().min(2, 'Nom invalide'),
    firstName: z.string().min(2, 'Prénom invalide'),
    phoneNumber: z
      .string()
      .min(10, 'Numéro de téléphone invalide')
      .refine(data => data.startsWith('+212'), {
        message: 'Le numéro de téléphone doit commencer par +212',
      }),
    picture: z.string().min(1, 'Veuillez sélectionner une image'),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Les mots de passe ne correspondent pas',
  });

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  serviceType: 'client' | 'vendeur' | '';
  lastName: string;
  firstName: string;
  phoneNumber: string;
  picture: string; // Store only the path of the image
}

export default function Register(): JSX.Element {
  const [userExistsError, setUserExistsError] = React.useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data);
    try {
      // Clear userExistsError state
      setUserExistsError(null);

      // Check if user already exists
      const checkUserResponse = await fetch('/api/userExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      });

      if (checkUserResponse.status === 400) {
        setUserExistsError('L\'email est déjà pris');
        return;
      }

      // Proceed with registration if user does not exist
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }

      const result = await response.json();
      console.log(result);
    } catch (e) {
      console.error('Erreur lors de l\'envoi du formulaire:', e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>S'inscrire</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-8">
              <div className="flex flex-wrap -mx-4">
                {/* Left Column */}
                <div className="w-full md:w-1/2 px-4">
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.lastName?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Prénom" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.firstName?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro de téléphone" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.phoneNumber?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} className="w-full" />
                        </FormControl>
                        <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column */}
                <div className="w-full md:w-1/2 px-4">
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
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirmer mot de passe" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.confirmPassword?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de service</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full md:w-[180px]">
                              <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="vendeur">Vendeur</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormMessage>{form.formState.errors.serviceType?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="picture"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Picture</FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            placeholder="Picture"
                            type="file"
                            accept="image/*, application/pdf"
                            onChange={(event) =>
                              onChange(event.target.files && event.target.files[0])
                            }
                          />
                        </FormControl>
                        <FormMessage>{form.formState.errors.picture?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* Display userExistsError message */}
              <FormMessage>{userExistsError}</FormMessage>
              <Button type="submit" className="w-full">
                S'inscrire
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/login">
            Vous avez déjà un compte? Se connecter
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}