import { useState } from 'react';
import '../component_styles/pack-odds.css';
import OddsModal from '../components/OddsModal';
import { packIconNames } from '../UsefulFunctions';

const packNames = packIconNames();

// Can maybe reframe this to include expected # limlegs/limepics as well
const initialData = [
    {
        id: 1,
        name: 'Album Finder',
        image: packNames[0],
        cost: 140,
        new_card_odds: 0.25,
        limleg_odds: 1,
        limepic_odds: 0.27,
        type: 'gem',
        // Accounting for getting the finder card + natural limleg
        limleg_per_1k: 1000 / 140 + 1000 / 140 * 0.25,
        limepic_per_1k: 1000 / 140 * 0.27,
        num_new: 1
    },
    {
        id: 2,
        name: '20% Epic Pack',
        image: packNames[3],
        cost: 40,
        new_card_odds: 0.2,
        limleg_odds: 0.015,
        limepic_odds: 0.325,
        type: 'gem',
        limleg_per_1k: 1000 / 40 * 0.015,
        limepic_per_1k: 1000 / 40 * 0.325,
        num_new: 1
    },
    {
        id: 3,
        name: 'League Spotlight',
        image: packNames[1],
        cost: 25,
        new_card_odds: 0,
        limleg_odds: 0.13,
        limepic_odds: 0.095,
        type: 'gem',
        limleg_per_1k: 1000 / 25 * 0.13,
        limepic_per_1k: 1000 / 25 * 0.095,
        num_new: 0
    },
    {
        id: 4,
        name: 'Triple League Spotlight',
        image: packNames[5],
        cost: 50,
        new_card_odds: 0,
        limleg_odds: 1 - (1 - 0.13) ** 3,
        limepic_odds: 1 - (1 - 0.095) ** 3,
        type: 'gem',
        limleg_per_1k: 1000 / 50 * 3 * 0.13,
        limepic_per_1k: 1000 / 50 * 3 * 0.095,
        num_new: 0
    },
    {
        id: 5,
        name: '3 New Cards',
        image: packNames[6],
        cost: 20,
        new_card_odds: 0.1,
        limleg_odds: 0.055,
        limepic_odds: 0.135,
        type: 'gem',
        // Accounting for getting the finder card + natural limleg
        limleg_per_1k: 1000 / 20 * 0.055 + 1000 / 20 * (0.1/3 * (0.055 - (0.1/3))),
        // Accounting for getting the finder card + natural limepic
        limepic_per_1k: 1000 / 20 * 0.135 + 1000 / 20 * (0.1/3 * (0.135 - (0.1/3))),
        num_new: 3,
        message: (
            <>
                Hover or tap the charts to see odds change as you spend more gems.
                <br />
                Assumes equal rate of all 3 new cards.
            </>
        )
    },
    {
        id: 6,
        name: 'Album Legendary',
        image: packNames[8],
        cost: 150,
        new_card_odds: 0,
        limleg_odds: 1,
        limepic_odds: 0,
        type: 'gem',
        limleg_per_1k: 1000 / 150 * 1,
        limepic_per_1k: 0,
        num_new: 0
    },
    {
        id: 7,
        name: 'Collection Pack (20 Gems)',
        image: packNames[11],
        cost: 20,
        new_card_odds: 0,
        limleg_odds: 0.025,
        limepic_odds: 0.17,
        type: 'gem',
        limleg_per_1k: 1000 / 20 * 0.025,
        limepic_per_1k: 1000 / 20 * 0.17,
        num_new: 0
    },
    // Coin packs will require larger X-axis range and sharp
    // limleg increase to 100% after 250k coins
    {
        id: 8,
        name: 'Collection Pack (4K Coins)',
        image: packNames[9],
        cost: 4000,
        new_card_odds: 0,
        limleg_odds: 0,
        limepic_odds: 0.015,
        type: 'coin',
        num_new: 0,
        message: (
            <>
                Hover or tap the charts to see odds change as you spend more gems.
                <br />
                Assumes 250k pity timer as the only method of acquisition.
            </>
        )
    },
    {
        id: 9,
        name: 'Collection Pack (3.5K Coins)',
        image: packNames[10],
        cost: 3500,
        new_card_odds: 0,
        limleg_odds: 0,
        limepic_odds: 0.045,
        type: 'coin',
        num_new: 0,
        message: (
            <>
                Hover or tap the charts to see odds change as you spend more gems.
                <br />
                Assumes 250k pity timer as the only method of acquisition.
            </>
        )
    },
    // Need to indicate that this has 6 limlegs + 12 limepics
    {
        id: 10,
        name: 'Stratospheric',
        image: packNames[4],
        cost: 1000,
        new_card_odds: 0,
        limleg_odds: 1,
        limepic_odds: 1,
        type: 'fixed',
        limleg_per_1k: 6,
        limepic_per_1k: 12,
        num_new: 0
    },
    // Need to indicate that this has 1 limleg + 2 limepics
    {
        id: 11,
        name: 'Grab Bag',
        image: packNames[2],
        cost: 230,
        new_card_odds: 0,
        limleg_odds: 1,
        limepic_odds: 1,
        type: 'fixed',
        limleg_per_1k: 1 * (1000 / 230),
        limepic_per_1k: 2 * (1000 / 230),
        num_new: 0
    },
    {
        id: 12,
        name: '30% Epic Pack',
        image: packNames[7],
        cost: 50,
        new_card_odds: 0.3,
        limleg_odds: 0.015,
        limepic_odds: 0.52,
        type: 'gem',
        limleg_per_1k: 1000 / 50 * 0.015,
        // Accounting for getting the finder card + natural limepic
        limepic_per_1k: 1000 / 50 * 0.52 + 1000 / 50 * (0.22 * 0.3),
        num_new: 1
    },
    {
        id: 13,
        name: 'Downgraded Album Finder',
        image: packNames[12],
        cost: 150,
        new_card_odds: 0.25,
        limleg_odds: 0.39,
        limepic_odds: 0.965,
        type: 'gem',
        // Accounting for getting the finder card + natural limleg
        limleg_per_1k: 1000 / 150 * 0.39 + 1000 / 150 * (0.14 * 0.25),
        limepic_per_1k: 1000 / 150 * 0.965,
        num_new: 1
    },
    {
        id: 14,
        name: 'Downgraded 3 New Cards',
        image: packNames[13],
        cost: 15,
        new_card_odds: 0.2,
        limleg_odds: 0.015,
        limepic_odds: 0.15,
        type: 'gem',
        limleg_per_1k: 1000 / 15 * 0.015,
        // Accounting for getting the finder card + natural limepic
        limepic_per_1k: 1000 / 15 * 0.15 + 1000 / 15 * (0.2/3 * (0.15 - 0.2/3)),
        num_new: 1
    },
    {
        id: 15,
        name: '20% New Limleg Pack',
        image: packNames[14],
        cost: 110,
        new_card_odds: 0.2,
        limleg_odds: 0.1,
        limepic_odds: 0.98,
        type: 'gem',
        // Accounting for getting the finder card + natural limleg
        limleg_per_1k: 1000 / 110 * 0.3 + 1000 / 110 * (0.1 * 0.2),
        limepic_per_1k: 1000 / 150 * 0.98,
        num_new: 1
    }
];

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
