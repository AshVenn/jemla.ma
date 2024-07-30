'use client';
import * as React from 'react';
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
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation } from 'react-query';
import { useSession } from 'next-auth/react';

const formSchema = z.object({
  name: z.string().min(2, 'Nom invalide').max(255, 'Nom trop long'),
  description: z.string().max(1024, 'Description trop longue'),
  price: z.coerce.number().min(0, 'Le prix doit être supérieur ou égal à 0'),
  stock: z.coerce.number().min(0, 'Le stock doit être supérieur ou égal à 0'),
  categoryID: z.string().min(1, 'Veuillez sélectionner une catégorie'),
  image: z.any().refine(file => file instanceof File && file.size > 0, 'Veuillez sélectionner une image'),
});

interface FormData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryID: string;
  image: File;
}

const fetchCategories = async () => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des catégories');
  }
  return await response.json();
};

const uploadImage = async (image: File) => {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
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
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery('categories', fetchCategories);
  
  const mutation = useMutation(
    async (data: FormData) => {
      const imageUrl = await uploadImage(data.image);
      const productData = {
        ...data,
        image: imageUrl,
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

  if (isLoadingCategories) {
    return <div>Chargement des catégories...</div>;
  }

  if (isErrorCategories) {
    return <div>Erreur lors du chargement des catégories</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Ajouter un Produit</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-8">
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
                      <Input placeholder="Description" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.description?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Prix" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.price?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Stock" {...field} />
                    </FormControl>
                    <FormMessage>{form.formState.errors.stock?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
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
                    <FormMessage>{form.formState.errors.categoryID?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image du Produit</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={e => field.onChange(e.target.files?.[0])} 
                      />
                    </FormControl>
                    <FormMessage>{form.formState.errors.image?.message}</FormMessage>
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
