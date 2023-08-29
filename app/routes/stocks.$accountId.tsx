// import { LoaderArgs } from "@remix-run/node";
// import { getAccountsWithHoldings } from "~/models/stock.server";
// import * as react from "react";
// import { useLoaderData } from "@remix-run/react";
// import { getSession } from "~/session.server";

// const loader = async ({ request, params }: LoaderArgs) => {
//   const session = await getSession(request);
//   console.log("account id....", params.accountId);
//   const accountsWithHoldings = await getAccountsWithHoldings({
//     session,
//     filters: {
//       accountId: params.accountId,
//     },
//   });
//   return { accountsWithHoldings };
// };

// export default function StocksForAccount() {
//   const data = useLoaderData<typeof loader>();
//   // todo, put this in a shred place
//   return (
//     <div>
//       <h1>STOCK route (just one of tem)</h1>
//       {data.accountsWithHoldings.map((account) => (
//         <div key={account.account_id}>
//           <h2> Account: {account.name}</h2>
//           <h4> Type: {account.type}</h4>

//           <table>
//             <thead>
//               <td>Name</td>
//               <td>Ticker</td>
//               <td>Close Price</td>
//               <td>Quantity</td>
//               <td>Cost Basis</td>
//               <td>Institution Price</td>
//               <td>Category</td>
//             </thead>
//             <tbody>
//               {(account.holdings || []).map((holding) => (
//                 <tr key={holding.security.name}>
//                   <td style={{ padding: "20px" }}>
//                     {holding.security.ticker_symbol}
//                   </td>
//                   <td style={{ padding: "20px" }}>{holding.security.type}</td>
//                   <td style={{ padding: "20px" }}>
//                     {holding.security.close_price}
//                   </td>
//                   <td style={{ padding: "20px" }}>{holding.quantity}</td>
//                   <td style={{ padding: "20px" }}>{holding.cost_basis}</td>
//                   <td style={{ padding: "20px" }}>
//                     {holding.institution_price}
//                   </td>
//                   <td>{holding.category}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }
