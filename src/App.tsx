import { useRoadmap } from './context/RoadmapContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import TimelineView from './views/TimelineView';
import KanbanView from './views/KanbanView';
import TableView from './views/TableView';
import SwimlaneProdView from './views/SwimlaneProdView';
import SwimlanePortView from './views/SwimlanePortView';
import MilestonesView from './views/MilestonesView';
import HomeView from './views/HomeView';
import RequestFeatureView from './views/RequestFeatureView';
import FeatureRequestsView from './views/FeatureRequestsView';
import ItemFormModal from './components/ItemFormModal';
import FilterBar from './components/FilterBar';

export default function App() {
  const { viewMode, loading, showItemForm, sidebarOpen } = useRoadmap();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading roadmap…</span>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (viewMode) {
      case 'home': return <HomeView />;
      case 'dashboard': return <Dashboard />;
      case 'timeline': return <TimelineView />;
      case 'kanban': return <KanbanView />;
      case 'table': return <TableView />;
      case 'swimlane-product': return <SwimlaneProdView />;
      case 'swimlane-portfolio': return <SwimlanePortView />;
      case 'milestones': return <MilestonesView />;
      case 'request-feature': return <RequestFeatureView />;
      case 'feature-requests': return <FeatureRequestsView />;
      default: return <HomeView />;
    }
  };

  const showFilterBar = [
    'timeline', 
    'kanban', 
    'table', 
    'swimlane-product', 
    'swimlane-portfolio', 
    'milestones'
  ].includes(viewMode);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden" style={{ marginLeft: sidebarOpen ? '240px' : '0' , transition: 'margin-left 0.2s ease' }}>
        <Header />
        {showFilterBar && <FilterBar />}
        <main className="flex-1 overflow-auto p-6">
          {renderView()}
        </main>
      </div>
      {showItemForm && <ItemFormModal />}
    </div>
  );
}
