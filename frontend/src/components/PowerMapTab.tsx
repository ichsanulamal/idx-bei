import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Users, 
  Network, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Loader2, 
  GitFork, 
  Crown, 
  Building, 
  Link2 
} from 'lucide-react';
import type { Company, SuperInsider, Conglomerate } from '../types';
import { NetworkGraph } from './NetworkGraph';
import { fetchGraphNetwork, fetchCentrality, fetchCrossHoldings } from '../services/api';

interface PowerMapTabProps {
  companies: Company[];
  superInsiders: SuperInsider[];
  conglomerates: Conglomerate[];
  onSelectCompany: (ticker: string) => void;
}

export const PowerMapTab: React.FC<PowerMapTabProps> = ({
  companies,
  superInsiders,
  conglomerates,
  onSelectCompany,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'tycoons' | 'conglomerates' | 'graph'>('tycoons');
  const [selectedInsider, setSelectedInsider] = useState<SuperInsider | null>(superInsiders[0] || null);
  const [graphTicker, setGraphTicker] = useState<string>('BBCA');
  const [tickerInput, setTickerInput] = useState<string>('');

  const [networkData, setNetworkData] = useState<any>(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState<boolean>(false);
  const [powerbrokers, setPowerbrokers] = useState<any[]>([]);
  const [crossHoldings, setCrossHoldings] = useState<any[]>([]);

  const networkCacheRef = useRef<Map<string, any>>(new Map());

  const graphCompany = companies.find((c) => c.code.toUpperCase() === graphTicker.toUpperCase()) || companies[0] || null;

  // Load live graph network with instant in-memory cache
  useEffect(() => {
    let isMounted = true;
    async function loadNetwork() {
      // Instant cache hit: zero network request, zero spinner
      if (networkCacheRef.current.has(graphTicker)) {
        setNetworkData(networkCacheRef.current.get(graphTicker));
        return;
      }

      setIsLoadingGraph(true);
      try {
        const data = await fetchGraphNetwork(graphTicker);
        if (isMounted) {
          networkCacheRef.current.set(graphTicker, data);
          setNetworkData(data);
        }
      } catch {
        if (isMounted) {
          setNetworkData(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingGraph(false);
        }
      }
    }
    loadNetwork();
    return () => {
      isMounted = false;
    };
  }, [graphTicker]);

  // Load board centrality and cross-holdings once on mount
  useEffect(() => {
    let isMounted = true;
    async function loadAuxData() {
      try {
        const [centRes, crossRes] = await Promise.allSettled([
          fetchCentrality(15),
          fetchCrossHoldings(),
        ]);
        if (isMounted) {
          if (centRes.status === 'fulfilled') setPowerbrokers(centRes.value);
          if (crossRes.status === 'fulfilled') setCrossHoldings(crossRes.value);
        }
      } catch {
        // Silently preserve fallbacks
      }
    }
    loadAuxData();
    return () => {
      isMounted = false;
    };
  }, []);

  const [insiderSearch, setInsiderSearch] = useState<string>('');
  const [minWealthFilter, setMinWealthFilter] = useState<'all' | '1t' | '10t' | '50t'>('all');

  const handleSearchTicker = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tickerInput.trim().toUpperCase();
    if (clean) {
      setGraphTicker(clean);
      setTickerInput('');
      setActiveSubTab('graph');
    }
  };

  const filteredInsiders = superInsiders
    .filter((insider) => {
      const holdings = insider.holdings || insider.portfolio || [];
      const query = insiderSearch.toLowerCase().trim();
      if (query) {
        const nameMatch = (insider.clean_name || insider.name).toLowerCase().includes(query);
        const tickerMatch = holdings.some((h) => h.code.toLowerCase().includes(query));
        if (!nameMatch && !tickerMatch) return false;
      }

      const totalValTrillion = insider.total_value_idr
        ? insider.total_value_idr / 1e12
        : insider.total_value
        ? insider.total_value / 1e3
        : 0;

      if (minWealthFilter === '1t' && totalValTrillion < 1) return false;
      if (minWealthFilter === '10t' && totalValTrillion < 10) return false;
      if (minWealthFilter === '50t' && totalValTrillion < 50) return false;

      return true;
    })
    .sort((a, b) => {
      const valA = a.total_value_idr ? a.total_value_idr / 1e12 : (a.total_value ? a.total_value / 1e3 : 0);
      const valB = b.total_value_idr ? b.total_value_idr / 1e12 : (b.total_value ? b.total_value / 1e3 : 0);
      return valB - valA;
    });

  return (
    <div className="power-map-tab" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Sub-Navigation */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <Network size={28} style={{ color: '#c084fc' }} />
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>Tycoons & Conglomerate Power Map</h2>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            Track billionaire tycoon ownership, conglomerate asset clusters, and corporate board cross-holding networks.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'tycoons', label: 'Tycoon Portfolios', icon: Users },
            { id: 'conglomerates', label: 'Conglomerate Groups', icon: Building2 },
            { id: 'graph', label: 'UBO Relationship Graph', icon: Network },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #c084fc' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: isActive ? 'rgba(192, 132, 252, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#c084fc' : '#9ca3af',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Tycoon Portfolios Sub-View */}
      {activeSubTab === 'tycoons' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem' }}>
          {/* Tycoons List & Search */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: '750px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                Tycoons & Insiders ({filteredInsiders.length})
              </h3>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {(['all', '1t', '10t'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setMinWealthFilter(lvl)}
                    style={{
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: minWealthFilter === lvl ? '1px solid #c084fc' : '1px solid rgba(255,255,255,0.08)',
                      background: minWealthFilter === lvl ? 'rgba(192, 132, 252, 0.2)' : 'transparent',
                      color: minWealthFilter === lvl ? '#c084fc' : '#94a3b8',
                    }}
                  >
                    {lvl === 'all' ? 'All' : `>Rp ${lvl.toUpperCase()}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Tycoon search box */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="text"
                value={insiderSearch}
                onChange={(e) => setInsiderSearch(e.target.value)}
                placeholder="Search tycoon or ticker (e.g. Salim, Prajogo, BYAN)..."
                style={{
                  width: '100%',
                  padding: '0.45rem 0.6rem 0.45rem 2rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(0, 0, 0, 0.25)',
                  color: '#f8fafc',
                  fontSize: '0.8rem',
                }}
              />
            </div>

            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingRight: '0.2rem' }}>
              {filteredInsiders.map((insider) => {
                const isSelected = selectedInsider?.name === insider.name;
                const holdings = insider.holdings || insider.portfolio || [];
                const holdingsCount = holdings.length;
                const totalValTrillion = insider.total_value_idr
                  ? insider.total_value_idr / 1e12
                  : insider.total_value
                  ? insider.total_value / 1e3
                  : 0;

                return (
                  <div
                    key={insider.name}
                    onClick={() => setSelectedInsider(insider)}
                    style={{
                      background: isSelected ? 'rgba(192, 132, 252, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isSelected ? 'rgba(192, 132, 252, 0.4)' : 'rgba(255, 255, 255, 0.05)'}`,
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    className="table-row-hover"
                  >
                    <div style={{ fontWeight: 700, color: isSelected ? '#c084fc' : '#f8fafc', fontSize: '0.95rem' }}>
                      {insider.clean_name || insider.name}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>
                      <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                        <span style={{
                          padding: '0.1rem 0.35rem',
                          borderRadius: '4px',
                          background: holdingsCount > 1 ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                          color: holdingsCount > 1 ? '#38bdf8' : '#94a3b8',
                          fontWeight: 700,
                        }}>
                          {holdingsCount} {holdingsCount === 1 ? 'Holding' : 'Holdings'}
                        </span>
                        <span style={{ color: '#64748b' }}>
                          ({holdings.map((h) => h.code).slice(0, 3).join(', ')}{holdings.length > 3 ? '...' : ''})
                        </span>
                      </div>
                      {totalValTrillion > 0 && (
                        <span style={{ color: '#34d399', fontWeight: 700 }}>
                          Rp {totalValTrillion >= 1 ? `${totalValTrillion.toFixed(2)}T` : `${(totalValTrillion * 1e3).toFixed(0)}B`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Tycoon Deep Dive */}
          {selectedInsider && (() => {
            const holdings = selectedInsider.holdings || selectedInsider.portfolio || [];
            const totalValTrillion = selectedInsider.total_value_idr
              ? selectedInsider.total_value_idr / 1e12
              : selectedInsider.total_value
              ? selectedInsider.total_value / 1e3
              : 0;

            return (
              <div style={{
                background: 'rgba(15, 23, 42, 0.55)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#c084fc', fontWeight: 700 }}>
                      Tycoon Portfolio Inspection
                    </span>
                    <h2 style={{ margin: '0.2rem 0 0', fontSize: '1.5rem', fontWeight: 800 }}>
                      {selectedInsider.clean_name || selectedInsider.name}
                    </h2>
                    {selectedInsider.connected_roles && selectedInsider.connected_roles.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {selectedInsider.connected_roles.map((r, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              background: 'rgba(56, 189, 248, 0.15)',
                              color: '#38bdf8',
                              fontWeight: 600,
                            }}
                          >
                            {r.title || r.role} @ {r.code}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {totalValTrillion > 0 && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Disclosed IDX Market Value</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>
                        Rp {totalValTrillion >= 1 ? `${totalValTrillion.toFixed(2)} Trillion` : `${(totalValTrillion * 1e3).toFixed(1)} Billion`}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                    Disclosed Stakes & Positions ({holdings.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {holdings.map((h) => {
                      const hValTrillion = h.value_idr
                        ? h.value_idr / 1e12
                        : h.value
                        ? h.value / 1e3
                        : 0;

                      return (
                        <div
                          key={h.code}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '10px',
                            padding: '0.85rem 1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '0.75rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '1.15rem', color: '#f8fafc' }}>{h.code}</strong>
                            <span style={{
                              padding: '0.2rem 0.5rem',
                              borderRadius: '6px',
                              background: 'rgba(192, 132, 252, 0.15)',
                              color: '#c084fc',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}>
                              {h.percentage.toFixed(2)}% Stake
                            </span>
                            {h.is_controller && (
                              <span style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '6px',
                                background: 'rgba(245, 158, 11, 0.15)',
                                color: '#fbbf24',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}>
                                Controlling Owner
                              </span>
                            )}
                            {hValTrillion > 0 && (
                              <span style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
                                Rp {hValTrillion >= 1 ? `${hValTrillion.toFixed(2)}T` : `${(hValTrillion * 1e3).toFixed(0)}B`}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => {
                                setGraphTicker(h.code);
                                setActiveSubTab('graph');
                              }}
                              style={{
                                background: 'rgba(192, 132, 252, 0.15)',
                                border: '1px solid rgba(192, 132, 252, 0.3)',
                                color: '#c084fc',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}
                            >
                              UBO Graph
                            </button>
                            <button
                              onClick={() => onSelectCompany(h.code)}
                              style={{
                                background: 'rgba(56, 189, 248, 0.15)',
                                border: '1px solid rgba(56, 189, 248, 0.3)',
                                color: '#38bdf8',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                              }}
                            >
                              <span>Terminal</span>
                              <ArrowRight size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Neo4j Board Centrality Powerbrokers Section */}
                {powerbrokers.length > 0 && (
                  <div style={{ marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                      <ShieldCheck size={18} style={{ color: '#38bdf8' }} />
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                        Exchange Powerbrokers (Top Board Centrality)
                      </h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.6rem' }}>
                      {powerbrokers.slice(0, 6).map((p, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            borderRadius: '8px',
                            padding: '0.75rem',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f1f5f9' }}>{p.insider}</span>
                            <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                              {p.board_seats} Seats
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.4rem' }}>
                            {(p.companies || []).map((ticker: string) => (
                              <span
                                key={ticker}
                                onClick={() => {
                                  setGraphTicker(ticker);
                                  setActiveSubTab('graph');
                                }}
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '0.15rem 0.4rem',
                                  borderRadius: '4px',
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  color: '#c084fc',
                                  cursor: 'pointer',
                                  fontWeight: 700,
                                }}
                              >
                                {ticker}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* 2. Conglomerate Groups Sub-View */}
      {activeSubTab === 'conglomerates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {conglomerates.map((group) => {
              const groupName = group.name || 'Conglomerate Group';
              return (
                <div
                  key={groupName}
                  style={{
                    background: 'rgba(15, 23, 42, 0.55)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                        {groupName}
                      </h3>
                      <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 700 }}>
                        {group.dominant_sector || 'Diversified'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', margin: '0.75rem 0 1rem' }}>
                      <div>Median ROE: <strong style={{ color: '#10b981' }}>{group.median_roe || group.average_roe || 18}%</strong></div>
                      <div>Avg PBV: <strong>{group.average_pbv || 2.4}x</strong></div>
                    </div>

                    <h5 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>Listed Entities</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {(group.companies || []).map((ticker) => (
                        <span
                          key={ticker}
                          onClick={() => {
                            setGraphTicker(ticker);
                            setActiveSubTab('graph');
                          }}
                          style={{
                            padding: '0.3rem 0.6rem',
                            borderRadius: '6px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#f8fafc',
                            cursor: 'pointer',
                          }}
                          className="table-row-hover"
                        >
                          {ticker}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cross-Holdings & Common Controlling Chains */}
          {crossHoldings.length > 0 && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.55)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.5rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <GitFork size={20} style={{ color: '#f59e0b' }} />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                  Cross-Holding & Common Control Chains (Neo4j Graph)
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '0.85rem' }}>
                {crossHoldings.slice(0, 6).map((c, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: '10px',
                      padding: '1rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fcd34d', marginBottom: '0.35rem' }}>
                      {c.controller}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      {c.note}
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {(c.companies || []).map((t: string) => (
                        <span
                          key={t}
                          onClick={() => {
                            setGraphTicker(t);
                            setActiveSubTab('graph');
                          }}
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: 'rgba(192, 132, 252, 0.15)',
                            color: '#c084fc',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. UBO Relationship Graph Sub-View */}
      {activeSubTab === 'graph' && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.55)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Multi-Hop Ultimate Beneficial Ownership (UBO) Graph
                {isLoadingGraph && <Loader2 size={16} className="animate-spin" style={{ color: '#38bdf8' }} />}
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
                Interactive entity graph powered by Neo4j: controlling shareholders, board directors, subsidiaries, and shared board interlocks.
              </p>
            </div>

            {/* Interactive Search & Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <form onSubmit={handleSearchTicker} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  <input
                    type="text"
                    value={tickerInput}
                    onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                    placeholder="Search any ticker..."
                    maxLength={6}
                    style={{
                      padding: '0.4rem 0.6rem 0.4rem 2rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      color: '#f8fafc',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      width: '140px',
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '8px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Load
                </button>
              </form>

              <select
                value={graphTicker}
                onChange={(e) => setGraphTicker(e.target.value.toUpperCase())}
                className="filter-select"
                style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', fontWeight: 700 }}
              >
                {['BBCA', 'BBRI', 'ASII', 'TLKM', 'BMRI', 'BBNI', 'ADRO', 'GOTO', 'BRPT', 'ICBP', 'AMMN'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Ticker Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700 }}>Popular:</span>
            {['BBCA', 'BBRI', 'ASII', 'TLKM', 'BMRI', 'ADRO', 'GOTO', 'BRPT', 'ICBP', 'AMMN'].map((t) => (
              <button
                key={t}
                onClick={() => setGraphTicker(t)}
                style={{
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px',
                  background: graphTicker === t ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  border: graphTicker === t ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: graphTicker === t ? '#38bdf8' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Entity Summary Stats Bar */}
          {networkData?.summary && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}>
              {networkData.summary.controlling_owner && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fcd34d',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}>
                  <Crown size={14} style={{ color: '#f59e0b' }} />
                  <span>UBO: <strong>{networkData.summary.controlling_owner}</strong></span>
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                color: '#34d399',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}>
                <Users size={13} />
                <span>{networkData.summary.director_count || 0} Directors</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                background: 'rgba(20, 184, 166, 0.12)',
                border: '1px solid rgba(20, 184, 166, 0.25)',
                color: '#2dd4bf',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}>
                <ShieldCheck size={13} />
                <span>{networkData.summary.commissioner_count || 0} Commissioners</span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.35rem 0.65rem',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: '#fda4af',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}>
                <Building size={13} />
                <span>{networkData.summary.subsidiary_count || 0} Subsidiaries</span>
              </div>

              {Boolean(networkData.summary.interlock_count) && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  color: '#38bdf8',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}>
                  <Link2 size={13} />
                  <span>{networkData.summary.interlock_count} Board Interlocks</span>
                </div>
              )}
            </div>
          )}

          {/* Graph Visualization Container */}
          <div style={{ minHeight: '520px', position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <NetworkGraph
              company={graphCompany}
              networkData={networkData}
              onSelectCompany={(ticker) => setGraphTicker(ticker)}
              height="520px"
            />
          </div>
        </div>
      )}
    </div>
  );
};
