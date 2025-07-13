import type { Character, ArtStyle } from '../types';

const generateImageWithPollinations = async (description: string, width: number = 512, height: number = 512): Promise<string> => {
    const prompt = encodeURIComponent(description);
    const seed = Math.floor(Math.random() * 1000000);
    return `https://image.pollinations.ai/prompt/${prompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
};

const generateImageWithHuggingFace = async (description: string): Promise<string> => {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: description + ", high quality, detailed, masterpiece",
                parameters: {
                    negative_prompt: "blurry, low quality, distorted, ugly",
                    num_inference_steps: 20,
                    guidance_scale: 7.5
                }
            }),
        });

        if (response.ok) {
            const blob = await response.blob();
            return URL.createObjectURL(blob);
        } else {
            throw new Error('Hugging Face API failed');
        }
    } catch (error) {
        console.log('Hugging Face failed, using Pollinations');
        throw error;
    }
};

const buildPrompt = (description: string, artStyle: ArtStyle): string => {
    const styleMap = {
        'anime': 'anime style, manga style, cel shading',
        'realistic': 'photorealistic, detailed, high quality',
        'cartoon': 'cartoon style, animated, colorful',
        'pixel': 'pixel art, 8-bit style, retro',
        'watercolor': 'watercolor painting, soft brushstrokes',
        'oil': 'oil painting, classical art style'
    };
    
    const stylePrompt = styleMap[artStyle] || 'digital art';
    return `${description}, ${stylePrompt}, masterpiece, best quality, highly detailed`;
};

export const generateCharacterImage = async (
    description: string,
    artStyle: ArtStyle
): Promise<string> => {
    console.log('🎭 Generating character image...');
    console.log('📝 Description:', description);
    console.log('🎨 Art style:', artStyle);
    
    try {
        // Construir prompt completo
        const fullPrompt = buildPrompt(description, artStyle);
        console.log('📝 Full prompt:', fullPrompt);
        
        // Simular tiempo de generación
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Intentar primero con Hugging Face
        try {
            const imageUrl = await generateImageWithHuggingFace(fullPrompt);
            console.log('✅ Character image generated with Hugging Face');
            return imageUrl;
        } catch (error) {
            // Si falla, usar Pollinations
            const imageUrl = await generateImageWithPollinations(fullPrompt, 512, 512);
            console.log('✅ Character image generated with Pollinations');
            return imageUrl;
        }
        
    } catch (error) {
        console.error("❌ Error generating character image:", error);
        // Fallback final
        const seed = description.replace(/\s+/g, '').toLowerCase();
        return `https://picsum.photos/seed/${seed}/512/512`;
    }
};

export const generateSceneImage = async (
    description: string,
    artStyle: ArtStyle,
    characters: Character[]
): Promise<string> => {
    console.log('🏞️ Generating scene image...');
    console.log('📝 Description:', description);
    console.log('🎨 Art style:', artStyle);
    
    try {
        // Construir prompt para escena
        const scenePrompt = `${description}, background scene, environment, no people, no characters`;
        const fullPrompt = buildPrompt(scenePrompt, artStyle);
        console.log('📝 Full prompt:', fullPrompt);
        
        // Simular tiempo de generación
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Intentar primero con Hugging Face
        try {
            const imageUrl = await generateImageWithHuggingFace(fullPrompt);
            console.log('✅ Scene image generated with Hugging Face');
            return imageUrl;
        } catch (error) {
            // Si falla, usar Pollinations
            const imageUrl = await generateImageWithPollinations(fullPrompt, 1024, 576);
            console.log('✅ Scene image generated with Pollinations');
            return imageUrl;
        }
        
    } catch (error) {
        console.error("❌ Error generating scene image:", error);
        // Fallback final
        const seed = description.replace(/\s+/g, '').toLowerCase();
        return `https://picsum.photos/seed/${seed}/1280/720`;
    }
};