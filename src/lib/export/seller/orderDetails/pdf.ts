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

import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function exportOrderToPDF(order: Order) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.text('Détails de la commande', 14, 22);
  
  // Add client details
  doc.setFontSize(14);
  doc.text('Client:', 14, 35);
  doc.text(`Nom: ${order.clientID.firstName} ${order.clientID.lastName}`, 14, 45);
  doc.text(`Email: ${order.clientID.email}`, 14, 55);
  
  // Add order details
  doc.text('Commande:', 14, 70);
  doc.text(`Montant Total: DH${order.totalAmount.toFixed(2)}`, 14, 80);
  doc.text(`Statut: ${orderStatus[order.status]?.label || 'Inconnu'}`, 14, 90);
  doc.text(`Date de création: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 100);
  
  // Add product details
  doc.text('Produits:', 14, 115);
  const products = order.items.map((item: OrderItem) => [
    item.productID.name,
    item.quantity,
    `DH${item.price.toFixed(2)}`,
  ]);
  
  doc.autoTable({
    startY: 125,
    head: [['Produit', 'Quantité', 'Prix']],
    body: products,
  });
  
  // Save the PDF
  doc.save(`Commande_${order.clientID.firstName}_${order.clientID.lastName}.pdf`);
}
