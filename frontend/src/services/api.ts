/**
 * API service for communicating with backend
 */

import axios from 'axios';
import type { AlembicMigration, MigrationStatus } from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Alembic API
export const alembicApi = {
  async getMigrations(): Promise<AlembicMigration[]> {
    const response = await api.get<AlembicMigration[]>('/alembic/migrations');
    return response.data;
  },

  async getStatus(): Promise<MigrationStatus> {
    const response = await api.get<MigrationStatus>('/alembic/status');
    return response.data;
  },

  async upgrade(): Promise<{ status: string; message: string }> {
    const response = await api.post('/alembic/upgrade');
    return response.data;
  },

  async downgrade(): Promise<{ status: string; message: string }> {
    const response = await api.post('/alembic/downgrade');
    return response.data;
  },

  async health(): Promise<{ status: string }> {
    const response = await api.get('/alembic/health');
    return response.data;
  },
};

export default api;
