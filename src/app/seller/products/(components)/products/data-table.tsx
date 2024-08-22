"use client";
import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import excelExport from '../../../../../lib/export/seller/products/xlsx';
import pdfExport from '../../../../../lib/export/seller/products/pdf';
import AjouterDialog from './add/AddProductDialog';

import { columnLabels } from './columns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ProductTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [filtering, setFiltering] = React.useState<string>('');
  const [productsPerPage, setProductsPerPage] = React.useState(3);  // Default to 5 products per page
  const [currentPage, setCurrentPage] = React.useState(1);

  const lastProductIndex = currentPage * productsPerPage;
  const firstProductIndex = lastProductIndex - productsPerPage;

  const totalProducts = data.length;
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
  });

  return (
    <>
      <div className='overflow-auto'>
        <div className="py-2 flex items-center justify-end space-x-2">
          <AjouterDialog />
          <Button className='ml-2' onClick={() => excelExport(table.getRowModel().rows.map(row => row.original), columns,columnLabels)}>
            Excel
          </Button>
          <Button className='ml-2 mr-2' onClick={() => pdfExport(table.getRowModel().rows.map(row => row.original), columns,columnLabels)}>
            PDF
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild >
              <Button variant="outline">
                Colonnes <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnLabels[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="py-2">
          <Input
            placeholder="Filtrer..."
            value={filtering}
            onChange={(event) =>
              setFiltering(event.target.value)
            }
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-1 flex-1 overflow-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows
                ?.slice(firstProductIndex, lastProductIndex)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Component */}
        <div className="flex justify-center py-4">
          <Pagination className="flex justify-end">
            <PaginationContent>
              <PaginationItem style={{ cursor: 'pointer' }}>
                <PaginationPrevious onClick={handlePrevPage} />
              </PaginationItem>

              {pageNumbers.map((pageNumber, idx) => (
                <PaginationItem
                  style={{ cursor: 'pointer' }}
                  key={idx}
                  className=""
                >
                  <PaginationLink onClick={() => setCurrentPage(pageNumber)}>
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem style={{ cursor: 'pointer' }}>
                <PaginationNext onClick={handleNextPage} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </>
  );
}

export default ProductTable;
