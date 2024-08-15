import xlsx from 'json-as-xlsx';
import { ColumnDef } from '@tanstack/react-table';

function excelExport(data: any[], columns: ColumnDef<any, any>[]) {
  console.log({ data, columns });

  const columnsForExport = columns
    .filter(col => col.accessorKey && col.accessorKey !== 'createdAt' && col.accessorKey !== 'updatedAt' && col.accessorKey !== 'images')
    .map(col => ({
      label: col.accessorKey,
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

  const content = data.map(item => {
    const newItem: { [key: string]: any } = {};
    columnsForExport.forEach(col => {
      newItem[col.label as string] = col.value(item);
    });
    return newItem;
  });

  const settings = {
    fileName: "Produits",
    extraLength: 3,
    writeOptions: {}
  };

  const excelData = [
    {
      sheet: "Produits",
      columns: columnsForExport.map(col => ({ label: col.label, value: col.label })),
      content: content
    }
  ];

  xlsx(excelData, settings);
}

export default excelExport;
