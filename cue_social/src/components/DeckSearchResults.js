import React, { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTE } from '../constants';
import '../component_styles/profile.css';
window.Buffer = window.Buffer || require("buffer").Buffer;

const DeckSearchResults = () => {
  const location = useLocation();
  const { searchParams } = location.state;
  const [decks, setDecks] = useState(null);
  const [totalDecks, setTotalDecks] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true); // State for loading animation
  const limit = 12;

  const fetchDecks = useCallback(async (page) => {
    setLoading(true); // Set loading to true when fetching decks
    try {
      const response = await fetch(`${ROUTE}/api/decks/search-decks?page=${page}&limit=${limit}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchParams)
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
      setLoading(false); // Set loading to false when fetch completes (success or error)
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDecks(page);
  }, [searchParams, page, fetchDecks]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Loading state
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
      Loading decks...</div>;
  }

  // No decks found state
  if (!loading && decks.length === 0) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
      <h2>No decks found!</h2></div>;
  }

  // Decks list
  return (
    <div>
      <div>
        <h2>Search Results</h2>
        <div className="grid-container">
          {decks.map(deck => (
            <div key={deck._id} className="grid-item">
              <Link to={`/decks/${deck._id}`}>
                <div>Title: {deck.title}</div>
                <div>Description: {deck.description}</div>
                {deck.image && (
                  <img
                    src={`data:image/jpeg;base64,${Buffer.from(deck.image.data).toString('base64')}`}
                    alt="Decklist"
                  />
                )}
              </Link>
              <hr />
            </div>
          ))}
        </div>
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
  );
};

export default DeckSearchResults;