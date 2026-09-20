# CHUO Django Backend

University Management System Backend with Role-Based Access Control (RBAC).

## Features

- **Role-Based Access Control**: 11 user roles with granular permissions
- **JWT Authentication**: Secure token-based authentication with SimpleJWT
- **University Management**: Support for multiple universities
- **Academic Management**: Courses, enrollments, assignments, exams
- **Financial Management**: Fee structures and payments
- **Library Management**: Book catalog and borrowing system
- **Attendance Tracking**: Student attendance management
- **API Integration**: Sync with university APIs for existing systems
- **Django Admin**: Built-in admin panel for management
- **API Documentation**: OpenAPI/Swagger documentation with drf-spectacular

## Tech Stack

- **Framework**: Django 4.2
- **API Framework**: Django REST Framework
- **Authentication**: djangorestframework-simplejwt
- **Database**: PostgreSQL
- **Cache**: Redis
- **Task Queue**: Celery
- **Documentation**: drf-spectacular (OpenAPI)

## Project Structure

```
chuo-django/
├── chuo/                    # Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── core/                    # Core app (main CHUO functionality)
│   ├── models/              # Database models
│   ├── serializers/         # DRF serializers
│   ├── viewsets/            # API viewsets
│   ├── urls/                # URL routing
│   ├── permissions/          # RBAC permissions
│   └── admin.py             # Django admin configuration
├── integrations/            # Integration app (university API sync)
│   ├── models/              # Integration models
│   ├── services/            # Sync services
│   └── admin.py             # Django admin configuration
├── manage.py
├── requirements.txt
└── README.md
```

## Prerequisites

- Python 3.9+ (3.11 or 3.12 recommended for best compatibility)
- PostgreSQL 15+
- Redis 7+

**Note for Windows Users**: The project uses `psycopg[binary]` which is a modern PostgreSQL adapter that works well on Windows without requiring compilation.

**Python Version Note**: Django 5.0 supports Python 3.9-3.12. For Python 3.14+, ensure you're using Django 5.0 or later.

## Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

The server will start on `http://localhost:8000`

## Environment Variables

See `.env.example` for all available variables:

- `SECRET_KEY`: Django secret key
- `DEBUG`: Debug mode (True/False)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: PostgreSQL configuration
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_DB`: Redis configuration
- `JWT_ACCESS_TOKEN_LIFETIME`: Access token expiration in seconds (default: 15)
- `JWT_REFRESH_TOKEN_LIFETIME`: Refresh token expiration in seconds (default: 604800)
- `CORS_ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## API Documentation

Once the server is running, access the API documentation at:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`
- OpenAPI Schema: `http://localhost:8000/api/schema/`

## User Roles

The system supports the following roles:

1. **Super Admin** - Full system control
2. **University Admin** - University-level control
3. **Dean** - Faculty-level control
4. **Head of Department** - Department-level control
5. **Lecturer** - Course and student management
6. **Course Coordinator** - Course-specific management
7. **Registrar** - Academic records and registration
8. **Finance Officer** - Financial management
9. **Librarian** - Library management
10. **IT Administrator** - System administration
11. **Student** - Personal academic information

See `BACKEND_ARCHITECTURE.md` for detailed role descriptions and permissions.

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password

### University Management

- `GET /api/universities` - List universities
- `POST /api/universities` - Create university
- `GET /api/universities/:id` - Get university details
- `PUT /api/universities/:id` - Update university
- `DELETE /api/universities/:id` - Delete university
- `GET /api/universities/active` - Get active universities

### User Management

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/assign_role` - Assign role
- `GET /api/users/:id/permissions` - Get user permissions

### Course Management

- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `GET /api/courses/:id` - Get course details
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Student Management

- `GET /api/students` - List students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student details
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/:id/grades` - Get student grades
- `GET /api/students/:id/attendance` - Get student attendance
- `GET /api/students/:id/fees` - Get student fee status

## Django Admin

Access the Django admin panel at:
```
http://localhost:8000/admin/
```

Login with your superuser credentials to manage:
- Universities
- Users and Permissions
- Departments
- Courses
- Students
- Enrollments
- Assignments
- Exams
- Attendance
- Fees and Payments
- Books and Borrow Records
- University Integrations
- Sync Logs

## University Integration

For universities with existing systems, the integrations app provides:

### Sync Services

- **Student Sync**: Sync student data from university API
- **Course Sync**: Sync course data from university API
- **Enrollment Sync**: Sync enrollment data from university API
- **Full Sync**: Perform complete synchronization

### Integration Configuration

1. Create a UniversityIntegration record for each university
2. Configure API endpoint, API key, and sync frequency
3. Monitor sync logs for synchronization status
4. Sync can be triggered manually or scheduled via Celery

## Testing

Run tests:
```bash
python manage.py test
```

## Docker Deployment

Using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Django backend

## Security

- Passwords are hashed using Django's default PBKDF2
- JWT tokens for authentication
- CORS enabled for frontend integration
- CSRF protection enabled
- SQL injection prevention via Django ORM
- Rate limiting recommended for production

## License

MIT

## Support

For questions or support, contact the CHUO development team.
