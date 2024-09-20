import React from 'react';

const TemplateSelector = ({ icons, templates, onTemplateSelect, onIconSelect }) => {

  console.log(templates)

  const handleTemplateSelect = (event) => {
    const selectedIndex = parseInt(event.target.value, 10);
    if (!isNaN(selectedIndex)) {
      onTemplateSelect(templates[selectedIndex]);
    }
  };

  const handleIconSelect = (event) => {
    const selectedIndex = parseInt(event.target.value, 10);
    if (!isNaN(selectedIndex)) {
      onIconSelect(icons[selectedIndex]);
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
      <select onChange={handleIconSelect}>
        <option value="" disabled>Select an icon</option>
        {icons.map((icon, index) => (
          <option key={index} value={index}>
            {icon.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TemplateSelector;
