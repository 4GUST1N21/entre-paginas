import React from 'react';
import styles from './BookCard.module.css';
import type { Libro } from '../../types';
import { Heart } from 'lucide-react';

interface BookCardProps {
  libro: Libro;
  onClick: (libro: Libro) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ libro, onClick }) => {
  return (
    <div className={styles.bookCard} onClick={() => onClick(libro)}>
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
            <Heart size={16} fill="currentColor" color="var(--color-pink-primary)" />
          </div>
        )}
        <div className={`${styles.statusBadge} ${styles[libro.estado]}`}>
          {libro.estado === 'pendiente' && '📚'}
          {libro.estado === 'leyendo' && '📖'}
          {libro.estado === 'completado' && '✅'}
        </div>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title} title={libro.titulo}>{libro.titulo}</h3>
        <p className={styles.author} title={libro.autor}>{libro.autor}</p>
        
        {/* Progress Bar */}
        <div className={styles.progressContainer}>
          <div 
            className={styles.progressBar} 
            style={{ width: `${libro.progreso}%` }}
          />
        </div>
        <span className={styles.progressText}>{libro.progreso}%</span>
      </div>
    </div>
  );
};
