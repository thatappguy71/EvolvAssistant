// Offline storage utilities for mobile app
export interface OfflineData {
  habits: any[];
  completions: any[];
  metrics: any[];
  lastSync: string;
}

const STORAGE_KEY = 'evolv-offline-data';

export class OfflineStorage {
  static save(data: Partial<OfflineData>): void {
    try {
      const existing = this.load();
      const updated = { ...existing, ...data, lastSync: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  static load(): OfflineData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
    
    return {
      habits: [],
      completions: [],
      metrics: [],
      lastSync: new Date().toISOString()
    };
  }

  static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }

  static addHabitCompletion(habitId: number): void {
    const data = this.load();
    const completion = {
      id: Date.now(),
      habitId,
      completedAt: new Date().toISOString(),
      offline: true
    };
    data.completions.push(completion);
    this.save(data);
  }

  static addMetrics(metrics: any): void {
    const data = this.load();
    const metricsEntry = {
      ...metrics,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      offline: true
    };
    data.metrics.push(metricsEntry);
    this.save(data);
  }

  static getPendingSyncData(): { completions: any[]; metrics: any[] } {
    const data = this.load();
    return {
      completions: data.completions.filter(c => c.offline),
      metrics: data.metrics.filter(m => m.offline)
    };
  }

  static markSynced(): void {
    const data = this.load();
    data.completions = data.completions.filter(c => !c.offline);
    data.metrics = data.metrics.filter(m => !m.offline);
    this.save(data);
  }
}