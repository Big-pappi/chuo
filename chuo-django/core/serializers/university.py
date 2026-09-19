from rest_framework import serializers
from core.models import University


class UniversitySerializer(serializers.ModelSerializer):
    """Serializer for University model."""
    
    class Meta:
        model = University
        fields = [
            'id',
            'name',
            'code',
            'logo',
            'address',
            'city',
            'country',
            'email',
            'phone',
            'website',
            'type',
            'status',
            'api_endpoint',
            'api_key',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
