import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { optionsAlbums, optionsCollections, optionsTags, customStylesAlbums, customStylesCards, customStylesCollections, customStylesTags } from '../selectedStyles';

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
    const [sortBy, setSortBy] = useState('score')

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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                            placeholder="Search for Albums"
                            styles={customStylesAlbums}
                        />
                        <Select
                            isMulti
                            options={optionsCollections}
                            value={selectedCollections}
                            onChange={setSelectedCollections}
                            placeholder="Search for Collections"
                            styles={customStylesCollections}
                        />
                        <Select
                            isMulti
                            options={optionsTags}
                            value={selectedTags}
                            onChange={setSelectedTags}
                            placeholder="Search for Tags"
                            styles={customStylesTags}
                        />
                        <Select
                            isMulti
                            options={cards}
                            value={selectedCards}
                            onChange={setSelectedCards}
                            placeholder="Search for Cards"
                            styles={customStylesCards}
                        />
                        <Select
                            options={optionsSort}
                            value={sortBy}
                            onChange={setSortBy}
                            placeholder="Sort (Default: Most Popular)"
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