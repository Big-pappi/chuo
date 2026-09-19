export interface CreateUserRequest {
  universityId: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export interface AssignRoleRequest {
  role: string;
}

export interface UserResponse {
  id: string;
  universityId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionResponse {
  id: string;
  permission: string;
  grantedBy?: string;
  createdAt: string;
}
