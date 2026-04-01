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
  Inbox
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';
import type { ViewMode } from '../types';
import { cn } from '../lib/utils';

const GENERAL_ITEMS: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home size={18} /> },
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
];

const ROADMAP_ITEMS: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'timeline', label: 'Timeline', icon: <CalendarRange size={18} /> },
  { id: 'swimlane-portfolio', label: 'By Portfolio', icon: <Layers size={18} /> },
  { id: 'swimlane-product', label: 'By Product', icon: <Columns3 size={18} /> },
  { id: 'kanban', label: 'Kanban', icon: <FolderKanban size={18} /> },
  { id: 'table', label: 'Table', icon: <Table2 size={18} /> },
  { id: 'milestones', label: 'Milestones', icon: <Flag size={18} /> },
];

const FEEDBACK_ITEMS: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'request-feature', label: 'Request a Feature', icon: <MessageSquarePlus size={18} /> },
  { id: 'feature-requests', label: 'Feature Requests', icon: <Inbox size={18} /> },
];

export default function Sidebar() {
  const { viewMode, setViewMode, sidebarOpen, toggleSidebar } = useRoadmap();

  const renderNavGroup = (items: typeof GENERAL_ITEMS, label: string) => (
    <div className="mb-4">
      <div className="mb-2 px-3">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      </div>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setViewMode(item.id)}
          className={cn(
            'flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] font-medium mb-0.5 transition-all cursor-pointer',
          )}
          style={{
            background: viewMode === item.id ? 'var(--accent-light)' : 'transparent',
            color: viewMode === item.id ? 'var(--accent)' : 'var(--text-secondary)',
          }}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {/* Toggle button when closed */}
      {!sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 p-2 rounded-lg cursor-pointer"
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
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <path d="M8 12h16M8 17h12M8 22h8" stroke="white" strokeWidth="3" strokeLinecap="round" />
                <circle cx="24" cy="22" r="3" fill="white" opacity="0.7" />
              </svg>
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
              Roadmap Planner
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          {renderNavGroup(GENERAL_ITEMS, 'General')}
          {renderNavGroup(ROADMAP_ITEMS, 'Roadmap Views')}
          {renderNavGroup(FEEDBACK_ITEMS, 'Feedback')}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            v1.0 · Powered by React
          </span>
        </div>
      </aside>
    </>
  );
}
