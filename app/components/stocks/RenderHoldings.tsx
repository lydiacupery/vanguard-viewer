import { Dialog } from "@radix-ui/themes";
import { Link, useParams } from "@remix-run/react";
import type { ColumnDef, Getter } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Holding } from "plaid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

const TickerCell = ({ getValue }: { getValue: Getter<string> }) => {
  const params = useParams();
  return (
    <Dialog.Root>
      <Link to={`/stocks/${params.accountId}/${getValue()}`}>
        {`${getValue()}`}
      </Link>
    </Dialog.Root>
  );
};

export const columns: ColumnDef<Holding>[] = [
  {
    accessorKey: "security.ticker_symbol",
    header: "Ticker",
    cell: TickerCell,
  },
  {
    accessorKey: "allocation",
    header: "Allocation",
    cell({ getValue }) {
      return `${Intl.NumberFormat("en-US", {
        style: "percent",
      }).format(getValue() as number)}`;
    },
  },
  {
    accessorKey: "institution_value",
    header: "Institution Value",
    cell({ getValue }) {
      // todo, move to shared helper
      return `${Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(getValue() as number)}`;
    },
  },
  {
    accessorKey: "unrealizedGainLoss",
    header: "Unrealized Gain/Loss",
    cell({ getValue }) {
      // todo, move to shared helper
      return `${Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(getValue() as number)}`;
    },
  },
];

export const RenderHoldings = ({ row }: { row: Holding[] }) => {
  const table = useReactTable({
    data: row,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableExpanding: true,
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getAllCells().map((cell) => {
              return (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
