import { useState } from 'react';
import '../component_styles/odds-modal.css';
import OddsChart from './OddsChart';

export default function OddsModal({ open, onClose, title, deck }) {
    const [hoverSpend, setHoverSpend] = useState(null);

    if (!open || !deck) return null;

    function atLeastOneSuccess(spend, costPerPack, probability) {
        const n = spend / costPerPack;
        return 1 - Math.pow(1 - probability, n);
    }

    const maxSpend = deck?.type === 'coin' ? 250000 : 1000; // adjust as needed

    const charts = [
        { key: 'new', label: 'New Card', color: '#6C8CFF', probability: deck.new_card_odds },
        { key: 'limleg', label: 'Limited Legendary', color: '#c9a728', probability: deck.limleg_odds },
        { key: 'limepic', label: 'Limited Epic', color: '#aaaaaa', probability: deck.limepic_odds }
    ];

    const data = charts.map(c => ({
        ...c,
        values: Array.from({ length: 100 }, (_, i) => {
            const spend = (i / 99) * maxSpend;
            const odds = 100*atLeastOneSuccess(spend, deck.cost, c.probability);
            return { spend, odds };
        })
    }));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-odds" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <div>
                        <h2>{title}</h2>
                        <p className="modal-subtitle">
                            Hover or tap the charts to see odds change as you spend more gems.
                        </p>
                    </div>
                    <button className="modal-close" onClick={onClose}>×</button>
                </header>

                <div
                    className="charts-wrapper"
                    onMouseLeave={() => setHoverSpend(null)}
                >
                    {data.map(chart => (
                        <OddsChart
                            key={chart.key}
                            label={chart.label}
                            color={chart.color}
                            values={chart.values}
                            hoverSpend={hoverSpend}
                            setHoverSpend={setHoverSpend}
                            maxSpend={maxSpend}
                            type={deck?.type}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
