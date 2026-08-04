"use client";

import Link from "next/link";
import { useState } from "react";

type Person = { id: number; name: string; likes: string; dislikes: string };

export default function ProfilesPage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState("");
  const [likes, setLikes] = useState("");
  const [dislikes, setDislikes] = useState("");

  function addPerson() {
    if (!name.trim()) return;
    setPeople((current) => [...current, { id: Date.now(), name: name.trim(), likes, dislikes }]);
    setName("");
    setLikes("");
    setDislikes("");
  }

  return (
    <main className="min-h-screen bg-violet-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-slate-200">← Back home</Link>
        <section className="rounded-3xl bg-white p-6 shadow-xl sm:p-9">
          <div className="text-center">
            <div className="text-6xl">👨‍👩‍👧‍👦</div>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">Family Profiles</h1>
            <p className="mt-3 text-lg text-slate-600">Add simple food preferences for each person.</p>
          </div>
          <div className="mt-8 grid gap-4">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <input value={likes} onChange={(e) => setLikes(e.target.value)} placeholder="Likes: tacos, BBQ, pasta..." className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <input value={dislikes} onChange={(e) => setDislikes(e.target.value)} placeholder="Dislikes: fish, mushrooms..." className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
            <button onClick={addPerson} className="rounded-2xl bg-violet-500 px-5 py-4 text-lg font-black text-white hover:bg-violet-600">Add Person</button>
          </div>
        </section>

        <section className="mt-8 grid gap-5 sm:grid-cols-2">
          {people.length === 0 ? (
            <div className="sm:col-span-2 rounded-3xl bg-white p-10 text-center text-slate-500 shadow-lg">No profiles yet.</div>
          ) : people.map((person) => (
            <article key={person.id} className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex justify-between gap-4">
                <h2 className="text-2xl font-black">🙂 {person.name}</h2>
                <button onClick={() => setPeople((current) => current.filter((item) => item.id !== person.id))} className="text-slate-400 hover:text-red-500">✕</button>
              </div>
              <p className="mt-4 rounded-2xl bg-emerald-50 p-3"><strong>Likes:</strong> {person.likes || "Not added"}</p>
              <p className="mt-3 rounded-2xl bg-red-50 p-3"><strong>Dislikes:</strong> {person.dislikes || "Not added"}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
