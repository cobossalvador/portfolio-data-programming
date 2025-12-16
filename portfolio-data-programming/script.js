// ============================================
// CONFIGURACIÓN GLOBAL
// ============================================
const CONFIG = {
    SCROLL_DURATION: 1200,
    TYPING_SPEED: 40,
    ANIMATION_THRESHOLD: 0.15,
    SCROLL_OFFSET: 80
};

// ============================================
// CACHE DE ELEMENTOS DOM
// ============================================
const DOM = {
    navbar: document.querySelector('.navbar'),
    navMenu: document.querySelector('.nav-menu'),
    menuToggle: document.querySelector('.menu-toggle'),
    heroSubtitle: document.querySelector('.hero-subtitle'),
    heroBackground: document.querySelector('.hero-background'),
    scrollIndicator: document.querySelector('.scroll-indicator'),
    heroStats: document.querySelectorAll('.stat-number'),
    stackTabs: document.querySelectorAll('.stack-tab'),
    techCategories: document.querySelectorAll('.tech-category'),
    techProgressBars: document.querySelectorAll('.tech-progress .progress-bar')
};

// ============================================
// MENU TOGGLE
// ============================================
const menuState = {
    isOpen: false,
    toggle: () => {
        menuState.isOpen = !menuState.isOpen;
        DOM.navMenu.classList.toggle('active');
        DOM.menuToggle.innerHTML = menuState.isOpen ? 
            '<i class="fas fa-times"></i>' : 
            '<i class="fas fa-bars"></i>';
        document.body.style.overflow = menuState.isOpen ? 'hidden' : '';
    }
};

DOM.menuToggle?.addEventListener('click', menuState.toggle);

// Cerrar menú al hacer clic en enlace
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
            menuState.isOpen = false;
            DOM.navMenu.classList.remove('active');
            DOM.menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    });
});

// ============================================
// STACK TECNOLÓGICO - SISTEMA DE PESTAÑAS
// ============================================
class StackTechnologiesManager {
    constructor() {
        this.activeTab = 'programacion';
        this.init();
    }

    init() {
        // Activar primera pestaña por defecto
        this.setActiveTab('programacion');
        this.showTechCategory('programacion');
        this.animateProgressBars();
        
        // Event listeners para pestañas
        DOM.stackTabs?.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                this.setActiveTab(category);
                this.showTechCategory(category);
                this.animateProgressBars();
            });
        });

        // Contador de tecnologías
        this.updateCounters();
        
        // Observador para animaciones al hacer scroll
        this.initScrollObserver();
    }

    setActiveTab(category) {
        DOM.stackTabs?.forEach(tab => {
            const isActive = tab.dataset.category === category;
            tab.classList.toggle('active', isActive);
            
            // Animación del ícono
            const icon = tab.querySelector('.tab-icon');
            if (icon) {
                if (isActive) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                } else {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            }
        });
        
        this.activeTab = category;
    }

    showTechCategory(category) {
        DOM.techCategories?.forEach(techCat => {
            const isActive = techCat.id === `${category}-tech`;
            if (isActive) {
                techCat.style.display = 'none';
                techCat.style.opacity = '0';
                techCat.classList.add('active');
                
                setTimeout(() => {
                    techCat.style.display = 'block';
                    setTimeout(() => {
                        techCat.style.opacity = '1';
                    }, 50);
                }, 10);
            } else {
                techCat.classList.remove('active');
                techCat.style.opacity = '0';
                setTimeout(() => {
                    techCat.style.display = 'none';
                }, 300);
            }
        });
    }

    animateProgressBars() {
        const activeCategory = document.querySelector('.tech-category.active');
        if (!activeCategory) return;
        
        const progressBars = activeCategory.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = width;
                bar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 300);
        });
    }

    updateCounters() {
        const categoryCounts = {
            programacion: document.querySelectorAll('#programacion-tech .tech-item').length,
            automatizacion: document.querySelectorAll('#automatizacion-tech .tech-item').length,
            cloud: document.querySelectorAll('#cloud-tech .tech-item').length
        };

        DOM.stackTabs?.forEach(tab => {
            const category = tab.dataset.category;
            const countElement = tab.querySelector('.tab-count');
            if (countElement && categoryCounts[category]) {
                countElement.textContent = `${categoryCounts[category]} tecnologías`;
            }
        });
    }

    initScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress-bar');
                    progressBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 300);
                    });
                }
            });
        }, { threshold: 0.1 });

        DOM.techCategories?.forEach(category => {
            observer.observe(category);
        });
    }
}

