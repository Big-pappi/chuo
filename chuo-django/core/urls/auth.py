from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from core.viewsets.auth import AuthViewSet

router = AuthViewSet()

urlpatterns = [
    path('login/', router.login, name='login'),
    path('register/', router.register, name='register'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', router.profile, name='profile'),
    path('change-password/', router.change_password, name='change_password'),
]
