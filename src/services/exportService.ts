import type { Project, Scene, CanvasElement } from '../types';

// Función para crear un canvas temporal y renderizar una escena completa
const createSceneCanvas = async (scene: Scene): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Configurar dimensiones del canvas
  canvas.width = 1920;
  canvas.height = 1080;
  
  if (!ctx) {
    throw new Error('No se pudo crear contexto de canvas');
  }

  // Fondo blanco por defecto
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    let loadedAssets = 0;
    let totalAssets = 0;
    
    // Contar assets a cargar
    if (scene.backgroundImage || scene.imageUrl) totalAssets++;
    scene.elements?.forEach(element => {
      if (element.type === 'image' && (element.src || element.imageUrl)) totalAssets++;
    });

    const checkComplete = () => {
      if (loadedAssets >= totalAssets) {
        // Renderizar elementos de texto después de las imágenes
        scene.elements?.forEach(element => {
          if (element.type === 'text') {
            renderTextElement(ctx, element, canvas.width, canvas.height);
          }
        });
        
        resolve(canvas);
      }
    };

    // Si no hay assets que cargar, solo renderizar texto
    if (totalAssets === 0) {
      checkComplete();
      return;
    }

    // Cargar imagen de fondo
    const backgroundUrl = scene.backgroundImage || scene.imageUrl;
    if (backgroundUrl) {
      loadImageToCanvas(ctx, backgroundUrl, 0, 0, canvas.width, canvas.height)
        .then(() => {
          loadedAssets++;
          checkComplete();
        })
        .catch(() => {
          console.warn('Error cargando imagen de fondo');
          loadedAssets++;
          checkComplete();
        });
    }

    // Cargar imágenes de elementos
    scene.elements?.forEach(element => {
      if (element.type === 'image') {
        const imageUrl = element.src || element.imageUrl;
        if (imageUrl) {
          // Las coordenadas ya están en píxeles, no necesitan conversión
          const x = element.x;
          const y = element.y;
          const width = element.width || 150;
          const height = element.height || 150;
          
          loadImageToCanvas(ctx, imageUrl, x, y, width, height)
            .then(() => {
              loadedAssets++;
              checkComplete();
            })
            .catch(() => {
              console.warn('Error cargando imagen de elemento');
              loadedAssets++;
              checkComplete();
            });
        }
      }
    });
  });
};

// Función auxiliar para cargar y dibujar una imagen en el canvas
const loadImageToCanvas = (
  ctx: CanvasRenderingContext2D, 
  imageUrl: string, 
  x: number, 
  y: number, 
  width: number, 
  height: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        ctx.drawImage(img, x, y, width, height);
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    
    // Manejar diferentes tipos de URL
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http') || imageUrl.startsWith('blob:')) {
      img.src = imageUrl;
    } else {
      // Si es una URL relativa, intentar cargarla
      img.src = imageUrl;
    }
  });
};

// Función para renderizar elementos de texto
const renderTextElement = (
  ctx: CanvasRenderingContext2D, 
  element: any, 
  canvasWidth: number, 
  canvasHeight: number
) => {
  ctx.save();
  
  // Configurar estilo de texto desde el elemento
  const fontSize = element.style?.fontSize || element.fontSize || 24;
  const fontFamily = element.style?.fontFamily || element.fontFamily || 'Arial';
  const color = element.style?.color || element.color || '#000000';
  const backgroundColor = element.style?.backgroundColor || '#ffffff';
  
  // Las coordenadas ya están en píxeles, no necesitan conversión
  const x = element.x;
  const y = element.y;
  const width = element.width || 200;
  const height = element.height || 100;
  
  // Dibujar fondo del elemento de texto (burbuja)
  if (backgroundColor && backgroundColor !== 'transparent') {
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2;
    
    // Dibujar forma según el tipo de burbuja
    switch (element.shape) {
      case 'speech-bubble':
        drawSpeechBubble(ctx, x, y, width, height);
        break;
      case 'thought-bubble':
        drawThoughtBubble(ctx, x, y, width, height);
        break;
      case 'shout-bubble':
        drawShoutBubble(ctx, x, y, width, height);
        break;
      default: // rectangle
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
        break;
    }
  }
  
  // Configurar texto
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  
  // Aplicar efectos de texto
  if (element.textShadow) {
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
  }
  
  // Dividir texto en líneas
  const maxWidth = width - 20; // Padding interno
  const lines = wrapText(ctx, element.content || '', maxWidth);
  
  // Renderizar cada línea con padding
  const textX = x + 10;
  const textY = y + 10;
  
  lines.forEach((line, index) => {
    ctx.fillText(line, textX, textY + (index * fontSize * 1.2));
  });
  
  ctx.restore();
};

