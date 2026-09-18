# ChuoApp University Backend Guide

## Overview

ChuoApp uses a single Django REST API and PostgreSQL database behind the mobile application. The mobile app never connects directly to individual university systems.

```text
Mobile App
    ↓
Django REST API
    ↓
University Adapter or ChuoApp Database
    ↓
University System, where available
```

This keeps the mobile app simple and allows each university to use a different integration method without changing the app screens.

## Two university operating modes

### Mode A: University has an official API

When a university already has an approved API or data exchange system:

1. The student selects the university in ChuoApp.
2. The student verifies their university identity.
3. Django authenticates with the approved university service.
4. The university adapter retrieves supported data.
5. Django converts the university response into ChuoApp's common format.
6. Normalized data is saved in PostgreSQL for fast access and offline-friendly use.
7. The mobile app reads the normalized response from Django.

```text
Student → ChuoApp → Django → UDSM/UDOM/etc. API
                         ↓
                    PostgreSQL cache
```

The adapter may retrieve:

- Student profile
- Courses and enrollment
- Results and grades
- Timetable
- Attendance
- Assignments
- Fees and payment status
- Exams
- Notices and announcements
- Documents
- Library data
- Scholarships
- Notifications

A university may support only some of these features. Django exposes the capability status so the app can hide or disable unsupported features instead of showing misleading empty data.

### Mode C: University has no existing system

If a university does not have an academic information system, ChuoApp becomes its managed platform. University staff use an administration portal to create and manage:

- Students
- Faculties, departments, and programs
- Courses and semesters
- Course enrollment
- Timetables
- Attendance
- Assignments
- Exams
- Results
- Fees and payments
- Notices and announcements
- Documents
- Scholarships
- Library records
- Notifications

The student mobile app reads the same PostgreSQL records created by authorized university staff.

```text
University Staff Portal
          ↓
Django + PostgreSQL
          ↓
Student Mobile App
```

This means universities without systems do not need an external API. ChuoApp becomes their primary student management system.

### Mode B: University has a system but no API

This mode is not the first priority. It can later use:

- CSV imports
- Secure SFTP exchange
- Scheduled spreadsheets
- A custom connector
- A future official API

Data imports must be validated, deduplicated, logged, and approved before updating student records.

## Adapter architecture

Each external university receives an adapter in `backend/integrations/`. The adapter implements the shared ChuoApp contract.

Typical operations include:

```python
authenticate(credentials)
get_profile(student)
get_courses(student)
get_results(student)
get_fees(student)
get_timetable(student)
get_attendance(student)
get_assignments(student)
get_announcements(student)
get_notices(student)
get_exams(student)
get_documents(student)
get_library(student)
get_notifications(student)
```

The mobile app calls stable ChuoApp endpoints such as:

```text
GET /api/v1/profile/
GET /api/v1/academic/courses/
GET /api/v1/academic/results/
GET /api/v1/academic/timetable/
GET /api/v1/content/notifications/
GET /api/v1/content/exams/
```

The mobile app does not need to know whether the data came from UDSM, another provider, or ChuoApp's own database.

## Integration process for an existing university

Before enabling a university adapter, ChuoApp must receive and verify official information from the university:

1. Official integration contact and approval.
2. API documentation and contract version.
3. Production and sandbox base URLs.
4. Authentication method and scopes.
5. Supported resources.
6. Student identifier format.
7. Pagination and filtering rules.
8. Incremental synchronization support.
9. Rate limits and timeout rules.
10. Error response format.
11. Maintenance windows.
12. Data protection and processing requirements.
13. Test credentials or a test tenant.

Unknown values must remain marked as `unknown`. ChuoApp must not guess endpoints, credentials, rate limits, or capabilities.

After receiving the documentation:

1. Create a provider configuration record.
2. Implement the adapter against the official contract.
3. Add mocked contract tests.
4. Test against the sandbox.
5. Verify identity mapping and data ownership.
6. Run a limited pilot.
7. Enable production synchronization only after approval.

## Synchronization and caching

External university services should not be called on every screen render. Django stores normalized records in PostgreSQL and synchronizes them using scheduled or on-demand jobs.

Each synchronization run should record:

- University identity
- Resource being synchronized
- Start and finish time
- Status
- Number of records written
- Retry count
- Provider error code
- Last successful synchronization

When a provider is temporarily unavailable, ChuoApp can show the last successful data with its freshness timestamp instead of failing the entire app.

## Identity and security

University credentials and provider tokens must not be stored in the mobile app. The backend should use:

- Django REST Framework
- JWT access and refresh tokens for ChuoApp sessions
- Short-lived access tokens
- Refresh-token rotation
- Encrypted provider tokens when required
- Per-user and per-university data isolation
- Role-based permissions for students and staff
- Audit logs for sensitive actions
- HTTPS in every deployed environment
- Restrictive CORS configuration
- Rate limiting for login and synchronization
- Redacted logs with no passwords or tokens

A ChuoApp account may be linked to one or more `UniversityIdentity` records, but every record must be scoped to the authenticated user and university.

## Core data model

The backend is organized around these areas:

### Accounts

- User
- UniversityIdentity
- StudentProfile
- ProviderToken
- Device/session records
- Audit events

### Universities

- University directory
- Adapter configuration
- Supported capabilities
- Provider health checks

### Academic

- Course
- Enrollment
- TimetableEntry
- AttendanceRecord
- Assignment
- AssignmentSubmission
- AcademicResult

### Finance

- Fee records
- Payment history
- Receipts
- Payment status

### Content and student services

- Announcements
- Notices
- Notifications
- Exams
- Scholarships
- Documents
- Library loans

## What the university gives ChuoApp

The university does not automatically give ChuoApp data simply because its name is listed in the app. The university must authorize the integration and provide an official technical or administrative data channel.

Depending on the university, it may provide:

- An API
- OAuth or service credentials
- A sandbox environment
- Student identifiers
- Read or write scopes
- Data dictionaries
- Webhook or synchronization access
- CSV or SFTP exports
- Staff-approved data imports

The exact features depend on the agreement and official system capabilities.

## What ChuoApp provides to universities

For universities with existing systems, ChuoApp provides a unified student experience and integration gateway.

For universities without systems, ChuoApp provides:

- A hosted academic data platform
- Staff administration tools
- Student mobile access
- Centralized PostgreSQL storage
- Academic and finance workflows
- Notifications and communication
- Reporting and audit history
- Role-based staff access

## Important implementation rule

Do not implement university-specific conditions inside mobile screens or general Django views. Add a provider adapter and register it. The shared API and normalized data models should remain stable.

```text
Correct:
Screen → Django endpoint → adapter registry → university adapter

Incorrect:
Screen → if university == "UDSM" → custom request
```

This design allows ChuoApp to add universities without rewriting the mobile application.

## Current project status

The project contains the Django JWT account foundation, university models, normalized domain models, content routes, adapter contracts, migrations, and initial configured-university seed support.

Production integration still requires official university documentation, credentials, approval, adapter implementations, synchronization jobs, staff administration screens, and end-to-end testing for each university.

Never scrape or bypass a university portal. Use only officially approved APIs or authorized data exchange processes.
