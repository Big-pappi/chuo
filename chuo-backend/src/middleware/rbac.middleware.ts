import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import logger from '../utils/logger';

// Role-based permission mappings
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'], // All permissions
  UNIVERSITY_ADMIN: [
    'user:create',
    'user:read',
    'user:update',
    'user:assign_role',
    'course:create',
    'course:read',
    'course:update',
    'course:delete',
    'enrollment:create',
    'enrollment:read',
    'enrollment:update',
    'enrollment:delete',
    'university:read',
    'university:update',
    'department:create',
    'department:read',
    'department:update',
    'department:delete',
    'settings:read',
    'settings:update',
  ],
  DEAN: [
    'user:create',
    'user:read',
    'user:update',
    'user:assign_role',
    'course:create',
    'course:read',
    'course:update',
    'course:delete',
    'enrollment:create',
    'enrollment:read',
    'enrollment:update',
    'enrollment:delete',
    'assignment:create',
    'assignment:read',
    'assignment:update',
    'assignment:delete',
    'assignment:grade',
    'exam:create',
    'exam:read',
    'exam:update',
    'exam:delete',
    'exam:grade',
    'result:read',
    'result:publish',
    'attendance:create',
    'attendance:read',
    'attendance:update',
    'attendance:delete',
    'department:create',
    'department:read',
    'department:update',
    'department:delete',
    'report:financial',
  ],
  HOD: [
    'course:create',
    'course:read',
    'course:update',
    'course:delete',
    'enrollment:create',
    'enrollment:read',
    'enrollment:update',
    'enrollment:delete',
    'assignment:create',
    'assignment:read',
    'assignment:update',
    'assignment:delete',
    'assignment:grade',
    'exam:create',
    'exam:read',
    'exam:update',
    'exam:delete',
    'exam:grade',
    'result:read',
    'result:publish',
    'attendance:create',
    'attendance:read',
    'attendance:update',
    'attendance:delete',
  ],
  LECTURER: [
    'course:read',
    'course:update',
    'assignment:create',
    'assignment:read',
    'assignment:update',
    'assignment:delete',
    'assignment:grade',
    'exam:create',
    'exam:read',
    'exam:update',
    'exam:delete',
    'exam:grade',
    'result:read',
    'result:publish',
    'attendance:create',
    'attendance:read',
    'attendance:update',
    'attendance:delete',
  ],
  COURSE_COORDINATOR: [
    'course:read',
    'course:update',
    'assignment:create',
    'assignment:read',
    'assignment:update',
    'assignment:delete',
    'exam:create',
    'exam:read',
    'exam:update',
    'exam:delete',
  ],
  REGISTRAR: [
    'user:create',
    'user:read',
    'user:update',
    'enrollment:create',
    'enrollment:read',
    'enrollment:update',
    'enrollment:delete',
    'result:read',
    'result:publish',
    'department:read',
  ],
  FINANCE_OFFICER: [
    'fee:create',
    'fee:read',
    'fee:update',
    'fee:delete',
    'payment:create',
    'payment:read',
    'payment:update',
    'payment:delete',
    'report:financial',
  ],
  LIBRARIAN: [
    'book:create',
    'book:read',
    'book:update',
    'book:delete',
    'borrow:create',
    'borrow:read',
    'borrow:update',
    'borrow:delete',
  ],
  IT_ADMIN: [
    'user:create',
    'user:read',
    'user:update',
    'user:delete',
    'user:assign_role',
    'university:read',
    'department:read',
    'settings:read',
    'settings:update',
  ],
  STUDENT: [
    'user:read',
    'course:read',
    'enrollment:read',
    'assignment:read',
    'exam:read',
    'result:read',
    'attendance:read',
    'fee:read',
    'payment:read',
    'book:read',
    'borrow:read',
    'settings:read',
  ],
};

export const authorize = (permission: string) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: { permissions: true },
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Check if user has super admin role (all permissions)
      if (user.role === 'SUPER_ADMIN') {
        next();
        return;
      }

      // Check role-based permissions
      const rolePermissions = ROLE_PERMISSIONS[user.role] || [];
      if (rolePermissions.includes('*') || rolePermissions.includes(permission)) {
        next();
        return;
      }

      // Check custom permissions
      const hasCustomPermission = user.permissions.some(
        (p) => p.permission === permission
      );

      if (hasCustomPermission) {
        next();
        return;
      }

      logger.warn(
        `Unauthorized access attempt: User ${user.id} with role ${user.role} tried to access ${permission}`
      );
      res.status(403).json({ error: 'Insufficient permissions' });
    } catch (error) {
      logger.error('Authorization error:', error);
      res.status(500).json({ error: 'Authorization check failed' });
    }
  };
};
