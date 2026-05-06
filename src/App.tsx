import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Contexts
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { InternshipProvider } from "./context/InternshipContext";

// Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import WishlistPage from "./pages/WishlistPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import ChatbotPage from "./pages/ChatbotPage";
import MockInterviewPage from "./pages/MockInterviewPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

// Route Guard Component
const ProtectedRoute = ({ component: Component }: { component: any }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
};

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={() => <Redirect to="/login" />} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      
      {/* Protected Routes */}
      <Route path="/onboarding" component={() => <ProtectedRoute component={OnboardingPage} />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={DashboardPage} />} />
      <Route path="/wishlist" component={() => <ProtectedRoute component={WishlistPage} />} />
      <Route path="/applications" component={() => <ProtectedRoute component={ApplicationsPage} />} />
      <Route path="/chatbot" component={() => <ProtectedRoute component={ChatbotPage} />} />
      <Route path="/mock-interview" component={() => <ProtectedRoute component={MockInterviewPage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route path="/settings" component={() => <ProtectedRoute component={SettingsPage} />} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <InternshipProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </InternshipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
