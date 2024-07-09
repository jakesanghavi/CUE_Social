import React, { useState } from 'react';
import UploadForm from '../components/UploadForm';
import Login from '../components/Login';
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
      {loggedInUser && loggedInUser.email && (
        <button onClick={openModal}>
          Upload a deck
        </button>
      )}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>Close</button>
            <UploadForm loggedInUser={loggedInUser} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
