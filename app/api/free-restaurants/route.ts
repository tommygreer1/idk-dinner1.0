import { NextResponse } from "next/server";

type RequestBody = {
  latitude?: number;
  longitude?: number;
  city?: string;
  radiusMiles?: number;
  category?: string;
};

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

const cuisineTerms: Record<string, string[]> = {
  Mexican: ["mexican", "tacos", "tex-mex"],
  BBQ: ["barbecue", "bbq"],
  Pizza: ["pizza"],
  Steak: ["steak_house", "steak"],
  Asian: ["chinese", "japanese", "thai", "asian", "sushi", "korean", "vietnamese"],
  American: ["american", "regional"],
  Breakfast: ["breakfast", "brunch", "coffee_shop"],
  Burgers: ["burger", "hamburger"],
  Italian: ["italian", "pasta"],
  Wings: ["chicken", "wings"],
};

const overpassEndpoints = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.nchc.org.tw/api/interpreter",
];

async function fetchOverpass(query: string) {
  for (const endpoint of overpassEndpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "IDK-Dinner/1.0",
        },
        body: new URLSearchParams({ data: query }),
        cache: "no-store",
        signal: controller.signal,
      });

      clearTimeout(timeout);
      if (!response.ok) continue;

      const data = await response.json();
      if (Array.isArray(data?.elements)) return data;
    } catch {
      // Try the next free Overpass server.
    }
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    let latitude = body.latitude;
    let longitude = body.longitude;

    if ((!latitude || !longitude) && body.city?.trim()) {
      const geocodeUrl = new URL("https://nominatim.openstreetmap.org/search");
      geocodeUrl.searchParams.set("q", body.city.trim());
      geocodeUrl.searchParams.set("format", "json");
      geocodeUrl.searchParams.set("limit", "1");

      const geocodeResponse = await fetch(geocodeUrl, {
        headers: { "User-Agent": "IDK-Dinner/1.0" },
        cache: "no-store",
      });
      const geocodeData = await geocodeResponse.json();
      if (!geocodeData?.[0]) {
        return NextResponse.json({ error: "We could not find that city or ZIP code." }, { status: 404 });
      }
      latitude = Number(geocodeData[0].lat);
      longitude = Number(geocodeData[0].lon);
    }

    if (!latitude || !longitude) {
      return NextResponse.json({ error: "Location is required." }, { status: 400 });
    }

    const radiusMeters = Math.min(Math.max((body.radiusMiles || 10) * 1609, 1609), 48280);
    const query = `[out:json][timeout:18];(node["amenity"~"restaurant|fast_food|cafe"](around:${radiusMeters},${latitude},${longitude});way["amenity"~"restaurant|fast_food|cafe"](around:${radiusMeters},${latitude},${longitude});relation["amenity"~"restaurant|fast_food|cafe"](around:${radiusMeters},${latitude},${longitude}););out center tags;`;

    const data = await fetchOverpass(query);
    if (!data) {
      return NextResponse.json(
        { error: "The free restaurant servers are busy right now. Tap Pick a Restaurant again." },
        { status: 503 },
      );
    }

    const category = body.category || "Anything";
    const terms = cuisineTerms[category] || [];

    const restaurants = (data.elements as OverpassElement[])
      .map((element) => {
        const tags = element.tags || {};
        const name = tags.name;
        if (!name) return null;

        const cuisine = (tags.cuisine || "").toLowerCase();
        const searchable = `${name} ${cuisine} ${tags.description || ""}`.toLowerCase();
        const matchesCategory = category === "Anything" || terms.some((term) => searchable.includes(term));
        if (!matchesCategory) return null;

        const lat = element.lat ?? element.center?.lat;
        const lon = element.lon ?? element.center?.lon;
        if (!lat || !lon) return null;

        const address = [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]]
          .filter(Boolean)
          .join(" ");

        return {
          id: String(element.id),
          name,
          cuisine: tags.cuisine || category,
          address,
          lat,
          lon,
          website: tags.website || tags["contact:website"] || "",
          phone: tags.phone || tags["contact:phone"] || "",
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${lat},${lon}`)}`,
        };
      })
      .filter(Boolean);

    if (!restaurants.length) {
      return NextResponse.json(
        {
          error: `No ${category === "Anything" ? "restaurants" : category + " restaurants"} were found in that area. Try a larger distance or choose Anything.`,
        },
        { status: 404 },
      );
    }

    return NextResponse.json(restaurants[Math.floor(Math.random() * restaurants.length)]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong finding a restaurant." }, { status: 500 });
  }
}
