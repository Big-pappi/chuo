from django.db import models


class Assignment(models.Model):
    """Assignment model for course assessments."""
    
    course = models.ForeignKey(
        'Course',
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    lecturer = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='assignments'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    due_date = models.DateTimeField()
    max_score = models.DecimalField(max_digits=5, decimal_places=2)
    attachments = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'assignments'
        ordering = ['-due_date']
        indexes = [
            models.Index(fields=['course']),
            models.Index(fields=['lecturer']),
            models.Index(fields=['due_date']),
        ]

    def __str__(self):
        return f"{self.title} - {self.course.code}"


class Submission(models.Model):
    """Assignment submission model."""
    
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    student = models.ForeignKey(
        'Student',
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    attachments = models.JSONField(default=list, blank=True)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(blank=True, null=True)
    graded_at = models.DateTimeField(null=True, blank=True)
    graded_by = models.ForeignKey(
        'User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='graded_submissions'
    )

    class Meta:
        db_table = 'submissions'
        unique_together = ['assignment', 'student']
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['assignment']),
            models.Index(fields=['student']),
        ]

    def __str__(self):
        return f"{self.student.student_number} - {self.assignment.title}"
