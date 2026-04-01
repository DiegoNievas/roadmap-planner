import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSignUpSuccess(true);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '1rem',
      }}
    >
      {/* Subtle grid pattern overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.08) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow:
            '0 0 60px rgba(99, 102, 241, 0.1), 0 25px 50px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              marginBottom: '1rem',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
            }}
          >
            <LayoutDashboard size={28} color="#fff" />
          </div>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#f1f5f9',
              margin: '0 0 0.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            Roadmap Planner
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#94a3b8',
              margin: 0,
            }}
          >
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        {/* Success message for sign up */}
        {signUpSuccess && (
          <div
            style={{
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.25)',
              color: '#4ade80',
              fontSize: '0.8125rem',
              marginBottom: '1.5rem',
              lineHeight: 1.5,
            }}
          >
            ✓ Account created! Check your email to confirm, then sign in.
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 1rem',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              fontSize: '0.8125rem',
              marginBottom: '1.5rem',
            }}
          >
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#cbd5e1',
                marginBottom: '0.375rem',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                background: 'rgba(30, 41, 59, 0.6)',
                color: '#f1f5f9',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: '#cbd5e1',
                marginBottom: '0.375rem',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                background: 'rgba(30, 41, 59, 0.6)',
                color: '#f1f5f9',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#6366f1';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              border: 'none',
              background: loading
                ? 'rgba(99, 102, 241, 0.5)'
                : 'linear-gradient(135deg, #6366f1, #7c3aed)',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'opacity 0.2s, transform 0.1s',
              boxShadow: '0 4px 16px rgba(99, 102, 241, 0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isSignUp ? (
              <UserPlus size={18} />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? 'Please wait…' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.8125rem',
            color: '#94a3b8',
          }}
        >
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSignUpSuccess(false);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#818cf8',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8125rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#a5b4fc')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#818cf8')}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
}
