from django.db import models


class Department(models.Model):
    """Department model with faculty hierarchy."""
    
    university = models.ForeignKey(
        'University',
        on_delete=models.CASCADE,
        related_name='departments'
    )
    faculty = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='departments'
    )
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20)
    head = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='headed_departments'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'departments'
        unique_together = ['university', 'code']
        ordering = ['name']
        indexes = [
            models.Index(fields=['university']),
            models.Index(fields=['faculty']),
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"
