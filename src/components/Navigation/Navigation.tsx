import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Book, Map, Trophy, Gift } from 'lucide-react';
import styles from './Navigation.module.css';

export const Navigation: React.FC = () => {
  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home size={20} /> },
    { path: '/mundo', label: 'Mundo', icon: <Map size={20} /> },
    { path: '/biblioteca', label: 'Biblioteca', icon: <Book size={20} /> },
    { path: '/desafios', label: 'Desafíos', icon: <Trophy size={20} />, comingSoon: true },
    { path: '/sorpresa', label: 'Sorpresa', icon: <Gift size={20} />, comingSoon: true },
  ];

  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path} className={styles.navItem}>
            <NavLink
              to={item.comingSoon ? '#' : item.path}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive && !item.comingSoon ? styles.active : ''} ${item.comingSoon ? styles.disabled : ''}`
              }
              onClick={(e) => {
                if (item.comingSoon) {
                  e.preventDefault();
                }
              }}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
              {item.comingSoon && <span className={styles.comingSoonBadge}>Próximamente</span>}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
