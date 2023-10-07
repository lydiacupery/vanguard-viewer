import { ActionArgs, LoaderArgs, json } from "@remix-run/node";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { CountryCode, Products } from "plaid";
import { usePlaidLink } from "react-plaid-link";
import { plaidClient } from "~/plaid";
import { getSession, sessionStorage } from "~/session.server";
const util = require("util");

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = Products.Transactions.split(",");

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = "US".split(",");

// Parameters used for the OAuth redirect Link flow.
//
// Set PLAID_REDIRECT_URI to 'http://localhost:3000'
// The OAuth redirect flow requires an endpoint on the developer's website
// that the bank website should redirect to. You will need to configure
// this redirect URI for your client ID through the Plaid developer dashboard
// at https://dashboard.plaid.com/team/api.
// const PLAID_REDIRECT_URI = process.env.PLAID_REDIRECT_URI || "";

const prettyPrintResponse = (response: any) => {
  console.log(util.inspect(response.data, { colors: true, depth: 4 }));
};

export async function loader({ request }: LoaderArgs) {
  const configs = {
    user: {
      // This should correspond to a unique id for the current user.
      client_user_id: "user-id",
    },
    client_name: "Plaid Quickstart",
    products: PLAID_PRODUCTS as Products[],
    country_codes: PLAID_COUNTRY_CODES as CountryCode[],
    language: "en",
    //     redirect_uri: null,
  };

  const createTokenResponse = await plaidClient.linkTokenCreate(configs);
  prettyPrintResponse(createTokenResponse);
  return json(createTokenResponse.data);
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const publicToken = formData.get("publicToken");
  if (!publicToken || typeof publicToken !== "string") {
    return json({ ok: false, error: "missing public token" }, { status: 400 });
  }
  const exchangeResponse = await plaidClient.itemPublicTokenExchange({
    public_token: publicToken,
  });

  const session = await getSession(request);
  session.set("accessToken", exchangeResponse.data.access_token);
  await sessionStorage.commitSession(session);

  //       request.session.access_token = exchangeResponse.data.access_token;
  //       await request.session.save();
  //       res.send({ ok: true });
  return json({ ok: true });
};

export default function Plaid() {
  // call remix loader for token then use token to get access token
  // const submit = useSubmit();

  const data = useLoaderData<typeof loader>();

  const submit = useSubmit();

  const { open, ready } = usePlaidLink({
    token: data.link_token,
    onSuccess: (public_token, metadata) => {
      //       submit({ publicToken: public_token });
      // $path("/plaid/exchangeLinkTokenForAccessToken", {
      //   publicToken: public_token,
      // });
      // send public_token to server
      // need to have an endpoint to exchange public_token for access_token
      // to do that in remix, we need to
      const formData = new FormData();
      formData.append("publicToken", public_token);
      submit(formData, { method: "post" });
    },
  });
  const fetcher = useFetcher();

  return (
    <div>
      <button
        color="pink"
        onClick={() => {
          return open();
        }}
        disabled={!ready}
      >
        Open
      </button>

      <fetcher.Form
        method="post"
        // action={$path("/plaid/:publicToken/exchangeLinkTokenForAccessToken", {
        //   publicToken: "public_token",
        // })}
      >
        <button>click me!</button>
      </fetcher.Form>
    </div>
  );
}
