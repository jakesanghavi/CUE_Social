import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import Login from '../components/Login';
import SearchBar from '../components/SearchBar';
import '../component_styles/home.css';

const Home = ({ loggedInUser, onLoginSuccess, uid }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="Home" id="home">
      <Login onLoginSuccess={onLoginSuccess} uid={uid} />
      <SearchBar />
      {loggedInUser && loggedInUser.email ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '50px 50px' }}>
          <button onClick={openModal} style={{ padding: '10px 5px' }}>
            Upload a deck
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '50px 50px' }}>
          <p>Please log in to start uploading decks!</p>
        </div>
      )}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>Close</button>
            <UploadForm loggedInUser={loggedInUser} closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
