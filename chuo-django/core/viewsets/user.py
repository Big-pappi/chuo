from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from core.models import User
from core.serializers import UserSerializer, UserCreateSerializer
from core.permissions import HasPermission


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model."""
    
    queryset = User.objects.select_related('university').all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'status', 'university']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Use different serializer for create action."""
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['create']:
            return [HasPermission('user:create')]
        elif self.action in ['update', 'partial_update']:
            return [HasPermission('user:update')]
        elif self.action == 'destroy':
            return [HasPermission('user:delete')]
        return [HasPermission('user:read')]
    
    @action(detail=True, methods=['post'])
    def assign_role(self, request, pk=None):
        """Assign or update user role."""
        user = self.get_object()
        new_role = request.data.get('role')
        
        if not new_role:
            return Response(
                {'error': 'Role is required'},
                status=400
            )
        
        if not HasPermission('user:assign_role').has_permission(request, None):
            return Response(
                {'error': 'Insufficient permissions'},
                status=403
            )
        
        user.role = new_role
        user.save()
        
        serializer = self.get_serializer(user)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def permissions(self, request, pk=None):
        """Get user permissions."""
        user = self.get_object()
        from core.permissions import ROLE_PERMISSIONS
        
        role_permissions = ROLE_PERMISSIONS.get(user.role, [])
        custom_permissions = list(user.custom_permissions.values_list('permission', flat=True))
        
        return Response({
            'role': user.role,
            'role_permissions': role_permissions,
            'custom_permissions': custom_permissions,
        })
