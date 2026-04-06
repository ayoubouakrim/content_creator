'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<'fadeIn' | 'fadeOut'>('fadeIn');
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      // Start fade-out
      setTransitionStage('fadeOut');

      const timeout = setTimeout(() => {
        // Swap page content then fade in
        setDisplayChildren(children);
        prevPathname.current = pathname;
        setTransitionStage('fadeIn');
      }, 200); // must match CSS duration below

      return () => clearTimeout(timeout);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-10px); }
        }
        .page-fadeIn  { animation: fadeIn  300ms ease forwards; }
        .page-fadeOut { animation: fadeOut 200ms ease forwards; }
      `}</style>
      <div className={`page-${transitionStage}`}>
        {displayChildren}
      </div>
    </>
  );
}