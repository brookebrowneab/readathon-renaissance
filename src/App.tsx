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
import OldStudentLoginPage from "./pages/auth/StudentLoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import { OnboardingAddChild, OnboardingPledge, OnboardingComplete, ReEnrollmentPage } from "./pages/onboarding";
import DashboardPage from "./pages/DashboardPage";
import InviteSponsorsPage from "./pages/InviteSponsorsPage";
import AddSponsorPage from "./pages/AddSponsorPage";
import LogReadingPage from "./pages/LogReadingPage";
import SponsorPage from "./pages/SponsorPage";
import SponsorLandingPage from "./pages/SponsorLandingPage";
import { 
  SponsorThankYouPage, 
  SponsorPledgedPage, 
  SponsorCheckInstructionsPage,
  SponsorLoginPage,
  SponsorCheckEmailPage,
  SponsorDashboardPage,
  SponsorPaymentPage,
} from "./pages/sponsor";
import OldSponsorDashboardPage from "./pages/SponsorDashboardPage";
import { StudentLoginPage, StudentDashboardPage as StudentDashboard, StudentLogReadingPage as StudentLogReading } from "./pages/student";
import { TeacherDashboard, TeacherLogReading } from "./pages/teacher";
import OldTeacherDashboardPage from "./pages/TeacherDashboardPage";
import OldTeacherLogReadingPage from "./pages/TeacherLogReadingPage";
import { AdminDashboard, AdminOutstandingPage, AdminChecksPage, AdminSettingsPage, AdminEmailPage } from "./pages/admin";
import OldAdminDashboardPage from "./pages/AdminDashboardPage";
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
          <Route path="/sponsor/thank-you" element={<SponsorThankYouPage />} />
          <Route path="/sponsor/pledged" element={<SponsorPledgedPage />} />
          <Route path="/sponsor/check-instructions" element={<SponsorCheckInstructionsPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/student-login" element={<OldStudentLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Onboarding Routes */}
          <Route path="/onboarding/add-child" element={<OnboardingAddChild />} />
          <Route path="/onboarding/pledge" element={<OnboardingPledge />} />
          <Route path="/onboarding/complete" element={<OnboardingComplete />} />
          <Route path="/onboarding/re-enroll" element={<ReEnrollmentPage />} />
          
          {/* Parent Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/children/:id/invite" element={<InviteSponsorsPage />} />
          <Route path="/children/:id/add-sponsor" element={<AddSponsorPage />} />
          <Route path="/log-reading" element={<LogReadingPage />} />
          
          {/* Sponsor Dashboard */}
          <Route path="/sponsor/login" element={<SponsorLoginPage />} />
          <Route path="/sponsor/check-email" element={<SponsorCheckEmailPage />} />
          <Route path="/sponsor/dashboard" element={<SponsorDashboardPage />} />
          <Route path="/sponsor/pay" element={<SponsorPaymentPage />} />
          <Route path="/sponsor-dashboard" element={<OldSponsorDashboardPage />} />
          
          {/* Student Dashboard */}
          <Route path="/student/login" element={<StudentLoginPage />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/log" element={<StudentLogReading />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-log-reading" element={<StudentLogReading />} />
          
          {/* Teacher Dashboard */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/log" element={<TeacherLogReading />} />
          <Route path="/teacher-dashboard" element={<OldTeacherDashboardPage />} />
          <Route path="/teacher-log-reading" element={<OldTeacherLogReadingPage />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/outstanding" element={<AdminOutstandingPage />} />
          <Route path="/admin/checks" element={<AdminChecksPage />} />
          <Route path="/admin/emails" element={<AdminEmailPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin-dashboard" element={<OldAdminDashboardPage />} />
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
