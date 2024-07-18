import React, { useState, useEffect } from 'react';
import { ROUTE } from '../constants';

const UploadForm = ({ loggedInUser }) => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [albums, setAlbums] = useState([]);
    const [collections, setCollections] = useState([]);
    const [tags, setTags] = useState([]);
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

    const handleAlbumsChange = (event) => {
        const selectedAlbum = event.target.value;
        if (selectedAlbum && !albums.includes(selectedAlbum) && albums.length < 8) {
            setAlbums([...albums, selectedAlbum]);
        }
    };

    const removeAlbum = (album) => {
        setAlbums(albums.filter(a => a !== album));
    };

    const handleCollectionsChange = (event) => {
        const selectedCollection = event.target.value;
        if (selectedCollection && !collections.includes(selectedCollection) && collections.length < 6) {
            setCollections([...collections, selectedCollection]);
        }
    };

    const removeCollection = (album) => {
        setCollections(collections.filter(a => a !== album));
    };

    const handleTagsChange = (event) => {
        const selectedTag = event.target.value;
        if (selectedTag && !tags.includes(selectedTag) && tags.length < 6) {
            setTags([...tags, selectedTag]);
        }
    };

    const removeTag = (album) => {
        setTags(tags.filter(a => a !== album));
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

    const handleTextFormSubmit = async (event) => {
        event.preventDefault();
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Albums:', albums);
        // Add your logic for handling the text form submission
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', title);
        formData.append('albums', JSON.stringify(albums));
        formData.append('collections', JSON.stringify(collections));
        formData.append('tags', JSON.stringify(tags));
        formData.append('description', description);
        const cardNames = cardData.map(card => card.Name); // Assuming cardData is an array of objects with a 'Name' field
        formData.append('cards', JSON.stringify(cardNames));
        formData.append('deckcode', deckCode);
        formData.append('user', loggedInUser.username);
        formData.append('email', loggedInUser.email)
        console.log(formData);

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
                    console.log(url);

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
                    console.log(dummyArray)
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
                            <div>
                                <div>
                                    <label htmlFor="albums">Albums:</label>
                                    <select id="albums" name="albums" onChange={handleAlbumsChange} style={{ width: '100%' }}>
                                        <option value="">Select an album</option>
                                        <option value="album1">Album 1</option>
                                        <option value="album2">Album 2</option>
                                        <option value="album3">Album 3</option>
                                    </select>
                                </div>
                                <div>
                                    {albums.map((album, index) => (
                                        <div key={index} style={{ display: 'inline-block', margin: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                            {album}
                                            <button onClick={() => removeAlbum(album)} style={{ marginLeft: '5px' }}>x</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div>
                                    <label htmlFor="collections">Collections:</label>
                                    <select id="collections" name="collections" onChange={handleCollectionsChange} style={{ width: '100%' }}>
                                        <option value="">Select a collection</option>
                                        <option value="collection1">Collection 1</option>
                                        <option value="collection2">Collection 2</option>
                                        <option value="collection3">Collection 3</option>
                                    </select>
                                </div>
                                <div>
                                    {collections.map((collection, index) => (
                                        <div key={index} style={{ display: 'inline-block', margin: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                            {collection}
                                            <button onClick={() => removeCollection(collection)} style={{ marginLeft: '5px' }}>x</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div style={{ marginTop: '10px' }}>
                                    <label htmlFor="tags">Tags:</label>
                                    <select id="tags" name="tags" onChange={handleTagsChange} style={{ width: '100%' }}>
                                        <option value="">Select a tag</option>
                                        <option value="tag1">Tag 1</option>
                                        <option value="tag2">Tag 2</option>
                                        <option value="tag3">Tag 3</option>
                                    </select>
                                </div>
                                <div>
                                    {tags.map((tag, index) => (
                                        <div key={index} style={{ display: 'inline-block', margin: '5px', padding: '5px', border: '1px solid #ccc', borderRadius: '5px' }}>
                                            {tag}
                                            <button onClick={() => removeTag(tag)} style={{ marginLeft: '5px' }}>x</button>
                                        </div>
                                    ))}
                                </div>
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
