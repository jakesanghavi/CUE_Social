import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import Pill from '../components/Pill';
import { ROUTE } from '../constants';
import { optionsAlbums, optionsCollections, optionsTags } from '../selectedStyles'; // Assuming these are predefined filter options

window.Buffer = window.Buffer || require("buffer").Buffer;

const CuratedDecks = ({ loggedInUser }) => {
    const location = useLocation();

    const [decks, setDecks] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');
    // const [activeFilters, setActiveFilters] = useState({
    //     albums: [],
    //     collections: [],
    //     tags: [],
    // });
    const [isDropdownOpen, setIsDropdownOpen] = useState({ albums: false, collections: false, tags: false });
    const [selectedOptions, setSelectedOptions] = useState({
        albums: [],
        collections: [],
        tags: [],
    });
    const [searchDropdown, setSearchDropdown] = useState({
        albums: '',
        collections: '',
        tags: ''
    });

    const user = 'NewDawn729';

    const fetchDecks = useCallback(async () => {
        try {
            const response = await fetch(`${ROUTE}/api/decks/get-curated`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch decks');
            }
            const data = await response.json();
            setDecks(data.decks);
        } catch (error) {
            console.error('Error fetching decks:', error);
        }
    }, []);

    useEffect(() => {
        fetchDecks();
        // eslint-disable-next-line
    }, [location.state]);

    const handleSearch = (e) => {
        const searchValue = e.target.value.toLowerCase();
        setSearchTerm(searchValue);
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const finalDecks = useMemo(() => {
        if (!decks) return [];

        // Filter by title
        let result = decks.filter((deck) =>
            deck.title.toLowerCase().includes(searchTerm)
        );

        // Apply filters for albums, collections, and tags
        Object.keys(selectedOptions).forEach((column) => {
            if (selectedOptions[column].length > 0) {
                result = result.filter((deck) =>
                    selectedOptions[column].every((selected) =>
                        deck[column]?.includes(selected)
                    )
                );
                
            }
        });

        // Sort
        result.sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (typeof aValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' || aValue instanceof Date) {
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }

            return 0;
        });

        return result;
    }, [decks, searchTerm, selectedOptions, sortConfig]);


    const handleFilterToggle = (column) => {
        setIsDropdownOpen((prevState) => {
            // Close other dropdowns when one is opened
            const newState = { albums: false, collections: false, tags: false };
            newState[column] = !prevState[column];
            return newState;
        });
    };

    const handleOptionSelect = (column, option) => {
        setSelectedOptions((prevState) => {
            const newSelected = prevState[column];
            if (newSelected.includes(option.value)) {
                return { ...prevState, [column]: newSelected.filter((item) => item !== option.value) };
            } else {
                return { ...prevState, [column]: [...newSelected, option.value] };
            }
        });
    };

    const handleSearchDropdown = (e, column) => {
        setSearchDropdown((prevState) => ({
            ...prevState,
            [column]: e.target.value.toLowerCase(),
        }));
    };

    useEffect(() => {
        let filtered = decks;

        Object.keys(selectedOptions).forEach((column) => {
            if (selectedOptions[column].length > 0) {
                filtered = filtered.filter((deck) =>
                    selectedOptions[column].every((selected) =>
                        deck[column]?.includes(selected)
                    )
                );
            }
        });

    }, [decks, selectedOptions]);

    // Filter options based on search term
    const filterOptions = (options, column) => {
        return options.filter((option) =>
            option.label.toLowerCase().includes(searchDropdown[column])
        );
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by title..."
                style={{ marginBottom: '16px', padding: '8px', width: '100%' }}
            />

            {/* Display active filters */}
            <div style={{ marginBottom: '16px' }}>
                <strong>Active Filters:</strong>
                {Object.keys(selectedOptions).map(
                    (column) =>
                        selectedOptions[column].length > 0 && (
                            <span key={column} style={{ marginRight: '8px' }}>
                                {`${column.charAt(0).toUpperCase() + column.slice(1)}: ${selectedOptions[column].join(', ')}`}
                            </span>
                        )
                )}
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'sans-serif' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f0f0f0', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }} onClick={() => handleSort('title')}>
                            Title {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ padding: '12px' }} onClick={() => handleSort('deckcode')}>
                            Deck Code {sortConfig.key === 'deckcode' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                        <th style={{ padding: '12px' }} onClick={() => handleFilterToggle('albums')}>
                            Albums {isDropdownOpen.albums ? '↑' : '↓'}
                        </th>
                        <th style={{ padding: '12px' }} onClick={() => handleFilterToggle('collections')}>
                            Collections {isDropdownOpen.collections ? '↑' : '↓'}
                        </th>
                        <th style={{ padding: '12px' }} onClick={() => handleFilterToggle('tags')}>
                            Tags {isDropdownOpen.tags ? '↑' : '↓'}
                        </th>
                        <th style={{ padding: '12px' }} onClick={() => handleSort('createdAt')}>
                            Last Updated {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isDropdownOpen.albums && (
                        <tr>
                            <td colSpan="6" style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '200px', overflowY: 'auto' }}>
                                    <input
                                        type="text"
                                        placeholder="Search albums..."
                                        onChange={(e) => handleSearchDropdown(e, 'albums')}
                                        style={{ marginBottom: '8px', padding: '6px' }}
                                    />
                                    {filterOptions(optionsAlbums, 'albums').map((option) => (
                                        <label key={option.value} style={{ padding: '8px 0' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.albums.includes(option.value)}
                                                onChange={() => handleOptionSelect('albums', option)}
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    )}
                    {isDropdownOpen.collections && (
                        <tr>
                            <td colSpan="6" style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '200px', overflowY: 'auto' }}>
                                    <input
                                        type="text"
                                        placeholder="Search collections..."
                                        onChange={(e) => handleSearchDropdown(e, 'collections')}
                                        style={{ marginBottom: '8px', padding: '6px' }}
                                    />
                                    {filterOptions(optionsCollections, 'collections').map((option) => (
                                        <label key={option.value} style={{ padding: '8px 0' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.collections.includes(option.value)}
                                                onChange={() => handleOptionSelect('collections', option)}
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    )}
                    {isDropdownOpen && isDropdownOpen.tags && (
                        <tr>
                            <td colSpan="6" style={{ padding: '12px', backgroundColor: '#f9f9f9' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', maxHeight: '200px', overflowY: 'auto' }}>
                                    <input
                                        type="text"
                                        placeholder="Search tags..."
                                        onChange={(e) => handleSearchDropdown(e, 'tags')}
                                        style={{ marginBottom: '8px', padding: '6px' }}
                                    />
                                    {filterOptions(optionsTags, 'tags').map((option) => (
                                        <label key={option.value} style={{ padding: '8px 0' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedOptions.tags.includes(option.value)}
                                                onChange={() => handleOptionSelect('tags', option)}
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    )}
                    {finalDecks && finalDecks.length > 0 ? (
                        finalDecks.map((deck) => (
                            <tr key={deck._id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>
                                    <a
                                        href={'https://cuetavern.com/decks/' + deck._id}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#1d4ed8', textDecoration: 'none', fontWeight: 'bold' }}
                                    >
                                        {deck.title}
                                    </a>
                                </td>
                                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{deck.deckcode}</td>
                                <td style={{ padding: '12px' }}>
                                    {deck.albums?.length > 0 && deck.albums.map((item, idx) => (
                                        <Pill key={idx} text={item} type={'Album'} />
                                    ))}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {deck.collections?.length > 0 && deck.collections.map((item, idx) => (
                                        <Pill key={idx} text={item} type={'Collection'} />
                                    ))}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {deck.tags?.length > 0 && deck.tags.map((item, idx) => (
                                        <Pill key={idx} text={item} type={'Tag'} />
                                    ))}
                                </td>
                                <td style={{ padding: '12px', fontFamily: 'monospace' }}>
                                    {deck.createdAt ? new Date(deck.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    }) : null}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{ padding: '12px', textAlign: 'center' }}>No decks found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CuratedDecks;