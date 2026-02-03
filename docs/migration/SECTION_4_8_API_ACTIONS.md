# Section 4.8 API ACTIONS (conceptual)

Generated: 2026-02-03

This document provides exhaustive API action tables for every interactive page in the application. Each table documents every data load on mount and every interaction that creates/updates/deletes data.

---

## HomePage (Route: `/`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| HP-LOAD-001 | getActiveEvent | GET | /events?is_active=true | N | - | - | `{"id":"uuid","name":"Spring Read-a-thon","start_date":"2024-01-15","end_date":"2024-02-28","goal_minutes":500}` | NOT_FOUND |
| HP-LOAD-002 | getSiteContent | GET | /site_content | N | - | - | `[{"key":"hero_headline","value":"Read-a-thon Time!"},...]` | - |

---

## AboutPage (Route: `/about`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AB-LOAD-001 | getSiteContent | GET | /site_content | N | - | - | `[{"key":"about_text","value":"..."}]` | - |

---

## HowItWorksPage (Route: `/how-it-works`)

#### 4.8 API ACTIONS (conceptual)

No API actions (static page).

---

## FAQPage (Route: `/faq`)

#### 4.8 API ACTIONS (conceptual)

No API actions (static page).

---

## PrivacyPage (Route: `/privacy`)

#### 4.8 API ACTIONS (conceptual)

No API actions (static page).

---

## LoginPage (Route: `/login`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| LG-4 | signIn | POST | /auth/token | N | - | `{"email":"user@example.com","password":"secret123"}` | `{"access_token":"jwt","refresh_token":"jwt","user":{...}}` | UNAUTHORIZED ("Invalid login credentials") |

---

## RegisterPage (Route: `/register`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| RG-8 | signUp | POST | /auth/signup | N | - | `{"email":"user@example.com","password":"Secret123!","data":{"display_name":"Jane Doe","phone":"555-1234"}}` | `{"access_token":"jwt","user":{"id":"uuid","email":"user@example.com"}}` | CONFLICT ("User already registered"), VALIDATION_ERROR |

---

## ForgotPasswordPage (Route: `/forgot-password`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| FP-1 | sendPasswordReset | POST | /auth/recovery | N | - | `{"email":"user@example.com"}` | `{"message":"Password reset email sent"}` | NOT_FOUND, RATE_LIMITED |

---

## AdminLoginPage (Route: `/admin/login`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AL-1 | signIn | POST | /auth/token | N | - | `{"email":"admin@example.com","password":"secret123"}` | `{"access_token":"jwt","user":{...}}` | UNAUTHORIZED |
| AL-2 | checkAdminRole | GET | /me/roles | Y | - | - | `{"roles":["admin"]}` | FORBIDDEN |

---

## StudentPinLoginPage (Route: `/student/login`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SL-3 | studentLogin | POST | /functions/student-login | N | - | `{"username":"emma_s","password":"read123"}` | `{"success":true,"child":{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"grade_info":"3rd","class_name":"Mrs. Smith"}}` | UNAUTHORIZED ("Login failed"), VALIDATION_ERROR |
| SL-5 | studentForgotPassword | POST | /functions/student-forgot-password | N | - | `{"username":"emma_s"}` | `{"success":true}` | NOT_FOUND, RATE_LIMITED |

---

## StudentPinDashboardPage (Route: `/student/dashboard`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SD-LOAD-001 | getStudentData | GET | /me/student | Y* | Student | - | `{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500}` | UNAUTHORIZED |
| SD-LOAD-002 | getStudentReadingLogs | GET | /me/student/reading-logs | Y* | Student | - | `[{"id":"uuid","minutes":30,"book_title":"Charlotte's Web","logged_at":"2024-02-01"}]` | - |
| SD-LOAD-003 | getClassReadingStats | GET | /rpc/get_class_reading_stats?p_class_name=Mrs.+Smith | Y* | Student | - | `{"total_minutes":5240,"total_books":45,"student_count":22}` | - |
| SD-LOAD-004 | getGradeTotalMinutes | GET | /rpc/get_grade_total_minutes?p_grade_info=3rd | Y* | Student | - | `12450` | - |
| SD-LOAD-005 | getClassFavoriteBooks | GET | /rpc/get_class_favorite_books?p_class_name=Mrs.+Smith | Y* | Student | - | `[{"book_title":"Dog Man","read_count":12}]` | - |
| SD-LOAD-006 | getGradeFavoriteBooks | GET | /rpc/get_grade_favorite_books?p_grade_info=3rd | Y* | Student | - | `[{"book_title":"Diary of a Wimpy Kid","read_count":28}]` | - |
| SD-6 | createReadingLog | POST | /reading_logs | Y* | Student | `{"child_id":"uuid","student_name":"Emma S","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}` | `{"id":"uuid","minutes":30,...}` | VALIDATION_ERROR, FORBIDDEN |
| SD-7 | updateReadingLog | PATCH | /reading_logs/:id | Y* | Student | `{"minutes":45,"book_title":"Updated Title"}` | `{"id":"uuid","minutes":45,...}` | NOT_FOUND, FORBIDDEN |
| SD-8 | deleteReadingLog | DELETE | /reading_logs/:id | Y* | Student | - | - | NOT_FOUND, FORBIDDEN |

*Note: Student auth uses sessionStorage, not Supabase Auth

---

## StudentBooksPage (Route: `/student/books`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SB-LOAD-001 | getStudentBooks | GET | /me/student/books | Y* | Student | - | `[{"id":"uuid","title":"Dog Man","author":"Dav Pilkey","cover_url":"..."}]` | UNAUTHORIZED |

---

