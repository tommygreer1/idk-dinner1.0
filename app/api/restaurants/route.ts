import { NextResponse } from "next/server";

type RestaurantRequest = {
  latitude?: number;
  longitude?: number;
  radiusMiles?: number;
  category?: string;
  openNow?: boolean;
  maxPriceLevel?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RestaurantRequest;
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GOOGLE_PLACES_API_KEY is not configured yet." },
        { status: 503 },
      );
    }

    if (typeof body.latitude !== "number" || typeof body.longitude !== "number") {
      return NextResponse.json({ error: "A valid location is required." }, { status: 400 });
    }

    const radiusMeters = Math.min(Math.max((body.radiusMiles || 10) * 1609.344, 500), 50000);
    const includedTypes =
      body.category && body.category !== "Anything"
        ? [categoryToPlaceType(body.category)]
        : ["restaurant"];

    const placesResponse = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.primaryTypeDisplayName,places.rating,places.userRatingCount,places.priceLevel,places.currentOpeningHours.openNow,places.googleMapsUri,places.websiteUri,places.location",
      },
      body: JSON.stringify({
        includedTypes,
        maxResultCount: 20,
        rankPreference: "POPULARITY",
        locationRestriction: {
          circle: {
            center: {
              latitude: body.latitude,
              longitude: body.longitude,
            },
            radius: radiusMeters,
          },
        },
      }),
    });

    if (!placesResponse.ok) {
      const details = await placesResponse.text();
      console.error("Google Places request failed:", details);
      return NextResponse.json({ error: "Nearby restaurants could not be loaded." }, { status: 502 });
    }

    const data = await placesResponse.json();
    const places = (data.places || []).filter((place: any) => {
      if (body.openNow && place.currentOpeningHours?.openNow !== true) return false;
      if (body.maxPriceLevel && priceLevelNumber(place.priceLevel) > body.maxPriceLevel) return false;
      return true;
    });

    if (!places.length) {
      return NextResponse.json({ error: "No restaurants matched those filters." }, { status: 404 });
    }

    const pick = places[Math.floor(Math.random() * places.length)];

    return NextResponse.json({
      id: pick.id,
      name: pick.displayName?.text || "Restaurant",
      category: pick.primaryTypeDisplayName?.text || "Restaurant",
      address: pick.formattedAddress || "",
      rating: pick.rating || null,
      ratingCount: pick.userRatingCount || null,
      price: priceLevelLabel(pick.priceLevel),
      openNow: pick.currentOpeningHours?.openNow ?? null,
      mapsUrl: pick.googleMapsUri || "",
      websiteUrl: pick.websiteUri || "",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong choosing a restaurant." }, { status: 500 });
  }
}

function categoryToPlaceType(category: string) {
  const types: Record<string, string> = {
    Mexican: "mexican_restaurant",
    BBQ: "barbecue_restaurant",
    Pizza: "pizza_restaurant",
    Steak: "steak_house",
    Asian: "asian_restaurant",
    American: "american_restaurant",
    Breakfast: "breakfast_restaurant",
    Burgers: "hamburger_restaurant",
  };
  return types[category] || "restaurant";
}

function priceLevelNumber(level?: string) {
  const values: Record<string, number> = {
    PRICE_LEVEL_FREE: 0,
    PRICE_LEVEL_INEXPENSIVE: 1,
    PRICE_LEVEL_MODERATE: 2,
    PRICE_LEVEL_EXPENSIVE: 3,
    PRICE_LEVEL_VERY_EXPENSIVE: 4,
  };
  return values[level || ""] ?? 0;
}

function priceLevelLabel(level?: string) {
  const value = priceLevelNumber(level);
  return value > 0 ? "$".repeat(value) : "Price unavailable";
}
