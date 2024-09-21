import React, { useState } from 'react';
import CardEditor from '../components/CardEditor';
import TemplateSelector from '../components/TemplateSelector';
import { customCardBorders, customCardIcons } from '../UsefulFunctions';
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
  const templateHolder = document.getElementById('template-holder'); // Assuming ID is used
  if (templateHolder) {
    html2canvas(templateHolder, { allowTaint: true, useCORS: true, scale: 10 })
      .then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'template-image.png';
        link.click();
      })
      .catch((error) => {
        console.error('Error capturing the image:', error);
      });
  } else {
    console.warn('templateHolder is null or undefined');
  }
};

function CustomCards() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [backgroundImage, setBackgroundImage] = useState(null); // State to hold the background image
  const [foregroundImage, setForegroundImage] = useState(null); // State to hold the foreground image

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
    console.log(file)
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

  return (
    <div className="customCardPage">
      <h1>Custom Card Editor</h1>
      <TemplateSelector templates={templates} onTemplateSelect={handleTemplateSelect} />
      {/* <input type="file" accept="image/*" onChange={handleBackgroundUpload} /> */}
      {/* Image Upload Input */}
      {/* <input type="file" accept="image/*" onChange={handleForegroundUpload} /> */}
      {/* <div className="editor-container">
        <CardEditor template={selectedTemplate} backgroundImage={backgroundImage} foregroundImage={foregroundImage} />
      </div> */}
      <CardEditor icons={icons} onIconSelect={handleIconSelect} template={selectedTemplate} backgroundImage={backgroundImage} foregroundImage={foregroundImage} handleForegroundUpload={handleForegroundUpload} setForegroundImage={setForegroundImage} handleBackgroundUpload={handleBackgroundUpload} />
      <button onClick={saveAsImage} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '5px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
        Save as Image
      </button>
    </div>
  );
}

export default CustomCards;
