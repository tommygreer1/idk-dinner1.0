"use client";

import Link from "next/link";
import IdkDinnerLogo from "@/components/IdkDinnerLogo";
import { useState } from "react";

type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  lat: number;
  lon: number;
  website: string;
  phone: string;
  mapsUrl: string;
};

const categories = ["Anything", "Mexican", "BBQ", "Pizza", "Steak", "Asian", "American", "Breakfast", "Burgers", "Italian", "Wings"];

export default function EatOutPage() {
  const [category, setCategory] = useState("Anything");
  const [radius, setRadius] = useState(10);
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationText, setLocationText] = useState("Use my current location");
  const [pick, setPick] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
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

  async function chooseRestaurant() {
    if (!coords && !city.trim()) {
      setError("Use your location or enter a city or ZIP code first.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/free-restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: coords?.latitude,
          longitude: coords?.longitude,
          city,
          radiusMiles: radius,
          category,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "A restaurant could not be chosen.");
      setPick(data);
      window.setTimeout(() => document.getElementById("restaurant-result")?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "A restaurant could not be chosen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-slate-200">← Back home</Link>

        <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-blue-100 sm:p-9">
          <div className="mx-auto w-full max-w-sm">
            <IdkDinnerLogo className="h-auto w-full" />
          </div>
          <div className="mt-5 text-center">
            <p className="text-sm font-black uppercase tracking-[.25em] text-blue-500">Real random restaurant</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">IDK Where to Eat</h1>
            <p className="mt-3 text-lg text-slate-600">We search nearby places and choose one actual restaurant for you.</p>
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

            <fieldset>
              <legend className="mb-3 text-lg font-extrabold">How far will you drive? {radius} miles</legend>
              <input aria-label="Restaurant distance" type="range" min="2" max="30" step="1" value={radius} onChange={(event) => setRadius(Number(event.target.value))} className="w-full accent-blue-500" />
            </fieldset>

            {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}

            <button type="button" onClick={chooseRestaurant} disabled={loading} className="w-full rounded-2xl bg-blue-500 px-6 py-4 text-xl font-black text-white shadow-lg shadow-blue-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "IDK is picking one..." : "🎲 Pick a Restaurant"}
            </button>
          </div>
        </section>

        {pick && (
          <section id="restaurant-result" className="mt-8 rounded-3xl bg-slate-950 p-7 text-white shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-blue-300">Tonight&apos;s pick</p>
            <h2 className="mt-2 text-4xl font-black">{pick.name}</h2>
            <p className="mt-3 text-lg capitalize text-slate-300">{pick.cuisine?.replaceAll(";", " · ") || category}</p>
            {pick.address && <p className="mt-2 text-slate-400">{pick.address}</p>}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a target="_blank" rel="noreferrer" href={pick.mapsUrl} className="rounded-2xl bg-white px-5 py-3 text-center font-bold text-slate-950">Directions</a>
              <button type="button" onClick={chooseRestaurant} disabled={loading} className="rounded-2xl bg-white/10 px-5 py-3 font-bold hover:bg-white/20">Pick another</button>
              {pick.website && <a target="_blank" rel="noreferrer" href={pick.website} className="rounded-2xl bg-blue-500 px-5 py-3 text-center font-bold sm:col-span-2">Restaurant website</a>}
              {pick.phone && <a href={`tel:${pick.phone}`} className="rounded-2xl bg-white/10 px-5 py-3 text-center font-bold sm:col-span-2">Call {pick.phone}</a>}
            </div>
            <p className="mt-4 text-xs text-slate-500">Restaurant data comes from the free OpenStreetMap community database, so some places may have limited details.</p>
          </section>
        )}
      </div>
    </main>
  );
}

function Picker({ title, options, value, setValue }: { title: string; options: string[]; value: string; setValue: (value: string) => void }) {
  return <fieldset><legend className="mb-3 text-lg font-extrabold">{title}</legend><div className="flex flex-wrap gap-3">{options.map((option) => <button type="button" key={option} onClick={() => setValue(option)} className={`rounded-full px-4 py-2 font-bold ${value === option ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-700 hover:bg-blue-100"}`}>{option}</button>)}</div></fieldset>;
}
