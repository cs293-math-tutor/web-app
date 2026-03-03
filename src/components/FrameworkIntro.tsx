"use client";

import { useState } from "react";

interface FrameworkIntroProps {
    onComplete: () => void;
}

type CardData = {
    key: string;
    label: string;
    citation: string;
    paperUrl?: string;
    paperLabel: string;
    icon: string;
    colorClasses: string;
    description: string;
    detail: string;
    exampleShutdown: string;
    examplePivot: string;
    pivotLabel: string;
};

const CARDS: CardData[] = [
    {
        key: "uptake",
        label: "Uptake",
        citation: "Nystrand, 1997",
        paperUrl: "https://english.wisc.edu/publications/opening-dialogue-understanding-the-dynamics-of-language-and-learning/",
        paperLabel: "Nystrand (1997) — Opening Dialogue",
        icon: "M7 11l5-5m0 0l5 5m-5-5v12",
        colorClasses: "bg-emerald-50 border-emerald-200 text-emerald-700",
        description: "Validates student ideas as intellectual capital and extends the chain of inquiry.",
        detail:
            "According to Nystrand (1997), learning only happens when a teacher's response depends directly on what the student just said. Uptake does exactly this: instead of moving on after a wrong answer, the teacher incorporates the student's exact words or number into the next question, signaling that their contribution is the starting point for deeper exploration — not a dead end.",
        exampleShutdown: "Nope. Someone else?",
        examplePivot: "You said 72 — let's hold onto that. Class, how does this number connect to the 32-foot width on our diagram?",
        pivotLabel: "Uptake Pivot",
    },
    {
        key: "dialogicTeaching",
        label: "Dialogic Teaching",
        citation: "Alexander, 2018",
        paperUrl: "https://robinalexander.org.uk/wp-content/uploads/2019/12/RPIE-2018-Alexander-dialogic-teaching.pdf",
        paperLabel: "Alexander (2018) — Developing Dialogic Teaching",
        icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
        colorClasses: "bg-violet-50 border-violet-200 text-violet-700",
        description: "Promotes interthinking by distributing authority across the classroom through reciprocal dialogue.",
        detail:
            "Alexander (2018) defines dialogic teaching as using classroom talk to actively stretch and stimulate student thinking. A shutdown transforms an active learning environment into one where students wait for validation. A dialogic pivot instead turns the student into the active explainer — passing the intellectual authority back to them and prompting the whole class to engage in shared reasoning.",
        exampleShutdown: "No, that answer is wrong.",
        examplePivot: "Interesting. What made you choose that approach? Let's hear your thinking and see what the rest of the class notices.",
        pivotLabel: "Dialogic Pivot",
    },
    {
        key: "productiveFailure",
        label: "Productive Failure",
        citation: "Kapur & Roll, 2023",
        paperUrl: "https://psycnet.apa.org/record/2023-85215-016",
        paperLabel: "Kapur & Roll (2023) — Productive Failure",
        icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
        colorClasses: "bg-amber-50 border-amber-200 text-amber-700",
        description: "Uses student misconceptions as a resource for deeper conceptual change through deliberate struggle.",
        detail:
            "Kapur and Roll (2023) demonstrate that students who grapple with a concept before receiving the correct answer achieve deeper conceptual understanding than those who are immediately corrected. A productive failure pivot doesn't give the right answer — it asks the student to test their idea against a constraint, compare it to what they know, or identify where it breaks down. The mistake becomes the mechanism for discovery.",
        exampleShutdown: "No, that's the wrong formula.",
        examplePivot: "Try it your way first. If you apply that, how does your result compare to the 32-foot width on our diagram? What do you notice?",
        pivotLabel: "Productive Failure Pivot",
    },
    {
        key: "pressingForReasoning",
        label: "Pressing for Reasoning",
        citation: "Chin, 2007",
        paperUrl: "https://onlinelibrary.wiley.com/doi/abs/10.1002/tea.20171",
        paperLabel: "Chin (2007) — Teacher Questioning in Science Classrooms",
        icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01",
        colorClasses: "bg-sky-50 border-sky-200 text-sky-700",
        description: "Shifts focus from the answer to the reasoning process, maintaining high cognitive demand.",
        detail:
            "Chin (2007) shows that high-level questions demanding 'how' and 'why' explanations sustain the cognitive load on the student rather than letting them off the hook. A shutdown replaces rich dialogue with a binary right/wrong evaluation. Pressing for reasoning keeps the intellectual heavy lifting where it belongs — with the student — and ensures the exchange doesn't collapse into a recitation of facts.",
        exampleShutdown: "That's not right. Moving on.",
        examplePivot: "Walk me through every step: how did you arrive at that number, and how does it connect to the dimensions of the rectangle we're looking at?",
        pivotLabel: "Pressing for Reasoning Pivot",
    },
    {
        key: "growthMindset",
        label: "Why This Matters: Growth Mindset",
        citation: "Boaler, 2013",
        paperUrl: "https://www.youcubed.org/wp-content/uploads/14_Boaler_FORUM_55_1_web.pdf",
        paperLabel: "Boaler (2013) — Ability and Mathematics, FORUM 55(1)",
        icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
        colorClasses: "bg-rose-50 border-rose-200 text-rose-700",
        description: "Treating mistakes as sites of growth, not failure — protecting students' mathematical identities.",
        detail:
            "The four frameworks above all share a common purpose: making sure students do not feel stupid. Jo Boaler (2013) argues that the most effective learning environments are those where mistakes are treated as catalysts for brain growth. A shutdown does the opposite — it strips a student of their sense of agency and signals that their thinking is a dead end. By replacing shutdowns with uptake, dialogic questioning, productive struggle, and pressure for reasoning, teachers protect students' mathematical mindsets and keep the door open for genuine intellectual participation. That is the real objective of every pivot in this tool.",
        exampleShutdown: "No, that's not 72. Someone else?",
        examplePivot: "That's an interesting number to land on. Walk us through the steps you took to get to 72 — I want to see the path your brain was taking.",
        pivotLabel: "Growth Mindset Pivot",
    },
];

