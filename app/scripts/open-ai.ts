import { installGlobals } from "@remix-run/node";
import { openAi } from "~/open-ai";
import { getArticlesSummary } from "~/summarizer/get-summary";

// ts script

// fetch polyfills
installGlobals();

export async function main() {
  console.log("fetching response...");
  try {
    getArticlesSummary("IMCB");
  } catch (e) {
    console.log("error", e);
  }
}

main();
