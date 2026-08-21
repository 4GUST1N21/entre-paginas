export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  portada: string;
  genero: string;
  estado: 'pendiente' | 'leyendo' | 'completado';
  progreso: number; // porcentaje 0-100
  paginas: number;
  paginasLeidas: number;
  puntuacion?: number; // 1-5
  favorito: boolean;
  fechaInicio?: string;
  fechaFin?: string;
  resena?: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  fecha: string;
  paginasInicio: number;
  paginasFin: number;
  paginasLeidas: number;
  duracionMinutos: number;
  nota?: string;
}

export interface Usuario {
  nombre: string;
  nivel: number;
  experiencia: number; // XP actual
  librosLeidos: number;
  desafiosCompletados: number;
}

export interface Mundo {
  zonasDesbloqueadas: string[];
  decoraciones: string[];
  construcciones: string[];
  objetosEncontrados: string[];
}
