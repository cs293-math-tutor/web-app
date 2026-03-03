"use client";

import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import Link from "next/link";

interface ReflectionScreenProps {
    onRestart?: () => void;
}

export default function ReflectionScreen({ onRestart }: ReflectionScreenProps) {
    const [reflection, setReflection] = useState("");
    const [saving, setSaving] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const today = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    async function handleSave() {
        if (!cardRef.current || !reflection.trim()) return;
        setSaving(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: null,
            });
            const link = document.createElement("a");
            link.download = "my-reflection.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center px-4 py-12">
            {/* Confetti-style header */}
            <div className="mb-8 flex flex-col items-center gap-3 text-center">
                <div className="flex items-center gap-2 text-3xl select-none" aria-hidden>
                    🎉✨📚✨🎉
                </div>
                <h1 className="font-display text-2xl font-bold text-sand-900">
                    You made it through all 10 examples!
                </h1>
                <p className="max-w-md text-sm text-sand-600 leading-relaxed">
                    Take a moment to reflect. What will you carry with you from this activity?
                    What felt surprising, useful, or worth trying in your next class?
                </p>
            </div>

            {/* Reflection input */}
            <div className="w-full max-w-xl space-y-4">
                <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Write your reflection here…"
                    rows={4}
                    className="w-full rounded-xl border border-sand-200 bg-white px-5 py-4 text-sm leading-relaxed text-sand-800 shadow-sm outline-none transition focus:border-slate-blue-400 focus:ring-2 focus:ring-slate-blue-100 resize-none placeholder:text-sand-400"
                />

                {/* Preview card — this is what gets captured */}
                {reflection.trim() && (
                    <div
                        ref={cardRef}
                        className="rounded-2xl overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #fdf6ec 0%, #e8e4f7 100%)",
                            padding: "40px 44px",
                            fontFamily: "'Georgia', serif",
                            position: "relative",
                        }}
                    >


                        {/* Opening mark */}
                        <p style={{ fontSize: 64, color: "#7c6fa0", opacity: 0.35, lineHeight: 0.6, marginBottom: 12, fontFamily: "Georgia, serif" }}>
                            &ldquo;
                        </p>

                        {/* Quote text */}
                        <p style={{
                            fontSize: 18,
                            lineHeight: 1.7,
                            color: "#3d3440",
                            fontStyle: "italic",
                            marginBottom: 24,
                            maxWidth: 520,
                        }}>
                            {reflection.trim()}
                        </p>

                        {/* Divider */}
                        <div style={{ width: 40, height: 2, background: "#9b8cbf", opacity: 0.5, borderRadius: 2, marginBottom: 16 }} />

                        {/* Footer */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: "#5b4d7a", fontFamily: "system-ui, sans-serif", letterSpacing: "0.05em" }}>
                                    Nope Moments
                                </p>
                                <p style={{ fontSize: 11, color: "#9b8cbf", fontFamily: "system-ui, sans-serif", marginTop: 2 }}>
                                    {today}
                                </p>
                            </div>
                            <p style={{ fontSize: 22, lineHeight: 1 }}>🌱</p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-1">
                    <Link
                        href="/"
                        className="text-sm font-medium text-sand-400 hover:text-sand-600 transition-colors"
                    >
                        ← Go back home
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={!reflection.trim() || saving}
                        className="ml-auto inline-flex items-center gap-2 rounded-lg bg-slate-blue-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-blue-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Saving…
                            </>
                        ) : (
                            <>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Save as Image
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
