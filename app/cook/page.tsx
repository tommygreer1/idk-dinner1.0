"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Meal = {
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

type MealPart = {
  name: string;
  emoji: string;
  keywords: string[];
  cost: number;
  time: number;
};

const equipmentOptions = ["Stove", "Oven", "Grill", "Smoker", "Air Fryer", "Crockpot", "Griddle"];

const proteins: MealPart[] = [
  { name: "chicken", emoji: "🍗", keywords: ["chicken"], cost: 10, time: 25 },
  { name: "ground beef", emoji: "🍔", keywords: ["beef", "hamburger", "ground beef"], cost: 12, time: 20 },
  { name: "pork", emoji: "🐷", keywords: ["pork", "sausage", "ham"], cost: 11, time: 30 },
  { name: "turkey", emoji: "🦃", keywords: ["turkey"], cost: 10, time: 22 },
  { name: "black beans", emoji: "🫘", keywords: ["beans", "black beans"], cost: 4, time: 15 },
  { name: "eggs", emoji: "🍳", keywords: ["egg", "eggs"], cost: 5, time: 15 },
];

const formats = [
  { name: "Rice Bowls", base: "rice", equipment: ["Stove"], time: 25 },
  { name: "Tacos", base: "tortillas", equipment: ["Stove", "Griddle", "Grill"], time: 25 },
  { name: "Loaded Baked Potatoes", base: "potatoes", equipment: ["Oven", "Air Fryer"], time: 40 },
  { name: "Sheet-Pan Dinner", base: "potatoes and vegetables", equipment: ["Oven"], time: 40 },
  { name: "Skillet Dinner", base: "rice or potatoes", equipment: ["Stove", "Griddle"], time: 30 },
  { name: "Pasta Bake", base: "pasta", equipment: ["Oven", "Stove"], time: 45 },
  { name: "Quesadillas", base: "tortillas and cheese", equipment: ["Stove", "Griddle"], time: 20 },
  { name: "BBQ Plates", base: "potatoes or baked beans", equipment: ["Grill", "Smoker", "Oven"], time: 50 },
  { name: "Slow-Cooker Bowls", base: "rice or tortillas", equipment: ["Crockpot"], time: 90 },
];

const flavors = [
  { name: "Honey BBQ", ingredients: ["BBQ sauce", "honey"], avoid: ["bbq"] },
  { name: "Taco", ingredients: ["taco seasoning", "salsa"], avoid: ["mexican", "taco"] },
  { name: "Garlic Parmesan", ingredients: ["garlic", "parmesan"], avoid: ["garlic", "parmesan", "cheese"] },
  { name: "Ranch Cheddar", ingredients: ["ranch seasoning", "cheddar"], avoid: ["ranch", "cheese"] },
  { name: "Teriyaki", ingredients: ["teriyaki sauce"], avoid: ["asian", "teriyaki", "soy"] },
  { name: "Smoky Cajun", ingredients: ["cajun seasoning"], avoid: ["spicy", "cajun"] },
  { name: "Classic Homestyle", ingredients: ["onion", "garlic", "seasoning"], avoid: [] },
];

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

