from rest_framework import permissions


# Role-based permission mappings
ROLE_PERMISSIONS = {
    'SUPER_ADMIN': ['*'],  # All permissions
    'UNIVERSITY_ADMIN': [
        'user:create',
        'user:read',
        'user:update',
        'user:assign_role',
        'course:create',
        'course:read',
        'course:update',
        'course:delete',
        'enrollment:create',
        'enrollment:read',
        'enrollment:update',
        'enrollment:delete',
        'university:read',
        'university:update',
        'department:create',
        'department:read',
        'department:update',
        'department:delete',
        'settings:read',
        'settings:update',
    ],
    'DEAN': [
        'user:create',
        'user:read',
        'user:update',
        'user:assign_role',
        'course:create',
        'course:read',
        'course:update',
        'course:delete',
        'enrollment:create',
        'enrollment:read',
        'enrollment:update',
        'enrollment:delete',
        'assignment:create',
        'assignment:read',
        'assignment:update',
        'assignment:delete',
        'assignment:grade',
        'exam:create',
        'exam:read',
        'exam:update',
        'exam:delete',
        'exam:grade',
        'result:read',
        'result:publish',
        'attendance:create',
        'attendance:read',
        'attendance:update',
        'attendance:delete',
        'department:create',
        'department:read',
        'department:update',
        'department:delete',
        'report:financial',
    ],
    'HOD': [
        'course:create',
        'course:read',
        'course:update',
        'course:delete',
        'enrollment:create',
        'enrollment:read',
        'enrollment:update',
        'enrollment:delete',
        'assignment:create',
        'assignment:read',
        'assignment:update',
        'assignment:delete',
        'assignment:grade',
        'exam:create',
        'exam:read',
        'exam:update',
        'exam:delete',
        'exam:grade',
        'result:read',
        'result:publish',
        'attendance:create',
        'attendance:read',
        'attendance:update',
        'attendance:delete',
    ],
    'LECTURER': [
        'course:read',
        'course:update',
        'assignment:create',
        'assignment:read',
        'assignment:update',
        'assignment:delete',
        'assignment:grade',
        'exam:create',
        'exam:read',
        'exam:update',
        'exam:delete',
        'exam:grade',
        'result:read',
        'result:publish',
        'attendance:create',
        'attendance:read',
        'attendance:update',
        'attendance:delete',
    ],
    'COURSE_COORDINATOR': [
        'course:read',
        'course:update',
        'assignment:create',
        'assignment:read',
        'assignment:update',
        'assignment:delete',
        'exam:create',
        'exam:read',
        'exam:update',
        'exam:delete',
    ],
    'REGISTRAR': [
        'user:create',
        'user:read',
        'user:update',
        'enrollment:create',
        'enrollment:read',
        'enrollment:update',
        'enrollment:delete',
        'result:read',
        'result:publish',
        'department:read',
    ],
    'FINANCE_OFFICER': [
        'fee:create',
        'fee:read',
        'fee:update',
        'fee:delete',
        'payment:create',
        'payment:read',
        'payment:update',
        'payment:delete',
        'report:financial',
    ],
    'LIBRARIAN': [
        'book:create',
        'book:read',
        'book:update',
        'book:delete',
        'borrow:create',
        'borrow:read',
        'borrow:update',
        'borrow:delete',
    ],
    'IT_ADMIN': [
        'user:create',
        'user:read',
        'user:update',
        'user:delete',
        'user:assign_role',
        'university:read',
        'department:read',
        'settings:read',
        'settings:update',
    ],
    'STUDENT': [
        'user:read',
        'course:read',
        'enrollment:read',
        'assignment:read',
        'exam:read',
        'result:read',
        'attendance:read',
        'fee:read',
        'payment:read',
        'book:read',
        'borrow:read',
        'settings:read',
    ],
}


def check_permission(user, permission: str) -> bool:
    """Check if user has a specific permission."""
    # Super Admin has all permissions
    if user.role == 'SUPER_ADMIN':
        return True
    
    # Check role-based permissions
    role_permissions = ROLE_PERMISSIONS.get(user.role, [])
    if '*' in role_permissions or permission in role_permissions:
        return True
    
    # Check custom permissions
    return user.custom_permissions.filter(permission=permission).exists()


class HasPermission(permissions.BasePermission):
    """Custom permission class for RBAC."""
    
    def __init__(self, permission: str = None):
        self.permission = permission
        super().__init__()
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if self.permission:
            return check_permission(request.user, self.permission)
        
        return True
    
    def has_object_permission(self, request, view, obj):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if self.permission:
            return check_permission(request.user, self.permission)
        
        return True
