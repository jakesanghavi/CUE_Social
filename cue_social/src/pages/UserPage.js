import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTE } from '../constants';
window.Buffer = window.Buffer || require("buffer").Buffer;

const UserPage = () => {
  const { userId } = useParams();
  const [decks, setDecks] = useState([]);

  const fetchDecksForUser = useCallback(async (user) => {
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
  }, []);

  useEffect(() => {
    fetchDecksForUser(userId);
  }, [userId, fetchDecksForUser]);

  return (
    <div>
      <div>
        {userId ? <div>Username: {userId}</div> : null}
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
    </div>
  );
};

export default UserPage;