import Link from "next/link";
import MenuCard from "@/components/MenuCard";

const actions = [
  {
    href: "/cook",
    emoji: "🍳",
    title: "Cook Something",
    description: "Set your budget, time, equipment, and ingredients. We’ll narrow it down.",
    color: "bg-orange-500",
  },
  {
    href: "/eat-out",
    emoji: "🍔",
    title: "Go Eat",
    description: "Stop scrolling through restaurants and let IDK Dinner make the call.",
    color: "bg-sky-500",
  },
  {
    href: "/smoker",
    emoji: "🔥",
    title: "Fire Up the Smoker",
    description: "Choose a meat and get timing, temperature, sides, and leftover ideas.",
    color: "bg-rose-500",
  },
  {
    href: "/groceries",
    emoji: "🛒",
    title: "Build the List",
    description: "Turn tonight’s choice into a simple grocery list organized by aisle.",
    color: "bg-emerald-500",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffaf1] text-slate-950">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between rounded-full border-2 border-slate-950 bg-white px-4 py-3 shadow-[4px_4px_0_#0f172a] sm:px-6">
          <Link href="/" className="text-xl font-black tracking-tight sm:text-2xl">
            IDK<span className="text-orange-500">Dinner</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider sm:gap-4 sm:text-sm">
            <span className="rounded-full bg-emerald-100 px-3 py-2 text-emerald-800">Free</span>
            <Link href="/profiles" className="hidden transition hover:text-orange-500 sm:block">
              Family profiles
            </Link>
          </div>
        </nav>

        <section className="relative mt-8 grid items-center gap-10 rounded-[2.25rem] border-2 border-slate-950 bg-orange-400 p-6 shadow-[8px_8px_0_#0f172a] sm:p-10 lg:grid-cols-[1.15fr_.85fr] lg:p-14">
          <div className="relative z-10">
            <p className="inline-flex rounded-full border-2 border-slate-950 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em] shadow-[3px_3px_0_#0f172a]">
              The family dinner decider
            </p>
            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
              Nobody knows.
              <br />
              <span className="text-white">We decide.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg font-semibold leading-7 sm:text-xl">
              Everyone adds what sounds good. IDK Dinner finds the overlap and picks a meal the whole house can live with.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/family-vote"
                className="rounded-2xl border-2 border-slate-950 bg-slate-950 px-6 py-4 text-center text-lg font-black text-white shadow-[4px_4px_0_#fff] transition hover:-translate-y-1"
              >
                Start a dinner vote →
              </Link>
              <Link
                href="/surprise"
                className="rounded-2xl border-2 border-slate-950 bg-white px-6 py-4 text-center text-lg font-black shadow-[4px_4px_0_#0f172a] transition hover:-translate-y-1"
              >
                Just pick for me
              </Link>
            </div>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
              <span>✓ No sign-in required</span>
              <span>✓ Made for real families</span>
              <span>✓ Free to use</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="rotate-2 rounded-[2rem] border-2 border-slate-950 bg-white p-5 shadow-[8px_8px_0_#0f172a]">
              <div className="flex items-center justify-between border-b-2 border-slate-950 pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-orange-500">Tonight’s vote</p>
                  <h2 className="mt-1 text-2xl font-black">What sounds good?</h2>
                </div>
                <span className="text-4xl">🤷</span>
              </div>
              <div className="mt-5 space-y-3">
                <VoteRow name="Tommy" choice="Something on the grill" emoji="🔥" />
                <VoteRow name="Naomi" choice="Not seafood" emoji="🙅" />
                <VoteRow name="Owen" choice="Tacos or pizza" emoji="🌮" />
              </div>
              <div className="mt-5 rounded-2xl border-2 border-slate-950 bg-emerald-200 p-4 text-center">
                <p className="text-xs font-black uppercase tracking-widest">Best match</p>
                <p className="mt-1 text-2xl font-black">Grilled chicken tacos</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">More ways to decide</p>
              <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Pick your level of effort.</h2>
            </div>
            <p className="max-w-md font-medium text-slate-600">From planning a real meal to tapping one button because everybody is tired.</p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {actions.map((action) => (
              <Link key={action.href} href={action.href} className="block rounded-3xl focus:outline-none focus:ring-4 focus:ring-orange-200">
                <MenuCard emoji={action.emoji} title={action.title} description={action.description} color={action.color} />
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-3">
          <Step number="01" title="Everybody answers" text="Add names and the foods each person is willing to eat tonight." />
          <Step number="02" title="We find the overlap" text="The app compares everyone’s choices instead of making one person decide." />
          <Step number="03" title="Dinner is done" text="Get one clear winner, a backup choice, and the next step to make it happen." />
        </section>

        <footer className="mt-14 border-t-2 border-slate-950 py-7 text-center text-sm font-bold text-slate-600">
          IDK Dinner 1.0 · Stop asking. Start eating.
        </footer>
      </div>
    </main>
  );
}

function VoteRow({ name, choice, emoji }: { name: string; choice: string; emoji: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-slate-950 bg-white text-xl">{emoji}</div>
      <div>
        <p className="text-sm font-black">{name}</p>
        <p className="text-sm text-slate-600">{choice}</p>
      </div>
    </div>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-3xl border-2 border-slate-950 bg-white p-6 shadow-[5px_5px_0_#0f172a]">
      <p className="text-4xl font-black text-orange-500">{number}</p>
      <h3 className="mt-5 text-2xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-slate-600">{text}</p>
    </div>
  );
}
