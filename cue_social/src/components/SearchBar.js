import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { ROUTE } from '../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation } from 'react-router-dom';

const colorMapping = {
    'Arts & Culture': '#f792e4',
    'History': '#fbe22b',
    'Oceans & Seas': '#0090fe',
    'Life on Land': '#b3ee4c',
    'Paleontology': '#fc9512',
    'Science': '#1dfdc5',
    'Space': '#a764fd'
};

const optionsAlbums = [
    { value: 'Arts & Culture', label: 'Arts & Culture' },
    { value: 'History', label: 'History' },
    { value: 'Oceans & Seas', label: 'Oceans & Seas' },
    { value: 'Life on Land', label: 'Life on Land' },
    { value: 'Paleontology', label: 'Paleontology' },
    { value: 'Science', label: 'Science' },
    { value: 'Space', label: 'Space' }
];

const optionsCollections = [
    { label: "Amazing Astronauts", value: "SAS", album: "Space" },
    { label: "American Folklore", value: "EAF", album: "History" },
    { label: "Amphibians", value: "LAM", album: "Life on Land" },
    { label: "Ancient Creatures", value: "PAN", album: "Paleontology" },
    { label: "Ancient Egypt", value: "EEG", album: "History" },
    { label: "Ancient Greece", value: "EAG", album: "Arts & Culture" },
    { label: "Around the Reef", value: "ORF", album: "Oceans & Seas" },
    { label: "Arthurian Legends", value: "ACAL", album: "Arts & Culture" },
    { label: "Arts & Culture Mythic Cards", value: "ACMY", album: "Arts & Culture" },
    { label: "Arts & Culture Special Fusions", value: "ACFU", album: "Arts & Culture" },
    { label: "Arts & Culture Specials", value: "ACEV", album: "Arts & Culture" },
    { label: "Awesome Aviation", value: "SAA", album: "Science" },
    { label: "Aztec Mythology", value: "ACAZ", album: "Arts & Culture" },
    { label: "Battle!", value: "EBT", album: "History" },
    { label: "Beautiful Butterflies", value: "LBB", album: "Life on Land" },
    { label: "Birds", value: "LBI", album: "Life on Land" },
    { label: "Brilliant Human Body", value: "SBB", album: "Science" },
    { label: "Bugs", value: "LBU", album: "Life on Land" },
    { label: "Carnivores", value: "PCA", album: "Paleontology" },
    { label: "Cephalopods", value: "OCP", album: "Oceans & Seas" },
    { label: "Chinese Folklore", value: "ECF", album: "History" },
    { label: "Climate Change", value: "SCC", album: "Science" },
    { label: "Colors", value: "ACCO", album: "Arts & Culture" },
    { label: "Constellations", value: "SCO", album: "Space" },
    { label: "Cool Cats", value: "LCA", album: "Life on Land" },
    { label: "Crustaceans", value: "OCE", album: "Oceans & Seas" },
    { label: "Curious Cuisine", value: "ACCU", album: "Arts & Culture" },
    { label: "Cute Cats", value: "LCC", album: "Life on Land" },
    { label: "Debunked!", value: "SCD", album: "Science" },
    { label: "Deep Ocean", value: "ODE", album: "Oceans & Seas" },
    { label: "Dizzying Discoveries", value: "SDD", album: "Science" },
    { label: "Documented", value: "EDO", album: "History" },
    { label: "Dogs", value: "LDG", album: "Life on Land" },
    { label: "Donald R. Prothero's Story of Evolution", value: "SPP", album: "Science" },
    { label: "Egyptian Mythology", value: "ACEM", album: "Arts & Culture" },
    { label: "Espionage", value: "EES", album: "History" },
    { label: "Excellent Elements", value: "SEL", album: "Science" },
    { label: "Exciting Exploration", value: "EEE", album: "History" },
    { label: "Exploring the Stars", value: "SST", album: "Space" },
    { label: "Fabulous Fish", value: "OFI", album: "Oceans & Seas" },
    { label: "Fancy Fashions", value: "ACFF", album: "Arts & Culture" },
    { label: "Fears and Phobias", value: "SFP", album: "Science" },
    { label: "Fearsome Flyers", value: "PFF", album: "Paleontology" },
    { label: "Feisty Fish", value: "OFF", album: "Oceans & Seas" },
    { label: "Festive Traditions", value: "ACFE", album: "Arts & Culture" },
    { label: "Feudal Japan", value: "EJP", album: "History" },
    { label: "Fiction and Fantasy", value: "ACFI", album: "Arts & Culture" },
    { label: "Forces of Nature", value: "SFN", album: "Science" },
    { label: "Forces of the Universe", value: "SFO", album: "Space" },
    { label: "Fruit and Veg", value: "LFV", album: "Life on Land" },
    { label: "Funky Fungi", value: "LFF", album: "Life on Land" },
    { label: "Futurology", value: "SFR", album: "Science" },
    { label: "Going Underground", value: "LUN", album: "Life on Land" },
    { label: "Good Sports", value: "ACSP", album: "Arts & Culture" },
    { label: "Gorgeous Graphic Design", value: "ACGD", album: "Arts & Culture" },
    { label: "Grand Designs", value: "SGD", album: "Science" },
    { label: "Greek Mythology", value: "ACGM", album: "Arts & Culture" },
    { label: "Groundbreakers", value: "PGB", album: "Paleontology" },
    { label: "Herbivores", value: "PHE", album: "Paleontology" },
    { label: "Hidden Gems", value: "SGM", album: "Science" },
    { label: "High Voltage!", value: "SEN", album: "Science" },
    { label: "History Mythic Cards", value: "MYHI", album: "History" },
    { label: "History of Heartbreak", value: "EHH", album: "History" },
    { label: "History of the Internet", value: "SHN", album: "Science" },
    { label: "History Special Fusions", value: "FHI", album: "History" },
    { label: "History Specials", value: "HEV", album: "History" },
    { label: "Hoaxes and Cons", value: "EHC", album: "History" },
    { label: "Horrible Halloween", value: "ACHA", album: "Arts & Culture" },
    { label: "Human Evolution", value: "PHU", album: "Paleontology" },
    { label: "Hybrid Animals", value: "LHY", album: "Life on Land" },
    { label: "Ice Age", value: "PIC", album: "Paleontology" },
    { label: "Ingenious Inventions", value: "SNV", album: "Science" },
    { label: "Innovations of War", value: "SIW", album: "Science" },
    { label: "Instrumental", value: "ACIM", album: "Arts & Culture" },
    { label: "Japanese Folklore", value: "EJF", album: "History" },
    { label: "Land Before Time", value: "PLB", album: "Paleontology" },
    { label: "Legends of the Old West", value: "EOW", album: "History" },
    { label: "Life of Land Mythic Cards", value: "MYLO", album: "Life on Land" },
    { label: "Life on Land Special Fusions", value: "FLL", album: "Life on Land" },
    { label: "Life on Land Specials", value: "LEV", album: "Life on Land" },
    { label: "Little Critters", value: "LCR", album: "Life on Land" },
    { label: "Lost Treasures", value: "ELT", album: "History" },
    { label: "Machines of War", value: "SMW", album: "Science" },
    { label: "Majestic Mountains", value: "SMT", album: "Science" },
    { label: "Mammals", value: "LMA", album: "Life on Land" },
    { label: "Marsupials", value: "LAL", album: "Life on Land" },
    { label: "Marvellous Medicine", value: "SME", album: "Science" },
    { label: "Mega Math", value: "SMA", album: "Science" },
    { label: "Molluscs Worms and Water Bugs", value: "OMM", album: "Oceans & Seas" },
    { label: "Money Money Money", value: "ACMO", album: "Arts & Culture" },
    { label: "Monsters of the Deep", value: "PMC", album: "Paleontology" },
    { label: "Moon in Motion", value: "SLP", album: "Space" },
    { label: "Musically Minded", value: "ACMU", album: "Arts & Culture" },
    { label: "Mythical Creatures", value: "LMC", album: "Life on Land" },
    { label: "Natural Monuments", value: "SMO", album: "Science" },
    { label: "Nebulae", value: "SNB", album: "Space" },
    { label: "Norse Mythology", value: "ACNO", album: "Arts & Culture" },
    { label: "Ocean Mammals", value: "OMA", album: "Oceans & Seas" },
    { label: "Ocean Reptiles", value: "ORE", album: "Oceans & Seas" },
    { label: "Oceans & Seas Special Fusions", value: "FSE", album: "Oceans & Seas" },
    { label: "Oceans & Seas Specials", value: "OEV", album: "Oceans & Seas" },
    { label: "Oceans and Seas Mythic Cards", value: "MYSE", album: "Oceans & Seas" },
    { label: "Omnivores", value: "POM", album: "Paleontology" },
    { label: "On Track!", value: "STL", album: "Science" },
    { label: "Once Upon a Time", value: "ACOU", album: "Arts & Culture" },
    { label: "Paleontology Mythic Cards", value: "MYPA", album: "Paleontology" },
    { label: "Paleontology Special Fusions", value: "FPA", album: "Paleontology" },
    { label: "Paleontology Specials", value: "PEV", album: "Paleontology" },
    { label: "Philosophy", value: "ACPH", album: "Arts & Culture" },
    { label: "Pioneers of Science", value: "SPI", album: "Science" },
    { label: "Planetside", value: "SPL", album: "Space" },
    { label: "Plant Life", value: "LPL", album: "Life on Land" },
    { label: "Playtime", value: "ACPY", album: "Arts & Culture" },
    { label: "Plundering Pirates", value: "EPP", album: "History" },
    { label: "Primates", value: "LPR", album: "Life on Land" },
    { label: "Prominent Painters", value: "ACPP", album: "Arts & Culture" },
    { label: "Radical Rockets", value: "SRR", album: "Space" },
    { label: "Raging Rivers", value: "ORR", album: "Oceans & Seas" },
    { label: "Reptiles", value: "LRE", album: "Life on Land" },
    { label: "Riding the Waves", value: "OWA", album: "Oceans & Seas" },
    { label: "Rites and Rituals", value: "ACRR", album: "Arts & Culture" },
    { label: "Science Mythic Cards", value: "MYSC", album: "Science" },
    { label: "Science Special Fusions", value: "FSC", album: "Science" },
    { label: "Science Specials", value: "CEV", album: "Science" },
    { label: "Sea Birds", value: "OBI", album: "Oceans & Seas" },
    { label: "Secret Societies", value: "ESS", album: "History" },
    { label: "Shake Up The System", value: "ESY", album: "History" },
    { label: "Sharks!", value: "OSH", album: "Oceans & Seas" },
    { label: "Signs of the Zodiac", value: "SZO", album: "Space" },
    { label: "Space Mythic Cards", value: "MYSP", album: "Space" },
    { label: "Space Oddities", value: "SOD", album: "Space" },
    { label: "Space Special Fusions", value: "FSP", album: "Space" },
    { label: "Space Specials", value: "SEV", album: "Space" },
    { label: "Space Technology", value: "STE", album: "Space" },
    { label: "Stage and Screen", value: "SSC", album: "Science" },
    { label: "Sue Black's In The Bones", value: "SIB", album: "Science" },
    { label: "Super Structures", value: "STR", album: "Science" },
    { label: "Tarot", value: "ACTA", album: "Arts & Culture" },
    { label: "The American Revolution", value: "EAM", album: "History" },
    { label: "The Four Horsemen", value: "ACFH", album: "Arts & Culture" },
    { label: "The Legend of Robin Hood", value: "ACRH", album: "Arts & Culture" },
    { label: "The Occult", value: "ACTO", album: "Arts & Culture" },
    { label: "The Original Odyssey", value: "ACOO", album: "Arts & Culture" },
    { label: "The Roman Empire", value: "ERO", album: "History" },
    { label: "The Solar System", value: "SSS", album: "Space" },
    { label: "The Write Stuff", value: "ACWS", album: "Arts & Culture" },
    { label: "Tremendous Trees", value: "LTT", album: "Life on Land" },
    { label: "Turbulent Tudors", value: "ETT", album: "History" },
    { label: "Under the Microscope", value: "SUM", album: "Science" },
    { label: "Unruly Rulers", value: "EMM", album: "History" },
    { label: "Venomous Creatures", value: "LVE", album: "Life on Land" },
    { label: "Vicious Vikings", value: "EVV", album: "History" },
    { label: "Volcanoes", value: "SCV", album: "Science" },
    { label: "Walking the World", value: "ACAM", album: "Arts & Culture" },
    { label: "Watching the Skies", value: "SWA", album: "Space" },
    { label: "Weapons of Choice", value: "EWC", album: "History" },
    { label: "Weird World", value: "EWO", album: "History" },
    { label: "West African Folklore", value: "EWA", album: "History" },
    { label: "Wonders of Construction", value: "EWW", album: "History" },
    { label: "World of Words", value: "ACLG", album: "Arts & Culture" }
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
    const [cards, setCards] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedCards, setSelectedCards] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchType, setSearchType] = useState('decks'); // Default to 'decks'

    const handleDeckSearch = () => {
        const searchParams = {
            albums: selectedAlbums.map(album => album.value),
            collections: selectedCollections.map(collection => collection.value),
            tags: selectedTags.map(tag => tag.value),
            cards: selectedCards.map(card => card.label)
        };
        navigate('/deck-search-results', { state: { searchParams } });
    };


    const renameKey = (obj, oldKey, newKey) => {
        if (oldKey in obj) {
            obj[newKey] = obj[oldKey];
            delete obj[oldKey];
        }
        return obj;
    };

    const fetchCards = useCallback(async () => {
        try {
            const response = await fetch(`${ROUTE}/api/cards/`);
            if (!response.ok) {
                throw new Error('Failed to fetch cards');
            }
            const cardsData = await response.json();
            const renamedData = cardsData.map(item => renameKey(item, 'Name', 'label')).map(item => renameKey(item, 'Code', 'value'));
            setCards(renamedData);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }, []); // Dependency array is empty assuming no external dependencies

    useEffect(() => {
        fetchCards();
    }, [fetchCards]); // useEffect dependency on fetchCards function

    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`${ROUTE}/api/users/getall/`);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const userData = await response.json();
            const renamedData = userData.map(item => renameKey(item, 'username', 'label'));
            renamedData['value'] = renamedData['label'];
            setUsers(userData);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Custom styles for react-select to apply color mapping
    // Custom styles for react-select to apply color mapping
    const customStylesAlbums = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? colorMapping[state.data.value] : provided.backgroundColor,
            color: state.isSelected ? 'white' : 'black',
        }),
        multiValue: (provided, state) => ({
            ...provided,
            backgroundColor: colorMapping[state.data.value],
            color: 'white',
        }),
        multiValueLabel: (provided, state) => ({
            ...provided,
            color: 'white',
        }),
        multiValueRemove: (provided, state) => ({
            ...provided,
            color: 'white',
            ':hover': {
                backgroundColor: 'darken(' + colorMapping[state.data.value] + ', 10%)',
                color: 'white',
            },
        }),
    };

    const customStylesCollections = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? colorMapping[state.data.album] : provided.backgroundColor,
            color: state.isSelected ? 'white' : 'black',
        }),
        multiValue: (provided, state) => ({
            ...provided,
            backgroundColor: colorMapping[state.data.album],
            color: 'white',
        }),
        multiValueLabel: (provided, state) => ({
            ...provided,
            color: 'white',
        }),
        multiValueRemove: (provided, state) => ({
            ...provided,
            color: 'white',
            ':hover': {
                backgroundColor: 'darken(' + colorMapping[state.data.album] + ', 10%)',
                color: 'white',
            },
        }),
    };

    const customStylesCards = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? colorMapping[optionsCollections.find(collection => collection.value === state.data.value.slice(0, -3)).album] : provided.backgroundColor,
            color: state.isSelected ? 'white' : 'black',
        }),
        multiValue: (provided, state) => ({
            ...provided,
            backgroundColor: colorMapping[optionsCollections.find(collection => collection.value === state.data.value.slice(0, -3)).album],
            color: 'white',
        }),
        multiValueLabel: (provided, state) => ({
            ...provided,
            color: 'white',
        }),
        multiValueRemove: (provided, state) => ({
            ...provided,
            color: 'white',
            ':hover': {
                backgroundColor: 'darken(' + colorMapping[optionsCollections.find(collection => collection.value === state.data.value.slice(0, -3)).album] + ', 10%)',
                color: 'white',
            },
        }),
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '200px' }}>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={() => setSearchType('decks')} style={{ marginRight: '10px', padding: '8px' }}>
                    Search for Decks
                </button>
                <button onClick={() => setSearchType('users')} style={{ padding: '8px' }}>
                    Search for Users
                </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {searchType === 'decks' && (
                    <>
                        <Select
                            isMulti
                            options={optionsAlbums}
                            onChange={setSelectedAlbums}
                            placeholder="Search for Albums"
                            styles={customStylesAlbums}
                        />
                        <Select
                            isMulti
                            options={optionsCollections}
                            onChange={setSelectedCollections}
                            placeholder="Search for Collections"
                            styles={customStylesCollections}
                        />
                        <Select
                            isMulti
                            options={optionsTags}
                            onChange={setSelectedTags}
                            placeholder="Search for Tags"
                        />
                        <Select
                            isMulti
                            options={cards}
                            onChange={setSelectedCards}
                            placeholder="Search for Cards"
                            styles={customStylesCards}
                        />
                    </>
                )}

                {searchType === 'users' && (
                    <>
                        <Select
                            options={users} // Replace with user search options
                            onChange={setSelectedUser}
                            placeholder="Search for a User"
                        />
                    </>
                )}
                {searchType === 'decks' && (
                    <>
                        <button onClick={handleDeckSearch} style={{ marginLeft: '5px', padding: '8px' }}>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </>
                )}
                {searchType === 'users' && (
                    <>
                        {selectedUser && (
                            <Link to={`/users/${selectedUser.label}`}>
                                <button style={{ marginLeft: '5px', padding: '8px' }}>
                                    <FontAwesomeIcon icon={faSearch} />
                                </button>
                            </Link>
                        )}
                        {!selectedUser && (
                            <button style={{ marginLeft: '5px', padding: '8px' }} disabled={true}>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        )}
                    </>
                )}
            </div>

        </div>
    );
};

export default SearchBar;
