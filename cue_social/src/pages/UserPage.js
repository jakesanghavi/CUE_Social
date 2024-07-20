import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ROUTE } from '../constants';
import DeckDisplay from '../components/DeckDisplay';
window.Buffer = window.Buffer || require("buffer").Buffer;

const UserPage = ({ loggedInUser }) => {
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

  const upvoteCheck = async (deck) => {
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
      setDecks((prev) => updatedDecks(prev));
    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  }

  return (
    <div>
      <div>
        {userId ? <div>Username: {userId}</div> : null}
      </div>
      <div>
        <h2>Decks</h2>
        <div className="grid-container">
          <DeckDisplay decks={decks} styleClass={""} handleDeckSearch={null}
            upvoteCheck={upvoteCheck} loggedInUser={loggedInUser} deckType={null} />
        </div>
      </div>
    </div>
  );
};

export default UserPage;