"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Meal = {
  name: string;
  emoji: string;
  time: number;
  cost: number;
  equipment: string[];
  description: string;
  groceries: string[];
  leftoverIdea: string;
};

const meals: Meal[] = [
  {
    name: "Honey BBQ Chicken Bowls",
    emoji: "🍗",
    time: 30,
    cost: 22,
    equipment: ["Stove", "Grill", "Oven"],
    description:
      "Seasoned chicken over rice with roasted vegetables and honey BBQ sauce.",
    groceries: ["Chicken breast", "Rice", "Bell peppers", "Broccoli", "BBQ sauce"],
    leftoverIdea: "Use the extra chicken in wraps or quesadillas tomorrow.",
  },
  {
    name: "Smoked Pulled Pork Tacos",
    emoji: "🌮",
    time: 60,
    cost: 28,
    equipment: ["Smoker", "Oven"],
    description:
      "Tender pulled pork with tortillas, slaw, lime, and a smoky sauce.",
    groceries: ["Pork shoulder", "Tortillas", "Slaw mix", "Limes", "Salsa"],
    leftoverIdea: "Turn the extra pork into loaded baked potatoes later this week.",
  },
  {
    name: "Cheeseburger Rice Bowls",
    emoji: "🍔",
    time: 25,
    cost: 18,
    equipment: ["Stove", "Griddle"],
    description:
      "Ground beef, seasoned rice, cheese, pickles, lettuce, and burger sauce.",
    groceries: ["Ground beef", "Rice", "Cheddar", "Pickles", "Lettuce"],
    leftoverIdea: "Use the leftover beef for tacos or hamburger steaks.",
  },
  {
    name: "Air Fryer Chicken Parmesan",
    emoji: "🍝",
    time: 35,
    cost: 24,
    equipment: ["Air Fryer", "Oven"],
    description:
      "Crispy chicken topped with marinara and mozzarella, served with pasta or salad.",
    groceries: ["Chicken breast", "Breadcrumbs", "Marinara", "Mozzarella", "Pasta"],
    leftoverIdea: "Slice extra chicken for sandwiches or Caesar salads.",
  },
  {
    name: "Slow Cooker Salsa Chicken",
    emoji: "🥣",
    time: 60,
    cost: 17,
    equipment: ["Crockpot"],
    description:
      "Simple shredded salsa chicken for rice bowls, tacos, or salads.",
    groceries: ["Chicken thighs", "Salsa", "Black beans", "Corn", "Rice"],
    leftoverIdea: "Use the remaining chicken for nachos or burritos.",
  },
  {
    name: "Grilled Steak Fajitas",
    emoji: "🥩",
    time: 40,
    cost: 38,
    equipment: ["Grill", "Stove"],
    description:
      "Grilled steak with peppers and onions, warm tortillas, and fresh toppings.",
    groceries: ["Steak", "Bell peppers", "Onion", "Tortillas", "Sour cream"],
    leftoverIdea: "Use leftover steak in breakfast hash or steak quesadillas.",
  },
];

const equipmentOptions = ["Stove", "Oven", "Grill", "Smoker", "Air Fryer", "Crockpot", "Griddle"];

