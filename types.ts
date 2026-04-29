
export interface Project {
  id: string;
  title: string;
  category: string | string[];
  description: string; // Fallback or current
  descriptionEs?: string;
  descriptionEn?: string;
  thumbnail: string;
  videoUrl?: string;
  gallery?: string[]; // Array de URLs de imágenes o videos para el carrusel
  tools: string[];
  year: string;
  featured?: boolean;
}

export interface Skill {
  name: string;
  key: string;
  level: number; // 0-100
  icon: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
