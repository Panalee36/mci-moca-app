'use client';

import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import * as React from 'react';

export function NextThemeProvider({ children, ...props }: React.ComponentProps<typeof ThemeProvider>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render nothing on the server to avoid hydration mismatch
    return null;
  }

  return <ThemeProvider {...props}>{children}</ThemeProvider>;
}
