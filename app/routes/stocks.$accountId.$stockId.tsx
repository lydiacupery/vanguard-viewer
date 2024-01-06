import { Dialog, Flex, Text, Button } from "@radix-ui/themes";
import { LoaderArgs, defer, json } from "@remix-run/node";
import {
  Await,
  Link,
  useLoaderData,
  useNavigate,
  useParams,
} from "@remix-run/react";
import { Suspense } from "react";
import { getArticlesSummary, scrapeArticlesForStock } from "~/summarizer";

const getStockData = async (stockId: string | undefined) => {
  if (!stockId) {
    return null;
  }
  // scrape stock data

  await scrapeArticlesForStock(stockId);
  return getArticlesSummary(stockId);
};

export async function loader({ request, params }: LoaderArgs) {
  const stockId = params.stockId;

  return defer({ summary: getStockData(stockId) });
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
        <Dialog.Title>Stock Info</Dialog.Title>
        <Suspense fallback={<div>Loading...</div>}>
          <Await
            resolve={data.summary}
            errorElement={<div>Failed to load stock data</div>}
          >
            {(summary) => (
              <Flex direction="column" gap="3">
                {/* <label>
		      <Text as="div" size="2" mb="1" weight="bold">
			Name
		      </Text>
		      <TextField.Input
			defaultValue="Freja Johnsen"
			placeholder="Enter your full name"
		      />
		    </label>
		    <label>
		      <Text as="div" size="2" mb="1" weight="bold">
			Email
		      </Text>
		      <TextField.Input
			defaultValue="freja@example.com"
			placeholder="Enter your email"
		      />
		    </label> */}
                <Text as="div">Ticker Summary</Text>
                <Text as="div"> {summary || ""} </Text>
              </Flex>
            )}
          </Await>
        </Suspense>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Link to={`/stocks/${params.accountId}`}>Cancel</Link>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
