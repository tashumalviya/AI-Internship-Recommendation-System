import { AppLayout } from "../components/layout/AppLayout";
import { useTheme, Theme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, Palette, Settings as SettingsIcon, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { currentTheme, setTheme, themes } = useTheme();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    toast({ description: "Theme changed 🎨" });
  };

  const getThemeColors = (theme: Theme) => {
    switch (theme) {
      case "light": return "bg-white border-gray-200 text-gray-900";
      case "dark": return "bg-gray-900 border-gray-700 text-white";
      case "beige": return "bg-[#F5F0E6] border-[#E8E0D0] text-[#2e201d]";
      case "pastel-pink": return "bg-[#FFF0F5] border-[#FCE0EB] text-[#52333f]";
      case "lavender": return "bg-[#F7F5FA] border-[#EAE3F2] text-[#3d3352]";
      case "mint": return "bg-[#F2FAF7] border-[#E0F2EB] text-[#2c4038]";
      case "light-blue": return "bg-[#F0F7FB] border-[#E0EEF5] text-[#263e4c]";
      default: return "bg-white border-gray-200";
    }
  };

  const formatThemeName = (name: string) => {
    return name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
          <SettingsIcon className="h-8 w-8 text-primary" /> Settings
        </h1>
        <p className="text-muted-foreground">Manage your app preferences and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" /> Appearance
            </CardTitle>
            <CardDescription>Customize how InternAI looks on your device.</CardDescription>
          </CardHeader>
          <CardContent>
            <Label className="mb-4 block text-sm font-medium">Theme Preference</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    currentTheme === theme 
                      ? "border-primary shadow-sm" 
                      : "border-transparent hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <div className={`w-full h-12 rounded-md mb-2 border flex items-center justify-center ${getThemeColors(theme)}`}>
                    {currentTheme === theme && <Check className="h-5 w-5 opacity-70" />}
                  </div>
                  <span className="text-xs font-medium">{formatThemeName(theme)}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your session and data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-xl border border-border">
              <h3 className="font-medium mb-1">Log Out</h3>
              <p className="text-sm text-muted-foreground mb-4">
                End your current session. You will need to log in again to access your dashboard.
              </p>
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </Button>
            </div>
            
            <div className="p-4 bg-destructive/5 rounded-xl border border-destructive/20">
              <h3 className="font-medium text-destructive mb-1">Clear Local Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This will delete all your mock applications, wishlist items, and profile data from your browser.
              </p>
              <Button variant="destructive" className="w-full" onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}>
                Reset Everything
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
