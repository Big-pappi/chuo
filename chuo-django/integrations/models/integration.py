from django.db import models
from core.models import University


class UniversityIntegration(models.Model):
    """Model for university API integration configuration."""
    
    university = models.OneToOneField(
        University,
        on_delete=models.CASCADE,
        related_name='integration'
    )
    api_type = models.CharField(
        max_length=50,
        choices=[
            ('rest', 'REST API'),
            ('soap', 'SOAP API'),
            ('graphql', 'GraphQL'),
            ('custom', 'Custom Integration'),
        ],
        default='rest'
    )
    api_endpoint = models.URLField()
    api_key = models.CharField(max_length=255, blank=True, null=True)
    api_secret = models.CharField(max_length=255, blank=True, null=True)
    sync_frequency = models.IntegerField(
        default=3600,
        help_text="Sync frequency in seconds"
    )
    last_sync = models.DateTimeField(null=True, blank=True)
    sync_enabled = models.BooleanField(default=True)
    configuration = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'university_integrations'
        verbose_name = 'University Integration'
        verbose_name_plural = 'University Integrations'

    def __str__(self):
        return f"{self.university.name} - {self.api_type}"


class SyncLog(models.Model):
    """Model for tracking synchronization logs."""
    
    integration = models.ForeignKey(
        UniversityIntegration,
        on_delete=models.CASCADE,
        related_name='sync_logs'
    )
    sync_type = models.CharField(
        max_length=50,
        choices=[
            ('students', 'Students'),
            ('courses', 'Courses'),
            ('enrollments', 'Enrollments'),
            ('grades', 'Grades'),
            ('full', 'Full Sync'),
        ]
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('running', 'Running'),
            ('success', 'Success'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    records_processed = models.IntegerField(default=0)
    records_failed = models.IntegerField(default=0)
    error_message = models.TextField(blank=True, null=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sync_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['integration']),
            models.Index(fields=['status']),
            models.Index(fields=['sync_type']),
        ]

    def __str__(self):
        return f"{self.integration.university.name} - {self.sync_type} ({self.status})"
