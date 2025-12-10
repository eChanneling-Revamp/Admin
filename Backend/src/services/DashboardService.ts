import { UserRepository } from '@/repositories/UserRepository';
import { BranchRepository } from '@/repositories/BranchRepository';
import { InvoiceRepository } from '@/repositories/InvoiceRepository';
import { AuditRepository } from '@/repositories/AuditRepository';
import { DashboardStats } from '@/types';

export class DashboardService {
  private userRepository = new UserRepository();
  private branchRepository = new BranchRepository();
  private invoiceRepository = new InvoiceRepository();
  private auditRepository = new AuditRepository();

  async getDashboardStats(): Promise<DashboardStats> {
    const [
      userStats,
      branchStats,
      invoiceStats,
      recentActivity,
    ] = await Promise.all([
      this.userRepository.getStats(),
      this.branchRepository.getStats(),
      this.invoiceRepository.getStats(),
      this.auditRepository.findRecentActivity(10),
    ]);

    return {
      users: {
        total: userStats.total,
        active: userStats.active,
        newThisMonth: userStats.recentLogins, // Using recent logins as proxy for new users
      },
      branches: {
        total: branchStats.total,
        active: branchStats.active,
        byType: branchStats.byType,
      },
      invoices: {
        total: invoiceStats.total,
        totalAmount: invoiceStats.totalAmount,
        paidAmount: invoiceStats.paidAmount,
        pendingAmount: invoiceStats.pendingAmount,
        overdueAmount: invoiceStats.overdueAmount,
      },
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        type: activity.action,
        description: activity.description || 'No description',
        timestamp: activity.createdAt,
        user: activity.user ? `${activity.user.firstName || ''} ${activity.user.lastName || ''}`.trim() || activity.user.email : 'System',
      })),
    };
  }

  async getUserStats() {
    return this.userRepository.getStats();
  }

  async getBranchStats() {
    return this.branchRepository.getStats();
  }

  async getInvoiceStats() {
    return this.invoiceRepository.getStats();
  }

  async getAuditStats() {
    return this.auditRepository.getStats();
  }

  async getRecentActivity(limit: number = 10) {
    const activities = await this.auditRepository.findRecentActivity(limit);
    return activities.map(activity => ({
      id: activity.id,
      type: activity.action,
      description: activity.description || 'No description',
      timestamp: activity.createdAt,
      user: activity.user ? `${activity.user.firstName || ''} ${activity.user.lastName || ''}`.trim() || activity.user.email : 'System',
      resource: activity.resource,
      resourceId: activity.resourceId,
    }));
  }

  async getSystemHealth() {
    const [
      userCount,
      branchCount,
      invoiceCount,
      recentErrors,
    ] = await Promise.all([
      this.userRepository.getStats(),
      this.branchRepository.getStats(),
      this.invoiceRepository.getStats(),
      this.auditRepository.findMany({
        page: 1,
        limit: 5,
        action: 'ERROR',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    ]);

    return {
      status: 'healthy',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      users: userCount.total,
      branches: branchCount.total,
      invoices: invoiceCount.total,
      recentErrors: recentErrors.auditLogs.length,
      lastError: recentErrors.auditLogs[0]?.createdAt || null,
    };
  }

  async getAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const [
      userActivity,
      branchActivity,
      invoiceActivity,
    ] = await Promise.all([
      this.auditRepository.findMany({
        page: 1,
        limit: 1000,
        startDate,
        endDate: now,
        action: 'LOGIN',
        sortBy: 'createdAt',
        sortOrder: 'asc',
      }),
      this.auditRepository.findMany({
        page: 1,
        limit: 1000,
        startDate,
        endDate: now,
        resource: 'branch',
        sortBy: 'createdAt',
        sortOrder: 'asc',
      }),
      this.auditRepository.findMany({
        page: 1,
        limit: 1000,
        startDate,
        endDate: now,
        resource: 'invoice',
        sortBy: 'createdAt',
        sortOrder: 'asc',
      }),
    ]);

    return {
      timeframe,
      startDate,
      endDate: now,
      userLogins: userActivity.total,
      branchChanges: branchActivity.total,
      invoiceChanges: invoiceActivity.total,
      dailyActivity: this.groupByDay([
        ...userActivity.auditLogs,
        ...branchActivity.auditLogs,
        ...invoiceActivity.auditLogs,
      ]),
    };
  }

  private groupByDay(activities: any[]) {
    const grouped: Record<string, number> = {};
    
    activities.forEach(activity => {
      const date = activity.createdAt.toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });

    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}

export default new DashboardService();
