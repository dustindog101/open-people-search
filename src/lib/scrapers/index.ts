import { FactResult, SearchResult, SourceId } from "@/lib/sources";

// Each scraper module exports a single `search` function.
// In production, these would make real HTTP requests via the Railway Patchright worker.
// For MVP, they return realistic demo data based on the query.

export interface ScraperResult {
  people: Omit<SearchResult, "id" | "score">[];
  source: SourceId;
}

export type Scraper = (firstName: string, lastName: string, city?: string, state?: string) => Promise<ScraperResult>;

// Simulate network delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Generate a deterministic pseudo-random value from a seed string
function seededValue(seed: string, index: number, pool: string[]): string {
  const hash = (seed + index).split("").reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0);
  return pool[Math.abs(hash) % pool.length];
}

function seededNumber(seed: string, index: number, min: number, max: number): number {
  const hash = (seed + "num" + index).split("").reduce((acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0, 0);
  return min + Math.abs(hash) % (max - min + 1);
}

// ----- TruePeopleSearch Scraper -----
export const truePeopleSearch: Scraper = async (firstName, lastName, city, state) => {
  await delay(400 + Math.random() * 300);
  const seed = `${firstName}${lastName}${city || ""}${state || ""}`.toLowerCase();
  const count = seededNumber(seed, 0, 2, 5);
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "San Antonio", "San Diego", "Dallas", "Austin", "Jacksonville"];
  const streets = ["Oak St", "Main St", "Elm Ave", "Park Blvd", "Cedar Ln", "Pine Dr", "Maple Ct", "Washington Ave", "Lake Dr", "Hill Rd"];
  const phones = ["(212) 555-", "(310) 555-", "(312) 555-", "(713) 555-", "(602) 555-", "(210) 555-", "(619) 555-", "(214) 555-", "(512) 555-", "(904) 555-"];

  const people: Omit<SearchResult, "id" | "score">[] = [];

  for (let i = 0; i < count; i++) {
    const personCity = city || seededValue(seed, i * 10, cities);
    const personState = state || seededValue(seed, i * 10 + 1, US_STATES_ABBR);
    const street = seededValue(seed, i * 10 + 2, streets);
    const age = seededNumber(seed, i * 10 + 3, 22, 78);
    const phoneArea = seededValue(seed, i * 10 + 4, phones);
    const phoneLast4 = String(seededNumber(seed, i * 10 + 5, 1000, 9999));

    const facts: FactResult[] = [
      { type: "age", value: String(age), source: "truepeoplesearch" },
      { type: "address", value: `${seededNumber(seed, i * 10 + 6, 100, 9999)} ${street}, ${personCity}, ${personState} ${String(seededNumber(seed, i * 10 + 7, 10000, 99999))}`, source: "truepeoplesearch" },
      { type: "phone", value: `${phoneArea}${phoneLast4}`, source: "truepeoplesearch" },
    ];

    const relCount = seededNumber(seed, i * 10 + 8, 0, 3);
    if (relCount > 0) {
      const relNames = ["John Smith", "Jane Doe", "Robert Johnson", "Mary Williams", "James Brown"];
      facts.push({
        type: "relatives",
        value: Array.from({ length: relCount }, (_, j) => seededValue(seed, i * 100 + j, relNames)).join(", "),
        source: "truepeoplesearch",
      });
    }

    people.push({
      fullName: `${firstName} ${lastName}`,
      city: personCity,
      state: personState,
      age,
      facts,
      sources: ["truepeoplesearch"],
    });
  }

  return { people, source: "truepeoplesearch" };
};

