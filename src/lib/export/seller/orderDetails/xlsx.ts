interface Client {
  firstName: string;
  lastName: string;
  email: string;
}

interface OrderItem {
  productID: {
    name: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  clientID: Client;
  totalAmount: number;
  status: keyof typeof orderStatus;
  createdAt: Date;
  items: OrderItem[];
}

const orderStatus = {
  Pending: { label: "En attente", variant: "secondary" },
  Processed: { label: "Traité", variant: "outline" },
  Shipped: { label: "Expédié", variant: "outline" },
  Delivered: { label: "Livré", variant: "secondary" },
  Cancelled: { label: "Annulé", variant: "destructive" },
};

import xlsx from 'json-as-xlsx';

export function exportOrderToExcel(order: Order) {
  const data = [
    {
      sheet: 'Détails de la commande',
      columns: [
        { label: 'Produit', value: 'name' },
        { label: 'Quantité', value: 'quantity' },
        { label: 'Prix', value: 'price' }
      ],
      content: order.items.map((item: OrderItem) => ({
        name: item.productID.name,
        quantity: item.quantity,
        price: item.price.toFixed(2)
      })),
    },
    {
      sheet: 'Informations Client',
      columns: [
        { label: 'Nom', value: 'name' },
        { label: 'Email', value: 'email' }
      ],
      content: [
        { name: `${order.clientID.firstName} ${order.clientID.lastName}`, email: order.clientID.email }
      ],
    },
    {
      sheet: 'Informations Commande',
      columns: [
        { label: 'Montant Total', value: 'totalAmount' },
        { label: 'Statut', value: 'status' },
        { label: 'Date de création', value: 'createdAt' }
      ],
      content: [
        { 
          totalAmount: `DH${order.totalAmount.toFixed(2)}`,
          status: orderStatus[order.status]?.label || 'Inconnu',
          createdAt: new Date(order.createdAt).toLocaleDateString()
        }
      ],
    },
  ];

  const settings = {
    fileName: `Commande_${order.clientID.firstName}_${order.clientID.lastName}`, // Name of the exported file
    extraLength: 3, // Extra length to allow some space for larger text
    writeOptions: {}, // Style options
  };
  
  xlsx(data, settings);
}
