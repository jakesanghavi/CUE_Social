import React from 'react';
import '../component_styles/cardeditor.css'; // Custom CSS for positioning elements

const CardEditor = ({ template, backgroundImage, foregroundImage }) => {

  return (
    <div
      id="editor"
      className="editor"
    >
      <div id='template-holder' style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
        lineHeight: '0'
      }}
      >
        <img id="template" src={template.url} alt="Card Background" className="template-img" />
        {foregroundImage && (
          <img
            src={foregroundImage.url}
            alt="Foreground"
            style={{
              position: 'absolute',
              top: '62%', // Adjust Y position (30% from top)
              left: '50%', // Start positioning from the center horizontally
              transform: 'translateX(-50%)', // Shift image back by half its width for centering
              curser: 'move',
              // width: '20%', // Adjust width of the foreground image
              height: '12%'
            }}
          />
        )}
      </div>
      <div className="card-field" id="card-name" contentEditable={true}>Card Name</div>
      <div className="card-field" id="energy-cost" contentEditable={true}>?</div>
      <div className="card-field" id="power" contentEditable={true}>?</div>
      <div className="card-field" id="card-code" contentEditable={true}>CODE</div>
      <div className="card-field" id="ability-name" contentEditable={true}>Ability Name</div>
      <div className="card-field" id="ability-description" contentEditable={true}>Ability Description</div>
    </div>
  );
};

export default CardEditor;
