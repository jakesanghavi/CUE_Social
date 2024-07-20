import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import DeckDisplay from '../components/DeckDisplay';
import { ROUTE } from '../constants';
window.Buffer = window.Buffer || require("buffer").Buffer;

const DeckSearchResults = ({ loggedInUser }) => {
  const location = useLocation();
  const {
    selectedAlbums = [], selectedCollections = [], selectedTags = [], selectedCards = [], selectedUser = null, allCards = [], users = [], sortBy = 'score'
  } = location.state?.searchParams || {};

  const cards = selectedCards.map(card => card.label)
  const albums = selectedAlbums.map(album => album.value)
  const collections = selectedCollections.map(collection => collection.value)
  const tags = selectedTags.map(tag => tag.value)

  const [decks, setDecks] = useState(null);
  const [totalDecks, setTotalDecks] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 12;

  const fetchDecks = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await fetch(`${ROUTE}/api/decks/search-decks?page=${page}&limit=${limit}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ albums, collections, tags, cards, sortBy })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch decks');
      }
      const data = await response.json();
      setDecks(data.decks);
      setTotalDecks(data.totalDecks);
    } catch (error) {
      console.error('Error fetching decks:', error);
    } finally {
      setLoading(false);
    }
  }, [albums, collections, tags, cards, sortBy]);

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

  useEffect(() => {
    fetchDecks(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, location.state]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <SearchBar
        albumsPass={selectedAlbums}
        collectionsPass={selectedCollections}
        tagsPass={selectedTags}
        cardsPass={selectedCards}
        userPass={selectedUser}
        allCardsPass={allCards}
        usersPass={users}
      />
      <div style={{ padding: 0, margin: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        {loading ? (
          "Loading decks..."
        ) : decks.length === 0 ? (
          <h2>No decks found!</h2>
        ) : (
          <div>
            <h2>Search Results</h2>
            <div className="grid-container">
              <DeckDisplay decks={decks} styleClass={""} handleDeckSearch={null}
                upvoteCheck={upvoteCheck} loggedInUser={loggedInUser} deckType={null} />
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
        )}
      </div>
    </div>
  );
};

export default DeckSearchResults;