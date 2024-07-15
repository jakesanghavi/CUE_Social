import React, { useState } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

const optionsAlbums = [
    { value: 'album1', label: 'Album 1' },
    { value: 'album2', label: 'Album 2' },
    { value: 'album3', label: 'Album 3' }
];

const optionsCollections = [
    { value: 'collection1', label: 'Collection 1' },
    { value: 'collection2', label: 'Collection 2' },
    { value: 'collection3', label: 'Collection 3' }
];

const optionsTags = [
    { value: 'tag1', label: 'Tag 1' },
    { value: 'tag2', label: 'Tag 2' },
    { value: 'tag3', label: 'Tag 3' }
];

const SearchBar = () => {
    const navigate = useNavigate();
    const [selectedAlbums, setSelectedAlbums] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const handleSearch = () => {
        const searchParams = {
            albums: selectedAlbums.map(album => album.value),
            collections: selectedCollections.map(collection => collection.value),
            tags: selectedTags.map(tag => tag.value)
        };
        navigate('/search-results', { state: { searchParams } });
    };

    return (
        <div>
            <Select
                isMulti
                options={optionsAlbums}
                onChange={setSelectedAlbums}
                placeholder="Select Albums"
            />
            <Select
                isMulti
                options={optionsCollections}
                onChange={setSelectedCollections}
                placeholder="Select Collections"
            />
            <Select
                isMulti
                options={optionsTags}
                onChange={setSelectedTags}
                placeholder="Select Tags"
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;
