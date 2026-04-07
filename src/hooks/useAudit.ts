import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  oldValue?: any;
  newValue?: any;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  tenantId?: string;
}

export interface AuditFilters {
  userId?: string;
  entity?: string;
  action?: string;
}

export const useAudit = (filters?: AuditFilters) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAuditLogs(filters);
      setLogs(data);
    } catch (err: any) {
      console.error('Error loading audit logs:', err);
      setError(err.message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [filters?.userId, filters?.entity, filters?.action]);

  const getEntityLogs = async (entity: string, entityId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAuditByEntity(entity, entityId);
      return data;
    } catch (err: any) {
      console.error('Error loading entity logs:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    logs,
    loading,
    error,
    refresh: loadLogs,
    getEntityLogs,
  };
};
