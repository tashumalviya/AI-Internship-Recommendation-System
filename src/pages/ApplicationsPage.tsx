import { AppLayout } from "../components/layout/AppLayout";
import { useInternships, Application } from "../context/InternshipContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Building2, Calendar, MapPin, CheckCircle2, Clock, XCircle, Search, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useState } from "react";

export default function ApplicationsPage() {
  const { applications, updateApplicationStatus } = useInternships();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "Shortlisted": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Interview Scheduled": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "Rejected": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Under Review":
      default: return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  const getStatusIcon = (status: Application["status"]) => {
    switch (status) {
      case "Shortlisted": return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case "Interview Scheduled": return <Calendar className="h-3.5 w-3.5 mr-1" />;
      case "Rejected": return <XCircle className="h-3.5 w-3.5 mr-1" />;
      case "Under Review":
      default: return <Clock className="h-3.5 w-3.5 mr-1" />;
    }
  };

  const getCompanyColor = (company: string) => {
    const colors = [
      "bg-blue-500", "bg-indigo-500", "bg-purple-500", "bg-pink-500",
      "bg-rose-500", "bg-orange-500", "bg-green-500", "bg-teal-500"
    ];
    const index = company.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleCheckStatus = (id: string) => {
    setUpdatingId(id);
    setTimeout(() => {
      updateApplicationStatus(id);
      setUpdatingId(null);
    }, 800);
  };

  return (
    <AppLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" /> 
            My Applications
          </h1>
          <p className="text-muted-foreground">Track the status of your internship applications.</p>
        </div>
        <div className="hidden sm:block text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-full">
          {applications.length} applied
        </div>
      </div>

      {applications.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {applications.map((app, index) => (
              <motion.div
                key={app.internship.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden border-border/50 hover-elevate transition-all group">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center p-5 gap-5">
                      <div className={`h-14 w-14 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xl ${getCompanyColor(app.internship.company)} shadow-sm`}>
                        {app.internship.logo}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{app.internship.title}</h3>
                            <div className="flex items-center text-muted-foreground text-sm font-medium mt-1">
                              <Building2 className="h-3.5 w-3.5 mr-1" /> {app.internship.company}
                              <span className="mx-2">•</span>
                              <MapPin className="h-3.5 w-3.5 mr-1" /> {app.internship.location}
                            </div>
                          </div>
                          
                          <Badge variant="outline" className={`hidden sm:flex border ${getStatusColor(app.status)} px-3 py-1 font-medium text-xs`}>
                            {getStatusIcon(app.status)} {app.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between gap-3 pt-4 border-t sm:border-t-0 sm:pl-5 sm:pt-0 sm:border-l border-border/50">
                        <Badge variant="outline" className={`sm:hidden border ${getStatusColor(app.status)} px-3 py-1 font-medium text-xs`}>
                          {getStatusIcon(app.status)} {app.status}
                        </Badge>
                        
                        <div className="text-xs text-muted-foreground font-medium text-right">
                          Applied: {format(parseISO(app.appliedDate), 'MMM d, yyyy')}
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={updatingId === app.internship.id || app.status === "Rejected" || app.status === "Interview Scheduled"}
                          onClick={() => handleCheckStatus(app.internship.id)}
                          className="w-full sm:w-auto h-8 text-xs font-medium"
                        >
                          {updatingId === app.internship.id ? (
                            <><RefreshCw className="mr-1.5 h-3 w-3 animate-spin" /> Checking...</>
                          ) : (
                            <><RefreshCw className="mr-1.5 h-3 w-3" /> Check Status</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-xl border border-border/50 shadow-sm">
          <div className="bg-primary/10 p-6 rounded-full mb-6">
            <FileText className="h-16 w-16 text-primary opacity-80" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">No applications yet</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            You haven't applied to any internships yet. Start browsing and take the next step in your career!
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="rounded-full px-8 shadow-md">
              <Search className="mr-2 h-4 w-4" /> Find Internships
            </Button>
          </Link>
        </div>
      )}
    </AppLayout>
  );
}
