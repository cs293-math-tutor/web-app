"use client";

import { useState, useRef, useEffect } from "react";

interface FrameworkTooltipProps {
  description: string;
  citation: string;
  children: React.ReactNode;
}

export default function FrameworkTooltip({
  description,
  citation,
  children,
}: FrameworkTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
      }
    }

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible]);

  return (
    <span className="relative inline-flex items-center">
      {children}
      <button
        ref={triggerRef}
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sand-200 text-sand-600 hover:bg-sand-300 transition-colors text-xs leading-none cursor-help"
        aria-label="Framework information"
      >
        ?
      </button>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-lg border border-sand-200 bg-white p-3 shadow-lg"
        >
          <p className="text-xs leading-relaxed text-sand-700">{description}</p>
          <p className="mt-1.5 text-xs font-medium text-sand-500 italic">
            {citation}
          </p>
          <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 border-b border-r border-sand-200 bg-white" />
        </div>
      )}
    </span>
  );
}
