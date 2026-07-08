"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, Mail, MapPin, Calendar, Users, UserCheck, ExternalLink } from "lucide-react";
import { type SearchResult, SOURCES, FACT_TYPE_LABELS } from "@/lib/sources";

interface PersonDetailProps {
  result: SearchResult | null;
  open: boolean;
  onClose: () => void;
}

const FACT_ICONS: Record<string, React.ReactNode> = {
  phone: <Phone className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  address: <MapPin className="h-4 w-4" />,
  age: <Calendar className="h-4 w-4" />,
  relatives: <Users className="h-4 w-4" />,
  associates: <UserCheck className="h-4 w-4" />,
};

export function PersonDetail({ result, open, onClose }: PersonDetailProps) {
  if (!result) return null;

  // Group facts by type
  const factsByType = result.facts.reduce<Record<string, typeof result.facts>>((acc, fact) => {
    if (!acc[fact.type]) acc[fact.type] = [];
    acc[fact.type].push(fact);
    return acc;
  }, {});

  const typeOrder = ["age", "phone", "email", "address", "relatives", "associates"];
  const sortedTypes = Object.keys(factsByType).sort(
    (a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b)
  );

  const uniqueSources = [...new Set(result.sources)];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl">{result.fullName}</DialogTitle>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
            {result.age && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                Age {result.age}
              </span>
            )}
            {(result.city || result.state) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {[result.city, result.state].filter(Boolean).join(", ")}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
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
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[60vh]">
          <div className="p-6 pt-4 space-y-6">
            {sortedTypes.map((type) => (
              <div key={type}>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2 mb-3">
                  {FACT_ICONS[type]}
                  {FACT_TYPE_LABELS[type as keyof typeof FACT_TYPE_LABELS] || type}
                  <span className="text-xs font-normal">({factsByType[type].length})</span>
                </h4>
                <div className="space-y-2">
                  {factsByType[type].map((fact, i) => (
                    <div
                      key={`${fact.type}-${fact.source}-${i}`}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50 text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="break-words">{fact.value}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] flex-shrink-0 ${SOURCES[fact.source]?.color || ""} border-0`}
                      >
                        {SOURCES[fact.source]?.name || fact.source}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-muted/30">
          <p className="text-xs text-center text-muted-foreground">
            Every fact above is attributed to its original public source. Data is cached locally — use the opt-out page to request removal.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}