import { Link } from 'react-router-dom'
import '../component_styles/navbar_styles.css'
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

// Navbar is available on every page. Contains Google OAuth, game info, and menu icon
const NavBar = ({ loggedInUser }) => {
  const handleShowLogin = () => setShowLogin(true);
const [isDarkMode, setIsDarkMode] = useState(true);

  const [sliderPosition, setSliderPosition] = useState(1);
  const sliderTrackRef = useRef(null);
  const sliderHandleRef = useRef(null);
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
    setSliderPosition(isDarkMode ? 0 : 1);
  };

  const handleSliderClick = () => {
    toggleMode();
  };

  useEffect(() => {
    document.body.className = isDarkMode ? 'dark' : '';
  }, [isDarkMode]);

  const getHandlePosition = () => {
    if (sliderTrackRef.current && sliderHandleRef.current) {
      const trackWidth = sliderTrackRef.current.offsetWidth;
      const handleWidth = sliderHandleRef.current.offsetWidth;
      const maxTranslation = trackWidth - handleWidth - 4; // Subtract 4px for the initial left: 2px and potential right margin

      return sliderPosition === 1 ? maxTranslation : 0;
    }
    return 0;
  };

  const setShowLogin = (bool) => {
    if (bool) {
      document.getElementById('sign-in-modal').style.display = 'block';
    }
    else {
      document.getElementById('sign-in-modal').style.display = 'none';
    }
  };

  return (
    <header>
      <div className='container'>
        <Link to="/" className='logo-name-holder'>
          <img id='logo' src='../favicon.png' alt='Cue Tavern Logo' width="100" height="100" />
          <h1 className='logoText'>Cue Tavern</h1>
        </Link>

        <div className="nav-actions">
          <div className="toggle-slider-container">
            <span className="slider-label">
              <FontAwesomeIcon
                icon={faSun}
                className={`sun-icon ${!isDarkMode ? 'light-mode' : ''}`}
              />
            </span>
            <div
              className={`slider-track ${isDarkMode ? 'on' : ''}`}
              onClick={handleSliderClick}
              ref={sliderTrackRef} // Attach the ref to the track
            >
              <div
                className="slider-handle"
                style={{ transform: `translateX(${getHandlePosition()}px)` }}
                ref={sliderHandleRef} // Attach the ref to the handle
              />
            </div>
            <span className="slider-label">
              <FontAwesomeIcon
                icon={faMoon}
                className={`moon-icon ${isDarkMode ? 'dark-mode' : ''}`}
              />
            </span>
          </div>
        </div>

        <div id="signIn">
          {loggedInUser === null || loggedInUser.email === null ? (
            // Render Google Sign-In button when loggedInUser is null
            // Add any additional styling or classes as needed
            <h2 onClick={handleShowLogin}>
              Sign In
            </h2>
          ) : (
            // Render "Profile" button when loggedInUser is not null

            <a href="/profile" >
              <h2 onClick={() => console.log('Link clicked')} >
                My Profile
              </h2>
            </a>

          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar;