import { optionsAlbums, optionsCollections, optionsTags, colorMapping } from '../selectedStyles';


const Pill = ({ text, type }) => {

    let options = {};
    let defaultMatch = { label: "", value: "", color: "red" };
    let match = defaultMatch;
    let color = '#FFFFFF';

    if (type === 'Tag') {
        options = optionsTags
        match = options.find(row => row.value === text || row.label === text) || defaultMatch;
        color = match.color
    }
    else if (type === 'Album') {
        options = optionsAlbums
        match = options.find(row => row.value === text || row.label === text) || defaultMatch;
        color = colorMapping[match.label]
    }
    else if (type === 'Collection') {
        options = optionsCollections
        match = options.find(row => row.value === text || row.label === text) || defaultMatch;
        color = colorMapping[match.album]
    }

    return (
        <span
            style={{
                backgroundColor: color,
                color: 'white',
                padding: '4px 8px',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                marginRight: '6px',
                display: 'inline-block',
                marginBottom: '4px',
            }}
        >
            {match.label}
        </span>
    );
};

export default Pill;
