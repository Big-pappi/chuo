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

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: PostgreSQL (primary), Redis (caching)
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest + Supertest
- **Deployment**: Docker + AWS/DigitalOcean

### Project Structure

```
chuo-backend/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts
│   │   ├── redis.ts
│   │   └── jwt.ts
│   ├── controllers/     # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   ├── university.controller.ts
│   │   ├── course.controller.ts
│   │   ├── student.controller.ts
│   │   ├── fee.controller.ts
│   │   └── library.controller.ts
│   ├── middleware/      # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── rbac.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── models/          # Database models (Prisma)
│   │   └── schema.prisma
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   ├── university.routes.ts
│   │   ├── course.routes.ts
│   │   ├── student.routes.ts
│   │   ├── fee.routes.ts
│   │   └── library.routes.ts
│   ├── services/        # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── rbac.service.ts
│   │   └── university.service.ts
│   ├── types/           # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   ├── utils/           # Utility functions
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   └── app.ts           # Express app setup
├── tests/               # Test files
├── prisma/              # Prisma migrations
├── docker-compose.yml
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## Database Schema

### Core Tables

#### 1. Universities
```prisma
model University {
  id                String    @id @default(uuid())
  name              String
  code              String    @unique
  logo              String?
  address           String
  city              String
  country           String
  email             String
  phone             String
  website           String?
  type              String    // 'public' | 'private'
  status            String    @default('active') // 'active' | 'suspended' | 'inactive'
  apiEndpoint       String?   // For universities with existing systems
  apiKey            String?   @unique
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  users             User[]
  departments       Department[]
  courses           Course[]
  students          Student[]
  fees              Fee[]
  books             Book[]
}
```

#### 2. Users
```prisma
model User {
  id                String    @id @default(uuid())
  universityId      String
  university        University @relation(fields: [universityId], references: [id])
  email             String    @unique
  password          String
  firstName         String
  lastName          String
  phone             String?
  avatar            String?
  role              Role
  status            String    @default('active') // 'active' | 'suspended' | 'inactive'
  lastLogin         DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  permissions       Permission[]
  courses           Course[]
  attendance        Attendance[]
  assignments       Assignment[]
  borrowedBooks     BorrowRecord[]
}

