import { Session } from "@remix-run/node";
import { Holding, InvestmentsHoldingsGetRequest, Security } from "plaid";
import { plaidClient } from "~/plaid";
import { fetchCategoriesForTickerList } from "~/routes/yahoo-finance";
import * as R from "ramda";
import { prisma } from "~/db.server";

export const getAccountsWithHoldings = async ({
  session,
  filters,
}: {
  session: Session;
  filters?: {
    accountId?: string;
  };
}) => {
  const accessToken = session.get("accessToken");

  // Pull Holdings for an Item
  const holdingsRequest: InvestmentsHoldingsGetRequest = {
    access_token: accessToken,
    options: filters?.accountId ? { account_ids: [filters.accountId] } : {},
  };
  const response = await plaidClient.investmentsHoldingsGet(holdingsRequest);

  // account info
  const accounts = response.data.accounts;
  console.log("accounts", accounts);

  const holdings = response.data.holdings;

  // fetch category for any secrity that doesn't have a category in the cache tabel
  fetchCategoriesForTickerList(
    response.data.securities.map((s) => s.ticker_symbol)
  );

  // use ramda to create a map of securities keyed by id
  const securitiesMap = R.indexBy(
    R.prop("security_id"),
    response.data.securities
  );

  // every asset will need to require a category

  const holdingsWithSecurity = await Promise.all(
    holdings.map(async (holding) => {
      const security = securitiesMap[holding.security_id];
      const asset = await prisma.asset.findFirst({
        where: {
          ticker: security.ticker_symbol || undefined,
        },
      });
      return {
        ...holding,
        security,
        categoryId: asset?.categoryID,
      };
    })
  );

  // group sortedHOldingsWithSecurity by account_id using ramda
  const holdingsByAccount = R.groupBy(
    (holding) => holding.account_id,
    holdingsWithSecurity
  );

  const categoryHierarchies = await prisma.$queryRawUnsafe<
    Array<{
      id: string;
      name: string;
      parentId: null | string;
      level: number;
    }>
  >(`
      WITH RECURSIVE nested_tree AS (
        SELECT id, name, "parentId", 1 AS level
        FROM "Category"
        WHERE "parentId" IS NULL
        
        UNION ALL
        
        SELECT t.id, t.name, t."parentId", nt.level + 1
        FROM "Category" t
        JOIN nested_tree nt ON t."parentId" = nt.id
    )
    SELECT id, name, "parentId", level
    FROM nested_tree
    ORDER BY level, id;
  `);

  const accountsWithCategories = accounts.map((account) => {
    const categoryHierarchy = buildCategoryHierarchy(
      categoryHierarchies,
      holdingsByAccount[account.account_id]
    );
    console.log("categoryHierarchy", categoryHierarchy);

    const categoryHierarchyWithHolding = categoryHierarchy.map((category) => {
      // only need to find holding if category is a leaf node
      const holdings = holdingsByAccount[account.account_id] || [];
      const holdingsInCategory = holdings.filter(
        (holding) => holding.categoryId === category.id
      );
      return {
        ...category,
        holdings: holdingsInCategory,
      };
    });

    return {
      ...account,
      categoryHierarchyWithHolding,
    };
  });
  return accountsWithCategories;
};

interface RawCategory {
  id: string;
  name: string;
  parentId: null | string;
  level: number;
}

interface CategoryNode {
  category: string;
  id: string;
  children: CategoryNode[];
  parentId?: string;
  holdings: Holding[];
  total?: number;
}

// export const buildCategoryHierarchy = (
//   rawData: RawCategory[],
//   holdings:
//     | Array<
//         Holding & { security: Security; categoryId: string | null | undefined }
//       >
//     | undefined
// ): CategoryNode[] => {
//   const createNode = R.applySpec<CategoryNode>({
//     category: R.prop("name"),
//     id: R.prop("id"),
//     children: R.always([]),
//   });

//   const addNodeToMap = (
//     map: Record<string, CategoryNode>,
//     node: CategoryNode
//   ) => R.assoc(node.id, node, map);

//   const addChildToParent = (
//     map: Record<string, CategoryNode>,
//     parentId: string,
//     child: CategoryNode
//   ) => {
//     const holdingsForCategory = (holdings || []).filter(
//       (holding) => holding.categoryId === child.id
//     );
//     console.log("holdingsForCategory", holdingsForCategory);
//     const updatedMap = R.evolve(
//       {
//         [parentId]: (parent: CategoryNode) => ({
//           ...parent,
//           children: [
//             ...parent.children,
//             { ...child, holdings: holdingsForCategory },
//           ],
//         }),
//       },
//       map
//     );
//     return updatedMap;
//     // remove child from map
//     // return R.dissoc(child.id, updatedMap);
//   };

//   const initializeMap = R.pipe(
//     R.map(createNode),
//     R.reduce(addNodeToMap, {} as Record<string, CategoryNode>)
//   );

//   const linkChildren = (
//     map: Record<string, CategoryNode>,
//     rawCategory: RawCategory
//   ) => {
//     if (rawCategory.parentId) {
//       const child = R.prop(rawCategory.id, map);
//       return addChildToParent(map, rawCategory.parentId, child);
//     }
//     return map;
//   };

//   const hierarchicalMap = R.pipe(
//     initializeMap,
//     (map: Record<string, CategoryNode>) => R.reduce(linkChildren, map)(rawData)
//   );

//   const hierarchicalData = R.values(hierarchicalMap(rawData));

//   return hierarchicalData;
// };

// new
export const buildCategoryHierarchy = (
  rawData: RawCategory[],
  holdings:
    | Array<
        Holding & {
          security: Security;
          categoryId: string | null | undefined;
        }
      >
    | undefined
): CategoryNode[] => {
  const createNode = (rawCategory: RawCategory): CategoryNode => {
    const holdingsForCategory = (holdings || []).filter(
      (holding) => holding.categoryId === rawCategory.id
    );

    return {
      category: rawCategory.name,
      id: rawCategory.id,
      children: [],
      holdings: holdingsForCategory,
      parentId: rawCategory.parentId ?? undefined,
    };
  };

  const categoryMap: Record<string, CategoryNode> = {};

  rawData.forEach((rawCategory) => {
    const node = createNode(rawCategory);
    categoryMap[node.id] = node;

    if (rawCategory.parentId) {
      const parent = categoryMap[rawCategory.parentId];
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  const addTotalsToNode = (node: CategoryNode): CategoryNode => {
    // recursively add a total to all the children
    node.children.forEach((child) => {
      if (child.children.length > 0 || child.holdings.length > 0) {
        addTotalsToNode(child);
      }
    });
    const total =
      node.children.reduce((acc, child) => acc + (child.total || 0), 0) +
      node.holdings.reduce(
        (acc, holding) => acc + holding.institution_price,
        0
      );

    node.total = total;
    return node;
  };

  // Find root categories (those with no parent)
  const rootCategories: CategoryNode[] = [];
  Object.values(categoryMap).forEach((node) => {
    if (!node.category || node.category === "null") {
      // Handle cases where "null" is used as a placeholder for a missing category name
      node.category = "Uncategorized";
    }
    if (!node.parentId || !categoryMap[node.parentId]) {
      // parent node, add totals
      addTotalsToNode(node);
      rootCategories.push(node);
    }
  });

  return rootCategories;
};
