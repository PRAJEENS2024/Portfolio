/* ═══════════════════════════════════════
   script.js — Portfolio Interactions
   2026 Premium Rewrite
   ═══════════════════════════════════════ */

'use strict';

/* ─── Theme Toggle ─── */
(function initTheme() {
  const root  = document.documentElement;
  const btn   = document.getElementById('theme-toggle');
  const icon  = document.getElementById('theme-icon');
  const saved = localStorage.getItem('ps-theme') || 'dark';

  const apply = (theme) => {
    root.setAttribute('data-theme', theme);
    icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('ps-theme', theme);
  };

  apply(saved);

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    apply(next);
  });
})();

/* ─── Navbar Scroll State ─── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);

    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── Mobile Menu ─── */
(function initMobileMenu() {
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const close = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  };

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.setAttribute('aria-hidden', String(!open));
  });

  mobileLinks.forEach(link => link.addEventListener('click', close));

  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) close();
  });
})();

/* ─── Typewriter ─── */
(function initTypewriter() {
  const el      = document.getElementById('typewriter-text');
  const phrases = [
    'ECE Student',
    'Full Stack Developer',
    'MERN Stack Developer',
    'Problem Solver',
    'Embedded Systems Engineer',
    'Open to Opportunities'
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  let paused    = false;

  const type = () => {
    if (paused) return;
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; }, 2400);
        return;
      }
      setTimeout(type, 65);
    } else {
      el.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 380);
        return;
      }
      setTimeout(type, 35);
    }
  };

  setTimeout(type, 700);
})();

/* ─── Scroll Reveal Animations ─── */
(function initAnimations() {
  const elements = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ─── Smooth Scroll for Anchor Links ─── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10
    ) || 68;
    window.scrollTo({
      top: target.offsetTop - offset,
      behavior: 'smooth'
    });
  });
});

/* ─── Skill Tag Stagger Animation ─── */
(function initSkillStagger() {
  const skillCategories = document.querySelectorAll('.skill-category');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const tags = entry.target.querySelectorAll('.skill-tag');
      tags.forEach((tag, i) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(12px)';
        requestAnimationFrame(() => {
          setTimeout(() => {
            tag.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          }, i * 60);
        });
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  skillCategories.forEach(cat => observer.observe(cat));
})();

/* ─── Counter Animation ─── */
function animateCounter(el) {
  const raw    = el.textContent.trim();
  const plus   = raw.includes('+');
  const numStr = raw.replace(/\D/g, '');
  const target = parseInt(numStr, 10);
  if (isNaN(target)) return;

  const duration = 1800;
  const start    = performance.now();

  const step = (now) => {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    const current  = Math.round(ease * target);
    el.textContent = current.toLocaleString() + (plus ? '+' : '');
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

(function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-value').forEach(el => observer.observe(el));
})();

(function initCodingCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.trim();
      const numStr = raw.replace(/[^0-9]/g, '');
      if (!numStr) return;
      animateCounter(el);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.c-val').forEach(el => observer.observe(el));
})();

/* ─── Certification Filter Tabs ─── */
(function initCertFilters() {
  const filterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards  = document.querySelectorAll('.cert-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards
      certCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease, border-color 0.3s, box-shadow 0.3s, transform 0.3s';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 20);
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ─── Hero image fallback ─── */
(function initImageFallback() {
  const img = document.getElementById('hero-profile-img');
  if (!img) return;

  img.addEventListener('error', () => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 380" width="320" height="380">
        <defs>
          <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8b5cf6"/>
            <stop offset="50%" style="stop-color:#6366f1"/>
            <stop offset="100%" style="stop-color:#06b6d4"/>
          </linearGradient>
          <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(139,92,246,0.4)"/>
            <stop offset="100%" style="stop-color:rgba(6,182,212,0.2)"/>
          </linearGradient>
        </defs>
        <rect width="320" height="380" fill="url(#g1)"/>
        <rect width="320" height="380" fill="url(#g2)"/>
        <circle cx="160" cy="138" r="64" fill="rgba(255,255,255,0.18)"/>
        <circle cx="160" cy="138" r="44" fill="rgba(255,255,255,0.12)"/>
        <path d="M50 340 Q160 270 270 340 L270 380 L50 380 Z" fill="rgba(255,255,255,0.12)"/>
        <text x="160" y="365" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="13" font-family="Inter,sans-serif" font-weight="700" letter-spacing="0.05em">PRAJEEN S</text>
      </svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(blob);
  });
})();

/* ─── 3D Tilt on Project Cards ─── */
(function initTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const cards = document.querySelectorAll('.project-card, .coding-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ─── Stagger animations for cert and achievement cards ─── */
(function initCardStagger() {
  const grids = document.querySelectorAll('.cert-grid, .achievements-list, .projects-grid, .coding-grid');

  grids.forEach(grid => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const cards = entry.target.querySelectorAll(':scope > *');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 65);
        });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05 });

    observer.observe(grid);
  });
})();

/* ─── Active section highlight in nav (enhanced) ─── */
(function initActiveSectionObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(sec => observer.observe(sec));
})();
