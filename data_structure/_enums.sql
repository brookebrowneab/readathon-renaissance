-- Database Enums
-- These should be created before the tables that use them

-- App role enum for user authorization
CREATE TYPE app_role AS ENUM ('admin', 'user', 'teacher');

-- Teacher type enum for classification
CREATE TYPE teacher_type AS ENUM ('homeroom', 'partner', 'specials', 'staff');

-- Email log status enum
CREATE TYPE email_log_status AS ENUM ('pending', 'sent', 'failed');

-- Email template status enum
CREATE TYPE email_template_status AS ENUM ('draft', 'scheduled', 'sent');
