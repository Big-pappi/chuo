from django.db import models


class Fee(models.Model):
    """Fee structure model."""
    
    university = models.ForeignKey(
        'University',
        on_delete=models.CASCADE,
        related_name='fees'
    )
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(
        max_length=20,
        choices=[
            ('tuition', 'Tuition'),
            ('library', 'Library'),
            ('lab', 'Lab'),
            ('exam', 'Exam'),
        ]
    )
    semester = models.CharField(max_length=10, blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
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
        db_table = 'fees'
        ordering = ['name']
        indexes = [
            models.Index(fields=['university']),
            models.Index(fields=['type']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.name} - {self.amount}"


class Payment(models.Model):
    """Payment record model."""
    
    student = models.ForeignKey(
        'Student',
        on_delete=models.CASCADE,
        related_name='payments'
    )
    fee = models.ForeignKey(
        Fee,
        on_delete=models.CASCADE,
        related_name='payments'
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(
        max_length=20,
        choices=[
            ('cash', 'Cash'),
            ('card', 'Card'),
            ('mobile', 'Mobile'),
            ('bank', 'Bank'),
        ]
    )
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('completed', 'Completed'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['student']),
            models.Index(fields=['fee']),
            models.Index(fields=['status']),
            models.Index(fields=['paid_at']),
        ]

    def __str__(self):
        return f"{self.student.student_number} - {self.amount}"
