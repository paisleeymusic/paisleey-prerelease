/**
 * Paisleey Pre-Release Landing Page – JavaScript
 * Handles: platform toggling, phone conditional, form validation,
 * YouTube watch tracking, webhook submission, analytics logging.
 */

/* ──────────────────────────────────────
   CONFIG  (update these before launch)
   ────────────────────────────────────── */
const CONFIG = {
  webhookUrl: 'https://[openclaw-domain]/paisleey/landing-form',
  youtubeVideoId: 'T8ywL5iAWME',   
  releaseDate: '2026',       
};

/* ──────────────────────────────────────
   INIT
   ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  setFooterYear();
  setReleaseDate();
  initPlatformToggle();
  initFormSubmit();
  initFollowCardAnalytics();
  initYouTubeTracking();
  initArticleModal();
});

/* ──────────────────────────────────────
   UTILITIES
   ────────────────────────────────────── */
function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

function setReleaseDate() {
  const el = document.getElementById('release-date-text');
  if (el && CONFIG.releaseDate) {
    el.innerHTML = `Out <strong>${CONFIG.releaseDate}</strong> — everywhere`;
  }
}

function formatTimestamp() {
  return new Date().toISOString();
}

function getReferrer() {
  const params = new URLSearchParams(window.location.search);
  return params.get('utm_source') || document.referrer || 'direct';
}

/* ──────────────────────────────────────
   PLATFORM TOGGLE
   ────────────────────────────────────── */
let selectedPlatforms = new Set();

function initPlatformToggle() {
  const buttons = document.querySelectorAll('.platform-btn');
  const phoneGroup = document.getElementById('phone-group');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      const isSelected = selectedPlatforms.has(platform);

      if (isSelected) {
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
      }
    });
  });
}

/* ──────────────────────────────────────
   FORM SUBMISSION
   ────────────────────────────────────── */
function initFormSubmit() {
  const form = document.getElementById('signup-form');
  const submitBtn = document.getElementById('submit-btn');
  const successCard = document.getElementById('success-card');
  const followSection = document.getElementById('follow-section');
  const formSection = document.getElementById('form-section');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';

    let isValid = true;
    if (!name) { showError('name', 'Name is required'); isValid = false; }
    if (!validateEmail(email)) { showError('email', 'Enter a valid email'); isValid = false; }
    if (selectedPlatforms.size === 0) { showError('platform', 'Select at least one platform'); isValid = false; }
    if (selectedPlatforms.has('whatsapp') && !validatePhone(phone)) {
      showError('phone', 'Enter a valid phone number (e.g. +254...)');
      isValid = false;
    }

    if (!isValid) return;

    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    const payload = {
      name,
      email,
      phone: selectedPlatforms.has('whatsapp') ? phone : null,
      platforms_selected: Array.from(selectedPlatforms),
      timestamp: formatTimestamp(),
      video_duration_watched: getWatchTime(),
      referrer: getReferrer(),
    };

    try {
      const response = await fetch(CONFIG.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok || true) { 
        form.style.display = 'none';
        successCard.style.display = 'block';
        followSection.style.display = 'block';
        formSection.scrollIntoView({ behavior: 'smooth' });
        logEvent('form_complete', { platforms: Array.from(selectedPlatforms) });
      }
    } catch (err) {
      console.error(err);
      showError('form-summary', 'Unable to join. Please try again.');
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
}

function showError(id, msg) {
  const el = document.getElementById(`${id}-error`) || document.getElementById('form-error-summary');
  if (el) el.textContent = msg;
}

function clearErrors() {
  document.querySelectorAll('.field-error, .form-error-summary').forEach(el => el.textContent = '');
}

/* ──────────────────────────────────────
   YOUTUBE TRACKING
   ────────────────────────────────────── */
let player;
let watchStart = 0;
let totalSecondsWatched = 0;

function initYouTubeTracking() {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function() {
  player = new YT.Player('yt-player', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
};

function onPlayerStateChange(event) {
  if (event.data === 1) {
    watchStart = Date.now();
  } else {
    if (watchStart > 0) {
      totalSecondsWatched += (Date.now() - watchStart) / 1000;
      watchStart = 0;
    }
  }
}

function getWatchTime() {
  const total = Math.round(totalSecondsWatched);
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/* ──────────────────────────────────────
   ANALYTICS & EVENTS
   ────────────────────────────────────── */
function initFollowCardAnalytics() {
  document.querySelectorAll('.follow-card').forEach(card => {
    card.addEventListener('click', () => {
      logEvent('follow_click', { platform: card.dataset.platform });
    });
  });
}

function logEvent(event, data = {}) {
  if (!CONFIG.webhookUrl || CONFIG.webhookUrl.includes('[openclaw-domain]')) {
    console.log('[Analytics Simulation]:', event, data);
    return;
  }

  const payload = {
    event,
    ...data,
    timestamp: formatTimestamp(),
    referrer: getReferrer(),
  };

  fetch(CONFIG.webhookUrl.replace('/landing-form', '/events'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

/* ──────────────────────────────────────
   ARTICLE MODAL LOGIC
   ────────────────────────────────────── */
function initArticleModal() {
  const modal = document.getElementById('article-modal');
  const openBtn = document.getElementById('open-article');
  const closeBtn = document.getElementById('close-modal');
  const overlay = document.getElementById('modal-overlay');

  if (!modal || !openBtn) return;

  const openModal = () => {
    modal.classList.add('modal--open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; 
    logEvent('modal_open', { article: 'mdundo_door' });
  };

  const closeModal = () => {
    modal.classList.remove('modal--open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });
}
