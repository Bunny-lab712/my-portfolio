// 1. Scroll-Triggered Reveal & Stagger Animation
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Number count-up trigger for hero stats
      const counters = entry.target.querySelectorAll('.num');
      counters.forEach(counter => animateValue(counter as HTMLElement));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((el, index) => {
  (el as HTMLElement).style.transitionDelay = `${index * 80}ms`;
  revealObserver.observe(el);
});

// Number Counter Function
function animateValue(obj: HTMLElement) {
  const target = parseInt(obj.getAttribute('data-target') || '0');
  let current = 0;
  const duration = 1200;
  const stepTime = Math.abs(Math.floor(duration / target));
  
  const timer = setInterval(() => {
    current += 1;
    obj.innerHTML = current.toString();
    if (current >= target) clearInterval(timer);
  }, stepTime);
}

// 2. Navigation State on Scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
});

// 3. Canvas Particle System
const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;

    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx!.beginPath();
      ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx!.fillStyle = '#7c3aed';
      ctx!.fill();
    }
  }

  const particles = Array.from({ length: 80 }, () => new Particle());

  function animateParticles() {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((p, index) => {
      p.update();
      p.draw();
      
      // Connect nearby particles
      for (let j = index + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx!.beginPath();
          ctx!.strokeStyle = `rgba(124, 58, 237, ${1 - distance / 100})`;
          ctx!.lineWidth = 0.5;
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(p2.x, p2.y);
          ctx!.stroke();
        }
      }
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}