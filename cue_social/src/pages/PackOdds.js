import { useState } from 'react';
import '../component_styles/pack-odds.css';
import OddsModal from '../components/OddsModal';

// Can maybe reframe this to include expected # limlegs/limepics as well
const initialData = [
    {
        id: 1,
        name: 'Album Finder',
        image: 'https://picsum.photos/seed/1/200/300',
        cost: 140,
        new_card_odds: 0.25,
        limleg_odds: 1,
        limepic_odds: 0.27,
        type: 'gem',
        limleg_per_1k: 1000/140 * 1 + 0.25*1,
        num_new: 1
    },
    {
        id: 2,
        name: 'Silver Linings',
        image: 'https://picsum.photos/seed/2/200/300',
        cost: 40,
        new_card_odds: 0.2,
        limleg_odds: 0.015,
        limepic_odds: 0.325,
        type: 'gem',
        limleg_per_1k: 1000/40 * 0.015,
        num_new: 1
    },
    {
        id: 3,
        name: 'League Spotlight',
        image: 'https://picsum.photos/seed/3/200/300',
        cost: 25,
        new_card_odds: 0,
        limleg_odds: 0.155,
        limepic_odds: 0.095,
        type: 'gem',
        limleg_per_1k: 1000/25 * 0.155,
        num_new: 0
    },
    {
        id: 4,
        name: 'Triple League Spotlight',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 50,
        new_card_odds: 0,
        limleg_odds: 0.397,
        limepic_odds: 0.259,
        type: 'gem',
        limleg_per_1k: 1000/50 * 0.397,
        num_new: 0
    },
    {
        id: 5,
        name: 'The Classics',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 20,
        new_card_odds: 0.1,
        limleg_odds: 0.055,
        limepic_odds: 0.135,
        type: 'gem',
        limleg_per_1k: 1000/20 * 0.055,
        num_new: 3
    },
    {
        id: 6,
        name: 'Album Legendary',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 150,
        new_card_odds: 0,
        limleg_odds: 1,
        limepic_odds: 0,
        type: 'gem',
        limleg_per_1k: 1000/150 * 1,
        num_new: 0
    },
    {
        id: 7,
        name: 'Collection Pack',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 20,
        new_card_odds: 0,
        limleg_odds: 0.025,
        limepic_odds: 0.17,
        type: 'gem',
        limleg_per_1k: 1000/20 * 0.025,
        num_new: 0
    },
    // Coin packs will require larger X-axis range and sharp
    // limleg increase to 100% after 250k coins
    {
        id: 8,
        name: 'Collection Pack (4K Coins)',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 4000,
        new_card_odds: 0,
        limleg_odds: 0,
        limepic_odds: 0.015,
        type: 'coin',
        num_new: 0
    },
    {
        id: 9,
        name: 'Collection Pack (3.5K Coins)',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 3500,
        new_card_odds: 0,
        limleg_odds: 0,
        limepic_odds: 0.045,
        type: 'coin',
        num_new: 0
    },
    // Need to indicate that this has 6 limlegs + 12 limepics
    {
        id: 10,
        name: 'Stratospheric',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 1000,
        new_card_odds: 0,
        limleg_odds: 1,
        limepic_odds: 1,
        type: 'fixed',
        limleg_per_1k: 6,
        num_new: 0
    },
    // Need to indicate that this has 1 limleg + 2 limepics
    {
        id: 11,
        name: 'Grab Bag',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 230,
        new_card_odds: 0,
        limleg_odds: 1,
        limepic_odds: 1,
        type: 'fixed',
        limleg_per_1k: 1 * (1000/230),
        num_new: 0
    },
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
                            <td>{parseFloat((row.new_card_odds*100).toFixed(1))}%</td>
                            <td>{parseFloat((row.limleg_odds*100).toFixed(1))}%</td>
                            <td>{parseFloat((row.limepic_odds*100).toFixed(1))}%</td>
                            <td>{row.limleg_per_1k ? row.limleg_per_1k.toFixed(1) : 'N/A'}</td>
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
