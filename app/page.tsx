import Link from "next/link";
import MenuCard from "@/components/MenuCard";

const actions = [
  {
    href: "/cook",
    emoji: "🍳",
    title: "Cook Tonight",
    description: "Choose your budget, time, equipment, and ingredients to get a dinner idea.",
    color: "bg-orange-500",
  },
  {
    href: "/eat-out",
    emoji: "🍔",
    title: "Eat Out",
    description: "Filter nearby restaurant choices or let us randomly choose one.",
    color: "bg-blue-500",
  },
  {
    href: "/smoker",
    emoji: "🔥",
    title: "Smoker Mode",
    description: "Get temperatures, timing, sides, and leftover ideas for your cook.",
    color: "bg-red-500",
  },
  {
    href: "/groceries",
    emoji: "🛒",
    title: "Grocery List",
    description: "Build a checkable shopping list organized by store department.",
    color: "bg-emerald-500",
  },
  {
    href: "/profiles",
    emoji: "👨‍👩‍👧‍👦",
    title: "Family Profiles",
    description: "Keep track of everyone’s favorite foods and dislikes.",
    color: "bg-violet-500",
  },
  {
    href: "/surprise",
    emoji: "🎲",
    title: "I Don’t Care",
    description: "One tap. No debate. Dinner is decided for you.",
    color: "bg-fuchsia-600",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-amber-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <section className="text-center">
          <div className="text-7xl">🍽️</div>
          <p className="mt-5 text-sm font-black uppercase tracking-[0.25em] text-orange-500">Dinner decided</p>
          <h1 className="mt-2 text-5xl font-black tracking-tight sm:text-7xl">IDK Dinner</h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-slate-600 sm:text-2xl">Stop asking. Start eating.</p>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">Cook at home, use the smoker, build a grocery list, or let the app choose where you eat.</p>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="block focus:outline-none focus:ring-4 focus:ring-orange-200 rounded-3xl">
              <MenuCard emoji={action.emoji} title={action.title} description={action.description} color={action.color} />
            </Link>
          ))}
        </section>

        <section className="mt-10 rounded-3xl bg-slate-950 p-7 text-white shadow-2xl sm:p-9">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">How it works</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <Step number="1" title="Pick a mode" text="Cook, eat out, smoke something, or let us decide." />
            <Step number="2" title="Answer a few questions" text="Budget, time, people, and what you already have." />
            <Step number="3" title="Dinner is handled" text="Get a clear choice, grocery list, and leftover plan." />
          </div>
        </section>
      </div>
    </main>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 font-black">{number}</div>
      <h2 className="mt-4 text-lg font-black">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}
