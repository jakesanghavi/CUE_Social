import React, { useState } from 'react';
import { ROUTE } from '../constants';

const UploadImage = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  console.log(file)

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
    } else {
        alert('Please upload a valid image file.');
    }
};

  const uploadFile = async (event) => {
    event.preventDefault()
    if (!file) {
      setError('Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    console.log(file)
    const name = "masdas"
    formData.append('image', file);
    formData.append('thing', name);
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch(ROUTE + '/api/uploadimage/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Error uploading image. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Upload Image for OCR</h1>
      <input type="file" onChange={handleFileChange} accept="image/*" />
      <button onClick={uploadFile} style={{ display: 'block', margin: '10px auto' }}>Upload</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div className="result">
        <h2>Extracted Data:</h2>
      </div>
    </div>
  );
};

export default UploadImage;
