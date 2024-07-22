import React, { useEffect, useState } from 'react';
import { ROUTE } from '../constants';
import '../component_styles/profile.css';
import DeckDisplay from '../components/DeckDisplay';
import { upvoteCheck } from '../UsefulFunctions';
window.Buffer = window.Buffer || require("buffer").Buffer;

const Profile = ({ onLogout, loggedInUser }) => {
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalDecks, setTotalDecks] = useState(0);
  const limit = 12;
  const setOne = false

  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchDecksForUser(loggedInUser.username, page);
    }
  }, [loggedInUser, page]);

  const fetchDecksForUser = async (user, page) => {
    if (user) {
      try {
        const response = await fetch(`${ROUTE}/api/decks/${user}?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch decks');
        }
        const decksData = await response.json();
        console.log(decksData)
        setDecks(decksData.decks);
        setTotalDecks(decksData.totalDecks);
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    }
  };

  const deleteDeckFunction = async (deckId) => {
    const userConfirmed = window.confirm('Are you sure you want to delete this deck?');
    if (!userConfirmed) {
      return; // Exit if the user cancels the confirmation
    }

    try {
      const response = await fetch(`${ROUTE}/api/decks/deleteone/${deckId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to delete deck');
      }
      const result = await response.json();
      // Update state or perform any other actions after deletion
      console.log('Deck deleted successfully:', result);
      // Optionally, you can remove the deleted deck from the UI
      setDecks(decks => decks.filter(deck => deck._id !== deckId));
    } catch (error) {
      console.error('Error deleting deck:', error);
    }
  };

  const handleLogoutAndRedirect = () => {
    onLogout();
    console.log("Logout successful, waiting 1 second before redirecting...");
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div>
        {user ? <div>Username: {user.username}</div> : null}
      </div>
      <div>
        <h2>Decks</h2>
        <div className="grid-container">
          <DeckDisplay decks={decks} styleClass={""} handleDeckSearch={null}
            upvoteCheck={upvoteCheck} loggedInUser={loggedInUser} deckType={null} setOne={setOne} setDecks={[setDecks]} deleteDeck={true} deleteDeckFunction={deleteDeckFunction} />
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
      <button onClick={handleLogoutAndRedirect}>
        Sign out
      </button>
    </div>
  );
};

export default Profile;