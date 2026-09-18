# ChuoApp University Integration Architecture

**Version:** 2.0 — Multi-University Adapter System
**Last Updated:** September 3, 2026
**Status:** Production-Ready Blueprint

---

## Executive Overview

ChuoApp is a unified student gateway supporting **10+ Tanzanian universities** through an adapter-based integration system. Each university has its own implementation without affecting the core platform. Students use one ChuoApp account and select their university; data is normalized into a standard model and cached for offline access.

**Architecture Decision:**
- React Native client + Django REST API + PostgreSQL + Celery + Redis
- Mobile app talks only to Django (single API gateway)
- University credentials and provider tokens never reach the client or PostgreSQL in plaintext
- Adapter registry pattern: add a university by registering config and adapter, never by conditionals in UI

---

## Multi-University Support Strategy

### Supported University Types

#### **Type A: Universities with API**
Universities with documented, stable REST or SOAP APIs. ChuoApp calls their API, normalizes responses, and caches data.

**Current Target Universities (Tanzania):**
1. UDSM (University of Dar es Salaam)
2. UDOM (University of Dodoma)
3. SUZA (State University of Zanzibar)
4. MUCE (Mkwawa University College of Education)
5. Mbeya University of Science and Technology
6. Sokoine University of Agriculture
7. Open University of Tanzania
8. Tanzania Maritime Authority Institute
9. Dar es Salaam Institute of Technology
10. Arusha Technical College
11. *(Additional universities as APIs are verified)*

**Authentication Methods Supported:**
- OAuth 2.0 client credentials
- Signed API requests with shared secret
- API key (restricted by IP and scopes)
- Basic auth (fallback, requires encryption)

**Endpoint Requirements:**
Every Type A university must provide stable external identifiers and timestamps for efficient syncing.

#### **Type C: Universities Without System**
ChuoApp becomes their complete student information system. University staff manage students, programs, fees, results, and announcements through a ChuoApp workspace. Data is stored directly in ChuoApp's PostgreSQL using the same models as Type A universities.

**Initial Pilot Universities (Type C):**
- Regional polytechnics without existing systems
- Private institutions with manual processes
- Colleges migrating from paper-based systems

#### **Type B (Not Currently Prioritized):**
Universities with existing systems but no API. Would use CSV/SFTP imports or custom connectors after Type A and C are stable.

---

## Core Architecture Layers

### 1. Adapter Registry Pattern

Every university has an adapter that implements the shared contract. The registry maps adapter keys to implementations:

```python
# backend/integrations/contracts.py
from typing import Protocol, Any
from dataclasses import dataclass
from decimal import Decimal
from datetime import date

@dataclass(frozen=True)
class UniversityCredentials:
    student_id: str
    password: str

@dataclass(frozen=True)
class AuthenticatedStudent:
    external_student_id: str
    external_email: str | None
    display_name: str
    provider_token: str | None = None

@dataclass(frozen=True)
class StudentProfileDTO:
    external_student_id: str
    display_name: str
    program: str | None = None
    department: str | None = None
    year_of_study: int | None = None
    semester: int | None = None
    gpa: Decimal | None = None
    cgpa: Decimal | None = None
    photo_url: str | None = None

@dataclass(frozen=True)
class AcademicResultDTO:
    external_id: str
    course_code: str
    course_name: str
    credits: Decimal | None
    grade: str | None
    grade_point: Decimal | None
    semester: str | None
    academic_year: str | None
    source_updated_at: date | None = None

@dataclass(frozen=True)
class FeeRecordDTO:
    external_id: str
    description: str
    amount: Decimal
    currency: str
    status: str  # "pending", "partially_paid", "paid", "overdue"
    due_date: date | None = None
    payment_date: date | None = None
    receipt_number: str | None = None
    source_updated_at: date | None = None

@dataclass(frozen=True)
class TimetableEntryDTO:
    external_id: str
    course_code: str
    course_name: str
    day: str  # "monday", "tuesday", ...
    start_time: str  # "08:00"
    end_time: str  # "10:00"
    location: str | None = None
    lecturer: str | None = None
    semester: str | None = None
    source_updated_at: date | None = None

class UniversityAdapter(Protocol):
    """Every adapter must implement this contract."""
    key: str
    base_url: str
    timeout_seconds: int

    def authenticate(self, credentials: UniversityCredentials) -> AuthenticatedStudent:
        """Verify student and return authenticated token/session."""
        ...

    def get_profile(self, student: AuthenticatedStudent) -> StudentProfileDTO:
        """Fetch normalized student profile."""
        ...

    def get_results(self, student: AuthenticatedStudent, semester: str | None = None) -> list[AcademicResultDTO]:
        """Fetch normalized academic results."""
        ...

    def get_fees(self, student: AuthenticatedStudent) -> list[FeeRecordDTO]:
        """Fetch normalized fee records."""
        ...

    def get_timetable(self, student: AuthenticatedStudent, semester: str | None = None) -> list[TimetableEntryDTO]:
        """Fetch normalized timetable."""
        ...

    def get_courses(self, student: AuthenticatedStudent, semester: str | None = None) -> list[dict[str, Any]]:
        """Fetch enrolled courses."""
        ...

    def supports_feature(self, feature: str) -> bool:
        """Check if adapter supports a feature: "fees", "results", "timetable", "courses", "payments"."""
        ...

class ProviderError(Exception):
    def __init__(self, code: str, message: str = "University provider unavailable") -> None:
        super().__init__(message)
        self.code = code
```

