import React, { useState } from 'react';
import type { Libro, ReadingSession } from '../../types';
import { Button } from '../Button/Button';
import { ReadingSessionModal } from '../ReadingSessionModal/ReadingSessionModal';
import { ReadingHistory } from '../ReadingHistory/ReadingHistory';
import { Toast } from '../Toast/Toast';
import styles from './BookDetail.module.css';
import { Heart, Star, BookOpen, Calendar, Plus } from 'lucide-react';

interface BookDetailProps {
  libro: Libro;
  sessions: ReadingSession[];
  onAddSession: (session: Omit<ReadingSession, 'id'>, libro: Libro) => void;
  onDeleteSession: (id: string, libro: Libro) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({ 
  libro, 
  sessions, 
  onAddSession, 
  onDeleteSession, 
  onEdit, 
  onDelete, 
  onClose 
}) => {
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  return (
    <div className={styles.detailContainer}>
      <div className={styles.topSection}>
        <div className={styles.coverWrapper}>
          {libro.portada ? (
            <img src={libro.portada} alt={libro.titulo} className={styles.cover} />
          ) : (
            <div className={styles.noCover}>
              <span>{libro.titulo.charAt(0)}</span>
            </div>
          )}
          {libro.favorito && (
            <div className={styles.favoriteBadge}>
              <Heart size={20} fill="currentColor" color="var(--color-pink-primary)" />
            </div>
          )}
        </div>
        
        <div className={styles.info}>
          <h2 className={styles.title}>{libro.titulo}</h2>
          <p className={styles.author}>{libro.autor}</p>
          
          <div className={styles.badges}>
            <span className={styles.badge}>{libro.genero || 'Sin género'}</span>
            <span className={`${styles.badge} ${styles[libro.estado]}`}>
              {libro.estado === 'pendiente' && '📚 Pendiente'}
              {libro.estado === 'leyendo' && '📖 Leyendo'}
              {libro.estado === 'completado' && '✅ Terminado'}
            </span>
            {libro.puntuacion && libro.puntuacion > 0 ? (
              <span className={styles.badge}>
                {libro.puntuacion} <Star size={14} fill="var(--color-gold)" color="var(--color-gold)" style={{marginLeft: '4px'}}/>
              </span>
            ) : null}
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Progreso ({libro.paginasLeidas}/{libro.paginas} págs)</span>
              <span className={styles.progressPercent}>{libro.progreso}%</span>
            </div>
            <div className={styles.progressBarBg}>
              <div 
                className={styles.progressBarFill} 
                style={{ width: `${libro.progreso}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sessionActionRow}>
        <Button variant="primary" onClick={() => setIsSessionModalOpen(true)} className={styles.recordBtn}>
          <Plus size={18} style={{ marginRight: '6px' }} /> REGISTRAR LECTURA
        </Button>
      </div>

      <div className={styles.metadataSection}>
        {libro.fechaInicio && (
          <div className={styles.metaItem}>
            <Calendar size={16} /> Inició: {new Date(libro.fechaInicio).toLocaleDateString()}
          </div>
        )}
        {libro.fechaFin && (
          <div className={styles.metaItem}>
            <Calendar size={16} /> Terminó: {new Date(libro.fechaFin).toLocaleDateString()}
          </div>
        )}
      </div>

      {libro.resena && (
        <div className={styles.reviewSection}>
          <h4 className={styles.reviewTitle}><BookOpen size={16} /> Reseña</h4>
          <p className={styles.reviewText}>{libro.resena}</p>
        </div>
      )}

      <div className={styles.historySection}>
        <h3 className={styles.historyTitle}>📖 Historial de Lectura</h3>
        <ReadingHistory 
          sessions={sessions} 
          onDeleteSession={(id) => onDeleteSession(id, libro)} 
        />
      </div>

      <div className={styles.actions}>
        <Button variant="ghost" onClick={onClose}>Volver</Button>
        <div className={styles.rightActions}>
          <Button variant="secondary" onClick={onEdit}>Editar</Button>
          <Button variant="ghost" className={styles.deleteBtn} onClick={onDelete}>Eliminar</Button>
        </div>
      </div>

      <ReadingSessionModal 
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        libro={libro}
        onSave={(session) => {
          onAddSession(session, libro);
          setToastMessage(`✨ ¡Sesión guardada! (${session.paginasLeidas} páginas)`);
        }}
      />
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}
    </div>
  );
};
