from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.viewsets import UniversityViewSet, UserViewSet, CourseViewSet, StudentViewSet

router = DefaultRouter()
router.register(r'universities', UniversityViewSet, basename='university')
router.register(r'users', UserViewSet, basename='user')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'students', StudentViewSet, basename='student')

urlpatterns = [
    path('', include(router.urls)),
]
