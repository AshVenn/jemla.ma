import xlsx from 'json-as-xlsx';
import { ColumnDef } from '@tanstack/react-table';

type ColumnWithAccessor = ColumnDef<any, any> & {
  accessorKey?: string;
};

function excelExportOrders(data: any[], columns: ColumnWithAccessor[], columnLabels: any, orderStatus: any) {
  console.log({ data, columns });

  const columnsForExport = columns
    .filter(col => col.accessorKey)
    .map(col => ({
      label: columnLabels[col.accessorKey as keyof typeof columnLabels] || col.accessorKey,
      value: (row: any) => {
        const value = row[col.accessorKey as keyof typeof row];
        if (col.accessorKey === 'clientID') {
          return `${value.firstName} ${value.lastName}`;
        }
        if (col.accessorKey === 'totalAmount') {
          return `€${value.toFixed(2)}`;
        }
        if (col.accessorKey === 'status') {
          return orderStatus[value]?.label || value;
        }
        if (col.accessorKey === 'createdAt') {
          return new Date(value).toLocaleDateString();
        }
        return typeof value === 'object' ? JSON.stringify(value) : String(value);
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
      sheet: "Commandes", // Name of the sheet
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
    fileName: "Commandes", // Name of the file
    extraLength: 3,
    writeOptions: {}
  };

  xlsx(excelData, settings);
}

export default excelExportOrders;
