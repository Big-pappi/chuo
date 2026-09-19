from rest_framework import serializers
from core.models import Department


class DepartmentSerializer(serializers.ModelSerializer):
    """Serializer for Department model."""
    
    university_name = serializers.CharField(source='university.name', read_only=True)
    faculty_name = serializers.CharField(source='faculty.name', read_only=True)
    head_name = serializers.CharField(source='head.get_full_name', read_only=True)
    
    class Meta:
        model = Department
        fields = [
            'id',
            'university',
            'university_name',
            'faculty',
            'faculty_name',
            'name',
            'code',
            'head',
            'head_name',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
