import React from 'react';
import '../component_styles/cardeditor.css'; // Custom CSS for positioning elements

const CardEditor = ({ template }) => {
  return (
    <div id="editor" className="editor">
      <img id="template" src={template} alt="Card Background" className="template-img" />
      <div className="card-field" id="card-name" contentEditable={true}>Card Name</div>
      <div className="card-field" id="energy-cost" contentEditable={true}>Energy</div>
      <div className="card-field" id="power" contentEditable={true}>Power</div>
      <div className="card-field" id="card-code" contentEditable={true}>CODE</div>
      <div className="card-field" id="ability-name" contentEditable={true}>Ability Name</div>
      <div className="card-field" id="ability-description" contentEditable={true}>Ability Description</div>
    </div>
  );
};

export default CardEditor;