### 2. Adapter Registry Implementation

```python
# backend/integrations/registry.py
from typing import Dict
from .contracts import UniversityAdapter, ProviderError

class AdapterRegistry:
    def __init__(self) -> None:
        self._adapters: Dict[str, UniversityAdapter] = {}

    def register(self, adapter: UniversityAdapter) -> None:
        if adapter.key in self._adapters:
            raise ValueError(f"Adapter '{adapter.key}' already registered")
        self._adapters[adapter.key] = adapter

    def get(self, key: str) -> UniversityAdapter:
        try:
            return self._adapters[key]
        except KeyError as exc:
            raise ProviderError("ADAPTER_NOT_CONFIGURED", f"No adapter registered for '{key}'") from exc

    def keys(self) -> tuple[str, ...]:
        return tuple(self._adapters.keys())

    def all(self) -> Dict[str, UniversityAdapter]:
        return dict(self._adapters)

registry = AdapterRegistry()

def register_adapter(adapter: UniversityAdapter) -> UniversityAdapter:
    registry.register(adapter)
    return adapter

def get_adapter(adapter_key: str) -> UniversityAdapter:
    return registry.get(adapter_key)
```

### 3. Backend Apps

#### **accounts** app
- `User`: ChuoApp account (email, password, created_at, last_login_at, is_active)
- `UniversityIdentity`: Link between ChuoApp user and each university (user, university, external_student_id, external_email, verified_at, last_seen_at, unique constraint on (university, external_student_id))
- `ProviderToken`: Encrypted refresh tokens for universities requiring them (identity, provider_key, encrypted_token, expires_at, created_at)

#### **universities** app
- `University`: Public directory (slug, name, acronym, adapter_key, base_url, enabled, features, health_status, created_at, updated_at)
- `UniversityConfig`: Provider-specific settings (university, max_students_per_request, rate_limit_per_minute, sync_priority, custom_fields)
- `ProviderHealth`: Monitor provider availability (university, checked_at, latency_ms, status, last_error_code, consecutive_failures)

#### **academic** app
- `StudentProfile`: Cached profile (identity, display_name, program, department, year, semester, gpa, cgpa, photo_url, synced_at)
- `AcademicResult`: Cached results with unique constraint on (identity, external_id) (identity, external_id, course_code, course_name, credits, grade, grade_point, semester, academic_year, source_updated_at)
- `FeeRecord`: Cached fees with unique constraint on (identity, external_id) (identity, external_id, description, amount, currency, status, due_date, payment_date, receipt_number, source_updated_at)
- `TimetableEntry`: Cached timetable (identity, external_id, course_code, course_name, day, start_time, end_time, location, lecturer, semester, source_updated_at)
- `Course`: Cached course enrollments (identity, external_id, course_code, course_name, credits, semester, academic_year, source_updated_at)

#### **sync** app
- `SyncRun`: Audit trail (identity, resource, status, started_at, finished_at, error_code, records_written, retry_count)
- `SyncPolicy`: Freshness rules per resource per university (university, resource, max_age_hours, on_demand_allowed, background_sync_enabled)

---

## Per-University API Specifications

### Accuracy and verification rule

The university names below are **integration targets, not verified API providers**. ChuoApp must not use any URL, endpoint, authentication method, feature list, or rate limit in this document as a production fact until the university supplies official documentation and a test credential. The sample payloads and URLs marked `to be verified` are contract examples only; they must be replaced by the university's actual contract before an adapter is enabled.

For each university, maintain a provider record with: official API owner/contact, documentation URL and version, base URL(s), sandbox URL, authentication method, scopes, supported resources, pagination, filtering/incremental-sync support, rate limits, timeout limits, error schema, maintenance windows, data-processing agreement, and verified date. Unknown values must be recorded as `unknown`, never guessed.

### **UDSM (University of Dar es Salaam)**

**Type:** A (API-based target)
**Adapter Key:** `udsm`
**Base URL:** `to be supplied and verified by UDSM`
**Supported Features:** to be confirmed from the official contract
**Rate Limit:** to be supplied by UDSM

#### Authentication
```http
POST /auth/token
Content-Type: application/json

{
  "client_id": "chuoapp",
  "client_secret": "{{ UDSM_CLIENT_SECRET }}",
  "grant_type": "client_credentials"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

#### Student Verification
```http
POST /students/verify
Authorization: Bearer {{ access_token }}
Content-Type: application/json

{
  "registration_number": "UDSM-2026-00123",
  "date_of_birth": "2002-05-14"
}

Response (200):
{
  "verified": true,
  "student": {
    "externalId": "45891",
    "registrationNumber": "UDSM-2026-00123",
    "fullName": "John Doe",
    "email": "john.doe@udsm.ac.tz",
    "phone": "+255700000000",
    "program": "Bachelor of Information Technology",
    "college": "College of ICT",
    "campus": "Main Campus",
    "studyStatus": "active",
    "yearOfStudy": 2
  }
}
```

#### Student Profile
```http
GET /students/45891/profile
Authorization: Bearer {{ access_token }}

Response (200):
{
  "externalId": "45891",
  "fullName": "John Doe",
  "program": "Bachelor of Information Technology",
  "department": "Computer Science",
  "yearOfStudy": 2,
  "semester": 1,
  "gpa": "3.5",
  "cgpa": "3.45",
  "photoUrl": "https://photos.udsm.ac.tz/45891.jpg",
  "updatedAt": "2026-09-03T10:00:00Z"
}
```

#### Academic Results
```http
GET /students/45891/results?academic_year=2025/2026&semester=1
Authorization: Bearer {{ access_token }}

