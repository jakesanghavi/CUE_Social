import React, { useState, useCallback, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import Login from '../components/Login';
import SearchBar from '../components/SearchBar';
import '../component_styles/home.css';
import { Link } from 'react-router-dom';
import { ROUTE } from '../constants';

const Home = ({ loggedInUser, onLoginSuccess, uid }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDecks, setNewDecks] = useState(null);
  const [topDecks, setTopDecks] = useState(null);
  const limit = 10


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchDecks = useCallback(async (method) => {
    try {
      const albums = []
      const collections = []
      const tags = []
      const cards = []
      const sortBy = method

      const response = await fetch(`${ROUTE}/api/decks/search-decks?page=${1}&limit=${limit}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ albums, collections, tags, cards, sortBy })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch decks');
      }
      const data = await response.json();
      if (method === 'score') {
        setTopDecks(data.decks)
      }
      else {
        setNewDecks(data.decks)
      }
    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  }, []);

  useEffect(() => {
    fetchDecks('score');
    fetchDecks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="Home" id="home">
      <Login onLoginSuccess={onLoginSuccess} uid={uid} />
      <SearchBar />
      {loggedInUser && loggedInUser.email ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '50px 50px' }}>
          <button onClick={openModal} style={{ padding: '10px 5px' }}>
            Upload a deck
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '50px 50px' }}>
          <p>Please log in to start uploading decks!</p>
        </div>
      )}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>Close</button>
            <UploadForm loggedInUser={loggedInUser} closeModal={closeModal} />
          </div>
        </div>
      )}
      <div className="custom-grid-wrapper">
        {topDecks && (
          <div className="custom-grid-container top-decks" style={{ textAlign: 'center' }}>
            Most Popular Decks
            {topDecks.map(deck => (
              <div key={deck._id} className="custom-grid-item">
                <Link to={`/decks/${deck._id}`}>
                  <div>Title: {deck.title}</div>
                  {deck.image && (
                    <img
                      src={deck.image}
                      alt="Decklist"
                      className="custom-deck-image"
                    />
                  )}
                </Link>
                <hr />
              </div>
            ))}
          </div>
        )}
        {newDecks && (
          <div className="custom-grid-container new-decks" style={{ textAlign: 'center' }}>
            Newest Decks
            {newDecks.map(deck => (
              <div key={deck._id} className="custom-grid-item">
                <Link to={`/decks/${deck._id}`}>
                  <div>Title: {deck.title}</div>
                  {deck.image && (
                    <img
                      src={deck.image}
                      alt="Decklist"
                      className="custom-deck-image"
                    />
                  )}
                </Link>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
