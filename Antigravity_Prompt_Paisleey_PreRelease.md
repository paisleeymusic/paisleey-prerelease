# Paisleey Pre-Release Landing Page - Antigravity Build Prompt

## **Project Overview**
Build a mobile-first landing page for Paisleey (Afro R&B artist) to drive pre-release signups across multiple platforms. The page will embed an unlisted YouTube video, collect contact information via form, and direct users to follow on social media platforms.

**Domain:** paisleeypre.netlify.app  
**Primary Goal:** Collect email + platform selections. Direct to social follows.  
**Auto-deploy:** Antigravity → GitHub → Netlify

---

## **Page Structure & Framework**

### **Section 1: Hero**
- **Layout:** Full-width, mobile-optimized
- **Background:** Subtle gradient or solid color (Afro R&B vibe - deep colors recommended: navy, burgundy, or dark purple)
- **Content:**
  - Headline: "Exclusive Pre-Release 🎵"
  - Subheading: "Hear it first. Join the inner circle."
  - Embedded YouTube player (unlisted video - audio only for now, placeholder until video ID added)
  - Small metadata text: "Out [release date] everywhere"

---

### **Section 2: Form**
- **Layout:** Center-aligned, clean, minimal
- **Background:** Slightly contrasting from hero (light overlay on background, or white)
- **Form Title:** "Join Paisleey's Pre-Release List"
- **Form Fields:**
  1. **Name** (text input, required)
     - Placeholder: "Your name"
  2. **Email** (email input, required)
     - Placeholder: "your@email.com"
  3. **Platform Selection** (required - user must select at least ONE)
     - Display as: Clickable checkbox buttons/cards (visual, not dropdown)
     - Options: Instagram | YouTube | TikTok | X | WhatsApp
     - User can select multiple
     - When WhatsApp selected: Phone field appears below (required for WhatsApp only)
  4. **Phone Number** (text input, conditional)
     - Only appears if WhatsApp is selected
     - Placeholder: "+254712345678"
     - Format hint: "Include country code"
     - Required if WhatsApp selected

