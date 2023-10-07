import { prisma } from "~/db.server";

const axios = require("axios");

export const fetchStockInfoByTicker = async (ticker) => {
  // is there already a record in the asset table?  if so, return
  // const asset = await prisma.asset.findUnique({
  //   where: { ticker },
  // });
  // if (asset) return;
  // const options = {
  //   method: "GET",
  //   url: `https://yahoo-finance15.p.rapidapi.com/api/yahoo/qu/quote/${ticker}/default-key-statistics`,
  //   headers: {
  //     "X-RapidAPI-Key": process.env.X_RAPIDAPI_KEY,
  //     "X-RapidAPI-Host": process.env.X_RAPIDAPI_HOST,
  //   },
  // };
  // try {
  //   const response = await axios.request(options);
  //   // update cache table
  //   console.log("got a respone!!", response.data);
  //   const category =
  //     (await prisma.category.findFirst({
  //       where: { name: response.data.defaultKeyStatistics.category },
  //     })) ||
  //     (await prisma.category.create({
  //       data: {
  //         name: response.data.defaultKeyStatistics.category,
  //       },
  //     }));
  //   await prisma.asset.create({
  //     data: {
  //       ticker,
  //       category: {
  //         connect: {
  //           id: category.id,
  //         },
  //       },
  //     },
  //   });
  // } catch (error) {
  //   // if error, create one without a category
  //   await prisma.asset.create({
  //     data: {
  //       ticker,
  //     },
  //   });
  //   console.error(error);
  // }
};

export const fetchCategoriesForTickerList = async (
  tickerList: Array<string | null>
) => {
  await Promise.all(
    tickerList.map((ticker) => {
      if (!ticker) return Promise.resolve();
      return fetchStockInfoByTicker(ticker);
    })
  );
};
