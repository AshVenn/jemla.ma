'use client';
import { Input } from '@/components/ui/input';

import React, { useState } from 'react';
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
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
import { columnLabels } from './columns';
import { Badge } from '@/components/ui/badge';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function OrdersTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState<string>('');
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [ordersPerPage, setOrdersPerPage] = useState(4);  // Default to 5 orders per page
  const [currentPage, setCurrentPage] = useState(1);

  const lastOrderIndex = currentPage * ordersPerPage;
  const firstOrderIndex = lastOrderIndex - ordersPerPage;

  const totalOrders = data.length;
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalOrders / ordersPerPage); i++) {
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
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
    globalFilterFn: (row, columnId, value) => {
      if (columnId === "clientID") {
        const client = row.original.clientID;
        return (
          client.firstName.toLowerCase().includes(value.toLowerCase()) ||
          client.lastName.toLowerCase().includes(value.toLowerCase()) ||
          client.email.toLowerCase().includes(value.toLowerCase())
        );
      }
      return row.getValue(columnId).toString().toLowerCase().includes(value.toLowerCase());
    },
  });

  const orderStatus: any = {
    Pending: { label: "En attente", variant: "secondary" },
    Processed: { label: "Traité", variant: "outline" },
    Shipped: { label: "Expédié", variant: "outline" },
    Delivered: { label: "Livré", variant: "secondary" },
    Cancelled: { label: "Annulé", variant: "destructive" },
  };

  return (
    <>
      <div className='overflow-auto'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className="w-full md:w-auto mb-4 md:mb-0 mt-4 sm:mt-2">
            <blockquote className="border-l-2 pl-4 md:pl-6 italic text-sm md:text-base">
              "Vendre, c'est convaincre avec élégance."
            </blockquote>
          </div>
          <div className="py-4 flex items-center space-x-2">
            <Button onClick={() => excelExport(table.getRowModel().rows.map(row => row.original), columns)}>
              Excel
            </Button>
            <Button onClick={() => pdfExport(table.getRowModel().rows.map(row => row.original), columns)}>
              PDF
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
                      {columnLabels[column.id] || column.id} {/* Use French label if available */}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="py-2">
          <Input
            placeholder="Filtrer..."
            value={globalFilter}
            onChange={(event) =>
              setGlobalFilter(event.target.value)
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
                ?.slice(firstOrderIndex, lastOrderIndex)
                .map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? "selected" : undefined}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {cell.column.id === 'status' ? (
                          <Badge variant={orderStatus[cell.getValue()]?.variant || "default"}>
                            {orderStatus[cell.getValue()]?.label || cell.getValue()}
                          </Badge>
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )
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
                  className={currentPage === pageNumber ? "bg-grey-100" : ""}
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
