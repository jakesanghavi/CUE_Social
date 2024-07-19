import React, { useState, useEffect } from 'react';
import { ROUTE } from '../constants';
import Select from 'react-select';
import { optionsAlbums, optionsCollections, optionsTags, customStylesAlbums, customStylesCollections, customStylesTags } from '../selectedStyles';

const UploadForm = ({ loggedInUser }) => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [receivedData, setReceivedData] = useState(null);
    const [deckCode, setDeckCode] = useState(null);
    const [cardData, setCardData] = useState([]);
    const [submitted, setSubmitted] = useState(false);
    const [selectedAlbums, setSelectedAlbums] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

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
            const response = await fetch(ROUTE + '/api/uploadimage/', {
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

    const handleTextFormSubmit = async (event) => {
        event.preventDefault();

        if (!title) {
            alert('Title is required');
            return;
        }
        if (cardData.length < 5) {
            alert('Detected cards must contain at least 5 items');
            return;
        }
        if (
            selectedAlbums.length === 0 &&
            selectedCollections.length === 0 &&
            selectedTags.length === 0
        ) {
            alert('Must choose at least one album, collection, or deck tag.');
            return;
        }

        // Add your logic for handling the text form submission
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('albums', JSON.stringify(selectedAlbums.map(album => album.value)));
        formData.append('collections', JSON.stringify(selectedCollections.map(collection => collection.value)));
        formData.append('tags', JSON.stringify(selectedTags.map(tag => tag.value)));
        formData.append('description', description);
        const cardNames = cardData.map(card => card.Name); // Assuming cardData is an array of objects with a 'Name' field
        formData.append('cards', JSON.stringify(cardNames));
        formData.append('deckcode', deckCode);
        formData.append('user', loggedInUser.username);
        formData.append('email', loggedInUser.email)
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await fetch(ROUTE + '/api/decks/post/', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            console.log('Received data:', data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (receivedData && receivedData.length > 0) {
                receivedData.sort((a, b) => b.length - a.length);
                const dummyArray = [];
                for (let i = 0; i < receivedData.length; i++) {
                    const lowercaseCard = receivedData[i].toLowerCase();
                    const encodedCard = lowercaseCard.replace(/ /g, '%20');
                    const url = `${ROUTE}/api/cards/cardname/${encodedCard}`;
                    // console.log(url);

                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            const result = await response.json();
                            // console.log(result);
                            if (result.Code) {
                                dummyArray.push(result);
                            }
                        } else {
                            // console.error(`Error fetching data for card: ${receivedData[i]}`);
                        }
                    } catch (error) {
                        // console.error(`Error fetching data for card: ${receivedData[i]}`, error);
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
                <label htmlFor="imageFile" style={{ cursor: 'pointer' }}>
                    {file ? (
                        <img src={URL.createObjectURL(file)} alt="Uploaded preview" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} />
                    ) : (
                        <div style={{ border: '1px dashed #ccc', padding: '20px', textAlign: 'center' }}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="64"
                                height="64"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 5v14M19 12l-7 7-7-7" />
                            </svg>
                            <br />
                            Click to upload
                        </div>
                    )}
                    <input type="file" id="imageFile" name="image" onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                </label>
            )}
            {file && !submitted && (
                <>
                    {/* <img src={URL.createObjectURL(file)} alt="Uploaded preview" style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '10px' }} /> */}
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
                                    style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
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
                            <Select
                                isMulti
                                options={optionsAlbums}
                                value={selectedAlbums}
                                onChange={setSelectedAlbums}
                                placeholder="Search for Albums"
                                styles={customStylesAlbums}
                            />
                            <Select
                                isMulti
                                options={optionsCollections}
                                value={selectedCollections}
                                onChange={setSelectedCollections}
                                placeholder="Search for Collections"
                                styles={customStylesCollections}
                            />
                            <Select
                                isMulti
                                options={optionsTags}
                                value={selectedTags}
                                onChange={setSelectedTags}
                                placeholder="Search for Tags"
                                styles={customStylesTags}
                            />
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
                                            <label htmlFor="receivedCardData">Cards Detected:</label>
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
                            <div style={({ flex: 1 })}>
                                <button onClick={handleTextFormSubmit} style={{ marginTop: '10px' }}>Submit</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </form>
    );
};

export default UploadForm;