enum Role {
  SUPER_ADMIN
  UNIVERSITY_ADMIN
  DEAN
  HOD
  LECTURER
  COURSE_COORDINATOR
  REGISTRAR
  FINANCE_OFFICER
  LIBRARIAN
  IT_ADMIN
  STUDENT
}
```

#### 3. Permissions
```prisma
model Permission {
  id                String    @id @default(uuid())
  userId            String
  user              User      @relation(fields: [userId], references: [id])
  permission        String    // e.g., 'user:create', 'course:read'
  grantedBy         String?   // User ID who granted this permission
  createdAt         DateTime  @default(now())

  @@unique([userId, permission])
}
```

#### 4. Departments
```prisma
model Department {
  id                String    @id @default(uuid())
  universityId      String
  university        University @relation(fields: [universityId], references: [id])
  facultyId         String?   // Parent faculty
  faculty           Department? @relation("FacultyDepartments", fields: [facultyId], references: [id])
  departments       Department[] @relation("FacultyDepartments")
  name              String
  code              String
  headId            String?   // HOD user ID
  head              User?     @relation("DepartmentHead", fields: [headId], references: [id])
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  courses           Course[]
  students          Student[]
}
```

#### 5. Courses
```prisma
model Course {
  id                String    @id @default(uuid())
  universityId      String
  university        University @relation(fields: [universityId], references: [id])
  departmentId      String
  department        Department @relation(fields: [departmentId], references: [id])
  lecturerId        String?
  lecturer          User?     @relation(fields: [lecturerId], references: [id])
  code              String
  name              String
  credits           Int
  level             String    // '100' | '200' | '300' | '400'
  semester          String    // '1' | '2'
  description       String?
  status            String    @default('active') // 'active' | 'inactive'
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  enrollments       Enrollment[]
  assignments       Assignment[]
  exams             Exam[]
  attendance        Attendance[]
}
```

#### 6. Students
```prisma
model Student {
  id                String    @id @default(uuid())
  universityId      String
  university        University @relation(fields: [universityId], references: [id])
  departmentId      String
  department        Department @relation(fields: [departmentId], references: [id])
  userId            String    @unique
  user              User      @relation(fields: [userId], references: [id])
  studentNumber     String    @unique
  year              Int
  semester          String
  gpa               Float?
  status            String    @default('active') // 'active' | 'suspended' | 'graduated'
  admissionDate     DateTime
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  enrollments       Enrollment[]
  results           Result[]
  attendance        Attendance[]
  payments          Payment[]
  borrowedBooks     BorrowRecord[]
}
```

#### 7. Enrollments
```prisma
model Enrollment {
  id                String    @id @default(uuid())
  studentId         String
  student           Student   @relation(fields: [studentId], references: [id])
  courseId          String
  course            Course    @relation(fields: [courseId], references: [id])
  semester          String
  academicYear      String
  status            String    @default('enrolled') // 'enrolled' | 'dropped' | 'completed'
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@unique([studentId, courseId, academicYear])
}
```

#### 8. Assignments
```prisma
model Assignment {
  id                String    @id @default(uuid())
  courseId          String
  course            Course    @relation(fields: [courseId], references: [id])
  lecturerId        String
  lecturer          User      @relation(fields: [lecturerId], references: [id])
  title             String
  description       String
  dueDate           DateTime
  maxScore          Float
  attachments       String[]  // File URLs
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  submissions       Submission[]
}
```

#### 9. Exams
```prisma
model Exam {
  id                String    @id @default(uuid())
  courseId          String
  course            Course    @relation(fields: [courseId], references: [id])
  lecturerId        String
  lecturer          User      @relation(fields: [lecturerId], references: [id])
  title             String
  type              String    // 'midterm' | 'final' | 'quiz'
  date              DateTime
  duration          Int       // minutes
  location          String?
  maxScore          Float
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  results           Result[]
}
```

#### 10. Results
```prisma
model Result {
  id                String    @id @default(uuid())
  studentId         String
  student           Student   @relation(fields: [studentId], references: [id])
  examId            String
  exam              Exam      @relation(fields: [examId], references: [id])
  score             Float
  grade             String?
  published         Boolean   @default(false)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  @@unique([studentId, examId])
}
```

#### 11. Attendance
```prisma
model Attendance {
  id                String    @id @default(uuid())
  courseId          String
  course            Course    @relation(fields: [courseId], references: [id])
  studentId         String
  student           Student   @relation(fields: [studentId], references: [id])
  lecturerId        String
  lecturer          User      @relation(fields: [lecturerId], references: [id])
  date              DateTime
  status            String    // 'present' | 'absent' | 'late'
  createdAt         DateTime  @default(now())

  @@unique([courseId, studentId, date])
}
```

#### 12. Fees
```prisma
model Fee {
  id                String    @id @default(uuid())
  universityId      String
  university        University @relation(fields: [universityId], references: [id])
  name              String
  amount            Float
  type              String    // 'tuition' | 'library' | 'lab' | 'exam'
  semester          String?
  year              Int?
  status            String    @default('active') // 'active' | 'inactive'
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  payments          Payment[]
}
```

#### 13. Payments
```prisma
model Payment {
  id                String    @id @default(uuid())
  studentId         String
  student           Student   @relation(fields: [studentId], references: [id])
  feeId             String
  fee               Fee       @relation(fields: [feeId], references: [id])
  amount            Float
  method            String    // 'cash' | 'card' | 'mobile' | 'bank'
  transactionId     String?
  status            String    @default('pending') // 'pending' | 'completed' | 'failed'
  paidAt            DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

#### 14. Books
```prisma
model Book {
  id                String    @id @default(uuid())
  universityId      String
  university        University @relation(fields: [universityId], references: [id])
  isbn              String    @unique
  title             String
  author            String
  category          String
  publisher         String?
  year              Int?
  totalCopies       Int
  availableCopies   Int
  location          String?
  coverImage        String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  borrowRecords     BorrowRecord[]
}
```

#### 15. Borrow Records
```prisma
model BorrowRecord {
  id                String    @id @default(uuid())
  bookId            String
  book              Book      @relation(fields: [bookId], references: [id])
  userId            String
  user              User      @relation(fields: [userId], references: [id])
  borrowDate        DateTime
  dueDate           DateTime
  returnDate        DateTime?
  status            String    @default('borrowed') // 'borrowed' | 'returned' | 'overdue'
  fine              Float     @default(0)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}
```

---

## API Endpoints

### Authentication

#### POST /api/auth/register
Register a new user (University Admin or Super Admin only)

#### POST /api/auth/login
Login and receive JWT token

#### POST /api/auth/logout
Logout (invalidate token)

#### POST /api/auth/refresh
Refresh JWT token

#### POST /api/auth/forgot-password
Initiate password reset

#### POST /api/auth/reset-password
Reset password with token

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

#### POST /api/users/:id/role
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

#### POST /api/courses/:id/enroll
Enroll a student

#### DELETE /api/courses/:id/enroll/:studentId
Remove student enrollment

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

### Assessment Management

#### POST /api/assignments
Create an assignment

#### GET /api/assignments
List assignments

#### GET /api/assignments/:id
Get assignment details

#### PUT /api/assignments/:id
Update assignment

#### DELETE /api/assignments/:id
Delete assignment

#### POST /api/assignments/:id/submit
Submit assignment

#### POST /api/assignments/:id/grade
Grade assignment

#### POST /api/exams
Create an exam

#### GET /api/exams
List exams

#### GET /api/exams/:id
Get exam details

#### PUT /api/exams/:id
Update exam

#### DELETE /api/exams/:id
Delete exam

#### POST /api/exams/:id/results
Submit exam results

#### GET /api/exams/:id/results
Get exam results

### Attendance Management

#### POST /api/attendance
Take attendance

#### GET /api/attendance
Get attendance records

#### GET /api/attendance/:id
Get attendance details

#### PUT /api/attendance/:id
Update attendance

### Financial Management

#### GET /api/fees
List fee structures

#### POST /api/fees
Create a fee structure

#### PUT /api/fees/:id
Update fee structure

#### DELETE /api/fees/:id
Delete fee structure

#### GET /api/payments
List payments

#### POST /api/payments
Process a payment

#### GET /api/payments/:id
Get payment details

#### GET /api/reports/financial
Generate financial report

### Library Management

#### GET /api/books
List books in catalog

#### POST /api/books
Add a new book

#### GET /api/books/:id
Get book details

#### PUT /api/books/:id
Update book information

#### DELETE /api/books/:id
Remove book

#### POST /api/books/:id/borrow
Borrow a book

#### POST /api/books/:id/return
Return a book

#### GET /api/books/search
Search catalog

---

## Authentication & Authorization

### JWT Authentication Flow

1. **Login**: User sends credentials to `/api/auth/login`
2. **Token Generation**: Server validates credentials and generates JWT
3. **Token Storage**: Client stores token (localStorage/cookie)
4. **Request**: Client includes token in `Authorization: Bearer <token>` header
5. **Validation**: Middleware validates token on protected routes
6. **Authorization**: RBAC middleware checks user permissions

### Middleware Stack

```typescript
// auth.middleware.ts
export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({error: 'No token provided'});

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({error: 'Invalid token'});
  }
};

// rbac.middleware.ts
export const authorize = (permission: string) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const hasPermission = await checkPermission(user, permission);

    if (!hasPermission) {
      return res.status(403).json({error: 'Insufficient permissions'});
    }

    next();
  };
};
```

### Permission Checking

```typescript
export const checkPermission = async (user: User, permission: string): Promise<boolean> => {
  // Super Admin has all permissions
  if (user.role === 'SUPER_ADMIN') return true;

  // Check role-based permissions
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  if (rolePermissions.includes(permission)) return true;

  // Check custom permissions
  const customPermission = await Permission.findOne({
    userId: user.id,
    permission: permission
  });

  return !!customPermission;
};
```

---

## University Onboarding

### Direct Integration (No Existing System)

1. **University Registration**
   - Super Admin creates university account
   - University Admin credentials generated
   - University settings configured

2. **Initial Setup**
   - Create departments
   - Create courses
   - Import students (bulk upload)
   - Assign lecturers to courses
   - Configure fee structures
   - Add library books

3. **User Creation**
   - Create accounts for all staff
   - Assign appropriate roles
   - Students can self-register or be imported

### API Integration (Existing System)

1. **API Key Generation**
   - Generate unique API key for university
   - Configure API endpoint (if university hosts data)
   - Set up webhooks for real-time sync

2. **Data Mapping**
   - Map university's data structure to CHUO schema
   - Configure sync frequency
   - Set up data transformation rules

3. **Authentication**
   - University uses API key for authentication
   - OAuth 2.0 option for enhanced security
   - IP whitelisting for additional security

---

## Implementation Guide

### Phase 1: Core Infrastructure (Week 1-2)

1. **Project Setup**
   - Initialize Node.js project with TypeScript
   - Set up Express server
   - Configure Prisma with PostgreSQL
   - Set up Redis for caching
   - Configure environment variables

2. **Authentication System**
   - Implement JWT authentication
   - Create login/register endpoints
   - Set up password reset flow
   - Create auth middleware

3. **Database Schema**
   - Define Prisma schema
   - Run migrations
   - Seed initial data (Super Admin)

### Phase 2: RBAC System (Week 3)

1. **Role Definitions**
   - Define all roles in database
   - Create role-permission mappings
   - Implement permission checking logic

2. **RBAC Middleware**
   - Create authorization middleware
   - Implement custom permission grants
   - Set up permission revocation

3. **User Management**
   - Create user CRUD endpoints
   - Implement role assignment
   - Add permission management

### Phase 3: Core Features (Week 4-6)

1. **University Management**
   - University CRUD operations
   - Department management
   - Configuration endpoints

2. **Academic Management**
   - Course management
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

### Phase 5: Integration & Testing (Week 9-10)

1. **API Documentation**
   - Set up Swagger/OpenAPI
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
   - Bcrypt hashing (12 rounds)
   - Password complexity requirements
   - Password expiration

2. **Token Security**
   - Short-lived access tokens (15 min)
   - Long-lived refresh tokens (7 days)
   - Token rotation on refresh

3. **API Security**
   - Rate limiting
   - Request validation
   - SQL injection prevention (Prisma)
   - XSS protection

4. **Data Security**
   - Encryption at rest
   - HTTPS only in production
   - Regular backups
   - Audit logging

---

## Performance Optimization

1. **Caching Strategy**
   - Redis for frequently accessed data
   - Cache user permissions
   - Cache course catalogs

2. **Database Optimization**
   - Indexed fields
   - Query optimization
   - Connection pooling

3. **API Optimization**
   - Pagination
   - Field selection
   - Compression

---

## Monitoring & Logging

1. **Application Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (APM)
   - Uptime monitoring

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

1. Initialize backend project
2. Set up database and Prisma
3. Implement authentication system
4. Create RBAC middleware
5. Build core API endpoints
6. Integrate with frontend
7. Deploy to production

---

## Contact & Support

For questions or support during implementation, contact the CHUO development team.
