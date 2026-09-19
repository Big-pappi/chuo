# CHUO Backend Architecture

## Overview

CHUO provides a comprehensive university management system with role-based access control (RBAC) designed for universities with or without existing systems. This backend supports both:
- **Direct Integration**: Universities without existing systems use CHUO as their complete management solution
- **API Integration**: Universities with existing systems integrate via REST APIs

## Table of Contents

1. [User Roles](#user-roles)
2. [Permission System](#permission-system)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [University Onboarding](#university-onboarding)
8. [Implementation Guide](#implementation-guide)

---

## User Roles

### Hierarchy

```
Super Admin (CHUO Platform)
    └── University Admin
            ├── Dean
            │       ├── Head of Department
            │       │       ├── Lecturer
            │       │       │       └── Student
            │       │       └── Course Coordinator
            │       └── Registrar
            ├── Finance Officer
            ├── Librarian
            └── IT Administrator
```

### Role Definitions

#### 1. Super Admin (CHUO Platform)
- **Access**: Full system control across all universities
- **Responsibilities**:
  - Manage university accounts
  - Platform-wide configuration
  - System monitoring and maintenance
  - Superuser access to all data

#### 2. University Admin
- **Access**: Full control within their university
- **Responsibilities**:
  - Manage all users within the university
  - Configure university settings
  - Manage departments and courses
  - Assign roles to users
  - View all university data

#### 3. Dean
- **Access**: Faculty-level control
- **Responsibilities**:
  - Manage departments within faculty
  - Approve course schedules
  - Review academic performance
  - Manage lecturers and HODs
  - Faculty-level reports

#### 4. Head of Department (HOD)
- **Access**: Department-level control
- **Responsibilities**:
  - Manage courses in department
  - Assign lecturers to courses
  - Review student enrollment
  - Department-level scheduling
  - Manage department resources

#### 5. Lecturer
- **Access**: Course and student management
- **Responsibilities**:
  - Manage assigned courses
  - Upload course materials
  - Create and grade assignments
  - Take attendance
  - Manage exam results
  - Communicate with students

#### 6. Course Coordinator
- **Access**: Course-specific management
- **Responsibilities**:
  - Coordinate course delivery
  - Manage course materials
  - Assist with assessments
  - Student support for course

#### 7. Registrar
- **Access**: Academic records and registration
- **Responsibilities**:
  - Manage student registration
  - Maintain academic records
  - Process transfers and withdrawals
  - Generate transcripts
  - Manage academic calendar

#### 8. Finance Officer
- **Access**: Financial management
- **Responsibilities**:
  - Manage fee structures
  - Process payments
  - Generate financial reports
  - Manage scholarships
  - Track fee payments

#### 9. Librarian
- **Access**: Library management
- **Responsibilities**:
  - Manage library catalog
  - Track book borrowing
  - Manage digital resources
  - Generate library reports

#### 10. IT Administrator
- **Access**: System administration
- **Responsibilities**:
  - Manage university IT infrastructure
  - User account management
  - System troubleshooting
  - Data backups

#### 11. Student
- **Access**: Personal academic information
- **Responsibilities**:
  - View personal information
  - Register for courses
  - View grades and results
  - Access learning materials
  - Pay fees
  - Borrow library books

---

## Permission System

### Permission Categories

#### 1. User Management
- `user:create` - Create new users
- `user:read` - View user information
- `user:update` - Update user information
- `user:delete` - Delete users
- `user:assign_role` - Assign roles to users

#### 2. Academic Management
- `course:create` - Create courses
- `course:read` - View courses
- `course:update` - Update courses
- `course:delete` - Delete courses
- `enrollment:create` - Enroll students
- `enrollment:read` - View enrollments
- `enrollment:update` - Update enrollments
- `enrollment:delete` - Remove enrollments

#### 3. Assessment Management
- `assignment:create` - Create assignments
- `assignment:read` - View assignments
- `assignment:update` - Update assignments
- `assignment:delete` - Delete assignments
- `assignment:grade` - Grade assignments
- `exam:create` - Create exams
- `exam:read` - View exams
- `exam:update` - Update exams
- `exam:delete` - Delete exams
- `exam:grade` - Grade exams
- `result:read` - View results
- `result:publish` - Publish results

#### 4. Attendance Management
- `attendance:create` - Take attendance
- `attendance:read` - View attendance
- `attendance:update` - Update attendance
- `attendance:delete` - Delete attendance records

#### 5. Financial Management
- `fee:create` - Create fee structures
- `fee:read` - View fees
- `fee:update` - Update fees
- `fee:delete` - Delete fees
- `payment:create` - Process payments
- `payment:read` - View payments
- `payment:update` - Update payments
- `payment:delete` - Delete payments
- `report:financial` - Generate financial reports

#### 6. Library Management
- `book:create` - Add books to catalog
- `book:read` - View catalog
- `book:update` - Update book information
- `book:delete` - Remove books
- `borrow:create` - Process book borrowing
- `borrow:read` - View borrowing records
- `borrow:update` - Update borrowing
- `borrow:delete` - Process returns

#### 7. System Administration
- `university:create` - Create university accounts
- `university:read` - View university information
- `university:update` - Update university settings
- `university:delete` - Delete universities
- `department:create` - Create departments
- `department:read` - View departments
- `department:update` - Update departments
- `department:delete` - Delete departments
- `settings:read` - View system settings
- `settings:update` - Update system settings

### Role-Permission Matrix

| Permission | Super Admin | Uni Admin | Dean | HOD | Lecturer | Student | Registrar | Finance | Librarian | IT Admin |
|------------|-------------|-----------|------|-----|----------|---------|-----------|---------|-----------|-----------|
| user:create | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ |
| user:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| user:update | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ |
| user:delete | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| user:assign_role | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |
| course:create | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| course:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| course:update | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| course:delete | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| enrollment:create | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| enrollment:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| enrollment:update | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| enrollment:delete | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ |
| assignment:create | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| assignment:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| assignment:update | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| assignment:delete | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| assignment:grade | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| exam:create | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| exam:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| exam:update | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| exam:delete | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| exam:grade | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| result:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| result:publish | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ |
| attendance:create | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| attendance:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| attendance:update | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| attendance:delete | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| fee:create | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| fee:read | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |
| fee:update | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| fee:delete | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| payment:create | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| payment:read | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ |
| payment:update | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| payment:delete | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| report:financial | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ |
| book:create | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| book:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| book:update | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| book:delete | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| borrow:create | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| borrow:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| borrow:update | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| borrow:delete | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ |
| university:create | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| university:read | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| university:update | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| university:delete | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| department:create | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| department:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| department:update | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| department:delete | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| settings:read | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| settings:update | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## Architecture

### Technology Stack

- **Framework**: Django 4.2
- **API Framework**: Django REST Framework
- **Authentication**: djangorestframework-simplejwt
- **Database**: PostgreSQL
- **Cache**: Redis
- **Task Queue**: Celery
- **API Documentation**: drf-spectacular (OpenAPI)
- **Testing**: Django Test Framework
- **Deployment**: Docker + Gunicorn

### Project Structure

```
chuo-django/
├── chuo/                    # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── core/                    # Core app (main CHUO functionality)
│   ├── models/              # Database models
│   │   ├── user.py
│   │   ├── university.py
│   │   ├── department.py
│   │   ├── course.py
│   │   ├── student.py
│   │   ├── enrollment.py
│   │   ├── assignment.py
│   │   ├── exam.py
│   │   ├── attendance.py
│   │   ├── fee.py
│   │   └── library.py
│   ├── serializers/         # DRF serializers
│   ├── viewsets/            # API viewsets
│   ├── urls/                # URL routing
│   ├── permissions/          # RBAC permissions
│   └── admin.py             # Django admin configuration
├── integrations/            # Integration app (university API sync)
│   ├── models/              # Integration models
│   │   └── integration.py
│   ├── services/            # Sync services
│   │   └── sync.py
│   └── admin.py             # Django admin configuration
├── manage.py
├── requirements.txt
└── README.md
```

---

## Database Schema

### Core Models

#### 1. Universities
```python
class University(models.Model):
    id = UUIDField (primary key)
    name = CharField
    code = CharField (unique)
    logo = ImageField
    address = TextField
    city = CharField
    country = CharField
    email = EmailField
    phone = CharField
    website = URLField
    type = CharField (public/private)
    status = CharField (active/suspended/inactive)
    api_endpoint = URLField (for universities with existing systems)
    api_key = CharField (unique)
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 2. Users
```python
class User(AbstractUser):
    university = ForeignKey (University)
    email = EmailField (unique)
    password = CharField (hashed)
    first_name = CharField
    last_name = CharField
    phone = CharField
    avatar = ImageField
    role = CharField (SUPER_ADMIN, UNIVERSITY_ADMIN, DEAN, HOD, LECTURER, COURSE_COORDINATOR, REGISTRAR, FINANCE_OFFICER, LIBRARIAN, IT_ADMIN, STUDENT)
    status = CharField (active/suspended/inactive)
    last_login = DateTimeField
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 3. Permissions
```python
class Permission(models.Model):
    user = ForeignKey (User)
    permission = CharField (e.g., 'user:create', 'course:read')
    granted_by = ForeignKey (User)
    created_at = DateTimeField
```

#### 4. Departments
```python
class Department(models.Model):
    university = ForeignKey (University)
    faculty = ForeignKey (Department, self-reference)
    name = CharField
    code = CharField
    head = ForeignKey (User)
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 5. Courses
```python
class Course(models.Model):
    university = ForeignKey (University)
    department = ForeignKey (Department)
    lecturer = ForeignKey (User)
    code = CharField
    name = CharField
    credits = IntegerField
    level = CharField (100/200/300/400)
    semester = CharField (1/2)
    description = TextField
    status = CharField (active/inactive)
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 6. Students
```python
class Student(models.Model):
    university = ForeignKey (University)
    department = ForeignKey (Department)
    user = OneToOneField (User)
    student_number = CharField (unique)
    year = IntegerField
    semester = CharField
    gpa = DecimalField
    status = CharField (active/suspended/graduated)
    admission_date = DateField
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 7. Enrollments
```python
class Enrollment(models.Model):
    student = ForeignKey (Student)
    course = ForeignKey (Course)
    semester = CharField
    academic_year = CharField
    status = CharField (enrolled/dropped/completed)
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 8. Assignments
```python
class Assignment(models.Model):
    course = ForeignKey (Course)
    lecturer = ForeignKey (User)
    title = CharField
    description = TextField
    due_date = DateTimeField
    max_score = DecimalField
    attachments = JSONField
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 9. Exams
```python
class Exam(models.Model):
    course = ForeignKey (Course)
    lecturer = ForeignKey (User)
    title = CharField
    type = CharField (midterm/final/quiz)
    date = DateTimeField
    duration = IntegerField (minutes)
    location = CharField
    max_score = DecimalField
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 10. Results
```python
class Result(models.Model):
    student = ForeignKey (Student)
    exam = ForeignKey (Exam)
    score = DecimalField
    grade = CharField
    published = BooleanField
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 11. Attendance
```python
class Attendance(models.Model):
    course = ForeignKey (Course)
    student = ForeignKey (Student)
    lecturer = ForeignKey (User)
    date = DateField
    status = CharField (present/absent/late)
    created_at = DateTimeField
```

#### 12. Fees
```python
class Fee(models.Model):
    university = ForeignKey (University)
    name = CharField
    amount = DecimalField
    type = CharField (tuition/library/lab/exam)
    semester = CharField
    year = IntegerField
    status = CharField (active/inactive)
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 13. Payments
```python
class Payment(models.Model):
    student = ForeignKey (Student)
    fee = ForeignKey (Fee)
    amount = DecimalField
    method = CharField (cash/card/mobile/bank)
    transaction_id = CharField
    status = CharField (pending/completed/failed)
    paid_at = DateTimeField
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 14. Books
```python
class Book(models.Model):
    university = ForeignKey (University)
    isbn = CharField (unique)
    title = CharField
    author = CharField
    category = CharField
    publisher = CharField
    year = IntegerField
    total_copies = IntegerField
    available_copies = IntegerField
    location = CharField
    cover_image = ImageField
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 15. Borrow Records
```python
class BorrowRecord(models.Model):
    book = ForeignKey (Book)
    user = ForeignKey (User)
    borrow_date = DateField
    due_date = DateField
    return_date = DateField
    status = CharField (borrowed/returned/overdue)
    fine = DecimalField
    created_at = DateTimeField
    updated_at = DateTimeField
```

### Integration Models

#### 16. University Integration
```python
class UniversityIntegration(models.Model):
    university = OneToOneField (University)
    api_type = CharField (REST/SOAP/GraphQL/Custom)
    api_endpoint = URLField
    api_key = CharField
    api_secret = CharField
    sync_frequency = IntegerField (seconds)
    last_sync = DateTimeField
    sync_enabled = BooleanField
    configuration = JSONField
    created_at = DateTimeField
    updated_at = DateTimeField
```

#### 17. Sync Log
```python
class SyncLog(models.Model):
    integration = ForeignKey (UniversityIntegration)
    sync_type = CharField (students/courses/enrollments/grades/full)
    status = CharField (pending/running/success/failed)
    records_processed = IntegerField
    records_failed = IntegerField
    error_message = TextField
    started_at = DateTimeField
    completed_at = DateTimeField
    created_at = DateTimeField
```

---

## API Endpoints

### Authentication

#### POST /api/auth/login
Login and receive JWT token

#### POST /api/auth/register
Register a new user (University Admin or Super Admin only)

#### POST /api/auth/refresh
Refresh JWT token

#### GET /api/auth/profile
Get current user profile

#### POST /api/auth/change-password
Change user password

### University Management

#### GET /api/universities
List all universities (Super Admin only)

#### POST /api/universities
Create a new university (Super Admin only)

#### GET /api/universities/:id
Get university details

#### PUT /api/universities/:id
Update university (University Admin only)

#### DELETE /api/universities/:id
Delete university (Super Admin only)

#### GET /api/universities/active
Get only active universities

### User Management

#### GET /api/users
List users (filtered by university)

#### POST /api/users
Create a new user (University Admin only)

#### GET /api/users/:id
Get user details

#### PUT /api/users/:id
Update user

#### DELETE /api/users/:id
Delete user

#### POST /api/users/:id/assign_role
Assign/update user role

#### GET /api/users/:id/permissions
Get user permissions

### Course Management

#### GET /api/courses
List courses (filtered by university/department)

#### POST /api/courses
Create a new course

#### GET /api/courses/:id
Get course details

#### PUT /api/courses/:id
Update course

#### DELETE /api/courses/:id
Delete course

### Student Management

#### GET /api/students
List students

#### POST /api/students
Create a new student record

#### GET /api/students/:id
Get student details

#### PUT /api/students/:id
Update student information

#### GET /api/students/:id/grades
Get student grades

#### GET /api/students/:id/attendance
Get student attendance

#### GET /api/students/:id/fees
Get student fee status

---

## Authentication & Authorization

### JWT Authentication Flow

1. **Login**: User sends credentials to `/api/auth/login`
2. **Token Generation**: Server validates credentials and generates JWT
3. **Token Storage**: Client stores token (localStorage/cookie)
4. **Request**: Client includes token in `Authorization: Bearer <token>` header
5. **Validation**: Django REST Framework validates token on protected routes
6. **Authorization**: RBAC permission classes check user permissions

### Permission System

```python
# Role-based permission mappings
ROLE_PERMISSIONS = {
    'SUPER_ADMIN': ['*'],  # All permissions
    'UNIVERSITY_ADMIN': [...],
    'DEAN': [...],
    # ... other roles
}

class HasPermission(permissions.BasePermission):
    def __init__(self, permission: str = None):
        self.permission = permission
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if self.permission:
            return check_permission(request.user, self.permission)
        
        return True
```

### Permission Checking

```python
def check_permission(user, permission: str) -> bool:
    # Super Admin has all permissions
    if user.role == 'SUPER_ADMIN':
        return True
    
    # Check role-based permissions
    role_permissions = ROLE_PERMISSIONS.get(user.role, [])
    if '*' in role_permissions or permission in role_permissions:
        return True
    
    # Check custom permissions
    return user.custom_permissions.filter(permission=permission).exists()
```

---

## University Onboarding

### Direct Integration (No Existing System)

1. **University Registration**
   - Super Admin creates university account via Django Admin
   - University Admin credentials generated
   - University settings configured

2. **Initial Setup**
   - Create departments via Django Admin
   - Create courses via Django Admin
   - Import students via bulk upload or Django Admin
   - Assign lecturers to courses
   - Configure fee structures
   - Add library books

3. **User Creation**
   - Create accounts for all staff via Django Admin
   - Assign appropriate roles
   - Students can self-register or be imported

### API Integration (Existing System)

1. **API Key Generation**
   - Generate unique API key for university
   - Configure API endpoint (if university hosts data)
   - Set up sync frequency

2. **Integration Configuration**
   - Create UniversityIntegration record
   - Map university's data structure to CHUO schema
   - Configure sync frequency

3. **Data Synchronization**
   - Student sync: Sync student data from university API
   - Course sync: Sync course data from university API
   - Enrollment sync: Sync enrollment data from university API
   - Full sync: Perform complete synchronization
   - Monitor sync logs for status

---

## Implementation Guide

### Phase 1: Core Infrastructure (Week 1-2)

1. **Project Setup**
   - Initialize Django project
   - Set up PostgreSQL database
   - Configure Redis for caching
   - Set up environment variables

2. **Authentication System**
   - Implement JWT authentication with SimpleJWT
   - Create login/register endpoints
   - Set up password reset flow
   - Create auth viewsets

3. **Database Models**
   - Define Django models
   - Run migrations
   - Seed initial data (Super Admin)

### Phase 2: RBAC System (Week 3)

1. **Role Definitions**
   - Define all roles in User model
   - Create role-permission mappings
   - Implement permission checking logic

2. **RBAC Permissions**
   - Create HasPermission permission class
   - Implement custom permission grants
   - Set up permission revocation

3. **User Management**
   - Create user CRUD viewsets
   - Implement role assignment
   - Add permission management

### Phase 3: Core Features (Week 4-6)

1. **University Management**
   - University CRUD viewsets
   - Department management
   - Configuration endpoints

2. **Academic Management**
   - Course management viewsets
   - Student enrollment
   - Lecturer assignment

3. **Assessment System**
   - Assignment creation/submission
   - Exam management
   - Grading system

### Phase 4: Extended Features (Week 7-8)

1. **Attendance System**
   - Attendance recording
   - Attendance reports

2. **Financial System**
   - Fee structure management
   - Payment processing
   - Financial reports

3. **Library System**
   - Book catalog
   - Borrowing system
   - Fine calculation

### Phase 5: Integration System (Week 9-10)

1. **Integration Models**
   - UniversityIntegration model
   - SyncLog model
   - Django admin configuration

2. **Sync Services**
   - Student sync service
   - Course sync service
   - Enrollment sync service
   - Full sync service

3. **Celery Tasks**
   - Scheduled sync tasks
   - Async sync processing

### Phase 6: Testing & Deployment (Week 11-12)

1. **API Documentation**
   - Set up drf-spectacular
   - Document all endpoints
   - Create examples

2. **Testing**
   - Unit tests
   - Integration tests
   - E2E tests

3. **Deployment**
   - Docker containerization
   - CI/CD pipeline
   - Production deployment

---

## Security Considerations

1. **Password Security**
   - Django's default PBKDF2 hashing
   - Password complexity requirements
   - Password expiration

2. **Token Security**
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)
   - Token rotation on refresh

3. **API Security**
   - CORS configuration
   - Request validation
   - SQL injection prevention (Django ORM)
   - XSS protection (Django templates)

4. **Data Security**
   - Encryption at rest (PostgreSQL)
   - HTTPS only in production
   - Regular backups
   - Audit logging via SyncLog

---

## Performance Optimization

1. **Caching Strategy**
   - Redis for frequently accessed data
   - Cache user permissions
   - Cache course catalogs

2. **Database Optimization**
   - Indexed fields
   - Query optimization with select_related/prefetch_related
   - Connection pooling

3. **API Optimization**
   - Pagination (PageNumberPagination)
   - Field selection
   - Filtering and searching

---

## Monitoring & Logging

1. **Application Monitoring**
   - Django logging configuration
   - Error tracking
   - Performance monitoring

2. **Logging**
   - Structured logging
   - Log levels (error, warn, info, debug)
   - Log rotation

3. **Analytics**
   - API usage metrics
   - User activity tracking
   - Performance metrics

---

## Next Steps

1. Install dependencies and set up environment
2. Run migrations to create database tables
3. Create superuser for Django Admin
4. Implement remaining viewsets (assignments, exams, etc.)
5. Set up Celery for scheduled sync tasks
6. Integrate with frontend
7. Deploy to production

---

## Contact & Support

For questions or support during implementation, contact the CHUO development team.
