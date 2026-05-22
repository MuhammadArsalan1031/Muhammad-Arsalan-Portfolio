document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    const navLinksContainer = document.getElementById('nav-links');
    const hamburger = document.getElementById('hamburger');
    const cursorGlow = document.getElementById('cursor-glow');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    document.addEventListener('mousemove', (event) => {
        if (!cursorGlow) return;
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = event.currentTarget.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;

            event.preventDefault();
            hamburger?.classList.remove('active');
            navLinksContainer?.classList.remove('active');
            document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

    class NeuralBackground {
        constructor() {
            this.canvas = document.getElementById('neural-bg');
            this.ctx = this.canvas.getContext('2d');
            this.particles = [];
            this.particleCount = 80;
            window.addEventListener('resize', () => this.resize());
            this.resize();
            this.init();
            this.animate();
        }

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        init() {
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1
                });
            }
        }

        animate() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'rgba(134, 80, 241, 0.4)';
            this.ctx.strokeStyle = 'rgba(134, 80, 241, 0.1)';

            for (let i = 0; i < this.particles.length; i++) {
                const particle = this.particles[i];
                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();

                for (let j = i + 1; j < this.particles.length; j++) {
                    const secondParticle = this.particles[j];
                    const dx = particle.x - secondParticle.x;
                    const dy = particle.y - secondParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        this.ctx.lineWidth = 1 - distance / 150;
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(secondParticle.x, secondParticle.y);
                        this.ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(() => this.animate());
        }
    }

    if (document.getElementById('neural-bg')) {
        new NeuralBackground();
    }

    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(255, 255, 255, 0.9)';
            nav.style.boxShadow = '0 10px 40px rgba(0,0,0,0.05)';
        } else {
            nav.style.background = 'rgba(248, 249, 252, 0.8)';
            nav.style.boxShadow = 'none';
        }
    });

    const typedTextElement = document.getElementById('typed-text');
    if (typedTextElement) {
        const roles = [
            'Artificial Intelligence developer',
            'Machine Learning Engineer',
            'Deep Learning Engineer',
            'Data Analyst'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }

        setTimeout(type, 1000);
    }

    contactForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            formStatus.style.color = '#ff4a4a';
            formStatus.textContent = 'Please complete every field.';
            return;
        }

        formStatus.style.color = 'var(--primary)';
        formStatus.textContent = 'Sending...';

        // Simulate network latency (800ms)
        await new Promise(resolve => setTimeout(resolve, 800));

        formStatus.style.color = '#28a745'; // Set success message color to green
        formStatus.textContent = 'Thanks! Your message has been received.';
        contactForm.reset();
    });
});
