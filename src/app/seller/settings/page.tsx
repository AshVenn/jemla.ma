'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { useSession, signIn } from 'next-auth/react';
import { CldImage } from 'next-cloudinary';

const formSchema = z.object({
  username: z.string().min(2, 'Nom d’utilisateur invalide'),
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .optional(),
  confirmPassword: z
    .string()
    .min(6, 'La confirmation du mot de passe doit contenir au moins 6 caractères')
    .optional(),
  lastName: z.string().min(2, 'Nom invalide'),
  firstName: z.string().min(2, 'Prénom invalide'),
  phoneNumber: z
    .string()
    .min(10, 'Numéro de téléphone invalide')
    .refine((data) => data.startsWith('+212'), {
      message: 'Le numéro de téléphone doit commencer par +212',
    }),
  picture: z
    .any()
    .optional()
    .refine((file) => {
      if (file instanceof File && file.size > 0) return true;
      return file === null; // valid if no new file is uploaded
    }, 'Veuillez sélectionner une image').optional(),
}).refine((data) => data.password === data.confirmPassword || !data.password, {
  path: ['confirmPassword'],
  message: 'Les mots de passe ne correspondent pas',
});

interface FormData {
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  picture?: File | null; // Make it nullable
}

const Settings: React.FC = () => {
  const { data: session } = useSession();
  const [userPhoneError, setuserPhoneError] = React.useState<string | null>(null);
  const [isPasswordChangeEnabled, setIsPasswordChangeEnabled] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: session?.user?.username || '',
      email: session?.user?.email || '',
      firstName: session?.user?.firstName || '',
      lastName: session?.user?.lastName || '',
      phoneNumber: session?.user?.phoneNumber || '',
      picture: null,
    },
  });

  const [fieldsEnabled, setFieldsEnabled] = React.useState<{
    username: boolean;
    email: boolean;
    firstName: boolean;
    lastName: boolean;
    phoneNumber: boolean;
    password?: boolean;
    confirmPassword?: boolean;
    picture?: boolean; // Add this line
  }>({
    username: false,
    email: false,
    firstName: false,
    lastName: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
  });

  const uploadImage = async (image: File) => {
    if (!image) {
      throw new Error("Image file is required");
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
      setuserPhoneError(null);

      if (data.phoneNumber !== session?.user?.phoneNumber) {
        const checkPhoneResponse = await fetch('/api/seller/checkPhoneNumber', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber: data.phoneNumber }),
        });

        if (checkPhoneResponse.status === 400) {
          setuserPhoneError('Le numéro de téléphone est déjà pris');
          return;
        }
      }

      let imageUrl = session?.user?.avatarImage;
      if (data.picture) {
        imageUrl = await uploadImage(data.picture);
      }

      const updateData = {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        avatarImage: imageUrl,
      };

      const response = await fetch('/api/seller', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour des informations');
      }

      const result = await response.json();

      if (result.user) {
        const signInResponse = await signIn('credentials', { redirect: false, ...result.user });

        if (signInResponse?.ok === false) {
          throw new Error('Échec de la mise à jour de la session');
        }

        console.log('Utilisateur mis à jour et session rafraîchie');
      }
    } catch (e) {
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

  const toggleFieldModifier = (fieldName: keyof FormData) => {
    setFieldsEnabled((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const togglePasswordChange = () => {
    setIsPasswordChangeEnabled((prev) => !prev);
    if (!isPasswordChangeEnabled) {
      form.setValue('password', '');
      form.setValue('confirmPassword', '');
    }
  };

  return (
    <div className="flex items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-4xl p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-8">
            <div className="flex flex-wrap -mx-4">
              {/* Left Column */}
              <div className="w-full md:w-1/2 px-4 space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom d’utilisateur</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            placeholder="Nom d’utilisateur"
                            {...field}
                            disabled={!fieldsEnabled.username}
                          />
                        </FormControl>
                        <Button
                          variant="outline"
                          onClick={() => toggleFieldModifier('username')}
                        >
                          {fieldsEnabled.username ? 'Verrouiller' : 'Modifier'}
                        </Button>
                      </div>
                      <FormMessage>{form.formState.errors.username?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            placeholder="Nom"
                            {...field}
                            disabled={!fieldsEnabled.lastName}
                          />
                        </FormControl>
                        <Button
                          variant="outline"
                          onClick={() => toggleFieldModifier('lastName')}
                        >
                          {fieldsEnabled.lastName ? 'Verrouiller' : 'Modifier'}
                        </Button>
                      </div>
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
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            placeholder="Prénom"
                            {...field}
                            disabled={!fieldsEnabled.firstName}
                          />
                        </FormControl>
                        <Button
                          variant="outline"
                          onClick={() => toggleFieldModifier('firstName')}
                        >
                          {fieldsEnabled.firstName ? 'Verrouiller' : 'Modifier'}
                        </Button>
                      </div>
                      <FormMessage>{form.formState.errors.firstName?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numéro de Téléphone</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            placeholder="Numéro de Téléphone"
                            {...field}
                            disabled={!fieldsEnabled.phoneNumber}
                          />
                        </FormControl>
                        <Button
                          variant="outline"
                          onClick={() => toggleFieldModifier('phoneNumber')}
                        >
                          {fieldsEnabled.phoneNumber ? 'Verrouiller' : 'Modifier'}
                        </Button>
                      </div>
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
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Input
                            placeholder="Email"
                            {...field}
                            disabled={!fieldsEnabled.email}
                          />
                        </FormControl>
                        <Button
                          variant="outline"
                          onClick={() => toggleFieldModifier('email')}
                        >
                          {fieldsEnabled.email ? 'Verrouiller' : 'Modifier'}
                        </Button>
                      </div>
                      <FormMessage>{form.formState.errors.email?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="w-full md:w-1/2 px-4 space-y-4">
                {isPasswordChangeEnabled && (
                  <>
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
                  </>
                )}
                <FormField
                  control={form.control}
                  name="picture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image de Profil</FormLabel>
                      <div className="flex items-center space-x-4">
                        {session?.user?.avatarImage && (
                          <CldImage
                            src={session.user.avatarImage}
                            alt="Avatar"
                            width="100"
                            height="100"
                            className="rounded-full"
                          />
                        )}
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </FormControl>
                      </div>
                      <FormMessage>{form.formState.errors.picture?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* Display userPhoneError message */}
            {userPhoneError && <FormMessage>{userPhoneError}</FormMessage>}
            <Button variant="outline" onClick={togglePasswordChange} className="w-full">
              {isPasswordChangeEnabled ? 'Annuler la modification du mot de passe' : 'Modifier le mot de passe'}
            </Button>
            <Button type="submit" className="w-full">
              Mettre à jour
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Settings;
