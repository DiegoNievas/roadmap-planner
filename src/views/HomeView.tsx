import { 
  Users, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Layers, 
  Calendar,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useRoadmap } from '../context/RoadmapContext';

export default function HomeView() {
  const { data, setViewMode } = useRoadmap();

  // Metrics
  const totalItems = data.roadmapItems.length;
  const inProgress = data.roadmapItems.filter(i => i.status === 'in-progress').length;
  const blocked = data.roadmapItems.filter(i => i.status === 'blocked').length;
  
  const next90Days = new Date();
  next90Days.setDate(next90Days.getDate() + 90);
  const upcomingMilestones = data.roadmapItems.filter(i => {
    if (!i.milestoneDate) return false;
    const d = new Date(i.milestoneDate);
    return d > new Date() && d <= next90Days;
  }).length;

  const totalRequests = data.featureRequests?.length || 0;
  const highPriorityRequests = data.featureRequests?.filter(r => r.priority === 'high' || r.priority === 'critical').length || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl p-8 md:p-12 text-white" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)' }}>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            AMS Roadmap & <br />Product Strategy
          </h1>
          <p className="text-lg text-indigo-100 mb-8 leading-relaxed">
            A single view of roadmap intent across Connect, Cloud, Security, and AI portfolios. 
            Empowering Atturra Managed Services (AMS) with visibility, alignment, and structured growth.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setViewMode('timeline')}
              className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-50 transition-colors shadow-lg cursor-pointer"
            >
              Explore Roadmap <ChevronRight size={18} />
            </button>
            <button 
              onClick={() => setViewMode('request-feature')}
              className="px-6 py-3 bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-500/30 transition-colors cursor-pointer"
            >
              Request a Feature <MessageSquare size={18} />
            </button>
          </div>
        </div>
        
        {/* Abstract background element */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Total Roadmap Items" 
          value={totalItems} 
          icon={<Layers className="text-blue-400" />} 
          color="blue"
        />
        <MetricCard 
          label="Items In Progress" 
          value={inProgress} 
          icon={<Clock className="text-amber-400" />} 
          color="amber"
          status={blocked > 0 ? `${blocked} Blocked` : undefined}
        />
        <MetricCard 
          label="Upcoming Milestones" 
          value={upcomingMilestones} 
          icon={<Calendar className="text-emerald-400" />} 
          color="emerald"
          status="Next 90 Days"
        />
        <MetricCard 
          label="Feature Requests" 
          value={totalRequests} 
          icon={<MessageSquare className="text-purple-400" />} 
          color="purple"
          status={`${highPriorityRequests} High Priority`}
        />
      </section>

      {/* Value Pillars */}
      <section className="grid md:grid-cols-3 gap-6">
        <ValuePillar 
          icon={<Users size={24} />}
          title="Visibility"
          description="Clearer view of planned capabilities, upgrades, and dependencies across all portfolios."
        />
        <ValuePillar 
          icon={<Target size={24} />}
          title="Prioritisation"
          description="Better alignment across product, architecture, and leadership for structured decision-making."
        />
        <ValuePillar 
          icon={<TrendingUp size={24} />}
          title="Continuous Improvement"
          description="A consistent way for internal teams to suggest operational enhancements and new capabilities."
        />
      </section>

      {/* Snapshot section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">Executive Roadmap Snapshot</h2>
          <button 
            onClick={() => setViewMode('dashboard')}
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            View Full Dashboard <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SnapshotList 
            title="In Progress"
            icon={<Clock size={16} className="text-amber-400" />}
            items={data.roadmapItems.filter(i => i.status === 'in-progress').slice(0, 5)}
          />
          <SnapshotList 
            title="Recently Delivered"
            icon={<CheckCircle2 size={16} className="text-emerald-400" />}
            items={data.roadmapItems.filter(i => i.status === 'delivered').slice(0, 5)}
          />
          <SnapshotList 
            title="Next Up"
            icon={<AlertCircle size={16} className="text-blue-400" />}
            items={data.roadmapItems.filter(i => i.status === 'planned').slice(0, 5)}
          />
        </div>
      </section>

    </div>
  );
}

function MetricCard({ label, value, icon, status, color }: { label: string, value: number, icon: React.ReactNode, status?: string, color: string }) {
  const colors: Record<string, string> = {
    blue: 'var(--accent)',
    amber: '#f59e0b',
    emerald: '#10b981',
    purple: '#8b5cf6'
  };

  return (
    <div 
      className="p-6 rounded-2xl border bg-card transition-all hover:scale-[1.02] duration-300"
      style={{ 
        background: 'var(--bg-card)', 
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ background: `${colors[color]}15` }}>
          {icon}
        </div>
        {status && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full" style={{ background: `${colors[color]}15`, color: colors[color] }}>
            {status}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-3xl font-bold text-white">{value}</h3>
        <p className="text-sm text-muted" style={{ color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  );
}

function ValuePillar({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl border border-dashed" style={{ borderColor: 'var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-indigo-400" style={{ background: 'var(--accent-light)' }}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
  );
}

function SnapshotList({ title, items, icon }: { title: string, icon: React.ReactNode, items: any[] }) {
  return (
    <div className="bg-card rounded-2xl border p-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
      <div className="flex items-center gap-2 mb-4 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        {icon}
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: 'var(--text-muted)' }}>No items to display</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex flex-col gap-1 group">
              <span className="text-sm font-medium text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1">{item.title}</span>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.colorTag || 'var(--accent)' }} />
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.quarterLabel}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
