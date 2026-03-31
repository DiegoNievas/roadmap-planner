import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { AppData, Portfolio, Product, RoadmapItem, Filters, ViewMode, TimelineScale } from '../types';
import { DEFAULT_FILTERS } from '../types';
import { loadAppData, saveAppData } from '../services/storage';

interface RoadmapContextType {
  data: AppData;
  loading: boolean;
  filters: Filters;
  viewMode: ViewMode;
  timelineScale: TimelineScale;
  darkMode: boolean;
  sidebarOpen: boolean;
  editingItem: RoadmapItem | null;
  showItemForm: boolean;

  setFilters: (f: Filters) => void;
  setViewMode: (v: ViewMode) => void;
  setTimelineScale: (s: TimelineScale) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;

  // CRUD — Portfolios
  addPortfolio: (p: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePortfolio: (p: Portfolio) => void;
  deletePortfolio: (id: string) => void;

  // CRUD — Products
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;

  // CRUD — Roadmap Items
  addRoadmapItem: (item: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoadmapItem: (item: RoadmapItem) => void;
  deleteRoadmapItem: (id: string) => void;
  duplicateRoadmapItem: (id: string) => void;

  setEditingItem: (item: RoadmapItem | null) => void;
  setShowItemForm: (show: boolean) => void;

  // Data management
  replaceAllData: (data: AppData) => void;
  resetToSeed: () => void;

  // Helpers
  getPortfolio: (id: string) => Portfolio | undefined;
  getProduct: (id: string) => Product | undefined;
  getFilteredItems: () => RoadmapItem[];
}

const RoadmapContext = createContext<RoadmapContextType | null>(null);

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function now(): string {
  return new Date().toISOString();
}

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({ portfolios: [], products: [], roadmapItems: [], version: '1.0.0' });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [timelineScale, setTimelineScale] = useState<TimelineScale>('quarter');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('roadmap-dark-mode') === 'true';
    }
    return false;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);

  // Load on mount
  useEffect(() => {
    loadAppData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  // Persist on change
  useEffect(() => {
    if (!loading) {
      saveAppData(data);
    }
  }, [data, loading]);

  // Dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('roadmap-dark-mode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode((p) => !p), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);

  // ── Portfolio CRUD ──
  const addPortfolio = useCallback(
    (p: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
      const ts = now();
      setData((prev) => ({
        ...prev,
        portfolios: [...prev.portfolios, { ...p, id: uid(), createdAt: ts, updatedAt: ts }],
      }));
    },
    []
  );
  const updatePortfolio = useCallback(
    (p: Portfolio) =>
      setData((prev) => ({
        ...prev,
        portfolios: prev.portfolios.map((x) => (x.id === p.id ? { ...p, updatedAt: now() } : x)),
      })),
    []
  );
  const deletePortfolio = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        portfolios: prev.portfolios.filter((x) => x.id !== id),
        products: prev.products.filter((x) => x.portfolioId !== id),
        roadmapItems: prev.roadmapItems.filter((x) => x.portfolioId !== id),
      })),
    []
  );

  // ── Product CRUD ──
  const addProduct = useCallback(
    (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const ts = now();
      setData((prev) => ({
        ...prev,
        products: [...prev.products, { ...p, id: uid(), createdAt: ts, updatedAt: ts }],
      }));
    },
    []
  );
  const updateProduct = useCallback(
    (p: Product) =>
      setData((prev) => ({
        ...prev,
        products: prev.products.map((x) => (x.id === p.id ? { ...p, updatedAt: now() } : x)),
      })),
    []
  );
  const deleteProduct = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        products: prev.products.filter((x) => x.id !== id),
        roadmapItems: prev.roadmapItems.filter((x) => x.productId !== id),
      })),
    []
  );

  // ── RoadmapItem CRUD ──
  const addRoadmapItem = useCallback(
    (item: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      const ts = now();
      setData((prev) => ({
        ...prev,
        roadmapItems: [...prev.roadmapItems, { ...item, id: uid(), createdAt: ts, updatedAt: ts }],
      }));
    },
    []
  );
  const updateRoadmapItem = useCallback(
    (item: RoadmapItem) =>
      setData((prev) => ({
        ...prev,
        roadmapItems: prev.roadmapItems.map((x) => (x.id === item.id ? { ...item, updatedAt: now() } : x)),
      })),
    []
  );
  const deleteRoadmapItem = useCallback(
    (id: string) =>
      setData((prev) => ({
        ...prev,
        roadmapItems: prev.roadmapItems
          .filter((x) => x.id !== id)
          .map((x) => ({
            ...x,
            dependencies: x.dependencies.filter((d) => d !== id),
          })),
      })),
    []
  );
  const duplicateRoadmapItem = useCallback(
    (id: string) =>
      setData((prev) => {
        const original = prev.roadmapItems.find((x) => x.id === id);
        if (!original) return prev;
        const ts = now();
        const copy: RoadmapItem = {
          ...original,
          id: uid(),
          title: `${original.title} (copy)`,
          status: 'idea',
          createdAt: ts,
          updatedAt: ts,
        };
        return { ...prev, roadmapItems: [...prev.roadmapItems, copy] };
      }),
    []
  );

  // ── Data management ──
  const replaceAllData = useCallback((newData: AppData) => setData(newData), []);
  const resetToSeed = useCallback(async () => {
    const { seedData } = await import('../data/seed');
    setData(seedData);
  }, []);

  // ── Helpers ──
  const getPortfolio = useCallback(
    (id: string) => data.portfolios.find((p) => p.id === id),
    [data.portfolios]
  );
  const getProduct = useCallback(
    (id: string) => data.products.find((p) => p.id === id),
    [data.products]
  );

  const getFilteredItems = useCallback((): RoadmapItem[] => {
    let items = data.roadmapItems;
    const f = filters;
    if (f.portfolioId) items = items.filter((i) => i.portfolioId === f.portfolioId);
    if (f.productId) items = items.filter((i) => i.productId === f.productId);
    if (f.owner) items = items.filter((i) => i.owner === f.owner);
    if (f.priority) items = items.filter((i) => i.priority === f.priority);
    if (f.status) items = items.filter((i) => i.status === f.status);
    if (f.type) items = items.filter((i) => i.type === f.type);
    if (f.ctoLever) items = items.filter((i) => i.ctoLever === f.ctoLever);
    if (f.strategicTheme) items = items.filter((i) => i.strategicTheme === f.strategicTheme);
    if (f.search) {
      const q = f.search.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.owner.toLowerCase().includes(q)
      );
    }
    return items;
  }, [data.roadmapItems, filters]);

  return (
    <RoadmapContext.Provider
      value={{
        data,
        loading,
        filters,
        viewMode,
        timelineScale,
        darkMode,
        sidebarOpen,
        editingItem,
        showItemForm,
        setFilters,
        setViewMode,
        setTimelineScale,
        toggleDarkMode,
        toggleSidebar,
        addPortfolio,
        updatePortfolio,
        deletePortfolio,
        addProduct,
        updateProduct,
        deleteProduct,
        addRoadmapItem,
        updateRoadmapItem,
        deleteRoadmapItem,
        duplicateRoadmapItem,
        setEditingItem,
        setShowItemForm,
        replaceAllData,
        resetToSeed,
        getPortfolio,
        getProduct,
        getFilteredItems,
      }}
    >
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmap(): RoadmapContextType {
  const ctx = useContext(RoadmapContext);
  if (!ctx) throw new Error('useRoadmap must be used within RoadmapProvider');
  return ctx;
}
