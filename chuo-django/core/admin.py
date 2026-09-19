from django.contrib import admin
from core.models import (
    User, Permission, University, Department, Course, Student,
    Enrollment, Assignment, Submission, Exam, Result,
    Attendance, Fee, Payment, Book, BorrowRecord
)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'status', 'university']
    list_filter = ['role', 'status', 'university']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']


@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ['user', 'permission', 'granted_by', 'created_at']
    list_filter = ['permission']
    search_fields = ['user__email', 'permission']


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'type', 'status', 'city', 'country']
    list_filter = ['type', 'status', 'country']
    search_fields = ['name', 'code', 'email']


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'university', 'head']
    list_filter = ['university']
    search_fields = ['name', 'code']


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['code', 'name', 'department', 'level', 'semester', 'credits', 'status']
    list_filter = ['university', 'department', 'level', 'semester', 'status']
    search_fields = ['code', 'name']


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['student_number', 'user', 'department', 'year', 'semester', 'gpa', 'status']
    list_filter = ['university', 'department', 'year', 'semester', 'status']
    search_fields = ['student_number', 'user__first_name', 'user__last_name']


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student', 'course', 'academic_year', 'semester', 'status']
    list_filter = ['academic_year', 'semester', 'status']
    search_fields = ['student__student_number', 'course__code']


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'lecturer', 'due_date', 'max_score']
    list_filter = ['course', 'due_date']
    search_fields = ['title', 'course__name']


@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ['assignment', 'student', 'submitted_at', 'score', 'graded_at']
    list_filter = ['assignment', 'graded_at']
    search_fields = ['student__student_number', 'assignment__title']


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'type', 'date', 'duration', 'max_score']
    list_filter = ['course', 'type', 'date']
    search_fields = ['title', 'course__name']


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'exam', 'score', 'grade', 'published']
    list_filter = ['exam', 'published']
    search_fields = ['student__student_number', 'exam__title']


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ['course', 'student', 'date', 'status']
    list_filter = ['course', 'date', 'status']
    search_fields = ['student__student_number', 'course__code']


@admin.register(Fee)
class FeeAdmin(admin.ModelAdmin):
    list_display = ['name', 'university', 'type', 'amount', 'status']
    list_filter = ['university', 'type', 'status']
    search_fields = ['name']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['student', 'fee', 'amount', 'method', 'status', 'paid_at']
    list_filter = ['fee', 'method', 'status', 'paid_at']
    search_fields = ['student__student_number', 'transaction_id']


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'isbn', 'author', 'category', 'total_copies', 'available_copies']
    list_filter = ['university', 'category']
    search_fields = ['title', 'isbn', 'author']


@admin.register(BorrowRecord)
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ['user', 'book', 'borrow_date', 'due_date', 'return_date', 'status', 'fine']
    list_filter = ['status', 'due_date']
    search_fields = ['user__email', 'book__title']
