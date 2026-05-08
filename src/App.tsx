import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import IntroModal from "@/components/IntroModal";
import Resourcly from "@/components/Resourcly";

const Index = lazy(() => import("./pages/Index"));
const Courses = lazy(() => import("./pages/Courses"));
const Resources = lazy(() => import("./pages/Resources"));
const Ebooks = lazy(() => import("./pages/Ebooks"));
const Apps = lazy(() => import("./pages/Apps"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Contact = lazy(() => import("./pages/Contact"));
const Install = lazy(() => import("./pages/Install"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AI = lazy(() => import("./pages/AI"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const SpecialCourses = lazy(() => import("./pages/SpecialCourses"));
const FossApps = lazy(() => import("./pages/FossApps"));
const ShizukuApps = lazy(() => import("./pages/ShizukuApps"));
const Morphe = lazy(() => import("./pages/Morphe"));
const MaterialYou = lazy(() => import("./pages/MaterialYou"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background dot-grid">
    <div className="flex gap-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-4 h-4 rounded-full border-2 border-foreground/80"
          style={{
            backgroundColor: i === 0 ? 'hsl(var(--primary))' : i === 1 ? 'hsl(var(--secondary))' : 'hsl(var(--tertiary))',
            animation: `pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.12}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/ebooks" element={<Ebooks />} />
                <Route path="/apps" element={<Apps />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/install" element={<Install />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/ai" element={<AI />} />
                <Route path="/collection/:slug" element={<CollectionPage />} />
                <Route path="/special-courses" element={<SpecialCourses />} />
                <Route path="/foss-apps" element={<FossApps />} />
                <Route path="/shizuku-apps" element={<ShizukuApps />} />
                <Route path="/morphe" element={<Morphe />} />
                <Route path="/material-you" element={<MaterialYou />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <IntroModal />
            <Resourcly />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
