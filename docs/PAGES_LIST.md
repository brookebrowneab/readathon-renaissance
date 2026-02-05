# Read-a-thon Platform - Pages List

This document lists all pages/routes in the application based on `src/App.tsx`.

*Last updated: 2026-02-05*

---

## Public Pages (7)

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Landing page |
| `/about` | AboutPage | About the read-a-thon |
| `/how-it-works` | HowItWorksPage | How the platform works |
| `/faq` | FAQPage | Frequently asked questions |
| `/privacy` | PrivacyPage | Privacy policy |
| `/sponsor` | SponsorGatewayPage | Sponsor entry point |
| `/sponsor/:childId` | SponsorLandingPage | Child-specific sponsor landing |

---

## Auth Pages (6)

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | LoginPage | Parent/user login |
| `/register` | RegisterPage | New user registration |
| `/student-login` | OldStudentLoginPage | Legacy student login |
| `/forgot-password` | ForgotPasswordPage | Password reset |
| `/sponsor/auth` | SponsorAuthPage | Sponsor authentication |
| `/admin/login` | AdminLoginPage | Admin login |

---

## Onboarding Pages (4)

| Route | Component | Description |
|-------|-----------|-------------|
| `/onboarding/add-child` | OnboardingAddChild | Add first child |
| `/onboarding/pledge` | OnboardingPledge | Initial self-pledge |
| `/onboarding/complete` | OnboardingComplete | Onboarding success |
| `/onboarding/re-enroll` | ReEnrollmentPage | Re-enrollment flow |

---

## Parent/Family Dashboard Pages (14)

| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | DashboardPage | Main parent dashboard |
| `/children` | ManageChildrenPage | Manage children list |
| `/children/:id` | ChildDetailsPage | Individual child details |
| `/family/manage` | ManageChildrenPage | Alias for `/children` |
| `/family/sponsor-requests` | SponsorRequestsPage | Pending sponsor requests |
| `/family/children/:id/settings` | ChildDetailsPage | Alias for child details |
| `/family/sponsor-my-child` | SponsorMyChildPage | Self-sponsor a child |
| `/reading-logs/approve` | VerifyLogsPage | Approve/verify reading logs |
| `/children/:id/invite` | InviteSponsorsPage | Invite sponsors for child |
| `/invite` | InviteSponsorsPage | General invite sponsors |
| `/children/:id/add-sponsor` | AddSponsorPage | Add sponsor directly |
| `/log-reading` | LogReadingPage | Log reading minutes |
| `/my-pledges` | MyPledgesPage | View user's pledges |
| `/account` | AccountSettingsPage | Account settings |

---

## Sponsor Pages (14)

| Route | Component | Description |
|-------|-----------|-------------|
| `/f/:userId` | FamilySponsorPage | Family sponsor page (primary) |
| `/invite/:token` | ChildToFamilyRedirect | Legacy redirect |
| `/s/:code` | ChildToFamilyRedirect | Short code redirect |
| `/returning/:code` | ReturningSponsorPage | Returning sponsor flow |
| `/sponsor/thank-you` | SponsorThankYouPage | Thank you confirmation |
| `/sponsor/pledged` | SponsorPledgedPage | Pledge confirmation |
| `/sponsor/check-instructions` | SponsorCheckInstructionsPage | Check payment instructions |
| `/sponsor/login` | SponsorLoginPage | Sponsor login |
| `/sponsor/check-email` | SponsorCheckEmailPage | Check email for link |
| `/sponsor/dashboard` | SponsorDashboardPage | Sponsor dashboard |
| `/sponsor/pay` | SponsorPaymentPage | Payment page |
| `/sponsor/class` | SponsorClassPage | Class sponsorship |
| `/sponsor/guest-pay` | GuestPaymentPage | Guest payment flow |

---

## Student Pages (6)

| Route | Component | Description |
|-------|-----------|-------------|
| `/student/login` | StudentPinLoginPage | PIN-based student login |
| `/student/dashboard` | StudentPinDashboardPage | Student dashboard (PIN) |
| `/student/books` | StudentBooksPage | Student book tracking |
| `/student` | StudentDashboard | Main student dashboard |
| `/student/log` | StudentLogReading | Log reading (student) |

---

## Teacher Pages (5)

| Route | Component | Description |
|-------|-----------|-------------|
| `/teacher/login` | TeacherLoginPage | Teacher login |
| `/teacher/register` | TeacherRegisterPage | Teacher registration |
| `/teacher/set-password` | TeacherSetPasswordPage | Set initial password |
| `/teacher` | TeacherDashboard | Teacher dashboard |
| `/teacher/log` | TeacherLogReading | Bulk log reading |

---

## Admin Pages (9)

| Route | Component | Description |
|-------|-----------|-------------|
| `/admin` | AdminDashboard | Admin overview dashboard |
| `/admin/reading` | AdminReadingLogsPage | Reading logs management |
| `/admin/outstanding` | AdminOutstandingPage | Outstanding pledges |
| `/admin/checks` | AdminChecksPage | Check payments |
| `/admin/emails` | AdminEmailPage | Email templates & logs |
| `/admin/content` | AdminSiteContentPage | Site content editor |
| `/admin/settings` | AdminSettingsPage | Event settings |
| `/admin-users` | AdminUsersPage | Teacher management |
| `/admin-finance` | AdminFinancePage | Finance overview |

---

## Utility Pages (2)

| Route | Component | Description |
|-------|-----------|-------------|
| `/debug/progress-ring` | DebugRingPage | Debug tool for progress ring |
| `*` | NotFound | 404 page |

---

## Summary

| Category | Count |
|----------|-------|
| Public | 7 |
| Auth | 6 |
| Onboarding | 4 |
| Parent/Family | 14 |
| Sponsor | 14 |
| Student | 6 |
| Teacher | 5 |
| Admin | 9 |
| Utility | 2 |
| **Total** | **67 routes** |

**Note:** Some routes are aliases pointing to the same component (e.g., `/children` and `/family/manage` both render `ManageChildrenPage`). The actual unique page components number approximately **47**.
