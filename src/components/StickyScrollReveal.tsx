import React, { useEffect, useMemo, useRef, useState } from 'react';

type StickyItem = {
  title: string;
  description: string;
  content?: React.ReactNode;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  stepNumber?: string | number;
};

interface StickyScrollRevealProps {
  items: StickyItem[];
  contentClassName?: string;
  renderSticky?: (activeIndex: number, items: StickyItem[]) => React.ReactNode;
}

const StickyScrollReveal: React.FC<StickyScrollRevealProps> = ({ items, contentClassName, renderSticky }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const breakpoints = useMemo(() => items.map((_, i) => i / items.length), [items]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      // find closest breakpoint
      let closest = 0;
      for (let i = 1; i < breakpoints.length; i++) {
        if (Math.abs(progress - breakpoints[i]) < Math.abs(progress - breakpoints[closest])) {
          closest = i;
        }
      }
      setActiveIndex(closest);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener('scroll', onScroll);
  }, [breakpoints]);

  return (
    <div ref={containerRef} className="relative flex h-svh justify-center space-x-8 overflow-y-auto rounded-md p-6 sm:p-10 bg-transparent">
      <div className="relative flex items-start px-2 sm:px-4">
        <div className="max-w-2xl">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeIndex === index;
            return (
              <div key={item.title + index} className="my-16 sm:my-20">
                <div className="mb-3 inline-flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-all ${isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-muted text-foreground/60'}`}>
                    {`Step ${typeof item.stepNumber !== 'undefined' ? item.stepNumber : index + 1}`}
                  </span>
                  {Icon ? (
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ${isActive ? 'scale-105' : ''}`}>
                      <Icon size={16} />
                    </span>
                  ) : null}
                </div>
                <h2 className={`text-2xl font-bold transition-opacity transition-transform duration-300 ${isActive ? 'opacity-100 scale-105' : 'opacity-40 scale-100'}`}>
                  {item.title}
                </h2>
                <p className={`mt-4 sm:mt-6 max-w-sm text-foreground/80 transition-opacity transition-transform duration-300 ${isActive ? 'opacity-100 scale-[1.02]' : 'opacity-40 scale-100'}`}>
                  {item.description}
                </p>
              </div>
            );
          })}
          <div className="h-40" />
        </div>
      </div>
      <div className={`sticky top-6 hidden h-[85svh] w-[28rem] overflow-hidden rounded-xl bg-transparent lg:block ${contentClassName || ''}`}>
        {renderSticky ? renderSticky(activeIndex, items) : (items[activeIndex]?.content ?? null)}
      </div>
    </div>
  );
};

export default StickyScrollReveal;


