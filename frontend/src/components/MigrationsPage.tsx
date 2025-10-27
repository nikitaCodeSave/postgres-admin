/**
 * Visual Alembic UI - KILLER FEATURE
 * First ever GUI for Alembic migrations
 */

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { alembicApi } from '../services/api';
import type { AlembicMigration, MigrationStatus } from '../types';

export default function MigrationsPage() {
  const [migrations, setMigrations] = useState<AlembicMigration[]>([]);
  const [status, setStatus] = useState<MigrationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [migrationsData, statusData] = await Promise.all([
        alembicApi.getMigrations(),
        alembicApi.getStatus(),
      ]);
      setMigrations(migrationsData);
      setStatus(statusData);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to load migrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpgrade = async () => {
    if (!confirm('Apply all pending migrations?')) return;

    setActionLoading(true);
    try {
      const result = await alembicApi.upgrade();
      alert(result.message);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to upgrade migrations');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDowngrade = async () => {
    if (!confirm('Rollback one migration? This cannot be undone!')) return;

    setActionLoading(true);
    try {
      const result = await alembicApi.downgrade();
      alert(result.message);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to downgrade migration');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-dark-muted">Loading migrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="card p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">Error</h2>
          <p className="text-dark-muted text-center mb-4">{error}</p>
          <button onClick={loadData} className="btn-primary w-full">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const hasPending = status && status.pending_migrations > 0;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Alembic Migrations</h1>
          <p className="text-dark-muted">Visual UI for database migrations - First ever!</p>
        </div>

        {/* Status Card */}
        {status && (
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Migration Status</h2>
              <button
                onClick={loadData}
                disabled={actionLoading}
                className="btn-secondary flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-dark-muted mb-1">Current Revision</p>
                <p className="font-mono text-sm text-primary-400">
                  {status.current_revision.substring(0, 12)}
                </p>
              </div>
              <div>
                <p className="text-sm text-dark-muted mb-1">Total Migrations</p>
                <p className="text-2xl font-bold">{status.total_migrations}</p>
              </div>
              <div>
                <p className="text-sm text-dark-muted mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-400">{status.pending_migrations}</p>
              </div>
              <div>
                <p className="text-sm text-dark-muted mb-1">Status</p>
                {status.is_up_to_date ? (
                  <span className="badge-success">Up to date</span>
                ) : (
                  <span className="badge-warning">Pending</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleUpgrade}
            disabled={actionLoading || !hasPending}
            className="btn-primary flex items-center gap-2"
          >
            <ArrowUp className="w-4 h-4" />
            Apply Migrations {hasPending && `(${status.pending_migrations})`}
          </button>
          <button
            onClick={handleDowngrade}
            disabled={actionLoading || migrations.length === 0}
            className="btn-danger flex items-center gap-2"
          >
            <ArrowDown className="w-4 h-4" />
            Rollback One
          </button>
        </div>

        {/* Migrations Timeline */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Migration History</h2>

          {migrations.length === 0 ? (
            <div className="text-center py-8 text-dark-muted">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No migrations found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {migrations.map((migration) => (
                <div
                  key={migration.revision}
                  className={`p-4 rounded-lg border transition-all ${
                    migration.is_current
                      ? 'border-primary-600 bg-primary-900/20'
                      : migration.is_pending
                      ? 'border-yellow-600 bg-yellow-900/10'
                      : 'border-dark-border bg-dark-bg'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {migration.is_current ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : migration.is_pending ? (
                        <Clock className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-dark-muted" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono text-primary-400">
                              {migration.revision}
                            </code>
                            {migration.is_current && (
                              <span className="badge-success text-xs">CURRENT</span>
                            )}
                            {migration.is_pending && (
                              <span className="badge-warning text-xs">PENDING</span>
                            )}
                          </div>
                          <p className="text-dark-text">{migration.message}</p>
                        </div>

                        {migration.created_date && (
                          <time className="text-xs text-dark-muted whitespace-nowrap">
                            {new Date(migration.created_date).toLocaleDateString()}
                          </time>
                        )}
                      </div>

                      {migration.down_revision && (
                        <p className="text-xs text-dark-muted">
                          Parent: <code className="font-mono">{migration.down_revision}</code>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
