import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OrderItem } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function consolidateOrderItems(items: OrderItem[]): OrderItem[] {
  if (!items || !Array.isArray(items)) return [];
  const map = new Map<string, OrderItem>();

  for (const item of items) {
    if (!item) continue;
    const key = (item.productId || item.name || "").trim().toLowerCase();
    if (!key) continue;

    const existing = map.get(key);
    if (existing) {
      existing.qty += Number(item.qty || 1);
      if (item.isAddon) existing.isAddon = true;
      if (item.addedAt && !existing.addedAt) existing.addedAt = item.addedAt;
      if (item.round && item.round > (existing.round || 1)) existing.round = item.round;
    } else {
      map.set(key, { ...item, qty: Number(item.qty || 1) });
    }
  }

  return Array.from(map.values());
}
