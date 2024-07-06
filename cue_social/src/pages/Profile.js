import { useEffect, useState } from 'react'

// The profile page for the user
const Profile = ({ onLogout, loggedInUser }) => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    if(loggedInUser) {
      setUser(loggedInUser);
    }
  }, [loggedInUser]);

  // Make the user also navigate back to the home page when they log out
  const backHome = () => {
    window.location.href = '/';
  }

  return (
    <div>
      <div>
        {user ? user.username : null}
      </div>
      <div>
        Stats
      </div>
      <button onClick={() => {onLogout(); backHome();}}>
        Sign out
      </button>
    </div>
  );
};




export default Profile;