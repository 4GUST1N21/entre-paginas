import React, { useState, useEffect } from 'react';
import type { Libro } from '../../types';
import { Button } from '../Button/Button';
import styles from './BookForm.module.css';

interface BookFormProps {
  libro?: Libro;
  onSubmit: (libro: Partial<Libro>) => void;
  onCancel: () => void;
}

export const BookForm: React.FC<BookFormProps> = ({ libro, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Libro>>({
    titulo: '',
    autor: '',
    genero: '',
    portada: '',
    paginas: 0,
    paginasLeidas: 0,
    estado: 'pendiente',
    puntuacion: 0,
    favorito: false,
    resena: ''
  });

  useEffect(() => {
    if (libro) {
      setFormData(libro);
    }
  }, [libro]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label>Título *</label>
          <input required type="text" name="titulo" value={formData.titulo || ''} onChange={handleChange} />
        </div>
        <div className={styles.field}>
          <label>Autor *</label>
          <input required type="text" name="autor" value={formData.autor || ''} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label>Género</label>
          <input type="text" name="genero" value={formData.genero || ''} onChange={handleChange} />
        </div>
        <div className={styles.field}>
          <label>URL de Portada</label>
          <input type="url" name="portada" value={formData.portada || ''} onChange={handleChange} placeholder="https://..." />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label>Páginas Totales *</label>
          <input required type="number" min="1" name="paginas" value={formData.paginas || 0} onChange={handleChange} />
        </div>
        <div className={styles.field}>
          <label>Páginas Leídas</label>
          <input 
            type="number" 
            min="0" 
            max={formData.paginas || 0} 
            name="paginasLeidas" 
            value={formData.paginasLeidas || 0} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.field}>
          <label>Estado</label>
          <select name="estado" value={formData.estado || 'pendiente'} onChange={handleChange}>
            <option value="pendiente">📚 Pendiente</option>
            <option value="leyendo">📖 Leyendo</option>
            <option value="completado">✅ Terminado</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Calificación (1-5)</label>
          <input type="number" min="0" max="5" name="puntuacion" value={formData.puntuacion || 0} onChange={handleChange} />
        </div>
      </div>

      <div className={styles.checkboxField}>
        <label>
          <input type="checkbox" name="favorito" checked={formData.favorito || false} onChange={handleChange} />
          ❤️ Marcar como favorito
        </label>
      </div>

      <div className={styles.field}>
        <label>Reseña / Notas</label>
        <textarea name="resena" rows={3} value={formData.resena || ''} onChange={handleChange}></textarea>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary">Guardar Libro</Button>
      </div>
    </form>
  );
};