- **Form Button:** "Subscribe & Follow"
  - Primary color (brand color - recommend Paisleey's brand color if available, otherwise vibrant accent: gold, teal, or coral)
  - On hover: Subtle animation (scale/glow)
  - On submit: Validate all required fields
  - Error state: Show validation errors above button in red

- **Form Behavior:**
  - Validation: Name (not empty), Email (valid format), Platform (at least one selected), Phone (valid E.164 format if WhatsApp selected)
  - On valid submission: POST to webhook endpoint `https://[openclaw-domain]/paisleey/landing-form` with payload: `{name, email, phone (if provided), platforms_selected[], timestamp, video_duration_watched, referrer}`
  - On success: Show confirmation message and reveal platform buttons below
  - Track video watch duration before/during form completion

---

### **Section 3: Platform Buttons (Post-Form)**
- **Visibility:** Hidden until form successfully submits
- **Layout:** Grid (2 columns on mobile, 3 columns on tablet+)
- **Button Cards:** 5 total
  - Instagram (Instagram blue)
  - YouTube (YouTube red)
  - TikTok (TikTok black/white)
  - X / Twitter (X black)
  - WhatsApp (WhatsApp green)
- **Each Button:**
  - Icon (platform icon)
  - Label: "Follow [Platform]"
  - Link: Direct to platform URL (links TBD, to be added later)
  - On click: Open in new tab + log click to analytics
  - Hover state: Color change or scale effect

---

### **Section 4: Footer (Optional)**
- **Layout:** Minimal
- **Content:** 
  - "Questions? Reply to welcome email or DM @paisleey on any platform"
  - Copyright year
- **Background:** Match hero or slightly darker

---

## **Design Specifications**

### **Color Palette**
- **Primary/Background:** Deep color (navy #1a1a2e, burgundy #4a1a2e, or dark purple #2d1b4e)
- **Accent/CTA:** Vibrant contrast (gold #ffd700, teal #20c997, coral #ff6b6b, or Paisleey brand color if available)
- **Text:** White or light gray (#f0f0f0)
- **Form backgrounds:** Slightly lighter overlay (rgba of primary, 20% opacity)
- **Error text:** Red (#ff4444)

### **Typography**
- **Headline (H1):** Bold, large (3-4rem on desktop, 2rem on mobile)
- **Subheading (H2):** Medium weight, slightly smaller (1.5rem on desktop, 1.2rem on mobile)
- **Form labels:** Small, regular weight (0.9rem)
- **Form inputs:** Regular weight, readable (1rem)
- **Button text:** Bold, medium (1rem)
- **Font family:** Modern sans-serif (Poppins, Inter, Montserrat, or system fonts for speed)

### **Spacing**
- **Padding:** 1.5rem on mobile, 2rem on tablet, 3rem on desktop
- **Section gaps:** 2rem between sections
- **Form field gaps:** 1rem between inputs
- **Button gaps:** 1rem between platform buttons

### **Interactive Elements**
- **Form inputs on focus:** Border color change to accent color, subtle glow
- **Platform buttons on hover:** Scale up 105%, color shift, shadow increase
- **CTA button on hover:** Brightness increase, smooth transition (0.3s)
- **Video player:** Rounded corners (8-12px)

### **Responsive Design**
- **Mobile first:** All elements stack vertically on mobile (<768px)
- **Tablet (768px+):** Form wider, platform buttons 2-column grid
- **Desktop (1024px+):** Form max-width 600px centered, platform buttons 3-column grid, hero video wider
- **All screens:** Full viewport width, no horizontal scroll

### **Performance**
- **Images:** Optimize before upload (compress)
- **Video embed:** Use YouTube embed for fast loading (iframe)
- **Animations:** Use CSS transitions (no heavy libraries)
- **Mobile view:** Prioritize performance over animation complexity

---

## **Technical Integration**

### **Form Submission**
- **Endpoint:** `https://[openclaw-webhook-url]/paisleey/landing-form`
- **Method:** POST
- **Headers:** Content-Type: application/json
- **Payload:**
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string (E.164 format)",
    "platforms_selected": ["instagram", "youtube", "tiktok", "x", "whatsapp"],
    "timestamp": "ISO 8601 timestamp",
    "video_duration_watched": "mm:ss",
    "referrer": "string (utm_source or page referrer)"
  }
  ```
- **Response:** Handle 200 (success) - show confirmation message and platform buttons
- **Error handling:** Show error message if submission fails, allow retry

### **Video Tracking**
- **Track:** Video play duration before form submission
- **Log:** Send to OpenClaw webhook with form submission payload
- **Format:** mm:ss (e.g., "2:45")

### **Analytics**
- **Track link clicks:** Platform button clicks log to OpenClaw (add utm_source parameter)
- **Track form events:** Form submission, validation errors, confirmation shown
- **Referrer tracking:** Capture page referrer (WhatsApp, Instagram, etc.)

### **GitHub Integration**
- **Auto-push:** Each update in Antigravity pushes to GitHub repo
- **Repo:** Create repo (Paisleey will provide or you create)
- **Branch:** main (for production)

---

## **Content Placeholders (To Be Added Later)**

- **YouTube Video ID:** [To be provided - unlisted video link]
- **Release Date:** [To be customized per pre-release]
- **Welcome Email Video Link:** [To be provided - separate YouTube link]
- **Platform URLs:**
  - Instagram: instagram.com/paisleey
  - YouTube: youtube.com/@paisleey
  - TikTok: @paisleey on tiktok.com
  - X/Twitter: x.com/paisleey
  - WhatsApp: [To be linked to WhatsApp broadcast signup]
- **Paisleey Brand Color:** [If available - use as accent color, otherwise use suggested palette]
- **Logo/Images:** Paisleey will provide later (placeholders for now)

---

## **Accessibility & UX**

- **Form labels:** Visible above inputs, not inside placeholders
- **Keyboard navigation:** All buttons and inputs accessible via Tab
- **Contrast:** Ensure WCAG AA compliance (good contrast between text and background)
- **Mobile buttons:** Large enough for thumb interaction (min 44px height)
- **Error messages:** Clear, red text, positioned above button
- **Confirmation message:** Clear success state, visible for 3-5 seconds
- **Loading state:** Show spinner while form submits

---

## **Page Variants (Future - Not For Initial Build)**

- /[song-name] - Dynamic pre-release pages (customizable per single)
- Optional: A/B test different headlines/CTAs (can be added later)

---

## **Build Priority**

1. **Framework first:** Get structure and form working before final design
2. **Form validation:** Ensure all validations work
3. **Webhook integration:** Test OpenClaw connection
4. **Responsiveness:** Mobile, tablet, desktop all tested
5. **Design polish:** Colors, typography, animations
6. **GitHub sync:** Verify auto-push to GitHub
7. **Testing:** Cross-browser (Chrome, Safari, Firefox), cross-device (mobile, tablet, desktop)

---

## **Deliverables**

1. Landing page live at paisleeypre.netlify.app
2. Form submission working and logging to OpenClaw
3. GitHub repository with code synced from Antigravity
4. Responsive on all devices
5. Ready for content updates (video ID, release date, URLs)
6. Documentation of webhook endpoint and environment variables

---

## **Notes**

- Keep page **fast and lightweight** (Afro R&B audience is mobile-first)
- **No heavy scripts** - use vanilla JavaScript if needed
- **Video embed:** Use YouTube embed iframe for performance
- **Forms:** Keep minimal - only ask for essentials
- **Colors:** Choose based on Paisleey's brand if available, otherwise use suggested Afro-modern palette
- **Images:** Placeholder assets for now, add real photos later

---

## **Questions for Paisleey/Team**

Before final implementation, confirm:
1. Paisleey brand color preference (if not using suggested palette)?
2. Font preference (or use system fonts for speed)?
3. Hero video - unlisted YouTube URL ready?
4. OpenClaw webhook endpoint URL available?
5. GitHub repository name preference?
6. Netlify site name: paisleeypre (or different)?
