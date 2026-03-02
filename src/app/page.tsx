"use client";

import Link from "next/link";
import { FRAMEWORK_INFO } from "@/lib/data";
import type { Alternatives } from "@/lib/data";

const FRAMEWORK_ICONS: Record<keyof Alternatives, string> = {
  dialogicTeaching: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  productiveFailure: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  uptake: "M7 11l5-5m0 0l5 5m-5-5v12",
  pressingForReasoning: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-sand-900) 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-3xl px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <p className="mb-4 text-xs font-semibold tracking-widest text-slate-blue-500 uppercase">
            Stanford CS293 / EDUC 473
          </p>

          <h1 className="mb-4 font-display text-4xl font-bold leading-tight tracking-tight text-sand-900 sm:text-5xl">
            Recognizing
            <br />
            Shutdown Moments
          </h1>

          <p className="mb-8 max-w-lg text-lg leading-relaxed text-sand-600">
            A practice tool for developing research-based responses to moments
            where student mathematical reasoning is dismissed. Explore real
            classroom exchanges and write alternatives grounded in four
            pedagogical frameworks.
          </p>

          <Link
            href="/practice"
            className="group inline-flex items-center gap-2 rounded-lg bg-slate-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-blue-600 hover:shadow-lg active:scale-[0.98]"
          >
            Begin Practice
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-3xl px-6">
        <div className="h-px bg-sand-200" />
      </div>

      {/* Framework Cards */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-6 text-xs font-semibold tracking-widest text-sand-500 uppercase">
          Four Frameworks for Better Responses
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.entries(FRAMEWORK_INFO) as [keyof Alternatives, typeof FRAMEWORK_INFO[keyof Alternatives]][]).map(
            ([key, info], i) => (
              <div
                key={key}
                className="rounded-xl border border-sand-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                style={{
                  animation: `fade-up 0.5s ease-out ${0.1 + i * 0.08}s both`,
                }}
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-blue-50">
                  <svg
                    className="h-5 w-5 text-slate-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={FRAMEWORK_ICONS[key]}
                    />
                  </svg>
                </div>
                <h3 className="mb-1 text-sm font-bold text-sand-800">
                  {info.label}
                </h3>
                <p className="mb-2 text-sm leading-relaxed text-sand-600">
                  {info.description}
                </p>
                <p className="text-xs font-medium text-sand-400 italic">
                  {info.citation}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* How it works */}
      <div className="mx-auto max-w-3xl px-6">
        <div className="h-px bg-sand-200" />
      </div>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="mb-6 text-xs font-semibold tracking-widest text-sand-500 uppercase">
          How It Works
        </p>

        <div className="space-y-6">
          {[
            {
              num: "01",
              title: "Read the Classroom Exchange",
              body: "Review a real classroom conversation where a teacher shuts down a student's mathematical reasoning. The shutdown moment is highlighted so you can see exactly where the interaction breaks down.",
            },
            {
              num: "02",
              title: "Write Your Own Alternative",
              body: "Compose a response that engages with the student's thinking rather than dismissing it. There is no single correct answer — the goal is to practice constructive dialogue.",
            },
            {
              num: "03",
              title: "Compare with Research-Based Responses",
              body: "Your response is compared against four expert-generated alternatives using semantic similarity. You can then review all four alternatives, each grounded in a different pedagogical framework.",
            },
            {
              num: "04",
              title: "Iterate and Improve",
              body: "Revise your response if you wish, or move on to the next example. Your progress is saved automatically and persists between sessions.",
            },
          ].map((step, i) => (
            <div
              key={step.num}
              className="flex gap-4"
              style={{
                animation: `fade-up 0.5s ease-out ${0.1 + i * 0.08}s both`,
              }}
            >
              <span className="mt-0.5 shrink-0 font-display text-2xl font-bold text-sand-200">
                {step.num}
              </span>
              <div>
                <h3 className="mb-1 text-sm font-bold text-sand-800">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-sand-600">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sand-200 py-8">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs text-sand-400">
            Built for Stanford CS293 / EDUC 473. Data sourced from the NCTE
            Main Study (ICPSR 36095).
          </p>
        </div>
      </footer>
    </div>
  );
}
