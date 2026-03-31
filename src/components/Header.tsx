import { Sun, Moon, Download, Upload, Plus, RotateCcw } from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { exportToJson, importFromJson } from '../services/storage';
import { useRef } from 'react';

export default function Header() {
  const { data, darkMode, toggleDarkMode, setShowItemForm, setEditingItem, replaceAllData, resetToSeed } = useRoadmap();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromJson(file);
      replaceAllData(imported);
    } catch (err) {
      alert('Failed to import: ' + (err as Error).message);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b shrink-0"
      style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}
    >
      <div>
        <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          Product Roadmap
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button className="btn-primary" onClick={() => { setEditingItem(null); setShowItemForm(true); }}>
          <Plus size={15} />
          Add Item
        </button>

        <button className="btn-secondary" onClick={() => exportToJson(data)} title="Export JSON">
          <Download size={15} />
        </button>

        <button className="btn-secondary" onClick={() => fileRef.current?.click()} title="Import JSON">
          <Upload size={15} />
        </button>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

        <button className="btn-secondary" onClick={resetToSeed} title="Reset to sample data">
          <RotateCcw size={15} />
        </button>

        <button
          className="btn-secondary"
          onClick={toggleDarkMode}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
