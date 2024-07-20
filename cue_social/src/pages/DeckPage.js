import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTE } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { upvoteCheck } from '../UsefulFunctions';
import '../component_styles/deckpage.css';
window.Buffer = window.Buffer || require("buffer").Buffer;

const DeckPage = ({ loggedInUser }) => {
  const { deckId } = useParams();
  const [deck, setDeck] = useState(null);
  const setOne = true;

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
    <div className='deck-details'>
      <h2 className='deckTitle'>
        {deck.title} {deck.deckcode !== 'null' ? `- Deck Code: ${deck.deckcode}` : ''}
      </h2>
      <h3 className='deckAuthor'>Author: <Link to={`/users/${deck.user}`} style={{ color: 'black' }}>{deck.user}</Link></h3>
      <div className="deck-upvotes">
        <span>Upvotes: </span>
        <FontAwesomeIcon icon={faThumbsUp} onClick={() => upvoteCheck(deck, loggedInUser, setOne, ...[setDeck])}
          style={{ cursor: 'pointer', color: loggedInUser && deck.voters.includes(loggedInUser.username) ? 'yellow' : 'inherit' }}
          className="thumbs-up-icon" />
        {deck.score}
      </div>
      <p className='deckDescription'>Description: {deck.description}</p>
      {deck.image && (
        <img
          src={deck.image} // Replace with your actual image URL
          alt="Decklist"
          className='deckImage'
        />
      )}
      <div>
        <strong>Tags:</strong> {deck.tags}
      </div>
    </div>
  );
};

export default DeckPage;