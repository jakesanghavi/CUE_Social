import React, { useState, useCallback, useEffect, useMemo } from 'react';
import UploadForm from '../components/UploadForm';
import Login from '../components/Login';
import SearchBar from '../components/SearchBar';
import HomeDeckDisplay from '../components/HomeDeckDisplay.js';
import '../component_styles/decklist.css';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '../constants';
import { upvoteCheck } from '../UsefulFunctions'

const DeckList = ({ loggedInUser, onLoginSuccess, uid, openLoginModal }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDecks, setNewDecks] = useState([]);
  const [topDecks, setTopDecks] = useState([]);
  const [topDecksWeek, setTopDecksWeek] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const limit = 5
  const setOne = false

  const handleDeckSearch = (sortBy, restricted) => {
    console.log(sortBy)
    console.log(restricted)
    const searchParams = {
      selectedAlbums: [],
      selectedCollections: [],
      selectedTags: [],
      selectedCards: [],
      // selectedUser: [],
      // cards: [],
      // users: [],
      sortBy,
      restricted: restricted
    };
    navigate('/deck-search-results', { state: { searchParams } });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const fetchDecks = useCallback(async (method, restricted) => {
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
        body: JSON.stringify({ albums, collections, tags, cards, sortBy, restricted })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch decks');
      }
      const data = await response.json();
      if (restricted) {
        setTopDecksWeek(data.decks)
      }
      else if (method === 'score') {
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
    fetchDecks('score', 'yes')
    fetchDecks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const combinedDecks = useMemo(() => {
    let decksThisWeek = [];

    if (windowWidth >= 850) {
      if (topDecksWeek?.length > 0) {
        decksThisWeek = topDecksWeek.map(deck => ({
          ...deck,
          category: 'Top Decks This Week',
        }));
      } else {
        // Include a dummy deck only to preserve the category
        decksThisWeek = [{
          id: '__placeholder__',
          category: 'Top Decks This Week',
          hidden: true
        }];
      }
    }
    // If windowWidth < 850, decksThisWeek stays empty → no first column

    const newDecksLabeled = newDecks
      ? newDecks.map(deck => ({ ...deck, category: 'Newest Decks' }))
      : [];

    const topDecksLabeled = topDecks
      ? topDecks.map(deck => ({ ...deck, category: 'Top Decks All Time' }))
      : [];

    return [...decksThisWeek, ...newDecksLabeled, ...topDecksLabeled];
  }, [windowWidth, topDecksWeek, newDecks, topDecks]);

  return (
    <div className="Home" id="home">
      <Login onLoginSuccess={onLoginSuccess} uid={uid} openLoginModal={openLoginModal} />
      <SearchBar loggedInUser={loggedInUser} openModal={openModal} />
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>Close</button>
            <UploadForm loggedInUser={loggedInUser} closeModal={closeModal} />
          </div>
        </div>
      )}

      <HomeDeckDisplay
        decks={combinedDecks}
        styleClass="custom"
        handleDeckSearch={handleDeckSearch}
        upvoteCheck={upvoteCheck}
        loggedInUser={loggedInUser}
        setOne={setOne}
      />
    </div >
  );
}

export default DeckList;