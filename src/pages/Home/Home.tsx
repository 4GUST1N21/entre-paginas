import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import styles from './Home.module.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      <div className={styles.particlesContainer}>
        {/* Simple CSS particles/fireflies */}
        {[...Array(15)].map((_, i) => (
          <div key={i} className={styles.particle} style={{ 
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>

      <main className={styles.content}>
        <div className={styles.titleWrapper}>
          <h1 className={`${styles.title} animate-fade-in`}>
            Entre Páginas <span className={styles.flower}>🌸</span>
          </h1>
          <p className={`${styles.subtitle} animate-fade-in`} style={{ animationDelay: '0.3s' }}>
            Un pequeño mundo creado para una gran lectora.
          </p>
        </div>

        <div className={`${styles.actionWrapper} animate-fade-in`} style={{ animationDelay: '0.6s' }}>
          <Button 
            size="lg" 
            onClick={() => navigate('/mundo')}
            className={styles.enterButton}
          >
            ENTRAR AL MUNDO
          </Button>
        </div>
      </main>

      <div className={styles.groundDecorations}>
        {/* Abstract shapes representing grass and flowers at the bottom */}
        <div className={styles.grass} />
        <div className={styles.grassLight} />
      </div>
    </div>
  );
};
