export type ArtStyle = 'anime' | 'realistic' | 'cartoon' | 'pixel' | 'watercolor' | 'oil';

export interface Character {
  id: string;
  name: string;
  description: string;
  artStyle: ArtStyle;
  imageUrl: string;
}

export interface TextElement {
  id: string;
  type: 'text';
  shape: 'rectangle' | 'speech-bubble' | 'thought-bubble' | 'shout-bubble';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style: {
    color: string;
    backgroundColor: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textDecoration: 'none' | 'underline';
  };
  nextSceneId?: string | null;
}

export interface ImageElement {
  id: string;
  type: 'image';
  characterId: string;
  imageUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  nextSceneId?: string | null;
}

export type CanvasElement = TextElement | ImageElement;

export interface Scene {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  artStyle: ArtStyle;
  dialogues: string[];
  characters: Character[];
  elements: CanvasElement[];
}

export interface Project {
  id:string;
  name: string;
  scenes: Scene[];
}