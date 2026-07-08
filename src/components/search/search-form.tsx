"use client";

import { useState } from "react";
import { Search, MapPin, ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { US_STATES } from "@/lib/sources";

interface SearchFormProps {
  onSearch: (data: {
    firstName: string;
    lastName: string;
    city: string;
    state: string;
  }) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    onSearch({ firstName: firstName.trim(), lastName: lastName.trim(), city, state });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">
            First Name
          </Label>
          <Input
            id="firstName"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="h-12 text-base"
            autoComplete="given-name"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">
            Last Name
          </Label>
          <Input
            id="lastName"
            placeholder="Smith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="h-12 text-base"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 space-y-2">
          <Label htmlFor="city" className="text-sm font-medium text-muted-foreground">
            City <span className="text-muted-foreground/60">(optional)</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="city"
              placeholder="New York"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-12 text-base pl-10"
              autoComplete="address-level2"
            />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="state" className="text-sm font-medium text-muted-foreground">
            State <span className="text-muted-foreground/60">(optional)</span>
          </Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Any State" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {US_STATES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={isLoading || !firstName.trim() || !lastName.trim()}
        className="w-full h-12 text-base font-semibold gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Searching across sources...
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            Search People
          </>
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground mt-3">
        Searches TruePeopleSearch, FastPeopleSearch &amp; FamilyTreeNow simultaneously.
        <br />
        All data is from public sources. Not for FCRA/employment/credit screening.
      </p>
    </form>
  );
}