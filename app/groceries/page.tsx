"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Item = { id: number; name: string; category: string; checked: boolean };
const categories = ["Produce", "Meat", "Dairy", "Pantry", "Frozen", "Bakery", "Other"];

export default function GroceriesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Produce");

  useEffect(() => {
    const saved = localStorage.getItem("idk-groceries");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("idk-groceries", JSON.stringify(items));
  }, [items]);

  const grouped = useMemo(() => categories.map((cat) => ({ cat, items: items.filter((item) => item.category === cat) })).filter((group) => group.items.length), [items]);

  function addItem() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setItems((current) => [...current, { id: Date.now(), name: trimmed, category, checked: false }]);
    setName("");
  }

  function addStarterList() {
    const starter = [
      ["Chicken breast", "Meat"], ["Ground beef", "Meat"], ["Rice", "Pantry"], ["Tortillas", "Bakery"],
      ["Bell peppers", "Produce"], ["Onions", "Produce"], ["Shredded cheese", "Dairy"], ["Frozen fries", "Frozen"],
    ];
    setItems(starter.map(([itemName, cat], index) => ({ id: Date.now() + index, name: itemName, category: cat, checked: false })));
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-slate-200">← Back home</Link>
        <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-emerald-100 sm:p-9">
          <div className="text-center"><div className="text-6xl">🛒</div><h1 className="mt-3 text-4xl font-black sm:text-5xl">Grocery List</h1><p className="mt-3 text-lg text-slate-600">Add items, organize by department, and check them off in the store.</p></div>

          <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_160px_auto]">
            <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addItem()} placeholder="Add an item..." className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold">{categories.map((cat) => <option key={cat}>{cat}</option>)}</select>
            <button onClick={addItem} className="rounded-2xl bg-emerald-500 px-5 py-3 font-black text-white hover:bg-emerald-600">Add</button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={addStarterList} className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-900">Load starter list</button>
            <button onClick={() => setItems((current) => current.filter((item) => !item.checked))} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold">Clear checked</button>
            <button onClick={() => setItems([])} className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700">Clear all</button>
          </div>
        </section>

        <section className="mt-8 space-y-5">
          {grouped.length === 0 ? <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-lg">Your list is empty. Add an item or load the starter list.</div> : grouped.map(({ cat, items: groupItems }) => (
            <div key={cat} className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100">
              <h2 className="text-xl font-black">{cat}</h2>
              <div className="mt-4 space-y-3">{groupItems.map((item) => (
                <label key={item.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                  <input type="checkbox" checked={item.checked} onChange={() => setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, checked: !entry.checked } : entry))} className="h-5 w-5 accent-emerald-500" />
                  <span className={`flex-1 font-semibold ${item.checked ? "text-slate-400 line-through" : ""}`}>{item.name}</span>
                  <button type="button" onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))} className="text-slate-400 hover:text-red-500">✕</button>
                </label>
              ))}</div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
