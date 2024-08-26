'use client';

import React, { useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import ReCAPTCHA from 'react-google-recaptcha';
import { useToast } from '@/components/ui/use-toast'; // Import the toast hook

const formSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  username: z.string().min(6, "Le nom d'utilisateur doit contenir au moins 6 caractères"),
  confirmPassword: z.string().min(6, 'La confirmation du mot de passe doit contenir au moins 6 caractères'),
  serviceType: z.enum(['client', 'seller', 'courier'], {
    errorMap: () => ({ message: 'Veuillez sélectionner un type de service valide' }),
  }),
  lastName: z.string().min(2, 'Nom invalide'),
  firstName: z.string().min(2, 'Prénom invalide'),
  phoneNumber: z
    .string()
    .min(10, 'Numéro de téléphone invalide')
    .refine(data => data.startsWith('+212'), {
      message: 'Le numéro de téléphone doit commencer par +212',
    }),
  picture: z
    .any()
    .optional()
    .refine(file => file instanceof File && file.size > 0, 'Veuillez sélectionner un fichier image valide')
}).refine(data => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Les mots de passe ne correspondent pas',
});

interface FormData {
  email: string;
  password: string;
  username: string;
  confirmPassword: string;
  serviceType: 'client' | 'seller' | 'admin' | 'courier' | '';
  lastName: string;
  firstName: string;
  phoneNumber: string;
  picture?: File | null;
}

export default function Register(): JSX.Element {
  const { data: session } = useSession();
  const router = useRouter();
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const { toast } = useToast(); // Initialize the toast hook

  useEffect(() => {
    if (session) {
      switch (session.user.type) {
        case 'seller':
          router.push('/seller/dashboard');
          break;
        case 'client':
          router.push('/client/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          router.push('/');
          break;
      }
    }
  }, [session, router]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const uploadImage = async (image: File) => {
    if (!image) {
      throw new Error("Le fichier image est requis");
    }
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors du téléchargement de l'image");
    }

    const data = await response.json();
    return data.secure_url;
  };

  const onSubmit = async (data: FormData) => {
    try {
      const recaptchaValue = recaptchaRef.current?.getValue();
      if (!recaptchaValue) {
        toast({ description: "Veuillez compléter le CAPTCHA", variant: 'destructive' });
        return;
      }

      const usernameCheckResponse = await fetch('/api/user/usernameExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: data.username }),
      });

      if (usernameCheckResponse.status === 400) {
        toast({ description: "Nom d'utilisateur déjà utilisé", variant: 'destructive' });
        return;
      }

      const phoneCheckResponse = await fetch('/api/user/phonenumberExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: data.phoneNumber }),
      });

      if (phoneCheckResponse.status === 400) {
        toast({ description: 'Numéro de téléphone déjà utilisé', variant: 'destructive' });
        return;
      }

      let imageUrl = "";
      if (data.picture) {
        imageUrl = await uploadImage(data.picture);
      }

      const formData = {
        ...data,
        picture: imageUrl,
        recaptchaToken: recaptchaValue,
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }

      router.push('/email-sent'); // Redirection vers the custom confirmation page

    } catch (e) {
      toast({ description: 'Erreur lors de la soumission du formulaire', variant: 'destructive' });
      console.error('Erreur lors de la soumission du formulaire:', e);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('picture', file);
      form.clearErrors('picture');
    } else {
      form.setValue('picture', null);
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
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom d'utilisateur" {...field} />
                        </FormControl>
                        <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Numéro de Téléphone" {...field} />
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

                <div className="w-full md:w-1/2 px-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de Passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Mot de Passe" {...field} />
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
                        <FormLabel>Confirmer le Mot de Passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirmer le Mot de Passe" {...field} />
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
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-full md:w-[180px]">
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="seller">Vendeur</SelectItem>
                              <SelectItem value="courier">Livreur</SelectItem>
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image de Profil</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange} // Handle file change
                            value={undefined} // Prevent passing a value prop
                          />
                        </FormControl>
                        <FormMessage>{form.formState.errors.picture?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {siteKey && (
                <ReCAPTCHA sitekey={siteKey} ref={recaptchaRef} />
              )}

              {/* {userExistsError && <FormMessage>{userExistsError}</FormMessage>} */}

              <Button type="submit" className="w-full">
                S'inscrire
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/login">Vous avez déjà un compte ? Connectez-vous</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
