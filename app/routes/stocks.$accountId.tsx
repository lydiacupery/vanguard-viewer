import { Outlet, useParams } from "@remix-run/react";

export default function StocksForAccount() {
  // We accessing the data of the parent "/sales" route
  // instructing Typescript about the type of the returned data

  const params = useParams();
  return (
    <>
      <h1>{`Account: ${params.accountId}`}</h1>
      <Outlet />
    </>
  );
}
