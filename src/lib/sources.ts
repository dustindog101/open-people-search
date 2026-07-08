// Source definitions for the people search aggregator
export interface SourceConfig {
  id: string;
  name: string;
  baseUrl: string;
  color: string; // Tailwind color class for badges
  icon: string; // Lucide icon name
}

export const SOURCES: Record<string, SourceConfig> = {
  truepeoplesearch: {
    id: "truepeoplesearch",
    name: "TruePeopleSearch",
    baseUrl: "https://truepeoplesearch.com",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: "Search",
  },
  fastpeoplesearch: {
    id: "fastpeoplesearch",
    name: "FastPeopleSearch",
    baseUrl: "https://fastpeoplesearch.com",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    icon: "Zap",
  },
  familytreenow: {
    id: "familytreenow",
    name: "FamilyTreeNow",
    baseUrl: "https://familytreenow.com",
    color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
    icon: "TreePine",
  },
};

export type SourceId = keyof typeof SOURCES;

// Fact types that can be found
export type FactType = "phone" | "email" | "address" | "age" | "relatives" | "associates";

export const FACT_TYPE_LABELS: Record<FactType, string> = {
  phone: "Phone Number",
  email: "Email Address",
  address: "Address",
  age: "Age",
  relatives: "Relatives",
  associates: "Associates",
};

export const FACT_TYPE_ICONS: Record<FactType, string> = {
  phone: "Phone",
  email: "Mail",
  address: "MapPin",
  age: "Calendar",
  relatives: "Users",
  associates: "UserCheck",
};

// Search result types
export interface SearchResult {
  id: string;
  fullName: string;
  city?: string;
  state?: string;
  age?: number;
  facts: FactResult[];
  sources: string[];
  score: number;
}

export interface FactResult {
  type: FactType;
  value: string;
  source: SourceId;
  sourceUrl?: string;
}

export interface SearchResponse {
  searchId: string;
  status: "pending" | "running" | "completed" | "failed";
  results: SearchResult[];
  totalResults: number;
  query: string;
  city?: string;
  state?: string;
}

// US States for the state dropdown
export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];