        function drawCompanyNetworkGraph(company) {
            const container = document.getElementById('networkGraph');
            
            // Build vis network nodes and edges
            let nodes = [];
            let edges = [];
            
            // 1. Center Company Node
            nodes.push({
                id: company.code,
                label: company.code,
                title: company.name,
                shape: 'dot',
                size: 25,
                color: {
                    background: '#3b82f6',
                    border: '#ffffff',
                    highlight: { background: '#60a5fa', border: '#ffffff' }
                },
                shadow: { enabled: true, color: 'rgba(59, 130, 246, 0.4)', size: 10 }
            });

            // Limit elements to prevent cluttered display
            const maxElements = 15;
            
            // 2. Add Board Members
            const boardToShow = company.board_members.slice(0, 6);
            boardToShow.forEach(b => {
                const nodeId = `board_${b.name}`;
                // Avoid duplicates
                if (!nodes.find(n => n.id === nodeId)) {
                    nodes.push({
                        id: nodeId,
                        label: b.name.split(' ').slice(0, 2).join(' '), // Keep names short
                        title: `${b.name} (${b.title || b.role})`,
                        shape: 'dot',
                        size: 15,
                        color: {
                            background: '#10b981',
                            border: '#070a13',
                            highlight: { background: '#34d399', border: '#ffffff' }
                        }
                    });
                }
                
                edges.push({
                    from: nodeId,
                    to: company.code,
                    label: b.role === 'Director' ? 'Dir' : 'Comm',
                    color: { color: 'rgba(16, 185, 129, 0.4)', highlight: '#10b981' },
                    font: { size: 9, color: 'var(--text-secondary)', strokeWidth: 0 },
                    width: 1.5
                });
            });

            // 3. Add Major Shareholders
            const shToShow = company.shareholders.slice(0, 4);
            shToShow.forEach(s => {
                const nodeId = `sh_${s.name}`;
                const isCorp = isCorporateName(s.name);
                
                if (!nodes.find(n => n.id === nodeId)) {
                    nodes.push({
                        id: nodeId,
                        label: s.name.split(' ').slice(0, 2).join(' '),
                        title: s.name,
                        shape: 'dot',
                        size: isCorp ? 18 : 14,
                        color: {
                            background: isCorp ? '#8b5cf6' : '#f59e0b',
                            border: '#070a13',
                            highlight: { background: isCorp ? '#a78bfa' : '#fbbf24', border: '#ffffff' }
                        }
                    });
                }
                
                edges.push({
                    from: nodeId,
                    to: company.code,
                    label: `${s.percentage.toFixed(0)}%`,
                    color: { color: isCorp ? 'rgba(139, 92, 246, 0.4)' : 'rgba(245, 158, 11, 0.4)', highlight: '#fbbf24' },
                    font: { size: 9, color: 'var(--text-secondary)', strokeWidth: 0 },
                    width: 2
                });
            });

            // 4. Add Subsidiaries
            const subsToShow = company.subsidiaries.slice(0, 3);
            subsToShow.forEach(sub => {
                const nodeId = `sub_${sub.name}`;
                if (!nodes.find(n => n.id === nodeId)) {
                    nodes.push({
                        id: nodeId,
                        label: sub.name.split(' ').slice(0, 2).join(' '),
                        title: `${sub.name} (Subsidiary: ${sub.bidang_usaha})`,
                        shape: 'dot',
                        size: 14,
                        color: {
                            background: '#ec4899',
                            border: '#070a13',
                            highlight: { background: '#f472b6', border: '#ffffff' }
                        }
                    });
                }
                
                edges.push({
                    from: company.code,
                    to: nodeId,
                    label: `${sub.percentage.toFixed(0)}%`,
                    color: { color: 'rgba(236, 72, 153, 0.4)', highlight: '#ec4899' },
                    font: { size: 9, color: 'var(--text-secondary)', strokeWidth: 0 },
                    width: 1.5
                });
            });

            // Check if any board member bridges to another listed company (cross connections)
            company.shared_directors.forEach(sd => {
                const nodeId = `board_${sd.insider_name}`;
                sd.connected_to.forEach(otherCode => {
                    // Check if other company is in our database, to link to it
                    const otherComp = dashboardData.companies.find(comp => comp.code === otherCode);
                    if (otherComp) {
                        // Add company node if not present
                        if (!nodes.find(n => n.id === otherCode)) {
                            nodes.push({
                                id: otherCode,
                                label: otherCode,
                                title: otherComp.name,
                                shape: 'dot',
                                size: 20,
                                color: {
                                    background: 'rgba(59, 130, 246, 0.4)',
                                    border: 'rgba(255,255,255,0.2)'
                                }
                            });
                        }
                        
                        // Add edge from director to other company
                        edges.push({
                            from: nodeId,
                            to: otherCode,
                            color: { color: 'rgba(255, 255, 255, 0.15)', highlight: '#3b82f6' },
                            width: 1,
                            style: 'dash'
                        });
                    }
                });
            });

            // Vis.js data structure
            const graphData = {
                nodes: new vis.DataSet(nodes),
                edges: new vis.DataSet(edges)
            };

            // Physics configurations
            const options = {
                physics: {
                    solver: 'forceAtlas2Based',
                    forceAtlas2Based: {
                        gravitationalConstant: -50,
                        centralGravity: 0.01,
                        springLength: 80,
                        springConstant: 0.08
                    },
                    stabilization: { iterations: 150, updateInterval: 25 }
                },
                interaction: {
                    hover: true,
                    tooltipDelay: 200
                },
                nodes: {
                    font: { size: 10, color: '#f3f4f6', face: 'Outfit' }
                }
            };

            // Create Network instance
            if (visNetworkInstance) {
                visNetworkInstance.destroy();
            }
            visNetworkInstance = new vis.Network(container, graphData, options);

            // Add click listener to switch focus to other companies in the graph
            visNetworkInstance.on("click", function(params) {
                if (params.nodes.length > 0) {
                    const clickedId = params.nodes[0];
                    // If it is a company code (4 character uppercase)
                    if (clickedId.length === 4 && clickedId === clickedId.toUpperCase()) {
                        showCompanyDetails(clickedId);
                        // Highlight selected row in table
                        highlightScreenerTableRow(clickedId);
                    }
                }
            });
        }

