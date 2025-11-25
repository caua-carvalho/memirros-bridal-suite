import React, { useEffect, useState } from 'react';
import fallbackLogo from '@/assets/logo.png';

interface LogoProps {
  /** Caminho público (em /public) para a logo em tema claro. Padrão: /logo-light.png */
  lightSrc?: string;
  /** Caminho público (em /public) para a logo em tema escuro. Padrão: /logo-dark.png */
  darkSrc?: string;
  alt?: string;
  className?: string;
}

export function Logo({
  lightSrc = '/logo-light.png',
  darkSrc = '/logo-dark.png',
  alt = 'Logo',
  className,
}: LogoProps) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    const onThemeChange = (e: Event) => {
      // se o evento for CustomEvent com detail, use-o, senão leia a classe
      const anyE = e as CustomEvent<string>;
      if (anyE?.detail === 'dark') {
        setIsDark(true);
      } else if (anyE?.detail === 'light') {
        setIsDark(false);
      } else {
        setIsDark(document.documentElement.classList.contains('dark'));
      }
    };

    window.addEventListener('themeChange', onThemeChange as EventListener);
    // também reage a mudanças por outras abas (storage)
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'theme') {
        setIsDark(ev.newValue === 'dark');
      }
    };
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('themeChange', onThemeChange as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const [src, setSrc] = useState<string>(() => (isDark ? darkSrc : lightSrc));

  useEffect(() => {
    setSrc(isDark ? darkSrc : lightSrc);
  }, [isDark, lightSrc, darkSrc]);

  const handleError = () => {
    if (src !== fallbackLogo) setSrc(fallbackLogo);
  };

  return <img src={src} alt={alt} className={className} onError={handleError} />;
}

export default Logo;
