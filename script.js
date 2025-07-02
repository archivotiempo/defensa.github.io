// Variables globales
let currentSlide = 0;
let slides = [];
let totalSlides = 0;
let timerInterval;
let presentationMode = false;

// Variables globales para los gráficos de Chart.js
let accessChartInstance = null;
let steamChartInstance = null;
let steamChart2Instance = null;

// Elementos del DOM
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const slideCounter = document.getElementById('slideCounter');
const timerElement = document.getElementById('timer');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const navTitle = document.getElementById('navTitle');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    slides = document.querySelectorAll('.slide');
    totalSlides = slides.length; // Ahora será 18 slides
    updateSlideCounter();
    showSlide(0);
    setupEventListeners();
    setupKeyboardShortcuts();
    setupTouchGestures();
    initializeCharts();
});

// Funciones de inicialización
function initializePresentation() {
    updateSlideCounter();
    updateNavigationButtons();
    preloadImages();
    checkUrlParameters();
}

function setupEventListeners() {
    // Botones de navegación
    prevBtn.addEventListener('click', previousSlide);
    nextBtn.addEventListener('click', nextSlide);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Eventos de teclado
    document.addEventListener('keydown', handleKeyPress);
    
    // Doble click para modo presentación
    document.addEventListener('dblclick', togglePresentationMode);
    
    // Visibilidad de controles
    let controlsTimeout;
    document.addEventListener('mousemove', () => {
        clearTimeout(controlsTimeout);
        showControls();
        controlsTimeout = setTimeout(hideControls, 3000);
    });

    // Hacer que el título de la barra superior lleve a la portada
    if (navTitle) {
        navTitle.addEventListener('click', () => {
            goToSlide(1);
        });
    }
}

function showSlide(n) {
    if (slides[currentSlide]) {
        slides[currentSlide].classList.remove('active');
    }
    currentSlide = (n + totalSlides) % totalSlides;
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
        slides[currentSlide].scrollTop = 0;
    }
    updateSlideCounter();
    updateNavigationButtons();
    applySlideEffects(currentSlide + 1);
    localStorage.setItem('tfm-current-slide', currentSlide + 1);
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function previousSlide() {
    showSlide(currentSlide - 1);
}

function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) return;
    showSlide(slideNumber - 1);
}

function updateSlideCounter() {
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
}

function updateNavigationButtons() {
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

// Manejo de teclado
function handleKeyPress(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            previousSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides);
            break;
        case 'f':
        case 'F':
            e.preventDefault();
            toggleFullscreen();
            break;
        case 't':
        case 'T':
            e.preventDefault();
            toggleTimer();
            break;
        case 'p':
        case 'P':
            e.preventDefault();
            togglePresentationMode();
            break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            e.preventDefault();
            const slideNum = parseInt(e.key);
            if (slideNum <= totalSlides) {
                goToSlide(slideNum);
            }
            break;
    }
}

// Gestos táctiles
function setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });
    
    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                previousSlide();
            }
        }
    }
}

