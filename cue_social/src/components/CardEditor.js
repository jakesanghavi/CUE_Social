import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  const [name, setName] = useState('CARD NAME');
  const initial = 2.3;
  const defaultImageURL = 'https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg';
  // const [previousCharCount, setPreviousCharCount] = useState(0); // Track previous character count
  const previousCharCount = useRef(0);
  const bgRef = useRef(null);
  // const [previousFontSize, setPreviousFontSize] = useState(initial); // Track previous character count
  const previousFontSize = useRef(initial)
  const fsMap = new Map([
    [1, 60],
    [2, 55],
    [3, 50],
    [4, 45],
    [5, 40]
  ]);
  const charBps = Array.from(fsMap, ([k, v]) => k * v);
  const [searchTerm, setSearchTerm] = useState(''); // Search term for filtering options
  const [filteredIcons, setFilteredIcons] = useState(icons);

  const handleInputChange = (e) => {
    setContent(e.target.innerHTML.split('').reverse().join('')); // Update content state based on input
  };

  const handlePowerChange = (e) => {
    setPower(e.target.innerHTML.split('').reverse().join('')); // Update content state based on input
  };

  const handleEnergyChange = (e) => {
    setEnergy(e.target.innerHTML.split('').reverse().join('')); // Update content state based on input
  };

  const handleNameChange = (e) => {
    setName(e.target.innerHTML.split('').reverse().join('')); // Update content state based on input
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

  const setFontSize = useCallback((element) => {
    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const containerHeight = element.offsetHeight;

    // element.childNodes.forEach(node => {
    //     node.childNodes.forEach(node2 => {
    //       node2.childNodes.forEach(node3 => {
    //         node3.childNodes.forEach(node4 => {
    //           if (node4.nodeName === '#text') {
    //             console.log(node4)
    //             // node3.textContent = node.textContent.replace(/&nbsp;/, " ");
    //             // node.textContent = node.textContent.replace(/(\u00A0)([^\s])/, "\u00A0 $2");
    //             // node.textContent = node.textContent.replace(/([^\s])(\u00A0)/, "$1 \u00A0");
    //           }
    //           else {
    //             console.log(node3.childNodes)
    //           }
    //         })
    //       })
    //     })
    // });

    // const currentContent = element.innerHTML;
    // const updatedContent = currentContent.replace(/^(&nbsp;|\s)+/, "").replace(/\s/g, "\u00A0");
    // element.innerHTML = updatedContent;

    // Calculate the number of lines
    const numberOfLines = Math.round(containerHeight / lineHeight);

    let totalChars = 0;

    // Loop through each row (tr) in the table
    element.querySelectorAll('tr').forEach(tr => {
      // Sum characters in each contentEditable td
      tr.querySelectorAll('td[contentEditable="true"]').forEach(td => {
        // Get the innerHTML to properly handle tags
        const content = td.innerHTML;

        // Replace all bold tags (e.g., <b></b>, <strong></strong>) with empty string
        const contentWithoutBold = content.replace(/<b[^>]*>.*?<\/b>|<strong[^>]*>.*?<\/strong>/gi, '');

        // Replace all image tags with a length of 2 (since they should be treated as having length 2)
        const contentWithImages = contentWithoutBold.replace(/<img[^>]*>/gi, '  '); // Two spaces for each image

        // Count characters in the resulting text
        totalChars += contentWithImages.replace(/<[^>]+>/g, '').length; // Remove all tags and count only text
      });
    });

    const primEst = charBps.findIndex(value => value > totalChars);
    const resultIndex = primEst !== -1 ? primEst : charBps.length - 1;

    const charPerLine = fsMap.get(resultIndex + 1)

    // // Estimate number of lines based on character count
    let estLineNum = Math.ceil(totalChars / charPerLine);

    if (numberOfLines > estLineNum) {
      estLineNum = numberOfLines;
    }

    let fontSize = String(previousFontSize.current) + 'vw';
    const bp1 = `${initial}vw`;
    const bp2 = `${(68 * initial) / 81}vw`;
    const bp3 = `${(63 * initial) / 81}vw`;
    const bp4 = `${(45 * initial) / 81}vw`;
    const bp5 = `${numberOfLines / 5}vw`;

    // if (estLineNum <= 1) {
    //   fontSize = bp1;
    // } else if (estLineNum === 2) {
    //   fontSize = bp2;
    // } else if (estLineNum === 3) {
    //   fontSize = bp3;
    // } else if (estLineNum === 4) {
    //   fontSize = bp4;
    // } else {
    //   fontSize = bp5; // Fallback or default size
    // }



    if (estLineNum <= 1) {
      // console.log(totalChars)
      // console.log(previousCharCount)
      // console.log(previousFontSize)
      if ((totalChars <= previousCharCount.current && previousFontSize.current <= parseFloat(bp1.substring(0), bp1.length - 2)) || (totalChars >= previousCharCount.current && previousFontSize.current >= parseFloat(bp1.substring(0, bp1.length - 2)))) {
        fontSize = bp1;
      }
    } else if (estLineNum === 2) {
      if ((totalChars <= previousCharCount.current && previousFontSize.current <= parseFloat(bp2.substring(0), bp2.length - 2)) || (totalChars >= previousCharCount.current && previousFontSize.current >= parseFloat(bp2.substring(0, bp2.length - 2)))) {
        fontSize = bp2;
      }
    } else if (estLineNum === 3) {
      // console.log(previousFontSize)
      // console.log(bp3)
      // console.log((totalChars <= previousCharCount && parseFloat(previousFontSize.substring(0, previousFontSize.length - 2)) <= parseFloat(bp3.substring(0), bp3.length - 2)))
      // console.log((totalChars >= previousCharCount && parseFloat(previousFontSize.substring(0, previousFontSize.length - 2)) >= parseFloat(bp3.substring(0, bp3.length - 2))))
      if ((totalChars <= previousCharCount.current && previousFontSize.current <= parseFloat(bp3.substring(0), bp3.length - 2)) || (totalChars >= previousCharCount.current && previousFontSize.current >= parseFloat(bp3.substring(0, bp3.length - 2)))) {
        fontSize = bp3;
      }
    } else if (estLineNum === 4) {
      // console.log(previousFontSize)
      // console.log(bp4)
      // console.log((totalChars <= previousCharCount && parseFloat(previousFontSize.substring(0, previousFontSize.length - 2)) <= parseFloat(bp4.substring(0), bp4.length - 2)))
      // console.log((totalChars >= previousCharCount && parseFloat(previousFontSize.substring(0, previousFontSize.length - 2)) >= parseFloat(bp4.substring(0, bp4.length - 2))))
      if ((totalChars <= previousCharCount.current && previousFontSize.current <= parseFloat(bp4.substring(0), bp4.length - 2)) || (totalChars >= previousCharCount.current && previousFontSize.current >= parseFloat(bp4.substring(0, bp4.length - 2)))) {
        fontSize = bp4;
      }
    } else {
      if ((totalChars <= previousCharCount.current && previousFontSize.current <= parseFloat(bp5.substring(0), bp5.length - 2)) || (totalChars >= previousCharCount.current && previousFontSize.current >= parseFloat(bp5.substring(0, bp5.length - 2))))  {
        fontSize = bp5;
      }
    }

    // setPreviousCharCount(totalChars);
    // setPreviousFontSize(parseFloat(fontSize.substring(0), bp3.length - 2));
    console.log(parseFloat(fontSize.substring(0), fontSize.length - 2))
    previousFontSize.current = parseFloat(fontSize.substring(0), fontSize.length - 2)

    // Set font size
    element.style.fontSize = fontSize;


    // Update the height of any embedded images based on the new font size
    const computedFontSize = getComputedStyle(element).fontSize;

    // setPreviousCharCount((prev) => {
    //   console.log("Previous:", prev, "Current:", totalChars);
    //   return totalChars;
    // });

    previousCharCount.current = totalChars;

    // Find all <img> tags within the element
    const images = element.querySelectorAll('img');
    images.forEach((img) => {
      img.style.height = computedFontSize; // Set image height equal to font size
      if (img.src.includes('play') || img.src.includes('draw') | img.src.includes('return') | img.src.includes('start')) {
        // img.style.marginTop = '0%';
        img.style.display = 'block';
        // img.style.margin = 'auto';
        img.style.marginTop = "1%";
      }
      else {
        img.style.whiteSpace = "pre-wrap;"
        img.style.marginTop = "0.6%";
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const setNameFontSize = (elementID) => {
    const element = document.getElementById(elementID)

    const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
    const containerHeight = element.offsetHeight;

    const numberOfLines = Math.round(lineHeight/containerHeight);
    const numChars = element.innerHTML.length;
    const lineChars = 20;

    let estLineNum = Math.ceil(numChars/lineChars)

    if (numberOfLines > estLineNum) {
      estLineNum = numberOfLines;
    }

    if (estLineNum <= 1) {
      element.style.fontSize = '3.1vw';
    }
    else {
      element.style.fontSize = `2vw`;
    }
  }

  useEffect(() => {
    // const desc = document.getElementById('ability-description');
    const desc = document.getElementById('abilitiesTable')
    if (desc) {
      // setFontSize(desc);
      let debounceTimer = null;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        setFontSize(desc);
      }, 300); // Adjust delay as needed

      // Clean up timer
      return () => clearTimeout(debounceTimer);
    }
  }, [content, setFontSize])

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

  useEffect(() => {
    const nombre = document.getElementById('card-name');
    if (nombre) {
      setNameFontSize('card-name');
    }
  }, [name])

  const handleWheelZoom = (e) => {
    if (bgRef.current && bgRef.current.src && bgRef.current.src !== defaultImageURL) {
      e.preventDefault();
      const scaleChange = e.deltaY > 0 ? 0.97 : 1.03; // Zoom out on scroll down, zoom in on scroll up
      setScale((prevScale) => Math.max(0.5, Math.min(prevScale * scaleChange, 3))); // Limit zoom scale between 0.5 and 3
    }
  };

  const handlePinchZoom = (e) => {
    if (e.touches.length === 2 && bgRef.current && bgRef.current.src && bgRef.current.src !== defaultImageURL) {
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
    if (bgRef.current && bgRef.current.src && bgRef.current.src !== defaultImageURL) {
      imageRef.current.prevDist = null; // Reset previous distance on touch end
    }
  };

  const handleMouseDown = (e) => {
    if (bgRef.current && bgRef.current.src && bgRef.current.src !== defaultImageURL) {
      setDragging(true);
      setIsDragging(false); // Reset dragging state on mouse down
      imageRef.current = { startX: e.clientX, startY: e.clientY }; // Track the starting mouse position
    }
  };

  const handleMouseMove = (e) => {
    if (fgdragging) return; // Prevent background dragging if foreground is dragging
    if (dragging && bgRef.current && bgRef.current.src && bgRef.current.src !== defaultImageURL) {
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
    if (fgdragging || !(dragging && bgRef.current && bgRef.current.src && bgRef.current.src !== defaultImageURL)) return; // Prevent background stop if foreground is dragging
    setDragging(false);
  };

  const fghandleWheelZoom = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const scaleChange = e.deltaY > 0 ? 0.97 : 1.03; // Zoom out on scroll down, zoom in on scroll up
    fgsetScale((prevScale) => Math.max(0.5, Math.min(prevScale * scaleChange, 3))); // Limit zoom scale between 0.5 and 3
    // Dummy line to be removed when custom album icons are supported
    fgsetScale(() => 1)
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

  const handleURLModalConfirm = (url) => {
    if (url) {
        handleForegroundUpload({ target: { files: [{ url: url }] } })
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
    if (dragging && bgRef.current && bgRef.current.src && bgRef.current.src !== defaultImageURL) {
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term
  };

  const handleOptionClick = (url, name) => {
    setSelectedURL(url); // Set the selected URL when an option is clicked
    setSearchTerm(name); // Optionally set search term to the selected icon's name
    handleURLModalConfirm(url);
  };

  useEffect(() => {
    setFilteredIcons(icons.filter(icon => icon.name.toLowerCase().includes(searchTerm.toLowerCase())))
  }, [searchTerm, icons])

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
              objectFit: 'contain', // Cover the whole area
              objectPosition: 'center',
              zIndex: -1, // Ensure it stays behind other content
              // maxWidth: '100%'
            }}
            crossOrigin="anonymous"
            ref={bgRef}
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
              id='collectionIcon'
            />}
          </div>
        </div>
        <div id='card-name-wrapper'>
          <div className="card-field" id="card-name" contentEditable={true} suppressContentEditableWarning={true} onInput={handleNameChange} value={name} spellcheck="false">
            Card Name
          </div>
        </div>
        <div className="card-field" id="energy-cost" contentEditable={true} suppressContentEditableWarning={true} onInput={handleEnergyChange} value={energy} spellcheck="false">?</div>
        <div className="card-field" id="power" contentEditable={true} suppressContentEditableWarning={true} onInput={handlePowerChange} value={power} spellcheck="false">?</div>
        <div className="card-field" id="card-code" contentEditable={true} suppressContentEditableWarning={true} spellcheck="false">CODE</div>
        <div className="card-field" id="ability-name" contentEditable={true} suppressContentEditableWarning={true} spellcheck="false">Ability Name</div>
        <div id='ability-desc-holder'>
          <div
            className="card-field"
            id="ability-description"
            contentEditable={false}
            suppressContentEditableWarning={true}
            onInput={handleInputChange} // Update the state when the content changes
            value={content}
            spellcheck="false"
          >
          </div>
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

        <div style={{ marginBottom: '20px', width: '100%' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            Select from existing images:
          </label>

          {/* Search input */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for an icon"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '16px',
            }}
          />

          {/* Display matched options below */}
          {searchTerm && filteredIcons.length > 0 && (
            <ul
              style={{
                // position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                maxHeight: '200px',
                overflowY: 'auto',
                margin: 0,
                padding: '0',
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #ccc',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1,
              }}
            >
              {filteredIcons.map((icon, index) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(icon.url, icon.name)}
                  style={{
                    padding: '10px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #ccc',
                  }}
                >
                  {icon.name}
                </li>
              ))}
            </ul>
          )}
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