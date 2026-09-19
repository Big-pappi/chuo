import requests
from django.utils import timezone
from integrations.models import UniversityIntegration, SyncLog
from core.models import User, Student, Course, Enrollment
import logging

logger = logging.getLogger(__name__)


class UniversitySyncService:
    """Service for syncing data from university APIs."""
    
    def __init__(self, integration: UniversityIntegration):
        self.integration = integration
        self.headers = self._build_headers()
    
    def _build_headers(self):
        """Build headers for API requests."""
        headers = {
            'Content-Type': 'application/json',
        }
        
        if self.integration.api_key:
            headers['X-API-Key'] = self.integration.api_key
        
        if self.integration.api_secret:
            headers['X-API-Secret'] = self.integration.api_secret
        
        return headers
    
    def sync_students(self):
        """Sync students from university API."""
        log = SyncLog.objects.create(
            integration=self.integration,
            sync_type='students',
            status='running',
            started_at=timezone.now()
        )
        
        try:
            # Fetch students from university API
            response = requests.get(
                f"{self.integration.api_endpoint}/students",
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            
            students_data = response.json()
            records_processed = 0
            records_failed = 0
            
            for student_data in students_data:
                try:
                    # Create or update student
                    user, created = User.objects.update_or_create(
                        email=student_data['email'],
                        defaults={
                            'first_name': student_data['first_name'],
                            'last_name': student_data['last_name'],
                            'university': self.integration.university,
                            'role': 'STUDENT',
                        }
                    )
                    
                    if created:
                        user.set_password('default_password')  # Should be changed on first login
                        user.save()
                    
                    # Create or update student profile
                    Student.objects.update_or_create(
                        user=user,
                        defaults={
                            'university': self.integration.university,
                            'department_id': student_data.get('department_id'),
                            'student_number': student_data['student_number'],
                            'year': student_data.get('year', 1),
                            'semester': student_data.get('semester', '1'),
                            'admission_date': student_data.get('admission_date'),
                        }
                    )
                    
                    records_processed += 1
                except Exception as e:
                    logger.error(f"Failed to sync student {student_data.get('email')}: {e}")
                    records_failed += 1
            
            log.status = 'success'
            log.records_processed = records_processed
            log.records_failed = records_failed
            log.completed_at = timezone.now()
            log.save()
            
            self.integration.last_sync = timezone.now()
            self.integration.save()
            
            logger.info(f"Synced {records_processed} students for {self.integration.university.name}")
            
        except Exception as e:
            log.status = 'failed'
            log.error_message = str(e)
            log.completed_at = timezone.now()
            log.save()
            logger.error(f"Failed to sync students: {e}")
    
    def sync_courses(self):
        """Sync courses from university API."""
        log = SyncLog.objects.create(
            integration=self.integration,
            sync_type='courses',
            status='running',
            started_at=timezone.now()
        )
        
        try:
            response = requests.get(
                f"{self.integration.api_endpoint}/courses",
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            
            courses_data = response.json()
            records_processed = 0
            records_failed = 0
            
            for course_data in courses_data:
                try:
                    Course.objects.update_or_create(
                        university=self.integration.university,
                        code=course_data['code'],
                        defaults={
                            'department_id': course_data.get('department_id'),
                            'name': course_data['name'],
                            'credits': course_data.get('credits', 3),
                            'level': course_data.get('level', '100'),
                            'semester': course_data.get('semester', '1'),
                            'description': course_data.get('description'),
                        }
                    )
                    records_processed += 1
                except Exception as e:
                    logger.error(f"Failed to sync course {course_data.get('code')}: {e}")
                    records_failed += 1
            
            log.status = 'success'
            log.records_processed = records_processed
            log.records_failed = records_failed
            log.completed_at = timezone.now()
            log.save()
            
            self.integration.last_sync = timezone.now()
            self.integration.save()
            
            logger.info(f"Synced {records_processed} courses for {self.integration.university.name}")
            
        except Exception as e:
            log.status = 'failed'
            log.error_message = str(e)
            log.completed_at = timezone.now()
            log.save()
            logger.error(f"Failed to sync courses: {e}")
    
    def sync_enrollments(self):
        """Sync enrollments from university API."""
        log = SyncLog.objects.create(
            integration=self.integration,
            sync_type='enrollments',
            status='running',
            started_at=timezone.now()
        )
        
        try:
            response = requests.get(
                f"{self.integration.api_endpoint}/enrollments",
                headers=self.headers,
                timeout=30
            )
            response.raise_for_status()
            
            enrollments_data = response.json()
            records_processed = 0
            records_failed = 0
            
            for enrollment_data in enrollments_data:
                try:
                    student = Student.objects.filter(
                        student_number=enrollment_data['student_number']
                    ).first()
                    
                    course = Course.objects.filter(
                        code=enrollment_data['course_code'],
                        university=self.integration.university
                    ).first()
                    
                    if student and course:
                        Enrollment.objects.update_or_create(
                            student=student,
                            course=course,
                            academic_year=enrollment_data['academic_year'],
                            defaults={
                                'semester': enrollment_data.get('semester', '1'),
                                'status': enrollment_data.get('status', 'enrolled'),
                            }
                        )
                        records_processed += 1
                except Exception as e:
                    logger.error(f"Failed to sync enrollment: {e}")
                    records_failed += 1
            
            log.status = 'success'
            log.records_processed = records_processed
            log.records_failed = records_failed
            log.completed_at = timezone.now()
            log.save()
            
            self.integration.last_sync = timezone.now()
            self.integration.save()
            
            logger.info(f"Synced {records_processed} enrollments for {self.integration.university.name}")
            
        except Exception as e:
            log.status = 'failed'
            log.error_message = str(e)
            log.completed_at = timezone.now()
            log.save()
            logger.error(f"Failed to sync enrollments: {e}")
    
    def full_sync(self):
        """Perform full synchronization."""
        logger.info(f"Starting full sync for {self.integration.university.name}")
        
        self.sync_students()
        self.sync_courses()
        self.sync_enrollments()
        
        logger.info(f"Full sync completed for {self.integration.university.name}")
