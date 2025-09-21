"use client";

import Clientpage from "./Clientpage";
import { useSearchParams } from "next/navigation";

const Page = async () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const idProperty = searchParams.get("idProperty");
  const file = searchParams.get("file");

  return (
    <Clientpage
      id={id}
      enabled={searchParams.get("enabled") === "true"}
      file={file}
      idProperty={idProperty}
    />
  );
};

export default Page;
