import React, { useState } from 'react';
import CardEditor from '../components/CardEditor';
import TemplateSelector from '../components/TemplateSelector';
import { customCardBorders, customCardIcons } from '../UsefulFunctions';

const templates = customCardBorders();
const icons = customCardIcons()

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
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a URL for the uploaded image
      setForegroundImage(imageUrl); // Set the foreground image state
    }
  };

  return (
    <div className="customCardPage">
      <h1>Custom Card Editor</h1>
      <TemplateSelector icons={icons} templates={templates} onTemplateSelect={handleTemplateSelect} onIconSelect={handleIconSelect} />
      <input type="file" accept="image/*" onChange={handleBackgroundUpload} /> {/* Image Upload Input */}
      {/* <input type="file" accept="image/*" onChange={handleForegroundUpload} /> */}
      {/* <div className="editor-container">
        <CardEditor template={selectedTemplate} backgroundImage={backgroundImage} foregroundImage={foregroundImage} />
      </div> */}
      <CardEditor template={selectedTemplate} backgroundImage={backgroundImage} foregroundImage={foregroundImage} />
      </div>
  );
}

export default CustomCards;
