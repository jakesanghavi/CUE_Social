import React, { useRef, useState, useEffect } from 'react';
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
const CardEditor = ({ template, backgroundImage, foregroundImage, handleForegroundUpload, icons, handleBackgroundUpload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedURL, setSelectedURL] = useState(''); // Dropdown selection
  const foregroundRef = useRef(null); // Ref for hidden file input
  const [dragging, setDragging] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null); // Ref to track the image's position
  const [isDragging, setIsDragging] = useState(false); // New state to track dragging
  const [scale, setScale] = useState(1); // Track zoom scale
  const [fgdragging, fgsetDragging] = useState(false);
  const [fgimagePosition, fgsetImagePosition] = useState({ x: 0, y: 0 });
  const fgimageRef = useRef(null); // Ref to track the image's position
  const [fgisDragging, fgsetIsDragging] = useState(false); // New state to track dragging
  const [fgscale, fgsetScale] = useState(1); // Track zoom scale
  const templateRef = useRef(null); // Ref to track the image's position
  const fgRef = useRef(null); // Ref to track the image's position

  useEffect(() => {
    const imageElement = templateRef.current;
    const fgImageElement = fgRef.current;

    // Add event listener for background zoom
    if (imageElement) {
      imageElement.addEventListener('wheel', handleWheelZoom, { passive: false });
    }

    // Add event listener for foreground zoom
    if (fgImageElement) {
      fgImageElement.addEventListener('wheel', fghandleWheelZoom, { passive: false });
    }

    // Cleanup the event listeners when component unmounts
    return () => {
      console.log('glb')
      if (imageElement) {
        imageElement.removeEventListener('wheel', handleWheelZoom, { passive: false });
      }
      if (fgImageElement) {
        fgImageElement.removeEventListener('wheel', fghandleWheelZoom, { passive: false });
      }
    };
  }, []);

  const handleWheelZoom = (e) => {
    console.log(e)
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.97 : 1.03; // Zoom out on scroll down, zoom in on scroll up
    setScale((prevScale) => Math.max(0.5, Math.min(prevScale * scaleChange, 3))); // Limit zoom scale between 0.5 and 3
  };

  // const handlePinchZoom = (e) => {
  //   if (e.touches.length === 2) {
  //     e.preventDefault(); // Prevent the page zoom
  //     const dist = Math.hypot(
  //       e.touches[0].clientX - e.touches[1].clientX,
  //       e.touches[0].clientY - e.touches[1].clientY
  //     );
  //     const scaleChange = dist / (imageRef.current?.prevDist || dist);
  //     setScale((prevScale) => Math.max(0.5, Math.min(prevScale * scaleChange, 3)));
  //     imageRef.current.prevDist = dist; // Store the current distance
  //   }
  // };

  const handleTouchEnd = () => {
    imageRef.current.prevDist = null; // Reset previous distance on touch end
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setIsDragging(false); // Reset dragging state on mouse down
    imageRef.current = { startX: e.clientX, startY: e.clientY }; // Track the starting mouse position
  };

  const handleMouseMove = (e) => {
    if (fgdragging) return; // Prevent background dragging if foreground is dragging
    if (dragging) {
      const dx = e.clientX - imageRef.current.startX;
      const dy = e.clientY - imageRef.current.startY;
      setImagePosition(prevPos => ({
        x: prevPos.x + dx,
        y: prevPos.y + dy,
      }));
      imageRef.current.startX = e.clientX;
      imageRef.current.startY = e.clientY;
      setIsDragging(true); // Set dragging to true during mouse move
    }
  };

  const handleMouseUp = () => {
    if (fgdragging) return; // Prevent background stop if foreground is dragging
    setDragging(false);
  };

  const fghandleWheelZoom = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const scaleChange = e.deltaY > 0 ? 0.97 : 1.03; // Zoom out on scroll down, zoom in on scroll up
    fgsetScale((prevScale) => Math.max(0.5, Math.min(prevScale * scaleChange, 3))); // Limit zoom scale between 0.5 and 3
  };

  // const fghandlePinchZoom = (e) => {
  //   if (e.touches.length === 2) {
  //     e.preventDefault(); // Prevent the page zoom
  //     const dist = Math.hypot(
  //       e.touches[0].clientX - e.touches[1].clientX,
  //       e.touches[0].clientY - e.touches[1].clientY
  //     );
  //     const scaleChange = dist / (fgimageRef.current?.prevDist || dist);
  //     fgsetScale((prevScale) => Math.max(0.5, Math.min(prevScale * scaleChange, 3)));
  //     fgimageRef.current.prevDist = dist; // Store the current distance
  //   }
  // };
  

  const fghandleTouchEnd = () => {
    fgimageRef.current.prevDist = null; // Reset previous distance on touch end
  };

  const fghandleMouseDown = (e) => {
    e.stopPropagation();  // Prevent event from reaching parent
    fgsetDragging(true);
    fgsetIsDragging(false); // Reset dragging state on mouse down
    fgimageRef.current = { startX: e.clientX, startY: e.clientY }; // Track the starting mouse position
  };

  const fghandleMouseMove = (e) => {
    e.stopPropagation();  // Prevent event from reaching parent
    if (fgdragging) {
      const dx = e.clientX - fgimageRef.current.startX;
      const dy = e.clientY - fgimageRef.current.startY;
      fgsetImagePosition(prevPos => ({
        x: prevPos.x + dx,
        y: prevPos.y + dy,
      }));
      fgimageRef.current.startX = e.clientX;
      fgimageRef.current.startY = e.clientY;
      fgsetIsDragging(true); // Set dragging to true during mouse move
    }
  };

  const fghandleMouseUp = () => {
    fgsetDragging(false);
  };

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
    if (fgisDragging) {
      e.preventDefault(); // Prevent the click if dragging
    }
    handleForegroundUpload(e); // Upload the file
    setIsModalOpen(false); // Close the modal once a file is uploaded
  };

  const handleBackgroundUploadClick = (e) => {
    if (isDragging) {
      e.preventDefault(); // Prevent the click if dragging
    }
  };

  const handleTouchStart = (e) => {
    setDragging(true);
    setIsDragging(false); 
    const touch = e.touches[0];
    imageRef.current = { startX: touch.clientX, startY: touch.clientY };
  };
  
  const handleTouchMove = (e) => {
    if (fgdragging) return; // Prevent background dragging if foreground is dragging
    if (dragging) {
      const touch = e.touches[0];
      const dx = touch.clientX - imageRef.current.startX;
      const dy = touch.clientY - imageRef.current.startY;
      setImagePosition(prevPos => ({
        x: prevPos.x + dx,
        y: prevPos.y + dy,
      }));
      imageRef.current.startX = touch.clientX;
      imageRef.current.startY = touch.clientY;
      setIsDragging(true); // Set dragging to true during touch move
    }
  };

  const fghandleTouchStart = (e) => {
    e.stopPropagation();
    fgsetDragging(true);
    fgsetIsDragging(false); 
    const touch = e.touches[0];
    fgimageRef.current = { startX: touch.clientX, startY: touch.clientY };
  };
  
  const fghandleTouchMove = (e) => {
    if (fgdragging) {
      const touch = e.touches[0];
      const dx = touch.clientX - fgimageRef.current.startX;
      const dy = touch.clientY - fgimageRef.current.startY;
      fgsetImagePosition(prevPos => ({
        x: prevPos.x + dx,
        y: prevPos.y + dy,
      }));
      fgimageRef.current.startX = touch.clientX;
      fgimageRef.current.startY = touch.clientY;
      fgsetIsDragging(true); // Set dragging to true during touch move
    }
  };
  

  return (
    <div id="editor" className="editor">
      <div
        id="template-holder"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          // backgroundSize: 'cover',
          backgroundSize: `${scale * 100}%`, // Scale the background image
          backgroundPosition: `${imagePosition.x}px ${imagePosition.y}px`, // Dynamically set the background position
          backgroundRepeat: 'no-repeat',  // Prevent image from repeating
          width: '100%',
          height: '100%',
          lineHeight: '0',
          cursor: dragging ? 'grabbing' : 'grab', // Change cursor during drag
          borderRadius: '6%', // Set your desired border radius here
        }}
      >
        <input
          type="file"
          accept="image/*"
          style={{
            opacity: 0,              // Make the input invisible
            position: 'absolute',     // Position it absolutely in the container
            left: '25%',
            top: 0,
            width: '75%',            // Make it cover the entire div
            height: '60%',
            cursor: 'pointer',        // Show the pointer when hovering over it
          }}
          onClick={handleBackgroundUploadClick} // Attach the click handler
          onChange={handleBackgroundUpload}
          onMouseDown={handleMouseDown} // Start dragging
          onMouseMove={handleMouseMove} // Move the image
          onMouseUp={handleMouseUp} // Stop dragging
          onMouseLeave={handleMouseUp} // Stop dragging if the mouse leaves the container
          // onWheel={handleWheelZoom} // Add mouse wheel listener for zooming
          // onTouchMove={handlePinchZoom} // Add touch move listener for pinch zoom
          onTouchEnd={handleTouchEnd}   // Reset pinch zoom on touch end
          onTouchStart={handleTouchStart}  // For mobile dragging
          onTouchMove={handleTouchMove}    // For mobile dragging
          ref={templateRef}
        />
        <img id="template" src={template.url} alt="Card Background" className="template-img" />
        <div
          onClick={handleForegroundClick}
          style={{
            minWidth: '10%',
            position: 'absolute',
            top: `calc(62% + ${fgimagePosition.y}px)`, // Maintain initial top position and add dragging offset
            left: `calc(50% + ${fgimagePosition.x}px)`, // Maintain initial left position and add dragging offset
            transform: 'translateX(-50%)',
            cursor: dragging ? 'grabbing' : 'grab', // Change cursor during drag
            height: `${12*fgscale}%`,
          }}
          onMouseDown={fghandleMouseDown} // Start dragging
          onMouseMove={fghandleMouseMove} // Move the image
          onMouseUp={fghandleMouseUp} // Stop dragging
          onMouseLeave={fghandleMouseUp} // Stop dragging if the mouse leaves the container
          // onWheel={fghandleWheelZoom} // Add mouse wheel listener for zooming
          // onTouchMove={fghandlePinchZoom} // Add touch move listener for pinch zoom
          onTouchEnd={fghandleTouchEnd}   // Reset pinch zoom on touch end
          onTouchStart={fghandleTouchStart}  // For mobile dragging
          onTouchMove={fghandleTouchMove}    // For mobile dragging
          zindex={99}
          ref={fgRef}
        >
          {foregroundImage && <img src={foregroundImage} alt="Foreground" style={{
            maxWidth: '100%', // Constrain the width of the image to the container
            maxHeight: '100%', // Constrain the height of the image to the container
            objectFit: 'contain', // Ensure the image scales properly within the div
          }} />}
        </div>
      </div>

      <div className="card-field" id="card-name" contentEditable={true} suppressContentEditableWarning={true}>Card Name</div>
      <div className="card-field" id="energy-cost" contentEditable={true} suppressContentEditableWarning={true}>?</div>
      <div className="card-field" id="power" contentEditable={true} suppressContentEditableWarning={true}>?</div>
      <div className="card-field" id="card-code" contentEditable={true} suppressContentEditableWarning={true}>CODE</div>
      <div className="card-field" id="ability-name" contentEditable={true} suppressContentEditableWarning={true}>Ability Name</div>
      <div className="card-field" id="ability-description" contentEditable={true} suppressContentEditableWarning={true}>Ability Description</div>

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