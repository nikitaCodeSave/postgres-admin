import { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import MigrationsPage from './MigrationsPage';
import WelcomeScreen from './WelcomeScreen';

interface HealthStatus {
  status: string;
  database: string;
  alembic_config: string;
}

export default function Dashboard() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/health');
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }
      const data = await response.json();
      setHealthStatus(data);
    } catch (err: any) {
      console.error('Health check error:', err);
      setError(err.message || 'Failed to check configuration status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-dark-muted">Checking configuration...</p>
        </div>
      </div>
    );
  }

  // Error state (backend not available)
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <div className="card p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-text mb-3">Backend Connection Error</h2>
          <p className="text-dark-muted mb-6">{error}</p>
          <button onClick={checkHealth} className="btn-primary w-full">
            Retry Connection
          </button>
          <p className="text-sm text-dark-muted mt-4">
            Make sure the backend service is running on port 8000
          </p>
        </div>
      </div>
    );
  }

  // Check if Alembic is configured
  const isAlembicConfigured = healthStatus?.alembic_config === 'configured';

  // Show appropriate screen based on configuration status
  if (!isAlembicConfigured) {
    return <WelcomeScreen onCheckAgain={checkHealth} />;
  }

  // Alembic is configured - show the migrations page
  return <MigrationsPage />;
}
