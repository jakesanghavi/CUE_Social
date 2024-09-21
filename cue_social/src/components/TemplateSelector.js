import React from 'react';

const TemplateSelector = ({ templates, onTemplateSelect }) => {

  const handleTemplateSelect = (event) => {
    const selectedIndex = parseInt(event.target.value, 10);
    if (!isNaN(selectedIndex)) {
      onTemplateSelect(templates[selectedIndex]);
    }
  };

  return (
    <div className="template-selector">
      <select onChange={handleTemplateSelect}>
        <option value="" disabled>Select a template</option>
        {templates.map((template, index) => (
          <option key={index} value={index}>
            {template.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplateSelector;
