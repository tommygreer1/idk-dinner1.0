"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const restaurants = [
  { name: "Mexican Night", category: "Mexican", price: "$", rating: 4.7, emoji: "🌮" },
  { name: "Local BBQ Joint", category: "BBQ", price: "$$", rating: 4.8, emoji: "🍖" },
  { name: "Pizza & Wings", category: "Pizza", price: "$", rating: 4.5, emoji: "🍕" },
  { name: "Steakhouse", category: "Steak", price: "$$$", rating: 4.6, emoji: "🥩" },
  { name: "Chinese Takeout", category: "Asian", price: "$", rating: 4.4, emoji: "🥡" },
  { name: "Family Diner", category: "American", price: "$", rating: 4.3, emoji: "🍔" },
];

export default function EatOutPage() {
  const [category, setCategory] = useState("Anything");
  const [price, setPrice] = useState("Any");
  const [openNow, setOpenNow] = useState(true);
  const [pick, setPick] = useState<(typeof restaurants)[number] | null>(null);
  const [locationText, setLocationText] = useState("Near me");

  const choices = useMemo(() => {
    const filtered = restaurants.filter((restaurant) => {
      const categoryMatch = category === "Anything" || restaurant.category === category;
      const priceMatch = price === "Any" || restaurant.price === price;
      return categoryMatch && priceMatch;
    });
    return filtered.length ? filtered : restaurants;
  }, [category, price]);

  function chooseRestaurant() {
    setPick(choices[Math.floor(Math.random() * choices.length)]);
  }

  function useLocation() {
    if (!navigator.geolocation) return setLocationText("Location unavailable");
    setLocationText("Finding you...");
    navigator.geolocation.getCurrentPosition(
      () => setLocationText("Using your location"),
      () => setLocationText("Location blocked"),
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-slate-200">← Back home</Link>

        <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-blue-100 sm:p-9">
          <div className="text-center">
            <div className="text-6xl">🍔</div>
            <h1 className="mt-3 text-4xl font-black sm:text-5xl">Eat Out</h1>
            <p className="mt-3 text-lg text-slate-600">Set a few filters or let IDK Dinner choose.</p>
          </div>

          <button onClick={useLocation} className="mt-8 w-full rounded-2xl bg-slate-100 px-4 py-3 font-bold hover:bg-blue-100">📍 {locationText}</button>

          <div className="mt-8 space-y-7">
            <Picker title="What sounds good?" options={["Anything", "Mexican", "BBQ", "Pizza", "Steak", "Asian", "American"]} value={category} setValue={setCategory} />
            <Picker title="Price" options={["Any", "$", "$$", "$$$"]} value={price} setValue={setPrice} />

            <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 font-bold">
              Open now
              <input type="checkbox" checked={openNow} onChange={(e) => setOpenNow(e.target.checked)} className="h-5 w-5 accent-blue-500" />
            </label>

            <button onClick={chooseRestaurant} className="w-full rounded-2xl bg-blue-500 px-6 py-4 text-xl font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-600">🎲 Pick a Restaurant</button>
          </div>
        </section>

        {pick && (
          <section className="mt-8 rounded-3xl bg-slate-950 p-7 text-white shadow-2xl">
            <div className="text-6xl">{pick.emoji}</div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[.2em] text-blue-300">Tonight's pick</p>
            <h2 className="mt-2 text-4xl font-black">{pick.name}</h2>
            <p className="mt-3 text-slate-300">{pick.category} · {pick.price} · ⭐ {pick.rating} {openNow ? "· Open now" : ""}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a target="_blank" rel="noreferrer" href={`https://www.google.com/maps/search/${encodeURIComponent(pick.category + " restaurants near me")}`} className="rounded-2xl bg-white px-5 py-3 text-center font-bold text-slate-950">View nearby options</a>
              <button onClick={chooseRestaurant} className="rounded-2xl bg-white/10 px-5 py-3 font-bold hover:bg-white/20">Pick again</button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Picker({ title, options, value, setValue }: { title: string; options: string[]; value: string; setValue: (value: string) => void }) {
  return <fieldset><legend className="mb-3 text-lg font-extrabold">{title}</legend><div className="flex flex-wrap gap-3">{options.map((option) => <button type="button" key={option} onClick={() => setValue(option)} className={`rounded-full px-4 py-2 font-bold ${value === option ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-blue-100"}`}>{option}</button>)}</div></fieldset>;
}
