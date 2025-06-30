# Presentación Web TFM

Una presentación web moderna y profesional para la defensa de tu Trabajo de Fin de Máster (TFM).

## Características

- ✨ **Diseño Moderno**: Interfaz elegante con gradientes y efectos visuales
- 📱 **Responsive**: Adaptable a diferentes tamaños de pantalla
- ⌨️ **Navegación por Teclado**: Controles completos con teclado
- 👆 **Swipe en Móviles**: Navegación táctil para dispositivos móviles
- 🎯 **Indicadores Visuales**: Puntos de navegación en la parte inferior
- 🖥️ **Pantalla Completa**: Modo presentación optimizado
- 🎨 **Animaciones Suaves**: Transiciones fluidas entre diapositivas

## Estructura de Diapositivas

1. **Portada** - Título, autor, tutor y fecha
2. **Índice** - Estructura de la presentación
3. **Introducción y Justificación** - Contexto y motivación
4. **Objetivos** - Objetivo general y específicos
5. **Marco Teórico** - Fundamentos y estado del arte
6. **Metodología** - Fases del trabajo
7. **Desarrollo del Trabajo** - Proceso y herramientas
8. **Resultados** - Principales hallazgos y métricas
9. **Conclusiones** - Logros, limitaciones y líneas futuras
10. **Bibliografía** - Referencias utilizadas
11. **Agradecimientos** - Cierre y contacto

## Cómo Usar

### Navegación

- **Flechas del teclado**: ← → para navegar
- **Espacio/Enter**: Siguiente diapositiva
- **Home/End**: Ir al inicio/final
- **Escape**: Pantalla completa
- **Botones en pantalla**: Navegación visual
- **Indicadores inferiores**: Navegación directa
- **Swipe en móviles**: Deslizar izquierda/derecha

### Personalización

1. **Editar contenido**: Modifica el archivo `index.html`
2. **Cambiar estilos**: Edita `styles.css`
3. **Añadir funcionalidad**: Modifica `script.js`

### Ejecutar

1. Abre `index.html` en tu navegador
2. Para presentación: F11 (pantalla completa)
3. Para imprimir: Ctrl+P

## Personalización del Contenido

### 1. Información Básica
Edita la diapositiva 1 (portada) con:
- Título de tu TFM
- Tu nombre
- Nombre del tutor
- Fecha de defensa

### 2. Contenido de Diapositivas
Reemplaza los textos entre `[corchetes]` con tu contenido real:
- Introducción y contexto
- Objetivos específicos
- Metodología detallada
- Resultados cuantitativos
- Conclusiones

### 3. Imágenes y Gráficos
Reemplaza los placeholders de imágenes:
```html
<div class="placeholder-image">
    <img src="tu-imagen.jpg" alt="Descripción">
</div>
```

### 4. Colores y Estilo
Modifica en `styles.css`:
- Colores principales: `#667eea` y `#764ba2`
- Tipografía: Fuente Inter (Google Fonts)
- Efectos visuales y animaciones

## Funciones Avanzadas

### Auto-play (Opcional)
Descomenta en `script.js`:
```javascript
// startAutoPlay(); // Iniciar reproducción automática
```

### Exportar a PDF
Añade librería jsPDF:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
```

### Añadir Más Diapositivas
1. Copia una diapositiva existente en `index.html`
2. Actualiza el contador en `script.js`
3. Añade indicador correspondiente

## Consejos para la Presentación

1. **Practica la navegación** antes de la defensa
2. **Usa pantalla completa** para mejor impacto visual
3. **Prepara transiciones** entre diapositivas
4. **Ten un plan B** (versión PDF o PowerPoint)
5. **Prueba en el equipo** donde harás la presentación

## Compatibilidad

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Dispositivos móviles

## Estructura de Archivos

```
presentacion-tfm/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos y diseño
├── script.js           # Funcionalidad JavaScript
└── README.md           # Este archivo
```

## Licencia

Este proyecto está disponible para uso educativo y personal.

---

**¡Buena suerte con tu defensa de TFM! 🎓** 