export default function FrameworkIntro({ onComplete }: FrameworkIntroProps) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const isLast = currentIdx === CARDS.length - 1;
    const card = CARDS[currentIdx];

    return (
        <div className="min-h-screen bg-sand-50 flex flex-col">
            {/* Header */}
            <header className="border-b border-sand-200 bg-sand-50/80 backdrop-blur-md">
                <div className="mx-auto max-w-2xl px-6 py-4 flex items-center justify-between">
                    <p className="text-xs font-semibold tracking-widest text-slate-blue-500 uppercase">
                        Before You Begin
                    </p>
                    {/* Dot progress */}
                    <div className="flex items-center gap-1.5">
                        {CARDS.map((_, i) => (
                            <div
                                key={i}
                                className={`h-2 rounded-full transition-all duration-300 ${i < currentIdx
                                    ? "w-4 bg-slate-blue-500"
                                    : i === currentIdx
                                        ? "w-4 bg-slate-blue-500 ring-2 ring-slate-blue-200 ring-offset-1"
                                        : "w-2 bg-sand-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </header>

            <main className="flex-1 mx-auto max-w-2xl w-full px-6 py-10 flex flex-col gap-6">
                <div className="animate-fade-up" key={currentIdx}>
                    {/* Frame number / label */}
                    <p className="mb-2 text-xs font-semibold text-sand-400 uppercase tracking-widest">
                        {currentIdx < CARDS.length - 1
                            ? `Framework ${currentIdx + 1} of ${CARDS.length - 1}`
                            : "Bringing it all together"}
                    </p>

                    {/* Title card */}
                    <div className={`rounded-xl border p-6 mb-5 ${card.colorClasses}`}>
                        <div className="flex items-start gap-4">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 shadow-sm">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-bold mb-1">{card.label}</h2>
                                <p className="text-sm leading-relaxed opacity-80 mb-3">{card.description}</p>
                                <p className="text-sm leading-relaxed opacity-70">{card.detail}</p>
                                {card.paperUrl && (
                                    <a
                                        href={card.paperUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
                                    >
                                        <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                        {card.paperLabel}
                                    </a>
                                )}
                                {!card.paperUrl && (
                                    <p className="mt-3 text-xs opacity-60 italic">{card.paperLabel}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Example transformation */}
                    <div className="rounded-xl border border-sand-200 bg-white shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-sand-100">
                            <p className="text-xs font-semibold tracking-widest text-sand-500 uppercase">
                                Example Transformation
                            </p>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <p className="mb-1.5 text-xs font-semibold text-shutdown-600 uppercase tracking-wide">
                                    Original Shutdown
                                </p>
                                <p className="rounded-lg bg-shutdown-50 border border-shutdown-100 px-4 py-3 text-sm text-shutdown-700 italic leading-relaxed">
                                    &ldquo;{card.exampleShutdown}&rdquo;
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-px flex-1 bg-sand-200" />
                                <svg className="h-4 w-4 text-sand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                                <div className="h-px flex-1 bg-sand-200" />
                            </div>
                            <div>
                                <p className="mb-1.5 text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                                    {card.pivotLabel}
                                </p>
                                <p className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-800 leading-relaxed">
                                    &ldquo;{card.examplePivot}&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom actions */}
            <div className="border-t border-sand-200 bg-sand-50/90 backdrop-blur-md">
                <div className="mx-auto max-w-2xl px-6 py-4 flex items-center justify-between gap-3">
                    {/* Skip tutorial */}
                    <button
                        onClick={onComplete}
                        className="text-sm font-medium text-sand-400 hover:text-sand-600 transition-colors"
                    >
                        Skip tutorial
                    </button>

                    <div className="flex items-center gap-2">
                        {currentIdx > 0 && (
                            <button
                                onClick={() => setCurrentIdx((i) => i - 1)}
                                className="rounded-lg border border-sand-200 bg-white px-4 py-2 text-sm font-medium text-sand-600 transition-all hover:bg-sand-50"
                            >
                                Back
                            </button>
                        )}
                        {isLast ? (
                            <button
                                onClick={onComplete}
                                className="group inline-flex items-center gap-2 rounded-lg bg-slate-blue-500 px-6 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-blue-600 active:scale-[0.98]"
                            >
                                Begin Practice
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentIdx((i) => i + 1)}
                                className="group inline-flex items-center gap-2 rounded-lg bg-slate-blue-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-blue-600 active:scale-[0.98]"
                            >
                                Next
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
