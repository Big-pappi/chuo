from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class Role(models.TextChoices):
    SUPER_ADMIN = 'SUPER_ADMIN', _('Super Admin')
    UNIVERSITY_ADMIN = 'UNIVERSITY_ADMIN', _('University Admin')
    DEAN = 'DEAN', _('Dean')
    HOD = 'HOD', _('Head of Department')
    LECTURER = 'LECTURER', _('Lecturer')
    COURSE_COORDINATOR = 'COURSE_COORDINATOR', _('Course Coordinator')
    REGISTRAR = 'REGISTRAR', _('Registrar')
    FINANCE_OFFICER = 'FINANCE_OFFICER', _('Finance Officer')
    LIBRARIAN = 'LIBRARIAN', _('Librarian')
    IT_ADMIN = 'IT_ADMIN', _('IT Administrator')
    STUDENT = 'STUDENT', _('Student')


class User(AbstractUser):
    """Custom User model with role-based access control."""
    
    university = models.ForeignKey(
        'University',
        on_delete=models.CASCADE,
        related_name='users',
        null=True,
        blank=True
    )
    role = models.CharField(
        max_length=50,
        choices=Role.choices,
        default=Role.STUDENT
    )
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('active', 'Active'),
            ('suspended', 'Suspended'),
            ('inactive', 'Inactive'),
        ],
        default='active'
    )
    last_login = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['status']),
            models.Index(fields=['university']),
        ]

    def __str__(self):
        return f"{self.email} ({self.role})"

    def has_permission(self, permission: str) -> bool:
        """Check if user has a specific permission."""
        from core.permissions import ROLE_PERMISSIONS
        
        # Super Admin has all permissions
        if self.role == Role.SUPER_ADMIN:
            return True
        
        # Check role-based permissions
        role_permissions = ROLE_PERMISSIONS.get(self.role, [])
        if '*' in role_permissions or permission in role_permissions:
            return True
        
        # Check custom permissions
        return self.custom_permissions.filter(permission=permission).exists()


class Permission(models.Model):
    """Custom permissions for users."""
    
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='custom_permissions'
    )
    permission = models.CharField(max_length=100)
    granted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='granted_permissions'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'permissions'
        unique_together = ['user', 'permission']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['permission']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.permission}"
