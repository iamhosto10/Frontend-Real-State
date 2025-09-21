import Clientpage from "./Clientpage";
import { Suspense } from "react";

const Page = async () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Clientpage />
    </Suspense>
  );
};

export default Page;
