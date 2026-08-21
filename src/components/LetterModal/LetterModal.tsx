import React, { useState, useEffect } from 'react';
import { SECRET_LETTER_TITLE, SECRET_LETTER_SUBTITLE, SECRET_LETTER_CONTENT } from '../../config/content';
import { Button } from '../Button/Button';
import { X, MailOpen } from 'lucide-react';
import styles from './LetterModal.module.css';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstTime: boolean;
}

export const LetterModal: React.FC<LetterModalProps> = ({ isOpen, onClose, isFirstTime }) => {
  const [isReading, setIsReading] = useState(!isFirstTime);

  useEffect(() => {
    if (isOpen && !isFirstTime) {
      setIsReading(true);
    } else if (isOpen && isFirstTime) {
      setIsReading(false);
    }
  }, [isOpen, isFirstTime]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.glowBehind} ${isReading ? styles.glowActive : ''}`}></div>
      
      <div className={`${styles.letterContainer} ${isReading ? styles.reading : styles.envelope}`}>
        
        {!isReading ? (
          <div className={`${styles.introContent} animate-fade-in`}>
            <div className={styles.waxSeal}>
              <span className={styles.sealIcon}>🌸</span>
            </div>
            <h2 className={styles.introTitle}>{SECRET_LETTER_TITLE}</h2>
            <p className={styles.introSubtitle}>{SECRET_LETTER_SUBTITLE}</p>
            <Button variant="primary" onClick={() => setIsReading(true)} className={styles.openBtn}>
              <MailOpen size={18} style={{ marginRight: '8px' }} /> ABRIR CARTA
            </Button>
          </div>
        ) : (
          <div className={`${styles.letterContent} ${styles.unfoldAnimation}`}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar carta">
              <X size={24} />
            </button>
            <div className={styles.paper}>
              <div className={styles.waxSealSmall}>🌸</div>
              <div className={styles.paperTexture}></div>
              {/* Líneas decorativas sutiles para que parezca una carta real */}
              <div className={styles.paperLines}></div>
              
              <div className={styles.textContent}>
                {SECRET_LETTER_CONTENT.split('\n').map((paragraph, index) => (
                  <p key={index} className={styles.paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className={styles.actions}>
              <Button variant="secondary" onClick={onClose}>GUARDAR CARTA</Button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
