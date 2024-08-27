'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

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
  available: z.boolean(),
  images: z.array(z.any()).optional(), // Array of image files
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
  available: boolean;
  images?: (File | null)[]; // Array of image files or null
}

interface Product {
  productID: string;
  sellerID: string;
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
  available: boolean;
  images?: string[];
}


interface EditProductDialogProps {
  product: Product;
}

const fetchCategories = async () => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Erreur lors du chargement des catégories');
  }
  return await response.json();
};

const uploadImage = async (image: File) => {
  const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudinaryUploadPreset || !cloudinaryCloudName) {
    throw new Error("Cloudinary configuration is missing.");
  }

  const formData = new FormData();
  formData.append('file', image);
  formData.append('upload_preset', cloudinaryUploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erreur lors du téléchargement de l'image");
  }

  const data = await response.json();
  return data.secure_url;
};


const EditProductDialog: React.FC<EditProductDialogProps> = ({ product }) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [previewUrls, setPreviewUrls] = useState<string[]>(product.images || []);
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useQuery('categories', fetchCategories);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      detailedDescription: product.detailedDescription,
      basePrice: product.basePrice,
      quantity: product.quantity,
      categoryID: product.categoryID,
      sku: product.sku,
      brand: product.brand,
      tags: product.tags,
      warranty: product.warranty,
      returnPolicy: product.returnPolicy,
      available: product.available,
    },
  });

  const mutation = useMutation(
    async (data: FormData) => {
      let imageUrls: string[] = product.images || [];
  
      if (data.images && data.images.length > 0 && data.images.some(image => image !== null)) {
        // Upload new images if provided
        imageUrls = await Promise.all(
          data.images.map(image => (image ? uploadImage(image) : ''))
        );
      }
  
      // Prepare updated data
      const updatedData = {
        ...data,
        images: imageUrls.filter(url => url), // Filter out empty strings if any
        sellerID: session?.user?.id,
        productId: product.productID,
      };
  
      const response = await fetch(`/api/seller/products`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de la modification du produit');
      }
  
      return await response.json();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
      },
      onError: (error) => {
        console.error('Erreur lors de la modification du produit:', error);
      },
    }
  );

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const files = event.target.files;
    if (files && files[0]) {
      const newImages = form.getValues('images') || [];
      newImages[index] = files[0];
      form.setValue('images', newImages);

      const newPreviews = [...previewUrls];
      newPreviews[index] = URL.createObjectURL(files[0]);
      setPreviewUrls(newPreviews);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className='w-full text-sm font-medium leading-none'>Modifier</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le Produit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          {categories?.map((category: any) => (
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
            <FormField
              control={form.control}
              name="available"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponible</FormLabel>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage>{form.formState.errors.available?.message}</FormMessage>
                </FormItem>
              )}
            />
            {/* Image Upload Inputs */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <>
                  {[0, 1, 2].map((index) => (
                    <FormItem key={index}>
                      <FormLabel>{`Image ${index + 1}`}</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, index)}
                        />
                      </FormControl>
                      {previewUrls[index] && (
                      <Image
                        src={previewUrls[index]}
                        alt={`Preview ${index + 1}`}
                        className="mt-2 max-h-20"
                        layout="intrinsic" // or "responsive", depending on your needs
                        width={80}  // You can adjust these values based on your design
                        height={80} // You can adjust these values based on your design
                      />
                    )}
                      <FormMessage>{form.formState.errors.images?.[index]?.message}</FormMessage>
                    </FormItem>
                  ))}
                </>
              )}
            />

            <Button type="submit" className="w-full" disabled={mutation.isLoading}>
              {mutation.isLoading ? 'Modification...' : 'Modifier'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
