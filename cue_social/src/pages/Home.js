import UploadForm from '../components/UploadForm';
import Login from '../components/Login';
import { useEffect, useRef, useState } from 'react';


function Home() {
  const [deckCode, setDeckCode] = useState(null);
  const [cards, setCards] = useState(null);
  const [fullCards, setFullCards] = useState([]);

  const handleData = (data) => {
    const cards = data.cards
    cards.sort((a, b) => b.length - a.length);
    setCards(cards)
    setDeckCode(data.deck_code)
  };

  useEffect(() => {
    const fetchData = async () => {
      if (cards && cards.length > 0) {
        const dummyArray = [];
        for (let i = 0; i < cards.length; i++) {
          console.log(i)
          if (dummyArray.length >= 18) {
            break; // Terminate loop if dummyArray has 18 or more items
          }

          try {
            console.log(i)
            const response = await fetch(`http://localhost:3008/api/cards/cardname/${cards[i]}`); // Replace with your actual API endpoint
            if (response.ok) {
              const result = await response.json();
              // Assuming your API returns an object with 'result' field
              if (result.result) {
                dummyArray.push(result.result);
              }
            } else {
              console.error(`Error fetching data for card: ${cards[i]}`);
            }
          } catch (error) {
            console.error(`Error fetching data for card: ${cards[i]}`, error);
          }
          console.log(dummyArray)
        }
      };
    }

    fetchData();

  }, [cards]);

  return (
    <div className="Home" id="home">
      <Login />
      <UploadForm onDataReceived={handleData} />
    </div>
  );
}

export default Home;
