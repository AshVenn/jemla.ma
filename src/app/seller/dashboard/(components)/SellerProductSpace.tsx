import React from 'react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useRouter } from "next/navigation"
function SellerProductSpace() {

    const router= useRouter();
    const redirectToProducts =()=>{
      router.push('/seller/products')
    }

  return (
    <Card
    className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
  >
    <CardHeader className="pb-3">
      <CardTitle>Votre Boutique</CardTitle>
      <CardDescription className="max-w-lg text-balance leading-relaxed">
      Voir les produits listés, en stock, disponibles, etc...
      Mettre un produit en rupture, modifier...
      </CardDescription>
    </CardHeader>
    <CardFooter>
      <Button onClick={redirectToProducts}>Espace produits</Button>
    </CardFooter>
  </Card>
  )
}

export default SellerProductSpace