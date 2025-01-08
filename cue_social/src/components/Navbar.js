// import { Link } from 'react-router-dom'
// import '../component_styles/navbar_styles.css'
// import { useEffect } from 'react';

// // Navbar is available on every page. Contains Google OAuth, game info, and menu icon
// const NavBar = ({ loggedInUser }) => {
//   const handleShowLogin = () => setShowLogin(true);

//   const setShowLogin = (bool) => {
//     if (bool) {
//       document.getElementById('sign-in-modal').style.display = 'block';
//     }
//     else {
//       document.getElementById('sign-in-modal').style.display = 'none';
//     }
//   };

//   useEffect(() => {
//   }, [loggedInUser])

//   return (
//     <header>
//       <div className='container'>
//         {/* <div className='logo-holder'>
//           <img id='logo' src='../favicon.png'/>
//         </div>
//         <div className="home-name-holder">
//           <Link to="/">
//             <h1>
//               Cue Tavern
//             </h1>
//           </Link>
//         </div> */}
//         <Link to="/">
//           <img id='logo' src='../favicon.png' alt='Cue Tavern Logo' />
//           {/* <h1>Cue Tavern</h1> */}
//         </Link>
//         <Link to="/">
//           <h1>Decks</h1>
//         </Link>

//         <Link to="/customcards">
//           <h1>Custom Cards</h1>
//         </Link>

//         <div id="signIn">
//           {loggedInUser === null || loggedInUser.email === null ? (
//             // Render Google Sign-In button when loggedInUser is null
//             // Add any additional styling or classes as needed
//             <h1 onClick={handleShowLogin}>
//               Sign In
//             </h1>
//           ) : (
//             // Render "Profile" button when loggedInUser is not null

//             <a href="/profile" >
//               <h1 onClick={() => console.log('Link clicked')} >
//                 My Profile
//               </h1>
//             </a>

//           )}
//         </div>
//       </div>
//     </header>
//   )
// }

// export default NavBar

import { Link } from 'react-router-dom'
import '../component_styles/navbar_styles.css'
import { useEffect } from 'react';

// Navbar is available on every page. Contains Google OAuth, game info, and menu icon
const NavBar = ({ loggedInUser }) => {
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
        {/* <div className='logo-holder'>
          <img id='logo' src='../favicon.png'/>
        </div>
        <div className="home-name-holder">
          <Link to="/">
            <h1>
              Cue Tavern
            </h1>
          </Link>
        </div> */}
        <Link to="/" className='logo-name-holder'>
          <img id='logo' src='../favicon.png' alt='Cue Tavern Logo' />
          <h1 className='logoText'>Cue Tavern</h1>
        </Link>
        {/* <div className="blank-space">
        </div> */}


        <Link to="/" className="menuOption">
          <h2>Decks</h2>
        </Link>

        <Link to="/customcards" className="menuOption">
          <h2>Custom Cards</h2>
        </Link>

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