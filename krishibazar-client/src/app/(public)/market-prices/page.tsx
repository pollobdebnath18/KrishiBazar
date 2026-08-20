import type { Metadata } from "next";
import MarketPricesContent, {
  type MarketPricesFilters,
} from "./MarketPricesContent";

export const metadata: Metadata = {
  title: "দৈনিক বাজার দর | KrishiBazar",
};

interface MarketPricesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readString(value: string | string[] | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export default async function MarketPricesPage({
  searchParams,
}: MarketPricesPageProps) {
  const params = await searchParams;

  const initialFilters: MarketPricesFilters = {
    search: readString(params.search),
    category: readString(params.category),
    location: readString(params.location),
    status: readString(params.status),
  };

  return <MarketPricesContent initialFilters={initialFilters} />;
}