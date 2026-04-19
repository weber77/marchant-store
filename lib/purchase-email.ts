import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/** WakaPay brand colors (logo: pink/magenta → deep purple) */
const BRAND = {
  primary: "#8E24AA",
  primaryDark: "#6A1B9A",
  accent: "#E91E63",
  deepPurple: "#4A148C",
  text: "#1a1a2e",
  textMuted: "#374151",
  muted: "#6b7280",
  border: "#e5e7eb",
  cardBg: "#ffffff",
  bodyBg: "#f8f4fa",
} as const;

const SOCIAL_ICON_URLS = {
  x: "https://outrzdocekyknsweqasm.supabase.co/storage/v1/object/public/assets/icons/x.svg",
  facebook:
    "https://outrzdocekyknsweqasm.supabase.co/storage/v1/object/public/assets/icons/fb.svg",
  instagram:
    "https://outrzdocekyknsweqasm.supabase.co/storage/v1/object/public/assets/icons/ig.svg",
  linkedin:
    "https://outrzdocekyknsweqasm.supabase.co/storage/v1/object/public/assets/icons/in.svg",
} as const;

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASSWORD must be set to send email");
  }
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  return transporter;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getLogoHeaderHtml(): string {
  const logoUrl = process.env.WAKAPAY_LOGO_URL?.trim();
  if (!logoUrl) return "";
  return `
      <div style="text-align: center; padding: 24px 0 20px 0;">
        <img src="${escapeHtml(logoUrl)}" alt="WakaPay" width="80" height="80" style="display: inline-block; max-width: 80px; height: auto;" />
      </div>`;
}

function getFooterHtml(): string {
  const companyName = process.env.COMPANY_NAME || "WakaPay";
  const address = process.env.COMPANY_ADDRESS || "";
  const xUrl = process.env.SOCIAL_X_URL || "#";
  const facebookUrl = process.env.SOCIAL_FACEBOOK_URL || "#";
  const instagramUrl = process.env.SOCIAL_INSTAGRAM_URL || "#";
  const linkedinUrl = process.env.SOCIAL_LINKEDIN_URL || "#";
  const websiteUrl = process.env.FRONTEND_URL || "https://wakapay.com";
  const currentYear = new Date().getFullYear();
  const iconStyle =
    "display: inline-block; vertical-align: middle; width: 20px; height: 20px; border: 0;";
  const linkStyle =
    "margin: 0 8px; text-decoration: none; display: inline-block;";
  return `
      <div style="margin-top: 32px; padding: 24px 20px; text-align: center; border-top: 1px solid ${BRAND.border}; color: ${BRAND.muted}; font-size: 0.8rem;">
        <div style="margin-bottom: 12px;">
          <a href="${escapeHtml(xUrl)}" style="${linkStyle}" aria-label="X"><img src="${SOCIAL_ICON_URLS.x}" alt="X" width="20" height="20" style="${iconStyle}" /></a>
          <a href="${escapeHtml(facebookUrl)}" style="${linkStyle}" aria-label="Facebook"><img src="${SOCIAL_ICON_URLS.facebook}" alt="Facebook" width="20" height="20" style="${iconStyle}" /></a>
          <a href="${escapeHtml(instagramUrl)}" style="${linkStyle}" aria-label="Instagram"><img src="${SOCIAL_ICON_URLS.instagram}" alt="Instagram" width="20" height="20" style="${iconStyle}" /></a>
          <a href="${escapeHtml(linkedinUrl)}" style="${linkStyle}" aria-label="LinkedIn"><img src="${SOCIAL_ICON_URLS.linkedin}" alt="LinkedIn" width="20" height="20" style="${iconStyle}" /></a>
        </div>
        <p style="margin: 0 0 4px 0;">©${currentYear} ${escapeHtml(companyName)}. All rights reserved.</p>
        ${address ? `<p style="margin: 0 0 8px 0;">${escapeHtml(address)}</p>` : ""}
        <p style="margin: 0;"><a href="${escapeHtml(websiteUrl)}" style="color: ${BRAND.primary}; text-decoration: none;">${escapeHtml(websiteUrl.replace(/^https?:\/\//, ""))}</a></p>
      </div>`;
}

