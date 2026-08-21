import React from 'react';
import styles from './StatBoard.module.css';
import type { Libro } from '../../types';

interface StatBoardProps {
  libros: Libro[];
}

export const StatBoard: React.FC<StatBoardProps> = ({ libros }) => {
  const total = libros.length;
  const leyendo = libros.filter(l => l.estado === 'leyendo').length;
  const completados = libros.filter(l => l.estado === 'completado').length;
  const favoritos = libros.filter(l => l.favorito).length;

  return (
    <div className={styles.statBoard}>
      <div className={styles.stat}>
        <span className={styles.icon}>📚</span>
        <div className={styles.info}>
          <span className={styles.label}>Libros</span>
          <span className={styles.value}>{total}</span>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.stat}>
        <span className={styles.icon}>📖</span>
        <div className={styles.info}>
          <span className={styles.label}>Leyendo</span>
          <span className={styles.value}>{leyendo}</span>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.stat}>
        <span className={styles.icon}>✅</span>
        <div className={styles.info}>
          <span className={styles.label}>Terminados</span>
          <span className={styles.value}>{completados}</span>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.stat}>
        <span className={styles.icon}>❤️</span>
        <div className={styles.info}>
          <span className={styles.label}>Favoritos</span>
          <span className={styles.value}>{favoritos}</span>
        </div>
      </div>
    </div>
  );
};
