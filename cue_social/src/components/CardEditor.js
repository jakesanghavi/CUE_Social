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
const CardEditor = ({ template, backgroundImage, foregroundImage, handleForegroundUpload, icons, handleBackgroundUpload, insertImageAtCursor }) => {
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
  const [content, setContent] = useState('Ability description'); // Holds the current content with text and images
  const [spans, setSpans] = useState([{ id: 1, content: content }]); // Array of spans with unique IDs
  const [nextId, setNextId] = useState(2);
  const [energy, setEnergy] = useState('?');
  const [power, setPower] = useState('?');

  const handleInputChange = (e) => {
    setContent(e.target.innerHTML.split('').reverse().join('')); // Update content state based on input
  };

  const handlePowerChange = (e) => {
    setPower(e.target.innerHTML.split('').reverse().join('')); // Update content state based on input
  };

  const handleEnergyChange = (e) => {
    setEnergy(e.target.innerHTML.split('').reverse().join('')); // Update content state based on input
  };

  useEffect(() => {
    const imageElement = templateRef.current;
    const fgImageElement = fgRef.current;

    // Add event listener for background zoom
    if (imageElement) {
      imageElement.addEventListener('wheel', handleWheelZoom, { passive: false });
      imageElement.addEventListener('touchmove', handlePinchZoom, { passive: false })
      imageElement.addEventListener('touchend', handleTouchEnd, { passive: false })
    }

    // Add event listener for foreground zoom
    if (fgImageElement) {
      fgImageElement.addEventListener('wheel', fghandleWheelZoom, { passive: false });
    }

    // Cleanup the event listeners when component unmounts
    return () => {
      if (imageElement) {
        imageElement.removeEventListener('wheel', handleWheelZoom, { passive: false });
        imageElement.removeEventListener('touchmove', handlePinchZoom, { passive: false })
        imageElement.removeEventListener('touchend', handleTouchEnd, { passive: false })
      }
      if (fgImageElement) {
        fgImageElement.removeEventListener('wheel', fghandleWheelZoom, { passive: false });
      }
    };
  }, []);

  const setFontSize = (element) => {
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const containerHeight = element.offsetHeight;

    element.childNodes.forEach(node => {
        node.childNodes.forEach(node2 => {
          node2.childNodes.forEach(node3 => {
            node3.childNodes.forEach(node4 => {
              if (node4.nodeName === '#text') {
                console.log(node4)
                // node3.textContent = node.textContent.replace(/&nbsp;/, " ");
                // node.textContent = node.textContent.replace(/(\u00A0)([^\s])/, "\u00A0 $2");
                // node.textContent = node.textContent.replace(/([^\s])(\u00A0)/, "$1 \u00A0");
              }
              else {
                console.log(node3.childNodes)
              }
            })
          })
        })
    });

    // const currentContent = element.innerHTML;
    // const updatedContent = currentContent.replace(/^(&nbsp;|\s)+/, "").replace(/\s/g, "\u00A0");
    // element.innerHTML = updatedContent;
    const initial = 2.3;

    // Calculate the number of lines
    const numberOfLines = Math.round(containerHeight / lineHeight);

    let fontSize;

    if (numberOfLines <= 1) {
      fontSize = `${initial}vw`;
    } else if (numberOfLines === 2) {
      fontSize = `${(63 * initial) / 81}vw`;
    } else if (numberOfLines === 3) {
      fontSize = `${(68 * initial) / 81}vw`;
    } else if (numberOfLines === 4) {
      fontSize = `${(42 * initial) / 81}vw`;
    } else {
      fontSize = `${numberOfLines / 7}vw`; // Fallback or default size
    }

    // Set font size
    element.style.fontSize = fontSize;

    // Update the height of any embedded images based on the new font size
    const computedFontSize = getComputedStyle(element).fontSize;

    // Find all <img> tags within the element
    const images = element.querySelectorAll('img');
    images.forEach((img) => {
      img.style.height = computedFontSize; // Set image height equal to font size
      if (img.src.includes('play') || img.src.includes('draw') | img.src.includes('return') | img.src.includes('start')) {
        img.style.marginTop = '0%';
        img.style.display = 'block';
        img.style.margin = 'auto';
      }
      else {
        img.style.whiteSpace = "pre-wrap;"
      }
    });
  };

  const setPEFontSize = (elementID) => {
    const element = document.getElementById(elementID)
    const elLength = element.innerHTML.length;
    if (elLength <= 1) {
      element.style.fontSize = '5.75vw';
    }
    else if (elLength === 2) {
      element.style.fontSize = '4.5vw';
    }
    else if (elLength === 3) {
      element.style.fontSize = '3.25vw';
    }
    else {
      element.style.fontSize = `${2}vw`;
    }
  }

  useEffect(() => {
    const desc = document.getElementById('ability-description');
    if (desc) {
      setFontSize(desc);
    }
  }, [content])

  useEffect(() => {
    const energia = document.getElementById('energy-cost');
    if (energia) {
      setPEFontSize('energy-cost');
    }
  }, [energy])

  useEffect(() => {
    const poder = document.getElementById('power');
    if (poder) {
      setPEFontSize('power');
    }
  }, [power])

  const handleWheelZoom = (e) => {
    e.preventDefault();
    const scaleChange = e.deltaY > 0 ? 0.97 : 1.03; // Zoom out on scroll down, zoom in on scroll up
    setScale((prevScale) => Math.max(0.5, Math.min(prevScale * scaleChange, 3))); // Limit zoom scale between 0.5 and 3
  };

  const handlePinchZoom = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault(); // Prevent the page zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleChange = dist / (imageRef.current?.prevDist || dist);
      setScale((prevScale) => Math.max(0.5, Math.min(prevScale * scaleChange, 3)));
      imageRef.current.prevDist = dist; // Store the current distance
    }
  };

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

  /* eslint-disable no-unused-vars */
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
    const regexp = /^[a-z]+$/i;
    if (selectedURL) {
      if (regexp.test(selectedURL)) {
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
  /* eslint-disable no-unused-vars */

  const handleKeyDown = (e, spanIndex) => {
    const updatedSpans = [...spans];

    // Handle Enter key to add a new span
    if (e.key === 'Enter') {
      e.preventDefault();
      const newSpan = { id: nextId, content: 'Ability Description' };
      updatedSpans.splice(spanIndex + 1, 0, newSpan); // Insert new span after the current one
      setSpans(updatedSpans);
      setNextId(nextId + 1);
    }

    // Handle Delete key to remove an empty span
    if (e.key === 'Delete' && updatedSpans[spanIndex].content === '') {
      e.preventDefault();
      if (updatedSpans.length > 1) {
        updatedSpans.splice(spanIndex, 1); // Remove the empty span
        setSpans(updatedSpans);
      }
    }
  };

  // Handle span content change
  const handleSpanChange = (e, spanIndex) => {
    const updatedSpans = [...spans];
    updatedSpans[spanIndex].content = e.target.innerText;
    setSpans(updatedSpans);
  };


  return (
    <div id="editor" className="editor">
      <div id='toCapture'>
        <div
          id="template-holder"
          style={{
            width: '100%',
            height: '100%',
            lineHeight: '0',
            cursor: dragging ? 'grabbing' : 'grab', // Change cursor during drag
            borderRadius: '6%', // Set your desired border radius here
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <img
            id="template"
            src={backgroundImage}
            alt=""
            style={{
              position: 'absolute',
              top: `${imagePosition.y}px`,
              left: `${imagePosition.x}px`,
              width: `${scale * 100}%`, // Scale the background image
              height: 'auto', // Maintain aspect ratio
              objectFit: 'cover', // Cover the whole area
              zIndex: -1, // Ensure it stays behind other content
              // maxWidth: '100%'
            }}
            crossOrigin="anonymous"
          />
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
          <img id="template" src={template.url} alt="" className="template-img" crossOrigin="anonymous" />
          <div
            onClick={handleForegroundClick}
            style={{
              minWidth: '10%',
              position: 'absolute',
              top: `calc(61.4% + ${fgimagePosition.y}px)`, // Maintain initial top position and add dragging offset
              left: `calc(50% + ${fgimagePosition.x}px - ${(13.1 * fgscale) / 1.43}%)`, // Adjust left position based on image width
              // transform: 'translateX(-50%)',
              cursor: dragging ? 'grabbing' : 'grab', // Change cursor during drag
              height: `${13.1 * fgscale}%`,
            }}
            // onWheel={fghandleWheelZoom} // Add mouse wheel listener for zooming
            // onTouchMove={fghandlePinchZoom} // Add touch move listener for pinch zoom
            zindex={99}
            ref={fgRef}
          >
            {foregroundImage && <img src={foregroundImage} alt="" style={{
              maxWidth: '100%', // Constrain the width of the image to the container
              maxHeight: '100%', // Constrain the height of the image to the container
              objectFit: 'contain', // Ensure the image scales properly within the div
            }}
              crossOrigin="anonymous"
            />}
          </div>
        </div>

        <div className="card-field" id="card-name" contentEditable={true} suppressContentEditableWarning={true}>Card Name</div>
        <div className="card-field" id="energy-cost" contentEditable={true} suppressContentEditableWarning={true} onInput={handleEnergyChange} value={energy}>?</div>
        <div className="card-field" id="power" contentEditable={true} suppressContentEditableWarning={true} onInput={handlePowerChange} value={power}>?</div>
        <div className="card-field" id="card-code" contentEditable={true} suppressContentEditableWarning={true}>CODE</div>
        <div className="card-field" id="ability-name" contentEditable={true} suppressContentEditableWarning={true}>Ability Name</div>
        <div id='ability-desc-holder'>
          <span
            className="card-field"
            id="ability-description"
            contentEditable={true}
            suppressContentEditableWarning={true}
            onInput={handleInputChange} // Update the state when the content changes
            value={content}
          >
          </span>
        </div>
      </div>

      {/* Modal for selecting foreground image */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={customModalStyles}
        contentLabel="Foreground Upload"
        appElement={document.getElementById('root') || undefined}
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