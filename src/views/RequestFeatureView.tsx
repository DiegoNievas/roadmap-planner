import React, { useState } from 'react';
import { useRoadmap } from '../context/RoadmapContext';
import { CheckCircle2, AlertCircle, Loader2, Send, ArrowLeft } from 'lucide-react';
import type { FeatureRequestStatus, Priority } from '../types';

export default function RequestFeatureView() {
  const { data, addFeatureRequest, setViewMode } = useRoadmap();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    portfolioId: '',
    productId: '',
    type: 'feature',
    businessJustification: '',
    expectedBenefit: '',
    priority: 'medium' as Priority,
    submitterName: '',
    submitterEmail: '',
    team: '',
    supportingLink: '',
    impact: '',
    strategicAlignment: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await addFeatureRequest({
        ...form,
        portfolioId: form.portfolioId || null,
        productId: form.productId || null,
        status: 'new' as FeatureRequestStatus
      });
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-8 rounded-3xl bg-card border text-center space-y-6 animate-in zoom-in-95 duration-500" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
        <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-3xl font-bold text-white">Request Submitted!</h2>
        <p className="text-muted" style={{ color: 'var(--text-muted)' }}>
          Thank you for your feedback. Your request has been logged and will be reviewed by the product team.
        </p>
        <div className="flex flex-col gap-3 pt-4">
          <button 
            onClick={() => setViewMode('home')}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </button>
          <button 
            onClick={() => setSubmitted(false)}
            className="w-full py-3 bg-transparent text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <button 
          onClick={() => setViewMode('home')}
          className="flex items-center gap-2 text-sm text-muted hover:text-indigo-400 transition-colors mb-4"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">Request a Feature</h1>
        <p className="text-muted" style={{ color: 'var(--text-muted)' }}>
          Suggest product enhancements, new capabilities, or operational improvements for Atturra Managed Services.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-10 rounded-3xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', boxShadow: '0 8px 30px rgba(0,0,0,0.05)' }}>
        
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Title & Type */}
          <div className="md:col-span-2 space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Request Title *</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Add Multi-cloud cost reporting to Azure Portfolio"
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.title}
              onChange={e => setForm({...form, title: e.target.value})}
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Portfolio</label>
            <select 
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm cursor-pointer"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.portfolioId}
              onChange={e => setForm({...form, portfolioId: e.target.value, productId: ''})}
            >
              <option value="">Select Portfolio (Optional)</option>
              {data.portfolios.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Product / Service</label>
            <select 
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm cursor-pointer"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.productId}
              onChange={e => setForm({...form, productId: e.target.value})}
            >
              <option value="">Select Product (Optional)</option>
              {data.products
                .filter(p => !form.portfolioId || p.portfolioId === form.portfolioId)
                .map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
            </select>
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Request Type *</label>
            <select 
              required
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm cursor-pointer"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
            >
              <option value="feature">New Feature</option>
              <option value="enhancement">Enhancement</option>
              <option value="upgrade">Upgrade</option>
              <option value="operational">Operational Improvement</option>
              <option value="issue">Issue / Bug</option>
              <option value="capability">New Capability</option>
            </select>
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Priority *</label>
            <select 
              required
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm cursor-pointer"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value as Priority})}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="md:col-span-2 space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Description *</label>
            <textarea 
              required
              rows={4}
              placeholder="Describe the requested feature or improvement in detail..."
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm resize-none"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Business Justification *</label>
            <textarea 
              required
              placeholder="Why is this needed? What problem does it solve?"
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm min-h-[120px]"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.businessJustification}
              onChange={e => setForm({...form, businessJustification: e.target.value})}
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Expected Benefit *</label>
            <textarea 
              required
              placeholder="What is the expected outcome or value for AMS?"
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm min-h-[120px]"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.expectedBenefit}
              onChange={e => setForm({...form, expectedBenefit: e.target.value})}
            />
          </div>

          {/* Submitter Info */}
          <div className="md:col-span-2 mt-4">
            <div className="h-px w-full mb-8" style={{ background: 'var(--border-color)' }} />
            <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Submitter Information</h3>
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Your Name *</label>
            <input 
              required
              type="text" 
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.submitterName}
              onChange={e => setForm({...form, submitterName: e.target.value})}
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Work Email *</label>
            <input 
              required
              type="email" 
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.submitterEmail}
              onChange={e => setForm({...form, submitterEmail: e.target.value})}
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Team / Function *</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Cloud Delivery, Sales, Product"
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.team}
              onChange={e => setForm({...form, team: e.target.value})}
            />
          </div>

          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Strategic Alignment</label>
            <select 
              className="w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm cursor-pointer"
              style={{ 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)',
              }}
              value={form.strategicAlignment}
              onChange={e => setForm({...form, strategicAlignment: e.target.value})}
            >
              <option value="">Select (Optional)</option>
              <option value="Operational Excellence">Operational Excellence</option>
              <option value="Innovation">Innovation</option>
              <option value="Cost Management">Cost Management</option>
              <option value="Revenue Acquisition">Revenue Acquisition</option>
            </select>
          </div>
        </div>

        <div className="pt-6">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transform hover:-translate-y-0.5"
          >
            {isSubmitting ? (
              <><Loader2 className="animate-spin" size={20} /> Processing...</>
            ) : (
              <><Send size={20} /> Submit Feature Request</>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