## StudentLogReadingPage (Route: `/student/log`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SLR-LOAD-001 | getActiveEvent | GET | /events?is_active=true | Y* | Student | - | `{"id":"uuid","start_date":"...","end_date":"...","last_log_date":"..."}` | - |
| SLR-1 | createReadingLog | POST | /reading_logs | Y* | Student | `{"child_id":"uuid","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |

---

## TeacherLoginPage (Route: `/teacher/login`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| TL-1 | signIn | POST | /auth/token | N | - | `{"email":"teacher@school.edu","password":"secret123"}` | `{"access_token":"jwt",...}` | UNAUTHORIZED |
| TL-2 | linkTeacherAccount | POST | /functions/link-teacher-account | Y | - | - | `{"teacher":{"id":"uuid","name":"Mrs. Smith"},"linked":true}` | FORBIDDEN |

---

## TeacherRegisterPage (Route: `/teacher/register`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| TR-1 | signUp | POST | /auth/signup | N | - | `{"email":"teacher@school.edu","password":"Secret123!"}` | `{"access_token":"jwt",...}` | CONFLICT |
| TR-2 | linkTeacherAccount | POST | /functions/link-teacher-account | Y | - | - | `{"teacher":{"id":"uuid"},"linked":true}` | NOT_FOUND |

---

## TeacherSetPasswordPage (Route: `/teacher/set-password`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| TSP-1 | setPassword | POST | /functions/student-set-password | N | - | `{"token":"abc123","password":"NewPass123!"}` | `{"success":true}` | VALIDATION_ERROR, NOT_FOUND |

---

## TeacherDashboard (Route: `/teacher`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| TD-LOAD-001 | getTeacherProfile | GET | /teachers?user_id=eq.{user_id}&is_active=eq.true | Y | Teacher | - | `{"id":"uuid","name":"Mrs. Smith","teacher_type":"homeroom","grade_level":"3rd","has_full_access":false}` | NOT_FOUND |
| TD-LOAD-002 | getActiveEvent | GET | /events?is_active=true | Y | Teacher | - | `{"id":"uuid","name":"Spring Read-a-thon","teacher_logging_grades":["K","1st","2nd"]}` | - |
| TD-LOAD-003 | listTeacherStudents | GET | /children?homeroom_teacher_id=eq.{teacher_id} | Y | Teacher | - | `[{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"grade_info":"3rd","class_name":"Mrs. Smith"}]` | - |
| TD-LOAD-004 | getStudentReadingLogs | GET | /reading_logs?child_id=in.(...) | Y | Teacher | - | `[{"id":"uuid","child_id":"uuid","logged_at":"2024-02-01"}]` | - |
| TD-1 | signOut | POST | /auth/logout | Y | Teacher | - | - | - |
| TD-8 | exportStudentReport | GET | /reports/students?format=csv | Y | Teacher | - | CSV file | INTERNAL |

---

## TeacherLogReading (Route: `/teacher/log`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| TLR-LOAD-001 | listTeacherStudents | GET | /children?homeroom_teacher_id=eq.{teacher_id} | Y | Teacher | - | `[{"id":"uuid","name":"Emma S","total_minutes":247}]` | - |
| TLR-LOAD-002 | getActiveEvent | GET | /events?is_active=true | Y | Teacher | - | `{"id":"uuid","teacher_logging_grades":["K","1st"]}` | - |
| TLR-1 | createBulkReadingLogs | POST | /reading_logs | Y | Teacher | `[{"child_id":"uuid1","minutes":30},{"child_id":"uuid2","minutes":30}]` | `[{"id":"uuid1"},{"id":"uuid2"}]` | VALIDATION_ERROR, FORBIDDEN |

---

## DashboardPage (Route: `/dashboard`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| DB-LOAD-001 | getProfile | GET | /profiles?user_id=eq.{user_id} | Y | Parent | - | `{"id":"uuid","display_name":"Jane Doe"}` | NOT_FOUND |
| DB-LOAD-002 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500,"class_name":"Mrs. Smith","grade_info":"3rd"}]` | - |
| DB-LOAD-003 | listPledgesByChild | GET | /pledges?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","child_id":"uuid","amount":50,"pledge_type":"flat","is_paid":false,"sponsor":{"name":"Uncle Bob"}}]` | - |
| DB-LOAD-004 | listReadingLogsByChild | GET | /reading_logs?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}]` | - |
| DB-LOAD-005 | getClassTotalMinutes | GET | /rpc/get_class_total_minutes?p_class_name={class} | Y | Parent | - | `5240` | - |
| DB-LOAD-006 | getGradeTotalMinutes | GET | /rpc/get_grade_total_minutes?p_grade_info={grade} | Y | Parent | - | `12450` | - |
| DB-LOAD-007 | getActiveEvent | GET | /events?is_active=true | Y | Parent | - | `{"id":"uuid","class_milestone_enabled":true,"class_milestone_goal":1000,"class_milestone_reward":"Pizza party"}` | - |
| DB-LOAD-008 | getClassFundraisingTotals | GET | /rpc/get_class_fundraising_total?p_class_name={class} | Y | Parent | - | `750.00` | - |
| DB-1 | signOut | POST | /auth/logout | Y | Parent | - | - | - |
| DB-6 | updatePledge | PATCH | /pledges/:id | Y | Parent | `{"amount":75,"pledge_type":"flat"}` | `{"id":"uuid","amount":75}` | NOT_FOUND, FORBIDDEN |
| DB-7 | deletePledge | DELETE | /pledges/:id | Y | Parent | - | - | NOT_FOUND, FORBIDDEN |

---

## ManageChildrenPage (Route: `/children` or `/family/manage`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| MC-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S","grade_info":"3rd","class_name":"Mrs. Smith","goal_minutes":500,"total_minutes":247}]` | - |
| MC-LOAD-002 | listReadingLogsByChild | GET | /reading_logs?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","minutes":30,"logged_at":"2024-02-01"}]` | - |
| MC-4 | updateChild | PATCH | /children/:id | Y | Parent | `{"name":"Emma Smith","grade_info":"4th","goal_minutes":600}` | `{"id":"uuid",...}` | NOT_FOUND, VALIDATION_ERROR |
| MC-5 | deleteChild | DELETE | /children/:id | Y | Parent | - | - | NOT_FOUND, CONFLICT |

