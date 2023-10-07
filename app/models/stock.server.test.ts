import { Holding, Security } from "plaid";
import { buildCategoryHierarchy } from "./stock.server";
import { Asset } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

const holdingWithSecurity = {
  id: "1",
  name: "a",
  parentId: null,
  level: 0,
  account_id: "1",
  security_id: "1",
  security: {
    id: "1",
    name: "a",
    ticker: "a",
    type: "a",
    close_price: 1,
    close_price_as_of: "a",
    currency: "a",
    country_code: "a",
    isin: "a",
    cusip: "a",
    sedol: "a",
    exchange: "a",
    description: "a",
    security_id: "1",
    institution_id: "1",
    institution_security_id: "1",
    is_cash_equivalent: false,
    is_currency_hedged: false,
    is_etf: false,
    is_active: false,
    iso_currency_code: "a",
    proxy_security_id: "a",
    proxy_security_institution_id: "a",
    proxy_security_institution_security_id: "a",
    ticker_symbol: "a",
    unofficial_currency_code: "a",
    update_datetime: new Date().toString(),
  },
  cost_basis: 1,
  quantity: 1,
  institution_value: 1,
  institution_price: 1,
  institution_price_as_of: "a",
  iso_currency_code: "a",
  unofficial_currency_code: "a",

  categoryId: "1",
} as const;

test("builds nested category hierarchy", () => {
  const rawData = [
    { id: "0", name: "aa", parentId: null, level: 0 },
    { id: "1", name: "a", parentId: null, level: 0 },
    { id: "2", name: "b", parentId: "1", level: 1 },
    { id: "3", name: "c", parentId: "2", level: 2 },
    { id: "4", name: "d", parentId: "2", level: 2 },
  ];
  const holdings: Array<
    Holding & {
      security: Security;
      assetCategories: Array<{
        allocation: Decimal;
        categoryID: string | null;
      }>;
    }
  > = [
    {
      ...holdingWithSecurity,
      id: "1",
      institution_price: 10,
      assetCategories: [
        { categoryID: "4", allocation: new Decimal(0.5) },
        { categoryID: "3", allocation: new Decimal(0.5) },
      ],
    },
    {
      ...holdingWithSecurity,
      id: "2",
      institution_price: 15,
      assetCategories: [
        {
          categoryID: "4",
          allocation: new Decimal(1),
        },
      ],
    },
    {
      ...holdingWithSecurity,
      id: "3",
      institution_price: 20,
      assetCategories: [
        {
          categoryID: "4",
          allocation: new Decimal(1),
        },
      ],
    },
    {
      ...holdingWithSecurity,
      id: "4",
      institution_price: 25,
      assetCategories: [
        {
          categoryID: "4",
          allocation: new Decimal(1),
        },
      ],
    },
  ];

  const categoryHierarchy = buildCategoryHierarchy(rawData, holdings);

  expect(categoryHierarchy).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        category: "aa",
        id: "0",
        children: [],
        holdings: [],
      }),
      expect.objectContaining({
        category: "a",
        id: "1",
        holdings: [],
        parentId: undefined,
        total: 70,
        children: [
          expect.objectContaining({
            category: "b",
            id: "2",
            parentId: "1",
            holdings: [],
            total: 70, // children with total of 10/2 + 10/2 + 60
            children: [
              {
                category: "c",
                id: "3",
                parentId: "2",
                children: [],
                total: 5, //  institution price of 10/2
                holdings: [{ ...holdings[0], institution_price: 5 }],
              },
              {
                category: "d",
                id: "4",
                parentId: "2",
                children: [],
                total: 65, // institution price of 15 + 20 + 25 + 10/2 = 65
                holdings: expect.arrayContaining([
                  { ...holdings[0], institution_price: 5 },
                  holdings[1],
                  holdings[2],
                  holdings[3],
                ]),
                // todo, add hodlings here
              },
            ],
          }),
        ],
      }),
    ])
  );
});
