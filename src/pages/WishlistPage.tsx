import { AppLayout } from "../components/layout/AppLayout";
import { useInternships } from "../context/InternshipContext";
import { InternshipCard } from "../components/internship/InternshipCard";
import { Heart, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getRecommendations } from "../utils/recommendation";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function WishlistPage() {
  const { wishlist } = useInternships();
  const { user } = useAuth();

  // Need to add match info to wishlist items
  const wishlistWithMatches = getRecommendations(wishlist, user?.skills || []);

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-rose-500 fill-rose-500/20" /> 
            Your Wishlist
          </h1>
          <p className="text-muted-foreground">Saved opportunities you're considering.</p>
        </div>
        <div className="hidden sm:block text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-full">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </div>
      </div>

      {wishlistWithMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {wishlistWithMatches.map((internship, index) => (
              <motion.div
                key={internship.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <InternshipCard internship={internship} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="bg-rose-500/10 p-6 rounded-full mb-6">
            <Heart className="h-16 w-16 text-rose-500 opacity-80" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            When you see an internship you like, click the heart icon to save it here for later.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full px-8 shadow-md">
              <Search className="mr-2 h-4 w-4" /> Browse Internships
            </Button>
          </Link>
        </div>
      )}
    </AppLayout>
  );
}
