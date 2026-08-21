import React from 'react';
import type { ReadingSession } from '../../types';
import { BookOpen, Clock, Calendar, Trash2 } from 'lucide-react';
import styles from './ReadingHistory.module.css';

interface ReadingHistoryProps {
  sessions: ReadingSession[];
  onDeleteSession: (id: string) => void;
  // TODO: onEditSession
}

export const ReadingHistory: React.FC<ReadingHistoryProps> = ({ sessions, onDeleteSession }) => {
  if (sessions.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Aún no hay sesiones registradas.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }
    
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className={styles.historyContainer}>
      {sessions.map(session => (
        <div key={session.id} className={styles.sessionCard}>
          <div className={styles.sessionHeader}>
            <div className={styles.date}>
              <Calendar size={14} /> {formatDate(session.fecha)}
            </div>
            <div className={styles.actions}>
              {/* <button className={styles.iconBtn} title="Editar"><Edit2 size={14} /></button> */}
              <button 
                className={styles.iconBtn} 
                title="Eliminar" 
                onClick={() => {
                  if(window.confirm('¿Eliminar esta sesión de lectura?')) {
                    onDeleteSession(session.id);
                  }
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          
          <div className={styles.statsRow}>
            <div className={styles.stat}>
              <BookOpen size={16} /> {session.paginasLeidas} páginas
              <span className={styles.pageRange}> (p. {session.paginasInicio} → {session.paginasFin})</span>
            </div>
            {session.duracionMinutos > 0 && (
              <div className={styles.stat}>
                <Clock size={16} /> {session.duracionMinutos} min
              </div>
            )}
          </div>

          {session.nota && (
            <div className={styles.note}>
              "{session.nota}"
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
