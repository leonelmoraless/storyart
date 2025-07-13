# 🎨 StoryArt - Creador de Historias Visuales con IA

Una herramienta innovadora para crear historias visuales, cómics y storyboards usando inteligencia artificial.

![StoryArt Banner](https://via.placeholder.com/800x400/667eea/ffffff?text=StoryArt+-+AI+Visual+Storytelling)

## ✨ Características Principales

### 🤖 **Inteligencia Artificial Integrada**
- **Generación de Personajes**: Crea personajes únicos con descripciones detalladas
- **Fondos Automáticos**: Genera escenarios perfectos para tus historias
- **Diálogos Inteligentes**: Sugerencias de diálogos basadas en el contexto

### 🎨 **Editor Visual Avanzado**
- **Drag & Drop**: Arrastra personajes y elementos fácilmente
- **Sistema de Burbujas**: Diálogos, pensamientos y efectos de texto
- **Zoom y Navegación**: Control total sobre tu canvas
- **Undo/Redo**: Historial completo de cambios

### 📄 **Exportación Profesional**
- **PDF de Alta Calidad**: Cada escena como una página completa
- **Posicionamiento Exacto**: Mantiene la ubicación precisa de todos los elementos
- **Múltiples Formatos**: PDF, PNG y JSON
- **Portada Automática**: Genera portadas profesionales

### 💾 **Gestión Inteligente**
- **Auto-guardado**: Guarda automáticamente cada 30 segundos
- **Backup Automático**: Mantiene copias de seguridad
- **Importar/Exportar**: Comparte proyectos fácilmente
- **Persistencia Local**: Nunca pierdas tu trabajo

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 18+ 
- API Key de Google Gemini

### Instalación Local
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/storyart.git
cd storyart

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tu API key de Gemini

# Ejecutar en desarrollo
npm run dev
```

### Configuración de API
1. Obtén una API key de [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Crea un archivo `.env.local` en la raíz del proyecto
3. Añade tu API key:
```env
VITE_GEMINI_API_KEY=tu_api_key_aqui
```

## 🎯 Casos de Uso

- **📚 Cómics Digitales**: Crea cómics completos con personajes y diálogos
- **🎭 Storyboards**: Planifica películas, videos y animaciones
- **📖 Libros Ilustrados**: Diseña libros para niños y adultos
- **🎬 Guiones Visuales**: Visualiza guiones y narrativas
- **🎨 Novelas Gráficas**: Desarrolla historias largas y complejas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **IA**: Google Gemini API
- **Canvas**: HTML5 Canvas API, html2canvas
- **PDF**: jsPDF
- **Build**: Vite
- **Deploy**: Vercel

## 📱 Características Técnicas

### Arquitectura
- **Componentes Modulares**: Arquitectura escalable y mantenible
- **Estado Global**: Gestión eficiente del estado de la aplicación
- **Servicios Separados**: IA, almacenamiento y exportación independientes

### Rendimiento
- **Lazy Loading**: Carga componentes bajo demanda
- **Optimización de Imágenes**: Compresión automática
- **Cache Inteligente**: Almacenamiento local eficiente

### Compatibilidad
- **Navegadores Modernos**: Chrome, Firefox, Safari, Edge
- **Responsive**: Funciona en desktop y tablet
- **Cross-Platform**: Windows, macOS, Linux

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- **Google Gemini**: Por la increíble API de IA
- **React Team**: Por el framework fantástico
- **Vercel**: Por el hosting gratuito
- **Comunidad Open Source**: Por las librerías increíbles

## 📞 Contacto

- **Autor**: Tu Nombre
- **Email**: tu.email@ejemplo.com
- **GitHub**: [@tu-usuario](https://github.com/tu-usuario)
- **Demo**: [https://storyart.vercel.app](https://storyart.vercel.app)

---

⭐ **¡Si te gusta este proyecto, dale una estrella en GitHub!** ⭐