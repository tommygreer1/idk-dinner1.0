import Link from "next/link";
import IdkDinnerLogo from "@/components/IdkDinnerLogo";
import MenuCard from "@/components/MenuCard";

const actions = [
  {
    href: "/cook",
    emoji: "🍳",
    title: "Cook Tonight",
    eyebrow: "Use what you have",
    description: "Build a realistic meal around your budget, time, ingredients, and cooking setup.",
    color: "bg-orange-500",
  },
  {
    href: "/eat-out",
    emoji: "📍",
    title: "Pick a Restaurant",
    eyebrow: "Actually near you",
    description: "Use your area, set a few preferences, and let IDK choose a real place to eat.",
    color: "bg-blue-500",
  },
  {
    href: "/smoker",
    emoji: "🔥",
    title: "Smoker Mode",
    eyebrow: "Low and slow",
    description: "Get cook temperatures, timing, sides, and a plan for tomorrow's leftovers.",
    color: "bg-red-500",
  },
  {
    href: "/groceries",
    emoji: "🛒",
    title: "Grocery List",
    eyebrow: "Shop smarter",
    description: "Turn dinner into a clean, checkable list organized by store department.",
    color: "bg-emerald-500",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f4ee] text-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-orange-200/55 blur-3xl" />
        <div className="absolute -right-20 top-8 h-80 w-80 rounded-full bg-blue-200/45 blur-3xl" />
        <div className="float-slow absolute left-[8%] top-48 hidden text-5xl opacity-25 md:block">🍕</div>
        <div className="float-delay absolute right-[9%] top-72 hidden text-5xl opacity-25 md:block">🌮</div>
        <div className="float-slow absolute bottom-64 left-[13%] hidden text-5xl opacity-20 lg:block">🍔</div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <nav className="flex items-center justify-between rounded-full border border-white/80 bg-white/75 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6">
          <Link href="/" aria-label="IDK Dinner home" className="flex items-center gap-3">
            <span className="text-sm font-black tracking-tight text-slate-950">IDK DINNER</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-orange-600 sm:inline-flex">Free to use</span>
            <Link href="/profiles" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-orange-500">Family</Link>
          </div>
        </nav>

        <section className="mx-auto max-w-5xl pb-10 pt-14 text-center sm:pt-20">
          <div className="mx-auto w-full max-w-xl rounded-[2.5rem] bg-white/70 px-6 py-6 shadow-[0_24px_80px_rgba(8,43,92,0.12)] ring-1 ring-white backdrop-blur sm:px-10">
            <IdkDinnerLogo className="mx-auto w-full max-w-md" />
          </div>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-orange-500">Dinner decision fatigue ends here</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.055em] text-slate-950 sm:text-7xl lg:text-8xl">
            What should we eat <span className="text-orange-500">tonight?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Cook something with what you have, find a real restaurant nearby, or hit one button and let IDK settle it.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/surprise" className="hero-cta group inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 text-xl font-black text-white transition hover:-translate-y-1 hover:bg-orange-600 sm:w-auto sm:min-w-72">
              <span className="text-2xl transition group-hover:rotate-12">🎲</span>
              I&apos;M HUNGRY
            </Link>
            <Link href="/cook" className="inline-flex min-h-16 w-full items-center justify-center rounded-2xl border-2 border-slate-950 bg-white/80 px-8 py-4 text-lg font-black text-slate-950 transition hover:-translate-y-1 hover:bg-slate-950 hover:text-white sm:w-auto">
              I want to cook
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-bold text-slate-500">
            <span>✓ No sign-in required</span><span>✓ Free restaurant search</span><span>✓ Built for real families</span>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-sm font-black uppercase tracking-[0.22em] text-orange-500">Choose your move</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Dinner, handled.</h2></div>
            <p className="max-w-md text-slate-600">Pick a lane or let the main IDK button make the call for you.</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {actions.map((action) => (
              <Link key={action.href} href={action.href} className="rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-orange-200">
                <MenuCard {...action} />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-[2.5rem] bg-slate-950 px-6 py-8 text-white shadow-[0_28px_90px_rgba(8,43,92,0.25)] sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-orange-300">The IDK promise</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Less debating. More eating.</h2>
              <p className="mt-4 max-w-xl text-lg leading-8 text-slate-300">We keep the choices simple, practical, and fast enough to use when everybody is hungry and nobody wants to decide.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Step number="01" title="Choose" text="Cook, eat out, or surrender the decision." />
              <Step number="02" title="Answer" text="Only the questions that actually matter tonight." />
              <Step number="03" title="Eat" text="Get one clear answer and move on with your night." />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-sm font-black">{number}</div><div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{text}</p></div></div>;
}