// Función auxiliar para dibujar rectángulos redondeados (compatible con todos los navegadores)
const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

// Funciones auxiliares para dibujar diferentes tipos de burbujas
const drawSpeechBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  const radius = 10;
  
  // Burbuja principal
  drawRoundedRect(ctx, x, y, w, h, radius);
  ctx.fill();
  ctx.stroke();
  
  // Cola de la burbuja (triángulo pequeño)
  const tailX = x + 30;
  const tailY = y + h;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(tailX - 10, tailY + 15);
  ctx.lineTo(tailX + 10, tailY + 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

const drawThoughtBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  // Burbuja principal (más redondeada)
  drawRoundedRect(ctx, x, y, w, h, 20);
  ctx.fill();
  ctx.stroke();
  
  // Pequeñas burbujas de pensamiento
  const bubble1X = x + 20;
  const bubble1Y = y + h + 10;
  const bubble2X = x + 10;
  const bubble2Y = y + h + 25;
  
  ctx.beginPath();
  ctx.arc(bubble1X, bubble1Y, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(bubble2X, bubble2Y, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
};

const drawShoutBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
  // Burbuja con bordes dentados
  ctx.beginPath();
  const points = 16;
  const centerX = x + w / 2;
  const centerY = y + h / 2;
  
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const radius = i % 2 === 0 ? Math.min(w, h) / 2 : Math.min(w, h) / 2.5;
    const pointX = centerX + Math.cos(angle) * radius;
    const pointY = centerY + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(pointX, pointY);
    } else {
      ctx.lineTo(pointX, pointY);
    }
  }
  
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
};

// Función auxiliar para dividir texto en líneas
const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  if (!text) return [''];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + ' ' + word).width;
    if (width < maxWidth) {
      currentLine += ' ' + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};

// Función para capturar el canvas actual del DOM (como fallback)
const captureCanvasFromDOM = async (): Promise<string | null> => {
  try {
    const canvasContainer = document.querySelector('[data-canvas-container]');
    
    if (canvasContainer) {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(canvasContainer as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
        logging: false,
        width: 1920,
        height: 1080
      });
      
      return canvas.toDataURL('image/png', 0.9);
    }
    
    return null;
  } catch (error) {
    console.warn('Error capturando canvas del DOM:', error);
    return null;
  }
};

// Función innovadora para crear una vista previa de la escena antes de exportar
const createScenePreview = async (scene: Scene): Promise<string> => {
  try {
    console.log(`🎨 Creando vista previa de escena: ${scene.name}`);
    console.log('📊 Datos de la escena:', {
      backgroundImage: scene.backgroundImage,
      imageUrl: scene.imageUrl,
      elements: scene.elements?.length || 0,
      description: scene.description
    });

    const canvas = await createSceneCanvas(scene);
    const dataURL = canvas.toDataURL('image/png', 0.9);
    
    console.log(`✅ Vista previa creada para: ${scene.name}`);
    return dataURL;
  } catch (error) {
    console.error(`❌ Error creando vista previa de ${scene.name}:`, error);
    
    // Fallback: crear una imagen con información de la escena
    return createFallbackSceneImage(scene);
  }
};

// Función fallback para crear una imagen informativa cuando falla la renderización
const createFallbackSceneImage = (scene: Scene): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1920;
  canvas.height = 1080;
  
  if (!ctx) return '';

  // Fondo degradado
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Título de la escena
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(scene.name, canvas.width / 2, 200);

  // Descripción
  if (scene.description) {
    ctx.font = '36px Arial';
    ctx.fillStyle = '#f0f0f0';
    const lines = wrapText(ctx, scene.description, canvas.width - 200);
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, 350 + (index * 50));
    });
  }

  // Información adicional
  ctx.font = '24px Arial';
  ctx.fillStyle = '#cccccc';
  ctx.fillText(`Elementos: ${scene.elements?.length || 0}`, canvas.width / 2, canvas.height - 100);

  return canvas.toDataURL('image/png', 0.9);
};

