// todo - eventually this all needs to be set via the categories page or from an API, but this is a starting point for now

import { installGlobals } from "@remix-run/node";
import { prisma } from "~/db.server";

// ts script

// fetch polyfills
installGlobals();

async function main() {
  const USSmall = await prisma.category.findFirst({
    where: {
      name: "US small",
    },
  });
  if (!USSmall) {
    throw new Error("US small category not found");
  }

  const USSmallValue = await prisma.category.findFirst({
    where: {
      name: "US small - value",
    },
  });

  if (!USSmallValue) {
    throw new Error("US small - value category not found");
  }

  const USSmallBlend = await prisma.category.findFirst({
    where: {
      name: "US small - core",
    },
  });

  if (!USSmallBlend) {
    throw new Error("US small - core category not found");
  }

  const USSmallGrowth = await prisma.category.findFirst({
    where: {
      name: "US small - growth",
    },
  });

  if (!USSmallGrowth) {
    throw new Error("US small - growth category not found");
  }

  const USMid = await prisma.category.findFirst({
    where: {
      name: "US medium",
    },
  });

  if (!USMid) {
    throw new Error("US medium category not found");
  }

  const USMidValue = await prisma.category.findFirst({
    where: {
      name: "US medium - value",
    },
  });

  if (!USMidValue) {
    throw new Error("US mid - value category not found");
  }

  const USMidBlend = await prisma.category.findFirst({
    where: {
      name: "US medium - core",
    },
  });

  if (!USMidBlend) {
    throw new Error("US medium - core category not found");
  }

  const USMidGrowth = await prisma.category.findFirst({
    where: {
      name: "US medium - growth",
    },
  });

  if (!USMidGrowth) {
    throw new Error("US medium - growth category not found");
  }

  const USLarge = await prisma.category.findFirst({
    where: {
      name: "US large",
    },
  });

  if (!USLarge) {
    throw new Error("US large category not found");
  }

  const USLargeValue = await prisma.category.findFirst({
    where: {
      name: "US large - value",
    },
  });

  if (!USLargeValue) {
    throw new Error("US large - value category not found");
  }

  const USLargeBlend = await prisma.category.findFirst({
    where: {
      name: "US large - core",
    },
  });

  if (!USLargeBlend) {
    throw new Error("US large - core category not found");
  }

  const USLargeGrowth = await prisma.category.findFirst({
    where: {
      name: "US large - growth",
    },
  });
  if (!USLargeGrowth) {
    throw new Error("US large - growth category not found");
  }

  const USStock = await prisma.category.findFirst({
    where: {
      name: "US Stock",
    },
  });

  if (!USStock) {
    throw new Error("US stock category not found");
  }

  const Stock = await prisma.category.findFirst({
    where: {
      name: "Stock",
    },
  });

  if (!Stock) {
    throw new Error("Stock category not found");
  }

  const global = await prisma.category.findFirst({
    where: {
      name: "Global Stock",
    },
  });

  if (!global) {
    throw new Error("Global category not found");
  }

  const emergingMarket = await prisma.category.findFirst({
    where: {
      name: "Emerging Markets",
    },
  });

  if (!emergingMarket) {
    throw new Error("Emerging Market category not found");
  }

  const developedMarket = await prisma.category.findFirst({
    where: {
      name: "Developed Markets",
    },
  });

  if (!developedMarket) {
    throw new Error("Developed Market category not found");
  }

  const USER_ID = "cln3bw9460000qcp8o6v6c8yv";

  await prisma.targetCategoryAllocation.deleteMany({});
  await prisma.targetCategoryAllocation.createMany({
    data: [
      {
        categoryID: Stock.id,
        allocation: 0.86,
        userID: USER_ID,
      },
      {
        categoryID: global.id,
        allocation: 0.2589,
        userID: USER_ID,
      },
      {
        categoryID: emergingMarket.id,
        allocation: 0.0714,
        userID: USER_ID,
      },
      {
        categoryID: developedMarket.id,
        allocation: 0.1875,
        userID: USER_ID,
      },
      {
        categoryID: USStock.id,
        allocation: 0.602,
        userID: USER_ID,
      },
      {
        categoryID: USLarge.id,
        allocation: 0.1204 * 3, // sum of all US large
        userID: USER_ID,
      },
      {
        categoryID: USLargeBlend.id,
        allocation: 0.1204,
        userID: USER_ID,
      },
      {
        categoryID: USLargeGrowth.id,
        allocation: 0.1204,
        userID: USER_ID,
      },
      {
        categoryID: USLargeValue.id,
        allocation: 0.1204,
        userID: USER_ID,
      },
      {
        categoryID: USMid.id,
        allocation: 0.0401 * 3, // sum of all US mid
        userID: USER_ID,
      },
      {
        categoryID: USMidBlend.id,
        allocation: 0.0401,
        userID: USER_ID,
      },
      {
        categoryID: USMidGrowth.id,
        allocation: 0.0401,
        userID: USER_ID,
      },
      {
        categoryID: USMidValue.id,
        allocation: 0.0401,
        userID: USER_ID,
      },
      {
        categoryID: USSmall.id,
        allocation: 0.0401 * 3, // sum of all US small
        userID: USER_ID,
      },
      {
        categoryID: USSmallBlend.id,
        allocation: 0.0401,
        userID: USER_ID,
      },
      {
        categoryID: USSmallGrowth.id,
        allocation: 0.0401,
        userID: USER_ID,
      },
      {
        categoryID: USSmallValue.id,
        allocation: 0.0401,
        userID: USER_ID,
      },
    ],
  });
}

void (async () => main())();
