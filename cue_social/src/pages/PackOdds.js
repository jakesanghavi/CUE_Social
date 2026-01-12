import { useState } from 'react';
import '../component_styles/pack-odds.css';
import OddsModal from '../components/OddsModal';

const initialData = [
    {
        id: 1,
        name: 'Album Finder',
        image: 'https://picsum.photos/seed/1/200/300',
        cost: 140,
        new_card_odds: 0.25,
        limleg_odds: 1,
        limepic_odds: 0.27
    },
    {
        id: 2,
        name: 'Silver Linings',
        image: 'https://picsum.photos/seed/2/200/300',
        cost: 40,
        new_card_odds: 0.2,
        limleg_odds: 0.015,
        limepic_odds: 0.325
    },
    {
        id: 3,
        name: 'League Spotlight',
        image: 'https://picsum.photos/seed/3/200/300',
        cost: 25,
        new_card_odds: 0,
        limleg_odds: 0.155,
        limepic_odds: 0.095
    },
    {
        id: 4,
        name: 'Triple League Spotlight',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 50,
        new_card_odds: 0,
        limleg_odds: 0.397,
        limepic_odds: 0.259
    },
    {
        id: 5,
        name: 'The Classics',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 20,
        new_card_odds: 0.1,
        limleg_odds: 0.055,
        limepic_odds: 0.135
    }
];

export default function PackOdds() {
    const [data, setData] = useState(initialData);
    const [sortKey, setSortKey] = useState(null);
    const [direction, setDirection] = useState('desc');
    const [openDeck, setOpenDeck] = useState(null);

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
            <table className="odds-table">
                <thead>
                    <tr>
                        <th>Deck</th>
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
                            <td>{row.new_card_odds}%</td>
                            <td>{row.limleg_odds}%</td>
                            <td>{row.limepic_odds}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <OddsModal
                open={!!openDeck}
                title={openDeck?.name}
                onClose={() => setOpenDeck(null)}
                deck={openDeck}
            />
        </div>
    );
}
