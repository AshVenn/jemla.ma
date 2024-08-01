"use client";

import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ImageCarousel } from "./view/ImageCarousel";
import DeleteProductDialog from './delete/DeleteProductDialog';

// Define the type for Product with Inventory
export type ProductWithInventory = {
  productID: string;
  sellerID: string;
  name: string;
  description?: string;
  basePrice: number;
  categoryID?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
  images: string[];
  quantity: number;
  quantityRemaining: number;
  attributes?: { key: string, value: string }[];
  brand?: string;
  averageRating?: number;
};

// Mapping column IDs to French labels
export const columnLabels: any = {
  images: "Images",
  name: "Nom",
  description: "Description",
  basePrice: "Prix",
  quantity: "Quantité Initiale",
  quantityRemaining: "Quantité Restante",
  available: "Disponible",
  averageRating: "Note Moyenne",
  createdAt: "Date de création",
  updatedAt: "Date de mise à jour",
  actions: "Actions"
};

// Define the columns for the table
export const columns: ColumnDef<ProductWithInventory>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "images",
    header: columnLabels["images"],
    cell: ({ row }) => {
      const product = row.original;
      return <ImageCarousel images={product.images} />;
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnLabels["name"]}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnLabels["description"]}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "basePrice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnLabels["basePrice"]}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => `€${getValue()}`,
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnLabels["quantity"]}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "quantityRemaining",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnLabels["quantityRemaining"]}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "available",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnLabels["available"]}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => (getValue() ? "Oui" : "Non"),
  },
  {
    accessorKey: "averageRating",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnLabels["averageRating"]}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => `${getValue()} / 5`,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnLabels["createdAt"]}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {columnLabels["updatedAt"]}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  },
  {
    id: "actions",
    header: () => <Button variant="ghost">{columnLabels["actions"]}</Button>,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DeleteProductDialog productId={product.productID} productName={product.name} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
];
