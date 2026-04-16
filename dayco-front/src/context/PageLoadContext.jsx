import { createContext, useContext, useCallback, useRef, useEffect, useState } from 'react';

const RegisterContext = createContext(null);
const ReadyContext = createContext(true);

export function PageLoadProvider({ children }) {
  const pending = useRef(0);
  const [ready, setReady] = useState(false);

  const register = useCallback(() => {
    pending.current += 1;
    setReady(false);
    let called = false;
    return () => {
      if (called) return;
      called = true;
      pending.current -= 1;
      if (pending.current <= 0) setReady(true);
    };
  }, []);

  return (
    <RegisterContext.Provider value={register}>
      <ReadyContext.Provider value={ready}>
        {children}
      </ReadyContext.Provider>
    </RegisterContext.Provider>
  );
}

export function usePageLoad() {
  const register = useContext(RegisterContext);
  const markReadyRef = useRef(null);

  useEffect(() => {
    if (!register) return;
    markReadyRef.current = register();
    return () => {
      if (markReadyRef.current) markReadyRef.current();
    };
  }, [register]);

  const markReady = useCallback(() => {
    if (markReadyRef.current) markReadyRef.current();
  }, []);

  return { markReady };
}

export function usePageReady() {
  return useContext(ReadyContext);
}