---

## ChildDetailsPage (Route: `/children/:id`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| CD-LOAD-001 | getChild | GET | /children/:id | Y | Parent | - | `{"id":"uuid","name":"Emma S","grade_info":"3rd","student_username":"emma_s","student_login_enabled":true}` | NOT_FOUND, FORBIDDEN |
| CD-LOAD-002 | listTeachers | GET | /teachers?is_active=eq.true | Y | Parent | - | `[{"id":"uuid","name":"Mrs. Smith","grade_level":"3rd"}]` | - |
| CD-LOAD-003 | getChildReadingLogs | GET | /reading_logs?child_id=eq.{id} | Y | Parent | - | `[{"id":"uuid","minutes":30,"logged_at":"2024-02-01"}]` | - |
| CD-1 | updateChild | PATCH | /children/:id | Y | Parent | `{"grade_info":"4th","homeroom_teacher_id":"uuid","goal_minutes":600,"share_public_link":false}` | `{"id":"uuid",...}` | NOT_FOUND, VALIDATION_ERROR |
| CD-2 | updateStudentCredentials | PATCH | /children/:id | Y | Parent | `{"student_username":"emma_smith","student_login_enabled":true}` | `{"id":"uuid",...}` | CONFLICT ("Username taken") |
| CD-3 | setStudentPassword | POST | /functions/student-set-password | Y | Parent | `{"child_id":"uuid","password":"read123"}` | `{"success":true}` | VALIDATION_ERROR |

---

## InviteSponsorsPage (Route: `/children/:id/invite` or `/invite`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| IS-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S"}]` | - |
| IS-LOAD-002 | listSponsorInvitations | GET | /sponsor_invitations?child_id=eq.{id} | Y | Parent | - | `[{"id":"uuid","invitee_email":"grandma@email.com","status":"pending"}]` | - |
| IS-1 | createSponsorInvitation | POST | /sponsor_invitations | Y | Parent | `{"child_id":"uuid","invitee_email":"uncle@email.com","can_invite_others":false}` | `{"id":"uuid",...}` | CONFLICT, VALIDATION_ERROR |
| IS-2 | deleteSponsorInvitation | DELETE | /sponsor_invitations/:id | Y | Parent | - | - | NOT_FOUND |
| IS-3 | resendInvitation | POST | /functions/send-pledge-notification | Y | Parent | `{"invitation_id":"uuid"}` | `{"success":true}` | NOT_FOUND, RATE_LIMITED |

---

## LogReadingPage (Route: `/log-reading`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| LR-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S","total_minutes":247,"goal_minutes":500}]` | - |
| LR-LOAD-002 | getActiveEvent | GET | /events?is_active=true | Y | Parent | - | `{"id":"uuid","start_date":"...","end_date":"...","last_log_date":"..."}` | - |
| LR-LOAD-003 | listChildReadingLogs | GET | /reading_logs?child_id=eq.{id}&order=logged_at.desc | Y | Parent | - | `[{"id":"uuid","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01"}]` | - |
| LR-7 | createReadingLog | POST | /reading_logs | Y | Parent | `{"child_id":"uuid","student_name":"Emma S","minutes":30,"book_title":"Dog Man","logged_at":"2024-02-01","event_id":"uuid"}` | `{"id":"uuid",...}` | VALIDATION_ERROR, FORBIDDEN |
| LR-9 | updateReadingLog | PATCH | /reading_logs/:id | Y | Parent | `{"minutes":45,"book_title":"Updated Book"}` | `{"id":"uuid",...}` | NOT_FOUND, FORBIDDEN |
| LR-10 | deleteReadingLog | DELETE | /reading_logs/:id | Y | Parent | - | - | NOT_FOUND, FORBIDDEN |

---

## MyPledgesPage (Route: `/my-pledges`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| MP-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S","total_minutes":247}]` | - |
| MP-LOAD-002 | listPledges | GET | /pledges?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","amount":50,"pledge_type":"flat","is_paid":false,"sponsor":{"name":"Uncle Bob"}}]` | - |
| MP-LOAD-003 | listPayments | GET | /payments?payer_user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","amount":50,"pledge_id":"uuid","square_receipt_url":"https://..."}]` | - |
| MP-1 | updatePledge | PATCH | /pledges/:id | Y | Parent | `{"amount":75,"pledge_type":"per_minute"}` | `{"id":"uuid",...}` | NOT_FOUND, FORBIDDEN |
| MP-2 | deletePledge | DELETE | /pledges/:id | Y | Parent | - | - | NOT_FOUND, FORBIDDEN |

---

## VerifyLogsPage (Route: `/reading-logs/approve`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| VL-LOAD-001 | listVerificationRequests | GET | /log_verification_requests?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","reading_log_id":"uuid","minutes":120,"status":"pending","child":{"name":"Emma S"}}]` | - |
| VL-1 | approveLog | PATCH | /log_verification_requests/:id | Y | Parent | `{"status":"approved","reviewed_by":"{user_id}","reviewed_at":"2024-02-01T12:00:00Z"}` | `{"id":"uuid","status":"approved"}` | NOT_FOUND, FORBIDDEN |
| VL-2 | rejectLog | PATCH | /log_verification_requests/:id | Y | Parent | `{"status":"rejected","reviewed_by":"{user_id}","reviewed_at":"2024-02-01T12:00:00Z"}` | `{"id":"uuid","status":"rejected"}` | NOT_FOUND, FORBIDDEN |
| VL-3 | bulkApprove | PATCH | /log_verification_requests | Y | Parent | `{"ids":["uuid1","uuid2"],"status":"approved"}` | `[{"id":"uuid1"},{"id":"uuid2"}]` | VALIDATION_ERROR |
| VL-4 | bulkReject | PATCH | /log_verification_requests | Y | Parent | `{"ids":["uuid1","uuid2"],"status":"rejected"}` | `[{"id":"uuid1"},{"id":"uuid2"}]` | VALIDATION_ERROR |

