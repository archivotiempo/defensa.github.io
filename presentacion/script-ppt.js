// Variables globales
let currentSlide = 0;
let slides = [];
let totalSlides = 0;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializePresentation();
    const agendaCards = document.querySelectorAll('.agenda-card');
    const url = window.location.pathname;
    agendaCards.forEach(card => {
        card.classList.remove('active'); // Limpia cualquier activo por defecto
        const href = card.getAttribute('href');
        if (href && url.endsWith(href)) {
            card.classList.add('active');
        }
    });
});

// Función de inicialización
function initializePresentation() {
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length;
    
    // Actualizar contador de slides
    updateSlideCounter();
    
    // Mostrar la primera slide
    showSlide(0);
    
    // Configurar eventos de teclado
    setupKeyboardEvents();
}

// Función para mostrar una slide específica
function showSlide(n) {
    // Ocultar slide actual
    if (slides[currentSlide]) {
        slides[currentSlide].classList.remove('active');
    }
    
    // Calcular índice de la nueva slide (con wraparound)
    currentSlide = (n + totalSlides) % totalSlides;
    
    // Mostrar nueva slide
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
    
    // Actualizar contador
    updateSlideCounter();
}

// Función para ir a la siguiente slide
function nextSlide() {
    showSlide(currentSlide + 1);
}

// Función para ir a la slide anterior
function previousSlide() {
    showSlide(currentSlide - 1);
}

// Función para ir a una slide específica
function goToSlide(slideNumber) {
    if (slideNumber >= 0 && slideNumber < totalSlides) {
        showSlide(slideNumber);
    }
}

// Función para actualizar el contador de slides
function updateSlideCounter() {
    const currentSlideElement = document.getElementById('current-slide');
    const totalSlidesElement = document.getElementById('total-slides');
    if (currentSlideElement) {
        currentSlideElement.textContent = currentSlide + 1;
    }
    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides;
    }
}

// Configurar eventos de teclado
function setupKeyboardEvents() {
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
            case 'Enter':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                previousSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
        }
    });
} 