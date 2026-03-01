# Paisleey – Pre-Release Landing Page

> Mobile-first Afro R&B pre-release signup page.  
> Live at: **<https://paisleeypre.netlify.app>**

---

## Stack

- Pure HTML / CSS / Vanilla JS  
- YouTube IFrame API (watch-time tracking)  
- Netlify (static hosting, auto-deploy from `main`)  
- OpenClaw webhook (form submissions + analytics events)

---

## File Structure

```
.
├── index.html        ← Full page markup
├── style.css         ← Design system + responsive layout
├── script.js         ← Form logic, validation, YouTube tracking, webhooks
├── netlify.toml      ← Netlify publish config
└── README.md         ← This file
```

---

## Before Going Live – Customise These

Open `script.js` and update the `CONFIG` object at the top:

```js
const CONFIG = {
  webhookUrl:     'https://YOUR-OPENCLAW-DOMAIN/paisleey/landing-form',
  youtubeVideoId: 'T8ywL5iAWME',
  releaseDate:    '2026',
};
```

Also update `index.html`:

- YT Video ID: `T8ywL5iAWME`
- Platform follow links: updated to @paisleeyke

---

## Form Payload

On submission the page POSTs to the OpenClaw webhook:

```json
{
  "name": "string",
  "email": "string",
  "phone": "string (E.164, only if WhatsApp selected)",
  "platforms_selected": ["instagram", "tiktok"],
  "timestamp": "ISO 8601",
  "video_duration_watched": "mm:ss",
  "referrer": "utm_source or document.referrer"
}
```

---

## Analytics Events

Platform follow card clicks fire a separate POST to:

```
/paisleey/events
```

with `{ event: "follow_click", platform: "instagram", timestamp, referrer }`.

---

## Deploy

1. Push to `main` branch  
2. Connect repo to Netlify → site name `paisleeypre`  
3. Auto-deploys on every push  

---

## Questions?

See `Antigravity_Prompt_Paisleey_PreRelease.md` for full specification.
