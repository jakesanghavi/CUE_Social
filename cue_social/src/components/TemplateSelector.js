import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import '../component_styles/templateselector.css'

const TemplateSelector = ({ templates, onTemplateSelect, saveAsImage }) => {
  const [option1, setOption1] = useState('Space');
  const [option2, setOption2] = useState('Basic');
  const [option3, setOption3] = useState('Rare');

  const handleTemplateSelect = useCallback(() => {
    const selectedTemplate = templates.find(template =>
      template.album === option1 &&
      template.limited === option2 &&
      template.rarity === option3
    );
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
      if (selectedTemplate.rarity.includes('Ultra')) {
        const imgtag = document.getElementById('collectionIcon')
        imgtag.src = "";
      }
    }
  }, [option1, option2, option3, onTemplateSelect, templates]);

  useEffect(() => {
    handleTemplateSelect();
  }, [handleTemplateSelect]);

  return (
    <div className="template-selector">
      <select
        value={option1}
        onChange={(e) => setOption1(e.target.value)}
      >
        <option value={option1}>{option1}</option>
        {Array.from(new Set(templates.map(template => template.album))).map((opt, index) => (
          <option key={index} value={opt}>{opt}</option>
        ))}
      </select>

      <select
        value={option2}
        onChange={(e) => setOption2(e.target.value)}
      >
        <option value={option2}>{option2}</option>
        {Array.from(new Set(templates.map(template => template.limited))).map((opt, index) => (
          <option key={index} value={opt}>{opt}</option>
        ))}
      </select>

      <select
        value={option3}
        onChange={(e) => setOption3(e.target.value)}
      >
        <option value={option3}>{option3}</option>
        {Array.from(new Set(templates.map(template => template.rarity))).map((opt, index) => (
          <option key={index} value={opt}>{opt}</option>
        ))}
      </select>

      <button
        onClick={saveAsImage}
      >
        <FontAwesomeIcon icon={faDownload} /> Save Image
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap', // Allows the content to wrap on smaller screens
    padding: '20px',
    maxWidth: '100%', // Ensures the container doesn’t overflow
    boxSizing: 'border-box',
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    flex: '1 1 200px', // Flex-grow and flex-shrink to make the selects responsive
    minWidth: '150px',
    height: '40px',
    boxSizing: 'border-box',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
    maxWidth: '100%', // Prevents the select from being wider than the screen
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    height: '40px',
    fontSize: '16px',
    boxSizing: 'border-box',
    flex: '1 1 200px', // Button is also responsive and flexible
    maxWidth: '100%', // Prevents the button from being too wide
    transition: 'background-color 0.3s ease',
  },
  // Optional hover states for modern styling
  buttonHover: {
    backgroundColor: '#0056b3', // Darker blue on hover
  },
  selectFocus: {
    borderColor: '#007BFF', // Highlight the border on focus
  },
};

styles.button[':hover'] = {
  backgroundColor: 'green', // Darker blue on hover
};

styles.select[':hover'] = {
  borderColor: '#007BFF', // Highlight the border on hover
};

styles.select[':focus'] = {
  borderColor: '#007BFF', // Highlight the border on focus
};


export default TemplateSelector;
