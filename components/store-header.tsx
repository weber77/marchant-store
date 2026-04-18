"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export function StoreHeader() {
  const { lines } = useCart();
  const count = lines.reduce((n, l) => n + l.quantity, 0);

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          Marchant demo store
        </Link>
        <Link
          href="/cart"
          className="rounded-full border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-600"
        >
          Cart{count ? ` (${count})` : ""}
        </Link>
      </div>
    </header>
  );
}
