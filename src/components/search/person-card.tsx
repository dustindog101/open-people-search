"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User, MapPin, Phone, Mail, Calendar, Users, UserCheck, ExternalLink } from "lucide-react";
import { type SearchResult, type FactType, SOURCES, FACT_TYPE_LABELS, FACT_TYPE_ICONS } from "@/lib/sources";

interface PersonCardProps {
  result: SearchResult;
  index: number;
  onExpand: (result: SearchResult) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Phone: <Phone className="h-3.5 w-3.5" />,
  Mail: <Mail className="h-3.5 w-3.5" />,
  MapPin: <MapPin className="h-3.5 w-3.5" />,
  Calendar: <Calendar className="h-3.5 w-3.5" />,
  Users: <Users className="h-3.5 w-3.5" />,
  UserCheck: <UserCheck className="h-3.5 w-3.5" />,
};

export function PersonCard({ result, index, onExpand }: PersonCardProps) {
  // Group facts by type
  const factsByType = result.facts.reduce<Record<string, typeof result.facts>>((acc, fact) => {
    if (!acc[fact.type]) acc[fact.type] = [];
    acc[fact.type].push(fact);
    return acc;
  }, {});

  // Get unique sources
  const uniqueSources = [...new Set(result.sources)];

  // Find a primary phone and address for the card header
  const primaryPhone = result.facts.find((f) => f.type === "phone");
  const primaryAddress = result.facts.find((f) => f.type === "address");
  const primaryEmail = result.facts.find((f) => f.type === "email");

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-border/60">
      <CardContent className="p-4 sm:p-6">
        {/* Header: Name, location, age, sources */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-lg leading-tight truncate">{result.fullName}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                {result.age && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Age {result.age}
                  </span>
                )}
                {(result.city || result.state) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {[result.city, result.state].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Source badges */}
          <div className="flex flex-wrap gap-1.5 flex-shrink-0">
            {uniqueSources.map((src) => {
              const source = SOURCES[src];
              if (!source) return null;
              return (
                <Badge
                  key={src}
                  variant="secondary"
                  className={`text-xs font-medium ${source.color} border-0`}
                >
                  {source.name}
                </Badge>
              );
            })}
            {result.score > 1 && (
              <Badge variant="outline" className="text-xs">
                {result.score} sources
              </Badge>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Quick facts preview */}
        <div className="space-y-2">
          {primaryPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span>{primaryPhone.value}</span>
              <Badge variant="secondary" className={`text-[10px] ml-auto ${SOURCES[primaryPhone.source]?.color || ""} border-0`}>
                {SOURCES[primaryPhone.source]?.name || primaryPhone.source}
              </Badge>
            </div>
          )}
          {primaryEmail && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{primaryEmail.value}</span>
              <Badge variant="secondary" className={`text-[10px] ml-auto ${SOURCES[primaryEmail.source]?.color || ""} border-0`}>
                {SOURCES[primaryEmail.source]?.name || primaryEmail.source}
              </Badge>
            </div>
          )}
          {primaryAddress && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{primaryAddress.value}</span>
            </div>
          )}
        </div>

        {/* Expand button */}
        <Button
          variant="ghost"
          className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => onExpand(result)}
        >
          View all {result.facts.length} facts
          <ExternalLink className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}