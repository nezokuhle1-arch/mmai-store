import { useState } from 'react';

const STORAGE_KEY = 'mmai_gender_filter';

export function useSessionGenderFilter() {
  const [gender, setGenderState] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  const setGender = (value) => {
    setGenderState(value);
    try {
      if (value) {
        sessionStorage.setItem(STORAGE_KEY, value);
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // sessionStorage unavailable — fail silently, filter just won't persist
    }
  };

  return [gender, setGender];
}
