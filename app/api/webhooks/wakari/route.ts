import { NextResponse } from "next/server";
import { sendPurchaseStatusEmail } from "@/lib/purchase-email";
import { verifyWakariWebhookSignature } from "@/lib/wakari-webhook-verify";

export const dynamic = "force-dynamic";

type WakariWebhookBody = {
  event?: string;
  data?: Record<string, unknown>;
};

function resolveCustomerEmail(data: Record<string, unknown>): string | null {
  const user = data.user as { email?: string } | undefined;
  if (user?.email && typeof user.email === "string") return user.email.trim();

  const meta = data.metadata as Record<string, unknown> | undefined;
  if (meta) {
    const a = meta.customer_email ?? meta.email;
    if (typeof a === "string" && a.includes("@")) return a.trim();
  }

  return null;
}

function resolveCustomerName(
  data: Record<string, unknown>,
): string | undefined {
  const user = data.user as { username?: string; name?: string } | undefined;
  if (user?.username) return user.username;
  if (user?.name) return user.name;
  const meta = data.metadata as Record<string, unknown> | undefined;
  const n = meta?.customer_name;
  if (typeof n === "string") return n;
  return undefined;
}

const EMAIL_EVENTS = new Set([
  "payment.created",
  "payment.paid",
  "payment.expired",
]);

export async function POST(req: Request) {
  const signingSecret = process.env.WAKARI_WEBHOOK_SECRET?.trim();
  if (!signingSecret) {
    console.error("WAKARI_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook signing not configured" },
      { status: 500 },
    );
  }

  const rawBody = await req.text();
  const sig = req.headers.get("x-wakari-signature");
  const ts = req.headers.get("x-wakari-timestamp");
  if (!sig || !ts) {
    return NextResponse.json(
      { error: "Missing signature headers" },
      { status: 401 },
    );
  }

  const ok = verifyWakariWebhookSignature({
    signingSecret,
    rawBody,
    timestamp: ts,
    signatureHex: sig,
  });
  if (!ok) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: WakariWebhookBody;
  try {
    body = JSON.parse(rawBody) as WakariWebhookBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = body.event ?? req.headers.get("x-wakari-event") ?? "";
  const data =
    body.data && typeof body.data === "object"
      ? body.data
      : ({} as Record<string, unknown>);

  if (!EMAIL_EVENTS.has(event)) {
    return NextResponse.json({ received: true, emailed: false });
  }
  console.log("data", data);
  const to = data.email as string;
  if (!to) {
    console.warn(
      "Wakari webhook: no customer email on payload; set user.email or metadata.customer_email when creating checkout",
      { event, checkout_session_id: data.checkout_session_id },
    );
    return NextResponse.json({
      received: true,
      emailed: false,
      reason: "no_email",
    });
  }

  try {
    await sendPurchaseStatusEmail({
      to,
      event,
      data,
      customerName: (to as string).split("@")[0] as string,
    });
  } catch (e) {
    console.error("Purchase email failed:", e);
    /** Still 200 so Wakari does not retry indefinitely on SMTP issues; monitor logs. */
    return NextResponse.json({
      received: true,
      emailed: false,
      error: "email_failed",
    });
  }

  return NextResponse.json({ received: true, emailed: true });
}
