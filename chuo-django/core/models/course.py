from django.db import models


class Course(models.Model):
    """Course model for managing university courses."""
    
    university = models.ForeignKey(
        'University',
        on_delete=models.CASCADE,
        related_name='courses'
    )
    department = models.ForeignKey(
        'Department',
        on_delete=models.CASCADE,
        related_name='courses'
    )
    lecturer = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='courses'
    )
    code = models.CharField(max_length=20)
    name = models.CharField(max_length=255)
    credits = models.IntegerField()
    level = models.CharField(
        max_length=10,
        choices=[
            ('100', '100'),
            ('200', '200'),
            ('300', '300'),
            ('400', '400'),
        ]
    )
    semester = models.CharField(
        max_length=10,
        choices=[
            ('1', 'Semester 1'),
            ('2', 'Semester 2'),
        ]
    )
    description = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('inactive', 'Inactive'),
        ],
        default='active'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'courses'
        unique_together = ['university', 'code']
        ordering = ['code']
        indexes = [
            models.Index(fields=['university']),
            models.Index(fields=['department']),
            models.Index(fields=['lecturer']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.code} - {self.name}"
