from rest_framework import serializers
from core.models import Course


class CourseSerializer(serializers.ModelSerializer):
    """Serializer for Course model."""
    
    university_name = serializers.CharField(source='university.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    lecturer_name = serializers.CharField(source='lecturer.get_full_name', read_only=True)
    
    class Meta:
        model = Course
        fields = [
            'id',
            'university',
            'university_name',
            'department',
            'department_name',
            'lecturer',
            'lecturer_name',
            'code',
            'name',
            'credits',
            'level',
            'semester',
            'description',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
