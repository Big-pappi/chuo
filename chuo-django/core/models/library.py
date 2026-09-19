from django.db import models


class Book(models.Model):
    """Library book model."""
    
    university = models.ForeignKey(
        'University',
        on_delete=models.CASCADE,
        related_name='books'
    )
    isbn = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    publisher = models.CharField(max_length=255, blank=True, null=True)
    year = models.IntegerField(blank=True, null=True)
    total_copies = models.IntegerField(default=1)
    available_copies = models.IntegerField(default=1)
    location = models.CharField(max_length=100, blank=True, null=True)
    cover_image = models.ImageField(upload_to='books/covers/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'books'
        ordering = ['title']
        indexes = [
            models.Index(fields=['university']),
            models.Index(fields=['isbn']),
            models.Index(fields=['category']),
            models.Index(fields=['available_copies']),
        ]

    def __str__(self):
        return f"{self.title} ({self.isbn})"


class BorrowRecord(models.Model):
    """Book borrowing record model."""
    
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='borrow_records'
    )
    user = models.ForeignKey(
        'User',
        on_delete=models.CASCADE,
        related_name='borrowed_books'
    )
    borrow_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    return_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('borrowed', 'Borrowed'),
            ('returned', 'Returned'),
            ('overdue', 'Overdue'),
        ],
        default='borrowed'
    )
    fine = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'borrow_records'
        ordering = ['-borrow_date']
        indexes = [
            models.Index(fields=['book']),
            models.Index(fields=['user']),
            models.Index(fields=['status']),
            models.Index(fields=['due_date']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.book.title}"
