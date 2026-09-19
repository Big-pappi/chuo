from rest_framework import serializers
from core.models import Student


class StudentSerializer(serializers.ModelSerializer):
    """Serializer for Student model."""
    
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    university_name = serializers.CharField(source='university.name', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Student
        fields = [
            'id',
            'university',
            'university_name',
            'department',
            'department_name',
            'user',
            'user_email',
            'user_name',
            'student_number',
            'year',
            'semester',
            'gpa',
            'status',
            'admission_date',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
