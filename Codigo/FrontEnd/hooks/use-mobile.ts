import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    // 1. A consulta (query) está correta
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // 2. OTIMIZAÇÃO: O handler agora usa `event.matches`.
    //    O próprio evento já nos diz se a tela corresponde à query.
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mql.addEventListener('change', onChange);

    // 3. OTIMIZAÇÃO: A verificação inicial também usa `.matches`.
    //    Isso garante que a lógica é 100% consistente.
    setIsMobile(mql.matches);

    // 4. Limpeza do listener
    return () => mql.removeEventListener('change', onChange);
  }, []); 

  return !!isMobile;
}
