import { createContext, useContext, ReactNode } from 'react';
import type { UserPersona } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface PersonaContextType {
  persona: UserPersona | null;
  setPersona: (p: UserPersona) => void;
  clearPersona: () => void;
}

const PersonaContext = createContext<PersonaContextType | null>(null);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaRaw] = useLocalStorage<UserPersona | null>('user-persona', null);

  const setPersona = (p: UserPersona) => setPersonaRaw(p);
  const clearPersona = () => setPersonaRaw(null);

  return (
    <PersonaContext.Provider value={{ persona, setPersona, clearPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = useContext(PersonaContext);
  if (!ctx) throw new Error('usePersona must be used within PersonaProvider');
  return ctx;
}
