import React from 'react';
import { ShieldCheck, Briefcase } from 'lucide-react';
import type { SuperInsider, InsiderHolding, ConnectedRole } from '../types';

interface InsidersTabProps {
  superInsiders: SuperInsider[];
  onSelectHolding: (ticker: string) => void;
}

export function formatCurrency(val?: number): string {
  if (!val || val === 0) return '0.0 IDR';
  if (val >= 1000.0) {
    return `Rp ${(val / 1000.0).toFixed(2)} T`;
  }
  return `Rp ${val.toFixed(1)} B`;
}

export const InsidersTab: React.FC<InsidersTabProps> = ({
  superInsiders,
  onSelectHolding,
}) => {
  const topInsiders = superInsiders.slice(0, 15);

  return (
    <div className="tab-panel active">
      {/* Description Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={22} style={{ color: 'var(--accent-green)' }} /> Super Insider Tracker (Retail Tycoons)
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '900px' }}>
          This list identifies individual high-net-worth investors (excluding corporate proxies, government agencies, and bank nominees) 
          holding significant stakes in multiple listed companies. We estimate their portfolio values based on company equity valuations.
        </p>
      </div>

      {/* Insiders Grid */}
      <div className="insiders-grid">
        {topInsiders.map((ins, idx) => {
          const holdings: InsiderHolding[] = ins.holdings || ins.portfolio || [];
          const totalVal = ins.total_value ?? (ins.total_value_idr ? ins.total_value_idr / 1000000000 : 0);
          const roles: ConnectedRole[] = ins.connected_roles || [];

          return (
            <div
              key={`${ins.name}-${idx}`}
              className="glass-card insider-card"
              style={{ cursor: holdings.length > 0 ? 'pointer' : 'default' }}
              onClick={() => {
                if (holdings.length > 0) {
                  onSelectHolding(holdings[0].code);
                }
              }}
            >
              <div className="insider-card-header">
                <div>
                  <h3>{ins.name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <Briefcase size={12} /> Board Seats: {roles.length}
                  </span>
                </div>
                <span className="insider-value">{formatCurrency(totalVal)}</span>
              </div>

              <div className="insider-holdings-list">
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                  Stakes Owned
                </h4>
                {holdings.map((h: InsiderHolding, hIdx: number) => {
                  const hVal = h.value ?? (h.value_idr ? h.value_idr / 1000000000 : 0);
                  return (
                    <div key={`${h.code}-${hIdx}`} className="insider-holding-item">
                      <span>
                        <span className="ticker-badge" style={{ fontSize: '0.75rem', padding: '0.1rem 0.3rem', marginRight: '0.35rem' }}>
                          {h.code}
                        </span>
                        stake
                      </span>
                      <span className="numeric" style={{ fontWeight: 600 }}>
                        {h.percentage.toFixed(2)}% ({formatCurrency(hVal)})
                      </span>
                    </div>
                  );
                })}
              </div>

              {roles.length > 0 && (
                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {roles.map((r: ConnectedRole, rIdx: number) => (
                    <span
                      key={`${r.code}-${rIdx}`}
                      className="sub-role"
                      style={{
                        fontSize: '0.7rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        color: 'var(--accent-green)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      {r.code}: {r.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
