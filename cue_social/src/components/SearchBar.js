import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { optionsAlbums, optionsCollections, optionsTags, customStylesAlbums, customStylesCards, customStylesCollections, customStylesTags } from '../selectedStyles';

const customStyles = {
    dropdownIndicator: (provided) => ({
        ...provided,
        display: 'none'
    }),
    indicatorSeparator: () => ({
        display: 'none', // Hide the separator if not needed
    }),
    control: (provided) => ({
        ...provided,
        borderRadius: '2px', // Optional: adjust border radius if needed
        boxShadow: 'none', // Remove box shadow if you prefer a flat look
        padding: '0 2px', // Adjust padding to reduce space
    }),
    input: (provided) => ({
        ...provided,
        margin: 0, // Adjust margin to keep the input aligned
    }),
    placeholder: (provided) => ({
        ...provided,
        margin: 0, // Remove extra margin from placeholder
    }),
};

const SearchBar = ({ albumsPass = [], collectionsPass = [], tagsPass = [], cardsPass = [], userPass = [], allCardsPass = [], usersPass = [] }) => {
    const navigate = useNavigate();
    const [selectedAlbums, setSelectedAlbums] = useState(albumsPass);
    const [selectedCollections, setSelectedCollections] = useState(collectionsPass);
    const [selectedTags, setSelectedTags] = useState(tagsPass);
    const [cards, setCards] = useState(allCardsPass);
    const [users, setUsers] = useState(usersPass);
    const [selectedCards, setSelectedCards] = useState(cardsPass);
    const [selectedUser, setSelectedUser] = useState(userPass);
    const [searchType, setSearchType] = useState('decks'); // Default to 'decks'
    const [sortBy, setSortBy] = useState('score');
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fontSize = viewportWidth > 768 ? '16px' : '12px';

    const optionsSort = [{ value: 'score', label: 'Most Popular' }, { value: 'new', label: 'Newest' }]

    const handleDeckSearch = () => {
        const searchParams = {
            selectedAlbums,
            selectedCollections,
            selectedTags,
            selectedCards,
            selectedUser,
            cards,
            users,
            sortBy
        };
        navigate('/deck-search-results', { state: { searchParams } });
    };


    const renameKey = (obj, oldKey, newKey) => {
        if (oldKey in obj) {
            obj[newKey] = obj[oldKey];
            delete obj[oldKey];
        }
        return obj;
    };

    const fetchCards = useCallback(async () => {
        try {
            const response = await fetch(`${ROUTE}/api/cards/`);
            if (!response.ok) {
                throw new Error('Failed to fetch cards');
            }
            const cardsData = await response.json();
            const renamedData = cardsData.map(item => renameKey(item, 'Name', 'label')).map(item => renameKey(item, 'Code', 'value'));
            setCards(renamedData);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }, []); // Dependency array is empty assuming no external dependencies

    useEffect(() => {
        fetchCards();
    }, [fetchCards]); // useEffect dependency on fetchCards function

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`${ROUTE}/api/users/getall/`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const userData = await response.json();
            const renamedData = userData.map(item => renameKey(item, 'username', 'label'));
            renamedData['value'] = renamedData['label'];
            setUsers(userData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: fontSize }}>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={() => setSearchType('decks')} style={{ marginRight: '10px', padding: '8px' }}>
                    Search for Decks
                </button>
                <button onClick={() => setSearchType('users')} style={{ padding: '8px' }}>
                    Search for Users
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {searchType === 'decks' && (
                    <>
                        <Select
                            isMulti
                            options={optionsAlbums}
                            value={selectedAlbums}
                            onChange={setSelectedAlbums}
                            placeholder="Add Albums"
                            styles={{ ...customStyles, ...customStylesAlbums }}
                        />
                        <Select
                            isMulti
                            options={optionsCollections}
                            value={selectedCollections}
                            onChange={setSelectedCollections}
                            placeholder="Add Collections"
                            styles={{ ...customStyles, ...customStylesCollections }}
                        />
                        <Select
                            isMulti
                            options={optionsTags}
                            value={selectedTags}
                            onChange={setSelectedTags}
                            placeholder="Add Tags"
                            styles={{ ...customStyles, ...customStylesTags }}
                        />
                        <Select
                            isMulti
                            options={cards}
                            value={selectedCards}
                            onChange={setSelectedCards}
                            placeholder="Add Cards"
                            styles={{ ...customStyles, ...customStylesCards }}
                        />
                        <Select
                            options={optionsSort}
                            value={sortBy}
                            onChange={setSortBy}
                            placeholder="Sort Decks"
                            styles={customStyles}
                        />
                    </>
                )}

                {searchType === 'users' && (
                    <>
                        <Select
                            options={users} // Replace with user search options
                            onChange={setSelectedUser}
                            placeholder="Search for a User"
                        />
                    </>
                )}
                {searchType === 'decks' && (
                    <>
                        <button onClick={handleDeckSearch} style={{ marginLeft: '5px', padding: '8px' }}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </>
                )}
                {searchType === 'users' && (
                    <>
                        {selectedUser && (
                            <Link to={{ pathname: `/users/${selectedUser.label}`, state: { selectedAlbums, selectedCollections, selectedTags, selectedCards, selectedUser, cards, users } }}
                            >
                                <button style={{ marginLeft: '5px', padding: '8px' }}>
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
                            </Link>
                        )}
                        {!selectedUser && (
                            <button style={{ marginLeft: '5px', padding: '8px' }} disabled={true}>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        )}
                    </>
                )}
            </div>

        </div>
    );
};

export default SearchBar;