import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { AppLayout } from "../components/layout/AppLayout";
import { INTERNSHIPS } from "../data/internships";
import { getRecommendations, RecommendedInternship } from "../utils/recommendation";
import { InternshipCard } from "../components/internship/InternshipCard";
import { InternshipFilters, FilterOptions } from "../components/internship/InternshipFilters";
import { LoadingSkeleton } from "../components/common/LoadingSkeleton";
import { SkillTag } from "../components/common/SkillTag";
import { useInternships } from "../context/InternshipContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, FileText, Heart, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuth();
  const { applications, wishlist } = useInternships();
  const [isLoading, setIsLoading] = useState(true);
  
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    domain: null,
    type: null
  });

  // Calculate recommendations
  const recommendedInternships = useMemo(() => {
    return getRecommendations(INTERNSHIPS, user?.skills || []);
  }, [user?.skills]);

  // Apply filters
  const filteredInternships = useMemo(() => {
    return recommendedInternships.filter(internship => {
      // Domain filter
      if (filters.domain && internship.domain !== filters.domain) return false;
      
      // Type filter
      if (filters.type && internship.type !== filters.type) return false;
      
      // Search filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        return (
          internship.title.toLowerCase().includes(query) ||
          internship.company.toLowerCase().includes(query) ||
          internship.skills.some(s => s.toLowerCase().includes(query))
        );
      }
      
      return true;
    });
  }, [recommendedInternships, filters]);

  // Extract unique domains and types for filters
  const domains = useMemo(() => [...new Set(INTERNSHIPS.map(i => i.domain))], []);
  const types = useMemo(() => [...new Set(INTERNSHIPS.map(i => i.type))], []);

  // Stats
  const avgMatchScore = useMemo(() => {
    if (recommendedInternships.length === 0) return 0;
    const top10 = recommendedInternships.slice(0, 10);
    const sum = top10.reduce((acc, curr) => acc + curr.matchPercent, 0);
    return Math.round(sum / top10.length);
  }, [recommendedInternships]);

  const topMatch = recommendedInternships[0];

  useEffect(() => {
    // Simulate loading state for dashboard
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p className="text-muted-foreground">Here are your personalized internship recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <InternshipFilters 
            onFilterChange={setFilters} 
            domains={domains}
            types={types}
          />
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> For You
            </h2>
            
            {isLoading ? (
              <LoadingSkeleton />
            ) : filteredInternships.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredInternships.map((internship, index) => (
                    <motion.div
                      key={internship.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <InternshipCard internship={internship} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-16 bg-muted/20 rounded-2xl border border-dashed border-border">
                <div className="inline-flex items-center justify-center p-4 bg-muted rounded-full mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No internships found</h3>
                <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                  Try adjusting your filters or search query to find more opportunities.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          {/* Top Match Card */}
          {topMatch && !isLoading && (
            <Card className="border-primary/20 bg-primary/5 shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 p-3 opacity-20 pointer-events-none">
                <Trophy className="h-24 w-24" />
              </div>
              <CardHeader className="pb-2">
                <Badge className="w-fit mb-2 bg-primary">Top Match</Badge>
                <CardTitle className="text-lg leading-tight">{topMatch.title}</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">{topMatch.company}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary">{topMatch.matchPercent}%</span>
                  <span className="text-sm text-muted-foreground mb-1">match score</span>
                </div>
                <p className="text-sm text-foreground/80 line-clamp-2">
                  {topMatch.reason}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-500 rounded-md">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Applications</span>
                </div>
                <span className="font-bold">{applications.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-500/10 text-rose-500 rounded-md">
                    <Heart className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Wishlist</span>
                </div>
                <span className="font-bold">{wishlist.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 text-green-500 rounded-md">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">Avg Match</span>
                </div>
                <span className="font-bold">{avgMatchScore}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Your Skills */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {user?.skills && user.skills.length > 0 ? (
                  user.skills.map(skill => (
                    <SkillTag key={skill} skill={skill} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Add skills to your profile to get better matches.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
