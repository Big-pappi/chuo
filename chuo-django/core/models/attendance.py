from django.db import models


class Attendance(models.Model):
    """Attendance tracking model."""
    
    course = models.ForeignKey(
        'Course',
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    student = models.ForeignKey(
        'Student',
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    lecturer = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    date = models.DateField()
    status = models.CharField(
        max_length=20,
        choices=[
            ('present', 'Present'),
            ('absent', 'Absent'),
            ('late', 'Late'),
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'attendance'
        unique_together = ['course', 'student', 'date']
        ordering = ['-date']
        indexes = [
            models.Index(fields=['course']),
            models.Index(fields=['student']),
            models.Index(fields=['date']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.student.student_number} - {self.date} ({self.status})"
