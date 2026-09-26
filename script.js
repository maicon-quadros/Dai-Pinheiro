const header = document.querySelector('.site-header');
const preloader = document.getElementById('preloader');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('load', () => {
  setTimeout(() => preloader?.classList.add('hidden'), 2400);
});

function updateHeader(){
  header?.classList.toggle('scrolled', window.scrollY > 30);
}
updateHeader();
window.addEventListener('scroll', updateHeader, {passive:true});

menuToggle?.addEventListener('click', () => {
  const open = !mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open', open);
  menuToggle.classList.toggle('active', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-open', open);
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.setAttribute('aria-label','Abrir menu');
    document.body.classList.remove('menu-open');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.target || 0);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();

    function tick(now){
      const progress = Math.min((now - start)/duration, 1);
      const eased = 1 - Math.pow(1-progress, 3);
      el.textContent = prefix + Math.round(target * eased) + suffix;
      if(progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
},{threshold:.6});

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

const track = document.getElementById('testimonialTrack');
const cards = track ? Array.from(track.children) : [];
let index = 0;

function updateSlider(){
  if(!track || !cards.length) return;
  const gap = 18;
  const cardWidth = cards[0].getBoundingClientRect().width;
  track.style.transform = `translateX(-${index * (cardWidth + gap)}px)`;
}

document.getElementById('nextTestimonial')?.addEventListener('click', () => {
  const visible = window.innerWidth < 680 ? 1 : (window.innerWidth < 1180 ? 2 : 3);
  const max = Math.max(0, cards.length - visible);
  index = index >= max ? 0 : index + 1;
  updateSlider();
});

document.getElementById('prevTestimonial')?.addEventListener('click', () => {
  const visible = window.innerWidth < 680 ? 1 : (window.innerWidth < 1180 ? 2 : 3);
  const max = Math.max(0, cards.length - visible);
  index = index <= 0 ? max : index - 1;
  updateSlider();
});

window.addEventListener('resize', () => {
  index = 0;
  updateSlider();
});
