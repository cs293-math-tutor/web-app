"use client";

import { useState, useMemo, useRef } from "react";
import type { Alternatives } from "@/lib/data";
import { FRAMEWORK_INFO } from "@/lib/data";

interface JigsawPanelProps {
    alternatives: Alternatives;
    onComplete: () => void;
}

type FrameworkKey = keyof Alternatives;

const FRAMEWORK_ORDER: FrameworkKey[] = [
    "dialogicTeaching",
    "productiveFailure",
    "uptake",
    "pressingForReasoning",
];

// Brief pedagogical hints for the ? tooltip (describes the move, not the name)
const HINTS: Record<FrameworkKey, string> = {
    dialogicTeaching:
        "This response extends the conversation by making the student the active explainer — distributing authority back to them rather than ending the exchange.",
    productiveFailure:
        "This response pushes the student to test or compare their own idea against a constraint, turning the mistake into a discovery mechanism.",
    uptake:
        "This response weaves the student's exact words or number into the next question, validating their contribution as the starting point for deeper inquiry.",
    pressingForReasoning:
        "This response demands a 'how' or 'why' explanation, keeping the cognitive load on the student rather than letting them off the hook.",
};

function shuffle<T>(arr: T[]): T[] {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

type MatchStatus = "idle" | "correct" | "incorrect";

function Tooltip({ text }: { text: string }) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);

    return (
        <span className="relative inline-flex items-center">
            <button
                ref={ref}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                onFocus={() => setVisible(true)}
                onBlur={() => setVisible(false)}
                className="ml-2 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-sand-300 bg-sand-100 text-xs font-bold text-sand-500 hover:bg-sand-200 hover:text-sand-700 transition-colors"
                aria-label="Hint"
                type="button"
            >
                ?
            </button>
            {visible && (
                <div className="absolute left-7 top-1/2 z-50 w-64 -translate-y-1/2 rounded-lg border border-sand-200 bg-white p-3 shadow-xl text-xs leading-relaxed text-sand-700">
                    {text}
                    <div className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-l border-b border-sand-200 bg-white" />
                </div>
            )}
        </span>
    );
}

