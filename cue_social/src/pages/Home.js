import React, { useState, useCallback, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import Login from '../components/Login';
import SearchBar from '../components/SearchBar';
import DeckDisplay from '../components/DeckDisplay';
import '../component_styles/home.css';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '../constants';
import { upvoteCheck } from '../UsefulFunctions'

const Home = ({ loggedInUser, onLoginSuccess, uid, openLoginModal }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDecks, setNewDecks] = useState(null);
  const [topDecks, setTopDecks] = useState(null);
  const [topDecksWeek, setTopDecksWeek] = useState(null);

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

  return (
    <div className="Home" id="home">
      <Login onLoginSuccess={onLoginSuccess} uid={uid} openLoginModal={openLoginModal} />
      <SearchBar />
      {loggedInUser && loggedInUser.email ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '50px 50px' }}>
          <button onClick={openModal} className='modern-button'>
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
        <DeckDisplay decks={topDecksWeek} styleClass={"custom"} handleDeckSearch={handleDeckSearch} sortBy={'score'} restricted={'yes'}
          upvoteCheck={upvoteCheck} loggedInUser={loggedInUser} deckType={"Top Decks This Week"} setOne={setOne} setDecks={[setTopDecks, setTopDecksWeek, setNewDecks]} />
        <div className="vertical-line"></div>
        <DeckDisplay decks={newDecks} styleClass={"custom"} handleDeckSearch={handleDeckSearch} sortBy={'new'}
          upvoteCheck={upvoteCheck} loggedInUser={loggedInUser} deckType={"Newest Decks"} setOne={setOne} setDecks={[setTopDecks, setTopDecksWeek, setNewDecks]} />
        <div className="vertical-line second-line"></div>
        <DeckDisplay decks={topDecks} styleClass={"custom"} handleDeckSearch={handleDeckSearch} sortBy={'score'}
          upvoteCheck={upvoteCheck} loggedInUser={loggedInUser} deckType={"Top Decks All Time"} setOne={setOne} setDecks={[setTopDecks, setTopDecksWeek, setNewDecks]} />
      </div>
    </div >
  );
}

export default Home;
