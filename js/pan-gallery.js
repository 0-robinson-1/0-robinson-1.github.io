// pan-gallery.js

(function() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  let isDragging = false;
  let startX, startY;
  // background-position in % [0..100]
  let posX = 50, posY = 50;

  function updateBackground() {
    gallery.style.backgroundPosition = `${posX}% ${posY}%`;
  }

  function onDown(clientX, clientY) {
    isDragging = true;
    startX = clientX;
    startY = clientY;
  }

  function onMove(clientX, clientY) {
    if (!isDragging) return;
    const dx = clientX - startX;
    const dy = clientY - startY;
    // translate pixel movement to percentages
    const rect = gallery.getBoundingClientRect();
    posX = Math.min(100, Math.max(0, posX - (dx / rect.width) * 100));
    // amplify vertical movement sensitivity
    posY = Math.min(100, Math.max(0, posY - (dy / rect.height) * 100 * 5));
    updateBackground();
    startX = clientX;
    startY = clientY;
  }

  function onUp() {
    isDragging = false;
  }

  // Mouse events
  gallery.addEventListener('mousedown', e => onDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', e => onMove(e.clientX, e.clientY));
  window.addEventListener('mouseup', onUp);

  // Touch events
  gallery.addEventListener('touchstart', e => {
    const t = e.touches[0];
    onDown(t.clientX, t.clientY);
    e.preventDefault();
  }, { passive: false });
  gallery.addEventListener('touchmove', e => {
    const t = e.touches[0];
    onMove(t.clientX, t.clientY);
  }, { passive: false });
  gallery.addEventListener('touchend', e => {
    onUp();
  });

  // initialize
  updateBackground();
})();