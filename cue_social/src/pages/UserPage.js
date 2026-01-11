import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ROUTE } from '../constants';
import DeckDisplay from '../components/DeckDisplay';
import { upvoteCheck } from '../UsefulFunctions';
window.Buffer = window.Buffer || require("buffer").Buffer;

const UserPage = ({ loggedInUser }) => {
  const { userId } = useParams();
  const [decks, setDecks] = useState([]);
  const setOne = false
  const [page, setPage] = useState(1);
  const [totalDecks, setTotalDecks] = useState(0);
  const limit = 15;

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

  useEffect(() => {
    fetchDecksForUser(userId, page);
  }, [userId, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <div>
        {userId ? <div>Username: {userId}</div> : null}
      </div>
      <div>
        <h2>Decks</h2>
        <div className="grid-container">
          <DeckDisplay decks={decks} styleClass={""} handleDeckSearch={null}
            upvoteCheck={upvoteCheck} loggedInUser={loggedInUser} deckType={null} setOne={setOne} setDecks={[setDecks]} />
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
    </div>
  );
};

export default UserPage;