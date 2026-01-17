import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPage from "./pages/PrivacyPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import OldStudentLoginPage from "./pages/auth/StudentLoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";
import { OnboardingAddChild, OnboardingPledge, OnboardingComplete, ReEnrollmentPage } from "./pages/onboarding";
import DashboardPage from "./pages/DashboardPage";
import InviteSponsorsPage from "./pages/InviteSponsorsPage";
import AddSponsorPage from "./pages/AddSponsorPage";
import LogReadingPage from "./pages/LogReadingPage";
import SponsorPage from "./pages/SponsorPage";
import SponsorLandingPage from "./pages/SponsorLandingPage";
import { 
  SponsorGatewayPage,
  SponsorAuthPage,
  SponsorThankYouPage, 
  SponsorPledgedPage, 
  SponsorCheckInstructionsPage,
  SponsorLoginPage,
  SponsorCheckEmailPage,
  SponsorDashboardPage,
  SponsorPaymentPage,
  ReturningSponsorPage,
} from "./pages/sponsor";
import { StudentLoginPage, StudentDashboardPage as StudentDashboard, StudentLogReadingPage as StudentLogReading } from "./pages/student";
import { TeacherDashboard, TeacherLogReading } from "./pages/teacher";
import { AdminDashboard, AdminOutstandingPage, AdminChecksPage, AdminSettingsPage, AdminEmailPage } from "./pages/admin";
import { SponsorRequestsPage, ChildSettingsPage, SponsorMyChildPage, ManageChildrenPage, ChildDetailsPage } from "./pages/family";
import { VerifyLogsPage } from "./pages/reading-logs";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminFinancePage from "./pages/AdminFinancePage";
import DebugRingPage from "./pages/DebugRingPage";
import NotFound from "./pages/NotFound";
import { RequireAdmin } from "./components/auth/RequireAdmin";

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
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/debug/progress-ring" element={<DebugRingPage />} />
          <Route path="/sponsor" element={<SponsorGatewayPage />} />
          <Route path="/sponsor/:childId" element={<SponsorPage />} />
          <Route path="/invite/:token" element={<SponsorLandingPage />} />
          <Route path="/s/:code" element={<SponsorLandingPage />} />
          <Route path="/returning/:code" element={<ReturningSponsorPage />} />
          <Route path="/sponsor/thank-you" element={<SponsorThankYouPage />} />
          <Route path="/sponsor/pledged" element={<SponsorPledgedPage />} />
          <Route path="/sponsor/check-instructions" element={<SponsorCheckInstructionsPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/student-login" element={<OldStudentLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/sponsor/auth" element={<SponsorAuthPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          
          {/* Onboarding Routes */}
          <Route path="/onboarding/add-child" element={<OnboardingAddChild />} />
          <Route path="/onboarding/pledge" element={<OnboardingPledge />} />
          <Route path="/onboarding/complete" element={<OnboardingComplete />} />
          <Route path="/onboarding/re-enroll" element={<ReEnrollmentPage />} />
          
          {/* Parent/Family Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/children" element={<ManageChildrenPage />} />
          <Route path="/children/:id" element={<ChildDetailsPage />} />
          <Route path="/family/manage" element={<ManageChildrenPage />} />
          <Route path="/family/sponsor-requests" element={<SponsorRequestsPage />} />
          <Route path="/family/children/:id/settings" element={<ChildSettingsPage />} />
          <Route path="/family/sponsor-my-child" element={<SponsorMyChildPage />} />
          <Route path="/reading-logs/approve" element={<VerifyLogsPage />} />
          <Route path="/children/:id/invite" element={<InviteSponsorsPage />} />
          <Route path="/invite" element={<InviteSponsorsPage />} />
          <Route path="/children/:id/add-sponsor" element={<AddSponsorPage />} />
          <Route path="/log-reading" element={<LogReadingPage />} />
          
          {/* Sponsor Dashboard */}
          <Route path="/sponsor/login" element={<SponsorLoginPage />} />
          <Route path="/sponsor/check-email" element={<SponsorCheckEmailPage />} />
          <Route path="/sponsor/dashboard" element={<SponsorDashboardPage />} />
          <Route path="/sponsor/pay" element={<SponsorPaymentPage />} />
          
          {/* Student Dashboard */}
          <Route path="/student/login" element={<StudentLoginPage />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/log" element={<StudentLogReading />} />
          
          {/* Teacher Dashboard */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/log" element={<TeacherLogReading />} />
          
          {/* Admin Dashboard - Protected */}
          <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
          <Route path="/admin/outstanding" element={<RequireAdmin><AdminOutstandingPage /></RequireAdmin>} />
          <Route path="/admin/checks" element={<RequireAdmin><AdminChecksPage /></RequireAdmin>} />
          <Route path="/admin/emails" element={<RequireAdmin><AdminEmailPage /></RequireAdmin>} />
          <Route path="/admin/settings" element={<RequireAdmin><AdminSettingsPage /></RequireAdmin>} />
          <Route path="/admin-users" element={<RequireAdmin><AdminUsersPage /></RequireAdmin>} />
          <Route path="/admin-finance" element={<RequireAdmin><AdminFinancePage /></RequireAdmin>} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
