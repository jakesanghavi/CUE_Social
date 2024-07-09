import UploadForm from '../components/UploadForm';
import Login from '../components/Login';
import '../component_styles/home.css';


const Home = ({ loggedInUser, onLoginSuccess, uid }) => {

  return (
    <div className="Home" id="home">
      <Login onLoginSuccess={onLoginSuccess} uid={uid} />
      <UploadForm loggedInUser={loggedInUser} />
    </div>
  );
}

export default Home;