// Pantalla completa
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error al entrar en pantalla completa: ${err.message}`);
        });
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

// Timer
function toggleTimer() {
    if (timerInterval) {
        stopTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    let minutes = 10;
    let seconds = 0;
    
    timerElement.classList.add('active');
    
    timerInterval = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                stopTimer();
                alert('¡Tiempo terminado!');
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Advertencia cuando quedan 2 minutos
        if (minutes === 2 && seconds === 0) {
            timerElement.style.background = 'rgba(255, 119, 198, 0.8)';
        }
        
        // Advertencia cuando queda 1 minuto
        if (minutes === 1 && seconds === 0) {
            timerElement.style.background = 'rgba(255, 77, 77, 0.8)';
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerElement.classList.remove('active');
    timerElement.style.background = 'rgba(15, 15, 35, 0.8)';
    minutesElement.textContent = '10';
    secondsElement.textContent = '00';
}

// Modo presentación
function togglePresentationMode() {
    presentationMode = !presentationMode;
    document.body.classList.toggle('presentation-mode');
}

// Controles de visibilidad
function showControls() {
    document.querySelector('.navbar').style.opacity = '1';
}

function hideControls() {
    if (presentationMode) {
        document.querySelector('.navbar').style.opacity = '0';
    }
}

// Efectos especiales por diapositiva
function applySlideEffects(slideNumber) {
    // Resetear efectos anteriores
    document.querySelectorAll('.animated').forEach(el => {
        el.classList.remove('animated');
    });
    
    // Aplicar efectos según la diapositiva
    switch(slideNumber) {
        case 1: // Portada
            animateElement('.main-title', 'fadeInDown');
            animateElement('.subtitle', 'fadeInUp');
            animateElement('.author-info', 'fadeIn', 500);
            break;
        case 3: // Contexto
            animateElement('.barrier-section', 'fadeInLeft');
            animateElement('.opportunity-section', 'fadeInRight', 300);
            if (typeof Chart !== 'undefined') {
                updateAccessChart();
            }
            break;
        case 11: // Resultados cuantitativos
            if (typeof Chart !== 'undefined') {
                updateSteamChart();
                updateSteamChart2();
            }
            animateMetrics();
            break;
        case 12: // Hallazgos cualitativos
            animateFindings();
            break;
        case 13: // Testimonios
            animateTestimonials();
            break;
    }
}

function animateElement(selector, animation, delay = 0) {
    setTimeout(() => {
        const element = document.querySelector(selector);
        if (element) {
            element.classList.add('animated', animation);
        }
    }, delay);
}

function animateMetrics() {
    const metrics = document.querySelectorAll('.metric-card');
    metrics.forEach((metric, index) => {
        setTimeout(() => {
            metric.classList.add('animated', 'bounceIn');
        }, index * 200);
    });
}

function animateFindings() {
    const findings = document.querySelectorAll('.finding');
    findings.forEach((finding, index) => {
        setTimeout(() => {
            finding.classList.add('animated', 'fadeInUp');
        }, index * 150);
    });
}

function animateTestimonials() {
    const quotes = document.querySelectorAll('.quote-card');
    quotes.forEach((quote, index) => {
        setTimeout(() => {
            quote.classList.add('animated', 'fadeIn');
        }, index * 300);
    });
}

// Gráficos con Chart.js
function initializeCharts() {
    if (typeof Chart === 'undefined') return;
    
    // Configuración global
    Chart.defaults.color = '#e0e0ff';
    Chart.defaults.font.family = 'Inter, sans-serif';
    
    // Inicializar gráficos cuando sea necesario
    setTimeout(() => {
        updateAccessChart();
        updateSteamChart();
        updateSteamChart2();
    }, 1000);
}

function updateAccessChart() {
    const ctx = document.getElementById('accessChart');
    if (!ctx) return;
    if (accessChartInstance) {
        accessChartInstance.destroy();
    }
    accessChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Con acceso STEAM', 'Sin acceso STEAM'],
            datasets: [{
                data: [35, 65], // Ambos valores visibles desde el inicio
                backgroundColor: ['#7877c6', '#ff77c6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 900,
                easing: 'easeInOutQuart'
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

function updateSteamChart() {
    const ctx = document.getElementById('steamChart');
    if (!ctx) return;
    if (steamChartInstance) {
        steamChartInstance.destroy();
    }
    steamChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Científicas', 'Tecnológicas', 'Matemáticas', 'Artísticas'],
            datasets: [{
                label: 'Incremento %',
                data: [68, 72, 65, 58],
                backgroundColor: [
                    'rgba(120, 119, 198, 0.8)',
                    'rgba(255, 119, 198, 0.8)',
                    'rgba(120, 219, 255, 0.8)',
                    'rgba(255, 219, 120, 0.8)'
                ],
                borderRadius: 12,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateScale: true,
                animateRotate: false,
                easing: 'easeOutQuart',
                duration: 1500
            },
            indexAxis: 'x',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Incremento: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 80,
                    grid: { color: 'rgba(120,119,198,0.12)' },
                    ticks: { color: '#fff', font: { weight: 'bold' } }
                },
                x: {
                    grid: { color: 'rgba(120,119,198,0.08)' },
                    ticks: { color: '#fff', font: { weight: 'bold' } }
                }
            }
        }
    });
}

function updateSteamChart2() {
    const ctx = document.getElementById('steamChart2');
    if (!ctx) return;
    if (steamChart2Instance) {
        steamChart2Instance.destroy();
    }
    steamChart2Instance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Pre-test', 'Post-test'],
            datasets: [{
                label: 'Competencias STEAM',
                data: [2.1, 4.3],
                backgroundColor: ['#7877c6', '#ff77c6'],
                borderRadius: 12,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                animateScale: true,
                animateRotate: false,
                easing: 'easeOutQuart',
                duration: 1500
            },
            indexAxis: 'x',
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(120,119,198,0.12)' },
                    ticks: { color: '#fff', font: { weight: 'bold' } }
                },
                x: {
                    grid: { color: 'rgba(120,119,198,0.08)' },
                    ticks: { color: '#fff', font: { weight: 'bold' } }
                }
            }
        }
    });
}

// Utilidades
function preloadImages() {
    const imagesToPreload = [
        'logo.png'
    ];
    
    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const slide = urlParams.get('slide');
    if (slide && !isNaN(slide)) {
        goToSlide(parseInt(slide));
    } else {
        // Recuperar última diapositiva de localStorage
        const savedSlide = localStorage.getItem('tfm-current-slide');
        if (savedSlide && !isNaN(savedSlide)) {
            goToSlide(parseInt(savedSlide));
        }
    }
}

// Atajos de teclado
function setupKeyboardShortcuts() {
    // Mostrar ayuda con '?'
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' && !e.shiftKey) {
            showKeyboardHelp();
        }
    });
}

function showKeyboardHelp() {
    const help = `
    Atajos de teclado:
    
    → / Espacio: Siguiente diapositiva
    ←: Diapositiva anterior
    Inicio: Primera diapositiva
    Fin: Última diapositiva
    F: Pantalla completa
    T: Iniciar/detener timer
    P: Modo presentación
    1-9: Ir a diapositiva específica
    ?: Mostrar esta ayuda
    `;
    alert(help);
}

// Función para el checklist interactivo
function toggleCheck(element) {
    const icon = element.querySelector('i');
    const span = element.querySelector('span');
    
    if (element.classList.contains('checked')) {
        element.classList.remove('checked');
        icon.className = 'far fa-square';
    } else {
        element.classList.add('checked');
        icon.className = 'fas fa-check-square';
    }
}

// Animaciones CSS adicionales
const animationStyles = `
<style>
@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInLeft {
    from {
        opacity: 0;
        transform: translateX(-50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeInRight {
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes bounceIn {
    0% {
        opacity: 0;
        transform: scale(0.3);
    }
    50% {
        opacity: 1;
        transform: scale(1.05);
    }
    70% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}

.animated {
    animation-duration: 0.8s;
    animation-fill-mode: both;
}

.animated.fadeInDown { animation-name: fadeInDown; }
.animated.fadeInUp { animation-name: fadeInUp; }
.animated.fadeInLeft { animation-name: fadeInLeft; }
.animated.fadeInRight { animation-name: fadeInRight; }
.animated.fadeIn { animation-name: fadeIn; }
.animated.bounceIn { animation-name: bounceIn; }
</style>
`;

// Inyectar estilos de animación
document.head.insertAdjacentHTML('beforeend', animationStyles);

// Exportar funciones para uso externo
window.presentationControls = {
    nextSlide,
    previousSlide,
    goToSlide,
    toggleFullscreen,
    toggleTimer,
    togglePresentationMode
};