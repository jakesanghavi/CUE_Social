import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { ROUTE } from '../constants';
window.Buffer = window.Buffer || require("buffer").Buffer;

const DeckSearchResults = () => {
  const location = useLocation();
  const {
    selectedAlbums = [], selectedCollections = [], selectedTags = [], selectedCards = [], selectedUser = null, allCards = [], users = []
  } = location.state?.searchParams || {};

  const cards = selectedCards.map(card => card.label)
  const albums = selectedAlbums.map(album => album.value)
  const collections = selectedCollections.map(collection => collection.value)
  const tags = selectedTags.map(tag => tag.value)

  console.log(location.state.searchParams)

  const [decks, setDecks] = useState(null);
  const [totalDecks, setTotalDecks] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 12;

  const fetchDecks = useCallback(async (page) => {
    setLoading(true);
    console.log(cards)
    try {
      const response = await fetch(`${ROUTE}/api/decks/search-decks?page=${page}&limit=${limit}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ albums, collections, tags, cards })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch decks');
      }
      const data = await response.json();
      setDecks(data.decks);
      setTotalDecks(data.totalDecks);
    } catch (error) {
      console.error('Error fetching decks:', error);
    } finally {
      setLoading(false);
    }
  }, [albums, collections, tags, cards]);

  useEffect(() => {
    fetchDecks(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, location.state]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <SearchBar
        albumsPass={selectedAlbums}
        collectionsPass={selectedCollections}
        tagsPass={selectedTags}
        cardsPass={selectedCards}
        userPass={selectedUser}
        allCardsPass={allCards}
        usersPass={users}
      />
      <div style={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        {loading ? (
          "Loading decks..."
        ) : decks.length === 0 ? (
          <h2>No decks found!</h2>
        ) : (
          <div>
            <h2>Search Results</h2>
            <div className="grid-container">
              {decks.map(deck => (
                <div key={deck._id} className="grid-item">
                  <Link to={`/decks/${deck._id}`}>
                    <div>Title: {deck.title}</div>
                    {/* <div>Description: {deck.description}</div> */}
                    {deck.image && (
                      <img
                        src={deck.image} // Replace with your actual image URL
                        alt="Decklist"
                      />
                    )}
                  </Link>
                  <hr />
                </div>
              ))}
            </div>
            <div className="pagination-controls">
              {Array.from({ length: Math.ceil(totalDecks / limit) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={page === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeckSearchResults;