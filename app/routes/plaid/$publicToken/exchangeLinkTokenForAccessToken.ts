import { ActionArgs, json } from "@remix-run/node";
import { plaidClient } from "~/plaid";

export const exchangeTokenAction = async ({ request, params }: ActionArgs) => {
  console.log("ENTERED EZCHANGE....");
  // const publicToken = params.publicToken;
  // if (!publicToken || typeof publicToken !== "string") {
  //   return json({ ok: false, error: "missing public token" }, { status: 400 });
  // }
  // const exchangeResponse = await plaidClient.itemPublicTokenExchange({
  //   public_token: publicToken,
  // });
  // console.log("got this access token", exchangeResponse.data.access_token);

  //       request.session.access_token = exchangeResponse.data.access_token;
  //       await request.session.save();
  //       res.send({ ok: true });
  return json({ ok: true });
};
