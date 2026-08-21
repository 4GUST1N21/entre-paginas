import { useState, useEffect } from 'react';
import type { ReadingSession, Libro } from '../types';

const STORAGE_KEY = 'entre_paginas_sessions';

export const useReadingSessions = () => {
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSessions(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing reading sessions', e);
        setSessions([]);
      }
    } else {
      setSessions([]);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions, isLoaded]);

  const recalculateBookState = (bookId: string, currentSessions: ReadingSession[], updateLibro: (id: string, updates: Partial<Libro>) => void, libro: Libro) => {
    const bookSessions = currentSessions.filter(s => s.bookId === bookId);
    
    // Calcular el máximo avance logrado (para no romper si se borra una sesión intermedia pero hay otras posteriores)
    let maxPageReached = 0;
    bookSessions.forEach(s => {
      if (s.paginasFin > maxPageReached) {
        maxPageReached = s.paginasFin;
      }
    });

    const isFinished = maxPageReached >= libro.paginas;
    const isStarted = maxPageReached > 0 || bookSessions.length > 0;
    
    let newState = libro.estado;
    if (isFinished) {
      newState = 'completado';
    } else if (isStarted && libro.estado === 'pendiente') {
      newState = 'leyendo';
    } else if (!isFinished && libro.estado === 'completado') {
      // Si se borró la sesión final
      newState = 'leyendo';
    }

    updateLibro(bookId, {
      paginasLeidas: Math.min(maxPageReached, libro.paginas),
      estado: newState
    });
  };

  const addSession = (
    sessionData: Omit<ReadingSession, 'id'>, 
    libro: Libro, 
    updateLibro: (id: string, updates: Partial<Libro>) => void
  ) => {
    const newSession: ReadingSession = {
      ...sessionData,
      id: crypto.randomUUID()
    };
    
    setSessions(prev => {
      const updatedSessions = [newSession, ...prev]; // Más recientes primero
      recalculateBookState(libro.id, updatedSessions, updateLibro, libro);
      return updatedSessions;
    });

    // TODO: Phase 4 - Dispatch ReadingSessionCreated for XP
  };

  const editSession = (
    id: string, 
    updates: Partial<ReadingSession>, 
    libro: Libro, 
    updateLibro: (id: string, updates: Partial<Libro>) => void
  ) => {
    setSessions(prev => {
      const updatedSessions = prev.map(s => s.id === id ? { ...s, ...updates, paginasLeidas: (updates.paginasFin || s.paginasFin) - (updates.paginasInicio || s.paginasInicio) } : s);
      recalculateBookState(libro.id, updatedSessions, updateLibro, libro);
      return updatedSessions;
    });
  };

  const deleteSession = (
    id: string, 
    libro: Libro, 
    updateLibro: (id: string, updates: Partial<Libro>) => void
  ) => {
    setSessions(prev => {
      const updatedSessions = prev.filter(s => s.id !== id);
      recalculateBookState(libro.id, updatedSessions, updateLibro, libro);
      return updatedSessions;
    });
  };

  const getSessionsForBook = (bookId: string) => {
    return sessions.filter(s => s.bookId === bookId).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  };

  const getGlobalStats = () => {
    const totalPages = sessions.reduce((acc, curr) => acc + curr.paginasLeidas, 0);
    const totalMinutes = sessions.reduce((acc, curr) => acc + curr.duracionMinutos, 0);
    const uniqueBooks = new Set(sessions.map(s => s.bookId)).size;
    return {
      totalSessions: sessions.length,
      totalPages,
      totalMinutes,
      uniqueBooks
    };
  };

  const getBookStats = (bookId: string) => {
    const bookSessions = getSessionsForBook(bookId);
    const totalPages = bookSessions.reduce((acc, curr) => acc + curr.paginasLeidas, 0);
    const totalMinutes = bookSessions.reduce((acc, curr) => acc + curr.duracionMinutos, 0);
    const lastSession = bookSessions[0]?.fecha; // Ya están ordenadas
    
    return {
      totalSessions: bookSessions.length,
      totalPages,
      totalMinutes,
      lastSession
    };
  };

  return {
    sessions,
    addSession,
    editSession,
    deleteSession,
    getSessionsForBook,
    getGlobalStats,
    getBookStats,
    isLoaded
  };
};
