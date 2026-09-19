from django.db import models


class Exam(models.Model):
    """Exam model for course examinations."""
    
    course = models.ForeignKey(
        'Course',
        on_delete=models.CASCADE,
        related_name='exams'
    )
    lecturer = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='exams'
    )
    title = models.CharField(max_length=255)
    type = models.CharField(
        max_length=20,
        choices=[
            ('midterm', 'Midterm'),
            ('final', 'Final'),
            ('quiz', 'Quiz'),
        ]
    )
    date = models.DateTimeField()
    duration = models.IntegerField(help_text="Duration in minutes")
    location = models.CharField(max_length=255, blank=True, null=True)
    max_score = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'exams'
        ordering = ['date']
        indexes = [
            models.Index(fields=['course']),
            models.Index(fields=['lecturer']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.title} - {self.course.code}"


class Result(models.Model):
    """Exam result model."""
    
    student = models.ForeignKey(
        'Student',
        on_delete=models.CASCADE,
        related_name='results'
    )
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name='results'
    )
    score = models.DecimalField(max_digits=5, decimal_places=2)
    grade = models.CharField(max_length=5, blank=True, null=True)
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'results'
        unique_together = ['student', 'exam']
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['exam']),
            models.Index(fields=['published']),
        ]

    def __str__(self):
        return f"{self.student.student_number} - {self.exam.title}"
