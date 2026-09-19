from rest_framework import serializers
from core.models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    
    full_name = serializers.SerializerMethodField()
    university_name = serializers.CharField(source='university.name', read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'phone',
            'avatar',
            'role',
            'status',
            'university',
            'university_name',
            'last_login',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'last_login', 'created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class UserCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating new users."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    
    class Meta:
        model = User
        fields = [
            'email',
            'password',
            'first_name',
            'last_name',
            'phone',
            'role',
            'university',
        ]
    
    def create(self, validated_data):
        from django.contrib.auth.hashers import make_password
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
