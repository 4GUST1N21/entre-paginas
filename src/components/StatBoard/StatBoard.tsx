import React from 'react';
import styles from './StatBoard.module.css';
import type { Libro, ReadingSession } from '../../types';

interface StatBoardProps {
  libros: Libro[];
  sessions?: ReadingSession[];
}

export const StatBoard: React.FC<StatBoardProps> = ({ libros, sessions = [] }) => {
  const total = libros.length;
  const completados = libros.filter(l => l.estado === 'completado').length;
  
  const totalPaginas = sessions.reduce((acc, curr) => acc + curr.paginasLeidas, 0);
  const totalMinutos = sessions.reduce((acc, curr) => acc + curr.duracionMinutos, 0);
  const totalSesiones = sessions.length;

  const formatHours = (mins: number) => {
    if (mins === 0) return '0h';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

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
        <span className={styles.icon}>✅</span>
        <div className={styles.info}>
          <span className={styles.label}>Terminados</span>
          <span className={styles.value}>{completados}</span>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.stat}>
        <span className={styles.icon}>📖</span>
        <div className={styles.info}>
          <span className={styles.label}>Páginas</span>
          <span className={styles.value}>{totalPaginas}</span>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.stat}>
        <span className={styles.icon}>⏱️</span>
        <div className={styles.info}>
          <span className={styles.label}>Lectura</span>
          <span className={styles.value}>{formatHours(totalMinutos)}</span>
        </div>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.stat}>
        <span className={styles.icon}>📝</span>
        <div className={styles.info}>
          <span className={styles.label}>Sesiones</span>
          <span className={styles.value}>{totalSesiones}</span>
        </div>
      </div>
    </div>
  );
};
