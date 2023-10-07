import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { LoaderArgs } from "@remix-run/node";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { prisma } from "~/db.server";

export async function loader({ request, params }: LoaderArgs) {
  // get assets with categories
  const assetsWithCategories = await prisma.asset.findMany({
    include: {
      category: true,
    },
    orderBy: {
      ticker: "asc",
    },
  });

  const categories = await prisma.category.findMany();
  return { assetsWithCategories, categories };
}

export async function action({ request, params }: LoaderArgs) {
  // set category id for asset
  console.log("in sumbit1!!!");
  const body = new URLSearchParams(await request.text());
  const ticker = body.get("ticker");
  const categoryId = body.get("categoryId");
  console.log("ticker", ticker);
  console.log("categoryId", categoryId);
  if (ticker && categoryId) {
    await prisma.asset.update({
      where: {
        ticker,
      },
      data: {
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }
  return null;
}

export default function Categories() {
  const data = useLoaderData<typeof loader>();
  // get action
  const fetcher = useFetcher();
  return (
    <div>
      <h1>Assets</h1>
      {data.assetsWithCategories.map((asset) => {
        return (
          <div key={asset.ticker} className="pt-10">
            <h2>{asset.ticker}</h2>
            <div className="bg-white">
              <label for="categories" className="w-[180px] pr-5">
                Category
              </label>
              <select
                name="categories"
                value={asset.categoryID ?? "placeholder"}
                onChange={(e) => {
                  console.log("e", e.target.value);
                  // set category id for asset
                  fetcher.submit(
                    {
                      ticker: asset.ticker,
                      categoryId: e.target.value,
                    },
                    { method: "POST" }
                  );
                }}
              >
                <option value="placeholder" disabled hidden selected>
                  Select a category
                </option>
                {data.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}
