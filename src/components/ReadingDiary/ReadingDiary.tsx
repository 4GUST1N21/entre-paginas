import React, { useState } from 'react';
import type { ReadingSession, Libro } from '../../types';
import { BookOpen, Clock } from 'lucide-react';
import styles from './ReadingDiary.module.css';

interface ReadingDiaryProps {
  sessions: ReadingSession[];
  libros: Libro[];
}

type FilterType = 'all' | 'week' | 'month';

export const ReadingDiary: React.FC<ReadingDiaryProps> = ({ sessions, libros }) => {
  const [filter, setFilter] = useState<FilterType>('all');

  // Helper para obtener el libro de una sesión
  const getBook = (bookId: string) => libros.find(l => l.id === bookId);

  // Filtrar sesiones
  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    
    const sessionDate = new Date(session.fecha);
    const today = new Date();
    
    if (filter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(today.getDate() - 7);
      return sessionDate >= oneWeekAgo;
    }
    
    if (filter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);
      return sessionDate >= oneMonthAgo;
    }
    
    return true;
  });

  // Ordenar por fecha descendente
  const sortedSessions = [...filteredSessions].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  // Agrupar por "Hoy", "Ayer", o fecha normal
  const groupedSessions: { [key: string]: ReadingSession[] } = {};
  
  sortedSessions.forEach(session => {
    const date = new Date(session.fecha);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let groupKey = '';
    if (date.toDateString() === today.toDateString()) {
      groupKey = 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupKey = 'Ayer';
    } else {
      groupKey = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    
    if (!groupedSessions[groupKey]) {
      groupedSessions[groupKey] = [];
    }
    groupedSessions[groupKey].push(session);
  });

  return (
    <div className={styles.diaryContainer}>
      
      <div className={styles.header}>
        <div className={styles.filters}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >Todas</button>
          <button 
            className={`${styles.filterBtn} ${filter === 'week' ? styles.active : ''}`}
            onClick={() => setFilter('week')}
          >Esta semana</button>
          <button 
            className={`${styles.filterBtn} ${filter === 'month' ? styles.active : ''}`}
            onClick={() => setFilter('month')}
          >Este mes</button>
        </div>
      </div>

      {Object.keys(groupedSessions).length === 0 ? (
        <div className={styles.emptyState}>
          <p>No hay lecturas registradas en este período.</p>
          <span className={styles.emoji}>📝</span>
        </div>
      ) : (
        <div className={styles.timeline}>
          {Object.entries(groupedSessions).map(([dateLabel, daySessions]) => (
            <div key={dateLabel} className={styles.dayGroup}>
              <h3 className={styles.dateLabel}>{dateLabel}</h3>
              
              <div className={styles.daySessions}>
                {daySessions.map(session => {
                  const book = getBook(session.bookId);
                  if (!book) return null;
                  
                  return (
                    <div key={session.id} className={styles.diaryCard}>
                      <div className={styles.cardHeader}>
                        <div className={styles.bookInfo}>
                          {book.portada ? (
                            <img src={book.portada} alt={book.titulo} className={styles.tinyCover} />
                          ) : (
                            <div className={styles.tinyCoverPlaceholder}>
                              {book.titulo.charAt(0)}
                            </div>
                          )}
                          <span className={styles.bookTitle}>{book.titulo}</span>
                        </div>
                      </div>
                      
                      <div className={styles.stats}>
                        <span className={styles.stat}><BookOpen size={14}/> {session.paginasLeidas} págs</span>
                        {session.duracionMinutos > 0 && (
                          <span className={styles.stat}><Clock size={14}/> {session.duracionMinutos} min</span>
                        )}
                      </div>
                      
                      {session.nota && (
                        <p className={styles.note}>"{session.nota}"</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
