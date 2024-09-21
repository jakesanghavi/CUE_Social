import React, { useState, useEffect, useCallback } from 'react';

const TemplateSelector = ({ templates, onTemplateSelect }) => {
  // State for selected options
  const [option1, setOption1] = useState('Space');
  const [option2, setOption2] = useState('Basic');
  const [option3, setOption3] = useState('Rare');

  // Handle the selection of the template based on the three options
  const handleTemplateSelect = useCallback(() => {
    const selectedTemplate = templates.find(template =>
      template.album === option1 &&
      template.limited === option2 &&
      template.rarity === option3
    );
    if (selectedTemplate) {
      onTemplateSelect(selectedTemplate);
    }
  }, [option1, option2, option3, onTemplateSelect, templates]);

  useEffect(() => {
    handleTemplateSelect();
  }, [handleTemplateSelect])

  return (
    <div className="template-selector">
          <select value={option1} onChange={(e) => setOption1(e.target.value)}>
            <option value={option1}>{option1}</option>
            {/* Dynamically populate options based on available templates */}
            {Array.from(new Set(templates.map(template => template.album))).map((opt, index) => (
              <option key={index} value={opt}>{opt}</option>
            ))}
          </select>

          <select value={option2} onChange={(e) => setOption2(e.target.value)}>
            <option value={option2}>{option2}</option>
            {Array.from(new Set(templates.map(template => template.limited))).map((opt, index) => (
              <option key={index} value={opt}>{opt}</option>
            ))}
          </select>

          <select value={option3} onChange={(e) => setOption3(e.target.value)}>
            <option value={option3}>{option3}</option>
            {Array.from(new Set(templates.map(template => template.rarity))).map((opt, index) => (
              <option key={index} value={opt}>{opt}</option>
            ))}
          </select>
    </div>
  );
};

export default TemplateSelector;