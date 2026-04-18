import { ProductGrid } from "@/components/product-grid";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Static demo catalog
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Add items to the cart, then pay with crypto. The store calls your Next.js{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">/api/checkout</code>{" "}
          route, which signs{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">POST /checkout-sessions</code>{" "}
          on the Wakari API and redirects to the returned{" "}
          <code className="rounded bg-zinc-100 px-1 dark:bg-zinc-900">checkout_url</code>.
        </p>
      </div>
      <div className="mt-10">
        <ProductGrid />
      </div>
    </div>
  );
}