Response (200):
{
  "results": [
    {
      "externalId": "RES-892123",
      "courseCode": "CS101",
      "courseName": "Introduction to Programming",
      "credits": "4.0",
      "grade": "A",
      "gradePoint": "4.0",
      "semester": "1",
      "academicYear": "2025/2026",
      "updatedAt": "2026-09-01T14:30:00Z"
    }
  ]
}
```

#### Fee Balance
```http
GET /students/45891/fees?academic_year=2025/2026
Authorization: Bearer {{ access_token }}

Response (200):
{
  "currency": "TZS",
  "academicYear": "2025/2026",
  "totalRequired": "2500000",
  "totalPaid": "1500000",
  "invoices": [
    {
      "externalId": "INV-1001",
      "description": "Tuition Fee",
      "amount": "2000000",
      "paidAmount": "1500000",
      "status": "partially_paid",
      "dueDate": "2026-10-30",
      "updatedAt": "2026-09-03T10:00:00Z"
    }
  ],
  "updatedAt": "2026-09-03T10:00:00Z"
}
```

#### Timetable
```http
GET /students/45891/timetable?semester=1
Authorization: Bearer {{ access_token }}

Response (200):
{
  "timetable": [
    {
      "externalId": "TT-1001",
      "courseCode": "CS101",
      "courseName": "Introduction to Programming",
      "day": "monday",
      "startTime": "08:00",
      "endTime": "10:00",
      "location": "Lab 1",
      "lecturer": "Prof. Jane Smith",
      "semester": "1",
      "updatedAt": "2026-09-01T08:00:00Z"
    }
  ]
}
```

**Adapter Implementation Location:** `backend/integrations/adapters/udsm.py`

---

### **UDOM (University of Dodoma)**

**Type:** A (API-based)
**Adapter Key:** `udom`
**Base URL:** `https://portal.udom.ac.tz/api` *(to be verified)*
**Supported Features:** profile, results, fees
**Rate Limit:** 500 requests per hour

#### Authentication
```http
POST /v2/auth/login
Content-Type: application/json

{
  "username": "{{ registration_number }}",
  "password": "{{ student_password }}",
  "client_id": "chuoapp"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "studentId": "UDOM-00456",
  "email": "student@udom.ac.tz"
}
```

#### Student Profile
```http
GET /v2/students/UDOM-00456
Authorization: Bearer {{ token }}

Response (200):
{
  "studentId": "UDOM-00456",
  "fullName": "Alice Johnson",
  "program": "Bachelor of Laws",
  "yearOfStudy": 3,
  "gpa": "3.2",
  "cgpa": "3.3",
  "lastSyncAt": "2026-09-03T09:30:00Z"
}
```

**Adapter Implementation Location:** `backend/integrations/adapters/udom.py`

---

### **SUZA (State University of Zanzibar)**

**Type:** A (API-based)
**Adapter Key:** `suza`
**Base URL:** `https://suza.ac.tz/portal/api` *(to be verified)*
**Supported Features:** profile, results
**Rate Limit:** 300 requests per hour

**Authentication:** SOAP with WS-Security
**Data Format:** XML with SOAP envelope

**Adapter Implementation Location:** `backend/integrations/adapters/suza.py`

*(SOAP adapter requires xmltodict and zeep libraries)*

---

### **MUCE (Mkwawa University College of Education)**

**Type:** A (API-based)
**Adapter Key:** `muce`
**Base URL:** `https://muce.ac.tz/api` *(to be verified)*
**Supported Features:** profile, results, fees, timetable
**Rate Limit:** 200 requests per hour

**Authentication:** API Key in header
**Custom Fields:** `faculty`, `specialization`

**Adapter Implementation Location:** `backend/integrations/adapters/muce.py`

---

### **Sokoine University of Agriculture (SUA)**

**Type:** A (API-based)
**Adapter Key:** `sua`
**Base URL:** `https://sua.ac.tz/student-api` *(to be verified)*
**Supported Features:** profile, results, fees, courses
**Rate Limit:** 800 requests per hour

**Adapter Implementation Location:** `backend/integrations/adapters/sua.py`

---

### **Open University of Tanzania (OUT)**

**Type:** A (API-based)
**Adapter Key:** `out`
**Base URL:** `https://out.ac.tz/api` *(to be verified)*
**Supported Features:** profile, results, fees
**Rate Limit:** 400 requests per hour

**Note:** OUT serves distance-learning students; timetable may not apply.

**Adapter Implementation Location:** `backend/integrations/adapters/out.py`

---

### **ChuoApp Hosted Universities (Type C)**

**Type:** C (ChuoApp-managed)
**Adapter Key:** `chuocore`
**Base URL:** Internal (no external API)
**Supported Features:** All (profile, results, fees, timetable, courses, payments)

#### University Staff Workspace Features
- Add/update/delete students
- Create programs and courses
- Set fees and payment schedules
- Record grades and results
- Manage timetables
- Post announcements
- Generate reports
- Export data (CSV/PDF)

