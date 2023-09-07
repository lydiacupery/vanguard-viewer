import { Holding, Security } from "plaid";
import { buildCategoryHierarchy } from "./stock.server";

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
    Holding & { security: Security; categoryId: string | null | undefined }
  > = [
    {
      ...holdingWithSecurity,
      id: "1",
      categoryId: "3",
      institution_price: 10,
    },
    {
      ...holdingWithSecurity,
      id: "2",
      categoryId: "4",
      institution_price: 15,
    },
    {
      ...holdingWithSecurity,
      id: "3",
      categoryId: "4",
      institution_price: 20,
    },
    {
      ...holdingWithSecurity,
      id: "4",
      categoryId: "4",
      institution_price: 25,
    },
  ];

  const categoryHierarchy = buildCategoryHierarchy(rawData, holdings);
  console.log("category hierar", JSON.stringify(categoryHierarchy, null, 2));

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
          {
            category: "b",
            id: "2",
            parentId: "1",
            holdings: [],
            total: 70, // children with total of 10 + 60
            children: [
              {
                category: "c",
                id: "3",
                parentId: "2",
                children: [],
                total: 10, //  institution price of 10
                holdings: [holdings[0]],
              },
              {
                category: "d",
                id: "4",
                parentId: "2",
                children: [],
                total: 60, // institution price of 15 + 20 + 25 = 60
                holdings: expect.arrayContaining([
                  holdings[1],
                  holdings[2],
                  holdings[3],
                ]),
                // todo, add hodlings here
              },
            ],
          },
        ],
      }),
    ])
  );
});
