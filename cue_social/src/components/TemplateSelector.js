import React from 'react';

const TemplateSelector = ({ templates, onSelect }) => {
  return (
    <div className="template-selector">
      {templates.map((template, index) => (
        <button key={index} onClick={() => onSelect(template)}>
          Template {index + 1}
        </button>
      ))}
    </div>
  );
};

export default TemplateSelector;
