import { Suspense } from "react";
import Clientpage from "./Clientpage";

const Page = async () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Clientpage />
    </Suspense>
  );
};

export default Page;
