import React, { useEffect, useState } from 'react';
import { ROUTE } from '../constants';
import '../component_styles/profile.css';
import DeckDisplay from '../components/DeckDisplay';
import EditUploadForm from '../components/EditUploadForm';
import { upvoteCheck } from '../UsefulFunctions';
window.Buffer = window.Buffer || require("buffer").Buffer;

const Profile = ({ onLogout, loggedInUser }) => {
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalDecks, setTotalDecks] = useState(0);
  const [editDeck, setEditDeck] = useState(null); // State to manage the deck being edited
  const [deckToDelete, setDeckToDelete] = useState(null); // State to manage the deck being deleted
  const limit = 15;
  const setOne = false;

  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchDecksForUser(loggedInUser.username, page);
    }
  }, [loggedInUser, page]);

  const fetchDecksForUser = async (user, page) => {
    if (user) {
      try {
        const response = await fetch(`${ROUTE}/api/decks/${user}?page=${page}&limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch decks');
        }
        const decksData = await response.json();
        console.log(decksData);
        setDecks(decksData.decks);
        setTotalDecks(decksData.totalDecks);
      } catch (error) {
        console.error('Error fetching decks:', error);
      }
    }
  };

  const confirmDeleteDeck = (deckId) => {
    setDeckToDelete(deckId); // Set the deck to delete and show the confirmation modal
  };

  const deleteDeckFunction = async () => {
    if (!deckToDelete) return;

    try {
      const response = await fetch(`${ROUTE}/api/decks/deleteone/${deckToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to delete deck');
      }
      const result = await response.json();
      console.log('Deck deleted successfully:', result);
      setDecks(decks => decks.filter(deck => deck._id !== deckToDelete));
      setDeckToDelete(null); // Reset the delete state after successful deletion
    } catch (error) {
      console.error('Error deleting deck:', error);
    }
  };

  const editDeckFunction = async (body) => {
    setEditDeck(body);
  };

  const handleLogoutAndRedirect = () => {
    onLogout();
    console.log("Logout successful, waiting 1 second before redirecting...");
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const closeModal = () => {
    setEditDeck(null);
  };

  const closeDeleteModal = () => {
    setDeckToDelete(null); // Close the delete confirmation modal
  };

  const getCloudinaryImageUrl = (url, width) => {
    if (!url) return '';
    const parts = url.split('/upload/');
    if (parts.length < 2) return url;
    const publicId = parts[1];
    return `${parts[0]}/upload/w_${width}/${publicId}`;
  };

  return (
    <div>
      <div className="user-badge">
        {user ? <div className="username">Username: {user.username}</div> : null}
        <button onClick={handleLogoutAndRedirect}>Sign out</button>
      </div>
      {editDeck &&
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>Close</button>
            <EditUploadForm deckId={editDeck._id} loggedInUser={loggedInUser} file={getCloudinaryImageUrl(editDeck.image, 400)} cardData={editDeck.cards} oldDescription={editDeck.description} oldTitle={editDeck.title} oldSelectedAlbums={editDeck.albums} oldSelectedCollections={editDeck.collections} oldSelectedTags={editDeck.tags} closeModal={closeModal} />
          </div>
        </div>
      }
      {deckToDelete && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <p>Are you sure you want to delete this deck?</p>
            <div className="popup-buttons">
              <button onClick={deleteDeckFunction} className="popup-button confirm">Yes</button>
              <button onClick={closeDeleteModal} className="popup-button cancel">No</button>
            </div>
          </div>
        </div>
      )}
      <div>
        <h2>Decks</h2>
        <div className="grid-container">
          <DeckDisplay decks={decks} styleClass={""} handleDeckSearch={null}
            upvoteCheck={upvoteCheck} loggedInUser={loggedInUser} deckType={null} setOne={setOne} setDecks={[setDecks]} deleteDeck={true} deleteDeckFunction={confirmDeleteDeck} editDeckFunction={editDeckFunction} />
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

export default Profile;