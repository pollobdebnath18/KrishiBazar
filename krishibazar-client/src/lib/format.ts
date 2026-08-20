import type { MarketPrice, PriceStatus } from "@/types/marketPrice";

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[Number(digit)]);
}

export function formatPrice(price: number): string {
  return `${toBengaliDigits(price)} ৳`;
}

export function formatQuantity(quantity: number, unit: string): string {
  return `${toBengaliDigits(quantity)} ${unit}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return toBengaliDigits(dateString);
    return date.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return toBengaliDigits(dateString);
  }
}

export function resolvePriceStatus(marketPrice: MarketPrice): PriceStatus {
  const { price, previousPrice, priceStatus } = marketPrice;

  if (previousPrice !== null && previousPrice !== undefined) {
    if (price > previousPrice) return "increased";
    if (price < previousPrice) return "decreased";
    return "stable";
  }

  const raw = (priceStatus ?? "").toLowerCase();
  if (
    raw.includes("increase") ||
    raw === "up" ||
    raw === "high" ||
    raw.includes("বেড়ে") ||
    raw.includes("বেশি")
  ) {
    return "increased";
  }
  if (
    raw.includes("decrease") ||
    raw === "down" ||
    raw === "low" ||
    raw.includes("কমে") ||
    raw.includes("কম")
  ) {
    return "decreased";
  }
  return "stable";
}