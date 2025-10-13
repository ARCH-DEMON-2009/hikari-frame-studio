// Diwali Theme JS
const isDiwaliMode = true; // Toggle this to false after Diwali

if (isDiwaliMode) {
  // Inject Diwali CSS
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/diwali-theme/diwali-theme.css';
  document.head.appendChild(style);

  // Top Banner
  const banner = document.createElement('div');
  banner.id = 'diwali-banner';
  banner.innerHTML = `
    <div class="diwali-banner-content">
      ✨ Hikari Diwali Dhamaka Sale ✨<br>
      <span>Celebrate with bright deals on Posters, Frames & Anime Merch 🎁</span>
      <button id="diwali-banner-close">×</button>
    </div>
  `;
  document.body.prepend(banner);
  document.getElementById('diwali-banner-close').onclick = () => banner.remove();

  // Festive Background
  const bg = document.createElement('div');
  bg.id = 'diwali-bg';
  bg.innerHTML = `
    <img src="/diwali-theme/diyas.svg" class="diwali-diya" />
    <img src="/diwali-theme/fireworks.svg" class="diwali-firework" />
    <img src="/diwali-theme/sparkle.svg" class="diwali-sparkle" />
  `;
  document.body.appendChild(bg);

  // Glow Animations
  document.querySelectorAll('.logo, button, .card-elegant, .btn-primary, .btn-secondary').forEach(el => {
    el.classList.add('diwali-glow');
  });

  // Footer Message
  const footerMsg = document.createElement('div');
  footerMsg.id = 'diwali-footer-msg';
  footerMsg.innerHTML = '🪔 Happy Diwali from Team Hikari — Let your walls shine brighter this festive season!';
  document.body.appendChild(footerMsg);

  // Price Display
  document.querySelectorAll('.product .price').forEach(priceEl => {
    const realPrice = parseFloat(priceEl.dataset.price);
    const oldPrice = Math.round(realPrice * 1.25);
    priceEl.innerHTML = `
      <span class="old-price">₹${oldPrice}</span>
      <span class="new-price">₹${realPrice}</span>
      <small class="offer-note">💥 Diwali Offer Active!</small>
    `;
  });

  // Diwali Badge
  document.querySelectorAll('.product').forEach(card => {
    const badge = document.createElement('span');
    badge.className = 'diwali-badge';
    badge.innerText = '🎁 Diwali Offer Active';
    card.appendChild(badge);
  });

  // Confetti/Sparkle Animation on Cart/Buy
  document.querySelectorAll('.add-to-cart, .buy-now').forEach(btn => {
    btn.addEventListener('click', () => {
      const confetti = document.createElement('div');
      confetti.className = 'diwali-confetti';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1200);
    });
  });

  // Festive Sound Toggle
  const soundBtn = document.createElement('button');
  soundBtn.id = 'diwali-sound-toggle';
  soundBtn.innerHTML = '🔊';
  document.body.appendChild(soundBtn);
  let audio = new Audio('/diwali-theme/festive.mp3');
  let playing = false;
  soundBtn.onclick = () => {
    if (!playing) { audio.loop = true; audio.play(); soundBtn.innerHTML = '🔇'; playing = true; }
    else { audio.pause(); soundBtn.innerHTML = '🔊'; playing = false; }
  };
}
