import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ColumnDef } from '@tanstack/react-table';

function pdfExport(data: any[], columns: ColumnDef<any, any>[], columnLabels: any) {
  console.log({ data, columns });

  const columnsForExport = columns
    .filter(col => col.accessorKey && col.accessorKey !== 'createdAt' && col.accessorKey !== 'updatedAt' && col.accessorKey !== 'images')
    .map(col => ({
      label: columnLabels[col.accessorKey as keyof typeof columnLabels] || col.accessorKey,
      value: (row: any) => {
        const value = row[col.accessorKey as keyof typeof row];
        if (col.accessorKey === 'available') {
          return value ? 'Oui' : 'Non';
        }
        if (col.accessorKey === 'price') {
          return `€${value}`;
        }
        return value;
      },
    }));

  const doc = new jsPDF();

  const tableColumn = columnsForExport.map(col => col.label);
  const tableRows = data.map(item => {
    const row: { [key: string]: any } = {};
    columnsForExport.forEach(col => {
      row[col.label as string] = col.value(item);
    });
    return tableColumn.map(col => row[col]);
  });

  doc.text("Produits", 14, 22);

  autoTable(doc, {
    startY: 30,
    head: [tableColumn],
    body: tableRows,
    headStyles: {
      fillColor: '#161517', // Background color for header
      textColor: '#FFFFFF', // Text color for header
    },
    bodyStyles: {
      fillColor: '#FFFFFF', // Background color for body rows
      textColor: '#000000', // Text color for body rows
    },
    styles: {
      lineColor: '#000000', // Line color for borders
      lineWidth: 0.1,       // Line width for borders
    },
    alternateRowStyles: {
      fillColor: '#F5F5F5', // Alternate row background color for better readability
    },
    margin: { top: 10 },
  });

  doc.save('Produits.pdf');
}

export default pdfExport;
