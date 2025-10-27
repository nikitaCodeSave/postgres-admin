import { Database, CheckCircle, FileText, Settings, RefreshCw } from 'lucide-react';

interface WelcomeScreenProps {
  onCheckAgain: () => void;
}

export default function WelcomeScreen({ onCheckAgain }: WelcomeScreenProps) {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl shadow-lg">
              <Database className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-dark-text mb-4">
            Welcome to PostgreSQL Admin Dashboard
          </h1>
          <p className="text-lg text-dark-muted max-w-2xl mx-auto">
            The first ever Visual UI for Alembic migrations. Manage your database schema with ease.
          </p>
        </div>

        {/* Getting Started Card */}
        <div className="card p-8 mb-6">
          <h2 className="text-2xl font-bold text-dark-text mb-6 flex items-center gap-3">
            <Settings className="w-6 h-6 text-primary-500" />
            Getting Started
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dark-text mb-2">
                  Configure Alembic in Your Project
                </h3>
                <p className="text-dark-muted mb-3">
                  Create or verify your <code className="px-2 py-1 bg-dark-bg rounded text-primary-400">alembic.ini</code> file in your project root:
                </p>
                <div className="bg-dark-bg rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-dark-text">
{`# alembic.ini
[alembic]
script_location = alembic
prepend_sys_path = .
version_path_separator = os

sqlalchemy.url = postgresql://user:password@localhost/dbname`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dark-text mb-2">
                  Set Up Environment Variables
                </h3>
                <p className="text-dark-muted mb-3">
                  Create a <code className="px-2 py-1 bg-dark-bg rounded text-primary-400">.env</code> file with your database connection:
                </p>
                <div className="bg-dark-bg rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-dark-text">
{`DATABASE_URL=postgresql://user:password@localhost:5432/dbname
ALEMBIC_INI_PATH=/path/to/your/project/alembic.ini
ALEMBIC_SCRIPT_LOCATION=/path/to/your/project/alembic`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dark-text mb-2">
                  Mount Your Project to Backend Container
                </h3>
                <p className="text-dark-muted mb-3">
                  Update <code className="px-2 py-1 bg-dark-bg rounded text-primary-400">docker-compose.yml</code> to mount your project directory:
                </p>
                <div className="bg-dark-bg rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-dark-text">
{`services:
  backend:
    volumes:
      - /path/to/your/project:/app/user_project:ro`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-dark-text mb-2">
                  Restart the Backend Service
                </h3>
                <p className="text-dark-muted mb-3">
                  Apply the changes by restarting:
                </p>
                <div className="bg-dark-bg rounded-lg p-4 font-mono text-sm">
                  <code className="text-primary-400">docker compose restart backend</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Preview Card */}
        <div className="card p-8 mb-8">
          <h2 className="text-xl font-bold text-dark-text mb-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
            What You'll Get
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold text-dark-text mb-1">Visual Timeline</h3>
              <p className="text-sm text-dark-muted">See all your migrations in a beautiful timeline</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-dark-text mb-1">One-Click Apply</h3>
              <p className="text-sm text-dark-muted">Apply migrations with a single click</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <RefreshCw className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-dark-text mb-1">Safe Rollback</h3>
              <p className="text-sm text-dark-muted">Roll back migrations when needed</p>
            </div>
          </div>
        </div>

        {/* Check Again Button */}
        <div className="text-center">
          <button
            onClick={onCheckAgain}
            className="btn-primary px-8 py-3 text-lg inline-flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Check Configuration
          </button>
          <p className="text-sm text-dark-muted mt-4">
            Click to check if your Alembic configuration is ready
          </p>
        </div>
      </div>
    </div>
  );
}
