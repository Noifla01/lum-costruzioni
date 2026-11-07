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
  L'input range (invisibile) aggiorna la variabile CSS --pos,
  che ritaglia l'immagine "Prima" e sposta la maniglia.
  Funziona con mouse, dito e frecce della tastiera. */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const range = slider.querySelector('.ba-range');
    const update = () => slider.style.setProperty('--pos', range.value + '%');
    range.addEventListener('input', update);
    update();
  });
  
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