interface MenuCardProps {
  emoji: string;
  title: string;
  description: string;
  color: string;
}

export default function MenuCard({
  emoji,
  title,
  description,
  color,
}: MenuCardProps) {
  return (
    <div
      className={`${color} rounded-3xl p-6 shadow-lg hover:scale-105 transition duration-300 cursor-pointer`}
    >
      <div className="text-5xl mb-4">{emoji}</div>

      <h2 className="text-2xl font-bold text-white">
        {title}
      </h2>

      <p className="text-white/90 mt-2">
        {description}
      </p>
    </div>
  );
}