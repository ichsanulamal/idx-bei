import React from 'react';
import { Network, Boxes } from 'lucide-react';
import type { Conglomerate } from '../types';
import { formatCurrency } from './InsidersTab';

interface ConglomeratesTabProps {
  conglomerates: Conglomerate[];
  onSelectCompany: (ticker: string) => void;
}

export const ConglomeratesTab: React.FC<ConglomeratesTabProps> = ({
  conglomerates,
  onSelectCompany,
}) => {
  return (
    <div className="tab-panel active">
      {/* Description Banner */}
      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Network size={22} style={{ color: 'var(--accent-purple)' }} /> Corporate Conglomerates & Ownership Clusters
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '900px' }}>
          Conglomerates represent networks of multiple public companies sharing a single ultimate controlling corporate shareholder. 
          We measure the aggregate financial strength of the group by taking assets and median profitability.
        </p>
      </div>

      {/* Conglomerates Grid */}
      <div className="conglom-grid">
        {conglomerates.map((con, idx) => {
          const name = con.controller_name || con.name || 'Conglomerate Group';
          const totalAssets = con.total_assets || con.total_market_cap || 0;
          const avgRoe = con.average_roe ?? con.median_roe ?? 0;
          const avgPbv = con.average_pbv ?? 0;

          return (
            <div key={`${name}-${idx}`} className="glass-card conglom-card">
              <div className="conglom-header">
                <div>
                  <h3>{name}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <Boxes size={12} /> Companies: {con.companies?.length || 0}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Group Assets</span>
                  <span className="numeric" style={{ fontWeight: 700 }}>
                    {formatCurrency(totalAssets)}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Average Profitability (ROE)</span>
                  <span
                    className={`numeric ${avgRoe >= 15 ? 'positive' : ''}`}
                    style={{ fontWeight: 700 }}
                  >
                    {avgRoe.toFixed(1)}%
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Average Price / Book</span>
                  <span className="numeric" style={{ fontWeight: 700 }}>
                    {avgPbv.toFixed(2)}x
                  </span>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    Group Tickers
                  </h4>
                  <div className="conglom-badges" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {(con.companies || []).map((code: string) => (
                      <span
                        key={code}
                        className="ticker-badge"
                        style={{ fontSize: '0.75rem', padding: '0.15rem 0.35rem', cursor: 'pointer' }}
                        onClick={() => onSelectCompany(code)}
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
