import { UserRole } from '@prisma/client';

export interface Permission {
  resource: string;
  action: string;
  conditions?: string[];
}

export const PERMISSIONS = {
  // User permissions
  USER_CREATE: { resource: 'user', action: 'create' },
  USER_READ: { resource: 'user', action: 'read' },
  USER_UPDATE: { resource: 'user', action: 'update' },
  USER_DELETE: { resource: 'user', action: 'delete' },
  USER_READ_ALL: { resource: 'user', action: 'read', conditions: ['all'] },
  USER_UPDATE_ROLE: { resource: 'user', action: 'update', conditions: ['role'] },

  // Branch permissions
  BRANCH_CREATE: { resource: 'branch', action: 'create' },
  BRANCH_READ: { resource: 'branch', action: 'read' },
  BRANCH_UPDATE: { resource: 'branch', action: 'update' },
  BRANCH_DELETE: { resource: 'branch', action: 'delete' },
  BRANCH_READ_ALL: { resource: 'branch', action: 'read', conditions: ['all'] },

  // Invoice permissions
  INVOICE_CREATE: { resource: 'invoice', action: 'create' },
  INVOICE_READ: { resource: 'invoice', action: 'read' },
  INVOICE_UPDATE: { resource: 'invoice', action: 'update' },
  INVOICE_DELETE: { resource: 'invoice', action: 'delete' },
  INVOICE_READ_ALL: { resource: 'invoice', action: 'read', conditions: ['all'] },
  INVOICE_PAY: { resource: 'invoice', action: 'update', conditions: ['pay'] },

  // Dashboard permissions
  DASHBOARD_READ: { resource: 'dashboard', action: 'read' },
  DASHBOARD_STATS: { resource: 'dashboard', action: 'read', conditions: ['stats'] },

  // Audit permissions
  AUDIT_READ: { resource: 'audit', action: 'read' },
  AUDIT_READ_ALL: { resource: 'audit', action: 'read', conditions: ['all'] },

  // Notification permissions
  NOTIFICATION_CREATE: { resource: 'notification', action: 'create' },
  NOTIFICATION_READ: { resource: 'notification', action: 'read' },
  NOTIFICATION_UPDATE: { resource: 'notification', action: 'update' },
  NOTIFICATION_DELETE: { resource: 'notification', action: 'delete' },
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS),
  ],
  
  [UserRole.DOCTOR]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.BRANCH_READ,
    PERMISSIONS.INVOICE_READ,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.NOTIFICATION_READ,
  ],
  
  [UserRole.HOSPITAL]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.BRANCH_READ,
    PERMISSIONS.BRANCH_UPDATE,
    PERMISSIONS.INVOICE_READ,
    PERMISSIONS.INVOICE_CREATE,
    PERMISSIONS.INVOICE_UPDATE,
    PERMISSIONS.DASHBOARD_READ,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.NOTIFICATION_CREATE,
  ],
  
  [UserRole.PATIENT]: [
    PERMISSIONS.USER_READ,
    PERMISSIONS.BRANCH_READ,
    PERMISSIONS.INVOICE_READ,
    PERMISSIONS.NOTIFICATION_READ,
  ],
};

export class PermissionChecker {
  static hasPermission(
    userRole: UserRole,
    requiredPermission: Permission
  ): boolean {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    
    return rolePermissions.some(permission => 
      this.permissionMatches(permission, requiredPermission)
    );
  }

  static hasAnyPermission(
    userRole: UserRole,
    requiredPermissions: Permission[]
  ): boolean {
    return requiredPermissions.some(permission =>
      this.hasPermission(userRole, permission)
    );
  }

  static hasAllPermissions(
    userRole: UserRole,
    requiredPermissions: Permission[]
  ): boolean {
    return requiredPermissions.every(permission =>
      this.hasPermission(userRole, permission)
    );
  }

  private static permissionMatches(
    userPermission: Permission,
    requiredPermission: Permission
  ): boolean {
    // Check resource and action
    if (userPermission.resource !== requiredPermission.resource ||
        userPermission.action !== requiredPermission.action) {
      return false;
    }

    // Check conditions if required
    if (requiredPermission.conditions) {
      if (!userPermission.conditions) {
        return false;
      }
      
      return requiredPermission.conditions.every(condition =>
        userPermission.conditions!.includes(condition)
      );
    }

    return true;
  }

  static canAccessResource(
    userRole: UserRole,
    resource: string,
    action: string,
    conditions?: string[]
  ): boolean {
    const permission: Permission = {
      resource,
      action,
      conditions,
    };

    return this.hasPermission(userRole, permission);
  }

  static getAccessibleResources(userRole: UserRole): string[] {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    const resources = new Set<string>();
    
    rolePermissions.forEach(permission => {
      resources.add(permission.resource);
    });
    
    return Array.from(resources);
  }

  static getAccessibleActions(userRole: UserRole, resource: string): string[] {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
    const actions = new Set<string>();
    
    rolePermissions.forEach(permission => {
      if (permission.resource === resource) {
        actions.add(permission.action);
      }
    });
    
    return Array.from(actions);
  }
}

export default PermissionChecker;
