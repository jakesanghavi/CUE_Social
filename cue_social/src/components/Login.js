import { useEffect, useRef } from 'react';
import { ROUTE } from '../constants';
import '../component_styles/login_styles.css';

// Login button 
const Login = ({ onLoginSuccess, uid }) => {
  const modalRef = useRef(null);
  const signUpEmail = useRef(null);
  const signUpUsername = useRef(null);
  const route = ROUTE;

  // When the user tries to sign up, make sure that their email/username are valid and unique.
  const checkSignup = async () => {
    // In the future, we should pass email_address from navbar into login. This prevents unforseen tampering.
    const email_address = signUpEmail.current.value;
    const username = signUpUsername.current.value;

    // In the future, we should change this regex so it doesn't coincide with auto-generated cookie usernames
    const usernameRegex = /^[a-zA-Z0-9]*$/;
    if (email_address === '' || !email_address || username === '' || !username || !usernameRegex.test(username) ) {
      if (email_address === '' | !email_address) {
        console.log("Please input your email address.")
      }
      if (username === '' || !username) {
        console.log("Please input your username.")
      }
      if (!usernameRegex.test(username)) {
        console.log("Username may only include letters and numbers.")
      }
      return;
    }


    try {
      // Check if the user's email is already registered
      const response = await fetch(route + '/api/users/email/' + email_address);
      if (response.status === 200) {
        console.log("Email Address already in use!")
        return;
      }

      // Check if the user's username already exists
      const response2 = await fetch(route + '/api/users/username/' + username);
      if (response2.status === 200) {
        console.log("Username already in use!")
        return;
      }

      // If the email and username are new and valid ...
      else {
        // Get the user's userID
        const userID = uid()
        // Add their email to their cookie user
        fetch(route + '/api/users/patchcookie/' + userID, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "email_address": email_address, "username": username, "uid": userID })
        });

        // Log in the user and close the login modal
        onLoginSuccess(email_address, username);
        closeModal();
      }
    }
    catch (error) {
    }
  }

  const closeModal = () => {
    modalRef.current.style.display = 'none';
  };

  // If the user clicks outside of the modal, close the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && event.target === modalRef.current) {
        closeModal();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div id="sign-in-modal" ref={modalRef}>
      <div className="sign-in">
        <span className="close" onClick={closeModal}>&times;</span>
        <div className="form-container">
          <div className="form-inner">
            <div className="signup">
              <div className="field">
                <input type="text" id="signUpEmail" placeholder="Email Address" required ref={signUpEmail} disabled/>
              </div>
              <div className="field">
                <input type="text" id="signUpUsername" placeholder="Username" required ref={signUpUsername} />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="button" style={{ width: "100%" }} value="Sign Up" onClick={checkSignup} />
              </div>
            </div>
          </div>
        </div>
        <div id='signInDiv'>
        </div>
      </div>
    </div>
  );
};

export default Login;