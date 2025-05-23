import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NavBar from './components/Navbar';
import { ROUTE } from './constants';
import DeckPage from './pages/DeckPage'; // Import the new DeckPage component
import UserPage from './pages/UserPage';
import DeckSearchResults from './pages/DeckSearchResults';
import ResetPassword from './pages/ResetPassword';
import CustomCards from './pages/CustomCardPage';
import CuratedDecks from './pages/CuratedDecks';

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Function to generate a unique identifier
  const generateUserID = () => {
    return 'user_' + Math.random().toString(36).substring(2, 15);
  };

  // Function to get or generate user ID
  const getUserID = useCallback(() => {
    let userID = localStorage.getItem('userID');

    // If the user ID is not found in localStorage, generate a new one
    if (!userID) {
      userID = generateUserID();
      localStorage.setItem('userID', userID);
    }

    return userID;
  }, []);

  // Run this only when the component mounts, or the userID changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // get the userID for the user
        const userID = getUserID();

        // Check if this browser has been used before on the site
        const response = await fetch(ROUTE + '/api/users/userID/' + userID);

        // If the browser has been used before...
        if (response.status === 200) {
          const data = await response.json();
          // Check if the user is registered too. If they are, log them in automatically
          if (data.email_address !== null) {
            const user = await fetch(ROUTE + '/api/users/email/' + data.email_address);
            const user_resp = await user.json();
            setLoggedInUser({ email: user_resp.email_address, username: user_resp.username });

            // If they are registered, remove the google OAuth component when the site loads
            const element = document.getElementById('signInDiv')?.firstChild?.firstChild;
            if (element) {
              element.remove();
            }
          } 
          // If the user is pseudo-registered (via cookies), fetch their data from a different route
          // and make their loggedInUser have a null email address. This could be helpful for deciding
          // when to make "sign in with google" show up
          else if (data.userID !== null) {
            const user = await fetch(ROUTE + '/api/users/username/' + data.userID);
            const user_resp = await user.json();
            setLoggedInUser({ email: null, username: user_resp.username });

            // If they are registered, remove the google OAuth component when the site loads
            // We could maybe remove this for pseudo-users
            const element = document.getElementById('signInDiv')?.firstChild?.firstChild;
            if (element) {
              element.remove();
            }
          }
        } 
        // If the browser has not been used before...
        else {
          setLoggedInUser({ email: null, username: getUserID() });
          // Create a new cookie user for the new browser window user
          await fetch(ROUTE + '/api/users/userID/post/' + userID, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "userID": userID, "email_address": null })
          });

          // Post the cookie user with username of their cookie ID
          await fetch(ROUTE + '/api/users/' + userID, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email_address": null, "username": userID })
          });
        }
      } catch (error) {
        console.error('An error occurred while fetching user data:', error);
      }
    };

    fetchData(); // Call the asynchronous function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openLoginModal = (email) => {
    document.getElementById('sign-in-modal').style.display = 'block';
    document.getElementById('signUpEmail').value = email;
  };

  useEffect(() => {
    // Function to adjust the viewport meta tag
    const isiOS = () => {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    };
    const iOS = isiOS();
    const viewportMeta = document.head.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      if (iOS) {
        viewportMeta.content = "width=device-width, initial-scale=1, maximum-scale=1";
      } else {
        viewportMeta.content = "width=device-width, initial-scale=1";
      }
    }
  }, []);

  // When they log in, remove the google oAuth component when site loads
  const handleLoginSuccess = async (email, username) => {
    const element = document.getElementById('signInDiv')?.firstChild?.firstChild;
    if (element) {
      element.remove();
    }

    const userID = getUserID();
    // Update the loggedInUser state
    await fetch(ROUTE + '/api/users/userID/patch/' + userID, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "userID": userID, "email_address": email })
    });

    setLoggedInUser({ email: email, username: username });

    // const user = await fetch(ROUTE + '/api/users/email/' + email);
    // const user_resp = await user.json();
    // setLoggedInUser({ email: user_resp.email_address, username: user_resp.username });
  };

  // Deal with users logging out
  const handleLogout = async () => {
    console.log('Handling logout');
    console.log(getUserID);
    console.log(loggedInUser);
    // Clear the loggedInUser state
    setLoggedInUser(null);

    const uid = getUserID();
    console.log(uid);
    console.log(loggedInUser);

    // If the user logs out, remove their cookie user from the collection
    await fetch(ROUTE + '/api/users/userID/del/' + uid, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "userID": uid })
    });

    // Remove their userID from local storage
    localStorage.removeItem('userID');

    // Immediately after logout, make a new temp user for the browser user with a newly generated cookie ID
    const userID = getUserID();
    console.log(getUserID());

    await fetch(ROUTE + '/api/users/userID/post/' + userID, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "userID": userID, "email_address": null })
    });

    // Post the temp user with username of their cookie ID
    await fetch(ROUTE + '/api/users/' + userID, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "email_address": null, "username": userID })
    });
  };

  return (
    <div className="App" id="app" style={{ backgroundColor: '#ECE5F0', height: '100vh' }}>
      <BrowserRouter>
        <NavBar openLoginModal={openLoginModal} loggedInUser={loggedInUser} onLoginSuccess={handleLoginSuccess} uid={getUserID} />
        <div className='pages'>
          <Routes>
            <Route
              path="/"
              element={<Home loggedInUser={loggedInUser} onLoginSuccess={handleLoginSuccess} uid={getUserID} openLoginModal={openLoginModal} />}
            />
            <Route
              path='/profile'
              element={<Profile onLogout={handleLogout} loggedInUser={loggedInUser} />}
            />
            <Route
              path="/decks/:deckId" // Add a new route for the DeckPage
              element={<DeckPage loggedInUser={loggedInUser}/>}
            />
            <Route path="/deck-search-results" element={<DeckSearchResults loggedInUser={loggedInUser}/>} />
            <Route path="/users/:userId" element={<UserPage loggedInUser={loggedInUser}/>} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path='/customcards' element={<CustomCards />} />
            <Route path='/innkeepers-decks' element={<CuratedDecks />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;