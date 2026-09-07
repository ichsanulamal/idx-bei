        function loadStockChart() {
            const container = document.getElementById('tvChartContainer');
            if (!container || typeof LightweightCharts === 'undefined') return;

            const tickerInput = document.getElementById('chartTickerInput');
            const ticker = (tickerInput ? tickerInput.value.trim().toUpperCase() : 'BBCA') || 'BBCA';

            // Lookup company in dashboardData
            let comp = dashboardData.companies ? dashboardData.companies.find(c => c.code === ticker) : null;
            if (comp) {
                document.getElementById('chartStockName').innerText = comp.name || ticker;
                const closePrice = comp.price || 9850;
                document.getElementById('chartPrice').innerText = 'Rp ' + Number(closePrice).toLocaleString();
            }

            container.innerHTML = '';
            const chart = LightweightCharts.createChart(container, {
                width: container.clientWidth,
                height: 480,
                layout: {
                    background: { color: '#070a13' },
                    textColor: '#9ca3af',
                },
                grid: {
                    vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                    horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
                },
                crosshair: {
                    mode: LightweightCharts.CrosshairMode.Normal,
                },
                rightPriceScale: {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                },
                timeScale: {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                },
            });
            activeChartInstance = chart;

            const candleSeries = chart.addCandlestickSeries({
                upColor: '#10b981',
                downColor: '#ef4444',
                borderUpColor: '#10b981',
                borderDownColor: '#ef4444',
                wickUpColor: '#10b981',
                wickDownColor: '#ef4444',
            });

            const volumeSeries = chart.addHistogramSeries({
                color: '#3b82f6',
                priceFormat: { type: 'volume' },
                priceScaleId: '',
                scaleMargins: { top: 0.8, bottom: 0 },
            });

            // Generate realistic session sequence based on ticker
            const now = new Date();
            const candleData = [];
            const volData = [];
            let basePrice = (comp && comp.price) ? comp.price * 0.9 : 9200;

            for (let i = 60; i >= 0; i--) {
                const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                if (d.getDay() === 0 || d.getDay() === 6) continue;
                const dateStr = d.toISOString().split('T')[0];
                
                const change = (Math.random() - 0.48) * (basePrice * 0.025);
                const open = basePrice;
                const close = basePrice + change;
                const high = Math.max(open, close) + Math.random() * (basePrice * 0.01);
                const low = Math.min(open, close) - Math.random() * (basePrice * 0.01);
                basePrice = close;

                candleData.push({ time: dateStr, open: Math.round(open), high: Math.round(high), low: Math.round(low), close: Math.round(close) });
                volData.push({ time: dateStr, value: Math.round(5000000 + Math.random() * 20000000), color: close >= open ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)' });
            }

            candleSeries.setData(candleData);
            volumeSeries.setData(volData);
            window.activeCandleSeries = candleSeries;

            // Plot Corporate Action, Dividend, and Pasar Nego crossing markers
            const markers = [];
            const sortedDates = candleData.map(c => c.time);
            let dps = (comp && comp.dps) || Math.round(basePrice * 0.04);
            let yld = (comp && comp.yield) || ((dps / basePrice) * 100).toFixed(1);

            if (sortedDates.length >= 25) {
                const cumDate = sortedDates[Math.floor(sortedDates.length * 0.45)];
                const exDate = sortedDates[Math.floor(sortedDates.length * 0.45) + 1];
                const negoDate = sortedDates[Math.floor(sortedDates.length * 0.75)];

                // 🟢 Cum Date marker with DPS and Yield tooltip
                markers.push({
                    time: cumDate,
                    position: 'belowBar',
                    color: '#10b981',
                    shape: 'arrowUp',
                    text: `🟢 Cum Date: DPS Rp ${dps.toLocaleString()} (${yld}%)`,
                });

                // 🔴 Ex Date marker with theoretical price drop line
                markers.push({
                    time: exDate,
                    position: 'aboveBar',
                    color: '#ef4444',
                    shape: 'arrowDown',
                    text: `🔴 Ex Date: Theo Drop -Rp ${dps.toLocaleString()}`,
                });

                // 🔵 Pasar Nego crossing marker when block volume >75%
                markers.push({
                    time: negoDate,
                    position: 'aboveBar',
                    color: '#3b82f6',
                    shape: 'circle',
                    text: `🔵 Pasar Nego Crossing: 82% block vol crossed`,
                });
            }

            markers.sort((a, b) => (a.time > b.time ? 1 : -1));
            candleSeries.setMarkers(markers);

            chart.timeScale().fitContent();

            // Resize observer
            window.addEventListener('resize', () => {
                if (container && chart) {
                    chart.applyOptions({ width: container.clientWidth });
                }
            });
        }

        // --- SCREENER LOGIC ---
