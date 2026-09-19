from rest_framework import serializers
from core.models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Attendance model."""
    
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    student_number = serializers.CharField(source='student.student_number', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    lecturer_name = serializers.CharField(source='lecturer.get_full_name', read_only=True)
    
    class Meta:
        model = Attendance
        fields = [
            'id',
            'course',
            'course_code',
            'course_name',
            'student',
            'student_number',
            'student_name',
            'lecturer',
            'lecturer_name',
            'date',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
