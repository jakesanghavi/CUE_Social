import React, { useRef, useState } from 'react';
import '../component_styles/cardeditor.css'; // Custom CSS for positioning elements
import Modal from 'react-modal'; // Use a modal package, e.g., react-modal

// Styling for the modal (you can move this to your CSS file)
const customModalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Dimmed background
    zIndex: 1000, // Ensure modal is above other elements
  },
  content: {
    maxWidth: '500px',
    margin: 'auto', // Center horizontally
    padding: '20px',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f5f5f5', // Light gray background
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center', // Center content
  },
};

// Modal component for selecting or uploading an image
const CardEditor = ({ template, backgroundImage, foregroundImage, handleForegroundUpload, icons, onIconSelect, handleBackgroundUpload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedURL, setSelectedURL] = useState(''); // Dropdown selection
  const foregroundRef = useRef(null); // Ref for hidden file input

  const handleForegroundClick = () => {
    setIsModalOpen(true); // Open the modal on foreground click
  };

  const handleDropdownChange = (e) => {
    setSelectedURL(e.target.value); // Set the selected URL from the dropdown
  };

  const handleModalConfirm = () => {
    if (selectedURL) {
      if (selectedURL.length > 1) {
        handleForegroundUpload({ target: { files: [{ url: selectedURL }] } }); // Simulate file upload with URL
      }
      else {
        handleForegroundUpload({ target: { files: [{ url: icons[selectedURL] }] } })
      }
    }
    setIsModalOpen(false); // Close the modal
  };

  const handleFileChange = (e) => {
    handleForegroundUpload(e); // Upload the file
    setIsModalOpen(false); // Close the modal once a file is uploaded
  };


  // const handleIconSelect = (event) => {
  //   const selectedIndex = parseInt(event.target.value, 10);
  //   if (!isNaN(selectedIndex)) {
  //     onIconSelect(icons[selectedIndex]);
  //   }
  // };

  return (
    <div id="editor" className="editor">
      <div
        id="template-holder"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100%',
          lineHeight: '0',
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{
            opacity: 0,              // Make the input invisible
            position: 'absolute',     // Position it absolutely in the container
            left: 0,
            top: 0,
            width: '100%',            // Make it cover the entire div
            height: '100%',
            cursor: 'pointer',        // Show the pointer when hovering over it
          }}
          onChange={handleBackgroundUpload}
        />
        <img id="template" src={template.url} alt="Card Background" className="template-img" />
        <div
          onClick={handleForegroundClick}
          style={{
            minWidth: '10%',
            position: 'absolute',
            top: '62%',
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: 'move',
            height: '12%',
          }}
        >
          {foregroundImage && <img src={foregroundImage} alt="Foreground" style={{
            maxWidth: '100%', // Constrain the width of the image to the container
            maxHeight: '100%', // Constrain the height of the image to the container
            objectFit: 'contain', // Ensure the image scales properly within the div
          }} />}
        </div>
      </div>

      <div className="card-field" id="card-name" contentEditable={true}>Card Name</div>
      <div className="card-field" id="energy-cost" contentEditable={true}>?</div>
      <div className="card-field" id="power" contentEditable={true}>?</div>
      <div className="card-field" id="card-code" contentEditable={true}>CODE</div>
      <div className="card-field" id="ability-name" contentEditable={true}>Ability Name</div>
      <div className="card-field" id="ability-description" contentEditable={true}>Ability Description</div>

      {/* Modal for selecting foreground image */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customModalStyles}
        contentLabel="Foreground Upload"
      >
        <h2 style={{ marginBottom: '20px', fontWeight: 'bold', fontSize: '24px' }}>Select or Upload Foreground Image</h2>

        {/* Dropdown for predefined URLs */}
        <div style={{ marginBottom: '20px', width: '100%' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Select from existing images:
          </label>
          <select
            value={selectedURL}
            onChange={handleDropdownChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          >
            <option value="" disabled>Select an icon</option>
            {icons.map((icon, index) => (
              <option key={index} value={index}>
                {icon.name}
              </option>
            ))}
          </select>
        </div>

        {/* "OR" text */}
        <div style={{ margin: '20px 0', textAlign: 'center', fontSize: '20px', fontWeight: 'bold' }}>OR</div>

        {/* File Upload */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="file"
            accept="image/*"
            ref={foregroundRef} // Hidden input for file upload
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => foregroundRef.current.click()}
            style={{
              backgroundColor: '#007BFF',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              boxShadow: '0 5px 10px rgba(0, 123, 255, 0.2)',
            }}
          >
            Upload Your Own Image
          </button>
        </div>

        {/* Confirm and close modal */}
        <button
          onClick={handleModalConfirm}
          disabled={!selectedURL} // Disable if no option is selected
          style={{
            backgroundColor: selectedURL ? '#28a745' : '#ccc',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            cursor: selectedURL ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            boxShadow: selectedURL ? '0 5px 10px rgba(40, 167, 69, 0.2)' : 'none',
          }}
        >
          Confirm
        </button>
      </Modal>
    </div>
  );
};

export default CardEditor;
