import Link from "next/link";
import MenuCard from "@/components/MenuCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="max-w-2xl w-full p-8">

        <h1 className="text-6xl font-extrabold text-center mb-3">
          🍽️ IDK Dinner
        </h1>

        <p className="text-center text-gray-600 text-xl mb-10">
          Stop asking. Start eating.
        </p>

        <div className="grid gap-6">

          <Link href="/cook">
            <MenuCard
              emoji="🍳"
              title="Cook Tonight"
              description="AI chooses dinner based on your family, budget, and cooking equipment."
              color="bg-orange-500"
            />
          </Link>

          <Link href="/eat-out">
            <MenuCard
              emoji="🍔"
              title="Eat Out"
              description="Find nearby restaurants or let us randomly choose one."
              color="bg-blue-500"
            />
          </Link>

          <Link href="/smoker">
            <MenuCard
              emoji="🥩"
              title="Smoker Mode"
              description="Smoke once. Eat all week."
              color="bg-red-500"
            />
          </Link>

          <Link href="/groceries">
            <MenuCard
              emoji="🛒"
              title="Grocery List"
              description="Automatically build your shopping list."
              color="bg-green-500"
            />
          </Link>

          <Link href="/profiles">
            <MenuCard
              emoji="🎲"
              title="Pick For Me"
              description="Can't decide? We'll choose."
              color="bg-purple-600"
            />
          </Link>

        </div>

      </div>
    </main>
  );
}