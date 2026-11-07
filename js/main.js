/* =====================================================================
LUM COSTRUZIONI – JavaScript vanilla
1. Navbar: ombra allo scroll + chiusura menu mobile al click
2. Slider Prima & Dopo
3. Animazioni di comparsa (IntersectionObserver)
4. Pulsante "torna su"
5. Form contatti (validazione + invio via email)
6. Anno corrente nel footer
===================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  
  /* ---------- 1. Navbar ---------- */
  const nav = document.getElementById('mainNav');
  const navMenu = document.getElementById('navMenu');
  const toTop = document.getElementById('toTop');
  
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 20);
    toTop.classList.toggle('show', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  
  // Su mobile, cliccando un link il menu si richiude
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });
  });
  
    /* ---------- 2. Slider Prima & Dopo ----------
     La variabile CSS --pos (0-100%) indica quanta parte della foto
     "Prima" è visibile, partendo da sinistra.
     - Mouse / dito: si trascina in qualsiasi punto della foto
     - Tastiera: frecce sull'input range nascosto
     - Pulsanti: Prima (100%), Confronta (50%), Dopo (0%) */
  document.querySelectorAll('.project').forEach(project => {
    const slider = project.querySelector('.ba-slider');
    const range = slider.querySelector('.ba-range');
    const buttons = project.querySelectorAll('.ba-controls button');

    const setPos = (value, animate = false) => {
      const pos = Math.min(100, Math.max(0, value));
      slider.classList.toggle('animate', animate);
      slider.style.setProperty('--pos', pos + '%');
      slider.classList.toggle('hide-before', pos < 8);
      slider.classList.toggle('hide-after', pos > 92);
      range.value = pos;
      buttons.forEach(b => b.classList.toggle('active', Number(b.dataset.pos) === Math.round(pos)));
    };

    // Posizione in % a partire dalla coordinata X del puntatore
    const posFromEvent = e => {
      const rect = slider.getBoundingClientRect();
      return ((e.clientX - rect.left) / rect.width) * 100;
    };

    let dragging = false;
    let startX = 0, startY = 0, decided = false;

    slider.addEventListener('pointerdown', e => {
      dragging = true; decided = e.pointerType === 'mouse';
      startX = e.clientX; startY = e.clientY;
      if (decided) { slider.setPointerCapture(e.pointerId); setPos(posFromEvent(e)); }
    });

    slider.addEventListener('pointermove', e => {
      if (!dragging) return;
      // Su touch: decide se l'utente vuole trascinare lo slider (orizzontale)
      // o scorrere la pagina (verticale)
      if (!decided) {
        const dx = Math.abs(e.clientX - startX), dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        if (dy > dx) { dragging = false; return; }
        decided = true;
        slider.setPointerCapture(e.pointerId);
      }
      setPos(posFromEvent(e));
    });

    const stop = e => {
      // Tocco veloce senza trascinare: sposta la linea dove si è toccato
      if (dragging && !decided && e.type === 'pointerup') setPos(posFromEvent(e), true);
      dragging = false;
    };
    slider.addEventListener('pointerup', stop);
    slider.addEventListener('pointercancel', stop);

    range.addEventListener('input', () => setPos(Number(range.value)));
    buttons.forEach(b => b.addEventListener('click', () => setPos(Number(b.dataset.pos), true)));

    setPos(50);
  });

  // Piccola animazione "dimostrativa" la prima volta che la sezione è visibile,
  // per far capire subito che la foto si può far scorrere
  const lavori = document.getElementById('lavori');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const demo = new IntersectionObserver((entries, obs) => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      document.querySelectorAll('.project').forEach((project, i) => {
        const btns = project.querySelectorAll('.ba-controls button');
        setTimeout(() => btns[0].click(), 600 + i * 250);   // mostra il Prima
        setTimeout(() => btns[2].click(), 1600 + i * 250);  // poi il Dopo
        setTimeout(() => btns[1].click(), 2600 + i * 250);  // torna al confronto
      });
    }, { threshold: 0.4 });
    demo.observe(lavori);
  }
  
  /* ---------- 3. Animazioni di comparsa ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }
  
  /* ---------- 4. Torna su ---------- */
  toTop.addEventListener('click', () => window.scrollTo({ top: 0 }));
  
  /* ---------- 5. Form contatti ----------
  Il sito è statico (nessun server): alla conferma si apre il client
  email dell'utente con la richiesta già compilata.
  Per ricevere i messaggi senza client email, sostituire con un servizio
  come Formspree / Netlify Forms (vedi README). */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  
  form.addEventListener('submit', e => {
    e.preventDefault();
    
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      form.querySelector(':invalid').focus();
      return;
    }
    
    const data = new FormData(form);
    const subject = `Richiesta preventivo – ${data.get('servizio')}`;
    const body =
`Nome: ${data.get('nome')}
Telefono: ${data.get('telefono')}
Email: ${data.get('email') || '-'}
Servizio: ${data.get('servizio')}
    
Messaggio:
    ${data.get('messaggio')}`;
    
    window.location.href =
    `mailto:lumcostruzioni@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    status.textContent = 'Grazie! Si è aperta la tua app email con la richiesta già pronta: premi "Invia" per completare. In alternativa chiamaci al 328 086 8115.';
    form.reset();
    form.classList.remove('was-validated');
  });
  
  /* ---------- 6. Anno nel footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
});

document.addEventListener("DOMContentLoaded", function () {
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const privacyModal = document.getElementById("privacy-modal");
  const openPrivacyBtn = document.getElementById("open-privacy-modal");
  const closePrivacyBtn = document.getElementById("close-privacy-modal");

  // Mostra il banner solo se l'utente non ha già accettato
  if (!localStorage.getItem("cookiesAccepted")) {
    cookieBanner.style.display = "block";
  }

  // Salvataggio del consenso al click
  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.style.display = "none";
  });

  // Apri Modale Privacy
  openPrivacyBtn.addEventListener("click", function (e) {
    e.preventDefault();
    privacyModal.style.display = "flex";
  });

  // Chiudi Modale Privacy
  closePrivacyBtn.addEventListener("click", function () {
    privacyModal.style.display = "none";
  });
});