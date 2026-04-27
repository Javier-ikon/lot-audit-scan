/**
 * AppContext — Phase 1 global state
 *
 * Holds auth token, user identity, and active session state.
 * rooftopId is hardcoded to 1 (placeholder) in Phase 1.
 * In Phase 2, rooftopId and dealerGroupId are populated from Planet X selection.
 */

import React, { createContext, useContext, useState } from 'react';

interface AppContextValue {
  // Auth
  authToken: string | null;
  userId: number | null;
  // Session
  sessionId: number | null;
  // Tenant placeholders (Phase 1: fixed values; Phase 2: from Planet X selection)
  rooftopId: number;
  dealerGroupId: number | null;
  // Setters
  setAuth: (token: string, userId: number) => void;
  setSessionId: (id: number | null) => void;
  clearAuth: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [sessionId, setSessionIdState] = useState<number | null>(null);

  // Phase 1: rooftopId=1 matches the placeholder row seeded in the DB (P1-1).
  // Phase 2: this will be set from RooftopSelectionScreen after Planet X API call.
  const rooftopId = 1;
  const dealerGroupId = null;

  const setAuth = (token: string, id: number) => {
    setAuthToken(token);
    setUserId(id);
  };

  const setSessionId = (id: number | null) => {
    setSessionIdState(id);
  };

  const clearAuth = () => {
    setAuthToken(null);
    setUserId(null);
    setSessionIdState(null);
  };

  return (
    <AppContext.Provider
      value={{
        authToken,
        userId,
        sessionId,
        rooftopId,
        dealerGroupId,
        setAuth,
        setSessionId,
        clearAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/**
 * useAppContext — must be used inside AppProvider.
 * Throws if used outside of the provider tree.
 */
export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return ctx;
}
