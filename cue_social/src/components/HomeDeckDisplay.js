import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../component_styles/homedeckdisplay.css';

const HomeDeckDisplay = ({
  decks,
  styleClass,
  handleDeckSearch,
  upvoteCheck,
  loggedInUser,
  setOne,
  setDecks,
  deleteDeck,
  deleteDeckFunction,
  editDeckFunction,
}) => {
  const a = styleClass.startsWith('custom') ? 'custom-' : '';

  // Define categories and remove 'Top Decks This Week' if toosmall
  const categories = [];

  if (decks.some(d => d.category === 'Top Decks This Week')) {
    categories.push('Top Decks This Week');
  }

  categories.push('Newest Decks', 'Top Decks All Time');

  // Group decks by category, but skip 'toosmall' category decks completely
  const decksByCategory = categories.reduce((acc, category) => {
    acc[category] = decks.filter(
      deck => deck.category === category && !deck.hidden
    );
    return acc;
  }, {});

  // Calculate gridTemplateColumns dynamically based on number of categories
  const gridTemplateColumns = `repeat(${categories.length}, 1fr)`;

  return (
    <div
      className={`${a}grid-container new-decks`}
      style={{
        display: 'grid',
        gridTemplateColumns,
        gap: '1rem',
        textAlign: 'center',
      }}
    >
      {categories.map((category, index) => (
        <div
          key={category}
          className={`${a}grid-column`}
          style={{
            borderLeft: index !== 0 ? '1px solid #ccc' : 'none', // no border on first visible col
            paddingLeft: index !== 0 ? '1rem' : '0',
          }}
        >
          <h2
            onClick={() => handleDeckSearch(category)}
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
          >
            {category}
          </h2>
          {decksByCategory[category].length === 0 ? (
            <p>No decks available</p>
          ) : (
            decksByCategory[category].map(deck => (
              <div key={deck._id} className={`${a}grid-item`} style={{ marginBottom: '1rem' }}>
                <div className="deck-info">
                  <div className="deck-title">
                    {deck.title}
                    {deck.deckcode !== 'null' && deck.deckcode !== '' && (
                      <span> ({deck.deckcode})</span>
                    )}
                    <br />
                    by{' '}
                    <Link
                      to={`/users/${deck.user}`}
                      style={{ textDecoration: 'underline' }}
                    >
                      {deck.user}
                    </Link>
                  </div>
                  <div className="deck-upvotes">
                    <span>Upvotes: </span>
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      onClick={() =>
                        upvoteCheck(deck, loggedInUser, setOne, ...setDecks)
                      }
                      style={{
                        cursor: 'pointer',
                        color:
                          loggedInUser && deck.voters.includes(loggedInUser.username)
                            ? 'yellow'
                            : 'inherit',
                      }}
                      className="thumbs-up-icon"
                    />
                    {deck.score}
                  </div>
                </div>
                <Link to={`/decks/${deck._id}`}>
                  {deck.image && (
                    <img
                      src={deck.image}
                      alt="Decklist"
                      className={`${a}deck-image`}
                      style={{ maxWidth: '100%', marginTop: '0.5rem' }}
                    />
                  )}
                </Link>

                {deleteDeck && (
                  <>
                    <button
                      onClick={() => editDeckFunction(deck)}
                      className={`${a}edit-button`}
                      style={{ marginTop: '10px', display: 'block', width: '100%' }}
                    >
                      <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
                      Edit Deck
                    </button>
                    <button
                      onClick={() => deleteDeckFunction(deck._id)}
                      className={`${a}delete-button`}
                      style={{ marginTop: '5px', display: 'block', width: '100%' }}
                    >
                      <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }} />
                      Delete Deck
                    </button>
                  </>
                )}
                <hr style={{ marginTop: '1rem' }} />
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
};

export default HomeDeckDisplay;
