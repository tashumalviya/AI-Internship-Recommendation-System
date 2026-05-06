import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SkillTagProps {
  skill: string;
  onRemove?: () => void;
}

export const SkillTag = ({ skill, onRemove }: SkillTagProps) => {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 font-medium tracking-wide">
      {skill}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove {skill}</span>
        </button>
      )}
    </Badge>
  );
};
