import { useState, useEffect } from 'react';

const STORAGE_KEY = 'entre_paginas_world_state';

interface WorldState {
  secretChestOpened: boolean;
}

const defaultState: WorldState = {
  secretChestOpened: false,
};

export const useWorld = () => {
  const [worldState, setWorldState] = useState<WorldState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setWorldState(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing world state', e);
        setWorldState(defaultState);
      }
    } else {
      setWorldState(defaultState);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(worldState));
    }
  }, [worldState, isLoaded]);

  const openSecretChest = () => {
    setWorldState((prev) => ({ ...prev, secretChestOpened: true }));
  };

  return {
    worldState,
    openSecretChest,
    isLoaded,
  };
};
