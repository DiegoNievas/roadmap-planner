/* ──────────────────────────────────────────────
   Storage service — localStorage implementation.
   Replace the body of each function with Supabase
   calls when migrating to a backend.
   ────────────────────────────────────────────── */

import type { AppData } from '../types';
import { seedData } from '../data/seed';

const STORAGE_KEY = 'roadmap-planner-data';
const CURRENT_VERSION = '1.0.0';

function emptyData(): AppData {
  return {
    portfolios: [],
    products: [],
    roadmapItems: [],
    version: CURRENT_VERSION,
  };
}

/** Load all app data. Seeds on first run. */
export async function loadAppData(): Promise<AppData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit — seed example data
      await saveAppData(seedData);
      return seedData;
    }
    return JSON.parse(raw) as AppData;
  } catch {
    return emptyData();
  }
}

/** Persist full app data. */
export async function saveAppData(data: AppData): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Export data as a downloadable JSON file. */
export function exportToJson(data: AppData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `roadmap-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Import JSON file and return parsed AppData. */
export function importFromJson(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string) as AppData;
        if (!data.portfolios || !data.products || !data.roadmapItems) {
          reject(new Error('Invalid data format'));
          return;
        }
        resolve(data);
      } catch {
        reject(new Error('Failed to parse JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/** Clear all stored data (reset). */
export async function clearAppData(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
}