export default function CookPage() {
  const [people, setPeople] = useState("4");
  const [budget, setBudget] = useState(30);
  const [time, setTime] = useState(45);
  const [equipment, setEquipment] = useState<string[]>(["Stove", "Oven"]);
  const [avoid, setAvoid] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState<Meal | null>(null);

  const normalizedIngredients = useMemo(() => ingredients.toLowerCase(), [ingredients]);
  const normalizedAvoid = useMemo(() => avoid.toLowerCase(), [avoid]);

  function toggleEquipment(item: string) {
    setEquipment((current) => current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
  }

  function findDinner() {
    const preferredProteins = proteins.filter((protein) => includesAny(normalizedIngredients, protein.keywords));
    const safeProteins = proteins.filter((protein) => !includesAny(normalizedAvoid, protein.keywords));
    const proteinPool = preferredProteins.filter((protein) => safeProteins.includes(protein));
    const protein = pickRandom(proteinPool.length ? proteinPool : safeProteins.length ? safeProteins : proteins);

    const matchingFormats = formats.filter((format) =>
      format.equipment.some((item) => equipment.includes(item)) && format.time <= time,
    );
    const mealFormat = pickRandom(matchingFormats.length ? matchingFormats : formats.filter((format) => format.equipment.some((item) => equipment.includes(item))));

    const safeFlavors = flavors.filter((flavor) => !includesAny(normalizedAvoid, flavor.avoid));
    const flavor = pickRandom(safeFlavors.length ? safeFlavors : flavors);

    const scale = people === "5+" ? 1.35 : people === "2" ? 0.75 : people === "3" ? 0.9 : 1;
    const estimatedCost = Math.min(budget, Math.max(12, Math.round((protein.cost + 9) * scale)));
    const timeMinutes = Math.min(time, Math.max(protein.time, mealFormat.time));
    const coreIngredients = [protein.name, mealFormat.base, ...flavor.ingredients, "one easy vegetable", "oil or butter", "salt and pepper"];
    const owned = normalizedIngredients.split(",").map((item) => item.trim()).filter(Boolean);
    const missingGroceries = coreIngredients.filter((item) => !owned.some((ownedItem) => item.includes(ownedItem) || ownedItem.includes(item)));

    setResult({
      name: `${flavor.name} ${protein.name.replace(/\b\w/g, (letter) => letter.toUpperCase())} ${mealFormat.name}`,
      emoji: protein.emoji,
      description: `A practical ${mealFormat.name.toLowerCase()} built around ${protein.name}, ${flavor.name.toLowerCase()} flavor, and what you already have at home.`,
      timeMinutes,
      estimatedCost,
      ingredients: coreIngredients,
      missingGroceries,
      substitutions: [
        `Swap ${protein.name} for another protein you already have.`,
        `Use frozen or canned vegetables instead of fresh.`,
        `Use a similar sauce or seasoning already in the pantry.`,
      ],
      instructions: [
        `Prepare the ${protein.name} using your ${mealFormat.equipment.find((item) => equipment.includes(item)) || equipment[0] || "stove"} and season it with the ${flavor.name.toLowerCase()} ingredients.`,
        `Cook or warm the ${mealFormat.base}.`,
        "Cook the vegetable until tender, then combine everything.",
        "Taste, adjust seasoning, and serve family-style.",
      ],
      leftoverIdea: `Save the extra ${protein.name} and turn it into wraps, nachos, sandwiches, or lunch bowls tomorrow.`,
    });

    window.setTimeout(() => document.getElementById("dinner-result")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="mb-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold shadow-sm ring-1 ring-slate-200">← Back home</Link>

        <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-orange-100 sm:p-9">
          <div className="text-center">
            <div className="text-6xl">✨</div>
            <p className="mt-4 text-sm font-black uppercase tracking-[.25em] text-orange-500">Free smart meal maker</p>
            <h1 className="mt-2 text-4xl font-black sm:text-5xl">Make Tonight&apos;s Meal</h1>
            <p className="mt-3 text-lg text-slate-600">IDK combines your budget, time, equipment, ingredients, and dislikes into a fresh dinner choice.</p>
          </div>

          <div className="mt-9 space-y-8">
            <Question title="How many people are eating?">
              <div className="grid grid-cols-4 gap-3">{["2", "3", "4", "5+"].map((option) => <ChoiceButton key={option} selected={people === option} onClick={() => setPeople(option)}>{option}</ChoiceButton>)}</div>
            </Question>
            <Question title={`Budget: up to $${budget}`}><input aria-label="Dinner budget" type="range" min="15" max="100" step="5" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="w-full accent-orange-500" /></Question>
            <Question title={`Time available: ${time} minutes`}><input aria-label="Cooking time" type="range" min="20" max="120" step="5" value={time} onChange={(e) => setTime(Number(e.target.value))} className="w-full accent-orange-500" /></Question>
            <Question title="What can you cook with?"><div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{equipmentOptions.map((item) => <ChoiceButton key={item} selected={equipment.includes(item)} onClick={() => toggleEquipment(item)}>{item}</ChoiceButton>)}</div></Question>
            <Question title="What do you already have?"><textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} placeholder="Chicken, rice, cheese, broccoli..." rows={3} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" /></Question>
            <Question title="Anything to avoid?"><input value={avoid} onChange={(e) => setAvoid(e.target.value)} placeholder="Allergies, dislikes, seafood, mushrooms..." className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100" /></Question>
            <button type="button" disabled={equipment.length === 0} onClick={findDinner} className="w-full rounded-2xl bg-orange-500 px-6 py-4 text-xl font-black text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60">✨ Create My Dinner</button>
          </div>
        </section>

        {result && (
          <section id="dinner-result" className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-2xl sm:p-9">
            <div className="text-6xl">{result.emoji}</div>
            <p className="mt-4 text-sm font-bold uppercase tracking-[.2em] text-orange-300">Tonight&apos;s smart pick</p>
            <h2 className="mt-2 text-3xl font-black sm:text-4xl">{result.name}</h2>
            <p className="mt-3 text-slate-300">{result.description}</p>
            <div className="mt-5 flex gap-3"><Stat label="Time" value={`${result.timeMinutes} min`} /><Stat label="Est. cost" value={`$${result.estimatedCost}`} /></div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2"><Panel title="🥘 Ingredients" items={result.ingredients} /><Panel title="🛒 Missing groceries" items={result.missingGroceries.length ? result.missingGroceries : ["Nothing extra needed"]} /></div>
            <div className="mt-5 rounded-2xl bg-white/10 p-5"><h3 className="text-lg font-bold">👨‍🍳 Simple directions</h3><ol className="mt-3 space-y-3 text-slate-200">{result.instructions.map((step, index) => <li key={`${step}-${index}`}><strong>{index + 1}.</strong> {step}</li>)}</ol></div>
            <div className="mt-5 grid gap-5 sm:grid-cols-2"><Panel title="🔁 Easy substitutions" items={result.substitutions} /><div className="rounded-2xl bg-white/10 p-5"><h3 className="text-lg font-bold">♻️ Leftover plan</h3><p className="mt-3 text-slate-200">{result.leftoverIdea}</p></div></div>
            <button type="button" onClick={findDinner} className="mt-6 w-full rounded-2xl bg-white px-5 py-3 font-bold text-slate-950 hover:bg-orange-100">Make a Different Meal</button>
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
