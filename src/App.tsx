import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import StudentLoginPage from "./pages/auth/StudentLoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { OnboardingAddChild, OnboardingPledge, OnboardingComplete } from "./pages/onboarding";
import DashboardPage from "./pages/DashboardPage";
import InviteSponsorsPage from "./pages/InviteSponsorsPage";
import LogReadingPage from "./pages/LogReadingPage";
import SponsorPage from "./pages/SponsorPage";
import SponsorLandingPage from "./pages/SponsorLandingPage";
import SponsorDashboardPage from "./pages/SponsorDashboardPage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import StudentLogReadingPage from "./pages/StudentLogReadingPage";
import TeacherDashboardPage from "./pages/TeacherDashboardPage";
import TeacherLogReadingPage from "./pages/TeacherLogReadingPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminFinancePage from "./pages/AdminFinancePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/sponsor/:childId" element={<SponsorPage />} />
          <Route path="/invite/:token" element={<SponsorLandingPage />} />
          <Route path="/s/:code" element={<SponsorLandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/student-login" element={<StudentLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Onboarding Routes */}
          <Route path="/onboarding/add-child" element={<OnboardingAddChild />} />
          <Route path="/onboarding/pledge" element={<OnboardingPledge />} />
          <Route path="/onboarding/complete" element={<OnboardingComplete />} />
          
          {/* Parent Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/children/:id/invite" element={<InviteSponsorsPage />} />
          <Route path="/log-reading" element={<LogReadingPage />} />
          
          {/* Sponsor Dashboard */}
          <Route path="/sponsor-dashboard" element={<SponsorDashboardPage />} />
          
          {/* Student Dashboard */}
          <Route path="/student-dashboard" element={<StudentDashboardPage />} />
          <Route path="/student-log-reading" element={<StudentLogReadingPage />} />
          
          {/* Teacher Dashboard */}
          <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
          <Route path="/teacher-log-reading" element={<TeacherLogReadingPage />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin-users" element={<AdminUsersPage />} />
          <Route path="/admin-finance" element={<AdminFinancePage />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
