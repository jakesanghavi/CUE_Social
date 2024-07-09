import React, { useEffect, useState } from 'react';
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

  // Function to fetch decks for the logged-in user
  const fetchDecksForUser = async (user) => {
    if (user) {
      try {
        const response = await fetch(`http://localhost:3008/api/decks/${user}`);
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

  // Make the user also navigate back to the home page when they log out
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
        <ul>
          {decks.map(deck => (
            <li key={deck._id}>
              <div>Title: {deck.title}</div>
              <div>Description: {deck.description}</div>
              {/* Render image if available */}
              {deck.image && (
                <img
                  src={`data:image/jpeg;base64,${Buffer.from(deck.image.data).toString('base64')}`}
                  alt="Deck Image"
                />
              )}
              <hr />
            </li>
          ))}
        </ul>
      </div>
      <button onClick={() => { onLogout(); backHome(); }}>
        Sign out
      </button>
    </div>
  );
};

export default Profile;
