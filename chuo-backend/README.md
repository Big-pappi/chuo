# CHUO Backend

University Management System Backend with Role-Based Access Control (RBAC).

## Features

- **Role-Based Access Control**: 11 user roles with granular permissions
- **JWT Authentication**: Secure token-based authentication
- **University Management**: Support for multiple universities
- **Academic Management**: Courses, enrollments, assignments, exams
- **Financial Management**: Fee structures and payments
- **Library Management**: Book catalog and borrowing system
- **Attendance Tracking**: Student attendance management
- **API Documentation**: Swagger/OpenAPI documentation

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache**: Redis
- **Authentication**: JWT + bcrypt
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chuo-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Environment Variables

See `.env.example` for all available variables:

- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_ACCESS_EXPIRATION`: Access token expiration (default: 15m)
- `JWT_REFRESH_EXPIRATION`: Refresh token expiration (default: 7d)

## API Documentation

Once the server is running, access the API documentation at:
```
http://localhost:3000/api-docs
```

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
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/profile` - Get user profile

### University Management

- `GET /api/universities` - List universities
- `POST /api/universities` - Create university
- `GET /api/universities/:id` - Get university details
- `PUT /api/universities/:id` - Update university
- `DELETE /api/universities/:id` - Delete university

### User Management

- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `POST /api/users/:id/role` - Assign role

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
- `GET /api/students/:id/grades` - Get student grades
- `GET /api/students/:id/attendance` - Get student attendance
- `GET /api/students/:id/fees` - Get student fee status

### Assessment Management

- `POST /api/assignments` - Create assignment
- `GET /api/assignments` - List assignments
- `POST /api/exams` - Create exam
- `GET /api/exams` - List exams
- `POST /api/exams/:id/results` - Submit exam results

### Attendance Management

- `POST /api/attendance` - Take attendance
- `GET /api/attendance` - Get attendance records

### Financial Management

- `GET /api/fees` - List fee structures
- `POST /api/fees` - Create fee structure
- `GET /api/payments` - List payments
- `POST /api/payments` - Process payment

### Library Management

- `GET /api/books` - List books
- `POST /api/books` - Add book
- `POST /api/books/:id/borrow` - Borrow book
- `POST /api/books/:id/return` - Return book

## Docker Deployment

Using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database
- Redis cache
- Backend API server

## Development

Run in development mode with hot reload:
```bash
npm run dev
```

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Lint code:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

## Database Management

Open Prisma Studio:
```bash
npm run prisma:studio
```

Create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

Reset database (development only):
```bash
npx prisma migrate reset
```

## Security

- Passwords are hashed using bcrypt (12 rounds)
- JWT tokens for authentication
- Rate limiting on all API endpoints
- Input validation using express-validator
- SQL injection prevention via Prisma ORM
- CORS enabled for frontend integration
- Helmet for security headers

## License

MIT

## Support

For questions or support, contact the CHUO development team.
