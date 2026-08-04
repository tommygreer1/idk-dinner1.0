"use client";

import Link from "next/link";
import { useState } from "react";

const choices = [
  { emoji: "🍳", title: "Cook at Home", detail: "Make honey BBQ chicken bowls." },
  { emoji: "🍔", title: "Eat Out", detail: "Pick a nearby local restaurant." },
  { emoji: "🔥", title: "Use the Smoker", detail: "Smoke chicken and save leftovers." },
  { emoji: "🌮", title: "Taco Night", detail: "Fast, cheap, and family friendly." },
  { emoji: "🍕", title: "Pizza Night", detail: "Order it or make easy flatbread pizzas." },
  { emoji: "♻️", title: "Leftover Night", detail: "Use what is already in the fridge." },
];

export default function SurprisePage() {
  const [pick, setPick] = useState<(typeof choices)[number] | null>(null);
  const [spinning, setSpinning] = useState(false);

  function decide() {
    setSpinning(true);
    window.setTimeout(() => {
      setPick(choices[Math.floor(Math.random() * choices.length)]);
      setSpinning(false);
    }, 600);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-fuchsia-50 via-white to-violet-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-slate-200">← Back home</Link>
        <section className="rounded-3xl bg-white p-7 text-center shadow-xl sm:p-10">
          <div className={`text-8xl ${spinning ? "animate-spin" : ""}`}>🎲</div>
          <h1 className="mt-5 text-4xl font-black sm:text-5xl">I Don’t Care</h1>
          <p className="mt-3 text-lg text-slate-600">No more debate. Tap once and dinner is decided.</p>
          <button onClick={decide} disabled={spinning} className="mt-8 w-full rounded-2xl bg-fuchsia-500 px-6 py-5 text-xl font-black text-white shadow-lg shadow-fuchsia-200 hover:bg-fuchsia-600 disabled:opacity-60">{spinning ? "Deciding..." : "🎲 Decide Dinner"}</button>
        </section>

        {pick && (
          <section className="mt-8 rounded-3xl bg-slate-950 p-8 text-center text-white shadow-2xl">
            <div className="text-7xl">{pick.emoji}</div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[.2em] text-fuchsia-300">Decision made</p>
            <h2 className="mt-2 text-4xl font-black">{pick.title}</h2>
            <p className="mt-3 text-lg text-slate-300">{pick.detail}</p>
            <button onClick={decide} className="mt-6 rounded-2xl bg-white px-6 py-3 font-bold text-slate-950">Nope, try again</button>
          </section>
        )}
      </div>
    </main>
  );
}
