import { openAi } from "~/open-ai";
import { polygonRestClient } from "~/polygon-rest-client";

const fsPromises = require("node:fs/promises");
const fs = require("fs");
const path = require("path");

var axios = require("axios");

export const scrapeArticlesForStock = async (stockName: string) => {
  const folderName = `${__dirname}/scraped/${stockName}`;
  console.log("folder name!", folderName);

  const directoryExists = fs.existsSync(folderName);
  console.log("does it exist?", directoryExists);
  if (!directoryExists) {
    console.log("Make directory and populate!!");
    await fsPromises.mkdir(folderName, { recursive: true });

    const tickerNews = await polygonRestClient.reference.tickerNews({
      ticker: stockName,
      limit: 5,
    });

    // for each result, scrape the article
    try {
      for (const result of tickerNews.results) {
        if (result.article_url) {
          var targetUrl = result.article_url;

          const response = await axios.post(
            "https://api.scrapeowl.com/v1/scrape",
            {
              api_key: process.env.SCRAPE_OWL_API_KEY,
              url: targetUrl,
              elements: [
                {
                  type: "css",
                  selector: "p",
                },
              ],
              json_response: true,
            }
          );

          const filePath = path.join(
            __dirname,
            `/scraped/${stockName}/${result.published_utc}.txt`
          );

          await fsPromises
            .writeFile(filePath, JSON.stringify(response.data.data))
            .then(() => {
              console.log("wrote file", filePath);
            });
        }
      }
    } catch (error) {
      console.log("Error scraping article", error);
    }
  }
};

export const getArticlesSummary = async (stock: string) => {
  // todo, eventually move to cloud storage
  const folderPath = `${__dirname}/scraped/${stock}`;
  const fileContents: string[] = [];

  const summaryFilePath = path.join(__dirname, `/scraped/${stock}/summary.txt`);

  const fileExists = fs.existsSync(summaryFilePath);

  if (fileExists) {
    // return the summary
    return await fsPromises
      .readFile(summaryFilePath, "utf8")
      .then((data: string) => {
        return JSON.parse(data);
      });
  }

  // read all files in the IMCB directory
  await fsPromises.readdir(folderPath).then(async (files: string[]) => {
    for (const file of files) {
      console.log("Reading file", file);
      // read file contents
      await fsPromises
        .readFile(path.join(folderPath, file), "utf8")
        .then((data: string) => {
          fileContents.push(data);
        });
    }
  });

  const response = await openAi.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "user",
        content:
          "Summarizes all the data provided about a stock, or extrapolates data about the specific stock based on the data provided.  Please focus on the stock provided and make the response short.  Provides a few sentence summary of the stock and its outlook based on all of the provided news articles.  If none of the news articles are not specific to the stock, provides a summary of what one might extrapolate about the stock from the news articles.",
      },
      {
        role: "system",
        content: `Please summarize the data provided about ${stock} or what could be extrapolated about ${stock} from the provided articles. ${fileContents}`,
      },
    ],
    temperature: 0.2,
  });
  console.log("response!", JSON.stringify(response.choices[0].message.content));

  await fsPromises
    .writeFile(
      summaryFilePath,
      JSON.stringify(response.choices[0].message.content)
    )
    .then(() => {
      console.log("wrote file", summaryFilePath);
    });
  return response.choices[0].message.content;
};
