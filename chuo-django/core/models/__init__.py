from .user import User, Permission
from .university import University
from .department import Department
from .course import Course
from .student import Student
from .enrollment import Enrollment
from .assignment import Assignment, Submission
from .exam import Exam, Result
from .attendance import Attendance
from .fee import Fee, Payment
from .library import Book, BorrowRecord

__all__ = [
    'User',
    'Permission',
    'University',
    'Department',
    'Course',
    'Student',
    'Enrollment',
    'Assignment',
    'Submission',
    'Exam',
    'Result',
    'Attendance',
    'Fee',
    'Payment',
    'Book',
    'BorrowRecord',
]