function formatDetailRows(data: Record<string, unknown>): string {
  const rows: { k: string; v: string }[] = [];
  const order = [
    "checkout_session_id",
    "session_id",
    "status",
    "total_amount_crypto",
    "crypto_currency",
    "wallet_address",
    "expires_at",
    "payment_id",
    "tx_hash",
    "amount",
    "cumulative_amount",
    "expected_amount",
    "network",
    "overpaid",
  ];
  const seen = new Set<string>();
  for (const k of order) {
    if (k in data && data[k] !== undefined && data[k] !== null) {
      rows.push({ k, v: String(data[k]) });
      seen.add(k);
    }
  }
  for (const k of Object.keys(data).sort()) {
    if (seen.has(k) || k === "user" || k === "metadata") continue;
    const v = data[k];
    if (v !== undefined && v !== null && typeof v !== "object") {
      rows.push({ k, v: String(v) });
    }
  }
  if (!rows.length) return "<p>No details.</p>";
  return `<table style="width:100%; border-collapse:collapse; font-size: 0.9rem;">
    ${rows
      .map(
        (r) =>
          `<tr><td style="padding:8px 12px; border-bottom:1px solid ${BRAND.border}; color:${BRAND.muted};">${escapeHtml(r.k)}</td><td style="padding:8px 12px; border-bottom:1px solid ${BRAND.border}; word-break:break-all;">${escapeHtml(r.v)}</td></tr>`,
      )
      .join("")}
  </table>`;
}

function subjectAndLead(event: string): { subject: string; lead: string } {
  switch (event) {
    case "payment.created":
      return {
        subject: "Your order — complete crypto payment",
        lead: "We’ve started your checkout session. Complete payment before it expires.",
      };
    case "payment.paid":
      return {
        subject: "Payment received — thank you",
        lead: "Your crypto payment was confirmed. Thank you for your purchase.",
      };
    case "payment.expired":
      return {
        subject: "Checkout session expired",
        lead: "This checkout session is no longer valid. You can start a new order from the store anytime.",
      };
    default:
      return {
        subject: `Order update: ${event}`,
        lead: "Your order status was updated.",
      };
  }
}

export async function sendPurchaseStatusEmail(args: {
  to: string;
  event: string;
  data: Record<string, unknown>;
  customerName?: string;
}): Promise<void> {
  const { to, event, data, customerName } = args;
  const from =
    process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim() || "";
  if (!from) throw new Error("SMTP_FROM or SMTP_USER required");

  const name =
    customerName ||
    (typeof data.user === "object" &&
    data.user &&
    "username" in data.user &&
    typeof (data.user as { username?: string }).username === "string"
      ? (data.user as { username: string }).username
      : to.split("@")[0]);

  const { subject, lead } = subjectAndLead(event);
  const storeUrl = process.env.STORE_PUBLIC_URL || process.env.FRONTEND_URL || "";
  const extraUser =
    data.user && typeof data.user === "object"
      ? `<pre style="margin:12px 0; padding:12px; background:#f5f5f5; border-radius:8px; font-size:12px; overflow:auto;">${escapeHtml(JSON.stringify(data.user, null, 2))}</pre>`
      : "";
  const extraMeta =
    data.metadata && typeof data.metadata === "object"
      ? `<pre style="margin:12px 0; padding:12px; background:#f5f5f5; border-radius:8px; font-size:12px; overflow:auto;">${escapeHtml(JSON.stringify(data.metadata, null, 2))}</pre>`
      : "";

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.6;
      color: ${BRAND.textMuted};
      margin: 0;
      padding: 0;
      background-color: ${BRAND.bodyBg};
    }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card {
      background: ${BRAND.cardBg};
      border-radius: 12px;
      padding: 28px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
    }
    h2 { color: ${BRAND.text}; font-weight: 600; margin-top: 0; }
    .cta {
      display: inline-block;
      padding: 12px 24px;
      background: ${BRAND.primary};
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      margin: 16px 0 0 0;
      font-weight: 600;
    }
    .muted { color: ${BRAND.muted}; font-size: 0.875rem; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    ${getLogoHeaderHtml()}
    <div class="card">
      <h2>${escapeHtml(subject)}</h2>
      <p>Hi ${escapeHtml(name)},</p>
      <p>${escapeHtml(lead)}</p>
      ${formatDetailRows(data)}
      ${extraUser ? `<p style="font-size:0.85rem; color:${BRAND.muted}; margin-top:16px;">User</p>${extraUser}` : ""}
      ${extraMeta ? `<p style="font-size:0.85rem; color:${BRAND.muted}; margin-top:16px;">Metadata</p>${extraMeta}` : ""}
      ${
        storeUrl
          ? `<p style="margin-top:20px;"><a href="${escapeHtml(storeUrl)}" class="cta">Back to store</a></p>`
          : ""
      }
      <p class="muted">If you did not place this order, you can ignore this message.</p>
    </div>
    ${getFooterHtml()}
  </div>
</body>
</html>`;

  const textLines = [
    subject,
    "",
    `Hi ${name},`,
    "",
    lead,
    "",
    ...Object.entries(data).map(([k, v]) =>
      typeof v === "object" ? `${k}: ${JSON.stringify(v)}` : `${k}: ${v}`,
    ),
    storeUrl ? `\nStore: ${storeUrl}` : "",
  ];

  await getTransporter().sendMail({
    from,
    to,
    subject,
    text: textLines.join("\n"),
    html,
  });
}
