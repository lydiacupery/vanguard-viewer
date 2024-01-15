import { Dialog, Flex, Text } from "@radix-ui/themes";
import { LoaderArgs, defer } from "@remix-run/node";
import {
  Await,
  Link,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { Suspense } from "react";
import {
  getArticlesSummary,
  getStockName,
  scrapeArticlesForStock,
} from "~/summarizer";

async function getOutlook(stockId: string) {
  await scrapeArticlesForStock(stockId);
  return getArticlesSummary(stockId);
}

export async function loader({ request, params }: LoaderArgs) {
  const stockId = params.stockId;
  if (!stockId) {
    return defer({ outlook: null, name: null });
  }

  return defer({ outlook: getOutlook(stockId), name: getStockName(stockId) });
}

// route with dialog component
export default function AccountStock() {
  const params = useParams();
  const navigate = useNavigate();

  const data = useLoaderData<typeof loader>();

  return (
    <Dialog.Root
      open={true}
      onOpenChange={() => {
        navigate(`/stocks/${params.accountId}`);
      }}
    >
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>{params.stockId} Stock</Dialog.Title>
        <Flex direction="column" gap="3">
          <Text as="div" weight="bold" size="3">
            Name
          </Text>
          <Suspense fallback={<div>Loading...</div>}>
            <Await
              resolve={data && data.name}
              errorElement={<div>Failed to load stock data</div>}
            >
              {(name) => <Text as="div"> {name || ""} </Text>}
            </Await>
          </Suspense>
          <Text as="div" weight="bold" size="3">
            Outlook
          </Text>
          <Suspense fallback={<div>Loading...</div>}>
            <Await
              resolve={data && data.outlook}
              errorElement={<div>Failed to load stock data</div>}
            >
              {(outlook) => <Text as="div"> {outlook || ""} </Text>}
            </Await>
          </Suspense>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Link to={`/stocks/${params.accountId}`}>Cancel</Link>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
