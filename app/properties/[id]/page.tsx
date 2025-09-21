import Clientpage from "./Clientpage";

const Page = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  return <Clientpage id={id} />;
};

export default Page;
