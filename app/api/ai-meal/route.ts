import { NextResponse } from "next/server";

type MealRequest = {
  people?: string;
  budget?: number;
  time?: number;
  equipment?: string[];
  avoid?: string;
  ingredients?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MealRequest;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured yet." },
        { status: 503 },
      );
    }

    const prompt = `Create one realistic family dinner for tonight.
People: ${body.people || "4"}
Maximum budget: $${body.budget || 30}
Maximum time: ${body.time || 45} minutes
Available equipment: ${(body.equipment || []).join(", ") || "stove and oven"}
Ingredients already available: ${body.ingredients || "none listed"}
Avoid completely: ${body.avoid || "nothing listed"}

Return practical food normal families would actually eat. Respect every allergy, dislike, budget, time, and equipment limit. Return JSON only.`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5",
        store: false,
        input: [
          {
            role: "system",
            content:
              "You are the IDK Dinner meal planner. Give one decisive, affordable, family-friendly dinner choice with concise instructions.",
          },
          { role: "user", content: prompt },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "dinner_choice",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              required: [
                "name",
                "emoji",
                "description",
                "timeMinutes",
                "estimatedCost",
                "ingredients",
                "instructions",
                "missingGroceries",
                "substitutions",
                "leftoverIdea",
              ],
              properties: {
                name: { type: "string" },
                emoji: { type: "string" },
                description: { type: "string" },
                timeMinutes: { type: "number" },
                estimatedCost: { type: "number" },
                ingredients: { type: "array", items: { type: "string" } },
                instructions: { type: "array", items: { type: "string" } },
                missingGroceries: { type: "array", items: { type: "string" } },
                substitutions: { type: "array", items: { type: "string" } },
                leftoverIdea: { type: "string" },
              },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("OpenAI request failed:", details);
      return NextResponse.json({ error: "The AI could not make a meal right now." }, { status: 502 });
    }

    const data = await response.json();
    const outputText = data.output_text;

    if (!outputText) {
      return NextResponse.json({ error: "The AI returned an empty meal." }, { status: 502 });
    }

    return NextResponse.json(JSON.parse(outputText));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong creating dinner." }, { status: 500 });
  }
}
