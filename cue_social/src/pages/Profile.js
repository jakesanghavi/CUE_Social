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

  const handleLogoutAndRedirect = () => {
    onLogout();
    console.log("Logout successful, waiting 1 second before redirecting...");
    setTimeout(() => {
      window.location.href = '/';
    }, 700);
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
      </div>
      <button onClick={handleLogoutAndRedirect}>
        Sign out
      </button>
    </div>
  );
};

export default Profile;