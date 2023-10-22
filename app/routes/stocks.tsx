import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { RenderCategory } from "~/components/stocks/RenderCategory";
import type { CategoryNode } from "~/models/stock.server";
import { getAccountsWithHoldings } from "~/models/stock.server";
import { getSession } from "~/session.server";

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

const sortByInstitutionValue = (
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

const recursivelySortChildrenByTotal = (rows: Array<CategoryNode>) => {
  rows.sort((a, b) => sortByTotal(a, b));
  rows.forEach((row) => {
    return row.children && row.children.length
      ? recursivelySortChildrenByTotal(row.children)
      : row.holdings.sort((a, b) => sortByInstitutionValue(a, b));
  });
};

export async function loader({ request, params }: LoaderArgs) {
  const session = await getSession(request);
  const accountsWithHoldings = await getAccountsWithHoldings({
    session,
    filters: params.accountId ? { accountId: params.accountId } : {},
  });

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
// export type Holding = ReturnType<
//   typeof useLoaderData<typeof loader>
// >["accountsWithHoldings"][0]["holdings"][0];

export default function Stocks() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Stocks</h1>
      {data.accountId ? (
        data.accountsWithHoldings[0].categoryHierarchyWithHolding.map(
          (categoryHierarchyWithHolding) => {
            return (
              <RenderCategory
                key={categoryHierarchyWithHolding.id}
                row={categoryHierarchyWithHolding}
                totalAmount={
                  data.accountsWithHoldings[0].balances.current ?? undefined
                }
                depth={0}
              />
            );
          }
        )
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
