
import { Project, Skill } from './types';

export const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const PROJECTS: Project[] = [
  {
    id: 'marley',
    title: 'Marley Coffee: Geometric Essence',
    category: ['Product', 'Advertising'],
    description: 'A cinematic exploration of geometric form and material physics. This project features high-precision manual 3D modeling and advanced blendshape manipulation to achieve dynamic topological transitions. A minimalist CGI narrative designed as a high-impact infinite loop for premium digital platforms.',
    descriptionEs: 'Una exploración cinematográfica de la forma geométrica y la física de materiales. Este proyecto destaca por un modelado 3D manual de alta precisión y manipulación avanzada de blendshapes para lograr transiciones topológicas dinámicas. Una narrativa CGI minimalista diseñada como un loop infinito de alto impacto para plataformas digitales premium.',
    descriptionEn: 'A cinematic exploration of geometric form and material physics. This project features high-precision manual 3D modeling and advanced blendshape manipulation to achieve dynamic topological transitions. A minimalist CGI narrative designed as a high-impact infinite loop for premium digital platforms.',
    thumbnail: 'https://cdnb.artstation.com/p/assets/images/images/097/944/945/large/matias-navarrete-marleyrender-scene1-0019.jpg?1775663017',
    videoUrl: 'https://cdn.artstation.com/p/video_sources/003/210/344/marleyrender-mp4-finaloutput-0000-0240.mp4',
    tools: ['Blender', 'Cycles', 'After Effects'],
    year: '2024',
    featured: true
  },
  {
    id: 'go2store',
    title: 'EcoTech Series: Pure Hydration',
    category: 'Product',
    description: 'High-end product visualization for the EcoTech line. The focus was on achieving absolute material honesty—capturing the subtle interplay of light on matte surfaces and transparent polymers. Designed to elevate e-commerce catalogs into luxury digital experiences.',
    descriptionEs: 'Visualización de producto de alta gama para la línea EcoTech. El enfoque se centró en lograr una honestidad material absoluta, capturando el sutil juego de la luz sobre superficies mate y polímeros transparentes. Diseñado para elevar los catálogos de comercio electrónico a experiencias digitales de lujo.',
    descriptionEn: 'High-end product visualization for the EcoTech line. The focus was on achieving absolute material honesty—capturing the subtle interplay of light on matte surfaces and transparent polymers. Designed to elevate e-commerce catalogs into luxury digital experiences.',
    thumbnail: 'https://cdna.artstation.com/p/assets/images/images/098/040/220/large/matias-navarrete-ecotech-negra-reel-frame-0-00-15f.jpg?1775943088',
    videoUrl: 'https://cdn.artstation.com/p/video_sources/003/215/538/ecotech-negra-reel.mp4',
    gallery: [
      'https://cdn.artstation.com/p/video_sources/003/215/538/ecotech-negra-reel.mp4',
      'https://cdn.artstation.com/p/video_sources/003/215/535/gasificadora-negra-reel.mp4',
      'https://cdn.artstation.com/p/video_sources/003/215/537/gasificadora-blanca-reel.mp4',
      'https://cdn.artstation.com/p/video_sources/003/215/539/jarra-reel.mp4'
    ],
    tools: ['Blender', 'Cycles', 'After Effects'],
    year: '2024',
    featured: true
  },
  {
    id: 'symmetry-x',
    title: 'Symmetry: Digital Motion',
    category: 'Marketing Visuals',
    description: 'Dynamic visual assets for high-conversion App Store Optimization. This project bridges the gap between UI design and cinematic motion, creating a rhythmic visual flow that highlights user experience and interface elegance in a mobile environment.',
    descriptionEs: 'Activos visuales dinámicos para una optimización de App Store de alta conversión. Este proyecto cierra la brecha entre el diseño de interfaz y el movimiento cinematográfico, creando un flujo visual rítmico que resalta la experiencia del usuario y la elegancia de la interfaz en un entorno móvil.',
    descriptionEn: 'Dynamic visual assets for high-conversion App Store Optimization. This project bridges the gap between UI design and cinematic motion, creating a rhythmic visual flow that highlights user experience and interface elegance in a mobile environment.',
    thumbnail: 'https://cdna.artstation.com/p/assets/images/images/097/951/714/large/matias-navarrete-symmetry-scene1-0039.jpg?1775675954',
    videoUrl: 'https://cdn.artstation.com/p/video_sources/003/210/776/symmetry-x-scene1-avance-v11.mp4',
    tools: ['Blender', 'After Effects', 'Cycles'],
    year: '2024',
    featured: true
  },
  {
    id: 'sleep-time',
    title: 'SleepTime: Anatomical Flow',
    category: 'Product',
    description: 'A minimalist and abstract approach to medical product visualization. Utilizing procedural shading and custom workflows in Blender to demonstrate structural functionality through soft lighting and contemporary motion design.',
    descriptionEs: 'Un enfoque minimalista y abstracto para la visualización de productos médicos. Utilizando sombreado procedimental y flujos de trabajo personalizados en Blender para demostrar la funcionalidad estructural a través de una iluminación suave y un diseño de movimiento contemporáneo.',
    descriptionEn: 'A minimalist and abstract approach to medical product visualization. Utilizing procedural shading and custom workflows in Blender to demonstrate structural functionality through soft lighting and contemporary motion design.',
    thumbnail: 'https://cdna.artstation.com/p/assets/images/images/098/040/798/large/matias-navarrete-sleeptimerender-v1-frame-0-05-21f-1.jpg?1775945432',
    videoUrl: 'https://cdn.artstation.com/p/video_sources/003/212/820/sleeptimerender-v1.mp4',
    tools: ['Blender', 'Cycles', 'After Effects'],
    year: '2024',
    featured: true
  }
];

export const SKILLS: Skill[] = [
  { name: 'Photorealistic Product Rendering', key: 'rendering', level: 98, icon: '💎' },
  { name: 'Lighting & Texturing', key: 'lighting', level: 95, icon: '💡' },
  { name: '3D Modeling (Blender/Maya)', key: 'modeling', level: 92, icon: '🏗️' },
  { name: 'Substance Painter & Photoshop', key: 'texturing', level: 90, icon: '🎨' },
  { name: 'Client Communication & Fast Turnaround', key: 'communication', level: 96, icon: '🤝' }
];

export const SYSTEM_INSTRUCTION = `
Eres el Asistente Creativo de Matías Navarrete, un Artista 3D especializado en visualización de productos de alta gama y renderizado fotorrealista.
Tu tono es profesional, servicial y enfocado en la calidad técnica. Responde siempre en el idioma que el usuario te hable (Español o Inglés).

Información clave de Matías:
- Experiencia: Trabajó en Poston Works (Advertising & VFX Studio) creando activos 3D para campañas publicitarias.
- Freelance: Gestiona su propio negocio de impresión 3D y servicios freelance.
- Educación: Animación Digital en Universidad Mayor.
- Especialidad: Ayuda a marcas y agencias a elevar su contenido visual mediante imágenes convincentes y enfocadas en la conversión.

Cuando los usuarios pregunten, destaca su capacidad para trabajar con plazos ajustados y entregar activos listos para producción.
`;
