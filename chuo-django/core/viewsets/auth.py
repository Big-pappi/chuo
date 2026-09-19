from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from core.serializers import UserSerializer, UserCreateSerializer
from core.models import User


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Login endpoint."""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=email, password=password)
    
    if not user:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if user.status != 'active':
        return Response(
            {'error': 'Account is suspended or inactive'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': UserSerializer(user).data,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register new user endpoint."""
    serializer = UserCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """Get user profile endpoint."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change password endpoint."""
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    
    if not current_password or not new_password:
        return Response(
            {'error': 'Current password and new password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not request.user.check_password(current_password):
        return Response(
            {'error': 'Current password is incorrect'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    request.user.set_password(new_password)
    request.user.save()
    
    return Response({'message': 'Password changed successfully'})


class AuthViewSet:
    """Auth viewset container."""
    login = login
    register = register
    profile = profile
    change_password = change_password
