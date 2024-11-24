import React, { useState, useEffect } from 'react';
import CardEditor from '../components/CardEditor';
import TemplateSelector from '../components/TemplateSelector';
import { customCardBorders, customCardIcons, cardEditIcons, cardIconNames } from '../UsefulFunctions';
import html2canvas from 'html2canvas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold } from '@fortawesome/free-solid-svg-icons';


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

  // Capture the element as an image
  html2canvas(templateHolder, { allowTaint: true, useCORS: true, scale: 2 })
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
  const [backgroundImage, setBackgroundImage] = useState(null); // State to hold the background image
  const [foregroundImage, setForegroundImage] = useState(null); // State to hold the foreground image
  const isMobile = window.innerWidth <= 600; // Check if the screen width is less than or equal to 600px
  const minSize = isMobile ? '10%' : '7%'; // Set the minimum size based on screen size

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
      else {
        const imageUrl = URL.createObjectURL(file); // Create a URL for the uploaded image
        setForegroundImage(imageUrl); // Set the foreground image state
      }
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

  // Modify your addAbility function
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
      imgCell.className = 'cellImg';
      imgCell.style.width = `${percentage * 0.1}%`;

      const img = document.createElement('img');
      img.src = imgUrl;
      img.className = 'inline-icon';
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

  const applyBoldToSelection = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
  
      // Create a <b> tag and wrap the selected text
      const boldNode = document.createElement('b');
      range.surroundContents(boldNode);
  
      // Clear the selection to avoid accidental re-triggering
      selection.removeAllRanges();
    }
  };
  


  return (
    <div className="customCardPage">
      <h1>Custom Card Editor</h1>
      <TemplateSelector templates={templates} onTemplateSelect={handleTemplateSelect} saveAsImage={saveAsImage} />

      {/* Centered Grid Container */}
      <div className='iconGridWrapper'>
        <div className='iconGridContainer' style={{ gridTemplateColumns: `repeat(${cardEditIcons.length}, ${minSize})` }}>
          {cardEditIcons().map((url, index) => (
            <div key={index} className='iconImageWrapper'>
              <img src={url} alt={`${index + 1}`} className='iconImage' onClick={() => insertImageAtCursor(url)} style={{cursor: 'pointer'}} />
            </div>
          ))}
        </div>
        <div className='iconImageWrapper'>
          <button className='boldButton' onClick={applyBoldToSelection}><FontAwesomeIcon icon={faBold}/></button>
        </div>
      </div>

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
        <button id="add-ability-button" onClick={addAbility}>Add ability</button>
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

    </div>
  );

}

export default CustomCards;
