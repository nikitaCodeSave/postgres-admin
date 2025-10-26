/**
 * Type definitions for PostgreSQL Admin Dashboard
 */

export interface AlembicMigration {
  revision: string;
  down_revision: string | null;
  message: string;
  is_current: boolean;
  is_pending: boolean;
  created_date: string | null;
}

export interface MigrationStatus {
  current_revision: string;
  total_migrations: number;
  pending_migrations: number;
  is_up_to_date: boolean;
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}