export default function JigsawPanel({ alternatives, onComplete }: JigsawPanelProps) {
    const shuffledKeys = useMemo(() => shuffle([...FRAMEWORK_ORDER]), []);

    const [selectedText, setSelectedText] = useState<FrameworkKey | null>(null);
    const [matches, setMatches] = useState<Partial<Record<FrameworkKey, FrameworkKey>>>({});
    const [statuses, setStatuses] = useState<Partial<Record<FrameworkKey, MatchStatus>>>({});
    const [wrongLabel, setWrongLabel] = useState<FrameworkKey | null>(null);
    const [revealed, setRevealed] = useState(false);

    const correctCount = FRAMEWORK_ORDER.filter(
        (k) => statuses[k] === "correct"
    ).length;
    const allCorrect = correctCount === FRAMEWORK_ORDER.length;

    function handleTextClick(textKey: FrameworkKey) {
        if (statuses[textKey] === "correct" || revealed) return;
        setSelectedText((prev) => (prev === textKey ? null : textKey));
        setWrongLabel(null);
    }

    function handleLabelClick(labelKey: FrameworkKey) {
        if (!selectedText || revealed) return;

        const isCorrect = selectedText === labelKey;

        if (isCorrect) {
            setStatuses((s) => ({ ...s, [selectedText]: "correct" }));
            setMatches((m) => ({ ...m, [labelKey]: selectedText }));
            setSelectedText(null);
            setWrongLabel(null);
        } else {
            // Mark tile red, flash wrong label — but keep picker open
            setStatuses((s) => ({ ...s, [selectedText]: "incorrect" }));
            setWrongLabel(labelKey);
            // Reset tile to idle after flash so they can try again
            setTimeout(() => {
                setStatuses((s) =>
                    s[selectedText] === "incorrect" ? { ...s, [selectedText]: "idle" } : s
                );
                setWrongLabel(null);
            }, 800);
        }
    }

    function handleReveal() {
        const allMatches: Record<FrameworkKey, FrameworkKey> = {} as Record<FrameworkKey, FrameworkKey>;
        const allStatuses: Record<FrameworkKey, MatchStatus> = {} as Record<FrameworkKey, MatchStatus>;
        FRAMEWORK_ORDER.forEach((k) => {
            allMatches[k] = k;
            allStatuses[k] = "correct";
        });
        setMatches(allMatches);
        setStatuses(allStatuses);
        setRevealed(true);
        setSelectedText(null);
        setWrongLabel(null);
    }

    // Labels still available for matching
    const availableLabels = FRAMEWORK_ORDER.filter((k) => statuses[k] !== "correct");

    return (
        <div className="w-full animate-fade-up space-y-5">
            <div>
                <p className="mb-1 text-xs font-medium tracking-wide text-sand-500 uppercase">
                    Match the Alternative
                </p>
                <p className="text-sm text-sand-600 leading-relaxed">
                    Click an alternative text, then click the pedagogical framework it belongs to.
                    {correctCount > 0 && (
                        <span className="ml-2 font-semibold text-emerald-600">
                            {correctCount}/{FRAMEWORK_ORDER.length} matched ✓
                        </span>
                    )}
                </p>
            </div>

            {/* Text tiles (shuffled) — picker renders inline below the selected tile */}
            <div className="space-y-2">
                <p className="text-xs font-semibold text-sand-400 uppercase tracking-widest">
                    Alternatives — select one
                </p>
                {shuffledKeys.map((textKey) => {
                    const status = statuses[textKey] ?? "idle";
                    const isSelected = selectedText === textKey;
                    const isCorrect = status === "correct";
                    const isIncorrect = status === "incorrect";

                    return (
                        <div key={textKey} className="flex flex-col gap-2">
                            {/* Tile row */}
                            <div className="flex items-start gap-2">
                                <button
                                    onClick={() => handleTextClick(textKey)}
                                    disabled={isCorrect}
                                    className={`
                          flex-1 rounded-xl border px-4 py-3 text-left text-sm leading-relaxed transition-all duration-200
                          ${isCorrect
                                            ? "border-emerald-200 bg-emerald-50 text-emerald-800 cursor-default"
                                            : isIncorrect
                                                ? "border-red-300 bg-red-50 text-red-800 ring-2 ring-red-200"
                                                : isSelected
                                                    ? "border-slate-blue-400 bg-slate-blue-50 text-slate-blue-900 ring-2 ring-slate-blue-200 shadow-sm"
                                                    : "border-sand-200 bg-white text-sand-800 hover:border-sand-300 hover:shadow-sm"
                                        }
                        `}
                                >
                                    <span className="flex items-start gap-2">
                                        {isCorrect && (
                                            <svg
                                                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        <span className="flex-1">&ldquo;{alternatives[textKey]}&rdquo;</span>
                                        {isCorrect && (
                                            <span className="shrink-0 text-xs font-bold text-emerald-600 whitespace-nowrap">
                                                {FRAMEWORK_INFO[textKey].label}
                                            </span>
                                        )}
                                    </span>
                                </button>
                                {/* ? tooltip */}
                                {!isCorrect && <Tooltip text={HINTS[textKey]} />}
                            </div>

                            {/* Inline framework picker — only for this tile when selected */}
                            {isSelected && !revealed && (
                                <div className="ml-0 rounded-xl border border-slate-blue-200 bg-slate-blue-50 p-4 space-y-2 animate-fade-up">
                                    <p className="text-xs font-semibold text-slate-blue-600 uppercase tracking-widest mb-3">
                                        Which framework does this belong to? ↓
                                    </p>
                                    {availableLabels.map((labelKey) => {
                                        const info = FRAMEWORK_INFO[labelKey];
                                        const isWrong = wrongLabel === labelKey;
                                        return (
                                            <button
                                                key={labelKey}
                                                onClick={() => handleLabelClick(labelKey)}
                                                className={`
                                w-full rounded-lg border px-4 py-2.5 text-left transition-all active:scale-[0.98]
                                ${isWrong
                                                        ? "border-red-300 bg-red-50 ring-2 ring-red-200"
                                                        : "border-slate-blue-200 bg-white hover:border-slate-blue-400 hover:bg-slate-blue-100 hover:shadow-sm"
                                                    }
                              `}
                                            >
                                                <p className={`text-sm font-bold ${isWrong ? "text-red-700" : "text-sand-800"}`}>
                                                    {info.label}
                                                </p>
                                                <p className={`text-xs ${isWrong ? "text-red-500" : "text-sand-500"}`}>
                                                    {info.citation}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>


            {/* Bottom controls */}
            <div className="flex items-center justify-between pt-2">
                <button
                    onClick={handleReveal}
                    disabled={revealed}
                    className="text-sm font-medium text-sand-400 hover:text-sand-600 transition-colors disabled:opacity-40"
                >
                    Reveal answers
                </button>

                <button
                    onClick={onComplete}
                    disabled={!allCorrect && !revealed}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-blue-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    Next Example
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
