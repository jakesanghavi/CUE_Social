import { useRef, useState, useEffect, useMemo } from 'react';
import '../component_styles/home.css';
import { deckBuilderNames, cardArtNames, einsteinName } from '../UsefulFunctions'
import { Link } from 'react-router-dom'


const Home = () => {

  const [currentDeckImageIndex, setCurrentDeckImageIndex] = useState(0);
  const [currentArtImageIndex, setCurrentArtImageIndex] = useState(0);
  const shuffledDeckListRef = useRef([]);
  const deckIndexRef = useRef(0);
  const shuffledArtListRef = useRef([]);
  const artIndexRef = useRef(0);

  const handleMouseMove = (e, cardRef) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxDeg = 15;

    const deltaX = x - centerX;
    const deltaY = y - centerY;

    // Left-right tilt (rotateY) stays proportional and same sign
    const rotateY = 1.3 * (deltaX / centerX) * maxDeg;

    const rotateX = 1.3 * (Math.abs(deltaY) / centerY) * maxDeg;

    card.style.transform = `scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };


  const handleMouseLeave = (cardRef) => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = 'scale(1)';
  };

  // Create refs for each card to access DOM elements
  const deckCardRef = useRef(null);
  const artCardRef = useRef(null);
  const wikiCardRef = useRef(null);

  const shuffledDeckList = useMemo(() => {
    const originalDeckList = deckBuilderNames();
    const shuffled = [...originalDeckList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffledDeckListRef.current = shuffled;
    return shuffled;
  }, []);

  const shuffledArtList = useMemo(() => {
    const originalArtList = cardArtNames();
    const shuffled = [...originalArtList];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffledArtListRef.current = shuffled;
    return shuffled;
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Cycle through the shuffled deck list
      setCurrentDeckImageIndex(deckIndexRef.current % shuffledDeckListRef.current.length);
      deckIndexRef.current++;

      // Cycle through the shuffled art list
      setCurrentArtImageIndex(artIndexRef.current % shuffledArtListRef.current.length);
      artIndexRef.current++;
    }, 3000);

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array as shuffled lists are created once


  return (
    <div className="gallery" style={{ perspective: '100vw' }}>
      <Link to="/decks" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div
          className="card"
          ref={deckCardRef}
          onMouseMove={(e) => handleMouseMove(e, deckCardRef)}
          onMouseLeave={() => handleMouseLeave(deckCardRef)}
        >
          <img
            id="shuffleDeckImage"
            src={shuffledDeckList[currentDeckImageIndex]}
            alt="Community Decks"
            style={{ transition: 'opacity 1s ease-in-out', opacity: 1 }}
          />
          <div className="label">Community Decks</div>
        </div>
      </Link>
      <Link to="/customcards" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div
          className="card"
          ref={artCardRef}
          onMouseMove={(e) => handleMouseMove(e, artCardRef)}
          onMouseLeave={() => handleMouseLeave(artCardRef)}
        >
          <img
            id="shuffleArtImage"
            src={shuffledArtList[currentArtImageIndex]}
            alt="Custom Card Tool"
            style={{ transition: 'opacity 1s ease-in-out', opacity: 1 }}
          />
          <div className="label">Custom Card Tool</div>
        </div>
      </Link>
      <a href="https://cards-the-universe-and-everything.fandom.com/wiki/Cards,_the_Universe_and_Everything_Wiki" target="_blank" style={{ textDecoration: 'none', color: 'inherit' }} rel="noopener noreferrer">
        <div
          className="card"
          ref={wikiCardRef}
          onMouseMove={(e) => handleMouseMove(e, wikiCardRef)}
          onMouseLeave={() => handleMouseLeave(wikiCardRef)}
        >
          <img
            // src="https://cdn-virttrade-assets-eucalyptus.cloud.virttrade.com/filekey/28/9c/34e7b200d5d1b2ca0f939b63cf2c662b04a6"
            src={einsteinName()}
            alt="Wiki Fandom"
          />
          <div className="label">Wiki Fandom</div>
        </div>
      </a>
    </div>
  );
}

export default Home;
