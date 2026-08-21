import { useState, useEffect } from 'react';
import type { Libro } from '../types';

const DEMO_BOOKS: Libro[] = [
  {
    id: 'demo-1',
    titulo: 'El Principito (Demo)',
    autor: 'Antoine de Saint-Exupéry',
    portada: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=300&auto=format&fit=crop', // generic book cover
    genero: 'Fantasía',
    estado: 'leyendo',
    progreso: 73,
    paginas: 250,
    paginasLeidas: 183,
    favorito: true,
    fechaInicio: '2024-01-10',
  },
  {
    id: 'demo-2',
    titulo: 'Orgullo y Prejuicio (Demo)',
    autor: 'Jane Austen',
    portada: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=300&auto=format&fit=crop', // generic book cover
    genero: 'Romance',
    estado: 'completado',
    progreso: 100,
    paginas: 432,
    paginasLeidas: 432,
    puntuacion: 5,
    favorito: true,
    fechaInicio: '2023-11-01',
    fechaFin: '2023-12-15',
    resena: 'Un clásico hermoso.'
  },
  {
    id: 'demo-3',
    titulo: 'El Hobbit (Demo)',
    autor: 'J.R.R. Tolkien',
    portada: 'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?q=80&w=300&auto=format&fit=crop',
    genero: 'Fantasía',
    estado: 'pendiente',
    progreso: 0,
    paginas: 310,
    paginasLeidas: 0,
    favorito: false
  }
];

const STORAGE_KEY = 'entre_paginas_libros';

export const useLibrary = () => {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setLibros(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing books', e);
        setLibros(DEMO_BOOKS);
      }
    } else {
      setLibros(DEMO_BOOKS);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
    }
  }, [libros, isLoaded]);

  const addLibro = (libro: Omit<Libro, 'id'>) => {
    const newLibro: Libro = {
      ...libro,
      id: crypto.randomUUID()
    };
    setLibros(prev => [...prev, newLibro]);
    
    // Future Event: onBookAdded(newLibro)
  };

  const updateLibro = (id: string, updates: Partial<Libro>) => {
    setLibros(prev => prev.map(libro => {
      if (libro.id !== id) return libro;
      
      const updated = { ...libro, ...updates };
      
      // Auto-calculate progress if pages change
      if (updates.paginas !== undefined || updates.paginasLeidas !== undefined || updates.estado !== undefined) {
        let paginasTotales = updated.paginas || 1;
        let leidas = updated.paginasLeidas || 0;
        
        if (updated.estado === 'completado') {
          leidas = paginasTotales;
          updated.paginasLeidas = leidas;
          updated.progreso = 100;
        } else {
          updated.progreso = Math.min(100, Math.max(0, Math.round((leidas / paginasTotales) * 100)));
        }
      }
      
      // Future Event check:
      // if (libro.estado !== 'completado' && updated.estado === 'completado') onBookCompleted(updated);
      // if (libro.progreso !== updated.progreso) onBookProgressChanged(updated);

      return updated;
    }));
  };

  const deleteLibro = (id: string) => {
    setLibros(prev => prev.filter(libro => libro.id !== id));
  };

  return {
    libros,
    addLibro,
    updateLibro,
    deleteLibro,
    isLoaded
  };
};
