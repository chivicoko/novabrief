# NovaBrief — Setup Reference

Condensed setup guide. For full context on architecture decisions and known constraints, see `README.md`.

---

## 1. Install

```bash
pnpm install
# or: npm install
```

---

## 2. Environment Variables

```bash
cp env.example .env.local
```

Fill in `.env.local`. The ones that will bite you if wrong:

| Variable | Common mistake |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Using anon key here — Inngest functions and Stripe webhook will fail silently |
| `INNGEST_SIGNING_KEY` | Leave commented out locally — breaks dev server signature validation |
| `INNGEST_EVENT_KEY` | Required in production for `inngest.send()` to authenticate |
| `EMAILJS_PRIVATE_KEY` | Missing this breaks Node.js sends even if public key is correct |
| `NEWS_API_KEY` | After renaming from `NEXT_PUBLIC_`, restart the dev server or it stays undefined |
| `NEXT_PUBLIC_APP_URL` | Set to production domain before deploying — affects OG tags and metadataBase |

---

## 3. Supabase

Run both SQL blocks from `README.md` → Database Setup in your Supabase SQL editor. Then:

- Project Settings → API → copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
- Auth → URL Configuration → add `http://localhost:3000` to redirect URLs

---

## 4. EmailJS

1. Create a service (Gmail/Outlook/etc.) at [dashboard.emailjs.com](https://dashboard.emailjs.com)
2. Create a template. Required variable mappings:
   - **To Email**: `{{to_email}}`
   - **Body**: `{{{newsletter_content}}}` (triple braces for HTML rendering)
   - Also available: `{{categories}}`, `{{article_count}}`, `{{current_date}}`
3. Account → Security → enable **"Allow ServerSide (Node.js) requests"**
4. Copy Service ID, Template ID, Public Key, Private Key → `.env.local`

---

## 5. Gemini

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Create an API key (free tier, no billing required)
3. Add to `.env.local` as `GEMINI_API_KEY`

---

## 6. Stripe (local)

```bash
# Install Stripe CLI if not already: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks
```

The CLI outputs a webhook signing secret — use that as `STRIPE_WEBHOOK_SECRET`. It changes each time you run `stripe listen`.

Create your products in the Stripe dashboard (test mode), copy the Price IDs to `STRIPE_MONTHLY_PRICE_ID` and `STRIPE_YEARLY_PRICE_ID`.

---

## 7. Running

Three terminals:

```bash
# 1 — App
pnpm dev

# 2 — Inngest dev server
pnpm dlx inngest-cli dev -u http://localhost:3000/api/inngest

# 3 — Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks
```

Verify:

```bash
curl http://localhost:3000/api/inngest
# Must return JSON, not a redirect. If redirected → check middleware whitelist.
```

Inngest UI → `http://localhost:8288` → Apps tab → app should be synced with `newsletter/scheduled` listed.

---

## 8. PWA Icons

The `public/icons/` directory needs actual PNG files before the PWA installs correctly. Generate them from your logo:

```bash
pnpm add -D sharp
node -e "
const sharp = require('sharp');
[72,96,128,144,152,192,384,512].forEach(s =>
  sharp('public/novabrief2.png').resize(s,s).toFile('public/icons/icon-' + s + 'x' + s + '.png')
);
"
```

---

## 9. Deploy to Vercel

```bash
vercel --prod
```

Post-deploy:
1. Add all env vars to Vercel dashboard (Settings → Environment Variables)
2. Inngest Cloud → Apps → Add App → `https://yourdomain.com/api/inngest`
3. Stripe dashboard → Webhooks → Add endpoint → `https://yourdomain.com/api/webhooks` → events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Supabase Auth → URL Configuration → add production domain to Site URL and Redirect URLs
5. NewsAPI: free tier blocks production server-side requests — upgrade or swap API before launch
