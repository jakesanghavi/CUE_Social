import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTE } from '../constants';
window.Buffer = window.Buffer || require("buffer").Buffer;

const DeckPage = () => {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const response = await fetch(`${ROUTE}/api/decks/onedeck/${deckId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch deck');
        }
        const deckData = await response.json();
        setDeck(deckData);
      } catch (error) {
        console.error('Error fetching deck:', error);
      }
    };

    fetchDeck();
  }, [deckId]);

  if (!deck) return <div>Loading...</div>;

  return (
    <div>
      <h2>{deck.title} - Deck Code: ({deck.deckcode})</h2>
      <h3>Author: <Link to={`/users/${deck.user}`} style={{ color: 'black' }}>{deck.user}</Link></h3>
      <p>Description: {deck.description}</p>
      {deck.image && (
        <img
          src={deck.image} // Replace with your actual image URL
          alt="Decklist"
        />
      )}
      <div>
        <strong>Tags:</strong> {deck.tags}
      </div>
    </div>
  );
};

export default DeckPage;