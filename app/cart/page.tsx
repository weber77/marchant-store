"use client";

import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";

type CheckoutResponse = {
  checkout_url?: string;
  session_id?: string;
};

async function postCheckout(items: ReturnType<typeof buildItems>) {
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
  return url;
}

function buildItems(lines: ReturnType<typeof useCart>["lines"]) {
  return lines.map((l) => ({
    name: l.product.name,
    quantity: l.quantity,
    unit_price: l.product.unitPrice,
    product_id: l.product.id,
  }));
}

export default function CartPage() {
  const { lines, setQty, remove, clear } = useCart();

  const checkoutMutation = useMutation({
    mutationFn: async () => postCheckout(buildItems(lines)),
    onMutate: () => {
      toast.loading("Creating checkout session…", { id: "checkout" });
    },
    onSuccess: (url) => {
      toast.success("Redirecting to secure checkout…", { id: "checkout" });
      window.location.href = url;
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Checkout failed", {
        id: "checkout",
      });
    },
  });

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
            <Button
              type="button"
              disabled={checkoutMutation.isPending}
              onClick={() => checkoutMutation.mutate()}
            >
              {checkoutMutation.isPending ? "Starting checkout…" : "Pay with crypto"}
            </Button>
            <button
              type="button"
              onClick={() => {
                clear();
                toast.info("Cart cleared");
              }}
              className="text-sm text-zinc-500 underline"
            >
              Clear cart
            </button>
          </div>
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
