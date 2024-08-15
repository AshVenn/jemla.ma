"use client"
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "react-query";
import { useSession } from "next-auth/react";

type DeleteProductDialogProps = {
  productId: string;
  productName: string;
};

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({ productId, productName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // Mutation pour supprimer le produit
  const deleteProductMutation = useMutation(async () => {
    if (!session || !session.user) throw new Error('Utilisateur non authentifié');
    
    // Debug: Log session and product info
    console.log("Deleting product:", { productId, sellerId: session.user.id });
    
    const response = await fetch(`/api/seller/products?productId=${productId}&sellerId=${session.user.id}`, {
      method: 'DELETE',
    });

    // Debug: Log response status and message
    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error('Échec de la suppression du produit');
    }

    return response.json();
  }, {
    onSuccess: () => {
      console.log("Product deleted successfully");
      queryClient.invalidateQueries("products"); // Invalider les requêtes de produits pour rafraîchir les données
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression du produit:", error);
      alert("Erreur lors de la suppression du produit. Veuillez réessayer.");
    }
  });

  const handleDelete = () => {
    deleteProductMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" onClick={() => setIsOpen(true)}>
          Supprimer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
        </DialogHeader>
        <div>
          Êtes-vous sûr de vouloir supprimer le produit <strong>{productName}</strong> ? Cette action est irréversible.
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteProductMutation.isLoading}>
            {deleteProductMutation.isLoading ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductDialog;
