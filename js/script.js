/* ============================================================
   Women Safety & Emergency Support — script.js
   Handles: SOS modal/countdown, mobile nav, form validation,
            community posts, checklist interactions, like buttons
   ============================================================ */

// ── Utility: show a brief toast notification ──────────────────
function showToast(msg, color = '#2dc653') {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.style.background = color;
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Mobile nav toggle ─────────────────────────────────────────
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.innerHTML = links.classList.contains('open')
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.innerHTML = '<i class="fas fa-bars"></i>';
    })
  );
}

// ── SOS Modal with countdown ──────────────────────────────────
/*
  Flow:
  1. User clicks SOS button → modal opens, 3-second countdown starts
  2. After countdown → "Sending alert..." spinner shown
  3. After 1.5s → "Alert Sent!" success state shown
  4. User can cancel at any time during countdown
*/
function initSOS() {
  const sosBtn  = document.getElementById('sosBtn');
  const overlay = document.getElementById('sosModal');
  if (!sosBtn || !overlay) return;

  const stateCountdown = document.getElementById('stateCountdown');
  const stateSending   = document.getElementById('stateSending');
  const stateSuccess   = document.getElementById('stateSuccess');
  const countNum       = document.getElementById('countNum');
  const cancelBtn      = document.getElementById('sosCancelBtn');
  const closeBtn       = document.getElementById('sosCloseBtn');

  let countdownTimer = null;
  let count = 3;

  function resetModal() {
    clearInterval(countdownTimer);
    count = 3;
    countNum.textContent = count;
    stateCountdown.style.display = 'block';
    stateSending.style.display   = 'none';
    stateSuccess.style.display   = 'none';
  }

  function startCountdown() {
    overlay.classList.add('active');
    resetModal();

    countdownTimer = setInterval(() => {
      count--;
      countNum.textContent = count;

      if (count <= 0) {
        clearInterval(countdownTimer);
        // Show sending state
        stateCountdown.style.display = 'none';
        stateSending.style.display   = 'block';

        // Simulate network delay then show success
        setTimeout(() => {
          stateSending.style.display = 'none';
          stateSuccess.style.display = 'block';
        }, 1500);
      }
    }, 1000);
  }

  sosBtn.addEventListener('click', startCountdown);

  cancelBtn?.addEventListener('click', () => {
    overlay.classList.remove('active');
    resetModal();
  });

  closeBtn?.addEventListener('click', () => {
    overlay.classList.remove('active');
    resetModal();
  });

  // Close on backdrop click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      resetModal();
    }
  });
}

// ── Emergency checklist ───────────────────────────────────────
function initChecklist() {
  document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      cb.closest('li').classList.toggle('checked', cb.checked);
    });
  });
}

// ── Report unsafe location form validation ────────────────────
function initReportForm() {
  const form = document.getElementById('reportForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach(field => {
      const err = field.nextElementSibling;
      if (!field.value.trim()) {
        if (err && err.classList.contains('form-error')) err.classList.add('show');
        field.style.borderColor = 'var(--red)';
        valid = false;
      } else {
        if (err && err.classList.contains('form-error')) err.classList.remove('show');
        field.style.borderColor = '#e9ecef';
      }
    });

    if (valid) {
      showToast('Report submitted. Thank you for keeping the community safe.');
      form.reset();
    }
  });

  // Clear error on input
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => {
      const err = field.nextElementSibling;
      if (err && err.classList.contains('form-error')) err.classList.remove('show');
      field.style.borderColor = '#e9ecef';
    });
  });
}

// ── Community post form ───────────────────────────────────────
function initCommunity() {
  const form     = document.getElementById('postForm');
  const textarea = document.getElementById('postTextarea');
  const feed     = document.getElementById('postFeed');
  if (!form || !textarea || !feed) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = textarea.value.trim();
    if (!text) {
      textarea.style.borderColor = 'var(--red)';
      return;
    }
    textarea.style.borderColor = '#e9ecef';

    // Prepend new post to feed
    const post = document.createElement('div');
    post.className = 'community-post';
    post.innerHTML = `
      <div class="post-header">
        <div class="avatar">Y</div>
        <div class="post-author">
          <strong>You</strong>
          <span>Just now</span>
        </div>
      </div>
      <p class="post-body">${escapeHtml(text)}</p>
      <div class="post-footer">
        <button class="btn-react" onclick="toggleLike(this)"><i class="far fa-heart"></i> 0</button>
        <button class="btn-react"><i class="far fa-comment"></i> Reply</button>
      </div>`;
    feed.prepend(post);
    textarea.value = '';
    showToast('Post shared with the community.');
  });

  textarea.addEventListener('input', () => {
    textarea.style.borderColor = '#e9ecef';
  });
}

// ── Like / heart toggle ───────────────────────────────────────
function toggleLike(btn) {
  const isLiked = btn.classList.toggle('liked');
  const icon    = btn.querySelector('i');
  icon.className = isLiked ? 'fas fa-heart' : 'far fa-heart';
  const count   = parseInt(btn.textContent.trim()) || 0;
  btn.innerHTML = `<i class="${icon.className}"></i> ${isLiked ? count + 1 : Math.max(0, count - 1)}`;
}

// ── Escape HTML to prevent XSS in user-generated content ──────
function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

// ── Init everything on DOM ready ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSOS();
  initChecklist();
  initReportForm();
  initCommunity();
});
