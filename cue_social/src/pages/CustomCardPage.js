import React, { useState, useEffect } from 'react';
import CardEditor from '../components/CardEditor';
import TemplateSelector from '../components/TemplateSelector';
import { customCardBorders, customCardIcons, cardEditIcons, cardIconNames } from '../UsefulFunctions';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';


// const templates = customCardBorders();
const templates = customCardBorders().map(url => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1].split('.')[0]; // Get the file name without the extension
  const nameParts = fileName.split('_').slice(0, 2); // Take the first two parts of the name
  var limited = "Basic"
  var rarity = "Common"

  const map1 = new Map();
  map1.set('comm', 'Common')
  map1.set('rare', 'Rare')
  map1.set('epic', 'Epic')
  map1.set('leg', 'Legendary')

  if (nameParts[1].substring(0, 3) === 'Lim') {
    limited = 'Limited'
    rarity = map1.get(nameParts[1].substring(3))
  }
  else {
    rarity = nameParts[1]
  }


  return {
    url: url,
    album: nameParts[0],
    limited: limited,
    rarity: rarity
  };
});

// const icons = customCardIcons()

const iconURLs = customCardIcons();
const iconNames = cardIconNames();

const icons = iconURLs.map((url, index) => ({
  url: url,
  name: iconNames[index]
}));


const saveAsImage = () => {
  let templateHolder = document.getElementById('toCapture');
  let editor = document.getElementById('editor')

  // Create a new template holder if it doesn't exist
  if (!templateHolder) {
    templateHolder = document.createElement('div');
    templateHolder.id = 'toCapture';
    // Add content to templateHolder dynamically
    document.body.appendChild(templateHolder);
  }

  if (!editor) {
    editor = document.createElement('div');
    editor.id = 'editor';
    // Add content to templateHolder dynamically
    document.body.appendChild(editor);
  }

  // Get the current scale
  // const currentScale = getComputedStyle(editor).transform;

  editor.classList.add('scale-hidden');


  // Set scale to 1 for image capture
  // editor.style.transform = 'scale(1)';

  let scale;

  // Determine scale based on screen size
  if (window.innerWidth > 1024) { // Laptop/Desktop
    scale = 2;
  } else if (window.innerWidth > 768) { // Tablet
    scale = 4;
  } else { // Phone
    scale = 7;
  }

  // Capture the element as an image
  html2canvas(templateHolder, { allowTaint: true, useCORS: true, scale: scale })
    .then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'template-image.png';
      link.click();

      // Restore the original scale
      // editor.style.transform = currentScale;
      editor.classList.remove('scale-hidden');

      // Optionally remove dynamically created elements after the screenshot
      if (!document.getElementById('toCapture')) {
        document.body.removeChild(templateHolder);
        document.body.removeChild(editor);
      }
    })
    .catch((error) => {
      console.error('Error capturing the image:', error);
      // Restore the original scale in case of error
      // editor.style.transform = currentScale;
      editor.classList.remove('scale-hidden');
    });
};

