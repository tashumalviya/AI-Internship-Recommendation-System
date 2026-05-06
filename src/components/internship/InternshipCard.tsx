import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MapPin, Clock, IndianRupee, Heart, CheckCircle2 } from "lucide-react";
import { SkillTag } from "../common/SkillTag";
import { useInternships } from "../../context/InternshipContext";
import { RecommendedInternship } from "../../utils/recommendation";

interface InternshipCardProps {
  internship: RecommendedInternship;
}

export const InternshipCard = ({ internship }: InternshipCardProps) => {
  const { isInWishlist, addToWishlist, removeFromWishlist, hasApplied, applyToInternship } = useInternships();
  
  const saved = isInWishlist(internship.id);
  const applied = hasApplied(internship.id);

  const toggleSave = () => {
    if (saved) {
      removeFromWishlist(internship.id);
    } else {
      addToWishlist(internship);
    }
  };

  const handleApply = () => {
    if (!applied) {
      applyToInternship(internship);
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return "bg-green-500";
    if (percent >= 50) return "bg-amber-500";
    return "bg-destructive";
  };

  const getCompanyColor = (company: string) => {
    const colors = [
      "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500",
      "bg-rose-500", "bg-orange-500", "bg-green-500", "bg-teal-500"
    ];
    const index = company.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <Card className="flex flex-col h-full hover-elevate transition-all border-border/50 overflow-hidden group">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${getCompanyColor(internship.company)} shadow-sm`}>
              {internship.logo}
            </div>
            <div>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{internship.title}</h3>
              <p className="text-muted-foreground text-sm font-medium">{internship.company}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSave}
            className={`rounded-full hover:bg-rose-100 hover:text-rose-500 transition-colors ${saved ? "text-rose-500" : "text-muted-foreground"}`}
          >
            <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {internship.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {internship.duration}
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee className="h-3.5 w-3.5" /> {internship.stipend}
          </div>
          <Badge variant="outline" className="ml-auto font-normal bg-background/50 backdrop-blur-sm">
            {internship.type}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Match Score</span>
              <span className="text-xs font-bold">{internship.matchPercent}%</span>
            </div>
            <Progress 
              value={internship.matchPercent} 
              className="h-1.5" 
              indicatorClassName={getProgressColor(internship.matchPercent)} 
            />
            {internship.reason && (
              <p className="text-xs text-muted-foreground mt-2 italic border-l-2 border-muted pl-2 py-0.5">
                {internship.reason}
              </p>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {internship.skills.slice(0, 4).map(skill => (
              <SkillTag key={skill} skill={skill} />
            ))}
            {internship.skills.length > 4 && (
              <Badge variant="secondary" className="text-muted-foreground bg-muted/50">+{internship.skills.length - 4}</Badge>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex gap-2">
        {applied ? (
          <Button variant="secondary" className="w-full bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-500/20" disabled>
            <CheckCircle2 className="h-4 w-4 mr-2" /> Applied
          </Button>
        ) : (
          <Button onClick={handleApply} className="w-full shadow-sm hover-elevate">
            Apply Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
