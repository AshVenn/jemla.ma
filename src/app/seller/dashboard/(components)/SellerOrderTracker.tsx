'use client';
import { useState } from 'react';
import { useQuery } from 'react-query';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  WalletCards,
  Banknote,
  MoreVertical,
  Truck,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

function SellerOrderTracker() {
  const { data: session, status } = useSession();
  const [page, setPage] = useState(1);
  const limit = 1;

  const sellerID = session?.user?.id;

  const fetchOrders = async (page: number) => {
    if (!sellerID) {
      throw new Error('Seller ID is not available');
    }
  
    const params = new URLSearchParams({
      sellerID: sellerID.toString(),
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`/api/seller/ordersTracker?${params.toString()}`);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commandes');
    }

    return response.json();
  };

  const { data, isLoading, isError } = useQuery(['orders', page], () => fetchOrders(page), {
    enabled: !!sellerID,
    keepPreviousData: true,
  });

  if (status === 'loading') return <span>Chargement de la session...</span>;
  if (!sellerID) return <span>Aucun vendeur identifié.</span>;

  if (isLoading) return <span>Chargement des commandes...</span>;
  if (isError) return <span>Erreur lors de la récupération des commandes.</span>;

  const { orders, totalOrders } = data;

  type PaymentMethod = 'Credit Card' | 'PayPal' | 'Bank Transfer';

  const renderPaymentIcon = (method: PaymentMethod) => {
    const icons: Record<PaymentMethod, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
      'Credit Card': CreditCard,
      'PayPal': WalletCards,
      'Bank Transfer': Banknote,
    };
  
    const Icon = icons[method] || CreditCard;
    return <Icon className="h-4 w-4" />;
  };
  

  return (

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        {orders.map((order:any) => (
          <Card key={order.orderID} >
            <CardHeader className="flex flex-row items-start bg-muted/50 ">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Commande {order.orderID.slice(0, 6)}+
                  <Button
                    onClick={() => navigator.clipboard.writeText(order.orderID)}
                    size="icon"
                    variant="outline"
                    className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </CardTitle>
                <CardDescription>Date : {new Date(order.createdAt).toLocaleDateString()}</CardDescription>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <Truck className="h-3.5 w-3.5" />
                  <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                    Suivre la commande
                  </span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="outline" className="h-8 w-8">
                      <MoreVertical className="h-3.5 w-3.5" />
                      <span className="sr-only">Plus</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Exporter Pdf</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Exporter Excel</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm ">
              <div className="grid gap-3">
                <div className="font-semibold">Détails de la commande</div>
                <ul className="grid gap-3">
                  {order.orderItems.map((item:any) => (
                    <li key={item._id} className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        {item.productID.name} x <span>{item.quantity}</span>
                      </span>
                      <span>€{item.productID.basePrice}</span>
                    </li>
                  ))}
                </ul>
                <Separator className="my-2" />
                <ul className="grid gap-3">
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>€{order.totalAmount.toFixed(2)}</span>
                  </li>
                </ul>
              </div>
              <Separator className="my-4" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-3">
                  <div className="font-semibold">Informations de livraison</div>
                  <address className="grid gap-0.5 not-italic text-muted-foreground">
                    <span>
                      {order.clientID.firstName} {order.clientID.lastName}
                    </span>
                    <span>{order.shipmentID.addressID.addressLine1}</span>
                  </address>
                </div>
                <div className="grid auto-rows-max gap-3">
                  <div className="font-semibold">Informations de facturation</div>
                  <div className="text-muted-foreground">Identique à l'adresse de livraison</div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Informations client</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Client</dt>
                    <dd>
                      {order.clientID.firstName} {order.clientID.lastName}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Email</dt>
                    <dd>
                      <a href={`mailto:${order.clientID.email}`}>{order.clientID.email}</a>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Téléphone</dt>
                    <dd>
                      <a href={`tel:${order.clientID.phoneNumber}`}>+{order.clientID.phoneNumber}</a>
                    </dd>
                  </div>
                </dl>
              </div>
              <Separator className="my-4" />
              <div className="grid gap-3">
                <div className="font-semibold">Informations de paiement</div>
                <dl className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <dt className="flex items-center gap-1 text-muted-foreground">
                      {renderPaymentIcon(order.paymentID.paymentMethod)}
                      {order.paymentID.paymentMethod}
                    </dt>
                    <dd>{order.paymentID.paymentID.slice(2, 8)} **** **** ****</dd>
                  </div>
                </dl>
              </div>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3 ">
              <div className="text-xs text-muted-foreground">
                Mis à jour&nbsp;&#39;
                <time dateTime={order.updatedAt}>
                  {new Date(order.updatedAt).toLocaleDateString()}
                </time>
              </div>
              <Pagination className="ml-auto mr-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="sr-only">Commande précédente</span>
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6"
                      onClick={() => setPage((prev) => prev + 1)}
                      disabled={page >= Math.ceil(totalOrders / limit)}
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                      <span className="sr-only">Commande suivante</span>
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </CardFooter>

          </Card>
        ))}
      </div>
  );
}

export default SellerOrderTracker;
