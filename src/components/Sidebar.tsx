import { 
  LayoutDashboard, 
  CalendarRange, 
  Columns3, 
  Table2, 
  Flag, 
  Layers, 
  PanelLeftClose, 
  PanelLeft, 
  FolderKanban,
  Home,
  MessageSquarePlus,
  Inbox,
  Shield
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import { useAuth } from '../context/AuthContext';
import type { ViewMode } from '../types';
import { cn } from '../lib/utils';

const GENERAL_ITEMS: { id: ViewMode; label: string; icon: React.ReactNode; public?: boolean }[] = [
  { id: 'home', label: 'Home', icon: <Home size={18} />, public: true },
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
];

const ROADMAP_ITEMS: { id: ViewMode; label: string; icon: React.ReactNode; public?: boolean }[] = [
  { id: 'timeline', label: 'Timeline', icon: <CalendarRange size={18} /> },
  { id: 'swimlane-portfolio', label: 'By Portfolio', icon: <Layers size={18} /> },
  { id: 'swimlane-product', label: 'By Product', icon: <Columns3 size={18} /> },
  { id: 'kanban', label: 'Kanban', icon: <FolderKanban size={18} /> },
  { id: 'table', label: 'Table', icon: <Table2 size={18} /> },
  { id: 'milestones', label: 'Milestones', icon: <Flag size={18} /> },
];

const FEEDBACK_ITEMS: { id: ViewMode; label: string; icon: React.ReactNode; public?: boolean }[] = [
  { id: 'request-feature', label: 'Request a Feature', icon: <MessageSquarePlus size={18} />, public: true },
  { id: 'feature-requests', label: 'Feature Requests', icon: <Inbox size={18} /> },
];

export default function Sidebar() {
  const { viewMode, setViewMode, sidebarOpen, toggleSidebar } = useRoadmap();
  const { user, isEditor } = useAuth();

  const renderNavGroup = (items: typeof GENERAL_ITEMS, label: string) => (
    <div className="mb-4">
      <div className="mb-2 px-3 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      </div>
      {items.map((item) => {
        // For views that are purely management, we hide them completely
        if (item.id === 'user-management' && !isEditor) return null;

        return (
          <button
            key={item.id}
            onClick={() => setViewMode(item.id)}
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 rounded-lg text-[13px] font-medium mb-0.5 transition-all cursor-pointer group',
              viewMode === item.id && 'shadow-sm'
            )}
            style={{
              background: viewMode === item.id ? 'var(--accent-light)' : 'transparent',
              color: viewMode === item.id ? 'var(--accent)' : 'var(--text-secondary)',
            }}
          >
            <div className="flex items-center gap-2.5">
              {item.icon}
              {item.label}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Toggle button when closed */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg cursor-pointer shadow-sm"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
        >
          <PanelLeft size={18} />
        </button>
      )}

      <aside
        className={cn(
          'fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-200',
          !sidebarOpen && '-translate-x-full'
        )}
        style={{
          width: 240,
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-color)',
        }}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20" style={{ background: 'var(--accent)' }}>
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <path d="M8 12h16M8 17h12M8 22h8" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <circle cx="24" cy="22" r="3" fill="white" opacity="0.7" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Roadmap Planner
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md cursor-pointer hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-3 mb-4">
          <div className="p-3 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/30">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <div className="text-[11px] font-bold text-white truncate">{user?.email}</div>
                <div className="flex items-center gap-1 mt-0.5">
                  <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isEditor ? "bg-emerald-500" : "bg-amber-500")} />
                  <div className="text-[9px] uppercase font-bold tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    {isEditor ? 'Product Manager' : 'Executive'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto custom-scrollbar">
          {renderNavGroup(GENERAL_ITEMS, 'General')}
          {renderNavGroup(ROADMAP_ITEMS, 'Roadmap Views')}
          {renderNavGroup(FEEDBACK_ITEMS, 'Feedback')}
          {isEditor && (
            <div className="mt-4">
              {renderNavGroup([{ id: 'user-management', label: 'Manage Access', icon: <Shield size={18} /> }], 'Administration')}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Atturra MS
            </span>
            <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              v2.0 · Roadmap v1
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
