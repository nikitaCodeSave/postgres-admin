/**
 * Main App Component
 */

import { Database } from 'lucide-react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-dark-surface border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-dark-text">PostgreSQL Admin</h1>
              <p className="text-sm text-dark-muted">Visual Alembic UI POC</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Dashboard />
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-dark-muted">
          <p>PostgreSQL Admin Dashboard - POC v0.1.0</p>
          <p className="mt-1">First ever Visual UI for Alembic migrations 🚀</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
