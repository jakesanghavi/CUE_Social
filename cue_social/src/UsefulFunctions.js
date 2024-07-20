import { ROUTE } from './constants';

export const upvoteCheck = async (deck, loggedInUser, setOne, ...setDecks) => {
    if (!loggedInUser || !loggedInUser.email) {
      return
    }
  
    const updatedDecks = (decks) => {
      return decks.map((d) => {
        if (d._id === deck._id) {
          const isUpvoted = d.voters.includes(loggedInUser.username);
          const newVoters = isUpvoted
            ? d.voters.filter((voter) => voter !== loggedInUser.username)
            : [...d.voters, loggedInUser.username];
          const newScore = isUpvoted ? d.score - 1 : d.score + 1;
          return { ...d, voters: newVoters, score: newScore };
        }
        return d;
      });
    };

    const updateDeck = (deck) => {
        const isUpvoted = deck.voters.includes(loggedInUser.username);
        const newVoters = isUpvoted
          ? deck.voters.filter((voter) => voter !== loggedInUser.username)
          : [...deck.voters, loggedInUser.username];
        const newScore = isUpvoted ? deck.score - 1 : deck.score + 1;
        
        return { ...deck, voters: newVoters, score: newScore };
      };
  
    try {
      const response = await fetch(`${ROUTE}/api/decks/onedeck/${deck._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch decks');
      }
      const data = await response.json();
      let voters = data.voters;
  
      if (voters.includes(loggedInUser.username)) {
        voters = voters.filter(voter => voter !== loggedInUser.username);
  
        try {
          const change = 'decrease'
          const response = await fetch(`${ROUTE}/api/decks/onedeck/${deck._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ voters, change })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch decks');
          }
        } catch (error) {
          console.error('Error fetching decks:', error);
        }
      } else {
        voters.push(loggedInUser.username)
        try {
          const change = 'increase'
          const response = await fetch(`${ROUTE}/api/decks/onedeck/${deck._id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ voters, change })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch decks');
          }
        } catch (error) {
          console.error('Error fetching decks:', error);
        }
      }
      
      if (!setOne) {
        setDecks.forEach(setDeck => setDeck((prev) => updatedDecks(prev)));
      }
      else {
        setDecks.forEach(setDeck => setDeck((prev) => updateDeck(prev)));
      }
      
  
    } catch (error) {
      console.error('Error fetching decks:', error);
    }
  }
  