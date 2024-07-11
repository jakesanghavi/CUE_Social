import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
      <h2>{deck.title}</h2>
      <p>{deck.description}</p>
      {deck.image && (
        <img
          src={`data:image/jpeg;base64,${Buffer.from(deck.image.data).toString('base64')}`}
          alt="Decklist"
        />
      )}
      <div>
        <strong>Tags:</strong> {deck.tags}
      </div>
      <div>
        <strong>Deck Code:</strong> {deck.deckcode}
      </div>
    </div>
  );
};

export default DeckPage;