#### Admin API (Internal)
```python
# backend/integrations/adapters/chuocore.py
class ChuoCoreAdapter:
    """Direct database adapter for Type C universities."""
    key = "chuocore"
    base_url = "internal"

    def authenticate(self, credentials):
        # Verify student exists in ChuoApp and was added by this university
        ...

    def get_profile(self, student):
        # Query StudentProfile directly from database
        ...

    def get_results(self, student):
        # Query AcademicResult directly from database
        ...

    # All other methods query internal database directly
    ...
```

**Adapter Implementation Location:** `backend/integrations/adapters/chuocore.py`

---

## API Response Standards

### Universal Response Envelope
```json
{
  "success": true,
  "data": { /* resource */ },
  "message": null,
  "error": null,
  "timestamp": "2026-09-03T10:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "data": null,
  "message": "Student credentials invalid",
  "error": {
    "code": "INVALID_STUDENT_CREDENTIALS",
    "details": "Registration number not found"
  },
  "timestamp": "2026-09-03T10:00:00Z"
}
```

### Standard Error Codes
```
UNIVERSITY_UNAVAILABLE         – Provider API is down or unreachable
INVALID_STUDENT_CREDENTIALS    – Registration number or password incorrect
STUDENT_NOT_VERIFIED           – Student exists but hasn't verified identity
STUDENT_NOT_ENROLLED           – Student is not currently enrolled
INVALID_ACADEMIC_YEAR          – Requested academic year not available
DATA_STALE                      – Cache is stale; user should refresh
SYNC_IN_PROGRESS               – Previous sync hasn't completed; try later
ADAPTER_NOT_CONFIGURED         – University adapter not registered
RATE_LIMIT_EXCEEDED            – Too many requests to provider
PROVIDER_MAINTENANCE           – Provider is in maintenance window
FEATURE_NOT_SUPPORTED          – University doesn't provide this feature
ENCRYPTION_ERROR               – Failed to encrypt/decrypt sensitive data
INVALID_RESPONSE_FORMAT        – Provider response couldn't be parsed
```

---

## Data Flow: Student Login

```
Mobile App
    ↓
POST /api/v1/auth/university-login/
  - university_id: "udsm"
  - registration_number: "UDSM-2026-00123"
  - password: "..."
    ↓
Django Backend
    ↓
1. Lookup University model by slug
2. Get UniversityAdapter from registry
3. Call adapter.authenticate(credentials)
    ↓
UDSM Adapter
    ↓
POST https://api.udsm.ac.tz/students/verify
  - registration_number: "UDSM-2026-00123"
  - date_of_birth: "..."
    ↓
UDSM API
    ↓
Returns: AuthenticatedStudent(external_student_id="45891", provider_token="...")
    ↓
Django Backend
    ↓
4. Create or update UniversityIdentity
5. Encrypt and store provider_token (if applicable)
6. Issue JWT access token to mobile client
    ↓
Mobile App
    ↓
Receives: JWT + Refresh Token + University Slug
```

---

## Freshness Policy & Background Sync

### Cache Freshness Defaults

| Resource | Max Age | On-Demand | Background |
|----------|---------|-----------|------------|
| Profile | 24 hours | ✓ | Daily |
| Results | 48 hours | ✓ | Weekly |
| Fees | 6 hours | ✓ | Every 6h |
| Timetable | 7 days | ✓ | Weekly |
| Courses | 7 days | ✓ | Weekly |
| Announcements | 2 hours | ✓ | Every 2h |

### Sync Strategy
```python
# backend/sync/tasks.py
from celery import shared_task
from apps.academic.models import StudentProfile, SyncRun
from integrations.registry import get_adapter
import logging

@shared_task
def sync_student_data(identity_id, resource):
    """Background sync task."""
    try:
        identity = UniversityIdentity.objects.get(id=identity_id)
        adapter = get_adapter(identity.university.adapter_key)

        if resource == "profile":
            dto = adapter.get_profile(identity.to_authenticated_student())
            StudentProfile.objects.update_or_create(
                identity=identity,
                defaults={
                    "display_name": dto.display_name,
                    "program": dto.program,
                    # ... other fields
                    "synced_at": timezone.now()
                }
            )
        elif resource == "results":
            dtos = adapter.get_results(identity.to_authenticated_student())
            # Upsert by external_id
            ...

        SyncRun.objects.create(
            identity=identity,
            resource=resource,
            status="success",
            records_written=len(dtos),
            finished_at=timezone.now()
        )
    except Exception as e:
        SyncRun.objects.create(
            identity=identity,
            resource=resource,
            status="error",
            error_code=str(e.code if hasattr(e, 'code') else 'UNKNOWN'),
            finished_at=timezone.now()
        )
        raise

# Celery Beat schedule
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    "sync-student-profiles-daily": {
        "task": "sync.tasks.sync_student_data",
        "schedule": crontab(hour=2, minute=0),  # 2 AM daily
        "args": ("*", "profile"),
    },
    "sync-student-fees-every-6h": {
        "task": "sync.tasks.sync_student_data",
        "schedule": crontab(minute=0),  # Every hour
        "args": ("*", "fees"),
    },
}
```

---

## Security Requirements

### Credential Handling
- **Never** store plaintext passwords
- **Never** store university passwords in Django models
- **Encrypt** provider refresh tokens with `ENCRYPTION_KEY` if required
- **Rotate** tokens according to provider policy
- **Delete** tokens immediately on account unlink

### Data Isolation
- Every query scopes by authenticated user
- Every `/me` endpoint checks `request.user`
- `UniversityIdentity` links user to university; queries use `identity__user=request.user`
- Use DRF object-level permissions and queryset filtering

