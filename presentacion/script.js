// Variables globales
let currentSlide = 0;
let slides = [];
let totalSlides = 0;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializePresentation();
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
    
    // Configurar eventos de navegación
    setupNavigationEvents();
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
    
    // Scroll al inicio de la slide
    if (slides[currentSlide]) {
        slides[currentSlide].scrollTop = 0;
    }
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
    const counterElement = document.getElementById('slide-counter');
    if (counterElement) {
        counterElement.textContent = `${currentSlide + 1} / ${totalSlides}`;
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
            case 'Escape':
                e.preventDefault();
                // Aquí podrías añadir funcionalidad para salir de la presentación
                break;
        }
    });
}

// Configurar eventos de navegación
function setupNavigationEvents() {
    // Los botones de navegación ya tienen onclick en el HTML
    // Pero aquí podrías añadir eventos adicionales si es necesario
}

// Función para obtener información de la slide actual
function getCurrentSlideInfo() {
    return {
        index: currentSlide,
        total: totalSlides,
        element: slides[currentSlide],
        isFirst: currentSlide === 0,
        isLast: currentSlide === totalSlides - 1
    };
}

// Función para añadir efectos de transición personalizados
function addSlideTransition(slideElement, direction = 'fade') {
    slideElement.style.transition = 'opacity 0.5s ease-in-out';
    
    if (direction === 'slide-left') {
        slideElement.style.transform = 'translateX(-100%)';
    } else if (direction === 'slide-right') {
        slideElement.style.transform = 'translateX(100%)';
    }
}

// Función para mostrar/ocultar controles de navegación
function toggleNavigation(show = true) {
    const navigation = document.querySelector('.navigation');
    if (navigation) {
        navigation.style.display = show ? 'flex' : 'none';
    }
}

// Función para modo presentación (pantalla completa)
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Error al entrar en pantalla completa:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Función para exportar la presentación (futura funcionalidad)
function exportPresentation() {
    // Aquí podrías implementar la exportación a PDF o PPT
    console.log('Función de exportación no implementada aún');
}

// Función para imprimir la presentación
function printPresentation() {
    window.print();
}

// Eventos adicionales para accesibilidad
document.addEventListener('keydown', function(e) {
    // Navegación con números (1-9 para ir a slides específicas)
    if (e.key >= '1' && e.key <= '9') {
        const slideNumber = parseInt(e.key) - 1;
        if (slideNumber < totalSlides) {
            goToSlide(slideNumber);
        }
    }
});

// Función para auto-play (futura funcionalidad)
let autoPlayInterval = null;

function startAutoPlay(interval = 5000) {
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
        nextSlide();
    }, interval);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

// Función para mostrar miniaturas de slides (futura funcionalidad)
function showSlideThumbnails() {
    // Implementar vista de miniaturas
    console.log('Vista de miniaturas no implementada aún');
}

// Función para buscar en el contenido de las slides
function searchInSlides(query) {
    const results = [];
    slides.forEach((slide, index) => {
        const text = slide.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            results.push(index);
        }
    });
    return results;
}

// Función para resaltar texto en las slides
function highlightText(text) {
    // Implementar resaltado de texto
    console.log('Resaltado de texto no implementado aún');
}

// Exportar funciones para uso global
window.PresentationController = {
    nextSlide,
    previousSlide,
    goToSlide,
    getCurrentSlideInfo,
    toggleFullscreen,
    startAutoPlay,
    stopAutoPlay,
    searchInSlides
}; 