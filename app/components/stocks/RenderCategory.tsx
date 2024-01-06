import { AccordionContent } from "@radix-ui/react-accordion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import type { CategoryNode } from "~/models/stock.server";
import { RenderHoldings } from "./RenderHoldings";

export const RenderCategory = ({
  row,
  totalAmount,
  depth,
}: {
  row: CategoryNode;
  totalAmount?: number;
  depth: number;
}) => {
  const targetAllocation =
    row.targetAllocation &&
    (totalAmount || 0) *
      (Number.parseFloat(row.targetAllocation.toString()) || 0);

  const differenceBetweenActualAndTarget =
    (row.total || 0) - (targetAllocation || 0);
  return (
    <Accordion type="multiple">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <div className="flex w-full gap-24  px-10">
            <h4 style={{ width: 300, textAlign: "left" }}>
              {"\u25B6\uFE0F".repeat(depth)} Category: {row.category}
            </h4>

            <p style={{ width: 200, textAlign: "left" }}>
              Target Allocation:{" "}
              {targetAllocation
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(targetAllocation)
                : "-"}
            </p>
            <p style={{ width: 200 }}>
              Actual Allocation:{" "}
              {row.total
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(row.total)
                : "-"}
            </p>
            <p
              style={{
                color: differenceBetweenActualAndTarget > 0 ? "green" : "red",
                width: 200,
                padding: 2,
                // show a border if the difference is greater than 1000
                border:
                  differenceBetweenActualAndTarget > 1000
                    ? "2px solid green"
                    : differenceBetweenActualAndTarget < -1000
                    ? "2px solid red"
                    : undefined,
              }}
            >
              Difference
              {
                // show plus or minus based on differenceBetweenTargetAndActual
                differenceBetweenActualAndTarget > 0 ? "+" : ""
              }
              {targetAllocation
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(differenceBetweenActualAndTarget)
                : "-"}
            </p>
          </div>
        </AccordionTrigger>
        <AccordionContent
          style={{
            background: `rgba(160, 194, 194,${depth / 10})`,
          }}
        >
          {row.children.length ? (
            <>
              {row.children.map((child) => (
                <RenderCategory
                  row={child}
                  key={child.id}
                  totalAmount={totalAmount}
                  depth={depth + 1}
                />
              ))}
            </>
          ) : (
            <div className="pl-20">
              <RenderHoldings row={row.holdings} />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
