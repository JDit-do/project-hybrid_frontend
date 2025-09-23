// Modal helpers
function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

function openModal(id) {
  const el = qs(id);
  if (el) el.style.display = 'flex';
}
function closeModal(id) {
  const el = qs(id);
  if (el) el.style.display = 'none';
}

// Upload modal interactions
function initUploadModal() {
  const drop = qs('#dropzone');
  const input = qs('#fileInput');
  const list = qs('#uploadList');

  if (!drop || !input || !list) return;

  function handleFiles(files) {
    Array.from(files).forEach((file) => {
      const item = document.createElement('div');
      item.className = 'upload-item';
      item.innerHTML = `<div class="upload-name" title="${file.name}">${file.name}</div>
        <div class="upload-bar"><div class="upload-fill" style="width:0%"></div></div>`;
      list.appendChild(item);

      // Fake upload progress
      let p = 0;
      const fill = item.querySelector('.upload-fill');
      const timer = setInterval(() => {
        p = Math.min(100, p + Math.round(Math.random() * 25));
        fill.style.width = p + '%';
        if (p >= 100) clearInterval(timer);
      }, 300);
    });
  }

  ['dragenter','dragover'].forEach(evt => drop.addEventListener(evt, (e) => {
    e.preventDefault(); e.stopPropagation(); drop.classList.add('active');
  }));
  ;['dragleave','drop'].forEach(evt => drop.addEventListener(evt, (e) => {
    e.preventDefault(); e.stopPropagation(); drop.classList.remove('active');
  }));
  drop.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
  drop.addEventListener('click', () => input.click());
  input.addEventListener('change', () => handleFiles(input.files));
}

// Detail modal open from cards
function initCards() {
  qsa('.card').forEach(card => {
    card.addEventListener('click', () => openModal('#detailOverlay'));
  });
}

// Close buttons
function initClose() {
  qsa('[data-close]').forEach(btn => btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-close');
    closeModal(target);
  }));
}

document.addEventListener('DOMContentLoaded', () => {
  initUploadModal();
  initCards();
  initClose();
});


