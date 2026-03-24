document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
            if (mobileMenu.classList.contains('open')) {
                icon.textContent = 'close';
            } else {
                icon.textContent = 'menu';
            }
        });

        // Close mobile menu on link click
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
            });
        });
    }

    // Navbar Scroll Effect & Active Link Highlighting
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Form Handling real via Formsubmit (AJAX) para não redirecionar
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.textContent;

            btn.textContent = 'Enviando...';
            btn.disabled = true;

            // Recoleta os dados do formulário
            const formData = new FormData(contactForm);

            // Fetch request para o Formsubmit
            fetch("https://formsubmit.co/ajax/leoagapitoo@gmail.com", {
                method: "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success === "false") throw new Error(data.message);

                    btn.textContent = 'Mensagem Enviada!';
                    btn.style.backgroundColor = '#4CAF50';
                    btn.style.borderColor = '#4CAF50';
                    btn.style.color = '#ffffff';

                    formStatus.textContent = 'Obrigado pelo contato! Retornaremos em breve.';
                    formStatus.style.color = '#4CAF50';
                    formStatus.classList.remove('hidden');

                    contactForm.reset();

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.borderColor = '';
                        btn.style.color = '';
                        btn.disabled = false;
                        formStatus.classList.add('hidden');
                    }, 4000);
                })
                .catch(error => {
                    console.error(error);
                    btn.textContent = 'Erro ao enviar';
                    btn.style.backgroundColor = '#f44336';

                    // Mensagem personalizada caso seja falha de ativação
                    formStatus.textContent = 'Houve um erro. Certifique-se de que o email foi ativado no Formsubmit.';
                    formStatus.style.color = '#f44336';
                    formStatus.classList.remove('hidden');

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                        formStatus.classList.add('hidden');
                    }, 4000);
                });
        });
    }
});
