import React from 'react';
import { Tooltip } from '../../components/Tooltip/Tooltip';
import styles from './World.module.css';
import { Navigation } from '../../components/Navigation/Navigation';

export const World: React.FC = () => {
  return (
    <div className={styles.worldContainer}>
      {/* Background elements */}
      <div className={styles.sky}>
        <div className={styles.sun}></div>
        <div className={styles.cloud1}></div>
        <div className={styles.cloud2}></div>
      </div>
      
      <div className={styles.ground}>
        {/* The Path */}
        <div className={styles.path}></div>

        <div className={styles.worldMap}>
          
          {/* House */}
          <div className={styles.entity} style={{ top: '30%', left: '20%' }}>
            <Tooltip text="Mi rincón">
              <div className={`${styles.house} animate-float`}>
                <span className={styles.emoji}>🏡</span>
              </div>
            </Tooltip>
          </div>

          {/* Library */}
          <div className={styles.entity} style={{ top: '25%', left: '65%' }}>
            <Tooltip text="Mis libros">
              <div className={`${styles.library} animate-float`} style={{ animationDelay: '1s' }}>
                <span className={styles.emoji}>📚</span>
              </div>
            </Tooltip>
          </div>

          {/* Garden */}
          <div className={styles.entity} style={{ top: '65%', left: '25%' }}>
            <Tooltip text="Mi jardín">
              <div className={styles.garden}>
                <span className={styles.emoji}>🌸</span>
                <span className={styles.emoji} style={{ fontSize: '1rem', position: 'absolute', top: 10, left: -20 }}>🌷</span>
                <span className={styles.emoji} style={{ fontSize: '1rem', position: 'absolute', top: 5, right: -15 }}>🌻</span>
              </div>
            </Tooltip>
          </div>

          {/* Chest */}
          <div className={styles.entity} style={{ top: '70%', left: '60%' }}>
            <Tooltip text="???">
              <div className={`${styles.chest} animate-float`} style={{ animationDelay: '2s' }}>
                <span className={styles.emoji}>🧰</span>
              </div>
            </Tooltip>
          </div>

          {/* Blocked Zone */}
          <div className={styles.entity} style={{ top: '80%', left: '80%' }}>
            <Tooltip text="Esta parte del mundo todavía no ha sido descubierta.">
              <div className={styles.blockedZone}>
                <span className={styles.emoji}>🔒</span>
                <div className={styles.fog}></div>
              </div>
            </Tooltip>
          </div>

          {/* Decorative Trees */}
          <div className={styles.entity} style={{ top: '15%', left: '10%' }}>
            <span className={styles.emoji} style={{ fontSize: '2.5rem' }}>🌳</span>
          </div>
          <div className={styles.entity} style={{ top: '45%', left: '45%' }}>
            <span className={styles.emoji} style={{ fontSize: '2.5rem' }}>🌳</span>
          </div>
          <div className={styles.entity} style={{ top: '10%', left: '80%' }}>
            <span className={styles.emoji} style={{ fontSize: '2.5rem' }}>🌲</span>
          </div>

        </div>
      </div>
      
      <Navigation />
    </div>
  );
};
