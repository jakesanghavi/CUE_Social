import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTE } from '../constants';
import '../component_styles/profile.css';
window.Buffer = window.Buffer || require("buffer").Buffer;

const Profile = ({ onLogout, loggedInUser }) => {
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchDecksForUser(loggedInUser.username);
    }
  }, [loggedInUser]);

  const fetchDecksForUser = async (user) => {
    if (user) {
      try {
        const response = await fetch(`${ROUTE}/api/decks/${user}`);
        if (!response.ok) {
          throw new Error('Failed to fetch decks');
        }
        const decksData = await response.json();
        setDecks(decksData);
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    }
  };

  const backHome = () => {
    window.location.href = '/';
  };

  return (
    <div>
      <div>
        {user ? <div>Username: {user.username}</div> : null}
      </div>
      <div>
        <h2>Decks</h2>
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
      <button onClick={() => { onLogout(); backHome(); }}>
        Sign out
      </button>
    </div>
  );
};

export default Profile;