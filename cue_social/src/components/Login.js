import { useEffect, useRef, useState, useCallback } from 'react';
import { ROUTE } from '../constants';
import '../component_styles/login_styles.css';
import { jwtDecode } from "jwt-decode";

// Login button 
const Login = ({ onLoginSuccess, uid, openLoginModal }) => {
  const modalRef = useRef(null);
  const [logForm, setLogForm] = useState({ username: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const loginForm = document.querySelector("form.login");

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLogForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const signUpSelect = () => {
    loginForm.style.marginLeft = "-50%";
  };

  const loginSelect = () => {
    loginForm.style.marginLeft = "0%";
  };
  const route = ROUTE;

  const loginModal = useCallback(email => {
    openLoginModal(email);
  }, [openLoginModal]);

  const checkLogin = async (event) => {
    event.preventDefault();
    const { username, password } = logForm

    if (username === '' || !username || password === '' || !password) {
      if (username === '' || !username) {
        alert("Please input your email address.")
      }
      if (password === '' || !password) {
        alert("Please input your password.")
      }
      return;
    }

    try {
      const response = await fetch(route + '/api/users/username/' + username);
      if (response.status === 400) {
        alert("User does not exist!")
      }
      else {
        // dev
        const resp = await fetch(`${route}/api/users/passwordlogin/?username=${username}&password=${password}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        if (resp.ok) {
          const respJson = await resp.json();

          // If the response is {0}, handle it as an incorrect login
          if (respJson.hasOwnProperty('0')) {
            alert("Password is incorrect or user not found.");
          } else {
            onLoginSuccess(respJson.email_address, respJson.username);
            // Optionally, you can handle the user object here
            closeModal();
          }
        }
      }
    }
    catch (error) {
      alert(error);
    }
  }

  const checkSignup = async (event) => {
    event.preventDefault();
    const { email, username, password, confirmPassword } = signUpForm

    const emailRegex = /^[a-zA-Z0-9!#$%&*+\-/=?^_{|}~]+@[a-zA-Z0-9!#$%&*+\-/=?^_{|}~]+\.[a-zA-Z0-9!#$%&*+\-/=?^_{|}~]{2,}$/;
    if (email === '' || !email || password === '' || !password || confirmPassword === '' ||
      !confirmPassword || username === '' || !username || !emailRegex.test(email)) {
      if (email === '' | !email) {
        alert("Please input your email address.")
      }
      if (username === '' || !username) {
        alert("Please input your username.")
      }
      if (password === '' || !password) {
        alert("Please input your password.")
      }
      if (confirmPassword === '' || !confirmPassword) {
        alert("Please confirm password.")
      }
      if (!emailRegex.test(email)) {
        alert("Please input a valid email address.")
      }
      return;
    }


    try {
      const response = await fetch(route + '/api/users/email/' + email);
      if (response.status === 200) {
        alert("Email Address already in use!")
        return;
      }

      const response2 = await fetch(route + '/api/users/username/' + username);
      if (response2.status === 200) {
        alert("Username already in use!")
        return;
      }

      else {
        if (password !== confirmPassword) {
          alert("Passwords must match!")
          return;
        }

        if (password.length < 8) {
          alert("Password must contain at least 8 characters!")
          return;
        }

        const passwordRegex = /^[a-zA-Z0-9!#$^*]+$/;
        if (!passwordRegex.test(password)) {
          alert("Password can only contain letters, numbers, !, #, $, ^, and *.")
          return;
        }
        // dev
        const newUser = await fetch(route + '/api/users/' + email, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "email_address": email, "username": username, "password": password })
        });
        const newUserJSON = await newUser.json();
        onLoginSuccess(newUserJSON.email_address, newUserJSON.username);
        closeModal();
      }
    }
    catch (error) {
      alert(error);
    }
  }

  const closeModal = () => {
    modalRef.current.style.display = 'none';
  };

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
        await fetch(route + '/api/users/patchcookie/' + userID, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "email_address": respJson.email_address, "username": respJson.username, "uid": userID })
        });

        // After fixing the database, log in the user.
        onLoginSuccess(respJson.email_address, respJson.username);
        closeModal();
      }
    } catch (error) {
    }
  }, [loginModal, route, onLoginSuccess, uid]);

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "974013126679-kauk60isd77u3857mln4n64gehunanmj.apps.googleusercontent.com",
      callback: handleLoginResponse
    });

    google.accounts.id.renderButton(
      document.getElementById('signInDiv'),
      { theme: 'outline', size: 'large', ux_mode: 'popup' }
    )
  }, [handleLoginResponse]);


  return (
    <div id="sign-in-modal" ref={modalRef}>
      <div className="sign-in">
        <span className="close" onClick={closeModal}>&times;</span>
        <div className="form-container">
          <div className="slide-controls">
            <input type="radio" name="slide" id="login" defaultChecked />
            <input type="radio" name="slide" id="signup" />
            <label htmlFor="login" className="slide login" onClick={loginSelect}>Login</label>
            <label htmlFor="signup" className="slide signup" onClick={signUpSelect}>Register</label>
            <div className="slider-tab"></div>
          </div>
          <div id='signInDiv'  style={{ justifyContent: 'center', paddingBottom: '15px' }}></div>
          <div style={{ textAlign: 'center', fontSize: '20px' }}>OR</div>
          <div className="form-inner">
            <form className="login" onSubmit={checkLogin}>
              <div className="field">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={logForm.username}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={logForm.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>
              {/* <div className="pass-link">
                <a href="#">Forgot password?</a>
              </div> */}
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Login" />
              </div>
            </form>
            <form className="signup" onSubmit={checkSignup}>
              <div className="field">
                <input
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={signUpForm.email}
                  onChange={handleSignUpChange}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={signUpForm.username}
                  onChange={handleSignUpChange}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={signUpForm.password}
                  onChange={handleSignUpChange}
                  required
                />
              </div>
              <div className="field">
                <input
                  type="password"
                  placeholder="Confirm password"
                  name="confirmPassword"
                  value={signUpForm.confirmPassword}
                  onChange={handleSignUpChange}
                  required
                />
              </div>
              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Signup" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;