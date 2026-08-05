"use client";

import Link from "next/link";
import { useState } from "react";

type AiMeal = {
  name: string;
  emoji: string;
  description: string;
  timeMinutes: number;
  estimatedCost: number;
  ingredients: string[];
  instructions: string[];
  missingGroceries: string[];
  substitutions: string[];
  leftoverIdea: string;
};

const equipmentOptions = ["Stove", "Oven", "Grill", "Smoker", "Air Fryer", "Crockpot", "Griddle"];

export default function CookPage() {
  const [people, setPeople] = useState("4");
  const [budget, setBudget] = useState(30);
  const [time, setTime] = useState(45);
  const [equipment, setEquipment] = useState<string[]>(["Stove", "Oven"]);
  const [avoid, setAvoid] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState<AiMeal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleEquipment(item: string) {
    setEquipment((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  async function findDinner() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/ai-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ people, budget, time, equipment, avoid, ingredients }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Dinner could not be created.");
      setResult(data);
      window.setTimeout(() => document.getElementById("dinner-result")?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Dinner could not be created.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-slate-200">← Back home</Link>

        <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-orange-100 sm:p-9">
          <div className="text-center">
            <div className="text-6xl">✨</div>
            <p className="mt-4 text-sm font-black uppercase tracking-[.25em] text-orange-500">Powered by AI</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">Make Tonight&apos;s Meal</h1>
            <p className="mt-3 text-lg text-slate-600">No giant recipe upload. IDK creates a meal around your actual night.</p>
          </div>

          <div className="mt-9 space-y-8">
            <Question title="How many people are eating?">
              <div className="grid grid-cols-4 gap-3">{["2", "3", "4", "5+"].map((option) => <ChoiceButton key={option} selected={people === option} onClick={() => setPeople(option)}>{option}</ChoiceButton>)}</div>
            </Question>

            <Question title={`Budget: up to $${budget}`}>
              <input aria-label="Dinner budget" type="range" min="15" max="100" step="5" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-orange-500" />
            </Question>

            <Question title={`Time available: ${time} minutes`}>
              <input aria-label="Cooking time" type="range" min="20" max="120" step="5" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full accent-orange-500" />
            </Question>

            <Question title="What can you cook with?">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{equipmentOptions.map((item) => <ChoiceButton key={item} selected={equipment.includes(item)} onClick={() => toggleEquipment(item)}>{item}</ChoiceButton>)}</div>
            </Question>

            <Question title="What do you already have?">
              <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Chicken, rice, cheese, broccoli..." rows={3} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
            </Question>

            <Question title="Anything to avoid?">
              <input value={avoid} onChange={(e) => setAvoid(e.target.value)} placeholder="Allergies, dislikes, seafood, mushrooms..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" />
            </Question>

            {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}

            <button type="button" disabled={loading || equipment.length === 0} onClick={findDinner} className="w-full rounded-2xl bg-orange-500 px-6 py-4 text-xl font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "IDK is planning dinner..." : "✨ Create My Dinner"}
            </button>
          </div>
        </section>

        {result && (
          <section id="dinner-result" className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-2xl sm:p-9">
            <div className="text-6xl">{result.emoji}</div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[.2em] text-orange-300">Tonight&apos;s AI pick</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">{result.name}</h2>
            <p className="mt-3 text-slate-300">{result.description}</p>
            <div className="mt-5 flex gap-3"><Stat label="Time" value={`${result.timeMinutes} min`} /><Stat label="Est. cost" value={`$${result.estimatedCost}`} /></div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <Panel title="🥘 Ingredients" items={result.ingredients} />
              <Panel title="🛒 Missing groceries" items={result.missingGroceries.length ? result.missingGroceries : ["Nothing extra needed"]} />
            </div>

            <div className="mt-5 rounded-2xl bg-white/10 p-5">
              <h3 className="text-lg font-bold">👨‍🍳 Simple directions</h3>
              <ol className="mt-3 space-y-3 text-slate-200">{result.instructions.map((step, index) => <li key={`${step}-${index}`}><strong>{index + 1}.</strong> {step}</li>)}</ol>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Panel title="🔁 Easy substitutions" items={result.substitutions.length ? result.substitutions : ["No substitutions needed"]} />
              <div className="rounded-2xl bg-white/10 p-5"><h3 className="text-lg font-bold">♻️ Leftover plan</h3><p className="mt-3 text-slate-200">{result.leftoverIdea}</p></div>
            </div>

            <button type="button" onClick={findDinner} disabled={loading} className="mt-6 w-full rounded-2xl bg-white px-5 py-3 font-bold text-slate-950 hover:bg-orange-100">Make a Different Meal</button>
          </section>
        )}
      </div>
    </main>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) { return <fieldset><legend className="mb-3 text-lg font-extrabold">{title}</legend>{children}</fieldset>; }
function ChoiceButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" aria-pressed={selected} onClick={onClick} className={`rounded-2xl px-3 py-3 font-bold transition ${selected ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "bg-slate-100 text-slate-700 hover:bg-orange-100"}`}>{children}</button>; }
function Stat({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-white/10 px-4 py-3 text-center"><div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div><div className="mt-1 font-black">{value}</div></div>; }
function Panel({ title, items }: { title: string; items: string[] }) { return <div className="rounded-2xl bg-white/10 p-5"><h3 className="text-lg font-bold">{title}</h3><ul className="mt-3 space-y-2 text-slate-200">{items.map((item, index) => <li key={`${item}-${index}`}>• {item}</li>)}</ul></div>; }
