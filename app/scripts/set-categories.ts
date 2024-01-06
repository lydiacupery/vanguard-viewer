// todo - eventually this all needs to be set via the categories page or from an API, but this is a starting point for now

import { installGlobals } from "@remix-run/node";
import { prisma } from "~/db.server";

// ts script

// fetch polyfills
installGlobals();

const tickerToAllocations: Record<
  string,
  {
    us?: Partial<{
      smallValue: string;
      smallBlend: string;
      smallGrowth: string;
      middleValue: string;
      middleBlend: string;
      middleGrowth: string;
      largeValue: string;
      largeBlend: string;
      largeGrowth: string;
    }>;
    global?: {
      emerging: string;
      developed: string;
    };
  }
> = {
  VOX: {
    us: {
      largeValue: "32.93",
      largeBlend: "35.349",
      largeGrowth: "5.969",
      middleValue: "11.325",
      middleBlend: "13.086",
      middleGrowth: "1.291",
      smallValue: "0.039",
      smallGrowth: "0.01",
    },
  },
  VTV: {
    us: {
      largeValue: "32.93000",
      largeBlend: "35.34900",
      largeGrowth: "5.96900",
      middleValue: "11.32500",
      middleBlend: "13.08600",
      middleGrowth: "1.29100",
      smallValue: "0.03900",
      smallGrowth: "0.01000",
    },
  },
  VTSAX: {
    us: {
      largeValue: "13.27600",
      largeBlend: "28.93000",
      largeGrowth: "29.85400",
      middleValue: "5.56000",
      middleBlend: "8.67600",
      middleGrowth: "5.29800",
      smallValue: "2.80700",
      smallBlend: "3.47600",
      smallGrowth: "2.12400",
    },
  },
  VTI: {
    us: {
      largeValue: "13.27600",
      largeBlend: "28.93000",
      largeGrowth: "29.85400",
      middleValue: "5.56000",
      middleBlend: "8.67600",
      middleGrowth: "5.29800",
      smallValue: "2.80700",
      smallBlend: "3.47600",
      smallGrowth: "2.12400",
    },
  },
  VPU: {
    us: {
      largeValue: "18.11200",
      largeBlend: "13.12800",
      middleValue: "35.96800",
      middleBlend: "23.81500",
      smallValue: "3.82200",
      smallBlend: "4.62500",
      smallGrowth: "0.53000",
    },
  },
  HAUZ: {
    global: {
      emerging: "15",
      developed: "85",
    },
  },
  VDE: {
    us: {
      largeValue: "34.44900",
      largeBlend: "29.64800",
      largeGrowth: "4.29100",
      middleValue: "7.65900",
      middleBlend: "7.36100",
      middleGrowth: "6.69100",
      smallValue: "4.03300",
      smallBlend: "3.24300",
      smallGrowth: "2.62400",
    },
  },
  VV: {
    us: {
      largeValue: "15.11900",
      largeBlend: "32.87800",
      largeGrowth: "33.86700",
      middleValue: "5.37200",
      middleBlend: "8.28800",
      middleGrowth: "4.42800",
      smallValue: "0.01700",
      smallGrowth: "0.03100",
    },
  },
  VHT: {
    us: {
      largeValue: "28.91100",
      largeBlend: "29.43200",
      largeGrowth: "15.07800",
      middleValue: "3.14000",
      middleBlend: "7.26200",
      middleGrowth: "7.92800",
      smallValue: "1.42800",
      smallBlend: "3.10000",
      smallGrowth: "3.72200",
    },
  },
  VFH: {
    us: {
      largeValue: "23.12000",
      largeBlend: "18.96000",
      largeGrowth: "26.12100",
      middleValue: "11.18300",
      middleBlend: "5.80700",
      middleGrowth: "4.07100",
      smallValue: "7.39300",
      smallBlend: "2.55700",
      smallGrowth: "0.78900",
    },
  },
  VEA: {
    us: {
      largeValue: "26.08500",
      largeBlend: "28.29700",
      largeGrowth: "22.73800",
      middleValue: "5.79900",
      middleBlend: "8.06900",
      middleGrowth: "4.71100",
      smallValue: "1.41300",
      smallBlend: "1.93100",
      smallGrowth: "0.95700",
    },
  },
  VWO: {
    global: {
      emerging: "99.50",
      developed: "0.50",
    },
  },
  VIOO: {
    us: {
      middleBlend: "0.61400",
      middleGrowth: "0.25800",
      smallValue: "36.42900",
      smallBlend: "42.25700",
      smallGrowth: "20.44200",
    },
  },
  VTIAX: {
    global: {
      emerging: "25",
      developed: "75",
    },
  },
  VSS: {
    global: {
      emerging: "26.40",
      developed: "73.60",
    },
  },
  GWX: {
    global: {
      developed: "99.93",
      emerging: "0.07",
    },
  },
  EFA: {
    global: {
      emerging: "0",
      developed: "100",
    },
  },
  AAAU: {
    us: {
      middleBlend: "100",
    },
  },
  ISCG: {
    us: {
      largeGrowth: "0.25500",
      middleValue: "0.55000",
      middleBlend: "4.11300",
      middleGrowth: "7.71900",
      smallValue: "5.92800",
      smallBlend: "38.52200",
      smallGrowth: "42.91300",
    },
  },
  IJS: {
    us: {
      middleGrowth: "0.17100",
      smallValue: "53.50300",
      smallBlend: "38.57500",
      smallGrowth: "7.75100",
    },
  },
  VBR: {
    us: {
      middleValue: "12.60200",
      middleBlend: "13.57200",
      middleGrowth: "5.13600",
      smallValue: "34.36800",
      smallBlend: "30.09800",
      smallGrowth: "4.22400",
    },
  },
  ICLN: {
    us: {
      largeValue: "7.48000",
      largeBlend: "21.71800",
      largeGrowth: "8.98300",
      middleValue: "11.44900",
      middleBlend: "5.42000",
      middleGrowth: "24.80400",
      smallValue: "1.49800",
      smallBlend: "7.04900",
      smallGrowth: "11.59900",
    },
  },
  XLB: {
    us: {
      largeValue: "7.58500",
      largeBlend: "39.70300",
      middleValue: "24.27400",
      middleBlend: "20.07000",
      middleGrowth: "7.82200",
      smallBlend: "0.54600",
    },
  },
  MORT: {
    us: {
      middleValue: "12.74300",
      smallValue: "87.25800",
    },
  },
  TAN: {
    us: {
      largeValue: "2.48500",
      largeBlend: "14.23400",
      middleValue: "0.93800",
      middleBlend: "4.52300",
      middleGrowth: "23.93800",
      smallValue: "5.87000",
      smallBlend: "9.64800",
      smallGrowth: "38.36400",
    },
  },
  IMCB: {
    us: {
      largeValue: "0.32600",
      largeBlend: "4.55400",
      largeGrowth: "3.18100",
      middleValue: "25.39600",
      middleBlend: "40.01200",
      middleGrowth: "24.89700",
      smallValue: "0.81200",
      smallBlend: "0.56900",
      smallGrowth: "0.25200",
    },
  },
  VBK: {
    us: {
      largeBlend: "0.33700",
      middleValue: "1.18100",
      middleBlend: "12.35200",
      middleGrowth: "23.28300",
      smallValue: "4.27600",
      smallBlend: "25.75200",
      smallGrowth: "32.82000",
    },
  },
  VAW: {
    us: {
      largeValue: "1.20700",
      largeBlend: "31.90900",
      largeGrowth: "3.96700",
      middleValue: "17.04900",
      middleBlend: "22.20200",
      middleGrowth: "6.04000",
      smallValue: "7.00100",
      smallBlend: "8.51800",
      smallGrowth: "2.10700",
    },
  },
  QCLN: {
    us: {
      largeValue: "1.54700",
      largeGrowth: "9.94100",
      middleValue: "2.88300",
      middleBlend: "8.33400",
      middleGrowth: "26.51800",
      smallValue: "4.20300",
      smallBlend: "15.58600",
      smallGrowth: "30.98700",
    },
  },
  SCHG: {
    us: {
      largeValue: "1.55700",
      largeBlend: "26.74900",
      largeGrowth: "57.72200",
      middleValue: "1.44500",
      middleBlend: "3.26500",
      middleGrowth: "8.76800",
      smallValue: "0.02600",
      smallBlend: "0.13500",
      smallGrowth: "0.33400",
    },
  },
  SCHD: {
    us: {
      largeValue: "37.42600",
      largeBlend: "39.45700",
      largeGrowth: "1.68400",
      middleValue: "9.93800",
      middleBlend: "7.81900",
      smallValue: "2.89400",
      smallBlend: "0.78200",
    },
  },
  VDC: {
    us: {
      largeValue: "10.52600",
      largeBlend: "56.92700",
      largeGrowth: "1.77400",
      middleValue: "10.08100",
      middleBlend: "10.79200",
      middleGrowth: "1.86700",
      smallValue: "1.90000",
      smallBlend: "4.43000",
      smallGrowth: "1.70300",
    },
  },
  ILCV: {
    us: {
      largeValue: "31.11700",
      largeBlend: "33.93400",
      largeGrowth: "11.75800",
      middleValue: "11.76000",
      middleBlend: "9.77900",
      middleGrowth: "1.10900",
      smallValue: "0.36200",
      smallBlend: "0.16500",
      smallGrowth: "0.01500",
    },
  },
  VUG: {
    us: {
      largeValue: "0.86100",
      largeBlend: "30.91100",
      largeGrowth: "56.21200",
      middleValue: "0.58800",
      middleBlend: "4.44900",
      middleGrowth: "6.93100",
      smallGrowth: "0.04800",
    },
  },
  JMOM: {
    us: {
      largeValue: "6.26300",
      largeGrowth: "22.49800",
      middleValue: "7.87000",
      middleBlend: "11.26600",
      middleGrowth: "13.43100",
      smallValue: "1.25300",
      smallBlend: "3.36600",
      smallGrowth: "1.64600",
    },
  },
  VXUS: {
    global: {
      emerging: "25.11",
      developed: "74.89",
    },
  },
  VIGI: {
    global: {
      emerging: "9.20",
      developed: "90.80",
    },
  },
};

