from rest_framework import serializers
from core.models import Fee, Payment


class FeeSerializer(serializers.ModelSerializer):
    """Serializer for Fee model."""
    
    university_name = serializers.CharField(source='university.name', read_only=True)
    
    class Meta:
        model = Fee
        fields = [
            'id',
            'university',
            'university_name',
            'name',
            'amount',
            'type',
            'semester',
            'year',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""
    
    student_number = serializers.CharField(source='student.student_number', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    fee_name = serializers.CharField(source='fee.name', read_only=True)
    
    class Meta:
        model = Payment
        fields = [
            'id',
            'student',
            'student_number',
            'student_name',
            'fee',
            'fee_name',
            'amount',
            'method',
            'transaction_id',
            'status',
            'paid_at',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
