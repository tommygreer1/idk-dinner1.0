"use client";

import Link from "next/link";
import { useState } from "react";

const categories = ["Anything", "Mexican", "BBQ", "Pizza", "Steak", "Asian", "American", "Breakfast", "Burgers", "Italian", "Wings"];
const priceWords: Record<string, string> = {
  Any: "",
  $: "cheap",
  $$: "moderately priced",
  $$$: "upscale",
};

export default function EatOutPage() {
  const [category, setCategory] = useState("Anything");
  const [maxPrice, setMaxPrice] = useState("Any");
  const [openNow, setOpenNow] = useState(true);
  const [radius, setRadius] = useState(10);
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationText, setLocationText] = useState("Use my current location");
  const [chosenCategory, setChosenCategory] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [error, setError] = useState("");

  function useLocation() {
    if (!navigator.geolocation) {
      setError("This device does not support location. Enter a city or ZIP code instead.");
      return;
    }

    setError("");
    setLocationText("Finding your location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationText("Location ready");
      },
      () => {
        setLocationText("Location blocked");
        setError("Location was blocked. Enter a city or ZIP code below instead.");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function chooseRestaurantSearch() {
    if (!coords && !city.trim()) {
      setError("Use your location or enter a city or ZIP code first.");
      return;
    }

    setError("");
    const categoryPool = categories.filter((item) => item !== "Anything");
    const finalCategory = category === "Anything"
      ? categoryPool[Math.floor(Math.random() * categoryPool.length)]
      : category;
    const priceText = priceWords[maxPrice];
    const openText = openNow ? "open now" : "";
    const locationText = city.trim() || `${coords?.latitude},${coords?.longitude}`;
    const query = [priceText, finalCategory, "restaurants", openText, `within ${radius} miles of ${locationText}`]
      .filter(Boolean)
      .join(" ");

    setChosenCategory(finalCategory);
    setMapsUrl(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
    window.setTimeout(() => document.getElementById("restaurant-result")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-slate-200">← Back home</Link>

        <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-blue-100 sm:p-9">
          <div className="text-center">
            <div className="text-6xl">📍</div>
            <p className="mt-4 text-sm font-black uppercase tracking-[.25em] text-blue-500">Free nearby search</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">IDK Where to Eat</h1>
            <p className="mt-3 text-lg text-slate-600">IDK chooses what kind of restaurant to look for, then opens real nearby choices in Google Maps.</p>
          </div>

          <button type="button" onClick={useLocation} className={`mt-8 w-full rounded-2xl px-4 py-4 font-bold transition ${coords ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 hover:bg-blue-100"}`}>📍 {locationText}</button>

          <div className="mt-4 text-center text-sm font-bold text-slate-400">or</div>

          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Enter city or ZIP code"
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
          />

          <div className="mt-8 space-y-7">
            <Picker title="What sounds good?" options={categories} value={category} setValue={setCategory} />
            <Picker title="Price" options={["Any", "$", "$$", "$$$"]} value={maxPrice} setValue={setMaxPrice} />

            <fieldset>
              <legend className="mb-3 text-lg font-extrabold">How far will you drive? {radius} miles</legend>
              <input aria-label="Restaurant distance" type="range" min="2" max="30" step="1" value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="w-full accent-blue-500" />
            </fieldset>

            <label className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 font-bold">
              Only places open now
              <input type="checkbox" checked={openNow} onChange={(event) => setOpenNow(event.target.checked)} className="h-5 w-5 accent-blue-500" />
            </label>

            {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}

            <button type="button" onClick={chooseRestaurantSearch} className="w-full rounded-2xl bg-blue-500 px-6 py-4 text-xl font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-600">🎲 IDK — Pick for Me</button>
          </div>
        </section>

        {mapsUrl && (
          <section id="restaurant-result" className="mt-8 rounded-3xl bg-slate-950 p-7 text-white shadow-2xl">
            <div className="text-6xl">🍽️</div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[.2em] text-blue-300">IDK says</p>
            <h2 className="mt-2 text-4xl font-black">Go get {chosenCategory}</h2>
            <p className="mt-3 text-slate-300">We built a nearby Google Maps search using your location, price, distance, and open-now preference.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a target="_blank" rel="noreferrer" href={mapsUrl} className="rounded-2xl bg-white px-5 py-3 text-center font-bold text-slate-950">Show Nearby Restaurants</a>
              <button type="button" onClick={chooseRestaurantSearch} className="rounded-2xl bg-white/10 px-5 py-3 font-bold hover:bg-white/20">Pick another type</button>
            </div>
            <p className="mt-4 text-xs text-slate-500">This free version opens live Google Maps results instead of charging us for restaurant data.</p>
          </section>
        )}
      </div>
    </main>
  );
}

function Picker({ title, options, value, setValue }: { title: string; options: string[]; value: string; setValue: (value: string) => void }) {
  return <fieldset><legend className="mb-3 text-lg font-extrabold">{title}</legend><div className="flex flex-wrap gap-3">{options.map((option) => <button type="button" key={option} onClick={() => setValue(option)} className={`rounded-full px-4 py-2 font-bold ${value === option ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-blue-100"}`}>{option}</button>)}</div></fieldset>;
}