### Logging & Monitoring
- **Redact** credentials, tokens, and PII from logs
- **Log** all provider calls, timestamps, and response codes
- **Monitor** provider health (latency, error rate, consecutive failures)
- **Alert** on provider unavailability or anomalies
- Use structured JSON logging with correlation IDs

### API Security
- TLS 1.2+ everywhere
- Short-lived access tokens (15 minutes)
- Rotating refresh tokens (7 days)
- Rate limit login (5 attempts per 15 minutes)
- Rate limit sync (1 full sync per 5 minutes)
- CORS restricted to known domains
- CSRF tokens on state-changing endpoints

---

## Adapter Rollout Checklist

For each new university adapter:

- [ ] Obtain official API documentation and authorization
- [ ] Verify sandbox/test environment credentials
- [ ] Create adapter class implementing `UniversityAdapter` protocol
- [ ] Write contract tests with mocked responses
- [ ] Test adapter against sandbox
- [ ] Register adapter in `integrations/registry.py`
- [ ] Create `University` model record with `enabled=False`
- [ ] Create `UniversityConfig` with rate limits and sync policy
- [ ] Test end-to-end flow: login → profile → results → fees
- [ ] Verify cached data updates correctly
- [ ] Test error scenarios (invalid credentials, provider down, timeout)
- [ ] Enable in production with feature flag
- [ ] Monitor provider health for 1 week
- [ ] Document provider-specific quirks or gotchas

---

## Deployment Checklist

### Environment Variables
```bash
# Core
DJANGO_SECRET_KEY=<random-32-char-key>
DJANGO_DEBUG=False
DATABASE_URL=postgres://user:password@host:5432/chuoapp
REDIS_URL=redis://user:password@host:6379/0
JWT_SIGNING_KEY=<random-32-char-key>
ENCRYPTION_KEY=<random-32-char-key>

# CORS
CORS_ALLOWED_ORIGINS=https://chuoapp.com,https://app.chuoapp.com

# Provider Credentials (per university)
UDSM_CLIENT_ID=<client_id>
UDSM_CLIENT_SECRET=<client_secret>
UDOM_API_KEY=<api_key>
# ... etc
```

### Production Deployment
- [ ] PostgreSQL backups enabled (daily)
- [ ] Redis replicated (master-slave)
- [ ] Celery worker replicated (2+ instances)
- [ ] Celery beat replicated (1 primary + 1 standby)
- [ ] Monitoring: provider health, sync latency, error rates
- [ ] Alerting: provider outages, sync failures, high error rate
- [ ] Logs shipped to centralized logging (ELK, Datadog, etc.)
- [ ] HTTPS + HSTS headers
- [ ] Rate limiting on all public endpoints
- [ ] Database connection pooling (PgBouncer)
- [ ] Redis connection pooling
- [ ] Graceful shutdown of workers (30s drain)
- [ ] Circuit breaker on provider APIs (fail fast after 5 failures)

---

## Testing Strategy

### Contract Tests
Test adapters against mocked provider responses without hitting real APIs.

```python
# backend/tests/test_adapters.py
from unittest.mock import Mock, patch
from integrations.adapters.udsm import UDSMAdapter
from integrations.contracts import UniversityCredentials

def test_udsm_authenticate_valid_credentials():
    adapter = UDSMAdapter()
    with patch('requests.post') as mock_post:
        mock_post.return_value.json.return_value = {
            "verified": True,
            "student": {
                "externalId": "45891",
                "fullName": "John Doe",
                "email": "john@udsm.ac.tz"
            }
        }
        credentials = UniversityCredentials(
            student_id="UDSM-2026-00123",
            password="password"
        )
        student = adapter.authenticate(credentials)
        assert student.external_student_id == "45891"
        assert student.display_name == "John Doe"

def test_udsm_authenticate_invalid_credentials():
    adapter = UDSMAdapter()
    with patch('requests.post') as mock_post:
        mock_post.return_value.status_code = 401
        with pytest.raises(ProviderError) as exc:
            adapter.authenticate(UniversityCredentials(...))
        assert exc.value.code == "INVALID_STUDENT_CREDENTIALS"
```

### Integration Tests
Test adapter + Django models + caching.

### End-to-End Tests
Test full login flow against a fake provider (WireMock).

### Performance Tests
- Sync 1000 students' profiles: < 60s
- Fetch profile from cache: < 100ms
- Fetch results from API: < 500ms

---

## Monitoring & Alerting

### Key Metrics
```
provider_api_latency_seconds{university="udsm"}
provider_api_errors_total{university="udsm", error_code="..."}
sync_duration_seconds{university="udsm", resource="profile"}
sync_success_rate{university="udsm"}
cache_hit_rate
cache_stale_count
```

### Alerts
- Provider latency > 2s
- Provider error rate > 5%
- Sync failure rate > 10%
- Student login failures > 10 per minute
- Provider health check failures > 3 consecutive

---

## Future Integrations

This architecture supports:
- **Library systems** (book search, borrowing, renewals)
- **Payment gateway integration** (M-Pesa, Airtel Money)
- **LMS integration** (course materials, assignment submission)
- **TCU verification** (verify credentials with Tanzania Commission for Universities)
- **Email/SMS notifications** (exam schedules, results posted, fee due)

Add these as new adapter types without changing the core student contract.

---

## Ownership & Responsibilities

