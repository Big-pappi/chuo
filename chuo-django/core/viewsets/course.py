from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from core.models import Course
from core.serializers import CourseSerializer
from core.permissions import HasPermission


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for Course model."""
    
    queryset = Course.objects.select_related('university', 'department', 'lecturer').all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['university', 'department', 'lecturer', 'level', 'semester', 'status']
    search_fields = ['code', 'name']
    ordering_fields = ['code', 'name', 'created_at']
    ordering = ['code']
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['create']:
            return [HasPermission('course:create')]
        elif self.action in ['update', 'partial_update']:
            return [HasPermission('course:update')]
        elif self.action == 'destroy':
            return [HasPermission('course:delete')]
        return [HasPermission('course:read')]
