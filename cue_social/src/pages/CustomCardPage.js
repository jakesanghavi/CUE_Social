import React, { useState } from 'react';
import CardEditor from '../components/CardEditor';
import TemplateSelector from '../components/TemplateSelector';
import { customCardBorders, customCardIcons } from '../UsefulFunctions';

const templates = customCardBorders();
const icons = customCardIcons()

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="App">
      <h1>Custom Card Editor</h1>
      <TemplateSelector templates={templates} onSelect={handleTemplateSelect} />
      <CardEditor template={selectedTemplate} />
    </div>
  );
}

export default App;
