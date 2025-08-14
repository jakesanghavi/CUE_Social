import { useRef, useState, useEffect, useMemo } from 'react';
import '../component_styles/home.css';
import { deckBuilderNames, cardArtNames, einsteinName } from '../UsefulFunctions';
import { Link } from 'react-router-dom';

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

    const rotateY = 1.3 * (deltaX / centerX) * maxDeg;

    const rotateX = 1.3 * (Math.abs(deltaY) / centerY) * maxDeg;

    card.style.transform = `scale(1.1) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (cardRef) => {
    const card = cardRef.current;
    if (!card) return;

    card.style.transform = 'scale(1)';
  };

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
      setCurrentDeckImageIndex(deckIndexRef.current % shuffledDeckListRef.current.length);
      deckIndexRef.current++;

      setCurrentArtImageIndex(artIndexRef.current % shuffledArtListRef.current.length);
      artIndexRef.current++;
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="gallery" style={{ perspective: '100vw' }}>
      <Link to="/decks" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div
          className="card"
          ref={deckCardRef}
          onMouseMove={(e) => handleMouseMove(e, deckCardRef)}
          onMouseLeave={() => handleMouseLeave(deckCardRef)}
        >
          {/* Explicitly setting width and height to reserve space */}
          <img
            id="shuffleDeckImage"
            src={shuffledDeckList[currentDeckImageIndex]}
            alt="Community Decks"
            width="300"
            height="400"
            style={{ transition: 'opacity 1s ease-in-out', opacity: 1 }}
            fetchpriority='high'
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
          {/* Explicitly setting width and height to reserve space */}
          <img
            id="shuffleArtImage"
            src={shuffledArtList[currentArtImageIndex]}
            alt="Custom Card Tool"
            width="300"
            height="400"
            style={{ transition: 'opacity 1s ease-in-out', opacity: 1 }}
            fetchpriority='high'
          />
          <div className="label">Custom Card Tool</div>
        </div>
      </Link>
      <a
        href="https://cards-the-universe-and-everything.fandom.com/wiki/Cards,_the_Universe_and_Everything_Wiki"
        target="_blank"
        style={{ textDecoration: 'none', color: 'inherit' }}
        rel="noopener noreferrer"
      >
        <div
          className="card"
          ref={wikiCardRef}
          onMouseMove={(e) => handleMouseMove(e, wikiCardRef)}
          onMouseLeave={() => handleMouseLeave(wikiCardRef)}
        >
          {/* Explicitly setting width and height to reserve space */}
          <img
            src={einsteinName()}
            alt="Wiki Fandom"
            width="300"
            height="400"
          />
          <div className="label">Wiki Fandom</div>
        </div>
      </a>
    </div>
  );
};

export default Home;