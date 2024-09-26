import xlsx from 'json-as-xlsx';
import { ColumnDef } from '@tanstack/react-table';

type ColumnWithAccessor = ColumnDef<any, any> & {
  accessorKey?: string;
};

function excelExport(data: any[], columns: ColumnWithAccessor[], columnLabels: any) {
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
          return `DH${value}`;
        }
        return value;
      },
    }));

  const content = data.map(item => {
    const newItem: { [key: string]: any } = {};
    columnsForExport.forEach(col => {
      newItem[col.label as string] = col.value(item);
    });
    return newItem;
  });

  const excelData = [
    {
      sheet: "Produits",
      columns: columnsForExport.map(col => ({
        label: col.label,
        value: col.label,
        style: {
          font: { color: { rgb: "FFFFFF" } }, // Text color for header
          fill: { patternType: "solid", fgColor: { rgb: "161517" } }, // Background color for header
          alignment: { horizontal: "center" } // Center text
        }
      })),
      content: content
    }
  ];

  const settings = {
    fileName: "Produits",
    extraLength: 3,
    writeOptions: {}
  };

  xlsx(excelData, settings);
}

export default excelExport;
