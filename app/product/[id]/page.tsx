import Product from "@/components/product/product ";
export default async function Page({ params }: { params: { id: string } }) {
  const resolvedParams = await params; // ID-ni kutib olamiz

  return <Product id={resolvedParams.id} />;
}
