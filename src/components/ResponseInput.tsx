"use client";

import { useRef, useEffect } from "react";

interface ResponseInputProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function ResponseInput({
  value,
  onChange,
  readOnly = false,
}: ResponseInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!readOnly && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [readOnly]);

  return (
    <div className="w-full animate-fade-up">
      <label
        htmlFor="teacher-response"
        className="mb-2 block text-xs font-medium tracking-wide text-sand-500 uppercase"
      >
        Your Alternative Response
      </label>
      <div className="relative">
        <textarea
          ref={textareaRef}
          id="teacher-response"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          placeholder="What would you say instead to engage with this student's mathematical thinking?"
          rows={3}
          className={`
            w-full rounded-xl border px-4 py-3 text-sm leading-relaxed
            placeholder:text-sand-400 focus:outline-none resize-none
            transition-all duration-200
            ${
              readOnly
                ? "border-sand-200 bg-sand-50 text-sand-700 cursor-default"
                : "border-sand-300 bg-white text-sand-900 shadow-sm focus:border-slate-blue-400 focus:ring-2 focus:ring-slate-blue-100"
            }
          `}
        />
        <div className="mt-1.5 flex justify-end">
          <span className="text-xs text-sand-400">
            {value.length} characters
          </span>
        </div>
      </div>
    </div>
  );
}
