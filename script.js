/* Interactive JS:
  - Countdown (48h session)
  - Animated counters on reveal
  - Reveal animation using IntersectionObserver
  - Simple testimonial slider
  - Parallax subtle background
  - Floating CTA visibility
*/
// -------- Countdown (48 hours per session) --------
(function(){
 const KEY = 'promo_end_ts_v3_fix';
 const DURATION = 48 * 3600; // seconds
 let endTs = sessionStorage.getItem(KEY);
 if(!endTs){
   endTs = Math.floor(Date.now()/1000) + DURATION;
   sessionStorage.setItem(KEY, endTs);
 } else endTs = Number(endTs);
 const el = document.getElementById('countdown');
 function tick(){
   if(!el) return;
   const now = Math.floor(Date.now()/1000);
   let diff = Math.max(0, endTs - now);
   const hours = Math.floor(diff/3600);
   const minutes = Math.floor((diff%3600)/60);
   const seconds = diff % 60;
   el.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
   if(diff>0) setTimeout(tick, 1000);
 }
 document.addEventListener('DOMContentLoaded', tick);
})();
// -------- Animated number helper --------
function animateNumber(el, to, opts = {}) {
 if(!el) return;
 const duration = opts.duration || 1400;
 const isCurrency = opts.currency || false;
 const suffix = opts.suffix || '';
 const startTs = performance.now();
 const startVal = 0;
 function frame(now){
   const t = Math.min((now - startTs) / duration, 1);
   const val = Math.floor(startVal + (to - startVal) * t);
   if(isCurrency) el.textContent = val.toLocaleString('ru-RU') + ' ₸';
   else el.textContent = val.toLocaleString('ru-RU') + suffix;
   if(t < 1) requestAnimationFrame(frame);
   else {
     if(isCurrency) el.textContent = to.toLocaleString('ru-RU') + ' ₸';
     else el.textContent = to.toLocaleString('ru-RU') + suffix;
   }
 }
 requestAnimationFrame(frame);
}
// -------- Counters when visible --------
function initCounters() {
 const counters = [
   {id:'stat-clients', to:120, opts:{duration:1200, suffix:'+'}},
   {id:'stat-saved', to:10000000, opts:{duration:1400, currency:true}},
   {id:'stat-years', to:7, opts:{duration:1000}},
 ];
 counters.forEach((c, idx) => {
   const el = document.getElementById(c.id);
   if(!el) return;
   const run = () => setTimeout(()=> animateNumber(el, c.to, c.opts), idx*250);
   const rect = el.getBoundingClientRect();
   if(rect.top < window.innerHeight) run();
   else {
     const io = new IntersectionObserver((entries, ob) => {
       entries.forEach(en => {
         if(en.isIntersecting){ run(); ob.unobserve(en.target); }
       });
     }, {threshold:0.2});
     io.observe(el);
   }
 });
}
// -------- Reveal animation (cards) --------
function initReveal(){
 const items = document.querySelectorAll('[data-anim]');
 if(!items.length) return;
 const io = new IntersectionObserver((entries, ob) => {
   entries.forEach(entry => {
     if(entry.isIntersecting){
       // add visible both to container and to immediate child cards
       entry.target.classList.add('visible');
       // if container holds cards inside (like .steps), reveal its child .card elements
       const childCards = entry.target.querySelectorAll('.card');
       childCards.forEach(c => c.classList.add('visible'));
       // if element itself is a card, make sure it's visible
       if(entry.target.classList.contains('card')) entry.target.classList.add('visible');
       ob.unobserve(entry.target);
     }
   });
 }, {threshold: 0.12});
 items.forEach(i=> io.observe(i));
 // also reveal any .card already in viewport
 const allCards = document.querySelectorAll('.card');
 allCards.forEach(c => {
   const rect = c.getBoundingClientRect();
   if(rect.top < window.innerHeight) c.classList.add('visible');
 });
}
// -------- Testimonial slider --------
function initTestSlider(){
 const slider = document.getElementById('test-slider');
 if(!slider) return;
 const slides = slider.querySelectorAll('.test-slide');
 if(!slides.length) return;
 let idx = 0;
 function show(i){
   slides.forEach((s, si)=> s.classList.toggle('active', si===i));
 }
 show(0);
 const prev = document.getElementById('prevTest');
 const next = document.getElementById('nextTest');
 if(prev) prev.addEventListener('click', ()=> { idx = (idx - 1 + slides.length) % slides.length; show(idx); });
 if(next) next.addEventListener('click', ()=> { idx = (idx + 1) % slides.length; show(idx); });
 setInterval(()=> { idx = (idx + 1) % slides.length; show(idx); }, 6000);
}
// -------- Parallax hero background (subtle) --------
function initParallax(){
 const bg = document.querySelector('.hero-bg');
 if(!bg) return;
 window.addEventListener('scroll', () => {
   const sc = window.scrollY;
   bg.style.transform = `translateY(${sc * 0.06}px) scale(1.03)`;
 }, {passive:true});
}
// -------- Floating CTA toggle --------
function initFloatingCTA(){
 const f = document.querySelector('.floating-cta');
 if(!f) return;
 function toggle(){ f.style.display = window.innerWidth <= 720 ? 'block' : 'none'; }
 window.addEventListener('resize', toggle);
 toggle();
}
// -------- Initialize all --------
document.addEventListener('DOMContentLoaded', () => {
 initReveal();
 initCounters();
 initTestSlider();
 initParallax();
 initFloatingCTA();
});