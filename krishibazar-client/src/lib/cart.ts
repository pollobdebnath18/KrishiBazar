import type { CartLine } from "@/lib/dashboard/data";

const CART_PREFIX = "krishibazar_cart_lines";
const USER_KEY = "user";

export function getCartKey(userId?: string | null): string {
  if (typeof window === "undefined") {
    return `${CART_PREFIX}_guest`;
  }

  const resolvedId = userId ?? readLoggedInUserId();
  if (resolvedId) {
    return `${CART_PREFIX}_${resolvedId}`;
  }

  return `${CART_PREFIX}_guest`;
}

export function readLoggedInUserId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw) as { id?: string };
    return user.id ?? null;
  } catch {
    return null;
  }
}

export function readCart(): CartLine[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getCartKey());
    const cart = raw ? (JSON.parse(raw) as CartLine[]) : [];
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

export function writeCart(cart: CartLine[]) {
  if (typeof window === "undefined") {
    return;
  }

  const key = getCartKey();
  window.localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart:updated"));
}

export function clearCartForCurrentUser() {
  if (typeof window === "undefined") {
    return;
  }

  const userId = readLoggedInUserId();
  if (!userId) {
    return;
  }

  window.localStorage.removeItem(getCartKey(userId));
}
