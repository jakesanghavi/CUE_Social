import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import '../component_styles/navbar_styles.css'
import { ROUTE } from '../constants';
import { useEffect, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";

// Navbar is available on every page. Contains Google OAuth, game info, and menu icon
const NavBar = ({ openLoginModal, openHelpModal, loggedInUser, onLoginSuccess, uid }) => {

  // Set the route to the API
  const route = ROUTE;

  // Opens the modal for a user to log in.
  // Currently this only opens for new users to sign up
  const loginModal = useCallback(email => {
    openLoginModal(email);
  }, [openLoginModal]);

  // Opens the help/game info modal
  const helpModal = () => {
    openHelpModal();
  }

  // Function to disable the player buttons when the player opens the menu
  const disableButtons = () => {
    const buttons = document.getElementById('player-controls');
    if (buttons.style.pointerEvents === 'none') {
      buttons.style.pointerEvents = 'auto';
    }
    else {
      buttons.style.pointerEvents = 'none';
    }
  }

  // Called the user tries to sign in with google
  const handleLoginResponse = useCallback(async (response) => {
    try {
      // Get the user's google credentials. We only use their email
      var userToken = jwtDecode(response.credential);
      var email = userToken.email;

      // Check if the user is already registered
      const userCheckResponse = await fetch(route + '/api/users/email/' + email);

      // If the user doesn't exist yet, prompt them to create an account
      if (userCheckResponse.status !== 200) {
        loginModal(email);
      } 
      // If the user does exist, this means that they have an account but haven't logged in
      // on this browser before. So, get their current userID (cookie ID) with the uid() function
      // That was passed from App.js. Then, get their user info from the API using their email.
      // Finally, replace the cookie user email from null to their email, and log in the user.
      else {
        const userID = uid()
        const userDataResponse = await fetch(route + '/api/users/email/' + email);
        const respJson = await userDataResponse.json();
        fetch(route + '/api/users/patchcookie/' + userID, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "email_address": respJson.email_address, "username": respJson.username, "uid": userID })
        });

        // After fixing the database, log in the user.
        onLoginSuccess(respJson.email_address, respJson.username);
      }
    } catch (error) {
    }
  }, [loginModal, route, onLoginSuccess, uid]);

  // If there is no logged in user (as passed from App.js), show the sign-in with Google
  useEffect(() => {
    /* global google */
    if (loggedInUser === null || loggedInUser.email === null) {
      google.accounts.id.initialize({
        client_id: '974013126679-kauk60isd77u3857mln4n64gehunanmj.apps.googleusercontent.com',
        callback: handleLoginResponse
      });

      google.accounts.id.renderButton(
          document.getElementById('googleSignInButton'),
          { theme: 'outline', size: 'large', ux_mode: 'popup'}
      )
    }
  }, [handleLoginResponse, loggedInUser]);

  return (
    <header>
      <div className='container'>
        <div className="hamburger-holder">
          <input type="checkbox" className="openSidebarMenu" id="openSidebarMenu" onClick={disableButtons} />
          <label htmlFor="openSidebarMenu" className="sidebarIconToggle">
            <FontAwesomeIcon icon={faBars} />
          </label>
          <div id="sidebarMenu" style={{ zIndex: 1000000 }}>
            <ul className="sidebarMenuInner">
              <li><a href="/">Daily Mode</a></li>
              <li><a href="/endless">Endless Mode</a><br /></li>
              <li>Race Mode<br />(Coming Soon!)</li>
            </ul>
          </div>
        </div>
        <div className="home-name-holder">
          <Link to="/">
            <h1>
              Musicle
            </h1>
          </Link>
        </div>
        <div className="blank-space">
        </div>

        <div id="help-button" className="headerText" onClick={helpModal}>
          <h2><FontAwesomeIcon icon={faQuestionCircle} /></h2>
        </div>
        <div id="signInDiv">
          {loggedInUser === null || loggedInUser.email === null ? (
            // Render Google Sign-In button when loggedInUser is null
            // Add any additional styling or classes as needed
            <div id="googleSignInButton"></div>
          ) : (
            // Render "Profile" button when loggedInUser is not null
            <div>
              <Link to="/profile">
                <h1>
                  Profile
                </h1>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar