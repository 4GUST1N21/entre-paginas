import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../hooks/useLibrary';
import { useReadingSessions } from '../../hooks/useReadingSessions';
import { Navigation } from '../../components/Navigation/Navigation';
import { StatBoard } from '../../components/StatBoard/StatBoard';
import { BookCard } from '../../components/BookCard/BookCard';
import { Modal } from '../../components/Modal/Modal';
import { BookForm } from '../../components/BookForm/BookForm';
import { BookDetail } from '../../components/BookDetail/BookDetail';
import { ReadingDiary } from '../../components/ReadingDiary/ReadingDiary';
import { Button } from '../../components/Button/Button';
import type { Libro } from '../../types';
import styles from './Library.module.css';
import { Plus, Search, Book, BookOpen } from 'lucide-react';

export const Library: React.FC = () => {
  const { libros, addLibro, updateLibro, deleteLibro, isLoaded } = useLibrary();
  const { sessions, addSession, deleteSession, getSessionsForBook } = useReadingSessions();
  
  const [viewMode, setViewMode] = useState<'books' | 'diary'>('books');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [filterState, setFilterState] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('titulo');

  // Mantener actualizado el libro seleccionado si cambia en el array global
  React.useEffect(() => {
    if (selectedBook) {
      const updated = libros.find(l => l.id === selectedBook.id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(selectedBook)) {
        setSelectedBook(updated);
      }
    }
  }, [libros, selectedBook]);

  // Filtrado y Ordenamiento
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...libros];

    // Filter by state
    if (filterState !== 'todos') {
      if (filterState === 'favoritos') {
        result = result.filter(b => b.favorito);
      } else {
        result = result.filter(b => b.estado === filterState);
      }
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.titulo.toLowerCase().includes(q) || 
        b.autor.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'titulo':
          return a.titulo.localeCompare(b.titulo);
        case 'autor':
          return a.autor.localeCompare(b.autor);
        case 'progreso':
          return b.progreso - a.progreso;
        case 'calificacion':
          return (b.puntuacion || 0) - (a.puntuacion || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [libros, filterState, searchQuery, sortBy]);

  if (!isLoaded) return null;

  const handleAddSubmit = (libro: Partial<Libro>) => {
    addLibro(libro as Omit<Libro, 'id'>);
    setIsFormOpen(false);
  };

  const handleEditSubmit = (libroUpdates: Partial<Libro>) => {
    if (selectedBook) {
      updateLibro(selectedBook.id, libroUpdates);
      // Update local selected book state to reflect in detail view immediately
      setSelectedBook({ ...selectedBook, ...libroUpdates } as Libro);
      setIsFormOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedBook && window.confirm('¿Seguro que deseas eliminar este libro?')) {
      deleteLibro(selectedBook.id);
      setIsDetailOpen(false);
      setSelectedBook(null);
    }
  };

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span className={styles.titleIcon}>📚</span> Mi Biblioteca
          </h1>
          <p className={styles.subtitle}>Todos los mundos que descubriste entre páginas.</p>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'books' ? styles.activeToggle : ''}`}
              onClick={() => setViewMode('books')}
            >
              <Book size={18}/> Libros
            </button>
            <button 
              className={`${styles.toggleBtn} ${viewMode === 'diary' ? styles.activeToggle : ''}`}
              onClick={() => setViewMode('diary')}
            >
              <BookOpen size={18}/> Diario
            </button>
          </div>
          <Button onClick={() => { setSelectedBook(null); setIsFormOpen(true); }} className={styles.addBtn}>
            <Plus size={20} /> Agregar Libro
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        <StatBoard libros={libros} sessions={sessions} />

        {viewMode === 'books' ? (
          <>
            <div className={styles.controls}>
              <div className={styles.searchBox}>
                <Search size={18} className={styles.searchIcon} />
                <input 
                  type="text" 
                  placeholder="Buscar título o autor..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <div className={styles.filters}>
                <select value={filterState} onChange={(e) => setFilterState(e.target.value)} className={styles.select}>
                  <option value="todos">Todos</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="leyendo">Leyendo</option>
                  <option value="completado">Terminados</option>
                  <option value="favoritos">Favoritos</option>
                </select>

                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.select}>
                  <option value="titulo">Ordenar por Título</option>
                  <option value="autor">Ordenar por Autor</option>
                  <option value="progreso">Ordenar por Progreso</option>
                  <option value="calificacion">Ordenar por Calificación</option>
                </select>
              </div>
            </div>

            <div className={styles.bookshelf}>
              {/* Decorative shelf background lines could be added here via CSS */}
              {filteredAndSortedBooks.length > 0 ? (
                <div className={styles.grid}>
                  {filteredAndSortedBooks.map(libro => (
                    <BookCard 
                      key={libro.id} 
                      libro={libro} 
                      onClick={(l) => { setSelectedBook(l); setIsDetailOpen(true); }} 
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <span className={styles.emptyIcon}>🍂</span>
                  <p>No se encontraron libros en este estante.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <ReadingDiary sessions={sessions} libros={libros} />
        )}
      </div>

      <Navigation />

      {/* Modal Agregar/Editar */}
      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        title={selectedBook ? "Editar Libro" : "Agregar Nuevo Libro"}
      >
        <BookForm 
          libro={selectedBook || undefined} 
          onSubmit={selectedBook ? handleEditSubmit : handleAddSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Modal Detalle */}
      <Modal 
        isOpen={isDetailOpen && !isFormOpen} 
        onClose={() => setIsDetailOpen(false)} 
        title="Detalles del Libro"
      >
        {selectedBook && (
          <BookDetail 
            libro={selectedBook} 
            sessions={getSessionsForBook(selectedBook.id)}
            onAddSession={(session, libro) => {
              addSession(session, libro, updateLibro);
            }}
            onDeleteSession={(id, libro) => {
              deleteSession(id, libro, updateLibro);
            }}
            onClose={() => setIsDetailOpen(false)}
            onEdit={() => setIsFormOpen(true)}
            onDelete={handleDelete}
          />
        )}
      </Modal>
    </div>
  );
};
