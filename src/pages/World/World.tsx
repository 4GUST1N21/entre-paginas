import React, { useState } from 'react';
import { Tooltip } from '../../components/Tooltip/Tooltip';
import styles from './World.module.css';
import { Navigation } from '../../components/Navigation/Navigation';
import { useWorld } from '../../hooks/useWorld';
import { LetterModal } from '../../components/LetterModal/LetterModal';

export const World: React.FC = () => {
  const { worldState, openSecretChest, isLoaded } = useWorld();
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isFirstTimeOpening, setIsFirstTimeOpening] = useState(false);
  const [isChestClicked, setIsChestClicked] = useState(false);

  const handleChestClick = () => {
    setIsChestClicked(true);
    if (!worldState.secretChestOpened) {
      openSecretChest();
      setIsFirstTimeOpening(true);
    } else {
      setIsFirstTimeOpening(false);
    }
    // Retraso para que la pequeña animación de rebote se ejecute antes de abrir
    setTimeout(() => {
      setIsLetterOpen(true);
      setIsChestClicked(false);
    }, 300);
  };

  if (!isLoaded) return null;

  return (
    <div className={styles.worldContainer}>
      {/* Background elements */}
      <div className={styles.sky}>
        <div className={styles.sun}></div>
        <div className={styles.cloud1}></div>
        <div className={styles.cloud2}></div>
      </div>
      
      <div className={styles.ground}>
        {/* Terrain details */}
        <div className={styles.terrainDetails}></div>

        {/* The Path */}
        <div className={styles.path}></div>
        
        {/* Subtle path flowers */}
        <div className={styles.pathFlower} style={{ bottom: '20%', left: '45%' }}>🌸</div>
        <div className={styles.pathFlower} style={{ bottom: '40%', right: '40%' }}>🌷</div>
        <div className={styles.pathFlower} style={{ bottom: '10%', right: '48%' }}>🌱</div>

        <div className={styles.worldMap}>
          
          {/* House */}
          <div className={styles.entity} style={{ top: '30%', left: '20%' }}>
            <Tooltip text="Mi rincón 🏡">
              <div className={`${styles.house} animate-float`}>
                <span className={styles.emoji}>🏡</span>
                <div className={styles.shadow}></div>
              </div>
            </Tooltip>
          </div>

          {/* Library */}
          <div className={styles.entity} style={{ top: '25%', left: '65%' }}>
            <Tooltip text="Mis libros 📚">
              <div className={`${styles.library} animate-float`} style={{ animationDelay: '1s' }}>
                <span className={styles.emoji}>📚</span>
                <div className={styles.shadow}></div>
              </div>
            </Tooltip>
          </div>

          {/* Garden */}
          <div className={styles.entity} style={{ top: '65%', left: '25%' }}>
            <Tooltip text="Mi jardín 🌸">
              <div className={styles.garden}>
                <span className={styles.emoji}>🌸</span>
                <span className={styles.emoji} style={{ fontSize: '1rem', position: 'absolute', top: 10, left: -20 }}>🌷</span>
                <span className={styles.emoji} style={{ fontSize: '1rem', position: 'absolute', top: 5, right: -15 }}>🌻</span>
                <div className={styles.shadow}></div>
              </div>
            </Tooltip>
          </div>

          {/* Chest */}
          <div className={styles.entity} style={{ top: '70%', left: '60%' }} onClick={handleChestClick}>
            <Tooltip text={worldState.secretChestOpened ? "Volver a leer la carta 💌" : "Hay algo para vos... 💌"}>
              <div className={`${styles.chestWrapper} ${worldState.secretChestOpened ? styles.chestOpened : ''}`}>
                {!worldState.secretChestOpened && <div className={styles.chestGlow}></div>}
                {!worldState.secretChestOpened && <div className={styles.chestParticles}></div>}
                <div className={`${styles.chest} animate-float ${isChestClicked ? styles.chestClicked : ''}`} style={{ animationDelay: '2s' }}>
                  <span className={styles.emoji}>{worldState.secretChestOpened ? '📬' : '🧰'}</span>
                  <div className={styles.shadow}></div>
                </div>
              </div>
            </Tooltip>
          </div>

          {/* Blocked Zone */}
          <div className={styles.entity} style={{ top: '80%', left: '80%' }}>
            <Tooltip text="Este lugar todavía no ha sido descubierto.">
              <div className={styles.blockedZone}>
                <span className={styles.emoji}>🔒</span>
                <div className={styles.fog}></div>
              </div>
            </Tooltip>
          </div>

          {/* Decorative Trees */}
          <div className={styles.entity} style={{ top: '15%', left: '10%' }}>
            <span className={styles.emoji} style={{ fontSize: '2.5rem' }}>🌳</span>
            <div className={styles.shadow}></div>
          </div>
          <div className={styles.entity} style={{ top: '45%', left: '45%' }}>
            <span className={styles.emoji} style={{ fontSize: '2.5rem' }}>🌳</span>
            <div className={styles.shadow}></div>
          </div>
          <div className={styles.entity} style={{ top: '10%', left: '80%' }}>
            <span className={styles.emoji} style={{ fontSize: '2.5rem' }}>🌲</span>
            <div className={styles.shadow}></div>
          </div>

        </div>
      </div>
      
      <Navigation />

      <LetterModal 
        isOpen={isLetterOpen} 
        onClose={() => setIsLetterOpen(false)} 
        isFirstTime={isFirstTimeOpening}
      />
    </div>
  );
};
