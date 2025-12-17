document.addEventListener('DOMContentLoaded', function () {

    // =========================================
    // 1. LOGICA NAVBAR RESPONSIVE
    // =========================================
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        const navLinks = navMenu.querySelectorAll('a');

        const closeMenu = () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        };

        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) {
                    closeMenu();
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeMenu();
            }
        });
    }

    // =========================================
    // 3. LOGICA PER GLI SLIDER NELLE PROJECT CARD
    // =========================================
    const sliders = document.querySelectorAll('.slider-container');

    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                }
            });
        }

        function stopLink(e) {
            e.stopPropagation();
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', (e) => {
                stopLink(e);
                currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
                showSlide(currentSlide);
            });

            nextBtn.addEventListener('click', (e) => {
                stopLink(e);
                currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
                showSlide(currentSlide);
            });
        }

        if (slides.length > 0) {
            showSlide(0);
        }
    });

    // =========================================
    // 4. ANIMAZIONE BACKGROUND HERO (Constellation Effect)
    // =========================================
    const canvas = document.getElementById('hero-canvas');

    // Eseguiamo l'animazione SOLO se il canvas esiste nella pagina
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;

        // Gestione ridimensionamento finestra
        window.addEventListener('resize', function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init();
        });

        // Classe Particella
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.directionX = (Math.random() * 1) - 0.5;
                this.directionY = (Math.random() * 1) - 0.5;
                this.size = (Math.random() * 2) + 1;
                // Colore: Bianco o il tuo Accento Blu
                this.color = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.7)' : 'rgba(74, 105, 255, 0.8)';
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update() {
                // Rimbalzo bordi
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        // Inizializzazione
        function init() {
            particlesArray = [];
            // Formula per calcolare numero particelle in base allo schermo
            let numberOfParticles = (canvas.height * canvas.width) / 15000;

            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        // Connessione linee
        function connect() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                        ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    // Se distanza < X, disegna linea
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        let opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(255, 255, 255,' + (opacityValue * 0.15) + ')';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Loop animazione
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        }

        // Avvio
        init();
        animate();
    }
});