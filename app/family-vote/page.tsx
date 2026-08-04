"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Person = {
  id: number;
  name: string;
  picks: string[];
};

const choices = [
  "Tacos",
  "Pizza",
  "Burgers",
  "Chicken",
  "Pasta",
  "BBQ",
  "Breakfast",
  "Takeout",
];

const mealMatches = [
  {
    name: "Grilled chicken tacos",
    fits: ["Tacos", "Chicken", "BBQ"],
    emoji: "🌮",
    backup: "Chicken quesadillas",
  },
  {
    name: "BBQ cheeseburger bowls",
    fits: ["Burgers", "BBQ", "Chicken"],
    emoji: "🍔",
    backup: "Loaded baked potatoes",
  },
  {
    name: "Sheet-pan chicken parmesan",
    fits: ["Chicken", "Pasta", "Pizza"],
    emoji: "🍝",
    backup: "Baked pizza sliders",
  },
  {
    name: "Breakfast-for-dinner bar",
    fits: ["Breakfast", "Takeout"],
    emoji: "🥞",
    backup: "Breakfast burritos",
  },
  {
    name: "Build-your-own pizza night",
    fits: ["Pizza", "Takeout", "Pasta"],
    emoji: "🍕",
    backup: "Pepperoni pizza pasta",
  },
];

export default function FamilyVotePage() {
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "Me", picks: [] },
    { id: 2, name: "Person 2", picks: [] },
  ]);
  const [result, setResult] = useState<(typeof mealMatches)[number] | null>(null);

  const totalPicks = useMemo(
    () => people.reduce((total, person) => total + person.picks.length, 0),
    [people],
  );

  function updateName(id: number, name: string) {
    setPeople((current) => current.map((person) => (person.id === id ? { ...person, name } : person)));
  }

  function togglePick(id: number, pick: string) {
    setPeople((current) =>
      current.map((person) => {
        if (person.id !== id) return person;
        const picks = person.picks.includes(pick)
          ? person.picks.filter((item) => item !== pick)
          : [...person.picks, pick];
        return { ...person, picks };
      }),
    );
    setResult(null);
  }

  function addPerson() {
    setPeople((current) => [
      ...current,
      { id: Date.now(), name: `Person ${current.length + 1}`, picks: [] },
    ]);
  }

  function removePerson(id: number) {
    setPeople((current) => current.filter((person) => person.id !== id));
    setResult(null);
  }

  function decideDinner() {
    const scores = mealMatches.map((meal) => ({
      meal,
      score: people.reduce(
        (score, person) => score + person.picks.filter((pick) => meal.fits.includes(pick)).length,
        0,
      ),
    }));
    const highest = Math.max(...scores.map((item) => item.score));
    const finalists = scores.filter((item) => item.score === highest);
    const winner = finalists[Math.floor(Math.random() * finalists.length)].meal;
    setResult(winner);
    window.setTimeout(() => document.getElementById("vote-result")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <main className="min-h-screen bg-[#fffaf1] px-4 py-6 text-slate-950 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="rounded-full border-2 border-slate-950 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0_#0f172a]">
            ← Home
          </Link>
          <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-800">No sign-in needed</span>
        </div>

        <header className="py-10 text-center sm:py-14">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">Decide together</p>
          <h1 className="mt-3 text-5xl font-black tracking-[-0.05em] sm:text-7xl">What can everybody eat?</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-medium text-slate-600">
            Each person taps everything they would be okay with. We find the best overlap and make the final call.
          </p>
        </header>

        <div className="space-y-6">
          {people.map((person, index) => (
            <section key={person.id} className="rounded-3xl border-2 border-slate-950 bg-white p-5 shadow-[6px_6px_0_#0f172a] sm:p-7">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-400 text-xl font-black">{index + 1}</div>
                <input
                  aria-label={`Name for person ${index + 1}`}
                  value={person.name}
                  onChange={(event) => updateName(person.id, event.target.value)}
                  className="min-w-0 flex-1 border-b-2 border-slate-200 bg-transparent px-1 py-2 text-xl font-black outline-none focus:border-orange-500"
                />
                {people.length > 2 && (
                  <button type="button" onClick={() => removePerson(person.id)} className="rounded-full px-3 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-rose-600">
                    Remove
                  </button>
                )}
              </div>

              <p className="mt-5 text-sm font-bold text-slate-500">Tap every option that sounds acceptable:</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {choices.map((choice) => {
                  const selected = person.picks.includes(choice);
                  return (
                    <button
                      type="button"
                      key={choice}
                      aria-pressed={selected}
                      onClick={() => togglePick(person.id, choice)}
                      className={`rounded-2xl border-2 px-3 py-3 font-black transition ${
                        selected
                          ? "border-slate-950 bg-orange-400 shadow-[3px_3px_0_#0f172a]"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-950"
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_2fr]">
          <button type="button" onClick={addPerson} className="rounded-2xl border-2 border-slate-950 bg-white px-5 py-4 text-lg font-black shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-1">
            + Add person
          </button>
          <button
            type="button"
            onClick={decideDinner}
            disabled={totalPicks === 0}
            className="rounded-2xl border-2 border-slate-950 bg-slate-950 px-5 py-4 text-lg font-black text-white shadow-[4px_4px_0_#fb923c] transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
          >
            Find our dinner →
          </button>
        </div>

        {result && (
          <section id="vote-result" className="mt-10 rounded-[2rem] border-2 border-slate-950 bg-emerald-200 p-7 text-center shadow-[8px_8px_0_#0f172a] sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.2em]">The best match is</p>
            <div className="mt-3 text-7xl">{result.emoji}</div>
            <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{result.name}</h2>
            <p className="mt-4 text-lg font-bold text-slate-700">Backup choice: {result.backup}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/groceries" className="rounded-2xl border-2 border-slate-950 bg-white px-5 py-3 font-black shadow-[3px_3px_0_#0f172a]">Build grocery list</Link>
              <button type="button" onClick={decideDinner} className="rounded-2xl border-2 border-slate-950 bg-slate-950 px-5 py-3 font-black text-white">Pick another match</button>
            </div>
          </section>
        )}

        <p className="mt-10 text-center text-sm font-semibold text-slate-500">Your picks stay on this device for this session. Accounts can stay optional later.</p>
      </div>
    </main>
  );
}
