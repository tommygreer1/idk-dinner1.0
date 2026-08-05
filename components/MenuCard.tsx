interface MenuCardProps {
  emoji: string;
  title: string;
  description: string;
  color: string;
  eyebrow?: string;
}

export default function MenuCard({
  emoji,
  title,
  description,
  color,
  eyebrow,
}: MenuCardProps) {
  return (
    <article className="group relative h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-[0_18px_55px_rgba(8,43,92,0.10)] backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_75px_rgba(8,43,92,0.18)] sm:p-7">
      <div className={`absolute inset-x-0 top-0 h-2 ${color}`} />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-100/70 blur-2xl transition duration-500 group-hover:scale-125" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-4xl shadow-lg transition duration-300 group-hover:rotate-3 group-hover:scale-110">
          {emoji}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-black text-slate-900 transition group-hover:bg-orange-500 group-hover:text-white">
          →
        </span>
      </div>

      <div className="relative mt-7">
        {eyebrow && (
          <p className="text-xs font-black uppercase tracking-[0.22em] text-orange-500">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-md leading-7 text-slate-600">{description}</p>
      </div>
    </article>
  );
}
