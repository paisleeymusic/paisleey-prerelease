# Paisleey – Pre-Release Landing Page

> Mobile-first Afro R&B pre-release signup page.  
> Target: **https://paisleeypre.netlify.app**

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
  youtubeVideoId: 'YOUR_UNLISTED_VIDEO_ID',
  releaseDate:    'April 12, 2025',
};
```

Also in `index.html`, swap the YouTube `src` video ID (`dQw4w9WgXcQ`) with the real one.

Platform follow links — search `follow-card` elements and update their `href` attributes.

---

## Form Payload

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

## Deploy

1. Push to `main` branch  
2. Connect repo to Netlify → site name `paisleeypre`  
3. Auto-deploys on every push  

---

## Transfer to Paisleey's Account

Once Paisleey has her own GitHub account:
1. Go to repo Settings → Danger Zone → **Transfer**
2. Enter her GitHub username
3. Netlify re-links automatically

---

See `Antigravity_Prompt_Paisleey_PreRelease.md` for full specification.
