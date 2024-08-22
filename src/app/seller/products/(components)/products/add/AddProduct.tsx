'use client';
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
  name: z.string().min(2, 'Nom invalide').max(255, 'Nom trop long'),
  description: z.string().max(1024, 'Description trop longue'),
  detailedDescription: z.string().max(5000, 'Description détaillée trop longue'),
  basePrice: z.coerce.number().min(0, 'Le prix doit être supérieur ou égal à 0'),
  quantity: z.coerce.number().min(0, 'La quantité doit être supérieure ou égale à 0'),
  categoryID: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  sku: z.string().optional(),
  brand: z.string().optional(),
  tags: z.array(z.string()).optional(),
  warranty: z.string().optional(),
  returnPolicy: z.string().optional(),
  images: z.array(z.instanceof(File)).max(3).optional(), // Array of image files
});

interface FormData {
  name: string;
  description?: string;
  detailedDescription?: string;
  basePrice: number;
  quantity: number;
  categoryID: string;
  sku?: string;
  brand?: string;
  tags?: string[];
  warranty?: string;
  returnPolicy?: string;
  images?: File[];
}

const fetchCategories = async () => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des catégories');
  }
  return await response.json();
};

const uploadImageToCloudinary = async (image: File): Promise<string> => {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!uploadPreset || !cloudName) {
    throw new Error('Configuration de Cloudinary manquante');
  }

  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Erreur lors du téléchargement de l\'image');
  }

  const data = await response.json();
  return data.secure_url;
};


const AddProduct: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient(); // Create a queryClient instance to manage the cache
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery('categories', fetchCategories);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const mutation = useMutation(
    async (data: FormData) => {
      const imageUrls = await Promise.all(
        (data.images || []).map(image => uploadImageToCloudinary(image))
      );

      const productData = {
        ...data,
        images: imageUrls,
        sellerID: session?.user?.id,
      };

      const response = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du produit');
      }

      return await response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products'); // Invalidate the 'products' query to refresh the data table
        onSuccess();
      },
      onError: (error) => {
        console.error('Erreur lors de l\'ajout du produit:', error);
      },
    }
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    if (files && files[0]) {
      const newImages = form.getValues('images') || [];
      newImages[index] = files[0]; // This should be a File
      form.setValue('images', newImages);
  
      const newPreviews = [...previewUrls];
      newPreviews[index] = URL.createObjectURL(files[0]);
      setPreviewUrls(newPreviews);
    }
  };
  

  if (isLoadingCategories) {
    return <div>Chargement...</div>;
  }

  if (isErrorCategories) {
    return <div>Erreur lors du chargement...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className='text-xl text-center'>Ajouter un Produit</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 md:space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du Produit</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du Produit" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="detailedDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description Détaillée</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Description Détaillée" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.detailedDescription?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix de Base</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Prix de Base" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.basePrice?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantité</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Quantité" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.quantity?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="w-full md:w-[180px]">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <SelectGroup>
                            {categories.map((category: any) => (
                              <SelectItem key={category._id} value={category._id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage>{form.formState.errors.categoryID?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="SKU" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.sku?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input placeholder="Marque" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.brand?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="Tags (séparés par des virgules)" {...field} onChange={(e) => field.onChange(e.target.value.split(',').map(tag => tag.trim()))} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.tags?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="warranty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garantie</FormLabel>
                    <FormControl>
                      <Input placeholder="Garantie" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.warranty?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returnPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Politique de Retour</FormLabel>
                    <FormControl>
                      <Input placeholder="Politique de Retour" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.returnPolicy?.message}</FormMessage>
                  </FormItem>
                )}
              />
              {/* Image Upload Inputs */}
              <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image 1</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 0)}
                        />
                      </FormControl>
                      {previewUrls[0] && (
                        <img
                          src={previewUrls[0]}
                          alt="Preview 1"
                          className="mt-2 max-h-20"
                        />
                      )}
                      <FormMessage>{form.formState.errors.images?.[0]?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image 2</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 1)}
                        />
                      </FormControl>
                      {previewUrls[1] && (
                        <img
                          src={previewUrls[1]}
                          alt="Preview 2"
                          className="mt-2 max-h-20"
                        />
                      )}
                      <FormMessage>{form.formState.errors.images?.[1]?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image 3</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 2)}
                        />
                      </FormControl>
                      {previewUrls[2] && (
                        <img
                          src={previewUrls[2]}
                          alt="Preview 3"
                          className="mt-2 max-h-20"
                        />
                      )}
                      <FormMessage>{form.formState.errors.images?.[2]?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              <Button type="submit" className="w-full" disabled={mutation.isLoading}>
                {mutation.isLoading ? 'Ajout du produit...' : 'Ajouter le produit'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          {/* Optionnel : ajouter des liens ou du contenu supplémentaire */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddProduct;
