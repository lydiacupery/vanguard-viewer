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
import { sort } from "ramda";
import { RenderCategory } from "~/components/stocks/RenderCategory";

const sortByTotal = (a: { total?: number }, b: { total?: number }) => {
  if (a.total === undefined || b.total === undefined) return 0;
  if (a.total > b.total) {
    return -1;
  }
  if (a.total < b.total) {
    return 1;
  }
  return 0;
};

const sortByInstiutionValue = (
  a: { institution_value?: number },
  b: { institution_value?: number }
) => {
  if (a.institution_value === undefined || b.institution_value === undefined)
    return 0;
  if (a.institution_value > b.institution_value) {
    return -1;
  }
  if (a.institution_value < b.institution_value) {
    return 1;
  }
  return 0;
};

const recursivelySortChildrenByTotal = (rows: Array<Data>) => {
  rows.sort((a, b) => sortByTotal(a, b));
  rows.forEach((row) =>
    row.children && row.children.length
      ? recursivelySortChildrenByTotal(row.children)
      : row.holdings.sort((a, b) => sortByInstiutionValue(a, b))
  );
};

export async function loader({ request, params }: LoaderArgs) {
  const session = await getSession(request);
  const accountsWithHoldings = await getAccountsWithHoldings({
    session,
    filters: params.accountId ? { accountId: params.accountId } : {},
  });

  // sort the array by total
  // accountsWithHoldings.map((account) =>
  //   account.categoryHierarchyWithHolding.sort((a, b) => sortByTotal(a, b))
  // );
  recursivelySortChildrenByTotal(
    accountsWithHoldings[0].categoryHierarchyWithHolding
  );
  return json({
    accountsWithHoldings: accountsWithHoldings,
    accountId: params.accountId,
  });
}

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Holding = ReturnType<
  typeof useLoaderData<typeof loader>
>["accountsWithHoldings"][0]["holdings"][0];

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
              // need to get totalamount from server or have allocations be based on parent
              <RenderCategory
                row={categoryHierarchyWithHolding}
                totalAmount={data.accountsWithHoldings[0].balances.current}
                depth={0}
              />
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

// todo, rework to not use react table... will be simpler I think

type Data = Awaited<
  ReturnType<Awaited<ReturnType<typeof loader>>["json"]>
>["accountsWithHoldings"][0]["categoryHierarchyWithHolding"][number];

const RenderHoldings = ({ row }: { row: Holding[] }) => {
  console.log("row", row);
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
