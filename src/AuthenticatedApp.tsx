import { useAuth } from './context/AuthContext';
import { RoadmapProvider } from './context/RoadmapContext';
import App from './App';
import LoginPage from './views/LoginPage';

export default function AuthenticatedApp() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}
          />
          <span className="text-sm" style={{ color: '#94a3b8' }}>
            Loading…
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <RoadmapProvider>
      <App />
    </RoadmapProvider>
  );
}
