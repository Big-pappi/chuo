# Scaling University Integrations: Logic for 20+ Universities in Tanzania

## Overview

This document explains the architecture and implementation logic for scaling CHUO's integration system to handle 20+ universities in Tanzania. Each university may have different systems, APIs, and data formats, requiring a flexible, scalable, and reliable integration architecture.

## Table of Contents

1. [Current Integration Architecture](#current-integration-architecture)
2. [Challenges with 20+ Universities](#challenges-with-20-universities)
3. [Architecture Components](#architecture-components)
4. [Implementation Strategy](#implementation-strategy)
5. [Code Examples](#code-examples)
6. [Best Practices](#best-practices)
7. [Tanzanian University Examples](#tanzanian-university-examples)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Current Integration Architecture

The integrations app already supports multiple universities through the `UniversityIntegration` model:

```python
class UniversityIntegration(models.Model):
    university = OneToOneField(University)  # Each university has one integration config
    api_type = CharField  # REST, SOAP, GraphQL, Custom
    api_endpoint = URLField  # Their API URL
    api_key = CharField  # Their auth key
    api_secret = CharField  # Their API secret
    sync_frequency = IntegerField  # How often to sync (seconds)
    sync_enabled = BooleanField
    configuration = JSONField  # Custom config per university
    last_sync = DateTimeField
    created_at = DateTimeField
    updated_at = DateTimeField
```

### Core Sync Service

The current `UniversitySyncService` provides basic sync capabilities:
- Student sync
- Course sync
- Enrollment sync
- Full sync (all data)

### Current Limitations

While the current architecture supports multiple universities, it needs enhancements for 20+ universities:
- No adapter pattern for different API structures
- No staggered scheduling (all syncs run at once)
- No queue-based processing (syncs are synchronous)
- Limited error handling and retry logic
- No rate limiting to respect university API limits
- Limited monitoring and alerting

---

## Challenges with 20+ Universities

### 1. Heterogeneous Systems

Each university may have:
- Different API protocols (REST, SOAP, GraphQL, custom)
- Different data formats (JSON, XML, CSV)
- Different field names and structures
- Different authentication methods (API keys, OAuth, JWT)
- Different rate limits and API policies

### 2. Performance Issues

- Syncing 20+ universities sequentially takes too long
- University APIs may have rate limits
- Network latency varies between universities
- Some universities have slow legacy systems

### 3. Reliability Concerns

- University APIs may be temporarily unavailable
- Network failures can occur
- Data corruption during sync
- Need for retry logic and error recovery

### 4. Data Integrity

- Need to ensure consistent data across all universities
- Handle conflicts and duplicates
- Transaction safety for critical operations
- Rollback on sync failure

### 5. Monitoring Complexity

- Need to track sync status for 20+ universities
- Identify failed syncs quickly
- Alert on critical failures
- Generate reports on sync performance

---

## Architecture Components

### 1. Adapter Pattern

Each university gets its own adapter class that handles:

- API communication
- Data transformation
- Error handling specific to that university
- Rate limiting

```python
class UniversityAdapter:
    """Base adapter for university integrations."""
    
    def __init__(self, integration_config):
        self.config = integration_config
        self.headers = self._build_headers()
    
    def _build_headers(self):
        """Build headers for API requests."""
        headers = {'Content-Type': 'application/json'}
        if self.config.api_key:
            headers['X-API-Key'] = self.config.api_key
        if self.config.api_secret:
            headers['X-API-Secret'] = self.config.api_secret
        return headers
    
    def fetch_students(self):
        """Fetch students from university API."""
        raise NotImplementedError
    
    def fetch_courses(self):
        """Fetch courses from university API."""
        raise NotImplementedError
    
    def fetch_enrollments(self):
        """Fetch enrollments from university API."""
        raise NotImplementedError
    
    def transform_students(self, data):
        """Transform university data to CHUO format."""
        raise NotImplementedError
```

### 2. Adapter Factory

Factory pattern to select the correct adapter:

```python
class AdapterFactory:
    """Factory for creating university adapters."""
    
    @staticmethod
    def get_adapter(integration):
        """Get the appropriate adapter for a university."""
        adapter_type = integration.configuration.get('adapter_type', 'default')
        adapter_class = ADAPTER_MAP.get(adapter_type, DefaultRESTAdapter)
        return adapter_class(integration)

ADAPTER_MAP = {
    'udsm_rest': UDSMAdapter,
    'sua_soap': SUAAdapter,
    'must_custom': MUSTAdapter,
    'ardhi_rest': ArdhiAdapter,
    'muhas_rest': MUHASAdapter,
    'nm_aist_rest': NMAISTAdapter,
    # ... for each university
}
```

### 3. Queue-Based Processing (Celery)

Async processing to handle multiple syncs concurrently:

```python
from celery import shared_task

@shared_task(bind=True, max_retries=3)
def sync_university_students(self, university_id):
    """Sync students for a specific university."""
    try:
        integration = UniversityIntegration.objects.get(university_id=university_id)
        service = UniversitySyncService(integration)
        service.sync_students()
        return {'status': 'success', 'university_id': university_id}
    except Exception as e:
        # Retry logic
        if self.request.retries < self.max_retries:
            raise self.retry(countdown=300, exc=e)
        return {'status': 'failed', 'university_id': university_id, 'error': str(e)}

@shared_task
def sync_all_universities():
    """Trigger sync for all enabled universities."""
    universities = UniversityIntegration.objects.filter(sync_enabled=True)
    for integration in universities:
        sync_university_students.delay(integration.university.id)
```

### 4. Staggered Scheduling

Distribute sync times to avoid API overload:

```python
from celery.schedules import crontab

def generate_celery_schedule():
    """Generate Celery beat schedule for all universities."""
    schedule = {}
    universities = UniversityIntegration.objects.filter(sync_enabled=True)
    
    for i, integration in enumerate(universities):
        # Distribute syncs across the hour (every 3 minutes)
        minute = (i * 3) % 60
        schedule[f'sync-{integration.university.code}'] = {
            'task': 'sync_university_students',
            'schedule': crontab(minute=minute),
            'args': (integration.university.id,),
        }
    
    return schedule

CELERY_BEAT_SCHEDULE = generate_celery_schedule()
```

### 5. Rate Limiting

Respect university API rate limits:

```python
class UniversitySyncService:
    """Service with rate limiting for API requests."""
    
    def __init__(self, integration):
        self.integration = integration
        self.last_request_time = None
        self.min_request_interval = integration.configuration.get(
            'min_request_interval', 1
        )  # Default 1 second between requests
    
    def _make_request(self, endpoint, method='GET', data=None):
        """Make API request with rate limiting."""
        # Rate limiting
        if self.last_request_time:
            elapsed = time.time() - self.last_request_time
            if elapsed < self.min_request_interval:
                time.sleep(self.min_request_interval - elapsed)
        
        if method == 'GET':
            response = requests.get(endpoint, headers=self.headers, timeout=30)
        elif method == 'POST':
            response = requests.post(endpoint, headers=self.headers, json=data, timeout=30)
        
        self.last_request_time = time.time()
        return response
```

### 6. Error Handling & Retry Logic

Robust error handling with intelligent retries:

```python
@shared_task(bind=True, max_retries=3)
def sync_university_students(self, university_id):
    """Sync students with intelligent retry logic."""
    try:
        integration = UniversityIntegration.objects.get(university_id=university_id)
        service = UniversitySyncService(integration)
        service.sync_students()
        
    except requests.exceptions.Timeout:
        # Timeout - retry after 5 minutes
        raise self.retry(countdown=300, exc=TimeoutError("Request timeout"))
    
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 429:  # Rate limited
            # Retry after 1 hour
            raise self.retry(countdown=3600, exc=e)
        elif e.response.status_code == 500:  # Server error
            # Retry after 10 minutes
            raise self.retry(countdown=600, exc=e)
        elif e.response.status_code == 503:  # Service unavailable
            # Retry after 15 minutes
            raise self.retry(countdown=900, exc=e)
        else:
            # Client error - don't retry
            log_sync_error(integration, str(e))
            alert_admins(integration.university.name, str(e))
    
    except requests.exceptions.ConnectionError:
        # Connection error - retry after 2 minutes
        raise self.retry(countdown=120, exc=ConnectionError("Connection failed"))
    
    except Exception as e:
        # Unknown error - log and alert
        log_sync_error(integration, str(e))
        alert_admins(integration.university.name, str(e))
```

### 7. Monitoring & Alerting

Comprehensive monitoring system:

```python
class SyncDashboard:
    """Dashboard for monitoring sync operations."""
    
    def get_status(self):
        """Get overall sync status."""
        return {
            'total_universities': UniversityIntegration.objects.count(),
            'active_syncs': SyncLog.objects.filter(status='running').count(),
            'sync_enabled': UniversityIntegration.objects.filter(sync_enabled=True).count(),
            'failed_syncs_last_24h': SyncLog.objects.filter(
                status='failed',
                created_at__gte=timezone.now() - timedelta(hours=24)
            ).count(),
            'success_rate': self.calculate_success_rate(),
            'avg_sync_duration': self.calculate_avg_duration(),
        }
    
    def get_university_status(self):
        """Get status per university."""
        status = []
        for integration in UniversityIntegration.objects.all():
            last_sync = SyncLog.objects.filter(
                integration=integration
            ).order_by('-created_at').first()
            
            status.append({
                'university': integration.university.name,
                'university_code': integration.university.code,
                'sync_enabled': integration.sync_enabled,
                'last_sync': last_sync.created_at if last_sync else None,
                'status': last_sync.status if last_sync else 'never',
                'records_processed': last_sync.records_processed if last_sync else 0,
                'records_failed': last_sync.records_failed if last_sync else 0,
                'sync_type': last_sync.sync_type if last_sync else None,
                'error_message': last_sync.error_message if last_sync else None,
            })
        
        return status
```

### 8. Configuration Management

Flexible configuration per university:

```python
class UniversityIntegration(models.Model):
    configuration = JSONField(default=dict)
    # Example configuration for different universities:
    
    # UDSM Configuration:
    # {
    #   "adapter_type": "udsm_rest",
    #   "student_endpoint": "/api/v2/students",
    #   "course_endpoint": "/api/v2/courses",
    #   "enrollment_endpoint": "/api/v2/enrollments",
    #   "date_format": "%Y-%m-%d",
    #   "id_field": "student_id",
    #   "min_request_interval": 2,
    #   "transformations": {
    #     "student_number": "reg_no",
    #     "first_name": "fname",
    #     "last_name": "lname",
    #     "email": "email_address"
    #   }
    # }
    
    # SUA Configuration:
    # {
    #   "adapter_type": "sua_soap",
    #   "wsdl_url": "https://api.sua.ac.uz/wsdl",
    #   "student_method": "GetStudents",
    #   "min_request_interval": 5,
    #   "auth_type": "basic"
    # }
```

---

## Implementation Strategy

### Phase 1: Adapter Pattern Implementation

**Goal**: Create flexible adapters for different university APIs

**Steps**:
1. Create base `UniversityAdapter` class
2. Implement `DefaultRESTAdapter` for standard REST APIs
3. Create university-specific adapters as needed
4. Implement `AdapterFactory` to select correct adapter
5. Add configuration field mapping logic

**Files to Create**:
- `integrations/adapters/__init__.py`
- `integrations/adapters/base.py`
- `integrations/adapters/default_rest.py`
- `integrations/adapters/udsm.py`
- `integrations/adapters/sua.py`
- ... (one per university if needed)

### Phase 2: Celery Integration

**Goal**: Enable async processing and scheduled tasks

**Steps**:
1. Install and configure Celery
2. Create Celery app configuration
3. Implement Celery tasks for sync operations
4. Set up Celery Beat for scheduled tasks
5. Configure Redis as broker and backend
6. Implement staggered scheduling logic

**Files to Modify**:
- `chuo/celery.py` (create)
- `integrations/tasks.py` (create)
- `docker-compose.yml` (add Celery worker)

### Phase 3: Enhanced Error Handling

**Goal**: Robust error handling with intelligent retries

**Steps**:
1. Add retry logic to Celery tasks
2. Implement specific handlers for different error types
3. Add logging and alerting system
4. Create error classification system
5. Implement circuit breaker pattern for failing APIs

**Files to Modify**:
- `integrations/services/sync.py`
- `integrations/utils/error_handler.py` (create)

### Phase 4: Rate Limiting

**Goal**: Respect university API rate limits

**Steps**:
1. Add rate limiting to sync service
2. Implement per-university rate limit configuration
4. Add request queue management
5. Implement backoff strategies

**Files to Modify**:
- `integrations/services/sync.py`

### Phase 5: Monitoring Dashboard

**Goal**: Real-time monitoring of sync operations

**Steps**:
1. Create monitoring API endpoints
2. Implement dashboard data aggregation
3. Add alert system for failures
4. Create sync performance metrics
5. Add admin dashboard for manual sync triggering

**Files to Create**:
- `integrations/viewsets/monitoring.py`
- `integrations/urls/monitoring.py`

### Phase 6: Configuration Management

**Goal**: Flexible per-university configuration

**Steps**:
1. Define configuration schema
2. Create configuration validation
3. Implement configuration UI in Django Admin
4. Add configuration migration helpers
5. Document configuration options

**Files to Modify**:
- `integrations/admin.py`
- `integrations/models/integration.py`

---

## Code Examples

### Example 1: University-Specific Adapter (UDSM)

```python
# integrations/adapters/udsm.py
from integrations.adapters.base import UniversityAdapter

class UDSMAdapter(UniversityAdapter):
    """Adapter for University of Dar es Salaam (UDSM)."""
    
    def __init__(self, integration):
        super().__init__(integration)
        self.student_endpoint = integration.configuration.get(
            'student_endpoint', '/api/v2/students'
        )
        self.course_endpoint = integration.configuration.get(
            'course_endpoint', '/api/v2/courses'
        )
        self.enrollment_endpoint = integration.configuration.get(
            'enrollment_endpoint', '/api/v2/enrollments'
        )
    
    def fetch_students(self):
        """Fetch students from UDSM API."""
        response = self._make_request(self.student_endpoint)
        return self._transform_students(response.json())
    
    def _transform_students(self, data):
        """Transform UDSM format to CHUO format."""
        transformations = self.config.configuration.get('transformations', {})
        
        transformed = []
        for student in data:
            transformed.append({
                'email': student.get(transformations.get('email', 'email')),
                'first_name': student.get(transformations.get('first_name', 'first_name')),
                'last_name': student.get(transformations.get('last_name', 'last_name')),
                'student_number': student.get(transformations.get('student_number', 'student_number')),
                'year': student.get('year', 1),
                'semester': student.get('semester', '1'),
                'department_id': student.get('department_code'),
                'admission_date': self._parse_date(student.get('admission_date')),
            })
        
        return transformed
    
    def _parse_date(self, date_str):
        """Parse date according to university's date format."""
        date_format = self.config.configuration.get('date_format', '%Y-%m-%d')
        try:
            return datetime.strptime(date_str, date_format).date()
        except:
            return None
```

### Example 2: Celery Task with Retry Logic

```python
# integrations/tasks/celery_tasks.py
from celery import shared_task
from celery.exceptions import Retry
from integrations.services.sync import UniversitySyncService
from integrations.models import UniversityIntegration, SyncLog
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

@shared_task(bind=True, max_retries=3, default_retry_delay=300)
def sync_university_students(self, university_id):
    """Sync students for a specific university with retry logic."""
    try:
        # Create sync log
        integration = UniversityIntegration.objects.get(university_id=university_id)
        log = SyncLog.objects.create(
            integration=integration,
            sync_type='students',
            status='running',
            started_at=timezone.now()
        )
        
        # Perform sync
        service = UniversitySyncService(integration)
        service.sync_students()
        
        # Update log on success
        log.status = 'success'
        log.completed_at = timezone.now()
        log.save()
        
        # Update integration last sync time
        integration.last_sync = timezone.now()
        integration.save()
        
        logger.info(f"Successfully synced students for {integration.university.name}")
        return {'status': 'success', 'university_id': university_id}
        
    except requests.exceptions.Timeout as e:
        logger.error(f"Timeout syncing students for university {university_id}: {e}")
        log.status = 'failed'
        log.error_message = f"Timeout: {str(e)}"
        log.completed_at = timezone.now()
        log.save()
        raise Retry(f"Timeout - will retry", exc=e)
    
    except requests.exceptions.HTTPError as e:
        status_code = e.response.status_code
        if status_code == 429:  # Rate limited
            logger.warning(f"Rate limited by university {university_id}")
            log.status = 'failed'
            log.error_message = f"Rate limited (429)"
            log.completed_at = timezone.now()
            log.save()
            raise Retry(f"Rate limited - will retry", countdown=3600, exc=e)
        elif status_code >= 500:  # Server error
            logger.error(f"Server error from university {university_id}: {e}")
            log.status = 'failed'
            log.error_message = f"Server error ({status_code})"
            log.completed_at = timezone.now()
            log.save()
            raise Retry(f"Server error - will retry", countdown=600, exc=e)
        else:
            logger.error(f"Client error from university {university_id}: {e}")
            log.status = 'failed'
            log.error_message = f"Client error ({status_code}): {str(e)}"
            log.completed_at = timezone.now()
            log.save()
            # Don't retry client errors
            return {'status': 'failed', 'university_id': university_id}
    
    except Exception as e:
        logger.error(f"Unexpected error syncing students for university {university_id}: {e}")
        log.status = 'failed'
        log.error_message = f"Unexpected error: {str(e)}"
        log.completed_at = timezone.now()
        log.save()
        # Alert admins
        alert_admins(integration.university.name, str(e))
        return {'status': 'failed', 'university_id': university_id}
```

### Example 3: Dynamic Celery Schedule

```python
# chuo/celery.py
from celery import Celery
from celery.schedules import crontab
from integrations.models import UniversityIntegration

app = Celery('chuo')

app.config_from_object('django.conf:settings', namespace='CELERY')

def generate_celery_schedule():
    """Generate dynamic schedule for all universities."""
    schedule = {}
    universities = UniversityIntegration.objects.filter(sync_enabled=True)
    
    for i, integration in enumerate(universities):
        # Distribute syncs across the hour (every 3 minutes)
        minute = (i * 3) % 60
        schedule[f'sync-{integration.university.code}-students'] = {
            'task': 'integrations.tasks.celery_tasks.sync_university_students',
            'schedule': crontab(minute=minute),
            'args': (integration.university.id,),
        }
        
        schedule[f'sync-{integration.university.code}-courses'] = {
            'task': 'integrations.tasks.celery_tasks.sync_university_courses',
            'schedule': crontab(minute=minute),
            'args': (integration.university.id,),
        }
    
    return schedule

app.conf.beat_schedule = generate_celery_schedule()
```

### Example 4: Monitoring ViewSet

```python
# integrations/viewsets/monitoring.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from integrations.models import UniversityIntegration, SyncLog
from integrations.utils.dashboard import SyncDashboard
from django.utils import timezone
from datetime import timedelta

class SyncMonitoringViewSet(viewsets.ViewSet):
    """ViewSet for monitoring sync operations."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Get overall sync dashboard."""
        dashboard = SyncDashboard()
        return Response(dashboard.get_status())
    
    @action(detail=False, methods=['get'])
    def university_status(self, request):
        """Get sync status for all universities."""
        dashboard = SyncDashboard()
        return Response(dashboard.get_university_status())
    
    @action(detail=False, methods=['get'])
    def recent_logs(self, request):
        """Get recent sync logs."""
        hours = int(request.query_params.get('hours', 24))
        since = timezone.now() - timedelta(hours=hours)
        
        logs = SyncLog.objects.filter(
            created_at__gte=since
        ).select_related('integration__university').order_by('-created_at')[:100]
        
        data = []
        for log in logs:
            data.append({
                'university': log.integration.university.name,
                'sync_type': log.sync_type,
                'status': log.status,
                'records_processed': log.records_processed,
                'records_failed': log.records_failed,
                'started_at': log.started_at,
                'completed_at': log.completed_at,
                'duration': (log.completed_at - log.started_at).total_seconds() if log.completed_at else None,
                'error_message': log.error_message,
            })
        
        return Response(data)
    
    @action(detail=False, methods=['post'])
    def trigger_sync(self, request):
        """Manually trigger sync for a university."""
        university_id = request.data.get('university_id')
        sync_type = request.data.get('sync_type', 'full')
        
        if not university_id:
            return Response({'error': 'university_id is required'}, status=400)
        
        try:
            from integrations.tasks.celery_tasks import sync_university_students
            
            if sync_type == 'students':
                sync_university_students.delay(university_id)
            elif sync_type == 'courses':
                # Similar task for courses
                pass
            elif sync_type == 'full':
                # Full sync task
                pass
            
            return Response({'message': 'Sync triggered successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)
```

---

## Best Practices

### 1. Idempotent Operations

Ensure sync operations can be safely retried:

```python
def sync_students(self):
    """Sync students - idempotent operation."""
    for student_data in self.fetch_students():
        student_number = student_data['student_number']
        
        # Use update_or_create to avoid duplicates
        user, created = User.objects.update_or_create(
            email=student_data['email'],
            defaults={
                'first_name': student_data['first_name'],
                'last_name': student_data['last_name'],
                'university': self.integration.university,
                'role': 'STUDENT',
            }
        )
        
        Student.objects.update_or_create(
            student_number=student_number,
            user=user,
            defaults={
                'university': self.integration.university,
                'department_id': student_data.get('department_id'),
                # ...
            }
        )
```

### 2. Batch Processing

Process data in batches to avoid memory issues:

```python
def sync_students(self):
    """Sync students in batches."""
    batch_size = 100
    page = 1
    
    while True:
        response = self._make_request(
            f"{self.student_endpoint}?page={page}&per_page={batch_size}"
        )
        students = response.json()
        
        if not students:
            break
        
        self._process_student_batch(students)
        page += 1
```

### 3. Transaction Safety

Use database transactions for critical operations:

```python
from django.db import transaction

def sync_students(self):
    """Sync students with transaction safety."""
    students_data = self.fetch_students()
    
    try:
        with transaction.atomic():
            for student_data in students_data:
                self._create_or_update_student(student_data)
    except Exception as e:
        # Transaction will be rolled back automatically
        logger.error(f"Transaction failed: {e}")
        raise
```

### 4. Logging Strategy

Comprehensive logging for debugging:

```python
import logging

logger = logging.getLogger(__name__)

def sync_students(self):
    """Sync students with detailed logging."""
    logger.info(f"Starting student sync for {self.integration.university.name}")
    
    try:
        students_data = self.fetch_students()
        logger.info(f"Fetched {len(students_data)} students from API")
        
        for i, student_data in enumerate(students_data):
            self._create_or_update_student(student_data)
            
            if (i + 1) % 100 == 0:
                logger.info(f"Processed {i + 1}/{len(students_data)} students")
        
        logger.info(f"Successfully synced {len(students_data)} students")
        
    except Exception as e:
        logger.error(f"Student sync failed: {e}", exc_info=True)
        raise
```

### 5. API Health Checks

Check university API health before sync:

```python
def check_api_health(self):
    """Check if university API is healthy."""
    try:
        response = self._make_request('/health', timeout=10)
        return response.status_code == 200
    except:
        return False

def sync_students(self):
    """Sync students with health check."""
    if not self.check_api_health():
        logger.warning(f"API unhealthy for {self.integration.university.name}")
        return
    
    # Proceed with sync
    students_data = self.fetch_students()
    # ...
```

---

## Tanzanian University Examples

### University of Dar es Salaam (UDSM)

**API Type**: REST
**Characteristics**:
- Standard REST API
- JSON responses
- OAuth 2.0 authentication
- Rate limit: 100 requests/minute

**Configuration**:
```json
{
  "adapter_type": "udsm_rest",
  "student_endpoint": "/api/v2/students",
  "course_endpoint": "/api/v2/courses",
  "enrollment_endpoint": "/api/v2/enrollments",
  "auth_type": "oauth2",
  "oauth_url": "https://api.udsm.ac.tz/oauth/token",
  "min_request_interval": 1,
  "transformations": {
    "student_number": "reg_no",
    "first_name": "fname",
    "last_name": "lname",
    "email": "email_address"
  }
}
```

### Sokoine University of Agriculture (SUA)

**API Type**: SOAP
**Characteristics**:
- SOAP web service
- XML responses
- Basic authentication
- No rate limit

**Configuration**:
```json
{
  "adapter_type": "sua_soap",
  "wsdl_url": "https://api.sua.ac.tz/service?wsdl",
  "student_method": "GetStudents",
  "course_method": "GetCourses",
  "auth_type": "basic",
  "min_request_interval": 5,
  "transformations": {
    "student_number": "RegNo",
    "first_name": "FirstName",
    "last_name": "LastName",
    "email": "Email"
  }
}
```

### Mbeya University of Science and Technology (MUST)

**API Type**: Custom
**Characteristics**:
- Custom API
- JSON responses
- API key authentication
- Rate limit: 50 requests/minute

**Configuration**:
```json
{
  "adapter_type": "must_custom",
  "student_endpoint": "/api/students",
  "course_endpoint": "/api/courses",
  "auth_type": "api_key",
  "min_request_interval": 2,
  "transformations": {
    "student_number": "student_id",
    "first_name": "first_name",
    "last_name": "last_name",
    "email": "email"
  }
}
```

### Nelson Mandela African Institution of Science and Technology (NM-AIST)

**API Type**: REST
**Characteristics**:
- Standard REST API
- JSON responses
- JWT authentication
- Rate limit: 200 requests/minute

**Configuration**:
```json
{
  "adapter_type": "nm_aist_rest",
  "student_endpoint": "/api/v1/students",
  "course_endpoint": "/api/v1/courses",
  "auth_type": "jwt",
  "jwt_url": "https://api.nm-aist.ac.tz/auth/token",
  "min_request_interval": 1,
  "transformations": {
    "student_number": "student_id",
    "first_name": "first_name",
    "last_name": "last_name",
    "email": "email"
  }
}
```

### Ardhi University (ARU)

**API Type**: REST
**Characteristics**:
- Standard REST API
- JSON responses
- API key authentication
- Rate limit: 150 requests/minute

**Configuration**:
```json
{
  "adapter_type": "ardhi_rest",
  "student_endpoint": "/api/students",
  "course_endpoint": "/api/courses",
  "auth_type": "api_key",
  "min_request_interval": 1,
  "transformations": {
    "student_number": "student_reg_no",
    "first_name": "first_name",
    "last_name": "last_name",
    "email": "email_address"
  }
}
```

### Muhimbili University of Health and Allied Sciences (MUHAS)

**API Type**: REST
**Characteristics**:
- Standard REST API
- JSON responses
- OAuth 2.0 authentication
- Rate limit: 100 requests/minute

**Configuration**:
```json
{
  "adapter_type": "muhas_rest",
  "student_endpoint": "/api/v2/students",
  "course_endpoint": "/api/v2/courses",
  "auth_type": "oauth2",
  "oauth_url": "https://api.muhas.ac.tz/oauth/token",
  "min_request_interval": 1,
  "transformations": {
    "student_number": "reg_number",
    "first_name": "first_name",
    "last_name": "last_name",
    "email": "email"
  }
}
```

---

## Monitoring & Maintenance

### 1. Health Check Endpoint

```python
# integrations/viewsets/health.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from integrations.models import UniversityIntegration, SyncLog
from django.utils import timezone
from datetime import timedelta

@api_view(['GET'])
def health_check(request):
    """Health check for integration system."""
    total_universities = UniversityIntegration.objects.count()
    enabled_universities = UniversityIntegration.objects.filter(sync_enabled=True).count()
    
    failed_last_24h = SyncLog.objects.filter(
        status='failed',
        created_at__gte=timezone.now() - timedelta(hours=24)
    ).count()
    
    return Response({
        'status': 'healthy',
        'total_universities': total_universities,
        'enabled_universities': enabled_universities,
        'failed_syncs_24h': failed_last_24h,
        'timestamp': timezone.now().isoformat(),
    })
```

### 2. Alert System

```python
# integrations/utils/alerts.py
from django.core.mail import send_mail
from django.conf import settings

def alert_admins(university_name, error_message):
    """Send alert email to admins."""
    subject = f"CHUO Sync Alert: {university_name}"
    message = f"""
    University: {university_name}
    Error: {error_message}
    Time: {timezone.now().isoformat()}
    
    Please investigate the sync logs for more details.
    """
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=settings.ADMIN_EMAILS,
        fail_silently=False,
    )
```

### 3. Sync Statistics

```python
# integrations/utils/statistics.py
from integrations.models import SyncLog
from django.utils import timezone
from datetime import timedelta

class SyncStatistics:
    """Generate sync statistics."""
    
    @staticmethod
    def get_daily_stats(date=None):
        """Get sync statistics for a specific day."""
        if not date:
            date = timezone.now().date()
        
        logs = SyncLog.objects.filter(
            created_at__date=date
        )
        
        return {
            'total_syncs': logs.count(),
            'successful_syncs': logs.filter(status='success').count(),
            'failed_syncs': logs.filter(status='failed').count(),
            'total_records_processed': logs.aggregate(
                total=Sum('records_processed')
            )['total'] or 0,
            'total_records_failed': logs.aggregate(
                total=Sum('records_failed')
            )['total'] or 0,
            'avg_duration': self._calculate_avg_duration(logs),
        }
    
    @staticmethod
    def get_weekly_stats():
        """Get sync statistics for the past week."""
        week_ago = timezone.now() - timedelta(days=7)
        logs = SyncLog.objects.filter(created_at__gte=week_ago)
        
        return {
            'total_syncs': logs.count(),
            'successful_syncs': logs.filter(status='success').count(),
            'failed_syncs': logs.filter(status='failed').count(),
            'by_university': SyncStatistics._get_stats_by_university(logs),
        }
```

### 4. Sync Performance Dashboard

```python
# integrations/views/dashboard.py
from django.shortcuts import render
from integrations.utils.statistics import SyncStatistics

def sync_dashboard(request):
    """Render sync performance dashboard."""
    daily_stats = SyncStatistics.get_daily_stats()
    weekly_stats = SyncStatistics.get_weekly_stats()
    
    context = {
        'daily_stats': daily_stats,
        'weekly_stats': weekly_stats,
        'university_stats': SyncStatistics._get_stats_by_university(
            SyncLog.objects.all()
        ),
    }
    
    return render(request, 'integrations/dashboard.html', context)
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Create adapter base class
- [ ] Implement default REST adapter
- [ ] Create adapter factory
- [ ] Add configuration validation
- [ ] Create university-specific adapters (UDSM, SUA, etc.)

### Phase 2: Async Processing
- [ ] Install and configure Celery
- [ ] Create Celery app configuration
- [ ] Implement Celery tasks for sync operations
- [ ] Set up Redis as broker
- [ ] Add Celery worker to docker-compose
- [ ] Implement staggered scheduling

### Phase 3: Error Handling
- [ ] Add retry logic to Celery tasks
- [ ] Implement specific error handlers
- [ ] Add logging system
- [ ] Create alert system
- [ ] Implement circuit breaker pattern

### Phase 4: Rate Limiting
- [ ] Add rate limiting to sync service
- [ ] Implement per-university rate limits
- [ ] Add request queue management
- [ ] Implement backoff strategies

### Phase 5: Monitoring
- [ ] Create monitoring API endpoints
- [ ] Implement dashboard data aggregation
- [ ] Add alert system
- [ ] Create sync performance metrics
- [ ] Add health check endpoint

### Phase 6: Configuration
- [ ] Define configuration schema
- [ ] Create configuration validation
- [ ] Implement configuration UI in Django Admin
- [ ] Add configuration migration helpers
- [ ] Document configuration options

### Phase 7: Testing
- [ ] Write unit tests for adapters
- [ ] Write integration tests for sync service
- [ ] Test error handling and retry logic
- [ ] Test rate limiting
- [ ] Load test with 20+ universities

### Phase 8: Deployment
- [ ] Configure Celery for production
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Document disaster recovery
- ] Create runbooks for common issues

---

## Performance Considerations

### Expected Throughput

For 20 universities:
- **Students**: ~100,000 total students
- **Sync frequency**: Hourly
- **Total records/hour**: ~100,000 student records
- **Processing time**: ~2-3 hours with staggered scheduling

### Optimization Strategies

1. **Parallel Processing**: Use Celery with multiple workers
2. **Batch Processing**: Process records in batches of 100-1000
3. **Database Indexing**: Ensure proper indexes on all foreign keys
4. **Connection Pooling**: Optimize database connection pool
5. **Caching**: Cache frequently accessed data

### Scaling Recommendations

**For 20-50 universities**:
- 4 Celery workers
- Redis with 1GB memory
- PostgreSQL with 4GB memory
- Staggered sync every 3 minutes

**For 50-100 universities**:
- 8 Celery workers
- Redis with 2GB memory
- PostgreSQL with 8GB memory
- Staggered sync every 2 minutes
- Consider horizontal scaling (multiple servers)

---

## Security Considerations

### API Key Management

- Store API keys encrypted in database
- Rotate API keys regularly
- Use environment variables for master keys
- Never log API keys

### Data Privacy

- Encrypt sensitive data at rest
- Use HTTPS for all API communications
- Validate data before storing
- Implement data retention policies

### Access Control

- Only Super Admins can configure integrations
- University Admins can view their own sync status
- Audit all configuration changes
- Implement 2FA for sensitive operations

---

## Troubleshooting

### Common Issues

**Issue**: Sync stuck in "running" status
**Solution**: Add timeout to sync tasks, auto-mark as failed if timeout exceeded

**Issue**: University API returning 429 (rate limit)
**Solution**: Implement exponential backoff, increase sync interval

**Issue**: Data corruption after sync
**Solution**: Use database transactions, implement rollback logic

**Issue**: Sync logs not appearing
**Solution**: Check Celery worker logs, ensure Redis is running

### Debug Commands

```bash
# Check Celery worker status
celery -A chuo inspect active

# Check pending tasks
celery -A chuo inspect reserved

# View sync logs
python manage.py shell
>>> from integrations.models import SyncLog
>>> SyncLog.objects.filter(status='failed').count()

# Trigger manual sync
python manage.py shell
>>> from integrations.tasks.celery_tasks import sync_university_students
>>> sync_university_students.delay(university_id)
```

---

## Conclusion

Scaling CHUO's integration system to 20+ universities requires:

1. **Adapter Pattern** for heterogeneous APIs
2. **Queue-Based Processing** (Celery) for async operations
3. **Staggered Scheduling** to avoid API overload
4. **Robust Error Handling** with intelligent retries
5. **Rate Limiting** to respect university API policies
6. **Comprehensive Monitoring** for real-time visibility
7. **Flexible Configuration** per university

With this architecture, CHUO can seamlessly integrate with universities across Tanzania, regardless of their existing systems or API structures, while maintaining data integrity, performance, and reliability.

---

## Next Steps

1. Implement adapter pattern with university-specific adapters
2. Set up Celery for async processing
3. Add enhanced error handling and retry logic
4. Implement rate limiting
5. Create monitoring dashboard
6. Test with 2-3 universities before scaling to 20+
7. Deploy and monitor in production
8. Iterate based on performance metrics

For questions or support, contact the CHUO development team.
