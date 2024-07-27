import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../component_styles/deckdisplay.css';

const DeckDisplay = ({ decks, styleClass, handleDeckSearch, sortBy, restricted, upvoteCheck, loggedInUser, deckType, setOne, setDecks, deleteDeck, deleteDeckFunction, editDeckFunction }) => {
    const a = styleClass.startsWith("custom") ? "custom-" : "";

    return (
        <>
            {decks && (
                <div className={`${a}grid-container new-decks`} style={{ textAlign: 'center' }}>
                    {deckType && <h2 onClick={() => handleDeckSearch(sortBy, restricted)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{deckType}</h2>}
                    {decks.map(deck => (
                        <div key={deck._id} className={`${a}grid-item`}>
                            <div className="deck-info">
                                <div className="deck-title">
                                    {deck.title}{deck.deckcode !== 'null' && deck.deckcode !== "" && <span> ({deck.deckcode})</span>}<br />
                                    by <Link to={`/users/${deck.user}`} style={{ textDecoration: 'underline' }}>{deck.user}</Link>
                                </div>
                                <div className="deck-upvotes">
                                    <span>Upvotes: </span>
                                    <FontAwesomeIcon icon={faThumbsUp} onClick={() => upvoteCheck(deck, loggedInUser, setOne, ...setDecks)}
                                        style={{ cursor: 'pointer', color: loggedInUser && deck.voters.includes(loggedInUser.username) ? 'yellow' : 'inherit' }}
                                        className="thumbs-up-icon" />
                                    {deck.score}
                                </div>
                            </div>
                            <Link to={`/decks/${deck._id}`}>
                                {deck.image && (
                                    <img
                                        src={deck.image}
                                        alt="Decklist"
                                        className={`${a}deck-image`}
                                    />
                                )}
                            </Link>
                            {deleteDeck && (
                                <button
                                    onClick={() => editDeckFunction(deck)}
                                    className={`${a}edit-button`}
                                    style={{ display: 'block', margin: '10px auto' }}
                                >
                                    <FontAwesomeIcon icon={faEdit} style={{ marginRight: '5px' }} />
                                    Edit Deck
                                </button>
                            )}
                            {deleteDeck && (
                                <button
                                    onClick={() => deleteDeckFunction(deck._id)}
                                    className={`${a}delete-button`}
                                    style={{ display: 'block', margin: '10px auto' }}
                                >
                                    <FontAwesomeIcon icon={faTrash} style={{ marginRight: '5px' }} />
                                    Delete Deck
                                </button>
                            )}
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default DeckDisplay;