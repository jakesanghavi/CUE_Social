import React, { useState, useEffect } from 'react';
import CardEditor from '../components/CardEditor';
import TemplateSelector from '../components/TemplateSelector';
import { customCardBorders, customCardIcons, cardEditIcons } from '../UsefulFunctions';
import html2canvas from 'html2canvas';

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

const icons = customCardIcons().map(url => {
  const parts = url.split('/');
  const fileName = parts[parts.length - 1].split('.')[0]; // Get the file name without the extension
  const nameParts = fileName.split('_').slice(0, 2); // Take the first two parts of the name
  const name = nameParts.join(' '); // Join the name parts with a space

  return {
    url: url,
    name: name
  };
});

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
        // Create a new image element
        const img = document.createElement('img');
        img.src = url;
        img.alt = ""; // Set alt text for accessibility
        // const element = document.getElementById('template-holder');
        // const height = element.offsetHeight;
        // img.style.height = `${height/30}px`; // Maintain aspect ratio
        img.style.height = '2vw';
        img.className = 'custicon';
        img.style.width = "auto"; // Set max width to 100% of the container
        // img.style.width = "5%"; // Maintain aspect ratio
        // img.style.height = "auto"; // Set max width to 100% of the container
        // img.style.maxHeight = '10px';
        // img.style.margin = "1vw 0px 0px 0px"; // Optional: adds some spacing around the image

        // Insert the image into the current range
        range.insertNode(img);

        // Clear the selection
        selection.removeAllRanges();

        // Move the cursor after the inserted image
        range.setStartAfter(img);
        range.collapse(true);
        selection.addRange(range);
      }
    }
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


  return (
    <div className="customCardPage">
      <h1>Custom Card Editor</h1>
      <TemplateSelector templates={templates} onTemplateSelect={handleTemplateSelect} saveAsImage={saveAsImage} />

      {/* Centered Grid Container */}
      <div className='iconGridWrapper'>
        <div className='iconGridContainer' style={{ gridTemplateColumns: `repeat(${cardEditIcons.length}, ${minSize})` }}>
          {cardEditIcons().map((url, index) => (
            <div key={index} className='iconImageWrapper'>
              <img src={url} alt={`${index + 1}`} className='iconImage' onClick={() => insertImageAtCursor(url)} />
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );

}

export default CustomCards;
