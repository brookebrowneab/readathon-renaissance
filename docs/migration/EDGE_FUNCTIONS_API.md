# Edge Functions API Reference

Generated: 2026-02-03

This document provides complete API signatures for all Supabase Edge Functions in the project.

---

## Table of Contents

1. [admin-reset-password](#admin-reset-password)
2. [bootstrap-admin](#bootstrap-admin)
3. [link-teacher-account](#link-teacher-account)
4. [notify-check-payment](#notify-check-payment)
5. [send-guest-payment-email](#send-guest-payment-email)
6. [send-parent-welcome](#send-parent-welcome)
7. [send-payment-receipt](#send-payment-receipt)
8. [send-payment-reminder](#send-payment-reminder)
9. [send-pledge-notification](#send-pledge-notification)
10. [send-sponsor-thank-you](#send-sponsor-thank-you)
11. [send-teacher-invite](#send-teacher-invite)
12. [send-teacher-welcome](#send-teacher-welcome)
13. [send-template-email](#send-template-email)
14. [student-forgot-password](#student-forgot-password)
15. [student-login](#student-login)
16. [student-set-password](#student-set-password)
17. [process-square-payment](#process-square-payment)

---

## admin-reset-password

**Purpose:** Admin utility to reset a user's password directly using the Supabase Admin API.

**Authentication:** None required (internal admin use only)

**Method:** POST

### Request Payload

```json
{
  "userId": "uuid",
  "newPassword": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string (UUID) | Yes | The auth.users ID of the user |
| newPassword | string | Yes | New password to set |

### Success Response (200)

```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "Missing userId or newPassword" | Required fields not provided |
| 400 | `{supabase error}` | Password update failed |
| 500 | "An unexpected error occurred" | Server error |

---

## bootstrap-admin

**Purpose:** First-time admin setup. Allows the first authenticated user to become admin, or existing admins to re-confirm their role.

**Authentication:** Required (Bearer token)

**Method:** POST

### Request Payload

None required (empty body or `{}`)

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {jwt} | Yes |

### Success Response (200)

```json
{
  "ok": true
}
```

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 401 | "Missing Authorization header" | No auth token |
| 401 | "Invalid session" | Invalid JWT |
| 403 | "Admin already exists" | Non-admin user tried to bootstrap when admin exists |
| 405 | "Method not allowed" | Non-POST request |
| 500 | "Server misconfiguration" | Missing env vars |
| 500 | "Failed checking existing admins" | DB error |
| 500 | "Failed assigning admin role" | Insert failed |

---

## link-teacher-account

**Purpose:** Links an authenticated user to their pre-created teacher profile by matching email addresses.

**Authentication:** Required (Bearer token)

**Method:** POST

### Request Payload

None required (uses authenticated user's email)

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {jwt} | Yes |

### Success Response (200)

```json
{
  "success": true,
  "linked": true,
  "teacher": {
    "id": "uuid",
    "name": "string",
    "email": "string",
    "user_id": "uuid",
    "is_active": true
  }
}
```

**Note:** If already linked, `linked: false` is returned with existing teacher data.

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "Email is required" | User has no email |
| 401 | "Unauthorized" | Missing auth header |
| 401 | "Invalid session" | Invalid JWT |
| 404 | "No teacher profile available for this email" | Email not in teachers table |
| 500 | "Failed to verify teacher access" | DB error |
| 500 | "Failed to link teacher profile" | Update error |

---

## notify-check-payment

**Purpose:** Notifies organizers when a sponsor commits to paying by check. Updates pledge status and sends admin notification email.

**Authentication:** None explicitly required

**Method:** POST

### Request Payload

```json
{
  "pledgeIds": ["uuid", "uuid"],
  "sponsorName": "string",
  "sponsorEmail": "string",
  "totalAmount": 100.00,
  "childNames": ["Emma", "Jack"]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pledgeIds | string[] | Yes | Array of pledge UUIDs to update |
| sponsorName | string | Yes | Sponsor's full name |
| sponsorEmail | string | Yes | Sponsor's email |
| totalAmount | number | Yes | Total check amount |
| childNames | string[] | Yes | Names of children being sponsored |

### Success Response (200)

```json
{
  "success": true,
  "message": "Pledges updated and organizers notified",
  "emailResult": { /* Resend API response */ }
}
```

### Database Side Effects

- Updates `pledges` table: `payment_status = "pending_check"`, `expected_payment_method = "check"`

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 500 | "Failed to update pledges: ..." | DB update failed |
| 500 | `{error message}` | Email or other error |

---

## send-guest-payment-email

**Purpose:** Sends payment collection emails to guest sponsors (those who pledged without an account) with magic payment links.

**Authentication:** None required

**Method:** POST

### Request Payload

```json
{
  "pledges": [
    {
      "pledgeId": "uuid",
      "recipientEmail": "string",
      "recipientName": "string",
      "className": "string",
      "teacherName": "string (optional)",
      "amount": 50.00,
      "paymentToken": "uuid",
      "baseUrl": "https://example.com"
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pledges | GuestPledge[] | Yes | Array of pledges to process |
| pledges[].pledgeId | string | Yes | Pledge ID for tracking |
| pledges[].recipientEmail | string | Yes | Guest's email |
| pledges[].recipientName | string | No | Guest's name (used in greeting) |
| pledges[].className | string | Yes | Class name for email content |
| pledges[].teacherName | string | No | Optional teacher name |
| pledges[].amount | number | Yes | Pledge amount |
| pledges[].paymentToken | string | Yes | Magic link token |
| pledges[].baseUrl | string | Yes | Base URL for payment link |

### Success Response (200)

```json
{
  "success": true,
  "results": [
    { "pledgeId": "uuid", "success": true },
    { "pledgeId": "uuid", "success": false, "error": "message" }
  ],
  "summary": { "sent": 5, "failed": 1 }
}
```

### Database Side Effects

- Logs each email to `email_logs` table with `recipient_type: "guest_sponsor"`

### Rate Limiting

600ms delay between emails (Resend free tier: 2 req/sec)

---

## send-parent-welcome

**Purpose:** Sends welcome email to parents after they complete onboarding and enroll their first child.

**Authentication:** None required

**Method:** POST

### Request Payload

```json
{
  "parentEmail": "string",
  "parentName": "string",
  "childName": "string",
  "familyPledgeUrl": "string",
  "dashboardUrl": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| parentEmail | string | Yes | Parent's email |
| parentName | string | Yes | Parent's name |
| childName | string | Yes | Enrolled child's name |
| familyPledgeUrl | string | Yes | URL to invite sponsors |
| dashboardUrl | string | Yes | URL to parent dashboard |

### Success Response (200)

```json
{
  "success": true,
  "data": { /* Resend API response */ }
}
```

### Database Side Effects

- Logs email to `email_logs` with `recipient_type: "parent"`

---

## send-payment-receipt

**Purpose:** Sends payment confirmation/receipt emails to sponsors after successful Square payment processing.

**Authentication:** None required (called internally by process-square-payment)

**Method:** POST

### Request Payload

```json
{
  "payerEmail": "string",
  "payerName": "string",
  "amount": 100.00,
  "receiptUrl": "string",
  "studentNames": ["Emma", "Jack"],
  "className": "Mrs. Smith's Class",
  "isClassPledge": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| payerEmail | string | Yes | Payer's email address |
| payerName | string | Yes | Payer's display name |
| amount | number | Yes | Payment amount in dollars |
| receiptUrl | string | Yes | Square receipt URL |
| studentNames | string[] | Yes | Array of student names supported |
| className | string | No | Class name (for class pledges) |
| isClassPledge | boolean | No | Whether this is a class pledge payment |

### Success Response (200)

```json
{
  "success": true,
  "data": { /* Resend API response */ }
}
```

**Note:** If `payerEmail` is empty/null, returns `{ success: true, skipped: true }` without sending.

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 500 | "RESEND_API_KEY is not configured" | Missing secret |
| 500 | `{error message}` | Resend API or other error |

### Database Side Effects

- Logs email to `email_logs` with `recipient_type: "sponsor"`

### Email Content

- Green-themed HTML receipt with payment amount prominently displayed
- "View Square Receipt" button linking to Square's receipt page
- List of students supported
- Styled confirmation message

---

## send-payment-reminder

**Purpose:** Sends payment reminder emails to sponsors with outstanding pledges. Supports bulk sending.

**Authentication:** None required

**Method:** POST

### Request Payload

```json
{
  "pledges": [
    {
      "pledgeId": "uuid",
      "recipientEmail": "string",
      "recipientName": "string",
      "studentName": "string",
      "amount": 0.05,
      "pledgeType": "per_minute",
      "totalMinutes": 500,
      "daysSincePledge": 14
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| pledges | object[] | Yes | Array of pledges |
| pledges[].pledgeId | string | Yes | Pledge ID |
| pledges[].recipientEmail | string | Yes | Sponsor email |
| pledges[].recipientName | string | Yes | Sponsor name |
| pledges[].studentName | string | Yes | Student name |
| pledges[].amount | number | Yes | Pledge amount |
| pledges[].pledgeType | "flat" \| "per_minute" | Yes | Type of pledge |
| pledges[].totalMinutes | number | No | For per_minute: reading minutes |
| pledges[].daysSincePledge | number | Yes | Days since pledge created |

### Success Response (200)

```json
{
  "success": true,
  "results": [
    { "pledgeId": "uuid", "success": true }
  ],
  "summary": { "sent": 3, "failed": 0 }
}
```

### Email Content Features

- Calculates final amount for per_minute pledges
- Urgency messaging based on days outstanding (>10: red warning, >5: amber)

### Database Side Effects

- Logs each email to `email_logs` with `recipient_type: "sponsor"`

---

## send-pledge-notification

**Purpose:** Sends notifications for pledge events: new pledge creation or payment completion.

**Authentication:** None required

**Method:** POST

### Request Payload

```json
{
  "type": "pledge_created",
  "pledgeId": "uuid",
  "recipientEmail": "string",
  "recipientName": "string",
  "sponsorName": "string (optional)",
  "studentName": "string",
  "amount": 50.00,
  "pledgeType": "flat",
  "totalMinutes": 500
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | "pledge_created" \| "payment_complete" | Yes | Notification type |
| pledgeId | string | Yes | Pledge ID |
| recipientEmail | string | Yes | Recipient email |
| recipientName | string | Yes | Recipient name |
| sponsorName | string | No | Sponsor name (for pledge_created) |
| studentName | string | Yes | Student name |
| amount | number | Yes | Pledge amount |
| pledgeType | "flat" \| "per_minute" | Yes | Type of pledge |
| totalMinutes | number | No | Reading minutes (for per_minute) |

### Success Response (200)

```json
{
  "success": true,
  "data": { /* Resend API response */ }
}
```

### Database Side Effects

- Logs to `email_logs` with `recipient_type: "parent"` (pledge_created) or `"sponsor"` (payment_complete)

---

## send-sponsor-thank-you

**Purpose:** Sends thank you email to sponsors immediately after they make a pledge.

**Authentication:** None required

**Method:** POST

### Request Payload

```json
{
  "sponsorEmail": "string",
  "sponsorName": "string",
  "studentName": "string",
  "pledgeType": "flat",
  "amount": 50.00,
  "className": "Mrs. Smith's Class",
  "isClassPledge": false
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sponsorEmail | string | Yes | Sponsor's email |
| sponsorName | string | Yes | Sponsor's name |
| studentName | string | Yes | Student name (or class name if isClassPledge) |
| pledgeType | "flat" \| "per_minute" \| "milestone" | Yes | Type of pledge |
| amount | number | Yes | Pledge amount |
| className | string | No | Class name (for class pledges) |
| isClassPledge | boolean | No | Whether this is a class pledge |

### Success Response (200)

```json
{
  "success": true,
  "data": { /* Resend API response */ }
}
```

### Database Side Effects

- Logs to `email_logs` with `recipient_type: "sponsor"`

---

## send-teacher-invite

**Purpose:** Sends magic link invitation to teachers for account setup. Admin-only endpoint.

**Authentication:** Required (Bearer token, must be admin)

**Method:** POST

### Request Payload

```json
{
  "teacherId": "uuid",
  "teacherEmail": "string",
  "teacherName": "string",
  "redirectUrl": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| teacherId | string | Yes | Teacher record ID |
| teacherEmail | string | Yes | Teacher's email |
| teacherName | string | Yes | Teacher's name |
| redirectUrl | string | Yes | Where to redirect after auth |

### Success Response (200)

```json
{
  "success": true,
  "message": "Invite sent successfully"
}
```

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "Missing required fields" | Required fields not provided |
| 400 | "Teacher already has a linked account" | Already linked |
| 401 | "Unauthorized" | Missing auth |
| 401 | "Invalid token" | Bad JWT |
| 403 | "Admin access required" | Non-admin user |
| 404 | "Teacher not found" | No matching teacher |
| 500 | "Failed to generate invite link" | Link generation failed |
| 500 | "Failed to send email" | Resend error |

### Notes

- Generates Supabase magic link using admin API
- Link expires in 1 hour
- Teacher must not already have `user_id` set

---

## send-teacher-welcome

**Purpose:** Sends welcome email after teacher successfully links their account.

**Authentication:** None required

**Method:** POST

### Request Payload

```json
{
  "teacherName": "string",
  "teacherEmail": "string",
  "dashboardUrl": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| teacherName | string | Yes | Teacher's name |
| teacherEmail | string | Yes | Teacher's email |
| dashboardUrl | string | Yes | URL to teacher dashboard |

### Success Response (200)

```json
{
  "success": true,
  "data": { /* Resend API response */ }
}
```

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "Missing required fields" | Missing teacherEmail or teacherName |
| 500 | "Failed to send email" | Resend error |

---

## send-template-email

**Purpose:** Sends bulk emails using admin-created templates with variable substitution. Primary email tool for admin campaigns.

**Authentication:** None required

**Method:** POST

### Request Payload

```json
{
  "templateId": "uuid (optional)",
  "subject": "Hello {{sponsor_name}}!",
  "body": "Thank you for supporting {{student_name}}...",
  "recipients": [
    {
      "email": "string",
      "name": "string",
      "type": "sponsor",
      "variables": {
        "sponsor_name": "Uncle Bob",
        "student_name": "Emma",
        "total_owed": "$50.00"
      }
    }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| templateId | string | No | Template ID for logging |
| subject | string | Yes | Email subject (supports variables) |
| body | string | Yes | Email body (supports variables) |
| recipients | Recipient[] | Yes | Array of recipients |
| recipients[].email | string | Yes | Recipient email |
| recipients[].name | string | Yes | Recipient name |
| recipients[].type | string | Yes | Recipient type for logging |
| recipients[].variables | object | No | Key-value variable substitutions |

### Variable Substitution

Variables in `{{variable_name}}` format are replaced with values from `recipients[].variables`.

**Available variables (by context):**
- `{{sponsor_name}}`, `{{sponsor_first_name}}`
- `{{student_name}}`, `{{student_first_name}}`
- `{{pledge_amount}}`, `{{total_owed}}`
- `{{minutes_read}}`, `{{goal_minutes}}`, `{{progress_percent}}`
- `{{payment_link}}`
- `{{event_name}}`, `{{school_name}}`, `{{days_remaining}}`

### Success Response (200)

```json
{
  "success": true,
  "results": [
    { "email": "a@example.com", "success": true },
    { "email": "b@example.com", "success": false, "error": "message" }
  ],
  "summary": { "sent": 10, "failed": 2 }
}
```

### Database Side Effects

- Logs each email (success or failure) to `email_logs` with template_id if provided

### Rate Limiting

600ms delay between emails

---

## student-forgot-password

**Purpose:** Handles student password reset by notifying the parent. Does NOT reveal whether username exists (anti-enumeration).

**Authentication:** None required (public endpoint)

**Method:** POST

### Request Payload

```json
{
  "username": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Student's username (min 3 chars) |

### Success Response (200)

Always returns success to prevent username enumeration:

```json
{
  "success": true,
  "message": "If this username exists, we've notified the parent."
}
```

### Behind the Scenes

If username exists:
1. Looks up child via `student_auth.username`
2. Fetches parent email from `auth.users` via `children.user_id`
3. Sends email to parent with reset instructions

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "Please enter a valid username" | Username < 3 chars |
| 500 | "An unexpected error occurred" | Server error |

---

## student-login

**Purpose:** Hybrid student authentication endpoint. For migrated students (those with `student_user_id` in `children`), directs the client to use standard `supabase.auth.signInWithPassword()`. For legacy students, verifies password hash directly.

**Authentication:** None required (public endpoint)

**Method:** POST

### Request Payload

```json
{
  "username": "string",
  "password": "string"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | string | Yes | Student's username |
| password | string | Yes | Student's password |

### Success Response — Migrated Student (200)

When the student has a real auth account (`student_user_id` set):

```json
{
  "useStandardAuth": true,
  "email": "username@student.readathon.local"
}
```

The client should then call `supabase.auth.signInWithPassword({ email, password })` directly.

### Success Response — Legacy Student (200)

When the student has NOT been migrated (no `student_user_id`):

```json
{
  "success": true,
  "child": {
    "id": "uuid",
    "name": "Emma Johnson",
    "totalMinutes": 250,
    "goalMinutes": 500,
    "className": "Mrs. Smith - Room 12",
    "gradeInfo": "3rd Grade"
  }
}
```

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "Username and password are required" | Missing fields |
| 401 | "Invalid username or password" | Wrong credentials |
| 403 | "Student login is not enabled. Ask your parent to enable it." | `student_auth.login_enabled = false` |
| 403 | "No password set. Ask your parent to set up your login." | No `password_hash` in `student_auth` |
| 500 | "An error occurred. Please try again." | DB error |

### Security Features

- Normalized username (lowercase, trimmed)
- bcrypt password hashing (cost 12); legacy SHA-256 auto-upgrade on login
- Timing attack prevention (random delay on invalid username)
- Generic error messages to prevent enumeration

---

## student-set-password

**Purpose:** Allows parents to set or update their child's student login password. Creates a real `auth.users` account for the student using the Admin API.

**Authentication:** Required (Bearer token, must be child's parent)

**Method:** POST

### Request Payload

```json
{
  "childId": "uuid",
  "password": "string",
  "username": "string (optional)"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| childId | string | Yes | Child's ID |
| password | string | Yes | New password (min 8 chars) |
| username | string | No | Username (uses existing if not provided) |

### Request Headers

| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer {jwt} | Yes |

### Success Response (200)

```json
{
  "success": true
}
```

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "Child ID and password are required" | Missing fields |
| 400 | "Password must be at least 8 characters" | Password too short |
| 400 | "Username is required" | No username provided and none exists |
| 400 | "Username is already taken. Please choose a different one." | Duplicate username |
| 401 | "Unauthorized" | Missing/invalid auth |
| 403 | "You can only set passwords for your own children" | Not parent |
| 404 | "Child not found" | Invalid childId |
| 500 | "Failed to create student account" | Auth account creation failed |
| 500 | "Failed to update password" | Password update failed |
| 500 | "Failed to link student account" | DB link failed |

### Database Side Effects

- **New student:** Creates `auth.users` account with email `{username}@student.readathon.local`, sets `children.student_user_id`, assigns `student` role in `user_roles`, upserts `student_auth` metadata
- **Existing student:** Updates password on existing `auth.users` account via Admin API, upserts `student_auth` metadata

---

## process-square-payment

**Purpose:** Processes credit card payments via Square Payments API. Creates payment records and updates pledge status upon successful payment.

**Authentication:** None required (public endpoint, validates payment via Square token)

**Method:** POST

### Request Payload

```json
{
  "sourceId": "cnon:card-nonce-ok",
  "amount": 50.00,
  "pledgeIds": ["uuid", "uuid"],
  "classPledgeId": "uuid (alternative to pledgeIds)",
  "payerName": "John Doe",
  "payerEmail": "john@example.com",
  "idempotencyKey": "uuid"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sourceId | string | Yes | Card token from Square Web Payments SDK |
| amount | number | Yes | Payment amount in dollars |
| pledgeIds | string[] | Conditional | Array of individual pledge IDs (required if no classPledgeId) |
| classPledgeId | string | Conditional | Class pledge ID for guest payments (required if no pledgeIds) |
| payerName | string | Yes | Payer's name for receipt |
| payerEmail | string | Yes | Payer's email for receipt |
| idempotencyKey | string | Yes | UUID to prevent duplicate charges |

### Success Response (200)

```json
{
  "success": true,
  "paymentId": "square_payment_id",
  "receiptUrl": "https://squareup.com/receipt/..."
}
```

### Error Responses

| Status | Error | Cause |
|--------|-------|-------|
| 400 | "Missing required fields" | sourceId, amount, or idempotencyKey missing |
| 400 | "Must provide either pledgeIds or classPledgeId" | No pledges specified |
| 400 | `{Square error detail}` | Card declined or invalid |
| 500 | "SQUARE_ACCESS_TOKEN is not configured" | Missing secret |
| 500 | "Internal server error" | Server error |

### Database Side Effects

- Creates `payments` record with Square payment ID and receipt URL
- Updates `pledges.is_paid = true`, `payment_status = "paid"`, `final_amount`, `finalized_at`
- For class pledges: Updates `class_pledges.is_paid = true`, `payment_status = "paid"`

### Environment Detection

Automatically detects sandbox vs production based on access token format.

---

## Environment Variables

All edge functions use these environment variables:

| Variable | Used By | Description |
|----------|---------|-------------|
| SUPABASE_URL | All | Supabase project URL |
| SUPABASE_ANON_KEY | Auth functions | Public anon key |
| SUPABASE_SERVICE_ROLE_KEY | All DB operations | Service role key |
| RESEND_API_KEY | Email functions | Resend.com API key |
| SQUARE_ACCESS_TOKEN | process-square-payment | Square API access token |
| SQUARE_APPLICATION_ID | process-square-payment | Square application ID |

---

## Common Patterns

### CORS Headers

All functions include:
```javascript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, ..."
};
```

### Email Logging

All email functions log to `email_logs` table:
```javascript
await supabase.from("email_logs").insert({
  recipient_email: string,
  recipient_name: string,
  recipient_type: "parent" | "sponsor" | "teacher" | "guest_sponsor",
  subject: string,
  body: string,
  status: "sent" | "failed",
  sent_at: string | null,
  error_message: string | null,
  template_id: string | null
});
```

### Rate Limiting

Bulk email functions use 600ms delay between sends:
```javascript
if (i > 0) {
  await new Promise(resolve => setTimeout(resolve, 600));
}
```

---

## Invocation Examples

### From Frontend (with auth)

```typescript
import { supabase } from "@/integrations/supabase/client";

const { data, error } = await supabase.functions.invoke("link-teacher-account");
```

### From Frontend (no auth)

```typescript
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/student-login`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  }
);
```
