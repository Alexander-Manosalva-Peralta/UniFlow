/* =========================================================
   UniFlow — Landing Page Scripts
   Interactividad: Simulador de notificaciones con Web Audio chime,
   acordeón FAQ y control de descarga.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Reloj en vivo en el mockup
  function updateLiveClock() {
    const clockEl = document.getElementById('liveSimClock');
    if (!clockEl) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}`;
  }
  updateLiveClock();
  setInterval(updateLiveClock, 30000);

  // 2. Timbre suave de notificación simulado (Web Audio API)
  function playNotificationChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      // Ignorar si el navegador bloquea audio antes de interacción
    }
  }

  // 3. Simulador de Notificación
  const btnTrigger = document.getElementById('btnTriggerSoundSim');
  const simInput = document.getElementById('simTitleInput');
  const liveBanner = document.getElementById('simLiveBanner');
  const bannerTitle = document.getElementById('bannerTitle');

  if (btnTrigger && liveBanner) {
    btnTrigger.addEventListener('click', () => {
      const title = (simInput && simInput.value.trim()) || 'Entrega de Tesis Final';
      bannerTitle.textContent = '📌 ' + title;

      playNotificationChime();

      // Animación de aparición
      liveBanner.classList.remove('is-active');
      void liveBanner.offsetWidth; // reflow
      liveBanner.classList.add('is-active');

      // Si el dispositivo soporta vibración
      if (navigator.vibrate) {
        navigator.vibrate([150, 80, 150]);
      }
    });
  }

  // Descartar notificación de hero
  const btnDismiss = document.getElementById('btnDismissSimNotif');
  const heroNotif = document.getElementById('mockupNotif');
  if (btnDismiss && heroNotif) {
    btnDismiss.addEventListener('click', () => {
      heroNotif.style.opacity = '0';
      heroNotif.style.transform = 'translateY(-10px)';
      setTimeout(() => { heroNotif.style.display = 'none'; }, 300);
    });
  }

  // 4. Acordeón de FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach(i => i.classList.remove('is-open'));
      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  });

  // Abrir el primer ítem de FAQ por defecto
  if (faqItems.length > 0) {
    faqItems[0].classList.add('is-open');
  }

  // 5. Animación suave de aparición al scrollear
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.feature-card, .step-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
});
