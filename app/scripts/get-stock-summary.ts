// gets overview of stock and recent news related to stock

import { installGlobals } from "@remix-run/node";
import { scrapeArticlesForStock } from "~/summarizer";

// fetch polyfills
installGlobals();

async function main() {
  await scrapeArticlesForStock("IMCB");
}

void (async () => main())();