// Exportar proyecto a PDF con imágenes reales de las escenas
export const exportToPDF = async (project: Project): Promise<void> => {
  try {
    console.log(`📄 Iniciando exportación de "${project.name}" a PDF...`);
    
    if (project.scenes.length === 0) {
      throw new Error('No hay escenas para exportar');
    }

    // Crear un nuevo documento PDF usando jsPDF
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Configuración de página
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 5;
    
    // Dimensiones para la imagen de la escena
    const imageWidth = pageWidth - (2 * margin);
    const imageHeight = pageHeight - (2 * margin);

    console.log(`📊 Configuración PDF: ${pageWidth}x${pageHeight}mm, margen: ${margin}mm`);

    for (let i = 0; i < project.scenes.length; i++) {
      const scene = project.scenes[i];
      
      console.log(`🎬 Procesando escena ${i + 1}/${project.scenes.length}: ${scene.name}`);
      
      if (i > 0) {
        pdf.addPage();
      }

      try {
        // Crear vista previa de la escena
        const sceneImage = await createScenePreview(scene);
        
        if (sceneImage && sceneImage.length > 100) { // Verificar que la imagen no esté vacía
          // Agregar la imagen de la escena al PDF
          pdf.addImage(
            sceneImage, 
            'PNG', 
            margin, 
            margin, 
            imageWidth, 
            imageHeight,
            `scene_${i + 1}`,
            'FAST'
          );
          
          // Agregar título de la escena en la esquina superior
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            `${scene.name} - Escena ${i + 1} de ${project.scenes.length}`, 
            margin + 2, 
            margin + 5
          );
          
          console.log(`✅ Escena ${i + 1} agregada al PDF exitosamente`);
        } else {
          throw new Error('Imagen de escena vacía o inválida');
        }
        
      } catch (error) {
        console.error(`❌ Error procesando escena ${i + 1}:`, error);
        
        // Crear página de error informativa
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(200, 50, 50);
        pdf.text(`Escena ${i + 1}: ${scene.name}`, margin + 10, margin + 30);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text('Esta escena no pudo ser renderizada correctamente.', margin + 10, margin + 50);
        
        if (scene.description) {
          pdf.setFontSize(12);
          pdf.setTextColor(60, 60, 60);
          const descLines = pdf.splitTextToSize(scene.description, imageWidth - 20);
          pdf.text(descLines, margin + 10, margin + 70);
        }
      }
    }

    // Agregar página de portada al inicio
    pdf.insertPage(1);
    
    // Portada
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(50, 50, 50);
    pdf.text(project.name, pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${project.scenes.length} escenas`, pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text(`Creado con StoryArt - ${new Date().toLocaleDateString()}`, pageWidth / 2, pageHeight - 20, { align: 'center' });

    // Guardar el PDF
    const fileName = `${project.name.replace(/[^a-z0-9]/gi, '_')}_historia.pdf`;
    pdf.save(fileName);
    
    console.log(`🎉 PDF exportado exitosamente: ${fileName}`);
    console.log(`📈 Estadísticas: ${project.scenes.length + 1} páginas totales (1 portada + ${project.scenes.length} escenas)`);
    
  } catch (error) {
    console.error('💥 Error crítico exportando proyecto a PDF:', error);
    throw error;
  }
};

// Exportar escena individual como imagen
export const exportSceneAsImage = async (scene: Scene): Promise<void> => {
  try {
    console.log(`🖼️ Exportando escena individual: ${scene.name}`);
    
    const canvas = await createSceneCanvas(scene);
    
    // Descargar como imagen
    canvas.toBlob((blob) => {
      if (blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${scene.name.replace(/[^a-z0-9]/gi, '_')}.png`;
        link.click();
        console.log(`✅ Escena exportada como imagen: ${scene.name}`);
      }
    }, 'image/png');
    
  } catch (error) {
    console.error('❌ Error exportando escena como imagen:', error);
    throw error;
  }
};

// Función para previsualizar una escena (útil para debugging)
export const previewScene = async (scene: Scene): Promise<void> => {
  try {
    const canvas = await createSceneCanvas(scene);
    
    // Crear una ventana nueva para mostrar la vista previa
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Vista Previa: ${scene.name}</title></head>
          <body style="margin:0; background:#f0f0f0; display:flex; justify-content:center; align-items:center; min-height:100vh;">
            <img src="${canvas.toDataURL()}" style="max-width:100%; max-height:100%; border:1px solid #ccc;" />
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error creando vista previa:', error);
  }
};