// ============================================
// SCROLL SUAVE
// ============================================
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute('href') === '#') return;
    
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;
    
    const targetPosition = target.offsetTop - CONFIG.SCROLL_OFFSET;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    
    const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / CONFIG.SCROLL_DURATION, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startPosition + distance * easeProgress);
        
        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    };
    
    const startTime = performance.now();
    requestAnimationFrame(animateScroll);
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            DOM.navbar?.classList.add('scrolled');
        } else {
            DOM.navbar?.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
        
        // Scroll indicator opacity
        if (DOM.scrollIndicator) {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const opacity = Math.max(0, 1 - (scrolled / windowHeight));
            DOM.scrollIndicator.style.opacity = opacity;
            DOM.scrollIndicator.style.visibility = opacity > 0 ? 'visible' : 'hidden';
        }
    });
});

// ============================================
// EFECTO DE ESCRITURA
// ============================================
if (DOM.heroSubtitle) {
    const originalText = DOM.heroSubtitle.textContent;
    DOM.heroSubtitle.textContent = '';
    DOM.heroSubtitle.style.minHeight = '1.2em';
    
    setTimeout(() => {
        let index = 0;
        const cursorSpan = document.createElement('span');
        cursorSpan.textContent = '|';
        cursorSpan.style.opacity = '0.7';
        cursorSpan.style.animation = 'blink 1s infinite';
        DOM.heroSubtitle.appendChild(cursorSpan);

        const typeWriter = () => {
            if (index < originalText.length) {
                cursorSpan.remove();
                DOM.heroSubtitle.textContent = originalText.substring(0, index + 1);
                DOM.heroSubtitle.appendChild(cursorSpan);
                index++;
                setTimeout(typeWriter, CONFIG.TYPING_SPEED);
            } else {
                cursorSpan.remove();
                DOM.heroSubtitle.classList.add('typing-complete');
            }
        };

        typeWriter();
    }, 800);
}

// ============================================
// CONTADORES ANIMADOS
// ============================================
DOM.heroStats?.forEach(stat => {
    const target = parseInt(stat.dataset.count) || 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target;
                    }
                };
                updateCounter();
                counterObserver.unobserve(stat);
            }
        });
    }, { threshold: 0.5 });

    counterObserver.observe(stat);
});

// ============================================
// EFECTOS HOVER MEJORADOS
// ============================================
// Efecto ripple para botones
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Hover para items de tecnología
document.querySelectorAll('.tech-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        const icon = item.querySelector('.tech-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
    });
    
    item.addEventListener('mouseleave', () => {
        const icon = item.querySelector('.tech-icon');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    });
});

// Hover para pestañas del stack
document.querySelectorAll('.stack-tab').forEach(tab => {
    tab.addEventListener('mouseenter', () => {
        if (!tab.classList.contains('active')) {
            const icon = tab.querySelector('.tab-icon');
            if (icon) {
                icon.style.transform = 'scale(1.05)';
            }
        }
    });
    
    tab.addEventListener('mouseleave', () => {
        if (!tab.classList.contains('active')) {
            const icon = tab.querySelector('.tab-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        }
    });
});

// ============================================
// ACTIVE NAV LINK
// ============================================
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const scrollPosition = window.pageYOffset + CONFIG.SCROLL_OFFSET;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Stack Technologies Manager
    const stackManager = new StackTechnologiesManager();
    window.stackManager = stackManager;
    
    // Añadir animación ripple al CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .typing-complete {
            border-right: none;
        }
        
        /* Animaciones para scroll */
        .scroll-animate {
            opacity: 0;
            transform: translateY(40px);
            transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                        transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .scroll-animate.animated {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    // Observador para animaciones al scroll
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: CONFIG.ANIMATION_THRESHOLD });
    
    // Observar elementos animables
    document.querySelectorAll('.about-content, .project-card, .achievement-badge.compact, .experience-card, .contact-item').forEach(el => {
        el.classList.add('scroll-animate');
        scrollObserver.observe(el);
    });
    
    // Mensaje de consola
    console.log('%c🚀 Salvador Cobos - Data Engineer', 
        'color: #6FFFE9; font-size: 16px; font-weight: bold;');
    console.log('%cPortafolio optimizado - Stack Tecnológico mejorado', 
        'color: #3A86FF; font-size: 14px;');
});

// ============================================
// RESIZE HANDLER
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 992 && menuState.isOpen) {
            menuState.toggle();
        }
    }, 250);
});