import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  GitFork, 
  Share2, 
  X, 
  ExternalLink
} from 'lucide-react';
import type { Company, BoardMember, Shareholder, Subsidiary } from '../types';

interface NetworkGraphProps {
  company?: Company | null;
  networkData?: {
    ticker?: string;
    nodes: any[];
    edges: any[];
    summary?: any;
  } | null;
  onSelectCompany?: (ticker: string) => void;
  height?: string;
}

interface SelectedEntity {
  id: string;
  label: string;
  group: string;
  subTitle?: string;
  details?: string;
  ticker?: string;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  company,
  networkData,
  onSelectCompany,
  height = '520px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  const [layoutMode, setLayoutMode] = useState<'hierarchical' | 'physics'>('hierarchical');
  const [isPhysicsActive, setIsPhysicsActive] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);

  // Initialize and build the Vis.js network graph
  useEffect(() => {
    if (!containerRef.current) return;

    const nodes = new DataSet<any>();
    const edges = new DataSet<any>();

    if (networkData && networkData.nodes && networkData.nodes.length > 0) {
      // Format backend nodes with rich styling and level hierarchy
      const formattedNodes = networkData.nodes.map((n) => {
        const isController = n.group === 'controlling_owner';
        const isCenter = n.group === 'center_company';

        return {
          ...n,
          shape: 'box',
          shapeProperties: { borderRadius: isController ? 10 : 8 },
          margin: isCenter ? 12 : 8,
          shadow: {
            enabled: true,
            color: isController ? 'rgba(245, 158, 11, 0.35)' : isCenter ? 'rgba(56, 189, 248, 0.4)' : 'rgba(0, 0, 0, 0.5)',
            size: isCenter || isController ? 12 : 6,
            x: 0,
            y: 3,
          },
          borderWidth: isCenter || isController ? 2 : 1,
        };
      });

      const formattedEdges = networkData.edges.map((e) => ({
        ...e,
        smooth: layoutMode === 'hierarchical'
          ? { type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.35 }
          : { type: 'continuous', roundness: 0.4 },
        font: {
          ...e.font,
          align: 'horizontal',
          strokeWidth: 0,
          background: 'rgba(15, 23, 42, 0.85)',
        },
      }));

      nodes.add(formattedNodes);
      edges.add(formattedEdges);
    } else if (company) {
      // Client-side fallback from company object
      const rootId = company.code;
      nodes.add({
        id: rootId,
        label: `${company.code}\n${(company.name || company.code).slice(0, 22)}`,
        shape: 'box',
        shapeProperties: { borderRadius: 10 },
        level: 2,
        group: 'center_company',
        color: {
          background: '#1e3a8a',
          border: '#38bdf8',
          highlight: { background: '#2563eb', border: '#60a5fa' },
        },
        font: { color: '#ffffff', face: 'Outfit', size: 15, bold: true },
        margin: 12,
        shadow: { enabled: true, color: 'rgba(56, 189, 248, 0.35)', size: 10, x: 0, y: 3 },
      });

      (company.shareholders || []).slice(0, 6).forEach((sh: Shareholder, i: number) => {
        const id = `sh_${i}_${sh.name}`;
        const isCtrl = Boolean(sh.is_controller || sh.is_super_insider);
        nodes.add({
          id,
          label: `${sh.name}\n(${sh.percentage.toFixed(1)}%)`,
          shape: 'box',
          shapeProperties: { borderRadius: 8 },
          level: isCtrl ? 0 : 1,
          group: isCtrl ? 'controlling_owner' : 'shareholder',
          color: {
            background: isCtrl ? '#78350f' : '#4c1d95',
            border: isCtrl ? '#f59e0b' : '#a78bfa',
            highlight: { background: isCtrl ? '#b45309' : '#6d28d9', border: '#fde047' },
          },
          font: { color: '#ffffff', size: 11, face: 'Outfit', bold: isCtrl },
          margin: 8,
        });
        edges.add({
          from: id,
          to: rootId,
          label: `${sh.percentage.toFixed(1)}%`,
          arrows: 'to',
          color: { color: isCtrl ? 'rgba(245, 158, 11, 0.8)' : 'rgba(167, 139, 250, 0.6)' },
          font: { color: isCtrl ? '#fde047' : '#c4b5fd', size: 10, bold: true },
        });
      });

      const allBoard: BoardMember[] = company.board_members || [
        ...(company.directors || []),
        ...(company.commissioners || []),
      ];

      allBoard.slice(0, 8).forEach((b: BoardMember, i: number) => {
        const id = `board_${i}_${b.name}`;
        const isDir = b.role === 'Director' || (b.title && b.title.includes('DIREKTUR'));
        nodes.add({
          id,
          label: b.name,
          shape: 'box',
          shapeProperties: { borderRadius: 6 },
          level: 1,
          group: isDir ? 'director' : 'commissioner',
          color: {
            background: isDir ? '#064e3b' : '#134e4a',
            border: isDir ? '#10b981' : '#14b8a6',
          },
          font: { color: '#e5e7eb', size: 11, face: 'Outfit' },
          margin: 6,
        });
        edges.add({
          from: id,
          to: rootId,
          label: b.title || (isDir ? 'Director' : 'Commissioner'),
          color: { color: isDir ? 'rgba(16, 185, 129, 0.4)' : 'rgba(20, 184, 166, 0.4)' },
          font: { color: '#9ca3af', size: 9 },
        });
      });

      (company.subsidiaries || []).slice(0, 6).forEach((sub: Subsidiary, i: number) => {
        const id = `sub_${i}_${sub.name}`;
        nodes.add({
          id,
          label: `${sub.name}\n(${sub.percentage.toFixed(1)}%)`,
          shape: 'box',
          shapeProperties: { borderRadius: 6 },
          level: 3,
          group: 'subsidiary',
          color: {
            background: 'rgba(225, 29, 72, 0.25)',
            border: '#f43f5e',
          },
          font: { color: '#fda4af', size: 10, face: 'Outfit' },
          margin: 6,
        });
        edges.add({
          from: rootId,
          to: id,
          label: `${sub.percentage.toFixed(1)}%`,
          arrows: 'to',
          color: { color: 'rgba(244, 63, 94, 0.5)' },
          font: { color: '#fda4af', size: 9 },
        });
      });
    } else {
      return;
    }

    const data = { nodes, edges };

    // Build configuration depending on layout mode
    const options: any = {
      autoResize: true,
      layout: layoutMode === 'hierarchical'
        ? {
            hierarchical: {
              enabled: true,
              direction: 'UD', // Up to Down
              sortMethod: 'directed',
              levelSeparation: 120,
              nodeSpacing: 180,
              treeSpacing: 200,
              blockShifting: true,
              edgeMinimization: true,
            },
          }
        : {
            hierarchical: { enabled: false },
          },
      physics: {
        enabled: isPhysicsActive,
        stabilization: {
          enabled: true,
          iterations: 120,
          updateInterval: 25,
        },
        barnesHut: {
          gravitationalConstant: -3800,
          centralGravity: 0.25,
          springLength: 140,
          springConstant: 0.04,
          damping: 0.2,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 150,
        zoomView: true,
        dragView: true,
        selectConnectedEdges: true,
      },
    };

    const network = new Network(containerRef.current, data, options);
    networkRef.current = network;

    // Freeze physics once stabilization completes to prevent continuous jiggling / auto-refresh feel
    network.on('stabilizationIterationsDone', () => {
      network.setOptions({ physics: { enabled: false } });
      setIsPhysicsActive(false);
    });

    // Node click handler for entity inspection
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const clickedId = String(params.nodes[0]);
        const clickedNode = nodes.get(clickedId) as any;

        if (clickedNode) {
          let ticker = '';
          if (clickedId.startsWith('comp_')) {
            ticker = clickedId.replace('comp_', '');
          } else if (clickedNode.group === 'interlocked_company') {
            ticker = clickedNode.label;
          } else if (clickedNode.group === 'center_company') {
            ticker = clickedNode.label.split('\n')[0];
          }

          setSelectedEntity({
            id: clickedId,
            label: clickedNode.label.split('\n')[0],
            group: clickedNode.group || 'entity',
            subTitle: clickedNode.label.split('\n')[1] || '',
            ticker: ticker || undefined,
          });
        }
      } else {
        setSelectedEntity(null);
      }
    });

    // Double click to open company directly
    network.on('doubleClick', (params) => {
      if (params.nodes.length > 0 && onSelectCompany) {
        const clickedId = String(params.nodes[0]);
        if (clickedId.startsWith('comp_')) {
          onSelectCompany(clickedId.replace('comp_', ''));
        } else if (networkData?.nodes) {
          const matched = networkData.nodes.find((n) => n.id === clickedId);
          if (matched && matched.group === 'interlocked_company') {
            onSelectCompany(matched.label);
          }
        }
      }
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [networkData, company, layoutMode]);

  // Zoom and Layout Helper Handlers
  const handleZoomIn = useCallback(() => {
    if (!networkRef.current) return;
    const scale = networkRef.current.getScale();
    networkRef.current.moveTo({ scale: scale * 1.25, animation: { duration: 250, easingFunction: 'easeInOutQuad' } });
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!networkRef.current) return;
    const scale = networkRef.current.getScale();
    networkRef.current.moveTo({ scale: scale * 0.8, animation: { duration: 250, easingFunction: 'easeInOutQuad' } });
  }, []);

  const handleFit = useCallback(() => {
    if (!networkRef.current) return;
    networkRef.current.fit({ animation: { duration: 350, easingFunction: 'easeInOutQuad' } });
  }, []);

  const togglePhysics = useCallback(() => {
    if (!networkRef.current) return;
    const nextState = !isPhysicsActive;
    networkRef.current.setOptions({ physics: { enabled: nextState } });
    setIsPhysicsActive(nextState);
  }, [isPhysicsActive]);

  const toggleLayout = useCallback(() => {
    setLayoutMode((prev) => (prev === 'hierarchical' ? 'physics' : 'hierarchical'));
  }, []);

  const isNeo4j = networkData?.summary?.engine === 'neo4j';

  return (
    <div className="network-graph-wrapper" style={{ width: '100%', position: 'relative' }}>
      {/* Modern Graph Header & Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        background: 'rgba(15, 23, 42, 0.85)',
        borderTopLeftRadius: '12px',
        borderTopRightRadius: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Color Legend with Clean Icons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.75rem', color: '#cbd5e1' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }} />
            <strong style={{ color: '#fcd34d' }}>Controller / UBO</strong>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#38bdf8' }} />
            Target Stock
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#a78bfa' }} />
            Shareholder
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#10b981' }} />
            Director
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#14b8a6' }} />
            Commissioner
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#f43f5e' }} />
            Subsidiary
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#eab308' }} />
            Interlock
          </span>
        </div>

        {/* Engine Badge */}
        {networkData?.summary && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
            <span style={{
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              fontWeight: 700,
              background: isNeo4j ? 'rgba(16, 185, 129, 0.15)' : 'rgba(56, 189, 248, 0.15)',
              color: isNeo4j ? '#34d399' : '#38bdf8',
              border: isNeo4j ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(56, 189, 248, 0.3)',
            }}>
              {isNeo4j ? '⚡ Live Neo4j Graph' : '💾 Local Graph Cache'}
            </span>
            <span style={{ color: '#64748b' }}>
              {networkData.summary.total_nodes} entities · {networkData.summary.total_edges} links
            </span>
          </div>
        )}
      </div>

      {/* Vis.js Canvas Viewport */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height,
          background: 'radial-gradient(ellipse at center, rgba(15, 23, 42, 0.8) 0%, rgba(7, 10, 19, 0.95) 100%)',
          position: 'relative',
        }}
      />

      {/* Floating Canvas HUD Toolbar (Top Right) */}
      <div style={{
        position: 'absolute',
        top: '60px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '0.35rem 0.5rem',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        zIndex: 20,
      }}>
        {/* Layout Switcher */}
        <button
          onClick={toggleLayout}
          title={layoutMode === 'hierarchical' ? 'Switch to Radial Network Mode' : 'Switch to UBO Tree Hierarchy Mode'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '6px',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            background: layoutMode === 'hierarchical' ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
            color: '#38bdf8',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {layoutMode === 'hierarchical' ? <GitFork size={13} /> : <Share2 size={13} />}
          <span>{layoutMode === 'hierarchical' ? 'Tree' : 'Radial'}</span>
        </button>

        <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Zoom Controls */}
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#cbd5e1',
            padding: '0.35rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ZoomIn size={15} />
        </button>

        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#cbd5e1',
            padding: '0.35rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ZoomOut size={15} />
        </button>

        <button
          onClick={handleFit}
          title="Fit & Recenter View"
          style={{
            background: 'transparent',
            border: 'none',
            color: '#cbd5e1',
            padding: '0.35rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Maximize2 size={15} />
        </button>

        <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Physics Freeze Toggle */}
        <button
          onClick={togglePhysics}
          title={isPhysicsActive ? 'Freeze physics simulation' : 'Unfreeze physics simulation'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            padding: '0.35rem 0.5rem',
            borderRadius: '6px',
            border: 'none',
            background: isPhysicsActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            color: isPhysicsActive ? '#34d399' : '#94a3b8',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {isPhysicsActive ? <Play size={12} fill="#34d399" /> : <Pause size={12} />}
          <span>{isPhysicsActive ? 'Float' : 'Locked'}</span>
        </button>
      </div>

      {/* Interactive Entity Details Drawer (Bottom Left) */}
      {selectedEntity && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          maxWidth: '360px',
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '1rem',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.6)',
          zIndex: 30,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '0.15rem 0.5rem',
              borderRadius: '4px',
              background: selectedEntity.group === 'controlling_owner'
                ? 'rgba(245, 158, 11, 0.2)'
                : selectedEntity.group === 'center_company'
                ? 'rgba(56, 189, 248, 0.2)'
                : 'rgba(255, 255, 255, 0.08)',
              color: selectedEntity.group === 'controlling_owner'
                ? '#fcd34d'
                : selectedEntity.group === 'center_company'
                ? '#38bdf8'
                : '#cbd5e1',
            }}>
              {selectedEntity.group.replace('_', ' ')}
            </span>
            <button
              onClick={() => setSelectedEntity(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '0.1rem',
              }}
            >
              <X size={15} />
            </button>
          </div>

          <strong style={{ display: 'block', color: '#f8fafc', fontSize: '1rem', marginBottom: '0.2rem' }}>
            {selectedEntity.label}
          </strong>

          {selectedEntity.subTitle && (
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              {selectedEntity.subTitle}
            </div>
          )}

          {selectedEntity.ticker && onSelectCompany && (
            <button
              onClick={() => onSelectCompany(selectedEntity.ticker!)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                width: '100%',
                justifyContent: 'center',
                padding: '0.45rem',
                borderRadius: '6px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                marginTop: '0.5rem',
              }}
            >
              <span>Explore {selectedEntity.ticker} Network</span>
              <ExternalLink size={13} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
