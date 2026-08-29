// ============================================================
// "When You Miss Me" — shared script v2 (cute + responsive pass)
// ============================================================

/* ---------- mobile nav toggle ---------- */
function initNav(){
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', () => links.classList.remove('open'));
  });

  // mark active link
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    if(a.getAttribute('href') === here) a.classList.add('active');
  });
}

/* ---------- ambient floating hearts (canvas) ---------- */
function initFireflies(){
  const canvas = document.getElementById('fireflies');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, hearts;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const colors = ['rgba(255,143,171,ALPHA)', 'rgba(217,198,255,ALPHA)', 'rgba(255,184,92,ALPHA)'];

  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  function makeHearts(){
    const count = Math.min(26, Math.floor((w*h)/48000));
    hearts = Array.from({length:count}, () => ({
      x: Math.random()*w,
      y: Math.random()*h + h*0.2,
      size: Math.random()*8 + 6,
      speed: Math.random()*0.3 + 0.08,
      drift: Math.random()*0.5 - 0.25,
      sway: Math.random()*Math.PI*2,
      swaySpeed: Math.random()*0.015 + 0.006,
      alpha: Math.random()*0.35 + 0.18,
      colorIdx: Math.floor(Math.random()*colors.length),
      rot: Math.random()*Math.PI*2
    }));
  }
  function drawHeart(cx, cy, size, color, rot){
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.fillStyle = color;
    ctx.beginPath();
    const s = size;
    ctx.moveTo(0, s*0.3);
    ctx.bezierCurveTo(-s, -s*0.6, -s*1.6, s*0.5, 0, s*1.3);
    ctx.bezierCurveTo(s*1.6, s*0.5, s, -s*0.6, 0, s*0.3);
    ctx.fill();
    ctx.restore();
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    hearts.forEach(p=>{
      p.sway += p.swaySpeed;
      const wobble = Math.sin(p.sway) * 10;
      const color = colors[p.colorIdx].replace('ALPHA', p.alpha.toFixed(2));
      drawHeart(p.x + wobble, p.y, p.size, color, Math.sin(p.sway)*0.15);

      if(!reduceMotion){
        p.y -= p.speed;
        p.x += p.drift;
        if(p.y < -20){ p.y = h + 20; p.x = Math.random()*w; }
      }
    });
    requestAnimationFrame(draw);
  }
  resize();
  makeHearts();
  draw();
  window.addEventListener('resize', () => { resize(); makeHearts(); });
}

/* ---------- little heart-burst wherever the user taps a cute button ---------- */
function spawnHeartBurst(x, y){
  const emojis = ['💗','💕','💛','✨'];
  for(let i=0;i<5;i++){
    const el = document.createElement('span');
    el.className = 'heart-burst';
    el.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    const offsetX = (Math.random()-0.5)*50;
    el.style.left = (x + offsetX) + 'px';
    el.style.top = y + 'px';
    el.style.animationDelay = (i*0.05) + 's';
    document.body.appendChild(el);
    setTimeout(()=> el.remove(), 1100);
  }
}
function initHeartBursts(){
  document.querySelectorAll('.hero-btn, .breathe-circle').forEach(el=>{
    el.addEventListener('click', (e)=> spawnHeartBurst(e.clientX, e.clientY));
  });
}

/* ---------- flip cards (touch support) ---------- */
function initFlipCards(){
  document.querySelectorAll('.flip-card').forEach(card=>{
    card.setAttribute('tabindex','0');
    card.addEventListener('click', ()=> card.classList.toggle('flipped'));
    card.addEventListener('keypress', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') card.classList.toggle('flipped');
    });
  });
}

/* ---------- envelope open + letter reveal ---------- */
function initEnvelope(){
  const envelope = document.querySelector('.envelope');
  const hint = document.querySelector('.envelope-hint');
  const letterText = document.querySelector('.letter-text');
  if(!envelope) return;

  function openEnvelope(e){
    envelope.classList.add('open');
    if(hint) hint.style.opacity = '0';
    if(e) spawnHeartBurst(e.clientX || (envelope.getBoundingClientRect().left + envelope.offsetWidth/2), e.clientY || envelope.getBoundingClientRect().top);
    setTimeout(()=>{
      if(letterText) letterText.classList.add('visible');
      if(letterText) letterText.scrollIntoView({behavior:'smooth', block:'start'});
    }, 550);
  }

  envelope.addEventListener('click', openEnvelope, { once:true });
  envelope.addEventListener('keypress', (e)=>{
    if(e.key === 'Enter' || e.key === ' ') openEnvelope(e);
  }, { once:true });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFireflies();
  initHeartBursts();
  initFlipCards();
  initEnvelope();
});