| Component | Owner | Responsibility |
|-----------|-------|-----------------|
| Mobile App | React Native Dev | Presentation, token storage, offline cache invalidation |
| Django Backend | Backend Dev | Auth, adapter calls, normalization, caching, authorization |
| PostgreSQL | DevOps | Backups, replication, performance tuning |
| Redis | DevOps | Replication, monitoring, memory limits |
| Celery Workers | DevOps | Scaling, monitoring, graceful shutdown |
| Provider APIs | External | Availability, documentation, support |

---

## Contact Points & Runbooks

Provider-specific questions belong in adapter modules, not in shared views or DTOs. Each adapter should document:
- Supported features and limitations
- API endpoint URLs and authentication
- Rate limits and retry strategies
- Error codes and handling
- Sample payloads
- Known quirks (e.g., SUZA uses SOAP, OUT doesn't provide timetable)

Example: `backend/integrations/adapters/UDSM_RUNBOOK.md`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | Sep 3, 2026 | Multi-university adapter system, 10+ university specs, Type C support, comprehensive sync strategy, production checklist |
| 1.0 | Jul 17, 2026 | Initial architecture blueprint, single adapter pattern, basic sync strategy |

---

## End of Document

## Backend apps
- `accounts`: ChuoApp users, JWT/session authentication, linked university identity.
- `universities`: public directory, provider configuration, feature flags, health status.
- `integrations`: adapter interface, registry, provider clients, normalization and error mapping.
- `academic`: minimal cached profile, results, fees, timetable, and courses.
- `sync`: Celery tasks, freshness policy, retries, audit and sync status.

## API surface
`GET /api/v1/universities/`
`POST /api/v1/auth/university-login/`
`POST /api/v1/auth/refresh/`
`POST /api/v1/auth/logout/`
`GET /api/v1/me/`
`GET /api/v1/me/profile/`
`GET /api/v1/me/results/?semester=`
`GET /api/v1/me/transcript/`
`GET /api/v1/me/fees/`
`GET /api/v1/me/payments/`
`GET /api/v1/me/timetable/`
`GET /api/v1/me/courses/`
`POST /api/v1/me/sync/`
`GET /api/v1/me/sync-status/`
`GET /api/v1/health/`

## Storage policy
Store only data needed for fast UX and historical views: provider student identifier, profile fields, normalized results, fee records, timetable, sync timestamps, and provider health. Never store university passwords. If a provider requires a refresh token, encrypt it with an application-managed key, restrict access to workers, rotate it, and delete it on unlink.

## PostgreSQL model
`University(slug, name, acronym, adapter_key, base_url, enabled, features, health_status)`
`User(email, is_active, created_at, last_login_at)`
`UniversityIdentity(user, university, external_student_id, external_email, verified_at, last_seen_at)` with a unique `(university, external_student_id)`.
`StudentProfile(identity, name, program, department, year, semester, gpa, cgpa, photo_url, synced_at)`.
`AcademicResult(identity, course_code, course_name, credits, grade, grade_point, semester, academic_year, source_updated_at)`.
`FeeRecord(identity, external_id, description, amount, status, due_date, payment_date, receipt_number, source_updated_at)`.
`TimetableEntry(identity, external_id, course_code, course_name, day, start_time, end_time, location, lecturer, semester, source_updated_at)`.
`SyncRun(identity, resource, status, started_at, finished_at, error_code, records_written)`.
`ProviderHealth(university, checked_at, latency_ms, status, last_error_code)`.

Use foreign keys with cascade from user to identity and identity to cached data. Add indexes on `(identity, semester)`, `(identity, academic_year)`, status, and sync timestamps. Use DRF object-level permissions and queryset scoping on the authenticated user for every `me` resource.

## Credit-efficient sync
Read cache first. Return cached data when fresh; refresh only stale resources. Profile/timetable: daily or on demand. Results/fees: on login, explicit refresh, and a conservative schedule. Use ETags/provider timestamps where supported, exponential backoff, circuit breaking, request timeouts, and deduplicated Celery jobs. Never poll all universities or all students.

## Security
TLS only, short-lived access tokens, rotating refresh tokens, rate-limit login and sync endpoints, redact provider credentials and PII from logs, validate all provider payloads with serializers, and use least-privilege service accounts. University verification proves identity; it must not grant admin privileges.

## Rollout
1. Build contract tests and a fake adapter.
2. Integrate one university with a verified sandbox/contract.
3. Enable read-only profile/results/fees/timetable.
4. Add remaining adapters behind feature flags.
5. Add Celery sync and provider health dashboards.
6. Enable course registration only after explicit provider mutation contracts and idempotency are tested.

## Required backend environment
`DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DATABASE_URL`, `REDIS_URL`, `JWT_SIGNING_KEY`, `ENCRYPTION_KEY`, `CORS_ALLOWED_ORIGINS`, and per-provider URLs/client credentials kept server-side. Use a secrets manager in production; never commit `.env` files.

## Frontend contract
The mobile client must use one `API_BASE_URL` for Django and send `X-University-ID` only for directory selection/login context. It must not dynamically switch its base URL to university domains.

## Pages covered
University directory/selection, sign-in, dashboard, profile, results/transcript, fees/payment history, timetable, courses, sync status, settings/logout, and error/maintenance states. All pages consume the unified `/me` endpoints and feature flags rather than provider-specific routes.

## Open operational requirement
Obtain and verify each university's official API documentation, authorization method, rate limits, and permission to integrate before enabling its adapter. The current mobile URLs are configuration placeholders until verified.

## Local backend bootstrap
```text
cd backend
python -m venv .venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```
Workers use `celery -A config worker -l info` and `celery -A config beat -l info`.
``` 

## Definition of done
Every adapter passes the shared contract suite; no password is persisted; all user data is scoped by identity; stale data is visibly labeled; sync retries are bounded; and provider failures degrade to cached data without breaking the app.

``` 

## Note
This blueprint intentionally does not invent university API payloads. Real adapter implementations begin only after official contracts are supplied or verified.
``` 

## Implementation status
The repository now contains a Django backend skeleton and a frontend client pointed at the unified backend contract. Add real provider credentials only through deployment environment settings.
``` 

## API response envelope
```json
{"success": true, "data": {}, "message": null, "error": null}
```
Errors use stable codes such as `UNIVERSITY_UNAVAILABLE`, `INVALID_STUDENT_CREDENTIALS`, `DATA_STALE`, and `SYNC_IN_PROGRESS`.
``` 

## Ownership
Mobile owns presentation and secure token storage. Django owns auth, provider calls, normalization, caching, authorization, and sync orchestration. PostgreSQL owns durable normalized data; Redis owns ephemeral queue/cache state.
``` 

## Future integrations
The registry can support LMS, library, payments, and TCU verification as separate capabilities without changing the core student contract.
``` 

## Testing
Use adapter contract tests with mocked provider responses, Django API tests for ownership and throttling, migration tests, and end-to-end tests against a fake provider. Never use real student credentials in tests.
``` 

## Migration guidance
Use additive migrations, preserve external IDs, upsert by `(identity, external_id)` where available, and retain last-known-good cache during provider outages.
``` 

## Final recommendation
Build one reliable backend gateway, not a collection of university URLs in the app. This gives ChuoApp one auth flow, one API contract, one security boundary, and a low-cost path to add universities incrementally.
``` 

## Version
Architecture v1 — Django + PostgreSQL.
``` 

## Contact points
Provider-specific questions belong in adapter modules and provider runbooks, not in screens or shared DTOs.
``` 

## End
``` 

## Appendix
Do not expose provider base URLs if they reveal internal infrastructure; return only public university metadata to the client.
``` 

## Status labels
`fresh`, `stale`, `syncing`, `unavailable`, and `maintenance` are client-safe statuses.
``` 

## Sync defaults
Freshness defaults are server-configured per resource and can be overridden per university after observing provider limits.
``` 

## Resilience
Cached reads should remain available during a provider outage, with a clear last-synced timestamp and retry action.
``` 

## Compliance
Collect consent for university data access, provide unlink/delete controls, and define retention periods before launch.
``` 

## Django backend and database design

This section is the implementation contract for the Django + PostgreSQL backend. It is intentionally provider-neutral: the same canonical tables serve Type A universities through adapters and Type C universities through ChuoApp staff workflows.

### Django app boundaries

| App | Responsibility | Core models |
|---|---|---|
| `accounts` | Account identity, university membership, JWT-facing security | `User`, `UniversityIdentity`, `ProviderToken` |
| `universities` | Tenancy, academic organization, capabilities, staff access | `University`, `Campus`, `Faculty`, `Department`, `Program`, `AcademicPeriod`, `UniversityStaffMembership`, `UniversityIntegration` |
| `academic` | Canonical academic records and cached provider data | `StudentProfile`, `Course`, `Enrollment`, `AcademicResult`, `TimetableEntry`, `Announcement` |
| `finance` | Fees, invoices, payments, receipts, reconciliation | `FeeStructure`, `FeeStructureLine`, `StudentFeeAccount`, `Invoice`, `InvoiceLine`, `Payment`, `Receipt` |
| `integrations` | Adapter contracts, provider clients, field mappings, secrets references | `UniversityAdapter`, `UniversityIntegration`, `FieldMapping` |
| `sync` | Durable synchronization and provider events | `SyncPolicy`, `SyncRun`, `SyncCursor`, `ProviderEvent`, `IntegrationRequestLog`, `ProviderHealthCheck` |

### Canonical relationships

```text
User 1──* UniversityMembership *──1 University
University 1──* StaffMembership
University 1──* Campus/Faculty/Department/Program/AcademicPeriod
UniversityMembership 1──1 StudentProfile
StudentProfile 1──* Enrollment *──1 Course
Enrollment 1──* AcademicResult
UniversityMembership 1──* StudentFeeAccount 1──* Invoice 1──* InvoiceLine
Invoice 1──* Payment 1──0..1 Receipt
University 1──* UniversityIntegration 1──* SyncRun/SyncCursor/ProviderEvent
```

`UniversityIdentity` should be renamed to `UniversityMembership` during the first additive migration, or retained as a compatibility name with the expanded fields. Every university-owned model must reach `University` directly or through a required membership relation.

### Model rules

- Use UUID primary keys for new domain models and UTC-aware timestamps (`created_at`, `updated_at`).
- `UniversityMembership` contains `user`, `university`, `external_student_id`, `registration_number`, `status`, `verified_at`, `activated_at`, `deactivated_at`, `last_seen_at`, and `source_metadata`.
- Enforce unique `(university, external_student_id)` and unique `(university, registration_number)` when values exist. Add a conditional unique constraint for one active membership per user.
- `StudentProfile` belongs to the membership, not directly to a global user. Keep source timestamps and `last_synced_at` for stale-data display.
- `AcademicPeriod` belongs to one university and has `academic_year`, `term`, `starts_on`, `ends_on`, and `is_current`; constrain one current period per university and term.
- `Program`, `Course`, `Enrollment`, and `AcademicResult` retain nullable provider IDs for Type C records and stable `external_id` values for Type A records.
- `Invoice`, `Payment`, and `Receipt` use `DecimalField` for TZS amounts, currency codes, immutable provider references, and status enums. Never calculate money with floats.
- Financial and academic history uses `PROTECT` or deactivation; never cascade-delete invoices, payments, receipts, results, memberships, or audit records.
- Provider status values are normalized into ChuoApp enums while the original status is retained in controlled metadata.

### Required database constraints and indexes

```text
UNIQUE (university_id, external_id) on every provider-sourced entity
UNIQUE (membership_id, academic_period_id, currency) on StudentFeeAccount
UNIQUE (university_id, external_invoice_id)
UNIQUE (university_id, provider_payment_id) when provider ID exists
UNIQUE (integration_id, resource, cursor_key) on SyncCursor
UNIQUE (integration_id, provider_event_id) on ProviderEvent
PARTIAL UNIQUE (user_id) WHERE membership.status = 'active' via service/constraint strategy
INDEX (university_id, status)
INDEX (membership_id, academic_period_id)
INDEX (university_id, updated_at)
INDEX (sync_run status, started_at)
```

Because PostgreSQL cannot enforce a partial uniqueness rule across a related table, enforce one active membership with a direct `is_active` membership field plus a partial unique index on `user_id`, and validate every status transition inside `transaction.atomic()` with `select_for_update()`.

### Integration configuration

`UniversityIntegration` stores only non-secret configuration: `university`, `adapter_key`, `environment`, `base_url`, `api_version`, `enabled`, `capabilities`, timeout, rate-limit policy, pagination mode, webhook support, documentation URL, and verification status. Credentials are referenced by `IntegrationSecretReference`; secret values belong in the deployment secret manager or encrypted storage and must never be serialized by DRF.

Each adapter is selected by `adapter_key` from the registry. It must implement student verification, profile, fees/invoices, results, courses, timetable, and optional payment status methods. Unsupported capabilities are disabled per integration; no university URL, endpoint, authentication method, or rate limit is considered real until verified from official documentation and sandbox credentials.

### Synchronization design

Use Celery for slow work and PostgreSQL for durable job state. A `SyncRun` records integration, university or membership scope, resource, status, cursor, records read/written, retry count, timestamps, correlation ID, and a redacted error code. `SyncCursor` stores `updated_since`, page token, or provider-specific checkpoint. Every upsert uses `(university_id, external_id)` and is safe to retry.

Prefer webhooks with unique event IDs. Otherwise poll incrementally with pagination, `updated_since`, ETags, and per-provider freshness policies. On failure, preserve last-known-good rows and expose `last_synced_at`, `stale`, and `provider_unavailable` metadata rather than deleting cached data.

### API and service layers

DRF views remain thin. `services/identity.py` handles verification and membership transitions; `services/upsert.py` performs transaction-safe canonical writes; `integrations/` handles provider communication; `sync/` schedules and records work; serializers never call providers directly.

Expose:

```text
/api/v1/auth/token/
/api/v1/auth/token/refresh/
/api/v1/auth/university-login/
/api/v1/me/profile/
/api/v1/me/fees/
/api/v1/me/invoices/
/api/v1/me/results/
/api/v1/me/courses/
/api/v1/me/timetable/
/api/v1/universities/
/api/v1/staff/{resource}/
/api/v1/integrations/{integration}/health/
/api/v1/integrations/{integration}/sync/
/api/v1/webhooks/{adapter_key}/
```

All `/me` querysets scope through the authenticated user's active membership. Staff querysets scope through an active `UniversityStaffMembership` and role permission. Provider calls happen server-side only; clients receive normalized cached resources and freshness metadata.

### Security and privacy requirements

Use DRF SimpleJWT with short-lived access tokens, rotating refresh tokens, revocation, throttling, and secure production cookie/token policies. Never store university student passwords or log JWTs, API keys, raw provider payloads, or unnecessary PII. Verify webhook signatures and reject replayed event IDs. Encrypt secret references, audit staff changes, and define retention, correction, unlink, and deletion rules in each university data-processing agreement.

### Migration sequence

1. Add shared UUID/audit fields and enums without removing existing columns.
2. Expand `University` with type, timezone, currency, status, and integration metadata.
3. Expand `UniversityIdentity` into membership fields and add active-membership constraints.
4. Add organization and academic-period models.
5. Add canonical academic and finance models.
6. Add integration and sync state models.
7. Backfill existing identities and results using deterministic external IDs.
8. Add scoped DRF services and tests; remove compatibility columns only after a verified release.

Do not run migrations or provider setup as part of this design change. Before implementation, generate and review Django migrations in CI against PostgreSQL, then apply them through the deployment migration process.

### Acceptance tests

The design is ready for coding when tests cover: one-active-membership enforcement, historical membership access, university tenant isolation, Type A and Type C parity, provider-idempotent upserts, duplicate webhook rejection, stale-cache fallback, JWT authorization, staff role boundaries, money precision, protected financial history, retry/circuit-breaker behavior, and adapter contract compliance across at least ten fake providers.

## End of document
``` 
