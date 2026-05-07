import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppLayout } from "@/components/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { lazy, Suspense, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

const queryClient = new QueryClient();

const Dashboard = lazy(() => import("./pages/Dashboard"));
const WeeklyPlanner = lazy(() => import("./pages/WeeklyPlanner"));
const FixedExpenses = lazy(() => import("./pages/FixedExpenses"));
const CreditCards = lazy(() => import("./pages/CreditCards"));
const TransactionsHistory = lazy(() => import("./pages/TransactionsHistory"));
const Projects = lazy(() => import("./pages/Projects"));
const ExchangeRatePage = lazy(() => import("./pages/ExchangeRate"));
const SettingsPage = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AuthPage = lazy(() => import("./pages/Auth"));
const CardWalletPage = lazy(() => import("./pages/CardWallet"));

function PageLoader() {
  return (
    <div className="min-h-[240px] flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}

function AppRoutes() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <Suspense fallback={<PageLoader />}>
        <AuthPage />
      </Suspense>
    );
  }

  return (
    <HashRouter>
      <AppLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<WeeklyPlanner />} />
            <Route path="/fixed-expenses" element={<FixedExpenses />} />
            <Route path="/cards" element={<CreditCards />} />
            <Route path="/transactions" element={<TransactionsHistory />} />
            <Route path="/wallet" element={<CardWalletPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/exchange" element={<ExchangeRatePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </HashRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
