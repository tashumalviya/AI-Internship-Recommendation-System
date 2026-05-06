import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

export interface FilterOptions {
  search: string;
  domain: string | null;
  type: string | null;
}

interface InternshipFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  domains: string[];
  types: string[];
}

export const InternshipFilters = ({ onFilterChange, domains, types }: InternshipFiltersProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    domain: null,
    type: null
  });

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  const clearFilters = () => {
    const cleared = { search: "", domain: null, type: null };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  const hasActiveFilters = filters.domain !== null || filters.type !== null;

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search roles, companies, or skills..." 
          className="pl-9 h-11 bg-card border-border/50 shadow-sm rounded-xl focus-visible:ring-primary/20"
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
        />
        {filters.search && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => updateFilters({ search: "" })}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center text-sm font-medium text-muted-foreground mr-2">
          <SlidersHorizontal className="h-4 w-4 mr-1.5" /> Filters:
        </div>
        
        {domains.map(domain => (
          <Badge 
            key={domain}
            variant={filters.domain === domain ? "default" : "outline"}
            className={`cursor-pointer transition-colors px-3 py-1 ${filters.domain === domain ? 'shadow-sm' : 'bg-card hover:bg-muted'}`}
            onClick={() => updateFilters({ domain: filters.domain === domain ? null : domain })}
          >
            {domain}
          </Badge>
        ))}

        <div className="h-4 w-px bg-border mx-1 hidden sm:block" />

        {types.map(type => (
          <Badge 
            key={type}
            variant={filters.type === type ? "secondary" : "outline"}
            className={`cursor-pointer transition-colors px-3 py-1 ${filters.type === type ? 'border-secondary-border shadow-sm' : 'bg-card hover:bg-muted'}`}
            onClick={() => updateFilters({ type: filters.type === type ? null : type })}
          >
            {type}
          </Badge>
        ))}

        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground ml-auto"
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};