async function main() {
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

  const emerging = await prisma.category.findFirst({
    where: {
      name: "Emerging Markets",
    },
  });

  if (!emerging) {
    throw new Error("Emerging Markets category not found");
  }

  const developed = await prisma.category.findFirst({
    where: {
      name: "Developed Markets",
    },
  });

  if (!developed) {
    throw new Error("Developed Markets category not found");
  }

  Object.keys(tickerToAllocations).forEach(async (ticker) => {
    const allocations = tickerToAllocations[ticker];
    // clear out existing asset rows
    await prisma.asset.deleteMany({
      where: {
        ticker,
      },
    });
    if (allocations.global) {
      await prisma.asset.createMany({
        data: [
          {
            ticker,
            categoryID: emerging.id,
            allocation: Number.parseInt(allocations.global.emerging) / 100,
          },
          {
            ticker,
            categoryID: developed.id,
            allocation: Number.parseInt(allocations.global.developed) / 100,
          },
        ],
      });
    }
    if (allocations.us) {
      await prisma.asset.createMany({
        data: [
          // conditionally add based on allocations.smallValue
          ...(allocations.us.smallValue
            ? [
                {
                  ticker,
                  categoryID: USSmallValue.id,
                  allocation:
                    Number.parseFloat(allocations.us.smallValue) / 100,
                },
              ]
            : []),
          ...(allocations.us.smallBlend
            ? [
                {
                  ticker,
                  categoryID: USSmallBlend.id,
                  allocation:
                    Number.parseFloat(allocations.us.smallBlend) / 100,
                },
              ]
            : []),
          ...(allocations.us.smallGrowth
            ? [
                {
                  ticker,
                  categoryID: USSmallGrowth.id,
                  allocation:
                    Number.parseFloat(allocations.us.smallGrowth) / 100,
                },
              ]
            : []),
          ...(allocations.us.middleGrowth
            ? [
                {
                  ticker,
                  categoryID: USMidGrowth.id,
                  allocation:
                    Number.parseFloat(allocations.us.middleGrowth) / 100,
                },
              ]
            : []),
          ...(allocations.us.middleValue
            ? [
                {
                  ticker,
                  categoryID: USMidValue.id,
                  allocation: Number.parseInt(allocations.us.middleValue) / 100,
                },
              ]
            : []),

          ...(allocations.us.middleBlend
            ? [
                {
                  ticker,
                  categoryID: USMidBlend.id,
                  allocation: Number.parseInt(allocations.us.middleBlend) / 100,
                },
              ]
            : []),
          ...(allocations.us.largeValue
            ? [
                {
                  ticker,
                  categoryID: USLargeValue.id,
                  allocation: Number.parseInt(allocations.us.largeValue) / 100,
                },
              ]
            : []),
          ...(allocations.us.largeBlend
            ? [
                {
                  ticker,
                  categoryID: USLargeBlend.id,
                  allocation: Number.parseInt(allocations.us.largeBlend) / 100,
                },
              ]
            : []),
          ...(allocations.us.largeGrowth
            ? [
                {
                  ticker,
                  categoryID: USLargeGrowth.id,
                  allocation: Number.parseInt(allocations.us.largeGrowth) / 100,
                },
              ]
            : []),
        ],
      });
    }
  });
  console.log("✅ done setting categories");
}

void (async () => main())();