---

## AccountSettingsPage (Route: `/account`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AS-LOAD-001 | getProfile | GET | /profiles?user_id=eq.{user_id} | Y | Parent | - | `{"id":"uuid","display_name":"Jane Doe","phone":"555-1234"}` | NOT_FOUND |
| AS-LOAD-002 | getUser | GET | /me | Y | Parent | - | `{"id":"uuid","email":"jane@example.com"}` | UNAUTHORIZED |
| AS-1 | updateProfile | PATCH | /profiles/:id | Y | Parent | `{"display_name":"Jane Smith","phone":"555-5678"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| AS-2 | updatePassword | POST | /auth/user | Y | Parent | `{"password":"NewPassword123!"}` | `{"success":true}` | VALIDATION_ERROR |
| AS-3 | signOut | POST | /auth/logout | Y | Parent | - | - | - |

---

## SponsorRequestsPage (Route: `/family/sponsor-requests`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SR-LOAD-001 | listSponsorInvitations | GET | /sponsor_invitations?child_id=in.(...) | Y | Parent | - | `[{"id":"uuid","invitee_email":"sponsor@email.com","status":"pending","child":{"name":"Emma S"}}]` | - |
| SR-1 | approveInvitation | PATCH | /sponsor_invitations/:id | Y | Parent | `{"status":"approved"}` | `{"id":"uuid","status":"approved"}` | NOT_FOUND |
| SR-2 | rejectInvitation | PATCH | /sponsor_invitations/:id | Y | Parent | `{"status":"rejected"}` | `{"id":"uuid","status":"rejected"}` | NOT_FOUND |

---

## SponsorMyChildPage (Route: `/family/sponsor-my-child`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SMC-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S"}]` | - |
| SMC-1 | createPledge | POST | /pledges | Y | Parent | `{"child_id":"uuid","student_name":"Emma S","amount":50,"pledge_type":"flat","expected_payment_method":"card"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |

---

## OnboardingAddChild (Route: `/onboarding/add-child`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| OA-LOAD-001 | listTeachers | GET | /teachers?is_active=eq.true&teacher_type=eq.homeroom | Y | Parent | - | `[{"id":"uuid","name":"Mrs. Smith","grade_level":"3rd"}]` | - |
| OA-LOAD-002 | listAvailableGrades | GET | /children?select=grade_info | Y | Parent | - | `["K","1st","2nd","3rd","4th","5th"]` | - |
| OA-10 | createChild | POST | /children | Y | Parent | `{"name":"Emma Smith","grade_info":"3rd","class_name":"Mrs. Smith","goal_minutes":500,"homeroom_teacher_id":"uuid","share_public_link":true}` | `{"id":"uuid",...}` | VALIDATION_ERROR, CONFLICT |

---

## OnboardingPledge (Route: `/onboarding/pledge`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| OP-LOAD-001 | listChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S"}]` | - |
| OP-1 | createPledge | POST | /pledges | Y | Parent | `{"child_id":"uuid","student_name":"Emma S","amount":50,"pledge_type":"flat","expected_payment_method":"card"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |

---

## OnboardingComplete (Route: `/onboarding/complete`)

#### 4.8 API ACTIONS (conceptual)

No API actions (static success page).

---

## ReEnrollmentPage (Route: `/onboarding/re-enroll`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| RE-LOAD-001 | getProfile | GET | /profiles?user_id=eq.{user_id} | Y | Parent | - | `{"display_name":"Jane Doe"}` | - |
| RE-LOAD-002 | listPreviousChildren | GET | /children?user_id=eq.{user_id} | Y | Parent | - | `[{"id":"uuid","name":"Emma S","grade_info":"3rd"}]` | - |
| RE-LOAD-003 | listTeachers | GET | /teachers?is_active=eq.true | Y | Parent | - | `[{"id":"uuid","name":"Mrs. Smith","grade_level":"4th"}]` | - |
| RE-LOAD-004 | listPreviousSponsors | GET | /pledges?child_id=in.(...)&select=sponsor(*) | Y | Parent | - | `[{"sponsor":{"id":"uuid","name":"Uncle Bob","email":"bob@email.com"}}]` | - |
| RE-1 | updateChildren | PATCH | /children | Y | Parent | `[{"id":"uuid","grade_info":"4th","homeroom_teacher_id":"uuid","goal_minutes":500}]` | `[{"id":"uuid",...}]` | VALIDATION_ERROR |
| RE-2 | sendSponsorReInvites | POST | /functions/send-pledge-notification | Y | Parent | `{"sponsor_ids":["uuid1","uuid2"],"child_ids":["uuid"]}` | `{"sent":2}` | RATE_LIMITED |

---

## SponsorGatewayPage (Route: `/sponsor`)

#### 4.8 API ACTIONS (conceptual)

No API actions (static gateway page with navigation links).

---

## SponsorLandingPage (Route: `/sponsor/:childId`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SLP-LOAD-001 | getPublicChild | GET | /children_public_safe?id=eq.{childId} | N | - | - | `{"id":"uuid","display_name":"Emma S.","grade_info":"3rd","total_minutes":247,"goal_minutes":500}` | NOT_FOUND |

---

## FamilySponsorPage (Route: `/f/:userId`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| FS-LOAD-001 | listFamilyChildren | GET | /children_public_safe?user_id=eq.{userId}&share_public_link=eq.true | N | - | - | `[{"id":"uuid","display_name":"Emma S.","grade_info":"3rd","total_minutes":247}]` | - |
| FS-LOAD-002 | getActiveEvent | GET | /events?is_active=true | N | - | - | `{"id":"uuid","name":"Spring Read-a-thon","end_date":"2024-02-28"}` | - |
| FS-LOAD-003 | getSponsorProfile | GET | /sponsors?user_id=eq.{user_id} | Y | Sponsor | - | `{"id":"uuid","name":"Uncle Bob","email":"bob@email.com"}` | - |
| FS-12 | createPledges | POST | /pledges | Y | Sponsor | `[{"child_id":"uuid1","amount":50,"pledge_type":"flat"},{"child_id":"uuid2","amount":50,"pledge_type":"flat"}]` | `[{"id":"uuid1"},{"id":"uuid2"}]` | VALIDATION_ERROR |
| FS-13 | signOut | POST | /auth/logout | Y | Sponsor | - | - | - |

---

## SponsorAuthPage (Route: `/sponsor/auth`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SA-1 | sendMagicLink | POST | /auth/magiclink | N | - | `{"email":"sponsor@email.com"}` | `{"message":"Magic link sent"}` | RATE_LIMITED |
| SA-2 | checkExistingUser | GET | /auth/user?email={email} | N | - | - | `{"exists":true}` | - |

---

## SponsorLoginPage (Route: `/sponsor/login`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SLG-1 | signIn | POST | /auth/token | N | - | `{"email":"sponsor@email.com","password":"secret123"}` | `{"access_token":"jwt",...}` | UNAUTHORIZED |

---

## SponsorCheckEmailPage (Route: `/sponsor/check-email`)

#### 4.8 API ACTIONS (conceptual)

No API actions (static instruction page).

---

## SponsorDashboardPage (Route: `/sponsor/dashboard`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SPD-LOAD-001 | getSponsorProfile | GET | /sponsors?user_id=eq.{user_id} | Y | Sponsor | - | `{"id":"uuid","name":"Uncle Bob","email":"bob@email.com"}` | NOT_FOUND |
| SPD-LOAD-002 | listSponsorPledges | GET | /pledges?sponsor_id=eq.{sponsor_id} | Y | Sponsor | - | `[{"id":"uuid","child":{"name":"Emma S","total_minutes":247},"amount":50,"is_paid":false}]` | - |
| SPD-LOAD-003 | listSponsorClassPledges | GET | /class_pledges?sponsor_user_id=eq.{user_id} | Y | Sponsor | - | `[{"id":"uuid","class_name":"Mrs. Smith","amount":100,"is_paid":false,"teacher":{"name":"Mrs. Smith"}}]` | - |
| SPD-LOAD-004 | getActiveEvent | GET | /events?is_active=true | Y | Sponsor | - | `{"id":"uuid","class_milestone_goal":1000,"class_milestone_reward":"Pizza party"}` | - |
| SPD-LOAD-005 | getClassFundraisingTotal | GET | /rpc/get_class_fundraising_total?p_class_name={class} | Y | Sponsor | - | `750.00` | - |
| SPD-1 | updateSponsorProfile | PATCH | /sponsors/:id | Y | Sponsor | `{"name":"Robert Smith","phone":"555-1234"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| SPD-2 | signOut | POST | /auth/logout | Y | Sponsor | - | - | - |

---

## SponsorPaymentPage (Route: `/sponsor/pay`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SPP-LOAD-001 | listUnpaidPledges | GET | /pledges?sponsor_id=eq.{sponsor_id}&is_paid=eq.false | Y | Sponsor | - | `[{"id":"uuid","child":{"name":"Emma S"},"amount":50}]` | - |
| SPP-LOAD-002 | getSponsorProfile | GET | /sponsors?user_id=eq.{user_id} | Y | Sponsor | - | `{"name":"Uncle Bob","email":"bob@email.com"}` | - |
| SPP-LOAD-003 | getActiveEvent | GET | /events?is_active=true | Y | Sponsor | - | `{"payment_address":"123 School St...","school_name":"Lincoln Elementary"}` | - |
| SPP-1 | processCardPayment | POST | /functions/process-square-payment | Y | Sponsor | `{"amount":50.00,"pledgeIds":["uuid1"],"sourceId":"cnon:card-nonce-ok","payerName":"Uncle Bob","payerEmail":"bob@email.com"}` | `{"success":true,"receiptUrl":"https://squareup.com/receipt/..."}` | VALIDATION_ERROR, INTERNAL ("Payment failed") |
| SPP-2 | markCheckPayment | POST | /functions/notify-check-payment | Y | Sponsor | `{"pledgeIds":["uuid1"],"payerName":"Uncle Bob","amount":50}` | `{"success":true}` | VALIDATION_ERROR |

---

## SponsorClassPage (Route: `/sponsor/class`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SCP-LOAD-001 | listTeachers | GET | /teachers?is_active=eq.true&teacher_type=eq.homeroom | Y | Sponsor | - | `[{"id":"uuid","name":"Mrs. Smith","grade_level":"3rd"}]` | - |
| SCP-LOAD-002 | getActiveEvent | GET | /events?is_active=true | Y | Sponsor | - | `{"id":"uuid","class_milestone_goal":1000}` | - |
| SCP-1 | createClassPledge | POST | /class_pledges | Y | Sponsor | `{"class_name":"Mrs. Smith","teacher_id":"uuid","amount":100,"pledge_type":"flat","sponsor_user_id":"{user_id}"}` | `{"id":"uuid","payment_token":"uuid"}` | VALIDATION_ERROR |

---

## GuestPaymentPage (Route: `/sponsor/guest-pay`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| GP-LOAD-001 | getClassPledgeByToken | GET | /class_pledges?payment_token=eq.{token} | N | - | - | `{"id":"uuid","class_name":"Mrs. Smith","amount":100,"is_paid":false,"teacher":{"name":"Mrs. Smith"}}` | NOT_FOUND |
| GP-LOAD-002 | getActiveEvent | GET | /events?is_active=true | N | - | - | `{"payment_address":"...","school_name":"Lincoln Elementary"}` | - |
| GP-1 | processGuestCardPayment | POST | /functions/process-square-payment | N | - | `{"amount":100.00,"classPledgeId":"uuid","sourceId":"cnon:card-nonce-ok","payerName":"Guest","payerEmail":"guest@email.com"}` | `{"success":true,"receiptUrl":"https://..."}` | VALIDATION_ERROR, INTERNAL |
| GP-2 | markGuestCheckPayment | PATCH | /payments | N | - | `{"class_pledge_id":"uuid","payment_method":"check","notes":"Check pending"}` | `{"id":"uuid"}` | NOT_FOUND |

---

## SponsorThankYouPage (Route: `/sponsor/thank-you`)

#### 4.8 API ACTIONS (conceptual)

No API actions (static thank you page with mock data).

---

## SponsorPledgedPage (Route: `/sponsor/pledged`)

#### 4.8 API ACTIONS (conceptual)

No API actions (static confirmation page with mock data).

---

## SponsorCheckInstructionsPage (Route: `/sponsor/check-instructions`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| SCI-LOAD-001 | getActiveEvent | GET | /events?is_active=true | N | - | - | `{"payment_address":"...","school_name":"Lincoln Elementary"}` | - |

---

## ChildToFamilyRedirect (Route: `/invite/:token` and `/s/:code`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| CFR-LOAD-001 | resolveChildToFamily | GET | /children/:id?select=user_id | N | - | - | `{"user_id":"uuid"}` | NOT_FOUND |

---

## ReturningSponsorPage (Route: `/returning/:code`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| RSP-LOAD-001 | getSponsorByCode | GET | /sponsors?id=eq.{code} | N | - | - | `{"id":"uuid","name":"Uncle Bob","email":"bob@email.com"}` | NOT_FOUND |

---

## AdminDashboard (Route: `/admin`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AD-LOAD-001 | getActiveEvent | GET | /events?is_active=true | Y | Admin | - | `{"id":"uuid","name":"Spring Read-a-thon","start_date":"...","end_date":"..."}` | - |
| AD-LOAD-002 | getAdminMetrics | GET | /admin/metrics | Y | Admin | - | `{"studentsEnrolled":150,"totalMinutes":45000,"totalPledged":5000,"totalCollected":3500}` | - |
| AD-LOAD-003 | listOutstandingPledges | GET | /pledges?is_paid=eq.false&limit=5 | Y | Admin | - | `[{"id":"uuid","sponsor":{"name":"Uncle Bob"},"amount":50,"created_at":"..."}]` | - |
| AD-LOAD-004 | listRecentActivity | GET | /admin/activity?limit=10 | Y | Admin | - | `[{"type":"pledge","message":"Uncle Bob pledged $50","time":"2 hours ago"}]` | - |
| AD-LOAD-005 | getAlerts | GET | /admin/alerts | Y | Admin | - | `[{"id":"outstanding","count":12,"label":"Outstanding payments","link":"/admin/outstanding"}]` | - |
| AD-1 | sendBulkReminders | POST | /functions/send-payment-reminder | Y | Admin | `{"pledgeIds":["uuid1","uuid2"]}` | `{"sent":2,"failed":0}` | INTERNAL |
| AD-2 | exportStudentsReport | GET | /admin/reports/students?format=csv | Y | Admin | - | CSV file | INTERNAL |
| AD-3 | exportPledgesReport | GET | /admin/reports/pledges?format=csv | Y | Admin | - | CSV file | INTERNAL |
| AD-4 | exportPaymentsReport | GET | /admin/reports/payments?format=csv | Y | Admin | - | CSV file | INTERNAL |

---

## AdminReadingLogsPage (Route: `/admin/reading`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| ARL-LOAD-001 | listAllReadingLogs | GET | /reading_logs?order=logged_at.desc | Y | Admin | - | `[{"id":"uuid","student_name":"Emma S","minutes":30,"logged_at":"2024-02-01"}]` | - |
| ARL-LOAD-002 | listChildren | GET | /children | Y | Admin | - | `[{"id":"uuid","name":"Emma S","class_name":"Mrs. Smith"}]` | - |
| ARL-1 | deleteReadingLog | DELETE | /reading_logs/:id | Y | Admin | - | - | NOT_FOUND |
| ARL-2 | updateReadingLog | PATCH | /reading_logs/:id | Y | Admin | `{"minutes":45}` | `{"id":"uuid","minutes":45}` | NOT_FOUND, VALIDATION_ERROR |

---

## AdminOutstandingPage (Route: `/admin/outstanding`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AO-LOAD-001 | listOutstandingPledges | GET | /pledges?is_paid=eq.false&select=*,child(*),sponsor(*) | Y | Admin | - | `[{"id":"uuid","amount":50,"sponsor":{"name":"Uncle Bob","email":"bob@email.com"},"child":{"name":"Emma S","total_minutes":247}}]` | - |
| AO-1 | sendPaymentReminder | POST | /functions/send-payment-reminder | Y | Admin | `{"pledgeIds":["uuid"],"recipientEmail":"bob@email.com","recipientName":"Uncle Bob"}` | `{"success":true}` | INTERNAL |
| AO-2 | sendBulkReminders | POST | /functions/send-payment-reminder | Y | Admin | `{"pledgeIds":["uuid1","uuid2"]}` | `{"sent":2,"failed":0}` | INTERNAL |
| AO-3 | exportOutstanding | GET | /admin/reports/outstanding?format=csv | Y | Admin | - | CSV file | INTERNAL |

---

## AdminChecksPage (Route: `/admin/checks`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AC-LOAD-001 | listCheckPayments | GET | /payments?payment_method=eq.check | Y | Admin | - | `[{"id":"uuid","amount":50,"payer_name":"Martha Johnson","status":"pending"}]` | - |
| AC-LOAD-002 | getActiveEvent | GET | /events?is_active=true | Y | Admin | - | `{"payment_address":"..."}` | - |
| AC-1 | markCheckReceived | PATCH | /payments/:id | Y | Admin | `{"status":"completed","notes":"Check #1234 received 12/20"}` | `{"id":"uuid","status":"completed"}` | NOT_FOUND |
| AC-2 | markCheckBounced | PATCH | /payments/:id | Y | Admin | `{"status":"failed","notes":"NSF - bank returned"}` | `{"id":"uuid","status":"failed"}` | NOT_FOUND |
| AC-3 | sendBouncedReminder | POST | /functions/send-payment-reminder | Y | Admin | `{"pledgeId":"uuid","type":"bounced"}` | `{"success":true}` | INTERNAL |
| AC-4 | exportCheckReport | GET | /admin/reports/checks?format=csv | Y | Admin | - | CSV file | INTERNAL |

---

## AdminEmailPage (Route: `/admin/emails`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AE-LOAD-001 | listEmailTemplates | GET | /email_templates?order=created_at.desc | Y | Admin | - | `[{"id":"uuid","name":"Payment Reminder","subject":"...","status":"draft"}]` | - |
| AE-LOAD-002 | listEmailLogs | GET | /email_logs?order=created_at.desc&limit=50 | Y | Admin | - | `[{"id":"uuid","recipient_email":"bob@email.com","subject":"...","status":"sent"}]` | - |
| AE-LOAD-003 | getRecipientCounts | GET | /admin/email-recipient-counts | Y | Admin | - | `{"all_sponsors":50,"unpaid_sponsors":25,"overdue_sponsors":10}` | - |
| AE-LOAD-004 | listEmailRecipients | GET | /admin/email-recipients | Y | Admin | - | `[{"id":"uuid","name":"Uncle Bob","email":"bob@email.com","type":"sponsor"}]` | - |
| AE-1 | createEmailTemplate | POST | /email_templates | Y | Admin | `{"name":"New Template","subject":"Hello","body":"...","recipient_filter":"all_sponsors"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| AE-2 | updateEmailTemplate | PATCH | /email_templates/:id | Y | Admin | `{"subject":"Updated Subject","body":"..."}` | `{"id":"uuid",...}` | NOT_FOUND |
| AE-3 | deleteEmailTemplate | DELETE | /email_templates/:id | Y | Admin | - | - | NOT_FOUND |
| AE-4 | duplicateEmailTemplate | POST | /email_templates | Y | Admin | `{"name":"Template (Copy)","subject":"...","body":"..."}` | `{"id":"uuid",...}` | - |
| AE-5 | sendTemplateEmail | POST | /functions/send-template-email | Y | Admin | `{"templateId":"uuid","subject":"...","body":"...","recipients":[{"email":"bob@email.com","name":"Uncle Bob"}]}` | `{"sent":25,"failed":0}` | INTERNAL, RATE_LIMITED |
| AE-6 | scheduleEmailTemplate | PATCH | /email_templates/:id | Y | Admin | `{"status":"scheduled","scheduled_for":"2024-02-15T09:00:00Z"}` | `{"id":"uuid","status":"scheduled"}` | VALIDATION_ERROR |

---

## AdminSiteContentPage (Route: `/admin/content`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| ASC-LOAD-001 | listSiteContent | GET | /site_content | Y | Admin | - | `[{"id":"uuid","key":"hero_headline","value":"Read-a-thon Time!","description":"Main headline"}]` | - |
| ASC-1 | updateSiteContent | PATCH | /site_content/:id | Y | Admin | `{"value":"New headline text"}` | `{"id":"uuid","value":"New headline text"}` | NOT_FOUND, VALIDATION_ERROR |
| ASC-2 | createSiteContent | POST | /site_content | Y | Admin | `{"key":"new_key","value":"New content","content_type":"text"}` | `{"id":"uuid",...}` | CONFLICT |

---

## AdminSettingsPage (Route: `/admin/settings`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| ASet-LOAD-001 | getActiveEvent | GET | /events?is_active=true | Y | Admin | - | `{"id":"uuid","name":"Spring Read-a-thon","start_date":"...","end_date":"...","payment_address":"...","teacher_logging_grades":["K","1st"]}` | - |
| ASet-LOAD-002 | listAvailableGrades | GET | /children?select=grade_info | Y | Admin | - | `["K","1st","2nd","3rd","4th","5th"]` | - |
| ASet-LOAD-003 | listTeachers | GET | /teachers | Y | Admin | - | `[{"id":"uuid","name":"Mrs. Smith","is_active":true}]` | - |
| ASet-1 | updateEvent | PATCH | /events/:id | Y | Admin | `{"name":"Updated Name","start_date":"2024-01-15","end_date":"2024-02-28","payment_address":"...","class_milestone_goal":1000}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| ASet-2 | endEvent | PATCH | /events/:id | Y | Admin | `{"is_active":false}` | `{"id":"uuid","is_active":false}` | FORBIDDEN |
| ASet-3 | createEvent | POST | /events | Y | Admin | `{"name":"New Read-a-thon","start_date":"2024-09-01","end_date":"2024-10-31","last_log_date":"2024-11-05"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| ASet-4 | createTeacher | POST | /teachers | Y | Admin | `{"name":"Mr. Johnson","email":"johnson@school.edu","teacher_type":"homeroom","grade_level":"4th"}` | `{"id":"uuid",...}` | CONFLICT |
| ASet-5 | updateTeacher | PATCH | /teachers/:id | Y | Admin | `{"name":"Updated Name","is_active":false}` | `{"id":"uuid",...}` | NOT_FOUND |
| ASet-6 | deleteTeacher | DELETE | /teachers/:id | Y | Admin | - | - | NOT_FOUND, CONFLICT |
| ASet-7 | sendTeacherInvite | POST | /functions/send-teacher-invite | Y | Admin | `{"teacherId":"uuid","email":"teacher@school.edu"}` | `{"success":true}` | NOT_FOUND, RATE_LIMITED |
| ASet-8 | updateLogVerificationThresholds | PATCH | /events/:id | Y | Admin | `{"log_verification_enabled":true,"log_verification_thresholds":{"K":60,"1st":60,"default":90}}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| ASet-9 | generateEventLogo | POST | /admin/generate-logo | Y | Admin | `{"eventName":"Spring Read-a-thon","dateText":"Jan 15 - Feb 28"}` | `{"logoUrl":"https://..."}` | INTERNAL |
| ASet-10 | uploadEventLogo | PUT | /storage/event-logos/:filename | Y | Admin | (binary file) | `{"url":"https://..."}` | VALIDATION_ERROR |

---

## AdminUsersPage (Route: `/admin-users`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AU-LOAD-001 | listProfiles | GET | /profiles | Y | Admin | - | `[{"id":"uuid","user_id":"uuid","display_name":"Jane Doe"}]` | - |
| AU-LOAD-002 | listUserRoles | GET | /user_roles | Y | Admin | - | `[{"id":"uuid","user_id":"uuid","role":"admin"}]` | - |
| AU-LOAD-003 | listChildren | GET | /children | Y | Admin | - | `[{"id":"uuid","name":"Emma S","user_id":"uuid"}]` | - |
| AU-1 | assignRole | POST | /user_roles | Y | Admin | `{"user_id":"uuid","role":"teacher"}` | `{"id":"uuid",...}` | CONFLICT |
| AU-2 | removeRole | DELETE | /user_roles/:id | Y | Admin | - | - | NOT_FOUND |
| AU-3 | resetUserPassword | POST | /functions/admin-reset-password | Y | Admin | `{"userId":"uuid"}` | `{"success":true}` | NOT_FOUND |

---

## AdminFinancePage (Route: `/admin-finance`)

#### 4.8 API ACTIONS (conceptual)

| Interaction ID | Action Name | HTTP Method (suggested) | Endpoint (suggested) | Auth Required (Y/N) | Role(s) | Request Payload (example JSON) | Response Payload (example JSON) | Error Codes / Cases |
|---|---|---|---|---|---|---|---|---|
| AF-LOAD-001 | listAllPledges | GET | /pledges?select=*,child(*),sponsor(*) | Y | Admin | - | `[{"id":"uuid","amount":50,"is_paid":true,"child":{"name":"Emma S"},"sponsor":{"name":"Uncle Bob"}}]` | - |
| AF-LOAD-002 | listPayments | GET | /payments?order=created_at.desc | Y | Admin | - | `[{"id":"uuid","amount":50,"payer_name":"Uncle Bob","square_payment_id":"...","square_receipt_url":"..."}]` | - |
| AF-LOAD-003 | listClassPledges | GET | /class_pledges?sponsor_user_id=eq.00000000-0000-0000-0000-000000000000 | Y | Admin | - | `[{"id":"uuid","class_name":"Mrs. Smith","amount":100,"is_paid":false}]` | - |
| AF-LOAD-004 | getFinanceSummary | GET | /admin/finance/summary | Y | Admin | - | `{"totalPledged":5000,"totalCollected":3500,"outstanding":1500,"collectionRate":70,"largePledgeCount":5}` | - |
| AF-1 | markPledgeAsPaid | PATCH | /pledges/:id | Y | Admin | `{"is_paid":true,"payment_status":"paid"}` | `{"id":"uuid","is_paid":true}` | NOT_FOUND |
| AF-2 | markPledgeAsUnpaid | PATCH | /pledges/:id | Y | Admin | `{"is_paid":false,"payment_status":"pending"}` | `{"id":"uuid","is_paid":false}` | NOT_FOUND |
| AF-3 | bulkMarkAsPaid | PATCH | /pledges | Y | Admin | `{"ids":["uuid1","uuid2"],"is_paid":true}` | `[{"id":"uuid1"},{"id":"uuid2"}]` | VALIDATION_ERROR |
| AF-4 | sendPaymentReminders | POST | /functions/send-payment-reminder | Y | Admin | `{"pledgeIds":["uuid1","uuid2"]}` | `{"sent":2,"failed":0}` | INTERNAL |
| AF-5 | createManualPayment | POST | /payments | Y | Admin | `{"pledge_id":"uuid","amount":50,"payer_name":"Cash Payer","payment_method":"cash","notes":"Cash payment"}` | `{"id":"uuid",...}` | VALIDATION_ERROR |
| AF-6 | exportFinanceReport | GET | /admin/reports/finance?format=csv&from={date}&to={date} | Y | Admin | - | CSV file | INTERNAL |
| AF-7 | markGuestPledgeAsPaid | PATCH | /class_pledges/:id | Y | Admin | `{"is_paid":true}` | `{"id":"uuid","is_paid":true}` | NOT_FOUND |
| AF-8 | sendGuestPaymentEmails | POST | /functions/send-guest-payment-email | Y | Admin | `{"classPledgeIds":["uuid1","uuid2"]}` | `{"sent":2,"failed":0}` | INTERNAL |
| AF-9 | copyPaymentLink | GET | /class_pledges/:id?select=payment_token | Y | Admin | - | `{"payment_token":"uuid"}` | NOT_FOUND |

---

## DebugRingPage (Route: `/debug/progress-ring`)

#### 4.8 API ACTIONS (conceptual)

No API actions (debug utility page).

---

## NotFound (Route: `*`)

#### 4.8 API ACTIONS (conceptual)

No API actions (static 404 page).
