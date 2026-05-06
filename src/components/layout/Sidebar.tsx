import { Link, useLocation } from "wouter";
import { useAuth } from "../../context/AuthContext";
import { 
  Briefcase, 
  Heart, 
  FileText, 
  MessageSquare, 
  MonitorPlay, 
  User as UserIcon, 
  Settings, 
  LogOut,
  Menu
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Briefcase },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/chatbot", label: "AI Assistant", icon: MessageSquare },
  { href: "/mock-interview", label: "Mock Interview", icon: MonitorPlay },
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const Sidebar = () => {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const NavLinks = () => (
    <nav className="flex-1 px-4 space-y-1 mt-6">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        
        return (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer group ${
              isActive 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}>
              <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-card sticky top-0 z-40">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="bg-primary/20 p-1.5 rounded-lg">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          InternAI
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 flex flex-col">
            <div className="p-6 pb-0 flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-semibold">{user?.name}</span>
                <span className="text-xs text-muted-foreground">{user?.preferredRole || "Student"}</span>
              </div>
            </div>
            <NavLinks />
            <div className="p-4 border-t mt-auto">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={logout}>
                <LogOut className="mr-2 h-5 w-5" />
                Log out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r bg-card/50 backdrop-blur-xl z-10">
        <div className="p-6 pb-2 flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="bg-primary/20 p-1.5 rounded-lg">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          InternAI
        </div>
        
        <div className="px-6 py-4 flex items-center gap-3 mt-4">
          <Avatar className="h-10 w-10 border border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {user?.name ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm truncate">{user?.name}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.preferredRole || "Student"}</span>
          </div>
        </div>

        <NavLinks />
        
        <div className="p-4 mt-auto border-t border-border/50">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      </aside>
    </>
  );
};
