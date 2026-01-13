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
        type: 'gem'
    },
    {
        id: 2,
        name: 'Silver Linings',
        image: 'https://picsum.photos/seed/2/200/300',
        cost: 40,
        new_card_odds: 0.2,
        limleg_odds: 0.015,
        limepic_odds: 0.325,
        type: 'gem'
    },
    {
        id: 3,
        name: 'League Spotlight',
        image: 'https://picsum.photos/seed/3/200/300',
        cost: 25,
        new_card_odds: 0,
        limleg_odds: 0.155,
        limepic_odds: 0.095,
        type: 'gem'
    },
    {
        id: 4,
        name: 'Triple League Spotlight',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 50,
        new_card_odds: 0,
        limleg_odds: 0.397,
        limepic_odds: 0.259,
        type: 'gem'
    },
    {
        id: 5,
        name: 'The Classics',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 20,
        new_card_odds: 0.1,
        limleg_odds: 0.055,
        limepic_odds: 0.135,
        type: 'gem'
    },
    {
        id: 6,
        name: 'Album Legendary',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 150,
        new_card_odds: 0,
        limleg_odds: 1,
        limepic_odds: 0,
        type: 'gem'
    },
    {
        id: 7,
        name: 'Collection Pack',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 20,
        new_card_odds: 0,
        limleg_odds: 0.025,
        limepic_odds: 0.17,
        type: 'gem'
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
        type: 'coin'
    },
    {
        id: 9,
        name: 'Collection Pack (3.5K Coins)',
        image: 'https://picsum.photos/seed/4/200/300',
        cost: 3500,
        new_card_odds: 0,
        limleg_odds: 0,
        limepic_odds: 0.045,
        type: 'coin'
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
        type: 'fixed'
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
        type: 'fixed'
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
