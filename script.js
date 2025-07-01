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
    totalSlides = slides.length;
    updateSlideCounter();
    showSlide(0);
    setupEventListeners();
    setupKeyboardShortcuts();
    setupTouchGestures();
    initializeCharts();
    loadPresenterNotes();
    startPresentationTracking();
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
    
    // Detectar cambios en pantalla completa
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
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
    
    // Validar que la slide existe antes de guardar
    if (currentSlide + 1 <= totalSlides) {
        localStorage.setItem('tfm-current-slide', currentSlide + 1);
    }
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
        case 'r':
        case 'R':
            e.preventDefault();
            resetTimer();
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
    } else {
        document.exitFullscreen();
    }
}

function updateFullscreenIcon() {
    if (fullscreenBtn) {
        if (document.fullscreenElement) {
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
        } else {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
        }
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

function resetTimer() {
    stopTimer();
    startTimer();
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
        case 6: // Competencias
            animateCompetences();
            break;
        case 7: // Timeline
            animateEras();
            break;
        case 8: // Adaptaciones
            animateAdaptations();
            break;
        case 9: // Metodología
            animateMethodology();
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
        case 15: // Sostenibilidad
            animateSustainability();
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
    if (typeof Chart === 'undefined') {
        console.log('Chart.js no está disponible');
        return;
    }
    
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
    if (!ctx || typeof Chart === 'undefined') return;
    
    if (accessChartInstance) {
        accessChartInstance.destroy();
    }
    
    let animating = true;
    accessChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Con acceso STEAM', 'Sin acceso STEAM'],
            datasets: [{
                data: [0, 0],
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
                easing: 'easeInOutQuart',
                onProgress: function(animation) {
                    if (!animating) return;
                    const chart = animation.chart;
                    const dataset = chart.data.datasets[0];
                    const progress = animation.currentStep / animation.numSteps;
                    dataset.data = [35 * progress, 0];
                    chart.update('none');
                },
                onComplete: function(animation) {
                    if (!animating) return;
                    const chart = animation.chart;
                    chart.data.datasets[0].data = [35, 0];
                    chart.update();
                    setTimeout(() => {
                        chart.options.animation = false;
                        chart.data.datasets[0].data = [35, 65];
                        chart.update();
                        animating = false;
                    }, 50);
                }
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
    if (!ctx || typeof Chart === 'undefined') return;
    
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
    if (!ctx || typeof Chart === 'undefined') return;
    
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
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiB2aWV3Qm94PSIwIDAgMTAwIDYwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjUwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE2IiBmaWxsPSIjMDAwMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5VUkpDPC90ZXh0Pgo8L3N2Zz4K'
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
        const slideNum = parseInt(slide);
        if (slideNum >= 1 && slideNum <= totalSlides) {
            goToSlide(slideNum);
        }
    } else {
        // Recuperar última diapositiva de localStorage
        const savedSlide = localStorage.getItem('tfm-current-slide');
        if (savedSlide && !isNaN(savedSlide)) {
            const slideNum = parseInt(savedSlide);
            if (slideNum >= 1 && slideNum <= totalSlides) {
                goToSlide(slideNum);
            }
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
    R: Reset timer
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

// Funciones adicionales para animaciones específicas
function animateCompetences() {
    const competences = document.querySelectorAll('.competencia-item:not(.inactive)');
    competences.forEach((comp, index) => {
        setTimeout(() => {
            comp.style.transform = 'scale(1.05)';
            setTimeout(() => {
                comp.style.transform = 'scale(1)';
            }, 200);
        }, index * 100);
    });
}

function animateEras() {
    const eras = document.querySelectorAll('.era-item');
    eras.forEach((era, index) => {
        setTimeout(() => {
            era.classList.add('animated', 'fadeInUp');
        }, index * 150);
    });
}

function animateAdaptations() {
    const adaptations = document.querySelectorAll('.adaptacion-steam-card');
    adaptations.forEach((adaptation, index) => {
        setTimeout(() => {
            adaptation.classList.add('animated', 'fadeIn');
        }, index * 100);
    });
}

function animateMethodology() {
    const phases = document.querySelectorAll('.metodologia-phase');
    phases.forEach((phase, index) => {
        setTimeout(() => {
            phase.classList.add('animated', 'fadeInUp');
        }, index * 200);
    });
}

function animateSustainability() {
    const items = document.querySelectorAll('.sustainability-card');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animated', 'fadeInLeft');
        }, index * 300);
    });
}

// Funciones de navegación mejoradas
function jumpToSection(section) {
    const sectionMap = {
        'intro': 3,
        'objectives': 4,
        'theory': 5,
        'competences': 6,
        'design': 7,
        'adaptations': 8,
        'methodology': 9,
        'instruments': 10,
        'results': 11,
        'findings': 12,
        'voices': 13,
        'transfer': 14,
        'sustainability': 15,
        'limitations': 16,
        'conclusions': 17,
        'challenges': 18,
        'checklist': 19,
        'reflection': 20,
        'questions': 21,
        'thanks': 22,
        'resources': 23
    };
    
    if (sectionMap[section]) {
        goToSlide(sectionMap[section]);
    }
}

// Sistema de bookmarks
function addBookmark(slideNum, name) {
    const bookmarks = JSON.parse(localStorage.getItem('tfm-bookmarks') || '{}');
    bookmarks[slideNum] = name;
    localStorage.setItem('tfm-bookmarks', JSON.stringify(bookmarks));
}

function getBookmarks() {
    return JSON.parse(localStorage.getItem('tfm-bookmarks') || '{}');
}

function removeBookmark(slideNum) {
    const bookmarks = getBookmarks();
    delete bookmarks[slideNum];
    localStorage.setItem('tfm-bookmarks', JSON.stringify(bookmarks));
}

// Funciones de exportación
function exportToPDF() {
    window.print();
}

function exportSlideAsImage(slideNum) {
    const slide = document.getElementById(`slide-${slideNum}`);
    if (!slide) return;
    
    // Implementar captura de pantalla usando html2canvas si está disponible
    if (typeof html2canvas !== 'undefined') {
        html2canvas(slide).then(canvas => {
            const link = document.createElement('a');
            link.download = `slide-${slideNum}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    } else {
        console.log('html2canvas no está disponible para exportar imágenes');
    }
}

// Sistema de notas del presenter
let presenterNotes = {};

function addNote(slideNum, note) {
    presenterNotes[slideNum] = note;
    localStorage.setItem('tfm-presenter-notes', JSON.stringify(presenterNotes));
}

function getNote(slideNum) {
    return presenterNotes[slideNum] || '';
}

function loadPresenterNotes() {
    const saved = localStorage.getItem('tfm-presenter-notes');
    if (saved) {
        presenterNotes = JSON.parse(saved);
    }
}

// Sistema de estadísticas de presentación
let presentationStats = {
    startTime: null,
    slideTime: {},
    totalTime: 0,
    slideVisits: {}
};

function startPresentationTracking() {
    presentationStats.startTime = Date.now();
    presentationStats.slideTime[currentSlide + 1] = Date.now();
}

function trackSlideChange(fromSlide, toSlide) {
    const now = Date.now();
    
    if (presentationStats.slideTime[fromSlide]) {
        const timeOnSlide = now - presentationStats.slideTime[fromSlide];
        presentationStats.totalTime += timeOnSlide;
    }
    
    presentationStats.slideTime[toSlide] = now;
    presentationStats.slideVisits[toSlide] = (presentationStats.slideVisits[toSlide] || 0) + 1;
}

function getPresentationStats() {
    const totalMinutes = Math.round(presentationStats.totalTime / 60000);
    const mostVisited = Object.keys(presentationStats.slideVisits)
        .reduce((a, b) => presentationStats.slideVisits[a] > presentationStats.slideVisits[b] ? a : b);
    
    return {
        totalTime: totalMinutes,
        mostVisitedSlide: mostVisited,
        slideVisits: presentationStats.slideVisits
    };
}

// Actualizar showSlide para incluir tracking
const originalShowSlide = showSlide;
showSlide = function(n) {
    const oldSlide = currentSlide + 1;
    originalShowSlide(n);
    const newSlide = currentSlide + 1;
    
    if (oldSlide !== newSlide) {
        trackSlideChange(oldSlide, newSlide);
    }
};

// Exportar funciones para uso externo
window.presentationControls = {
    nextSlide,
    previousSlide,
    goToSlide,
    toggleFullscreen,
    toggleTimer,
    resetTimer,
    togglePresentationMode,
    jumpToSection,
    addBookmark,
    getBookmarks,
    removeBookmark,
    exportToPDF,
    exportSlideAsImage,
    addNote,
    getNote,
    getPresentationStats
};

// Funciones de configuración avanzada
function setTimerDuration(minutes) {
    if (timerInterval) {
        stopTimer();
    }
    
    // Actualizar la duración por defecto
    const startTimerOriginal = startTimer;
    startTimer = function() {
        let mins = minutes;
        let secs = 0;
        
        timerElement.classList.add('active');
        
        timerInterval = setInterval(() => {
            if (secs === 0) {
                if (mins === 0) {
                    stopTimer();
                    alert('¡Tiempo terminado!');
                    return;
                }
                mins--;
                secs = 59;
            } else {
                secs--;
            }
            
            minutesElement.textContent = mins.toString().padStart(2, '0');
            secondsElement.textContent = secs.toString().padStart(2, '0');
            
            // Advertencias
            if (mins === Math.ceil(minutes * 0.2) && secs === 0) {
                timerElement.style.background = 'rgba(255, 119, 198, 0.8)';
            }
            
            if (mins === Math.ceil(minutes * 0.1) && secs === 0) {
                timerElement.style.background = 'rgba(255, 77, 77, 0.8)';
            }
        }, 1000);
    };
}

// Configuración de tema
function setTheme(themeName) {
    const themes = {
        default: {
            '--primary-color': '#7877c6',
            '--secondary-color': '#ff77c6',
            '--accent-color': '#78dbff',
            '--text-color': '#e0e0e0'
        },
        dark: {
            '--primary-color': '#333366',
            '--secondary-color': '#cc4499',
            '--accent-color': '#4499cc',
            '--text-color': '#cccccc'
        },
        light: {
            '--primary-color': '#9999ff',
            '--secondary-color': '#ff99cc',
            '--accent-color': '#99ccff',
            '--text-color': '#333333'
        }
    };
    
    if (themes[themeName]) {
        const root = document.documentElement;
        Object.entries(themes[themeName]).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }
}

// Modo ensayo (rehearsal mode)
let rehearsalMode = false;
let rehearsalData = {
    attempts: 0,
    bestTime: Infinity,
    averageTime: 0,
    notes: []
};

function toggleRehearsalMode() {
    rehearsalMode = !rehearsalMode;
    
    if (rehearsalMode) {
        console.log('Modo ensayo activado');
        startPresentationTracking();
    } else {
        console.log('Modo ensayo desactivado');
        const stats = getPresentationStats();
        rehearsalData.attempts++;
        
        if (stats.totalTime < rehearsalData.bestTime) {
            rehearsalData.bestTime = stats.totalTime;
        }
        
        // Calcular tiempo promedio
        rehearsalData.averageTime = (rehearsalData.averageTime * (rehearsalData.attempts - 1) + stats.totalTime) / rehearsalData.attempts;
        
        console.log(`Ensayo ${rehearsalData.attempts} completado:`, {
            tiempo: stats.totalTime,
            mejorTiempo: rehearsalData.bestTime,
            tiempoPromedio: rehearsalData.averageTime
        });
    }
}

// Agregar funciones adicionales al objeto global
window.presentationControls = {
    ...window.presentationControls,
    setTimerDuration,
    setTheme,
    toggleRehearsalMode,
    getRehearsal: () => rehearsalData
};