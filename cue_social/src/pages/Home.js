import UploadForm from '../components/UploadForm';
import Login from '../components/Login';
import '../component_styles/home.css';
import { useEffect, useRef, useState } from 'react';


const Home = ({ loggedInUser, onLoginSuccess, uid }) => {
  const [deckCode, setDeckCode] = useState(null);
  const [cards, setCards] = useState(null);

  const handleData = (data) => {
    const cards = data.cards
    cards.sort((a, b) => b.length - a.length);
    setCards(cards)
    setDeckCode(data.deck_code)
  };

  useEffect(() => {
    const fetchData = async () => {
      if (cards && cards.length > 0) {
        console.log('Cards:', cards);

        const dummyArray = [];
        for (let i = 0; i < cards.length; i++) {
          const lowercaseCard = cards[i].toLowerCase();
          const encodedCard = lowercaseCard.replace(/ /g, '%20');
          const url = `http://localhost:3008/api/cards/cardname/${encodedCard}`;
          console.log(url);

          try {
            const response = await fetch(url);
            if (response.ok) {
              const result = await response.json();
              console.log(result)
              if (result.Code) {
                dummyArray.push(result);
              }
            } else {
              console.error(`Error fetching data for card: ${cards[i]}`);
            }
          } catch (error) {
            console.error(`Error fetching data for card: ${cards[i]}`, error);
          }

          console.log('Current dummyArray:', dummyArray);
          if (dummyArray.length >= 18) {
            break; // Terminate loop if dummyArray has 18 or more items
          }
        }
      }
    };

    fetchData();
  }, [cards]);

  return (
    <div className="Home" id="home">
      <Login onLoginSuccess={onLoginSuccess} uid={uid} />
      <UploadForm onDataReceived={handleData} />
    </div>
  );
}

export default Home;
