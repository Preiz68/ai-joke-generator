// Filename: build_500_jokes.ts
import fetch from "node-fetch";
import fs from "fs";

interface Joke {
  category: string;
  input: string;
  output: string;
}

const TOTAL_JOKES = 500;

const CATEGORIES = [
  "one_liner",
  "tech_joke",
  "darkhumor",
  "animaljoke",
  "dadjoke",
  "funny",
  "spooky",
];

// Keywords for filtering some categories
const KEYWORDS: Record<string, string[]> = {
  animaljoke: ["cat", "dog", "bird", "animal", "pet", "puppy", "kitten"],
  dadjoke: ["dad", "Dad", "father", "mom", "Mom"],
  spooky: ["ghost", "haunt", "witch", "spooky", "scare"],
  darkhumor: ["kill", "die", "murder", "blood", "dark"],
};

// Deduplicate array by output
function deduplicate(jokes: Joke[]): Joke[] {
  const seen = new Set<string>();
  return jokes.filter((j) => {
    if (seen.has(j.output)) return false;
    seen.add(j.output);
    return true;
  });
}

// Filter jokes by keywords
function filterByKeywords(text: string, keywords: string[]): boolean {
  return keywords.some((k) => text.toLowerCase().includes(k.toLowerCase()));
}

// Fetch jokes from JokeAPI
async function fetchJokes(category: string, amount = 100): Promise<Joke[]> {
  const jokeApiCategories: Record<string, string[]> = {
    one_liner: ["Misc", "Pun"],
    tech_joke: ["Programming"],
    darkhumor: ["Dark"],
    spooky: ["Spooky"],
    dadjoke: ["Misc"],
    funny: ["Misc", "Pun"],
    animaljoke: ["Misc"],
  };

  const categoriesStr = jokeApiCategories[category].join(",");
  const url = `https://v2.jokeapi.dev/joke/${categoriesStr}?type=single&amount=${amount}&safe-mode`;
  const res = await fetch(url);
  const json = (await res.json()) as any;

  const jokesRaw = json.jokes || [json];

  return jokesRaw
    .map((j: any) => {
      const text = j.joke || `${j.setup ?? ""} — ${j.delivery ?? ""}`;
      if (KEYWORDS[category] && !filterByKeywords(text, KEYWORDS[category]))
        return null;
      return {
        category,
        input: `Write a ${category.replace("_", " ")}.`,
        output: text.trim(),
      };
    })
    .filter(Boolean) as Joke[];
}

async function buildDataset() {
  let dataset: Joke[] = [];

  for (const cat of CATEGORIES) {
    const jokes = await fetchJokes(cat, 150); // fetch extra to ensure enough after filtering
    dataset = dataset.concat(jokes);
  }

  // Deduplicate
  dataset = deduplicate(dataset);

  // Shuffle
  dataset = dataset.sort(() => Math.random() - 0.5);

  // Take first 500 or less if not enough
  const finalDataset = dataset.slice(0, TOTAL_JOKES);

  fs.writeFileSync("jokes_500.json", JSON.stringify(finalDataset, null, 2));
  console.log(
    `✅ Dataset ready: ${finalDataset.length} jokes in jokes_500.json`
  );
}

buildDataset().catch(console.error);
