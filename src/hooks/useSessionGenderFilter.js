import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mmai_gender_filter';
const CHANGE_EVENT = 'mmai:gender-filter-change';

function readStoredGender() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) || null;
  } catch {
    return null;
  }
}

export function useSessionGenderFilter() {
  const [gender, setGenderState] = useState(readStoredGender);

  // Multiple components (e.g. DrawerMenu and CategoryGrid) hold independent
  // instances of this hook. Without this, a change made in one instance
  // (via setGender) wouldn't be reflected in another already-mounted
  // instance until a full remount/reload.
  useEffect(() => {
    const handleChange = (e) => setGenderState(e.detail);
    window.addEventListener(CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(CHANGE_EVENT, handleChange);
  }, []);

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
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }));
  };

  return [gender, setGender];
}
