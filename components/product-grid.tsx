"use client";

import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart-context";

export function ProductGrid() {
  const { add } = useCart();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {PRODUCTS.map((p) => (
        <article
          key={p.id}
          className="flex flex-col rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <div className="text-4xl" aria-hidden>
            {p.imageEmoji}
          </div>
          <h2 className="mt-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {p.name}
          </h2>
          <p className="mt-1 flex-1 text-sm text-zinc-600 dark:text-zinc-400">
            {p.description}
          </p>
          <p className="mt-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {p.currency} {p.unitPrice.toFixed(2)}
          </p>
          <button
            type="button"
            onClick={() => add(p.id, 1)}
            className="mt-3 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            Add to cart
          </button>
        </article>
      ))}
    </div>
  );
}