function CustomCards() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [backgroundImage, setBackgroundImage] = useState('https://t4.ftcdn.net/jpg/04/81/13/43/360_F_481134373_0W4kg2yKeBRHNEklk4F9UXtGHdub3tYk.jpg'); // State to hold the background image
  const [foregroundImage, setForegroundImage] = useState('https://res.cloudinary.com/defal1ruq/image/upload/v1735594880/inverted_add_img_transparent_icon_zepq5o.png'); // State to hold the foreground image
  const isMobile = window.innerWidth <= 600; // Check if the screen width is less than or equal to 600px
  const minSize = isMobile ? '8%' : '13%'; // Set the minimum size based on screen size
  const maxSize = isMobile ? '8%' : '13%'; // Set the minimum size based on screen size
  const [isBold, setIsBold] = useState(false);
  let rowToDelete = null; // Keep track of the row to delete


  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleIconSelect = (template) => {
    setForegroundImage(template);
  };

  const handleBackgroundUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for the uploaded image
      setBackgroundImage(imageUrl); // Set the background image state
    }
  };

  const handleForegroundUpload = (e) => {
    const file = e.target.files[0];
    // console.log(file)
    if (file) {
      if (file.url && file.url.url) {
        setForegroundImage(file.url.url)
      }
      else if (file.url) {
        setForegroundImage(file.url)
      }
      else {
        const imageUrl = URL.createObjectURL(file); // Create a URL for the uploaded image
        setForegroundImage(imageUrl); // Set the foreground image state
      }
    }
  };

  const handleAbilityDelete = (event) => {
    // Find the table row
    rowToDelete = event.target.closest('tr');

    const contentEditableElements = document.querySelectorAll('[contentEditable="true"]');
    contentEditableElements.forEach((el) => {
      el.blur(); // Removes focus
    });

    // Open the confirmation modal
    const modal = document.getElementById('confirmModal');
    if (modal) {
      modal.style.display = 'block';
    }
  };

  const handleCardHelp = (event) => {

    const contentEditableElements = document.querySelectorAll('[contentEditable="true"]');
    contentEditableElements.forEach((el) => {
      el.blur(); // Removes focus
    });

    // Open the confirmation modal
    const modal = document.getElementById('helpModal');
    if (modal) {
      modal.style.display = 'block';
    }
  };

  
  const closeHelpModal = () => {
    const modal = document.getElementById('helpModal');
    if (modal) {
      modal.style.display = 'none'; // Hide the modal
    }
  };

  const confirmDelete = () => {
    if (rowToDelete) {
      rowToDelete.remove(); // Delete the row
      rowToDelete = null; // Clear the reference
    }

    // Close the modal
    const modal = document.getElementById('confirmModal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  const cancelDelete = () => {
    // Simply close the modal
    const modal = document.getElementById('confirmModal');
    if (modal) {
      modal.style.display = 'none';
    }
  };

  const closeModal = () => {
    const modal = document.getElementById('confirmModal');
    if (modal) {
      modal.style.display = 'none'; // Hide the modal
    }
  };


  const insertImageAtCursor = (url) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const parentDiv = document.getElementById('ability-description');

      // Check if the selection is within the ability-description div
      if (parentDiv && parentDiv.contains(range.startContainer)) {

        // Determine image type based on URL or other conditions
        const isAbilityIcon = url.includes('play') || url.includes('return') || url.includes('start');
        let insertedNode;

        if (isAbilityIcon) {
          // Create a new ability line container for play/return/start abilities
          const abilityLine = document.createElement('div');
          abilityLine.className = 'ability-line'; // Style for ability lines

          // Create the image element for the ability icon
          const img = document.createElement('img');
          img.src = url;
          img.alt = ""; // Set alt text for accessibility
          img.className = 'ability-icon'; // Use specific styling for ability icons
          img.style.height = '2vw';
          img.style.width = 'auto';

          // Append the icon to the ability line
          abilityLine.appendChild(img);

          // Create a span for the text that should appear to the right of the icon
          const textWrapper = document.createElement('span');
          textWrapper.className = 'text-wrapper';
          textWrapper.textContent = " "; // Optional: add a space for future content
          abilityLine.appendChild(textWrapper);

          // Insert the ability line container at the cursor position
          range.insertNode(abilityLine);
          insertedNode = abilityLine;
        } else {
          // If it’s a regular inline icon, treat it as text and insert it directly
          const img = document.createElement('img');
          img.src = url;
          img.alt = ""; // Set alt text for accessibility
          img.className = 'inline-icon'; // Styling for inline icons
          img.style.height = '2vw';
          img.style.width = 'auto';
          img.style.verticalAlign = '-10%'

          // Insert the inline icon into the current range
          range.insertNode(img);
          insertedNode = img;
        }

        // Clear the selection and move the cursor after the inserted element
        selection.removeAllRanges();
        range.setStartAfter(insertedNode);
        range.collapse(true);
        selection.addRange(range);
      }
    }
  };

  const addAbility = () => {
    const parentDiv = document.getElementById('ability-description');
    const childRef = document.getElementById('editor');

    const childWidth = childRef.offsetWidth;
    const percentage = (childWidth / window.innerWidth) * 100;

    let table = parentDiv.querySelector('table');
    if (!table) {
      table = document.createElement('table');
      table.id = 'abilitiesTable'
      table.style.width = `100%`;
      parentDiv.appendChild(table);
    }

    const modal = document.getElementById('abilityModal');
    modal.style.display = 'block';

    const abilityHandler = (event) => {
      const abilityType = event.target.getAttribute('data-ability');
      let imgUrl;
      let rightFlag = false;

      switch (abilityType) {
        case 'draw':
          imgUrl = 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940001/draw_onlg1u.png';
          rightFlag = true;
          break;
        case 'play':
          imgUrl = 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940003/play_bqxcpx.png';
          rightFlag = true;
          break;
        case 'start':
          imgUrl = 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940005/turnstart_njtwir.png';
          rightFlag = true;
          break;
        case 'return':
          imgUrl = 'https://res.cloudinary.com/defal1ruq/image/upload/v1728940004/return_bd2v6x.png';
          rightFlag = true;
          break;
        default:
          alert("Invalid ability type.");
          return;
      }

      modal.style.display = 'none';

      const row = document.createElement('tr');
      const imgCell = document.createElement('td');
      imgCell.onclick = handleAbilityDelete;
      imgCell.className = 'cellImg';
      imgCell.style.width = `${percentage * 0.1}%`;

      const img = document.createElement('img');
      img.src = imgUrl;
      img.className = 'inline-icon hoverable';
      img.alt = abilityType;
      img.style.height = '2vw';
      img.style.width = 'auto';
      if (rightFlag) img.style.float = 'right';

      imgCell.appendChild(img);

      const descCell = document.createElement('td');
      descCell.contentEditable = true;
      descCell.textContent = "Ability description";

      row.appendChild(imgCell);
      row.appendChild(descCell);
      table.appendChild(row);

      // Cleanup: Remove event listener after insertion to avoid duplicates
      document.querySelectorAll('.ability-option').forEach(button => {
        button.removeEventListener('click', abilityHandler);
      });
    };

    document.querySelectorAll('.ability-option').forEach(button => {
      button.addEventListener('click', abilityHandler, { once: true });
    });

    document.querySelector('.closeab').onclick = () => {
      modal.style.display = 'none';
    };

    window.onclick = (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    };
  };


  useEffect(() => {
    const root = document.documentElement;

    // Add class to root when component is mounted
    root.classList.add('page-specific');
    // console.log(root.classList)

    // Cleanup function to remove class when component is unmounted
    return () => {
      root.classList.remove('page-specific');
    };
  }, []);

  const toggleBold = (event) => {
    event.preventDefault(); // Prevent losing focus
    setIsBold((prev) => !prev);

    // Toggle bold state
    document.execCommand('bold');
  };

  const adjustButtonHeight = (buttonElement, targetSrc) => {
    if (!buttonElement) return;

    // Find the target image by its src
    const targetImage = document.querySelector(`img[alt="${targetSrc}"]`);
    const parentElement = targetImage.parentElement;
    if (targetImage) {
      // Set the button height to match the target image height
      const targetHeight = parentElement.offsetHeight; // Get height in pixels
      buttonElement.style.height = `${targetHeight}px`;
    };
  }


  return (
    <div className="customCardPage">
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1>Custom Card Editor</h1>
        <FontAwesomeIcon icon={faQuestionCircle} style={{ marginLeft: "10px", fontSize: "1.5rem" }} onClick={handleCardHelp}/>
      </div>
      <TemplateSelector templates={templates} onTemplateSelect={handleTemplateSelect} saveAsImage={saveAsImage} />


      <div style={{ justifyContent: 'center', alignContent: 'center', display: 'flex', flexDirection: 'column' }}>
        <CardEditor
          icons={icons}
          onIconSelect={handleIconSelect}
          template={selectedTemplate}
          backgroundImage={backgroundImage}
          foregroundImage={foregroundImage}
          handleForegroundUpload={handleForegroundUpload}
          setForegroundImage={setForegroundImage}
          handleBackgroundUpload={handleBackgroundUpload}
          cardEditIcons={cardEditIcons}
          insertImageAtCursor={insertImageAtCursor}
        />
        {/* Centered Grid Container */}
        <div className='belowCardContainer'>
          <div className='iconGridWrapper'>
            <div className='iconGridContainer'
              style={{
                display: 'grid', // Override display from inline-flex to grid
                gridTemplateColumns: `repeat(7, minmax(${minSize}, ${maxSize}))`, // Updated columns
                gap: '5px', // Retain spacing
                maxWidth: '100%', // Override max-width
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center'
              }}
            >
              {cardEditIcons().map((url, index) => (
                <div key={index} className='iconImageWrapper'>
                  <img src={url} alt={`${index + 1}`} className='iconImage' onClick={() => insertImageAtCursor(url)} style={{ cursor: 'pointer' }} />
                </div>
              ))}
              <div className='iconImageWrapper' ref={(el) => adjustButtonHeight(el, '1')}>
                <button className={`boldButton ${isBold ? 'active' : ''}`} onMouseDown={(e) => toggleBold(e)}>
                  <FontAwesomeIcon icon={faBold} className={isBold ? 'boldActive' : ''} />
                </button>
              </div>
            </div>
          </div>
          <div>
            <button id="add-ability-button" onClick={addAbility}>Add ability</button>
          </div>
        </div>
      </div>
      <div id="abilityModal" className="modal">
        <div className="modal-content">
          <span className="closeab">&times;</span>
          <h2>Select an Ability</h2>
          <button className="ability-option" data-ability="draw" style={{ backgroundColor: '#90ff8d' }}>Draw</button>
          <button className="ability-option" data-ability="play" style={{ backgroundColor: '#ff9149' }}>Play</button>
          <button className="ability-option" data-ability="start" style={{ backgroundColor: '#f2de7f' }}>Start</button>
          <button className="ability-option" data-ability="return" style={{ backgroundColor: '#d4b4ff' }}>Return</button>
        </div>
      </div>
      <div id="confirmModal" className="modal">
        <div className="modal-content">
          <span className="closeabconfirm" onClick={closeModal}>&times;</span>
          <h2>Are you sure you want to remove this ability?</h2>
          <div>
            <button className="ability-option" style={{ backgroundColor: '#ff4d4d' }} onClick={confirmDelete}>Yes, Delete</button>
            <button className="ability-option" style={{ backgroundColor: '#4caf50' }} onClick={cancelDelete}>Cancel</button>
          </div>
        </div>
      </div>
      <div id="helpModal" className="modal">
        <div className="modal-content">
          <span className="closeHelp" onClick={closeHelpModal}>&times;</span>
          <h2>Images:</h2>
          <h4>Click on the background to add a card image! Click where the collection icon should go to search for and add an existing collection icon.</h4>
          <h2>Name, Code, and Energy/Power:</h2>
          <h4>Simply click to edit any text on the card!</h4>
          <h2>Abilities:</h2>
          <h4>Use the "Add Ability" button to add abilities to your card! This lets you pick an ability type. You can click on the provided icons 
            (ex. power/burn/etc.) to add them. The "B" button will toggle bold on and off.
          </h4>
          <h2>Save Your Card!</h2>
          <h4>You can use the "Save Image" button to save your card, or just take a screenshot yourself!</h4>
        </div>
      </div>



    </div>
  );

}

export default CustomCards;
