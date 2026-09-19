from django.db import models


class University(models.Model):
    """University model for managing multiple universities."""
    
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=20, unique=True)
    logo = models.ImageField(upload_to='universities/logos/', blank=True, null=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    website = models.URLField(blank=True, null=True)
    type = models.CharField(
        max_length=20,
        choices=[
            ('public', 'Public'),
            ('private', 'Private'),
        ],
        default='public'
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('suspended', 'Suspended'),
            ('inactive', 'Inactive'),
        ],
        default='active'
    )
    api_endpoint = models.URLField(blank=True, null=True, help_text="For universities with existing systems")
    api_key = models.CharField(max_length=100, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'universities'
        ordering = ['name']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"
