import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { AppData, Portfolio, Product, RoadmapItem, Filters, ViewMode, TimelineScale } from '../types';
import { DEFAULT_FILTERS } from '../types';
import {
  loadAppData,
  addPortfolioDb,
  updatePortfolioDb,
  deletePortfolioDb,
  addProductDb,
  updateProductDb,
  deleteProductDb,
  addRoadmapItemDb,
  updateRoadmapItemDb,
  deleteRoadmapItemDb,
  replaceAllDataDb,
} from '../services/storage';

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

function now(): string {
  return new Date().toISOString();
}

export function RoadmapProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>({ portfolios: [], products: [], roadmapItems: [], version: '2.0.0' });
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

  // Load from Supabase on mount
  useEffect(() => {
    loadAppData()
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load data from Supabase:', err);
        setLoading(false);
      });
  }, []);

  // Dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('roadmap-dark-mode', String(darkMode));
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode((p) => !p), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);

  // ── Portfolio CRUD (optimistic + Supabase) ──
  const addPortfolio = useCallback(
    async (p: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const created = await addPortfolioDb(p);
        setData((prev) => ({
          ...prev,
          portfolios: [...prev.portfolios, created],
        }));
      } catch (err) {
        console.error('Failed to add portfolio:', err);
      }
    },
    []
  );

  const updatePortfolio = useCallback(
    async (p: Portfolio) => {
      // Optimistic update
      setData((prev) => ({
        ...prev,
        portfolios: prev.portfolios.map((x) => (x.id === p.id ? { ...p, updatedAt: now() } : x)),
      }));
      try {
        await updatePortfolioDb(p);
      } catch (err) {
        console.error('Failed to update portfolio:', err);
        // Reload on error
        loadAppData().then(setData);
      }
    },
    []
  );

  const deletePortfolio = useCallback(
    async (id: string) => {
      setData((prev) => ({
        ...prev,
        portfolios: prev.portfolios.filter((x) => x.id !== id),
        products: prev.products.filter((x) => x.portfolioId !== id),
        roadmapItems: prev.roadmapItems.filter((x) => x.portfolioId !== id),
      }));
      try {
        await deletePortfolioDb(id);
      } catch (err) {
        console.error('Failed to delete portfolio:', err);
        loadAppData().then(setData);
      }
    },
    []
  );

  // ── Product CRUD ──
  const addProduct = useCallback(
    async (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const created = await addProductDb(p);
        setData((prev) => ({
          ...prev,
          products: [...prev.products, created],
        }));
      } catch (err) {
        console.error('Failed to add product:', err);
      }
    },
    []
  );

  const updateProduct = useCallback(
    async (p: Product) => {
      setData((prev) => ({
        ...prev,
        products: prev.products.map((x) => (x.id === p.id ? { ...p, updatedAt: now() } : x)),
      }));
      try {
        await updateProductDb(p);
      } catch (err) {
        console.error('Failed to update product:', err);
        loadAppData().then(setData);
      }
    },
    []
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      setData((prev) => ({
        ...prev,
        products: prev.products.filter((x) => x.id !== id),
        roadmapItems: prev.roadmapItems.filter((x) => x.productId !== id),
      }));
      try {
        await deleteProductDb(id);
      } catch (err) {
        console.error('Failed to delete product:', err);
        loadAppData().then(setData);
      }
    },
    []
  );

  // ── RoadmapItem CRUD ──
  const addRoadmapItem = useCallback(
    async (item: Omit<RoadmapItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const created = await addRoadmapItemDb(item);
        setData((prev) => ({
          ...prev,
          roadmapItems: [...prev.roadmapItems, created],
        }));
      } catch (err) {
        console.error('Failed to add roadmap item:', err);
      }
    },
    []
  );

  const updateRoadmapItem = useCallback(
    async (item: RoadmapItem) => {
      setData((prev) => ({
        ...prev,
        roadmapItems: prev.roadmapItems.map((x) => (x.id === item.id ? { ...item, updatedAt: now() } : x)),
      }));
      try {
        await updateRoadmapItemDb(item);
      } catch (err) {
        console.error('Failed to update roadmap item:', err);
        loadAppData().then(setData);
      }
    },
    []
  );

  const deleteRoadmapItem = useCallback(
    async (id: string) => {
      setData((prev) => ({
        ...prev,
        roadmapItems: prev.roadmapItems
          .filter((x) => x.id !== id)
          .map((x) => ({
            ...x,
            dependencies: x.dependencies.filter((d) => d !== id),
          })),
      }));
      try {
        await deleteRoadmapItemDb(id);
      } catch (err) {
        console.error('Failed to delete roadmap item:', err);
        loadAppData().then(setData);
      }
    },
    []
  );

  const duplicateRoadmapItem = useCallback(
    async (id: string) => {
      const original = data.roadmapItems.find((x) => x.id === id);
      if (!original) return;
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = original;
      try {
        const created = await addRoadmapItemDb({
          ...rest,
          title: `${rest.title} (copy)`,
          status: 'idea',
        });
        setData((prev) => ({
          ...prev,
          roadmapItems: [...prev.roadmapItems, created],
        }));
      } catch (err) {
        console.error('Failed to duplicate roadmap item:', err);
      }
    },
    [data.roadmapItems]
  );

  // ── Data management ──
  const replaceAllData = useCallback(async (newData: AppData) => {
    try {
      await replaceAllDataDb(newData);
      setData(newData);
    } catch (err) {
      console.error('Failed to replace all data:', err);
    }
  }, []);

  const resetToSeed = useCallback(async () => {
    try {
      const { seedData } = await import('../data/seed');
      await replaceAllDataDb(seedData);
      setData(seedData);
    } catch (err) {
      console.error('Failed to reset to seed:', err);
    }
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
