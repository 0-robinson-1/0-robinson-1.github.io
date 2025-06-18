// pan-gallery.js  – tilt-or-scroll parallax, < 1 kB

(function () {
  const el = document.querySelector('.gallery');
  if (!el) return;

  // -------- helpers --------
  const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v));
  const wrap = v => ((v % 100) + 100) % 100;

  // Normalised centre (50 %, 50 %)
  let posX = 50, posY = 50;

  function render() {
    el.style.backgroundPosition = `${posX}% ${posY}%`;
  }

  // -------- 1. Device-orientation (phones/tablets) --------
  function onTilt (e) {
    // γ = left/right, β = front/back. Numbers are roughly −90…90
    const { gamma = 0, beta = 0 } = e;
    // Tune sensitivity ↓ (smaller = slower pan)
    posX = wrap(50 + gamma * 0.7);
    posY = clamp(50 + beta  * 0.7);
    render();
  }

  function tryEnableTilt () {
    if (!('DeviceOrientationEvent' in window)) return;

    // iOS 13+ needs a user-gesture + permission
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(p => { if (p === 'granted') addEventListener('deviceorientation', onTilt); })
        .catch(console.warn);
    } else {
      addEventListener('deviceorientation', onTilt);
    }
  }

  // -------- 2. Mouse-move fallback (laptops/desktops) --------
  function onMouse (e) {
    const { innerWidth:w, innerHeight:h } = window;
    // Map cursor position (see wrap and clamp usage)
    posX = wrap(((e.clientX / w) * 200) - 50);
    posY = clamp((e.clientY / h) * 100);
    render();
  }

  // -------- init --------
  render();              // paint once
  tryEnableTilt();       // most phones

  // fallback for everything else
  addEventListener('mousemove', onMouse, { passive:true });
})();