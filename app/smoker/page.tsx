"use client";

import Link from "next/link";
import { useState } from "react";

const meats = {
  "Pork Butt": { emoji: "🐖", temp: "250°F", pull: "200–205°F", hours: "8–12 hours", wrap: "Wrap around 165°F", sides: ["Slaw", "Baked beans", "Cornbread"], leftovers: ["Tacos", "Loaded potatoes", "Quesadillas"] },
  Brisket: { emoji: "🥩", temp: "225–250°F", pull: "200–205°F", hours: "10–14 hours", wrap: "Wrap when bark is set, around 165°F", sides: ["Mac & cheese", "Beans", "Pickles"], leftovers: ["Brisket grilled cheese", "Breakfast hash", "Nachos"] },
  Ribs: { emoji: "🍖", temp: "250°F", pull: "Tender with a clean bite", hours: "4–6 hours", wrap: "Optional after 2–3 hours", sides: ["Potato salad", "Corn", "Slaw"], leftovers: ["Rib sandwiches", "BBQ pizza", "Loaded fries"] },
  Chicken: { emoji: "🍗", temp: "275–300°F", pull: "165°F breast / 175°F thigh", hours: "2–4 hours", wrap: "No wrap needed", sides: ["Rice", "Green beans", "Mac & cheese"], leftovers: ["Chicken Alfredo", "Wraps", "Fried rice"] },
  Turkey: { emoji: "🦃", temp: "275°F", pull: "165°F", hours: "3–5 hours", wrap: "Tent while resting", sides: ["Mashed potatoes", "Dressing", "Green beans"], leftovers: ["Turkey melts", "Soup", "Turkey bowls"] },
};

type MeatName = keyof typeof meats;

export default function SmokerPage() {
  const [selected, setSelected] = useState<MeatName>("Pork Butt");
  const [weight, setWeight] = useState(8);
  const guide = meats[selected];

  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 via-white to-orange-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-slate-200">← Back home</Link>
        <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-red-100 sm:p-9">
          <div className="text-center"><div className="text-6xl">🔥</div><h1 className="mt-3 text-4xl font-black sm:text-5xl">Smoker Mode</h1><p className="mt-3 text-lg text-slate-600">Pick a meat and get a simple cook plan plus leftover meals.</p></div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {(Object.keys(meats) as MeatName[]).map((meat) => <button key={meat} onClick={() => setSelected(meat)} className={`rounded-2xl px-3 py-4 font-bold ${selected === meat ? "bg-red-500 text-white shadow-lg shadow-red-200" : "bg-slate-100 hover:bg-red-100"}`}>{meats[meat].emoji}<span className="mt-1 block text-sm">{meat}</span></button>)}
          </div>

          <label className="mt-8 block text-lg font-extrabold">Approximate weight: {weight} lb</label>
          <input type="range" min="3" max="20" value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="mt-3 w-full accent-red-500" />
        </section>

        <section className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-2xl sm:p-9">
          <div className="text-6xl">{guide.emoji}</div><p className="mt-4 text-sm font-bold uppercase tracking-[.2em] text-red-300">Your cook plan</p><h2 className="mt-2 text-4xl font-black">{selected}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label="Smoker temperature" value={guide.temp} /><Info label="Target internal temp" value={guide.pull} /><Info label="Typical cook time" value={guide.hours} /><Info label="Wrap plan" value={guide.wrap} />
          </div>
          <div className="mt-6 rounded-2xl bg-white/10 p-5"><h3 className="text-lg font-bold">⏰ Rough timing note</h3><p className="mt-2 text-slate-300">A {weight} lb cook can vary a lot. Start early, cook to tenderness and internal temperature, then allow at least 30–60 minutes to rest.</p></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><List title="🍽️ Good sides" items={guide.sides} /><List title="♻️ Leftover meals" items={guide.leftovers} /></div>
        </section>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-white/10 p-4"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-2 text-xl font-black">{value}</p></div>; }
function List({ title, items }: { title: string; items: string[] }) { return <div className="rounded-2xl bg-white/10 p-5"><h3 className="font-bold">{title}</h3><ul className="mt-3 space-y-2 text-slate-300">{items.map((item) => <li key={item}>• {item}</li>)}</ul></div>; }
