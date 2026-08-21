import React, { useState, useEffect } from 'react';
import type { Libro } from '../../types';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import styles from './ReadingSessionModal.module.css';

interface ReadingSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  libro: Libro;
  onSave: (session: { paginasInicio: number; paginasFin: number; paginasLeidas: number; duracionMinutos: number; nota: string; fecha: string; bookId: string }) => void;
}

export const ReadingSessionModal: React.FC<ReadingSessionModalProps> = ({ isOpen, onClose, libro, onSave }) => {
  const [paginasInicio, setPaginasInicio] = useState(libro.paginasLeidas);
  const [paginasFin, setPaginasFin] = useState(libro.paginasLeidas);
  const [duracionMinutos, setDuracionMinutos] = useState(0);
  const [nota, setNota] = useState('');
  const [error, setError] = useState('');

  // Sincronizar el estado local cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setPaginasInicio(libro.paginasLeidas);
      setPaginasFin(libro.paginasLeidas);
      setDuracionMinutos(0);
      setNota('');
      setError('');
    }
  }, [isOpen, libro.paginasLeidas]);

  const paginasLeidasCalculadas = Math.max(0, paginasFin - paginasInicio);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    if (paginasInicio < 0) {
      setError('La página inicial no puede ser negativa.');
      return;
    }
    if (paginasFin < paginasInicio) {
      setError('La página final no puede ser menor a la inicial.');
      return;
    }
    if (paginasFin > libro.paginas) {
      setError(`La página final no puede superar las páginas totales del libro (${libro.paginas}).`);
      return;
    }
    if (duracionMinutos < 0) {
      setError('El tiempo de lectura no puede ser negativo.');
      return;
    }
    if (paginasFin === paginasInicio && duracionMinutos === 0) {
      setError('Debes registrar al menos alguna página leída o tiempo.');
      return;
    }

    onSave({
      bookId: libro.id,
      paginasInicio,
      paginasFin,
      paginasLeidas: paginasLeidasCalculadas,
      duracionMinutos,
      nota,
      fecha: new Date().toISOString()
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="📖 Registrar lectura">
      <div className={styles.modalContent}>
        <p className={styles.bookTitle}>Libro: <strong>{libro.titulo}</strong></p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Página de inicio:</label>
              <input 
                type="number" 
                value={paginasInicio} 
                onChange={(e) => setPaginasInicio(parseInt(e.target.value) || 0)}
                min={0}
                max={libro.paginas}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Página final:</label>
              <input 
                type="number" 
                value={paginasFin} 
                onChange={(e) => setPaginasFin(parseInt(e.target.value) || 0)}
                min={0}
                max={libro.paginas}
              />
            </div>
          </div>

          <div className={styles.resultBox}>
            <span>Páginas leídas: <strong>{paginasLeidasCalculadas}</strong></span>
          </div>

          <div className={styles.formGroup}>
            <label>Tiempo de lectura (minutos):</label>
            <input 
              type="number" 
              value={duracionMinutos} 
              onChange={(e) => setDuracionMinutos(parseInt(e.target.value) || 0)}
              min={0}
            />
          </div>

          <div className={styles.formGroup}>
            <label>¿Cómo fue esta lectura? (opcional):</label>
            <textarea 
              value={nota} 
              onChange={(e) => setNota(e.target.value)}
              placeholder="Escribe algo lindo, un pensamiento, una frase..."
              rows={3}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <Button variant="ghost" type="button" onClick={onClose}>CANCELAR</Button>
            <Button variant="primary" type="submit">GUARDAR SESIÓN</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
