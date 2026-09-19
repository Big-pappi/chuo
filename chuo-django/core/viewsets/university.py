from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from core.models import University
from core.serializers import UniversitySerializer
from core.permissions import HasPermission


class UniversityViewSet(viewsets.ModelViewSet):
    """ViewSet for University model."""
    
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['create', 'destroy']:
            return [HasPermission('university:create')]
        elif self.action in ['update', 'partial_update']:
            return [HasPermission('university:update')]
        return [HasPermission('university:read')]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active universities."""
        active_universities = self.queryset.filter(status='active')
        serializer = self.get_serializer(active_universities, many=True)
        return Response(serializer.data)
