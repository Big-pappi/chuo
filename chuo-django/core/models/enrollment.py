from django.db import models


class Enrollment(models.Model):
    """Student enrollment in courses."""
    
    student = models.ForeignKey(
        'Student',
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    course = models.ForeignKey(
        'Course',
        on_delete=models.CASCADE,
        related_name='enrollments'
    )
    semester = models.CharField(max_length=10)
    academic_year = models.CharField(max_length=20)
    status = models.CharField(
        max_length=20,
        choices=[
            ('enrolled', 'Enrolled'),
            ('dropped', 'Dropped'),
            ('completed', 'Completed'),
        ],
        default='enrolled'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'enrollments'
        unique_together = ['student', 'course', 'academic_year']
        ordering = ['-academic_year', 'semester']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['course']),
            models.Index(fields=['academic_year']),
        ]

    def __str__(self):
        return f"{self.student.student_number} - {self.course.code}"