export default function CookPage() {
  const [people, setPeople] = useState("4");
  const [budget, setBudget] = useState(30);
  const [time, setTime] = useState(45);
  const [equipment, setEquipment] = useState<string[]>(["Stove", "Oven"]);
  const [avoid, setAvoid] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [resultIndex, setResultIndex] = useState<number | null>(null);

  const matches = useMemo(() => {
    const filtered = meals.filter((meal) => {
      const equipmentMatch = meal.equipment.some((item) => equipment.includes(item));
      return equipmentMatch && meal.cost <= budget && meal.time <= time;
    });

    return filtered.length > 0 ? filtered : meals;
  }, [budget, equipment, time]);

  const result = resultIndex === null ? null : matches[resultIndex % matches.length];

  function toggleEquipment(item: string) {
    setEquipment((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  }

  function findDinner() {
    const nextIndex = Math.floor(Math.random() * matches.length);
    setResultIndex(nextIndex);
    window.setTimeout(() => {
      document.getElementById("dinner-result")?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          ← Back home
        </Link>

        <section className="rounded-3xl bg-white p-6 shadow-xl ring-1 ring-orange-100 sm:p-9">
          <div className="mb-8 text-center">
            <div className="mb-3 text-6xl">🍳</div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Cook Tonight</h1>
            <p className="mt-3 text-lg text-slate-600">
              Tell us what tonight looks like. We’ll narrow down dinner in seconds.
            </p>
          </div>

          <div className="space-y-8">
            <Question title="How many people are eating?">
              <div className="grid grid-cols-4 gap-3">
                {["2", "3", "4", "5+"].map((option) => (
                  <ChoiceButton
                    key={option}
                    selected={people === option}
                    onClick={() => setPeople(option)}
                  >
                    {option}
                  </ChoiceButton>
                ))}
              </div>
            </Question>

            <Question title={`What is tonight's budget? Up to $${budget}`}>
              <input
                aria-label="Dinner budget"
                type="range"
                min="15"
                max="75"
                step="5"
                value={budget}
                onChange={(event) => setBudget(Number(event.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="mt-2 flex justify-between text-sm text-slate-500">
                <span>$15</span>
                <span>$75</span>
              </div>
            </Question>

            <Question title={`How much time do you have? ${time} minutes`}>
              <input
                aria-label="Available cooking time"
                type="range"
                min="20"
                max="120"
                step="5"
                value={time}
                onChange={(event) => setTime(Number(event.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="mt-2 flex justify-between text-sm text-slate-500">
                <span>20 min</span>
                <span>2 hours</span>
              </div>
            </Question>

            <Question title="What can you cook with tonight?">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {equipmentOptions.map((item) => (
                  <ChoiceButton
                    key={item}
                    selected={equipment.includes(item)}
                    onClick={() => toggleEquipment(item)}
                  >
                    {item}
                  </ChoiceButton>
                ))}
              </div>
            </Question>

            <Question title="Anything you absolutely do not want?">
              <input
                value={avoid}
                onChange={(event) => setAvoid(event.target.value)}
                placeholder="Example: fish, pasta, mushrooms..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </Question>

            <Question title="What ingredients do you already have?">
              <textarea
                value={ingredients}
                onChange={(event) => setIngredients(event.target.value)}
                placeholder="Example: chicken, rice, cheese, broccoli..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
            </Question>

            <button
              type="button"
              onClick={findDinner}
              className="w-full rounded-2xl bg-orange-500 px-6 py-4 text-xl font-black text-white shadow-lg shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 active:translate-y-0"
            >
              🎲 Find Dinner
            </button>
          </div>
        </section>

        {result && (
          <section
            id="dinner-result"
            className="mt-8 rounded-3xl bg-slate-950 p-6 text-white shadow-2xl sm:p-9"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-6xl">{result.emoji}</div>
                <p className="mt-4 text-sm font-bold uppercase tracking-[0.2em] text-orange-300">
                  Tonight's pick for {people} people
                </p>
                <h2 className="mt-2 text-3xl font-black sm:text-4xl">{result.name}</h2>
                <p className="mt-3 max-w-xl text-slate-300">{result.description}</p>
              </div>

              <div className="flex gap-3 sm:flex-col">
                <Stat label="Time" value={`${result.time} min`} />
                <Stat label="Est. cost" value={`$${result.cost}`} />
              </div>
            </div>

            {(avoid || ingredients) && (
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-slate-200">
                {avoid && <p><strong>Avoid:</strong> {avoid}</p>}
                {ingredients && <p className="mt-1"><strong>Use what you have:</strong> {ingredients}</p>}
              </div>
            )}

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/10 p-5">
                <h3 className="text-lg font-bold">🛒 Grocery list</h3>
                <ul className="mt-3 space-y-2 text-slate-200">
                  {result.groceries.map((item) => (
                    <li key={item}>□ {item}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-white/10 p-5">
                <h3 className="text-lg font-bold">♻️ Leftover plan</h3>
                <p className="mt-3 text-slate-200">{result.leftoverIdea}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={findDinner}
              className="mt-6 w-full rounded-2xl bg-white px-5 py-3 font-bold text-slate-950 transition hover:bg-orange-100"
            >
              Pick Something Else
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

function Question({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-lg font-extrabold">{title}</legend>
      {children}
    </fieldset>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-2xl px-3 py-3 font-bold transition ${
        selected
          ? "bg-orange-500 text-white shadow-md shadow-orange-200"
          : "bg-slate-100 text-slate-700 hover:bg-orange-100"
      }`}
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-24 rounded-2xl bg-white/10 px-4 py-3 text-center">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 font-black">{value}</div>
    </div>
  );
}
