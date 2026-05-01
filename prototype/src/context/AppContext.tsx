/**
 * AppContext — global state
 *
 * Holds auth token, user identity, active session state, and selected
 * dealer group / rooftop. Both tenant values are set at runtime from the
 * DealerGroupSelection → RooftopSelection flow and cleared on logout.
 */

import React, { createContext, useContext, useState } from 'react';

interface AppContextValue {
  // Auth
  authToken: string | null;
  userId: number | null;
  // Session
  sessionId: number | null;
  // Tenant — populated from selection flow before starting an audit
  rooftopId: number | null;
  dealerGroupId: number | null;
  // Setters
  setAuth: (token: string, userId: number) => void;
  setSessionId: (id: number | null) => void;
  setRooftopId: (id: number | null) => void;
  setDealerGroupId: (id: number | null) => void;
  clearAuth: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [sessionId, setSessionIdState] = useState<number | null>(null);
  const [rooftopId, setRooftopIdState] = useState<number | null>(null);
  const [dealerGroupId, setDealerGroupIdState] = useState<number | null>(null);

  const setAuth = (token: string, id: number) => {
    setAuthToken(token);
    setUserId(id);
  };

  const setSessionId = (id: number | null) => {
    setSessionIdState(id);
  };

  const setRooftopId = (id: number | null) => {
    setRooftopIdState(id);
  };

  const setDealerGroupId = (id: number | null) => {
    setDealerGroupIdState(id);
  };

  const clearAuth = () => {
    setAuthToken(null);
    setUserId(null);
    setSessionIdState(null);
    setRooftopIdState(null);
    setDealerGroupIdState(null);
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
        setRooftopId,
        setDealerGroupId,
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
