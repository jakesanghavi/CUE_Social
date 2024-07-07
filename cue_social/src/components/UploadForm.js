import React, { useState, useEffect } from 'react';

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [album, setAlbum] = useState('');
    const [tags, setTags] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [receivedData, setReceivedData] = useState(null);
    const [deckCode, setDeckCode] = useState(null);
    const [cardData, setCardData] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
        } else {
            alert('Please upload a valid image file.');
        }
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleAlbumChange = (event) => {
        setAlbum(event.target.value);
    };

    const handleTagChange = (event) => {
        setTags(event.target.value);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            alert('Please select an image file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true);
        setReceivedData(null);
        setSubmitted(true);

        try {
            const response = await fetch('https://jakesanghavi.pythonanywhere.com/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Received data:', data);
            setReceivedData(data.cards);
            setDeckCode(data.deck_code);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTextFormSubmit = (event) => {
        event.preventDefault();
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Album:', album);
        // Add your logic for handling the text form submission
    };

    useEffect(() => {
        const fetchData = async () => {
            if (receivedData && receivedData.length > 0) {
                receivedData.sort((a, b) => b.length - a.length);
                const dummyArray = [];
                for (let i = 0; i < receivedData.length; i++) {
                    const lowercaseCard = receivedData[i].toLowerCase();
                    const encodedCard = lowercaseCard.replace(/ /g, '%20');
                    const url = `http://localhost:3008/api/cards/cardname/${encodedCard}`;
                    console.log(url);

                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            const result = await response.json();
                            console.log(result);
                            if (result.Code) {
                                dummyArray.push(result);
                            }
                        } else {
                            console.error(`Error fetching data for card: ${receivedData[i]}`);
                        }
                    } catch (error) {
                        console.error(`Error fetching data for card: ${receivedData[i]}`, error);
                    }

                    if (dummyArray.length >= 18) {
                        break; // Terminate loop if dummyArray has 18 or more items
                    }
                }
                setCardData(dummyArray);
                console.log('Final dummyArray:', dummyArray);
            }
        };

        fetchData();
    }, [receivedData]);

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            {!submitted && (
                <>
                    <label htmlFor="imageFile">Select an image:</label>
                    <input type="file" id="imageFile" name="image" onChange={handleFileChange} accept="image/*" />
                    {file && <img src={URL.createObjectURL(file)} alt="Uploaded preview" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} />}
                    <button type="submit">Upload Image</button>
                </>
            )}
            {submitted && (
                <>
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <div style={{ flex: 1, marginRight: '10px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                            {file && (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Uploaded preview"
                                    style={{ maxWidth: '100%', maxHeight: '40%', objectFit: 'contain' }}
                                />
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div>
                                <label htmlFor="title">Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    onChange={handleTitleChange}
                                    style={{ marginBottom: '10px', width: '100%' }}
                                />
                            </div>
                            <div>
                                <label htmlFor="album">Album:</label>
                                <select id="album" name="album" value={album} onChange={handleAlbumChange} style={{ width: '100%' }}>
                                    <option value="">Select an album</option>
                                    <option value="album1">Album 1</option>
                                    <option value="album2">Album 2</option>
                                    <option value="album3">Album 3</option>
                                </select>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <label htmlFor="tags">Tags:</label>
                                <select id="tags" name="tags" value={tags} onChange={handleTagChange} style={{ width: '100%' }}>
                                    <option value="">Select a tag</option>
                                    <option value="tag1">Tag 1</option>
                                    <option value="tag2">Tag 2</option>
                                    <option value="tag3">Tag 3</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', marginTop: '20px' }}>
                                <div style={{ flex: 1, marginRight: '10px' }}>
                                    <label htmlFor="description">Description:</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        style={{ width: '100%', height: '200px' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    {loading && <div className="loading">Loading...</div>}
                                    {cardData.length > 0 && (
                                        <div className="data">
                                            <label htmlFor="receivedCardData">Received Card Data:</label>
                                            <textarea
                                                id="receivedCardData"
                                                value={cardData.map(card => card.Name).join('\n')}
                                                readOnly
                                                style={{ width: '100%', height: '200px' }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>


                    <button onClick={handleTextFormSubmit} style={{ marginTop: '10px' }}>Submit</button>

                </>
            )}
        </form>
    );
};

export default UploadForm;
