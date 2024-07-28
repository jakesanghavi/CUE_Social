import { Link } from 'react-router-dom'
import '../component_styles/navbar_styles.css'
import { useEffect } from 'react';

// Navbar is available on every page. Contains Google OAuth, game info, and menu icon
const NavBar = ({ loggedInUser }) => {
  console.log(loggedInUser)

  const handleShowLogin = () => setShowLogin(true);

  const setShowLogin = (bool) => {
    if (bool) {
      document.getElementById('sign-in-modal').style.display = 'block';
    }
    else {
      document.getElementById('sign-in-modal').style.display = 'none';
    }
  };

  useEffect(() => {
  }, [loggedInUser])

  return (
    <header>
      <div className='container'>
        <div className="home-name-holder">
          <Link to="/">
            <h1>
              Cue Tavern
            </h1>
          </Link>
        </div>
        {/* <div className="blank-space">
        </div> */}


        <div id="signIn">
          {loggedInUser === null || loggedInUser.email === null ? (
            // Render Google Sign-In button when loggedInUser is null
            // Add any additional styling or classes as needed
            <h1 onClick={handleShowLogin}>
              Sign In
            </h1>
          ) : (
            // Render "Profile" button when loggedInUser is not null
           
              <a href="/profile" >
                <h1 onClick={() => console.log('Link clicked')} >
                My Profile
                </h1>
              </a>

          )}
        </div>
      </div>
    </header>
  )
}

export default NavBar