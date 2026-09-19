from rest_framework import serializers
from core.models import Exam, Result


class ExamSerializer(serializers.ModelSerializer):
    """Serializer for Exam model."""
    
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    lecturer_name = serializers.CharField(source='lecturer.get_full_name', read_only=True)
    
    class Meta:
        model = Exam
        fields = [
            'id',
            'course',
            'course_code',
            'course_name',
            'lecturer',
            'lecturer_name',
            'title',
            'type',
            'date',
            'duration',
            'location',
            'max_score',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ResultSerializer(serializers.ModelSerializer):
    """Serializer for Result model."""
    
    student_number = serializers.CharField(source='student.student_number', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    
    class Meta:
        model = Result
        fields = [
            'id',
            'student',
            'student_number',
            'student_name',
            'exam',
            'exam_title',
            'score',
            'grade',
            'published',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
