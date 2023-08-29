import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { LoaderArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAccountsWithHoldings } from "~/models/stock.server";
import { getSession } from "~/session.server";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { AccordionContent } from "@radix-ui/react-accordion";

export async function loader({ request, params }: LoaderArgs) {
  const session = await getSession(request);
  const accountsWithHoldings = await getAccountsWithHoldings({
    session,
    filters: params.accountId ? { accountId: params.accountId } : {},
  });

  console.log({
    accountsWithHoldings: JSON.stringify(accountsWithHoldings, null, 2),
  });
  return json({
    accountsWithHoldings,
    accountId: params.accountId,
  });
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Holding = ReturnType<
  typeof useLoaderData<typeof loader>
>["accountsWithHoldings"][0]["holdings"][0];

export const columns: ColumnDef<Holding>[] = [
  {
    accessorKey: "security.ticker_symbol",
    header: "Ticker",
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
];

export default function Stocks() {
  const data = useLoaderData<typeof loader>();
  console.log("data!", data);

  return (
    <div>
      <h1>Stocks</h1>
      {data.accountId ? (
        data.accountsWithHoldings[0].categoryHierarchyWithHolding
          // .filter((c) => c.children.length)
          .map((categoryHierarchyWithHolding) => {
            return (
              //   <div
              //     key={categoryHierarchyWithHolding.id}
              //     style={{ paddingTop: 40 }}
              //   >
              //     {/* <h2> Account: {categoryHierarchyWithHolding.name}</h2>
              // <h4> Type: {categoryHierarchyWithHolding.type}</h4> */}
              //     <h4>Category: {categoryHierarchyWithHolding.category}</h4>
              //     <RenderHoldings row={categoryHierarchyWithHolding} />
              //   </div>
              <RenderCategory row={categoryHierarchyWithHolding} />
            );
          })
      ) : (
        <div>
          <h1>PICK AN ACCOUNT</h1>
          {data.accountsWithHoldings.map((account) => (
            <div key={account.account_id}>
              <a href={`/stocks/${account.account_id}`}>
                {account.name} - {account.official_name}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const RenderCategory = ({ row }: { row: Data }) => {
  return (
    <Accordion type="multiple" style={{ paddingLeft: "20px" }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <h4>Category: {row.category}</h4>
        </AccordionTrigger>
        <AccordionContent>
          {row.children.length ? (
            <>
              {row.children.map((child) => (
                <RenderCategory row={child} key={child.id} />
              ))}
            </>
          ) : (
            <RenderHoldings row={row.holdings} />
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

// todo, rework to not use react table... will be simpler I think

type Data = Awaited<
  ReturnType<Awaited<ReturnType<typeof loader>>["json"]>
>["accountsWithHoldings"][0]["categoryHierarchyWithHolding"][number];

const RenderHoldings = ({ row }: { row: Holding[] }) => {
  console.log("rwo", row);
  const table = useReactTable({
    data: row,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableExpanding: true,
  });
  // todo, how to show holdings???

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
