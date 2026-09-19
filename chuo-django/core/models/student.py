from django.db import models


class Student(models.Model):
    """Student model linking User to department."""
    
    university = models.ForeignKey(
        'University',
        on_delete=models.CASCADE,
        related_name='students'
    )
    department = models.ForeignKey(
        'Department',
        on_delete=models.CASCADE,
        related_name='students'
    )
    user = models.OneToOneField(
        'User',
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    student_number = models.CharField(max_length=20, unique=True)
    year = models.IntegerField()
    semester = models.CharField(
        max_length=10,
        choices=[
            ('1', 'Semester 1'),
            ('2', 'Semester 2'),
        ]
    )
    gpa = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('suspended', 'Suspended'),
            ('graduated', 'Graduated'),
        ],
        default='active'
    )
    admission_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'students'
        ordering = ['student_number']
        indexes = [
            models.Index(fields=['university']),
            models.Index(fields=['department']),
            models.Index(fields=['student_number']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.student_number} - {self.user.get_full_name()}"
