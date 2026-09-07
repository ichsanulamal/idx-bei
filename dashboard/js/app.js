        // Global variables for dashboard data
        let dashboardData = {
            companies: [],
            super_insiders: [],
            conglomerates: []
        };
        let activeTab = 'screener';
        let visNetworkInstance = null;

        // Initialize App
        window.addEventListener('DOMContentLoaded', () => {
            loadDashboardData();
            initLiveWebSocket();
        });

        // --- LIVE WEBSOCKET MICROSERVICE CLIENT ---
        let liveSocket = null;
        function initLiveWebSocket() {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = window.location.hostname || 'localhost';
            const wsUrl = `${protocol}//${host}:8000/ws/stream`;

            const badge = document.getElementById('wsBadge');
            const text = document.getElementById('wsStatusText');

            try {
                liveSocket = new WebSocket(wsUrl);

                liveSocket.onopen = () => {
                    console.log('[WebSocket] Connected to live IDX stream:', wsUrl);
                    if (badge && text) {
                        badge.style.color = '#10b981';
                        badge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                        badge.style.background = 'rgba(16, 185, 129, 0.12)';
                        text.innerText = 'Live Feed: Connected';
                    }
                };

                liveSocket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        handleLiveEvent(data);
                    } catch (e) {
                        console.debug('[WebSocket] Parse error:', e);
                    }
                };

                liveSocket.onclose = () => {
                    if (badge && text) {
                        badge.style.color = '#9ca3af';
                        badge.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        badge.style.background = 'rgba(255, 255, 255, 0.05)';
                        text.innerText = 'Live Feed: Disconnected (Retrying...)';
                    }
                    setTimeout(initLiveWebSocket, 5000);
                };

                liveSocket.onerror = () => {
                    if (liveSocket) liveSocket.close();
                };
            } catch (err) {
                console.debug('[WebSocket] Connection failed:', err);
                setTimeout(initLiveWebSocket, 5000);
            }
        }

        function handleLiveEvent(data) {
            if (!data) return;
            if (data.type === 'price_update') {
                const { ticker, price, change, ohlc } = data;
                if (window.currentTicker === ticker) {
                    const priceEl = document.getElementById('chartPrice');
                    if (priceEl && price) priceEl.innerText = 'Rp ' + Number(price).toLocaleString();
                    if (window.activeCandleSeries && ohlc) {
                        window.activeCandleSeries.update(ohlc);
                    }
                }
                if (dashboardData && dashboardData.companies) {
                    const comp = dashboardData.companies.find(c => c.code === ticker);
                    if (comp) {
                        comp.price = price;
                        if (change !== undefined) comp.daily_change = change;
                    }
                }
            } else if (data.type === 'score_update') {
                const { ticker, score } = data;
                if (dashboardData && dashboardData.companies) {
                    const comp = dashboardData.companies.find(c => c.code === ticker);
                    if (comp && comp.score) {
                        comp.score.total = score;
                        renderScreenerTable(dashboardData.companies);
                    }
                }
            } else if (data.type === 'ingestion_completed') {
                console.log('[WebSocket] Ingestion completed event received, reloading dashboard data...');
                loadDashboardData();
            }
        }

        function renderDashboard(data) {
            dashboardData = data;
            
            // Show dashboard content and hide error banner
            document.getElementById('dashboardContent').style.display = 'block';
            document.getElementById('errorBanner').style.display = 'none';
            
            // Render screener stats and table
            initScreenerTab();
            
            // Render other tabs
            initInsidersTab();
            initConglomeratesTab();
        }

        // Load data from JS variable or JSON file with multi-path fallbacks
        async function loadDashboardData() {
            if (window.NETWORK_ALPHA_DATA) {
                renderDashboard(window.NETWORK_ALPHA_DATA);
                return;
            }

            const candidatePaths = [
                '../data/network_alpha_data.json',
                'data/network_alpha_data.json',
                '/data/network_alpha_data.json',
                'network_alpha_data.json'
            ];

            for (const path of candidatePaths) {
                try {
                    const response = await fetch(path);
                    if (response.ok) {
                        const data = await response.json();
                        renderDashboard(data);
                        return;
                    }
                } catch (err) {
                    // Try next path candidate
                }
            }

            // Check if window.NETWORK_ALPHA_DATA became available after script evaluation
            if (window.NETWORK_ALPHA_DATA) {
                renderDashboard(window.NETWORK_ALPHA_DATA);
                return;
            }

            console.error("Error: Could not load dashboard dataset from any candidate path");
            document.getElementById('dashboardContent').style.display = 'none';
            document.getElementById('errorBanner').style.display = 'flex';
        }

        // Tab Switching Logic
        let activeChartInstance = null;

        function switchTab(tabId) {
            // Hide all tab panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            // Remove active class from nav buttons
            document.querySelectorAll('nav .nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            // Activate select panel and button
            const panel = document.getElementById(tabId + 'Tab');
            if (panel) panel.classList.add('active');
            
            // Find nav button
            const navButtons = document.querySelectorAll('nav .nav-btn');
            navButtons.forEach(btn => {
                const text = btn.innerText.toLowerCase();
                if ((tabId === 'screener' && text.includes('screener')) ||
                    (tabId === 'charts' && text.includes('charts')) ||
                    (tabId === 'insiders' && text.includes('insiders')) ||
                    (tabId === 'conglomerates' && text.includes('conglomerates')) ||
                    (tabId === 'methodology' && text.includes('methodology'))) {
                    btn.classList.add('active');
                }
            });

            activeTab = tabId;
            if (tabId === 'charts') {
                setTimeout(loadStockChart, 100);
            }
        }

        function initScreenerTab() {
            // Update stats
            document.getElementById('statTotalCompanies').innerText = dashboardData.companies.length;
            
            // Calculate Average NPM
            let npms = dashboardData.companies.map(c => c.npm).filter(n => n > 0);
            let avgNpm = npms.length ? (npms.reduce((a, b) => a + b, 0) / npms.length).toFixed(1) + '%' : '0.0%';
            document.getElementById('statAvgNpm').innerText = avgNpm;

            // Calculate total directorship/commissioner bridges
            let bridgeCount = 0;
            dashboardData.companies.forEach(c => {
                bridgeCount += c.shared_directors ? c.shared_directors.length : 0;
            });
            document.getElementById('statTotalBridges').innerText = bridgeCount;

            // Top stock
            if (dashboardData.companies.length > 0) {
                document.getElementById('statTopStock').innerText = `${dashboardData.companies[0].code} (${dashboardData.companies[0].score.total.toFixed(0)} pts)`;
            }

            // Fill Sector Filter dropdown
            const sectors = [...new Set(dashboardData.companies.map(c => c.sector).filter(Boolean))].sort();
            const sectorFilter = document.getElementById('sectorFilter');
            sectorFilter.innerHTML = '<option value="">All Sectors</option>';
            sectors.forEach(s => {
                sectorFilter.innerHTML += `<option value="${s}">${s}</option>`;
            });

            // Populate Table
            renderScreenerTable(dashboardData.companies);
        }

        function renderScreenerTable(companies) {
            const tableBody = document.getElementById('screenerTableBody');
            tableBody.innerHTML = '';

            companies.forEach(c => {
                const tr = document.createElement('tr');
                tr.onclick = () => showCompanyDetails(c.code);
                
                // Score class
                let scoreClass = 'low';
                if (c.score.total >= 70) scoreClass = 'high';
                else if (c.score.total >= 45) scoreClass = 'medium';

                tr.innerHTML = `
                    <td><span class="ticker-badge">${c.code}</span></td>
                    <td class="company-name-cell">${c.name}</td>
                    <td style="color: var(--text-secondary); font-size: 0.85rem;">${c.sector}</td>
                    <td class="numeric ${c.roe >= 15 ? 'positive' : c.roe < 0 ? 'negative' : ''}">${c.roe ? c.roe.toFixed(1) + '%' : '-'}</td>
                    <td class="numeric">${c.per ? c.per.toFixed(1) : '-'}</td>
                    <td class="numeric">${c.price_bv ? c.price_bv.toFixed(2) : '-'}</td>
                    <td class="numeric">${c.de_ratio ? c.de_ratio.toFixed(2) : '-'}</td>
                    <td><span class="score-badge ${scoreClass}">${c.score.total.toFixed(0)}</span></td>
                `;
                tableBody.appendChild(tr);
            });
        }

        let currentSortKey = 'score';
        let currentSortOrder = 'desc';

        function sortScreenerTable(key) {
            if (currentSortKey === key) {
                currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                currentSortKey = key;
                currentSortOrder = (key === 'code' || key === 'name' || key === 'sector') ? 'asc' : 'desc';
            }

            // Reset all sort icons
            ['code', 'name', 'sector', 'roe', 'per', 'price_bv', 'de_ratio', 'score'].forEach(k => {
                const icon = document.getElementById(`sort_icon_${k}`);
                if (icon) {
                    icon.className = 'fa-solid fa-sort';
                    icon.style.opacity = '0.5';
                    icon.style.color = '';
                }
            });

            const activeIcon = document.getElementById(`sort_icon_${key}`);
            if (activeIcon) {
                activeIcon.className = currentSortOrder === 'asc' ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down';
                activeIcon.style.opacity = '1.0';
                activeIcon.style.color = 'var(--accent-gold)';
            }

            filterScreenerTable();
        }

        function filterScreenerTable() {
            const query = document.getElementById('searchBar').value.toLowerCase();
            const sector = document.getElementById('sectorFilter').value;
            const scoreFilter = document.getElementById('scoreFilter').value;
            const valuationFilter = document.getElementById('valuationFilter').value;

            let filtered = dashboardData.companies.filter(c => {
                // Name / Ticker match
                const matchSearch = c.code.toLowerCase().includes(query) || c.name.toLowerCase().includes(query);
                // Sector match
                const matchSector = sector === '' || c.sector === sector;
                // Score match
                let matchScore = true;
                if (scoreFilter === 'high') matchScore = c.score.total >= 70;
                else if (scoreFilter === 'medium') matchScore = c.score.total >= 45 && c.score.total < 70;
                else if (scoreFilter === 'low') matchScore = c.score.total < 45;
                // Valuation/Quality match
                let matchVal = true;
                if (valuationFilter === 'undervalued') matchVal = c.price_bv > 0 && c.price_bv < 1.0;
                else if (valuationFilter === 'pe15') matchVal = c.per > 0 && c.per < 15.0;
                else if (valuationFilter === 'profitable') matchVal = c.roe >= 15.0;

                return matchSearch && matchSector && matchScore && matchVal;
            });

            // Dynamic Sorting
            filtered.sort((a, b) => {
                let valA, valB;
                if (currentSortKey === 'score') {
                    valA = a.score ? a.score.total : 0;
                    valB = b.score ? b.score.total : 0;
                } else if (currentSortKey === 'code') {
                    valA = a.code || '';
                    valB = b.code || '';
                } else if (currentSortKey === 'name') {
                    valA = a.name || '';
                    valB = b.name || '';
                } else if (currentSortKey === 'sector') {
                    valA = a.sector || '';
                    valB = b.sector || '';
                } else {
                    valA = a[currentSortKey] !== undefined && a[currentSortKey] !== null ? a[currentSortKey] : (currentSortOrder === 'asc' ? Infinity : -Infinity);
                    valB = b[currentSortKey] !== undefined && b[currentSortKey] !== null ? b[currentSortKey] : (currentSortOrder === 'asc' ? Infinity : -Infinity);
                }

                if (typeof valA === 'string') {
                    return currentSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
                } else {
                    return currentSortOrder === 'asc' ? valA - valB : valB - valA;
                }
            });

            renderScreenerTable(filtered);
        }

        // --- COMPANY DETAIL LOGIC ---
        function showCompanyDetails(code) {
            const c = dashboardData.companies.find(comp => comp.code === code);
            if (!c) return;

            // Set detail drawer active
            document.getElementById('detailDrawer').classList.add('active');

            // Set Header and quick details
            document.getElementById('detailTicker').innerText = c.code;
            document.getElementById('detailName').innerText = c.name;
            document.getElementById('detailSector').innerText = `${c.sector} / ${c.sub_sector || c.industry}`;
            document.getElementById('detailRoe').innerText = c.roe ? c.roe.toFixed(1) + '%' : '-';
            document.getElementById('detailPe').innerText = c.per ? c.per.toFixed(1) : '-';
            document.getElementById('detailPbv').innerText = c.price_bv ? c.price_bv.toFixed(2) : '-';

            // Add conditional colors for mini metrics
            toggleMetricColor('detailRoe', c.roe, 15, 0);
            toggleMetricColor('detailPe', c.per, 0, 25, true); // Low PE is good
            toggleMetricColor('detailPbv', c.price_bv, 0, 1.5, true); // Low PBV is good

            // Score breakdown
            document.getElementById('detailTotalScore').innerText = `${c.score.total.toFixed(0)} / 100`;
            document.getElementById('detailScoreFinancial').innerText = c.score.financial.toFixed(0);
            document.getElementById('detailScoreValuation').innerText = c.score.valuation.toFixed(0);
            document.getElementById('detailScoreNetwork').innerText = c.score.network.toFixed(0);

            document.getElementById('detailBarFinancial').style.width = `${(c.score.financial / 40) * 100}%`;
            document.getElementById('detailBarValuation').style.width = `${(c.score.valuation / 30) * 100}%`;
            document.getElementById('detailBarNetwork').style.width = `${(c.score.network / 30) * 100}%`;

            // Populate Board List
            const boardList = document.getElementById('detailBoardList');
            boardList.innerHTML = '';
            document.getElementById('detailBoardCount').innerText = c.board_members.length;
            c.board_members.forEach(b => {
                boardList.innerHTML += `
                    <div class="accordion-item">
                        <span style="font-weight: 500;">${b.name}</span>
                        <span class="sub-role" style="background: ${b.role === 'Director' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${b.role === 'Director' ? 'var(--accent-blue)' : 'var(--accent-orange)'};">
                            ${b.title || b.role}
                        </span>
                    </div>
                `;
            });

            // Populate Shareholders List
            const shList = document.getElementById('detailShareholdersList');
            shList.innerHTML = '';
            document.getElementById('detailShareholdersCount').innerText = c.shareholders.length;
            c.shareholders.forEach(s => {
                shList.innerHTML += `
                    <div class="accordion-item">
                        <span style="font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;">${s.name}</span>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            ${s.is_controller ? '<span style="font-size: 0.65rem; color: var(--accent-gold); border: 1px solid rgba(251, 191, 36, 0.3); padding: 0.05rem 0.25rem; border-radius: 3px;">Controller</span>' : ''}
                            <span class="numeric" style="font-weight:600;">${s.percentage.toFixed(2)}%</span>
                        </div>
                    </div>
                `;
            });

            // Populate Subsidiaries List
            const subsList = document.getElementById('detailSubsidiariesList');
            subsList.innerHTML = '';
            document.getElementById('detailSubsidiariesCount').innerText = c.subsidiaries.length;
            if (c.subsidiaries.length > 0) {
                document.getElementById('detailSubsidiariesSection').style.display = 'block';
                c.subsidiaries.forEach(sub => {
                    subsList.innerHTML += `
                        <div class="accordion-item">
                            <span style="font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;">${sub.name}</span>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="font-size: 0.7rem; color: var(--text-secondary); font-style: italic;">${sub.bidang_usaha || 'Subsidiary'}</span>
                                <span class="numeric" style="font-weight:600;">${sub.percentage.toFixed(1)}%</span>
                            </div>
                        </div>
                    `;
                });
            } else {
                document.getElementById('detailSubsidiariesSection').style.display = 'none';
            }

            // Draw Vis.js network graph
            drawCompanyNetworkGraph(c);
        }

        function closeDetailDrawer() {
            document.getElementById('detailDrawer').classList.remove('active');
        }

        function toggleMetricColor(elementId, value, highVal, lowVal, inverse = false) {
            const el = document.getElementById(elementId);
            el.className = ''; // Reset class
            
            if (value === null || value === undefined || value === 0) return;
            
            if (!inverse) {
                if (value >= highVal) el.classList.add('positive');
                else if (value < lowVal) el.classList.add('negative');
            } else {
                // For PE, lower positive values are good, negative values are bad
                if (value > 0 && value <= 12) el.classList.add('positive');
                else if (value > 25 || value <= 0) el.classList.add('negative');
            }
        }

        // Draw interactive network graph
        function highlightScreenerTableRow(code) {
            const rows = document.querySelectorAll('#screenerTableBody tr');
            rows.forEach(r => {
                const badge = r.querySelector('.ticker-badge');
                if (badge && badge.innerText === code) {
                    r.style.background = 'rgba(59, 130, 246, 0.08)';
                    r.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    r.style.background = '';
                }
            });
        }

        function isCorporateName(name) {
            if (!name) return false;
            const nameUpper = name.toUpperCase();
            const keywords = [
                "PT", "LTD", "LIMITED", "INC", "TBK", "MASYARAKAT", "SAHAM", "PENGENDALI", 
                "REPUBLIK", "FUND", "TRUST", "NOMINEES", "BANK", "ASSET", "CORP", "CO",
                "INVESTMENT", "HOLDINGS", "CAPITAL", "SECURITIES"
            ];
            return keywords.some(keyword => nameUpper.includes(keyword));
        }

        // --- INSIDERS LOGIC ---
        function initInsidersTab() {
            const container = document.getElementById('insidersGrid');
            container.innerHTML = '';

            // Render top 15 insiders
            const topInsiders = dashboardData.super_insiders.slice(0, 15);
            
            topInsiders.forEach(ins => {
                const card = document.createElement('div');
                card.className = 'glass-card insider-card';
                card.onclick = () => {
                    // Switch to screener tab and show the first holding details
                    if (ins.holdings.length > 0) {
                        switchTab('screener');
                        showCompanyDetails(ins.holdings[0].code);
                        highlightScreenerTableRow(ins.holdings[0].code);
                    }
                };

                // Format holdings list
                let holdingsHtml = '';
                ins.holdings.forEach(h => {
                    holdingsHtml += `
                        <div class="insider-holding-item">
                            <span><span class="ticker-badge" style="font-size:0.75rem; padding: 0.1rem 0.3rem;">${h.code}</span> stake</span>
                            <span class="numeric" style="font-weight:600;">${h.percentage.toFixed(2)}% (${formatCurrency(h.value)})</span>
                        </div>
                    `;
                });

                // Format roles
                let rolesHtml = '';
                if (ins.connected_roles && ins.connected_roles.length > 0) {
                    rolesHtml = `<div style="margin-top:0.75rem; display:flex; gap:6px; flex-wrap:wrap;">`;
                    ins.connected_roles.forEach(r => {
                        rolesHtml += `<span class="sub-role" style="font-size:0.7rem; background:rgba(16, 185, 129, 0.1); color:var(--accent-green); border:1px solid rgba(16, 185, 129, 0.2);">${r.code}: ${r.title}</span>`;
                    });
                    rolesHtml += `</div>`;
                }

                card.innerHTML = `
                    <div class="insider-card-header">
                        <div>
                            <h3>${ins.name}</h3>
                            <span style="font-size:0.75rem; color:var(--text-secondary);"><i class="fa-solid fa-briefcase"></i> Board Seats: ${ins.connected_roles.length}</span>
                        </div>
                        <span class="insider-value">${formatCurrency(ins.total_value)}</span>
                    </div>
                    <div class="insider-holdings-list">
                        <h4 style="font-size: 0.8rem; text-transform:uppercase; color:var(--text-secondary); margin-bottom: 0.25rem;">Stakes Owned</h4>
                        ${holdingsHtml}
                    </div>
                    ${rolesHtml}
                `;
                container.appendChild(card);
            });
        }

        // --- CONGLOMERATES LOGIC ---
        function initConglomeratesTab() {
            const container = document.getElementById('conglomGrid');
            container.innerHTML = '';

            dashboardData.conglomerates.forEach(con => {
                const card = document.createElement('div');
                card.className = 'glass-card conglom-card';
                
                // Render company badges
                let companyBadges = '';
                con.companies.forEach(code => {
                    companyBadges += `<span class="ticker-badge" style="font-size:0.75rem; padding:0.15rem 0.35rem; cursor:pointer;" onclick="switchTab('screener'); showCompanyDetails('${code}'); highlightScreenerTableRow('${code}');">${code}</span>`;
                });

                card.innerHTML = `
                    <div class="conglom-header">
                        <div>
                            <h3>${con.controller_name}</h3>
                            <span style="font-size:0.75rem; color:var(--text-secondary);"><i class="fa-solid fa-cubes"></i> Companies: ${con.companies.length}</span>
                        </div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:0.75rem;">
                        <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                            <span style="color:var(--text-secondary);">Total Group Assets</span>
                            <span class="numeric" style="font-weight:700;">${formatCurrency(con.total_assets)}</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                            <span style="color:var(--text-secondary);">Average Profitability (ROE)</span>
                            <span class="numeric ${con.average_roe >= 15 ? 'positive' : ''}" style="font-weight:700;">${con.average_roe.toFixed(1)}%</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                            <span style="color:var(--text-secondary);">Average Price / Book</span>
                            <span class="numeric" style="font-weight:700;">${con.average_pbv.toFixed(2)}x</span>
                        </div>
                        
                        <div style="margin-top:0.5rem;">
                            <h4 style="font-size: 0.8rem; text-transform:uppercase; color:var(--text-secondary); margin-bottom: 0.5rem;">Group Tickers</h4>
                            <div class="conglom-badges">
                                ${companyBadges}
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
        }

        // Helper currency formatter
        function formatCurrency(val) {
            // Values are stored in billions (Miliar) IDR or millions in raw ratios
            // For general rendering, we assume value unit scale is Millions/Billions.
            // Let's format it cleanly as Miliar (Billion) or Triliun (Trillion) IDR
            if (val === 0) return '0.0 IDR';
            
            if (val >= 1000.0) {
                return `Rp ${(val / 1000.0).toFixed(2)} T`; // Triliun
            } else {
                return `Rp ${val.toFixed(1)} B`; // Miliar
            }
        }
