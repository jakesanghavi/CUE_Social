import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTE } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
window.Buffer = window.Buffer || require("buffer").Buffer;

const DeckPage = ({ loggedInUser }) => {
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

  const upvoteCheck = async (deck) => {
    if (!loggedInUser || !loggedInUser.email) {
      return
    }

    const updateDeck = (deck) => {
      const isUpvoted = deck.voters.includes(loggedInUser.username);
      const newVoters = isUpvoted
        ? deck.voters.filter((voter) => voter !== loggedInUser.username)
        : [...deck.voters, loggedInUser.username];
      const newScore = isUpvoted ? deck.score - 1 : deck.score + 1;
      
      return { ...deck, voters: newVoters, score: newScore };
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
      setDeck(updateDeck);
    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  }

  if (!deck) return <div>Loading...</div>;

  return (
    <div>
      <h2>
        {deck.title} {deck.deckcode ? `- Deck Code: ${deck.deckcode}` : ''}
      </h2>
      <h3>Author: <Link to={`/users/${deck.user}`} style={{ color: 'black' }}>{deck.user}</Link></h3>
      <div className="deck-upvotes">
        <span>Upvotes: </span>
        <FontAwesomeIcon icon={faThumbsUp} onClick={() => upvoteCheck(deck)}
          style={{ cursor: 'pointer', color: loggedInUser && deck.voters.includes(loggedInUser.username) ? 'yellow' : 'inherit' }}
          className="thumbs-up-icon" />
        {deck.score}
      </div>
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