import { useState } from 'react';
import '../component_styles/pack-odds.css';
import OddsModal from '../components/OddsModal';
import { packOdds } from '../UsefulFunctions';

const initialData = packOdds();

export default function PackOdds() {
    const [data, setData] = useState(initialData);
    const [sortKey, setSortKey] = useState(null);
    const [direction, setDirection] = useState('desc');
    const [openDeck, setOpenDeck] = useState(null);
    const [viewMode, setViewMode] = useState('grid');

    const handleSort = (key) => {
        const nextDirection =
            sortKey === key && direction === 'desc' ? 'asc' : 'desc';

        const sorted = [...data].sort((a, b) => {
            return nextDirection === 'asc'
                ? a[key] - b[key]
                : b[key] - a[key];
        });

        setSortKey(key);
        setDirection(nextDirection);
        setData(sorted);
    };

    return (
        <div className="table-wrapper">
            <div className="view-toggle">
                <button
                    className={viewMode === 'grid' ? 'active' : ''}
                    onClick={() => setViewMode('grid')}
                >
                    Grid
                </button>
                <button
                    className={viewMode === 'table' ? 'active' : ''}
                    onClick={() => setViewMode('table')}
                >
                    Table
                </button>
            </div>

            {viewMode === 'table' ? (
                <table className="odds-table">
                    <thead>
                        <tr>
                            <th>Pack</th>
                            <th onClick={() => handleSort('cost')}>
                                Cost
                                {sortKey === 'cost' && (direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th onClick={() => handleSort('new_card_odds')}>
                                New Card %
                                {sortKey === 'new_card_odds' && (direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th onClick={() => handleSort('limleg_odds')}>
                                1+ Limleg %
                                {sortKey === 'limleg_odds' && (direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th onClick={() => handleSort('limepic_odds')}>
                                1+ Limepic %
                                {sortKey === 'limepic_odds' && (direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th onClick={() => handleSort('limleg_per_1k')}>
                                Limlegs per 1K Gems
                                {sortKey === 'limleg_per_1k' && (direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                            <th onClick={() => handleSort('limepic_per_1k')}>
                                Limepics per 1K Gems
                                {sortKey === 'limepic_per_1k' && (direction === 'asc' ? ' ↑' : ' ↓')}
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((row) => (
                            <tr key={row.id}>
                                <td className="image-cell">
                                    <div className="image-stack">
                                        <img
                                            src={row.image}
                                            alt={row.name}
                                            onClick={() => setOpenDeck(row)}
                                            style={{ cursor: 'pointer' }}
                                        />
                                        <div className="image-title">{row.name}</div>
                                    </div>
                                </td>
                                <td>{row.cost}</td>
                                <td>{(row.new_card_odds * 100).toFixed(1)}%</td>
                                <td>{(row.limleg_odds * 100).toFixed(1)}%</td>
                                <td>{(row.limepic_odds * 100).toFixed(1)}%</td>
                                <td>{row.limleg_per_1k ? row.limleg_per_1k.toFixed(1) : 'N/A'}</td>
                                <td>{row.limepic_per_1k ? row.limepic_per_1k.toFixed(1) : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="pack-grid">
                    {data.map((row) => (
                        <div
                            key={row.id}
                            className="pack-grid-item"
                            onClick={() => setOpenDeck(row)}
                        >
                            <img src={row.image} alt={row.name} />
                            <div className="pack-grid-title">{row.name}</div>
                        </div>
                    ))}
                </div>
            )}

            <OddsModal
                open={!!openDeck}
                title={openDeck?.name}
                onClose={() => setOpenDeck(null)}
                deck={openDeck}
            />
        </div>
    );
}
