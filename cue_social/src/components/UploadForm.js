import React, { useState, useEffect } from 'react';

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [album, setAlbum] = useState('');
    const [loading, setLoading] = useState(false);
    const [receivedData, setReceivedData] = useState(null);
    const [deckCode, setDeckCode] = useState(null);
    const [cardData, setCardData] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleAlbumChange = (event) => {
        setAlbum(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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

    useEffect(() => {
        console.log('useEffect triggered with receivedData:', receivedData);

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
                    <input type="file" id="imageFile" name="image" onChange={handleFileChange} />
                    <button type="submit">Upload Image</button>
                </>
            )}
            {submitted && (
                <>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleDescriptionChange}
                    />

                    <label htmlFor="album">Album:</label>
                    <select id="album" name="album" value={album} onChange={handleAlbumChange}>
                        <option value="">Select an album</option>
                        <option value="album1">Album 1</option>
                        <option value="album2">Album 2</option>
                        <option value="album3">Album 3</option>
                    </select>

                    {loading && <div className="loading">Loading...</div>}

                    {cardData.length > 0 && (
                        <div className="data">
                            <h3>Received Card Data:</h3>
                            <pre>{JSON.stringify(cardData, null, 2)}</pre>
                        </div>
                    )}
                </>
            )}
        </form>
    );
};

export default UploadForm;