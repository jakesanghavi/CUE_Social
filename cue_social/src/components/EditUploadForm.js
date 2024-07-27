import React, { useState } from 'react';
import { ROUTE } from '../constants';
import Select from 'react-select';
import { optionsAlbums, optionsCollections, optionsTags, customStylesAlbums, customStylesCollections, customStylesTags } from '../selectedStyles';
import '../component_styles/uploadform.css';

const EditUploadForm = ({ deckId, loggedInUser, file, cardData, oldDescription, oldTitle, oldSelectedAlbums, oldSelectedCollections, oldSelectedTags, closeModal }) => {

    const transformArray = (list) => {
        return list.map(l1 => ({
            value: l1,
            label: l1
        }));
    };

    const transformCollections = (list) => {
        return list.map(l1 => {
            // Find the entry in h1 where the value matches l1
            const matchingEntry = optionsCollections.find(entry => entry.value === l1);

            // Return the transformed object with value and label
            return matchingEntry
        });
    };

    const transformTags = (list) => {
        return list.map(l1 => {
            // Find the entry in h1 where the value matches l1
            const matchingEntry = optionsTags.find(entry => entry.value === l1);

            // Return the transformed object with value and label
            return matchingEntry
        });
    };

    const formDataToJSON = (formData) => {
        const jsonObject = {};
      
        // Iterate over FormData entries
        for (let [key, value] of formData.entries()) {
          // If the value is an array, convert it to JSON
          if (value instanceof FileList) {
            jsonObject[key] = Array.from(value).map(file => file.name); // or file objects
          } else {
            jsonObject[key] = value;
          }
        }
      
        return jsonObject;
      };

    const [description, setDescription] = useState(oldDescription);
    const [title, setTitle] = useState(oldTitle);
    const submitted = true;
    const [selectedAlbums, setSelectedAlbums] = useState(transformArray(oldSelectedAlbums));
    const [selectedCollections, setSelectedCollections] = useState(transformCollections(oldSelectedCollections));
    const [selectedTags, setSelectedTags] = useState(transformTags(oldSelectedTags));
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const validateForm = () => {
        const errors = {};
        if (!title) errors.title = 'Title is required';
        if (cardData === null || cardData.length < 5) errors.cardData = 'At least 5 cards must be detected';
        if (
            selectedAlbums.length === 0 &&
            selectedCollections.length === 0 &&
            selectedTags.length === 0
        ) {
            errors.selection = 'Must choose at least one album, collection, or deck tag.';
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleTextFormSubmit = async (event) => {
        setSubmitting(true);
        event.preventDefault();

        const valid = validateForm();
        if (!valid) {
            return
        }

        // Add your logic for handling the text form submission
        const formData = new FormData();
        formData.append('title', title);
        formData.append('albums', JSON.stringify(selectedAlbums.map(album => album.value)));
        formData.append('collections', JSON.stringify(selectedCollections.map(collection => collection.value)));
        formData.append('tags', JSON.stringify(selectedTags.map(tag => tag.value)));
        formData.append('description', description);
        formData.append('user', loggedInUser.username);
        formData.append('email', loggedInUser.email)

        const formDataJson = formDataToJSON(formData)

        try {
            const response = await fetch(`${ROUTE}/api/decks/editdeck/${deckId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify(formDataJson)
            });
            if (!response.ok) {
                throw new Error('Failed to edit deck');
            }
            await response.json();
            setSubmitting(false);
            closeModal();
            alert("Deck edited successfully.")
        } catch (error) {
            console.error('Error edited deck:', error);
        }
    };

    return (
        <form encType="multipart/form-data">
            {submitted && (
                <>
                    <div style={{ display: 'flex', marginTop: '10px' }}>
                        <div style={{ flex: 1, marginRight: '10px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                            {file && (
                                <img
                                    src={file}
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
                                {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
                            </div>
                            <div>
                                <Select
                                    isMulti
                                    options={optionsAlbums}
                                    value={selectedAlbums}
                                    onChange={setSelectedAlbums}
                                    placeholder="Search for Albums"
                                    styles={{ ...customStylesAlbums, container: (provided) => ({ ...provided, marginBottom: '10px' }) }}
                                />
                                <Select
                                    isMulti
                                    options={optionsCollections}
                                    value={selectedCollections}
                                    onChange={setSelectedCollections}
                                    placeholder="Search for Collections"
                                    styles={{ ...customStylesCollections, container: (provided) => ({ ...provided, marginBottom: '10px' }) }}
                                />
                                <Select
                                    isMulti
                                    options={optionsTags}
                                    value={selectedTags}
                                    onChange={setSelectedTags}
                                    placeholder="Search for Tags"
                                    styles={{ ...customStylesTags, container: (provided) => ({ ...provided, marginBottom: '10px' }) }}
                                />
                                {errors.selection && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.selection}</div>}
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
                                    {errors.cardData && cardData.length === 0 && <span style={{ color: 'red' }}>{errors.cardData}</span>}
                                    {cardData && cardData.length > 0 && (
                                        <div className="data">
                                            <label htmlFor="receivedCardData">Cards Detected:</label>
                                            <textarea
                                                id="receivedCardData"
                                                value={cardData.map(card => card).join('\n')}
                                                readOnly
                                                style={{ width: '100%', height: '200px' }}
                                            />
                                            {errors.cardData && <span style={{ color: 'red' }}>{errors.cardData}</span>}
                                        </div>
                                    )}
                                    {(cardData.length === 0) && (
                                        <div className="data">
                                            <label htmlFor="receivedCardData">Cards Detected:</label>
                                            <textarea
                                                id="receivedCardData"
                                                value="No cards detected. Please try another image."
                                                readOnly
                                                style={{ width: '100%', height: '200px' }}
                                            />
                                            {errors.cardData && <span style={{ color: 'red' }}>{errors.cardData}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                <button onClick={handleTextFormSubmit} style={{ marginTop: '10px' }}>Submit</button>
                                {submitting && !errors.cardData && !errors.selection && !errors.title && <div className="loading">Submitting...</div>}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </form>
    );
};

export default EditUploadForm;