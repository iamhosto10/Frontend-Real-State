"use client";

import Clientpage from "./Clientpage";
import { useSearchParams } from "next/navigation";

const Page = async () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const idProperty = searchParams.get("idProperty");
  const name = searchParams.get("name");
  const dateSale = searchParams.get("dateSale");
  const value = searchParams.get("value");
  const tax = searchParams.get("tax");

  return (
    <Clientpage
      id={id}
      dateSale={dateSale}
      idProperty={idProperty}
      name={name}
      tax={tax}
      value={value}
    />
  );
};

export default Page;
