import type { Metadata } from "next";
import ProductsContent, { type ProductsFilters } from "./ProductsContent";

export const metadata: Metadata = {
  title: "পণ্যসমূহ | KrishiBazar",
};

interface ProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readString(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const initialFilters: ProductsFilters = {
    search: readString(params.search),
    category: readString(params.category),
    location: readString(params.location),
  };

  return <ProductsContent initialFilters={initialFilters} />;
}
