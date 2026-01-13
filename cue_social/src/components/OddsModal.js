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

    function probabilityAllCollected({
        X,   // percent chance per draw to get any option
        Z,   // number of distinct options
        N    // number of draws
    }) {
        const p = X;

        if (p <= 0) return 0;
        if (N <= 0) return 0;

        let result = 0;

        for (let k = 0; k <= Z; k++) {
            const sign = k % 2 === 0 ? 1 : -1;
            const binom = combination(Z, k);
            const term = Math.pow(1 - (k * p) / Z, N);

            result += sign * binom * term;
        }

        return Math.max(0, Math.min(1, result));
    }

    function combination(n, k) {
        if (k < 0 || k > n) return 0;
        k = Math.min(k, n - k);

        let res = 1;
        for (let i = 1; i <= k; i++) {
            res *= (n - (k - i));
            res /= i;
        }
        return res;
    }


    const charts = [
        ...(deck.num_new >= 2
            ? [{
                key: 'all_new',
                label: 'All New Cards',
                color: '#6FFFFF',
                probability: deck.new_card_odds,
                num_new: deck.num_new,
                cost: deck.cost
            }]
            : []),
        ...(deck.num_new >= 1
            ? [{
                key: 'new',
                label: '1+ New Card',
                color: '#6C8CFF',
                probability: deck.new_card_odds
            }]
            : []),
        { key: 'limleg', label: '1+ Limited Legendary', color: '#c9a728', probability: deck.limleg_odds },
        { key: 'limepic', label: '1+ Limited Epic', color: '#aaaaaa', probability: deck.limepic_odds }
    ];


    const data = charts.map(c => ({
        ...c,
        values: Array.from({ length: 100 }, (_, i) => {
            const spend = (i / 99) * maxSpend;
            const numDraws = spend / deck.cost;

            const odds = c.key !== "all_new" ? 100 * atLeastOneSuccess(spend, deck.cost, c.probability)
                : 100 * probabilityAllCollected({ X: c.probability, Z: deck.num_new, N: numDraws });
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
                            {!deck.message || deck.message === null ? "Hover or tap the charts to see odds change as you spend more gems." : deck.message}
                            {deck.limleg_per_1k != null && (
                                <>
                                    <br />
                                    {"Limlegs per 1k: " + deck.limleg_per_1k.toFixed(1)}

                                    {deck.limepic_per_1k != null && (
                                        <>
                                            <br />
                                            {"Limepics per 1k: " + deck.limepic_per_1k.toFixed(1)}
                                        </>
                                    )}
                                </>
                            )}
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
