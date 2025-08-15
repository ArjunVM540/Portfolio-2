// Small interactive scripts for the portfolio

const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  const themeToggle = $('#theme-toggle');
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  if (stored === 'light') root.dataset.theme = 'light';

  themeToggle.addEventListener('click', () => {
    if (root.dataset.theme === 'light') {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme','dark');
      themeToggle.textContent = '🌙';
    } else {
      root.dataset.theme = 'light';
      localStorage.setItem('theme','light');
      themeToggle.textContent = '☀️';
    }
  });

  // Mobile menu
  const menuToggle = $('#menu-toggle');
  const mobileMenu = $('#mobile-menu');
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.hasAttribute('hidden') === false;
    if (open) {
      mobileMenu.setAttribute('hidden','');
      menuToggle.textContent = '☰';
    } else {
      mobileMenu.removeAttribute('hidden');
      menuToggle.textContent = '✕';
    }
  });

  // Typed meta
  const typedEl = $('#typed');
  const phrases = ['Open for freelance','Building a design system','Exploring WebGL'];
  let pi = 0, ci = 0;
  function tick(){
    const p = phrases[pi];
    typedEl.textContent = p.slice(0,ci);
    ci++;
    if (ci>p.length){
      ci=0;pi=(pi+1)%phrases.length;
      setTimeout(tick,1200);
    } else setTimeout(tick,80);
  }
  tick();

  // Tilt interaction on device card
  const card = $('#device-card');
  if (card){
    card.addEventListener('mousemove', e=>{
      const r = card.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width/2);
      const dy = e.clientY - (r.top + r.height/2);
      const rx = (dy / r.height) * -12;
      const ry = (dx / r.width) * 12;
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) rotate(-6deg)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = 'rotate(-6deg)';
    });
  }

  // Project filters
  const filters = $$('.filter');
  const cards = $$('#projects-grid .card');
  filters.forEach(f => f.addEventListener('click', ()=>{
    filters.forEach(x=>x.classList.remove('active'));
    f.classList.add('active');
    const tag = f.dataset.filter;
    cards.forEach(c=>{
      const tags = c.dataset.tags.split(' ');
      if (tag === '*' || tags.includes(tag)) c.style.display = '';
      else c.style.display = 'none';
    });
  }));

  // GSAP animations
  if (window.gsap) {
    gsap.from('.hero-copy', {y:40, opacity:0, duration:1, ease:'power2.out'});
    gsap.from('.hero-art', {scale:0.8, opacity:0, duration:1, delay:0.3, ease:'back.out(1.7)'});
    gsap.from('.card', {y:30, opacity:0, stagger:0.15, duration:0.8, ease:'power2.out', delay:0.5});
  }

  // Animate cards on hover
  $$('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (window.gsap) gsap.to(card, {scale:1.04, boxShadow:'0 18px 40px rgba(2,8,23,0.7)', duration:0.3});
    });
    card.addEventListener('mouseleave', () => {
      if (window.gsap) gsap.to(card, {scale:1, boxShadow:'0 14px 30px rgba(2,8,23,0.6)', duration:0.3});
    });
  });

  // Modal transitions
  const modal = $('#project-modal');
  if (window.gsap && modal) {
    const showModal = () => gsap.to(modal, {autoAlpha:1, duration:0.3});
    const hideModal = () => gsap.to(modal, {autoAlpha:0, duration:0.3});
    modal.showModal = showModal;
    modal.hideModal = hideModal;
  }

  // Project modal with real preview content
  const modalContent = $('#modal-content');
  const modalTitle = $('#modal-title');
  const projectPreviews = {
    portfolio: {
      title: 'Portfolio Site',
      html: `<img src='img/portfolio-preview.jpg' alt='Portfolio preview' style='width:100%;border-radius:8px;margin-bottom:12px'><p>Modern responsive site with animations and a CMS-free workflow. Built with HTML, CSS, JS.</p>`
    },
    uilib: {
      title: 'UI Library',
      html: `<img src='img/ui-library-preview.jpg' alt='UI Library preview' style='width:100%;border-radius:8px;margin-bottom:12px'><p>Accessible component library for design systems. React + Storybook.</p>`
    },
    design: {
      title: 'Design Case Study',
      html: `<img src='img/design-preview.jpg' alt='Design preview' style='width:100%;border-radius:8px;margin-bottom:12px'><p>End-to-end product design with prototypes and usability testing.</p>`
    },
    blog: {
      title: 'Personal Blog',
      html: `<img src='img/blog-preview.jpg' alt='Blog preview' style='width:100%;border-radius:8px;margin-bottom:12px'><p>Minimal blog platform with markdown support and custom themes.</p>`
    },
    contrib: {
      title: 'Open Source Contributions',
      html: `<img src='img/contrib-preview.jpg' alt='OSS preview' style='width:100%;border-radius:8px;margin-bottom:12px'><p>Highlighted PRs and issues in popular OSS projects.</p>`
    }
  };

  $$('.view-btn').forEach(b=>b.addEventListener('click', e=>{
    const slug = e.currentTarget.dataset.slug;
    if (projectPreviews[slug]) {
      modalTitle.textContent = projectPreviews[slug].title;
      modalContent.innerHTML = projectPreviews[slug].html;
    } else {
      modalTitle.textContent = 'Project';
      modalContent.innerHTML = `<p>No preview available.</p>`;
    }
    modal.removeAttribute('aria-hidden');
    if (modal.showModal) modal.showModal();
  }));
  $('.modal-close').addEventListener('click', ()=>{
    if (modal.hideModal) modal.hideModal();
    modal.setAttribute('aria-hidden','true');
  });
  modal.addEventListener('click', e=>{ if (e.target === modal) {
    if (modal.hideModal) modal.hideModal();
    modal.setAttribute('aria-hidden','true');
  }});

  // Contact form (mock)
  const form = $('#contact-form');
  const status = $('#form-status');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = new FormData(form);
    status.textContent = 'Sending...';
    setTimeout(()=>{
      status.textContent = 'Thanks — I will reply soon!';
      form.reset();
    },1100);
  });

  // Footer year
  $('#year').textContent = new Date().getFullYear();
});
