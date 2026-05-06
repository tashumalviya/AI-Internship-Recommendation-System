import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getStorage, setStorage } from "../utils/storage";
import { Internship } from "../data/internships";
import { useToast } from "@/hooks/use-toast";

export interface Application {
  internship: Internship;
  appliedDate: string;
  status: "Under Review" | "Shortlisted" | "Interview Scheduled" | "Rejected";
}

interface InternshipContextType {
  wishlist: Internship[];
  applications: Application[];
  addToWishlist: (internship: Internship) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  applyToInternship: (internship: Internship) => void;
  hasApplied: (id: string) => boolean;
  updateApplicationStatus: (id: string) => void;
}

const InternshipContext = createContext<InternshipContextType | undefined>(undefined);

export const InternshipProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<Internship[]>(() => getStorage("wishlist", []));
  const [applications, setApplications] = useState<Application[]>(() => getStorage("applications", []));

  useEffect(() => {
    setStorage("wishlist", wishlist);
  }, [wishlist]);

  useEffect(() => {
    setStorage("applications", applications);
  }, [applications]);

  const addToWishlist = (internship: Internship) => {
    if (!wishlist.find(i => i.id === internship.id)) {
      setWishlist([...wishlist, internship]);
      toast({ description: "Saved ❤️" });
    }
  };

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter(i => i.id !== id));
    toast({ description: "Removed from wishlist" });
  };

  const isInWishlist = (id: string) => !!wishlist.find(i => i.id === id);

  const applyToInternship = (internship: Internship) => {
    if (!applications.find(a => a.internship.id === internship.id)) {
      setApplications([...applications, {
        internship,
        appliedDate: new Date().toISOString(),
        status: "Under Review"
      }]);
      toast({ description: "Applied 🎉" });
    }
  };

  const hasApplied = (id: string) => !!applications.find(a => a.internship.id === id);

  const updateApplicationStatus = (id: string) => {
    setApplications(apps => apps.map(app => {
      if (app.internship.id === id) {
        const statuses: Application["status"][] = ["Shortlisted", "Interview Scheduled", "Rejected"];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        return { ...app, status: randomStatus };
      }
      return app;
    }));
  };

  return (
    <InternshipContext.Provider value={{
      wishlist,
      applications,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      applyToInternship,
      hasApplied,
      updateApplicationStatus
    }}>
      {children}
    </InternshipContext.Provider>
  );
};

export const useInternships = () => {
  const context = useContext(InternshipContext);
  if (context === undefined) {
    throw new Error("useInternships must be used within an InternshipProvider");
  }
  return context;
};