// ----- FastPeopleSearch Scraper -----
export const fastPeopleSearch: Scraper = async (firstName, lastName, city, state) => {
  await delay(300 + Math.random() * 400);
  const seed = `${firstName}${lastName}${city || ""}${state || ""}-fast`.toLowerCase();
  const count = seededNumber(seed, 0, 1, 4);
  const cities = ["Brooklyn", "Queens", "Manhattan", "Bronx", "Staten Island", "Miami", "Atlanta", "Denver", "Seattle", "Portland"];
  const emails = ["gmail.com", "yahoo.com", "outlook.com", "icloud.com", "hotmail.com"];

  const people: Omit<SearchResult, "id" | "score">[] = [];

  for (let i = 0; i < count; i++) {
    const personCity = city || seededValue(seed, i * 10, cities);
    const personState = state || seededValue(seed, i * 10 + 1, US_STATES_ABBR);
    const age = seededNumber(seed, i * 10 + 2, 25, 82);
    const emailDomain = seededValue(seed, i * 10 + 3, emails);
    const emailUser = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${seededNumber(seed, i * 10 + 4, 1, 99)}`;

    const facts: FactResult[] = [
      { type: "age", value: String(age), source: "fastpeoplesearch" },
      { type: "email", value: `${emailUser}@${emailDomain}`, source: "fastpeoplesearch" },
    ];

    const addrCount = seededNumber(seed, i * 10 + 5, 1, 2);
    for (let a = 0; a < addrCount; a++) {
      facts.push({
        type: "address",
        value: `${seededNumber(seed, i * 100 + a * 3, 100, 9999)} ${seededValue(seed, i * 100 + a * 3 + 1, ["Broadway", "Market St", "5th Ave", "Sunset Blvd", "Peachtree St"])} ${a === 0 ? "" : "(Previous)"}, ${personCity}, ${personState}`,
        source: "fastpeoplesearch",
      });
    }

    people.push({
      fullName: `${firstName} ${lastName}`,
      city: personCity,
      state: personState,
      age,
      facts,
      sources: ["fastpeoplesearch"],
    });
  }

  return { people, source: "fastpeoplesearch" };
};

// ----- FamilyTreeNow Scraper -----
export const familyTreeNow: Scraper = async (firstName, lastName, city, state) => {
  await delay(500 + Math.random() * 200);
  const seed = `${firstName}${lastName}${city || ""}${state || ""}-tree`.toLowerCase();
  const count = seededNumber(seed, 0, 1, 3);

  const cities = ["Springfield", "Franklin", "Georgetown", "Madison", "Clinton", "Salem", "Arlington", "Burlington", "Greenville", "Manchester"];
  const relatives = ["Michael Smith", "Sarah Johnson", "David Williams", "Emily Brown", "Christopher Jones", "Amanda Davis", "Daniel Miller", "Jessica Wilson", "Matthew Taylor", "Ashley Anderson"];

  const people: Omit<SearchResult, "id" | "score">[] = [];

  for (let i = 0; i < count; i++) {
    const personCity = city || seededValue(seed, i * 10, cities);
    const personState = state || seededValue(seed, i * 10 + 1, US_STATES_ABBR);
    const age = seededNumber(seed, i * 10 + 2, 30, 90);

    const relCount = seededNumber(seed, i * 10 + 3, 2, 5);
    const assocCount = seededNumber(seed, i * 10 + 4, 1, 3);

    const facts: FactResult[] = [
      { type: "age", value: String(age), source: "familytreenow" },
      {
        type: "relatives",
        value: Array.from({ length: relCount }, (_, j) => seededValue(seed, i * 100 + j, relatives)).join(", "),
        source: "familytreenow",
      },
    ];

    if (assocCount > 0) {
      const assocNames = ["Thomas Brown", "Patricia Garcia", "Linda Martinez", "Barbara Robinson", "Elizabeth Clark"];
      facts.push({
        type: "associates",
        value: Array.from({ length: assocCount }, (_, j) => seededValue(seed, i * 200 + j, assocNames)).join(", "),
        source: "familytreenow",
      });
    }

    people.push({
      fullName: `${firstName} ${lastName}`,
      city: personCity,
      state: personState,
      age,
      facts,
      sources: ["familytreenow"],
    });
  }

  return { people, source: "familytreenow" };
};

// Helper: list of US state abbreviations
const US_STATES_ABBR = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
  "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
  "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV",
  "WI","WY","DC",
];