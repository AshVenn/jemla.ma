import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddProduct from './AddProduct';

function AddProductDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Ajouter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un Produit</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <AddProduct onSuccess={handleFormSuccess} />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default AddProductDialog;
