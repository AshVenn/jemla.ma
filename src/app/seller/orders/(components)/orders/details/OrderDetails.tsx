"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { FileText,Sheet as SheetExcel } from "lucide-react";
import exportOrderToPDF from "@/lib/export/seller/orderDetails/pdf";
import { exportOrderToExcel } from "@/lib/export/seller/orderDetails/xlsx";

// Define the type for Product
export type Product = {
  name: string;
  quantity: number;
  price: number;
};

const orderStatus: any = {
  Pending: { label: "En attente", variant: "secondary" },
  Processed: { label: "Traité", variant: "outline" },
  Shipped: { label: "Expédié", variant: "outline" },
  Delivered: { label: "Livré", variant: "secondary" },
  Cancelled: { label: "Annulé", variant: "destructive" },
};

export function OrderDetails({ order }:any) {
  // Récupérer les informations du statut à partir de l'objet orderStatus
  const statusInfo = orderStatus[order.status] || { label: "Inconnu", variant: "default" };

  return (
    <Sheet>
      <SheetTrigger className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:opacity-50">
        Voir Détails
      </SheetTrigger>
      <SheetContent className="h-full max-h-[100vh] overflow-y-auto scrollbar-hide">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">Détails de la commande</SheetTitle>
          <SheetDescription className="text-gray-500">
            Informations détaillées sur la commande et le client
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-1 p-4 space-y-4">
          <div>
            <h3 className="scroll-m-5 text-2xl font-semibold tracking-tight">Client</h3>
            <p className="mt-2">
              <span className="border-l-2 pl-6 italic">Nom:</span> {order.clientID.firstName} {order.clientID.lastName}
            </p>
            <p><span className="border-l-2 pl-6 italic">Email:</span> {order.clientID.email}</p>
          </div>
          <Separator />
          <div>
            <h3 className="scroll-m-10 text-2xl font-semibold tracking-tight mt-2">Commande</h3>
            <p className="mt-2">
              <span className="border-l-2 pl-6 italic">Montant Total: €</span>{order.totalAmount.toFixed(2)}
            </p>
            <p>
              <span className="border-l-2 pl-6 italic">Statut:</span> <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
            </p>
            <p><span className="border-l-2 pl-6 italic">Date de création:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <Separator />
          <div>
            <h3 className="scroll-m-10 text-2xl font-semibold tracking-tight mt-2">Produits</h3>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
              {order.items.map((item:any, index:number) => (
                <li key={index}>
                  <p className="leading-7 [&:not(:first-child)]">Produit: {item.productID.name}</p>
                  <p className="leading-7 [&:not(:first-child)]">Quantité: {item.quantity}</p>
                  <p className="leading-7 [&:not(:first-child)]">Prix: €{item.price.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
        <SheetFooter className="flex items-center justify-evenly">
         {/* Pour Excel */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <SheetClose asChild>
                  <SheetExcel onClick={() => exportOrderToExcel(order)}/>
                </SheetClose>
              </TooltipTrigger>
              <TooltipContent>
                <p>Télécharger le reçu format Excel</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        {/* Pour Pdf */}
          <TooltipProvider >
            <Tooltip>
              <TooltipTrigger>
                <SheetClose asChild>
                  <FileText onClick={() => exportOrderToPDF(order)}/>
                </SheetClose>
              </TooltipTrigger>
              <TooltipContent>
                <p>Télécharger le reçu format Pdf</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
