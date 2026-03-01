/**
 * Paisleey Pre-Release Landing Page – JavaScript
 */

const CONFIG = {
  webhookUrl: 'https://[openclaw-domain]/paisleey/landing-form',
  youtubeVideoId: 'dQw4w9WgXcQ',   // swap with real unlisted video ID
  releaseDate: 'Coming Soon',       // e.g. "April 12, 2025"
};

document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  setReleaseDate();
  initPlatformToggle();
  initFormSubmit();
  initFollowCardAnalytics();
  initYouTubeTracking();
});

function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

function setReleaseDate() {
  const el = document.getElementById('release-date-text');
  if (el && CONFIG.releaseDate) el.innerHTML = `Out <strong>${CONFIG.releaseDate}</strong> — everywhere`;
}

function formatTimestamp() { return new Date().toISOString(); }

function getReferrer() {
  const params = new URLSearchParams(window.location.search);
  return params.get('utm_source') || document.referrer || 'direct';
}

let selectedPlatforms = new Set();

function initPlatformToggle() {
  const buttons = document.querySelectorAll('.platform-btn');
  const phoneGroup = document.getElementById('phone-group');
  const phoneInput = document.getElementById('phone');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      if (selectedPlatforms.has(platform)) {
        selectedPlatforms.delete(platform);
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
      } else {
        selectedPlatforms.add(platform);
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
      }
      const whatsappSelected = selectedPlatforms.has('whatsapp');
      if (phoneGroup) {
        phoneGroup.style.display = whatsappSelected ? 'flex' : 'none';
        if (phoneInput) {
          phoneInput.required = whatsappSelected;
          if (!whatsappSelected) { phoneInput.value = ''; clearError('phone'); }
        }
      }
      if (selectedPlatforms.size > 0) clearError('platform');
    });
  });
}

let videoWatchSeconds = 0;
let videoWatchInterval = null;

function initYouTubeTracking() {
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function () {
  const iframe = document.getElementById('yt-player');
  if (!iframe) return;
  new YT.Player('yt-player', {
    events: {
      onStateChange: (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
          videoWatchInterval = setInterval(() => { videoWatchSeconds++; }, 1000);
        } else {
          clearInterval(videoWatchInterval);
        }
      },
    },
  });
};

function getWatchDuration() {
  const m = Math.floor(videoWatchSeconds / 60);
  const s = videoWatchSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (input) input.classList.add('error');
  if (errorEl) errorEl.textContent = message;
}

function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorEl = document.getElementById(`${fieldId}-error`);
  if (input) input.classList.remove('error');
  if (errorEl) errorEl.textContent = '';
}

function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); }
function validatePhone(phone) { return /^\+[1-9]\d{7,14}$/.test(phone.replace(/\s/g, '')); }

function validateForm(name, email, phone) {
  let valid = true;
  clearError('name'); clearError('email'); clearError('platform'); clearError('phone');
  if (!name.trim()) { showError('name', 'Please enter your name.'); valid = false; }
  if (!validateEmail(email)) { showError('email', 'Please enter a valid email address.'); valid = false; }
  if (selectedPlatforms.size === 0) {
    const el = document.getElementById('platform-error');
    if (el) el.textContent = 'Please select at least one platform.';
    valid = false;
  }
  if (selectedPlatforms.has('whatsapp') && !validatePhone(phone)) {
    showError('phone', 'Please enter a valid phone number including country code (e.g. +254712345678).');
    valid = false;
  }
  return valid;
}

function initFormSubmit() {
  const form = document.getElementById('signup-form');
  const btn = document.getElementById('submit-btn');
  const errorSummary = document.getElementById('form-error-summary');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name  = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    errorSummary.className = 'form-error-summary';
    errorSummary.textContent = '';

    if (!validateForm(name, email, phone)) {
      errorSummary.textContent = 'Please fix the errors above before submitting.';
      errorSummary.classList.add('visible');
      errorSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      return;
    }

    btn.disabled = true;
    btn.classList.add('loading');

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: selectedPlatforms.has('whatsapp') ? phone.replace(/\s/g, '') : undefined,
      platforms_selected: Array.from(selectedPlatforms),
      timestamp: formatTimestamp(),
      video_duration_watched: getWatchDuration(),
      referrer: getReferrer(),
    };

    try {
      const response = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      onFormSuccess();
    } catch (err) {
      const isPlaceholder = CONFIG.webhookUrl.includes('[openclaw-domain]');
      if (isPlaceholder) {
        console.info('[DEV] Webhook is placeholder — simulating success.', payload);
        onFormSuccess();
      } else {
        btn.disabled = false;
        btn.classList.remove('loading');
        errorSummary.textContent = 'Submission failed. Please check your connection and try again.';
        errorSummary.classList.add('visible');
        errorSummary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        console.error('[Paisleey] Form error:', err);
      }
    }
  });
}

function onFormSuccess() {
  const form = document.getElementById('signup-form');
  const successCard = document.getElementById('success-card');
  const followSection = document.getElementById('follow-section');
  if (form) form.style.display = 'none';
  if (successCard) successCard.style.display = 'block';
  if (followSection) {
    followSection.style.display = 'block';
    setTimeout(() => { followSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 600);
  }
}

function initFollowCardAnalytics() {
  document.querySelectorAll('.follow-card').forEach(card => {
    card.addEventListener('click', () => logEvent('follow_click', { platform: card.dataset.platform }));
  });
}

function logEvent(event, data = {}) {
  if (CONFIG.webhookUrl.includes('[openclaw-domain]')) {
    console.info('[DEV] Analytics event:', event, data);
    return;
  }
  fetch(CONFIG.webhookUrl.replace('/landing-form', '/events'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, ...data, timestamp: formatTimestamp(), referrer: getReferrer() }),
    keepalive: true,
  }).catch(() => {});
}