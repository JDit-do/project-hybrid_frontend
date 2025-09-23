'use client';

import { useEffect } from 'react';

export default function CursorScope() {
  useEffect(() => {
    document.body.classList.add('cursor-scope');
    return () => {
      document.body.classList.remove('cursor-scope');
    };
  }, []);

  return null;
}


