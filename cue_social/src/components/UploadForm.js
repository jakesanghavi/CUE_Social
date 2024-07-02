import React, { useState } from 'react';

const UploadForm = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', file);
        console.log('hello')

        try {
            const response = await fetch('https://jakesanghavi.pythonanywhere.com/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Success:', data);
            // Handle the response data (e.g., display the processed text)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label htmlFor="imageFile">Select an image:</label>
            <input type="file" id="imageFile" name="image" onChange={handleFileChange} />
            <button type="submit">Upload Image</button>
        </form>
    );
};

export default UploadForm;
