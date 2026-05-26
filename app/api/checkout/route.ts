import { NextResponse } from "next/server";
import { signCheckoutRequest } from "@/lib/checkout-signing";

type CheckoutItem = {
  name: string;
  quantity: number;
  unit_price: number;
  product_id?: string;
};

type Body = {
  items: CheckoutItem[];
  user?: { id: string; email?: string; username?: string };
  currency?: string;
  crypto_currency?: string;
  metadata?: Record<string, unknown>;
  expires_in_minutes?: number;
};

export async function POST(req: Request) {
  const apiUrl = process.env.WAKARI_API_URL?.replace(/\/$/, "");
  const publicKey = process.env.WAKARI_PUBLIC_KEY;
  const secret = process.env.WAKARI_SECRET;

  if (!apiUrl || !publicKey || !secret) {
    return NextResponse.json(
      {
        error:
          "Missing WAKARI_API_URL, WAKARI_PUBLIC_KEY, or WAKARI_SECRET (see env.example)",
      },
      { status: 500 },
    );
  }

  let json: Body;
  try {
    json = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!json.items?.length) {
    return NextResponse.json({ error: "items required" }, { status: 400 });
  }

  const currency =
    json.currency ?? process.env.WAKARI_CHECKOUT_CURRENCY ?? "USD";
  const crypto_currency =
    json.crypto_currency ?? process.env.WAKARI_CHECKOUT_CRYPTO ?? "USDT";

  const user = json.user ?? {
    id: "guest",
    email: "guest@demo.local",
  };

  const payload = {
    user,
    items: json.items,
    currency,
    crypto_currency,
    metadata: {
      source: "marchant-store",
      ...(json.metadata ?? {}),
      ...(user.email ? { customer_email: user.email } : {}),
    },
    ...(json.expires_in_minutes != null
      ? { expires_in_minutes: json.expires_in_minutes }
      : {}),
  };

  const signed = signCheckoutRequest({
    publicKey,
    secret,
    bodyObject: payload,
  });

  const upstream = await fetch(`${apiUrl}/checkout-sessions`, {
    method: "POST",
    headers: signed.headers,
    body: signed.body,
  });

  const text = await upstream.text();
  let data: unknown = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* keep text */
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error: "Wakari API error",
        status: upstream.status,
        detail: data,
      },
      { status: 502 },
    );
  }

  return NextResponse.json(data);
}
