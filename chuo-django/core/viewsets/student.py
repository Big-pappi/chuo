from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from core.models import Student
from core.serializers import StudentSerializer
from core.permissions import HasPermission


class StudentViewSet(viewsets.ModelViewSet):
    """ViewSet for Student model."""
    
    queryset = Student.objects.select_related('university', 'department', 'user').all()
    serializer_class = StudentSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['university', 'department', 'year', 'semester', 'status']
    search_fields = ['student_number', 'user__first_name', 'user__last_name']
    ordering_fields = ['student_number', 'created_at']
    ordering = ['student_number']
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['create']:
            return [HasPermission('user:create')]
        elif self.action in ['update', 'partial_update']:
            return [HasPermission('user:update')]
        elif self.action == 'destroy':
            return [HasPermission('user:delete')]
        return [HasPermission('user:read')]
    
    @action(detail=True, methods=['get'])
    def grades(self, request, pk=None):
        """Get student grades."""
        student = self.get_object()
        from core.models import Result
        
        results = Result.objects.filter(
            student=student,
            published=True
        ).select_related('exam__course')
        
        data = []
        for result in results:
            data.append({
                'exam': result.exam.title,
                'course': result.exam.course.name,
                'score': result.score,
                'grade': result.grade,
                'max_score': result.exam.max_score,
            })
        
        return Response(data)
    
    @action(detail=True, methods=['get'])
    def attendance(self, request, pk=None):
        """Get student attendance."""
        student = self.get_object()
        from core.models import Attendance
        
        attendance = Attendance.objects.filter(student=student).select_related('course')
        
        data = []
        for record in attendance:
            data.append({
                'course': record.course.name,
                'date': record.date,
                'status': record.status,
            })
        
        return Response(data)
    
    @action(detail=True, methods=['get'])
    def fees(self, request, pk=None):
        """Get student fee status."""
        student = self.get_object()
        from core.models import Payment
        
        payments = Payment.objects.filter(student=student).select_related('fee')
        
        data = []
        for payment in payments:
            data.append({
                'fee': payment.fee.name,
                'amount': payment.amount,
                'status': payment.status,
                'paid_at': payment.paid_at,
            })
        
        return Response(data)
