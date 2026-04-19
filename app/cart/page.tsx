"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

type CheckoutResponse = {
  checkout_url?: string;
  session_id?: string;
};

export default function CartPage() {
  const { lines, setQty, remove, clear } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function payWithCrypto() {
    setError(null);
    setBusy(true);
    try {
      const items = lines.map((l) => ({
        name: l.product.name,
        quantity: l.quantity,
        unit_price: l.product.unitPrice,
        product_id: l.product.id,
      }));
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          user: {
            id: "demo-customer",
            email: "weberdubois@givam.me",
          },
        }),
      });
      const data = (await res.json()) as CheckoutResponse & {
        error?: string;
        detail?: unknown;
      };
      if (!res.ok) {
        const msg =
          typeof data.detail === "object" && data.detail !== null
            ? JSON.stringify(data.detail)
            : (data.error ?? "Checkout failed");
        throw new Error(msg);
      }
      const url = data.checkout_url;
      if (!url) {
        throw new Error("No checkout_url in response");
      }
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Cart
      </h1>
      {lines.length === 0 ? (
        <p className="mt-6 text-sm text-zinc-600 dark:text-zinc-400">
          Your cart is empty.{" "}
          <Link href="/" className="font-medium underline">
            Browse products
          </Link>
          .
        </p>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-zinc-200 dark:divide-zinc-800">
            {lines.map((line) => (
              <li
                key={line.product.id}
                className="flex flex-wrap items-center justify-between gap-4 py-4"
              >
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {line.product.name}
                  </p>
                  <p className="text-sm text-zinc-500">
                    {line.product.currency} {line.product.unitPrice.toFixed(2)}{" "}
                    each
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    Qty
                    <input
                      type="number"
                      min={1}
                      className="w-16 rounded-md border border-zinc-300 bg-white px-2 py-1 dark:border-zinc-700 dark:bg-zinc-900"
                      value={line.quantity}
                      onChange={(e) =>
                        setQty(line.product.id, Number(e.target.value) || 1)
                      }
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => remove(line.product.id)}
                    className="text-xs text-red-600 underline dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              disabled={busy}
              onClick={payWithCrypto}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {busy ? "Starting checkout…" : "Pay with crypto"}
            </button>
            <button
              type="button"
              onClick={() => clear()}
              className="text-sm text-zinc-500 underline"
            >
              Clear cart
            </button>
          </div>
          {error ? (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          ) : null}
          <p className="mt-6 text-xs text-zinc-500">
            Checkout is created server-side with HMAC. Configure keys in{" "}
            <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">
              env.example
            </code>
            .
          </p>
        </>
      )}
    </div>
  );
}
