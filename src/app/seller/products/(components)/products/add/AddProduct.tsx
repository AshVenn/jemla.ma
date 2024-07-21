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
import { Product } from '@/lib/backend/models/models';

const formSchema = z.object({
  name: z.string().min(2, 'Invalid name').max(255, 'Name too long'),
  description: z.string().max(1024, 'Description too long'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
  stock: z.number().min(0, 'Stock must be greater than or equal to 0'),
  categoryID: z.string().min(1, 'Please select a category'),
});

interface FormData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryID: string;
}

const AddProduct: React.FC = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Perform your submission logic here, e.g., saving to MongoDB via API
      const response = await fetch('/api/addProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Error adding product');
      }

      const result = await response.json();
      console.log(result);
      // Optionally redirect or show success message
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error state or show error message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Add a Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product Name" {...field} />
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
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Price" {...field} />
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
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {/* Render your categories dynamically */}
                          <SelectItem value="category_id_1">Category 1</SelectItem>
                          <SelectItem value="category_id_2">Category 2</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage>{form.formState.errors.categoryID?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Add Product
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          {/* Optional: add links or additional content */}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AddProduct;
