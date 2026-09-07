import React from 'react';
import { Calculator, ListChecks } from 'lucide-react';

export const MethodologyTab: React.FC = () => {
  return (
    <div className="tab-panel active">
      <div className="methodology-container">
        <div className="methodology-section">
          <h2>
            <Calculator size={22} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Smart Money Synergy Score (SMSS)
          </h2>
          <p>
            The SMSS is a quantitative rating out of 100 points developed to identify high-probability, undervalued companies 
            supported by strong corporate governance, interlocking board networks, and legendary investor alignments.
          </p>
          <p>
            Traditional stock screening processes look at financial statistics in isolation. In emerging stock exchanges like the IDX, 
            who runs the company, who sits on the board, and which tycoon owns the float are often as critical as current earnings.
          </p>
        </div>

        <div className="methodology-section">
          <h2>
            <ListChecks size={22} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
            Score Weights and Criteria
          </h2>
          <div className="factor-list">
            <div className="factor-item">
              <div className="factor-score">40</div>
              <div className="factor-details">
                <h4>Financial Quality & Solvency (Max 40 points)</h4>
                <p>Screens for fundamental strength, high margins, and conservative leverage:</p>
                <ul>
                  <li><strong>Return on Equity (ROE)</strong>: ROE &ge; 20% (+15 pts), &ge; 15% (+10 pts), &ge; 10% (+5 pts). ROE &lt; 0% deducts 10 pts.</li>
                  <li><strong>Debt-to-Equity (D/E) Ratio</strong>: Conservative debt level. D/E &le; 0.5 (+15 pts), &le; 1.0 (+10 pts), &le; 2.0 (+5 pts).</li>
                  <li><strong>Net Profit Margin (NPM)</strong>: High pricing power. NPM &ge; 20% (+10 pts), &ge; 10% (+7 pts), &ge; 5% (+3 pts).</li>
                </ul>
              </div>
            </div>

            <div className="factor-item">
              <div className="factor-score valuation">30</div>
              <div className="factor-details">
                <h4>Valuation Discounts (Max 30 points)</h4>
                <p>Ensures that you are buying quality at a reasonable price, avoiding overpriced growth traps:</p>
                <ul>
                  <li><strong>Price-to-Earnings (P/E) Ratio</strong>: Positive P/E &lt; 10 (+15 pts), 10 to 15 (+10 pts), 15 to 25 (+5 pts).</li>
                  <li><strong>Price-to-Book (P/B) Ratio</strong>: Asset discount. PBV &lt; 1.0 (+15 pts), 1.0 to 1.5 (+10 pts), 1.5 to 3.0 (+5 pts).</li>
                </ul>
              </div>
            </div>

            <div className="factor-item">
              <div className="factor-score network">30</div>
              <div className="factor-details">
                <h4>Network Leverage & Insiders (Max 30 points)</h4>
                <p>Measures corporate governance quality, network synergy, and insider alignment:</p>
                <ul>
                  <li><strong>Blue-Chip Bridge (+12 points)</strong>: Added if a company shares at least one director or commissioner with a Blue Chip company (like BBCA, ASII, TLKM). Serves as a proxy for talent pool and board pedigree.</li>
                  <li><strong>Super-Insider Conviction (+10 points)</strong>: Added if an individual retail tycoon (e.g. Lo Kheng Hong) holds &ge; 1.0% stake. Retail billionaires usually perform intensive research and verify management integrity before investing.</li>
                  <li><strong>Conglomerate Synergy (+8 points)</strong>: Added if a company is controlled by an active conglomerate group whose member firms have a median ROE &ge; 15% (showing strong operational management at group level).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
