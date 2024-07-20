import React, { useState, useCallback, useEffect } from 'react';
import UploadForm from '../components/UploadForm';
import Login from '../components/Login';
import SearchBar from '../components/SearchBar';
import '../component_styles/home.css';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTE } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

const Home = ({ loggedInUser, onLoginSuccess, uid }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDecks, setNewDecks] = useState(null);
  const [topDecks, setTopDecks] = useState(null);
  const [topDecksWeek, setTopDecksWeek] = useState(null);

  const limit = 5

  const handleDeckSearch = (sortBy, restricted) => {
    const searchParams = {
      selectedAlbums: [],
      selectedCollections: [],
      selectedTags: [],
      selectedCards: [],
      selectedUser: [],
      cards: [],
      users: [],
      sortBy,
      restricted
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
        console.log(data.decks)
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

  const upvoteCheck = async (deck) => {
    console.log(deck)
    if (!loggedInUser || !loggedInUser.email) {
      return
    }

    const updatedDecks = (decks) => {
      return decks.map((d) => {
        if (d._id === deck._id) {
          const isUpvoted = d.voters.includes(loggedInUser.username);
          const newVoters = isUpvoted
            ? d.voters.filter((voter) => voter !== loggedInUser.username)
            : [...d.voters, loggedInUser.username];
          const newScore = isUpvoted ? d.score - 1 : d.score + 1;
          return { ...d, voters: newVoters, score: newScore };
        }
        return d;
      });
    };

    try {
      const response = await fetch(`${ROUTE}/api/decks/onedeck/${deck._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch decks');
      }
      const data = await response.json();
      let voters = data.voters;

      if (voters.includes(loggedInUser.username)) {
        voters = voters.filter(voter => voter !== loggedInUser.username);

        try {
          const change = 'decrease'
          const response = await fetch(`${ROUTE}/api/decks/onedeck/${deck._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ voters, change })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch decks');
          }
        } catch (error) {
          console.error('Error fetching decks:', error);
        }
      }
      else {
        voters.push(loggedInUser.username)
        try {
          const change = 'increase'
          const response = await fetch(`${ROUTE}/api/decks/onedeck/${deck._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ voters, change })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch decks');
          }
        } catch (error) {
          console.error('Error fetching decks:', error);
        }
      }

      setTopDecks((prev) => updatedDecks(prev));
      setTopDecksWeek((prev) => updatedDecks(prev));
      setNewDecks((prev) => updatedDecks(prev));

    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  }

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
            <span onClick={() => handleDeckSearch('score', null)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Top Decks All Time</span>
            {topDecks.map(deck => (
              <div key={deck._id} className="custom-grid-item">
                <div className="deck-info">
                  <div className="deck-title">
                    {deck.title}{deck.deckcode && <span> ({deck.deckcode})</span>}<br />
                    by <Link to={`/users/${deck.user}`} style={{ textDecoration: 'underline' }}>{deck.user}</Link>
                  </div>
                  <div className="deck-upvotes">
                    <span>Upvotes: </span>
                    <FontAwesomeIcon icon={faThumbsUp} onClick={() => upvoteCheck(deck)}
                      style={{ cursor: 'pointer', color: loggedInUser && deck.voters.includes(loggedInUser.username) ? 'yellow' : 'inherit' }}
                      className="thumbs-up-icon" />
                    {deck.score}
                  </div>
                </div>
                <Link to={`/decks/${deck._id}`}>
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
        {topDecksWeek && (
          <div className="custom-grid-container top-decks" style={{ textAlign: 'center' }}>
            <span onClick={() => handleDeckSearch('score', 'yes')} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Top Decks This League</span>
            {topDecksWeek.map(deck => (
              <div key={deck._id} className="custom-grid-item">
                <div className="deck-info">
                  <div className="deck-title">
                    {deck.title}{deck.deckcode && <span> ({deck.deckcode})</span>}<br />
                    by <Link to={`/users/${deck.user}`} style={{ textDecoration: 'underline' }}>{deck.user}</Link>
                  </div>
                  <div className="deck-upvotes">
                    <span>Upvotes: </span>
                    <FontAwesomeIcon icon={faThumbsUp} onClick={() => upvoteCheck(deck)}
                      style={{ cursor: 'pointer', color: loggedInUser && deck.voters.includes(loggedInUser.username) ? 'yellow' : 'inherit' }}
                      className="thumbs-up-icon" />
                    {deck.score}
                  </div>
                </div>
                <Link to={`/decks/${deck._id}`}>
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
            <span onClick={() => handleDeckSearch('', null)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>Newest Decks</span>
            {newDecks.map(deck => (
              <div key={deck._id} className="custom-grid-item">

                <div className="deck-info">
                  <div className="deck-title">
                    {deck.title}{deck.deckcode && <span> ({deck.deckcode})</span>}<br />
                    by <Link to={`/users/${deck.user}`} style={{ textDecoration: 'underline' }}>{deck.user}</Link>
                  </div>
                  <div className="deck-upvotes">
                    <span>Upvotes: </span>
                    <FontAwesomeIcon icon={faThumbsUp} onClick={() => upvoteCheck(deck)}
                      style={{ cursor: 'pointer', color: loggedInUser && deck.voters.includes(loggedInUser.username) ? 'yellow' : 'inherit' }}
                      className="thumbs-up-icon" />
                    {deck.score}
                  </div>
                </div>
                <Link to={`/decks/${deck._id}`}>
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
    </div >
  );
}

export default Home;
