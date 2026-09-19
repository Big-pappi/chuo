from rest_framework import serializers
from core.models import Assignment, Submission


class AssignmentSerializer(serializers.ModelSerializer):
    """Serializer for Assignment model."""
    
    course_code = serializers.CharField(source='course.code', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    lecturer_name = serializers.CharField(source='lecturer.get_full_name', read_only=True)
    
    class Meta:
        model = Assignment
        fields = [
            'id',
            'course',
            'course_code',
            'course_name',
            'lecturer',
            'lecturer_name',
            'title',
            'description',
            'due_date',
            'max_score',
            'attachments',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubmissionSerializer(serializers.ModelSerializer):
    """Serializer for Submission model."""
    
    student_number = serializers.CharField(source='student.student_number', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    assignment_title = serializers.CharField(source='assignment.title', read_only=True)
    
    class Meta:
        model = Submission
        fields = [
            'id',
            'assignment',
            'assignment_title',
            'student',
            'student_number',
            'student_name',
            'submitted_at',
            'attachments',
            'score',
            'feedback',
            'graded_at',
            'graded_by',
        ]
        read_only_fields = ['id', 'submitted_at', 'graded_at']
